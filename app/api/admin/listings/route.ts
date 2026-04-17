import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check admin access
async function checkAdminAccess() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Non authentifié', status: 401 };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        return { error: 'Accès refusé', status: 403 };
    }

    return { adminId: session.user.id };
}

// GET - List all listings with filters and pagination
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const status = searchParams.get('status') || '';
        const moderationStatus = searchParams.get('moderationStatus') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }

        if (category) {
            where.category = category;
        }

        if (status) {
            where.status = status;
        }

        if (moderationStatus) {
            where.moderationStatus = moderationStatus;
        }

        const [listings, total, stats] = await Promise.all([
            prisma.listing.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    category: true,
                    status: true,
                    moderationStatus: true,
                    moderatedAt: true,
                    rejectionReason: true,
                    createdAt: true,
                    thumbnailUrl: true,  // ✅ AJOUTÉ
                    videoUrl: true,      // ✅ AJOUTÉ
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.listing.count({ where }),
            prisma.listing.groupBy({
                by: ['moderationStatus'],
                _count: true
            })
        ]);

        return NextResponse.json({
            listings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            stats: {
                pending: stats.find(s => s.moderationStatus === 'pending')?._count || 0,
                approved: stats.find(s => s.moderationStatus === 'approved')?._count || 0,
                rejected: stats.find(s => s.moderationStatus === 'rejected')?._count || 0
            }
        });

    } catch (error) {
        console.error('Error fetching listings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

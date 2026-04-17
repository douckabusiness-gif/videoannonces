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

// GET - List all subscriptions
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') || '';
        const plan = searchParams.get('plan') || '';

        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (plan) {
            where.plan = plan;
        }

        const [subscriptions, total, stats] = await Promise.all([
            prisma.subscription.findMany({
                where,
                include: {
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
            prisma.subscription.count({ where }),
            prisma.subscription.groupBy({
                by: ['status', 'plan'],
                _count: true
            })
        ]);

        return NextResponse.json({
            subscriptions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            stats: {
                byStatus: stats.reduce((acc, s) => {
                    if (!acc[s.status]) acc[s.status] = {};
                    acc[s.status][s.plan] = s._count;
                    return acc;
                }, {} as any)
            }
        });

    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

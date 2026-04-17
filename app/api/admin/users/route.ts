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

// Helper function to log admin actions
async function logAdminAction(adminId: string, action: string, targetType?: string, targetId?: string, details?: any, request?: NextRequest) {
    try {
        await prisma.adminLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                details,
                ipAddress: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown'
            }
        });
    } catch (error) {
        console.error('Error logging admin action:', error);
    }
}

// GET - List all users with filters and pagination
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
        const role = searchParams.get('role') || '';
        const premium = searchParams.get('premium') || '';
        const suspended = searchParams.get('suspended') || '';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
            ];
        }

        if (role) {
            where.role = role;
        }

        if (premium === 'true') {
            where.premium = true;
        } else if (premium === 'false') {
            where.premium = false;
        }

        if (suspended === 'true') {
            where.suspended = true;
        } else if (suspended === 'false') {
            where.suspended = false;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    role: true,
                    premium: true,
                    premiumTier: true,
                    suspended: true,
                    suspendedUntil: true,
                    suspendedReason: true,
                    verified: true,
                    isVendor: true,
                    createdAt: true,
                    _count: {
                        select: {
                            listings: true,
                            messages: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

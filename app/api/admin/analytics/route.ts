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

// GET - Get advanced analytics
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '30'; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // User analytics
        const [
            totalUsers,
            newUsers,
            activeUsers,
            premiumUsers,
            suspendedUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            prisma.user.count({
                where: {
                    listings: {
                        some: {
                            createdAt: { gte: startDate }
                        }
                    }
                }
            }),
            prisma.user.count({ where: { premium: true } }),
            prisma.user.count({ where: { suspended: true } })
        ]);

        // Listing analytics
        const [
            totalListings,
            activeListings,
            newListings,
            listingsByCategory
        ] = await Promise.all([
            prisma.listing.count(),
            prisma.listing.count({ where: { status: 'active' } }),
            prisma.listing.count({
                where: {
                    createdAt: { gte: startDate }
                }
            }),
            prisma.listing.groupBy({
                by: ['category'],
                _count: true,
                orderBy: {
                    _count: {
                        category: 'desc'
                    }
                }
            })
        ]);

        // Financial analytics
        const [
            totalRevenue,
            revenueThisPeriod,
            transactionCount
        ] = await Promise.all([
            prisma.payment.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true }
            }),
            prisma.payment.aggregate({
                where: {
                    status: 'completed',
                    createdAt: { gte: startDate }
                },
                _sum: { amount: true }
            }),
            prisma.payment.count({
                where: {
                    createdAt: { gte: startDate }
                }
            })
        ]);

        // Daily activity (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            return date;
        }).reverse();

        const dailyActivity = await Promise.all(
            last7Days.map(async (date) => {
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);

                const [users, listings, payments] = await Promise.all([
                    prisma.user.count({
                        where: {
                            createdAt: {
                                gte: date,
                                lt: nextDay
                            }
                        }
                    }),
                    prisma.listing.count({
                        where: {
                            createdAt: {
                                gte: date,
                                lt: nextDay
                            }
                        }
                    }),
                    prisma.payment.aggregate({
                        where: {
                            status: 'completed',
                            createdAt: {
                                gte: date,
                                lt: nextDay
                            }
                        },
                        _sum: { amount: true }
                    })
                ]);

                return {
                    date: date.toISOString().split('T')[0],
                    users,
                    listings,
                    revenue: payments._sum.amount || 0
                };
            })
        );

        return NextResponse.json({
            users: {
                total: totalUsers,
                new: newUsers,
                active: activeUsers,
                premium: premiumUsers,
                suspended: suspendedUsers
            },
            listings: {
                total: totalListings,
                active: activeListings,
                new: newListings,
                byCategory: listingsByCategory.map(c => ({
                    category: c.category,
                    count: c._count
                }))
            },
            financial: {
                totalRevenue: totalRevenue._sum.amount || 0,
                revenueThisPeriod: revenueThisPeriod._sum.amount || 0,
                transactionCount
            },
            dailyActivity
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

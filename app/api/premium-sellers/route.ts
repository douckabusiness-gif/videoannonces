import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        // Récupérer les utilisateurs premium (avec subdomain)
        const sellers = await prisma.user.findMany({
            where: {
                subdomain: {
                    not: null
                },
                isVendor: true
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                subdomain: true,
                rating: true,
                _count: {
                    select: {
                        listings: {
                            where: {
                                status: 'active'
                            }
                        }
                    }
                }
            },
            orderBy: {
                rating: 'desc'
            },
            take: limit
        });

        // Calculer les vues totales pour chaque vendeur
        const sellersWithStats = await Promise.all(
            sellers.map(async (seller) => {
                const totalViews = await prisma.listing.aggregate({
                    where: {
                        userId: seller.id,
                        status: 'active'
                    },
                    _sum: {
                        views: true
                    }
                });

                return {
                    id: seller.id,
                    name: seller.name,
                    avatar: seller.avatar,
                    subdomain: seller.subdomain,
                    rating: seller.rating,
                    totalListings: seller._count.listings,
                    totalViews: totalViews._sum.views || 0
                };
            })
        );

        return NextResponse.json({
            sellers: sellersWithStats
        });

    } catch (error) {
        console.error('Error fetching premium sellers:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

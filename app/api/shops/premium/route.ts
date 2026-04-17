import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les boutiques premium
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        // Récupérer les utilisateurs premium avec leurs statistiques
        const premiumShops = await prisma.user.findMany({
            where: {
                premium: true,
                suspended: false,
            },
            select: {
                id: true,
                name: true,
                avatar: true,
                subdomain: true,
                bio: true,
                rating: true,
                totalRatings: true,
                totalSales: true,
                verified: true,
                bannerUrl: true,
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
            orderBy: [
                { rating: 'desc' },
                { totalSales: 'desc' }
            ],
            take: limit,
        });

        return NextResponse.json({
            shops: premiumShops,
            total: premiumShops.length
        });

    } catch (error) {
        console.error('Erreur récupération boutiques premium:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

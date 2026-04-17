import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
    params: Promise<{
        subdomain: string;
    }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { subdomain } = await params;

        // Trouver l'utilisateur par sous-domaine
        const user = await prisma.user.findUnique({
            where: { subdomain },
            select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                rating: true,
                totalRatings: true,
                totalSales: true,
                shopTheme: true,
                bannerUrl: true,
                socialLinks: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Boutique non trouvée' },
                { status: 404 }
            );
        }

        // Récupérer les annonces actives du vendeur
        const listings = await prisma.listing.findMany({
            where: {
                userId: user.id,
                status: 'active',
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        // Statistiques
        const stats = {
            totalListings: listings.length,
            totalSales: user.totalSales,
            memberSince: user.createdAt,
            rating: user.rating,
            totalRatings: user.totalRatings,
        };

        return NextResponse.json({
            shop: {
                subdomain,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                rating: user.rating,
                totalRatings: user.totalRatings,
                shopTheme: user.shopTheme,
                bannerUrl: user.bannerUrl,
                socialLinks: user.socialLinks,
            },
            listings,
            stats,
        });
    } catch (error) {
        console.error('Erreur récupération boutique:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

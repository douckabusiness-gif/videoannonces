import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        // Récupérer les produits (listings) des utilisateurs premium
        const products = await prisma.listing.findMany({
            where: {
                status: 'active',
                moderationStatus: 'approved',
                user: {
                    isPremium: true, // Boutiques premium uniquement
                },
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        subdomain: true,
                        verified: true,
                        isPremium: true,
                    },
                },
            },
        });

        // Transformer les données pour correspondre à l'interface Product
        const formattedProducts = products.map((listing) => ({
            id: listing.id,
            name: listing.title,
            description: listing.description,
            price: listing.price,
            images: [listing.thumbnailUrl], // Utiliser le thumbnail comme image principale
            category: listing.category,
            stock: 10, // Valeur par défaut (à adapter selon votre logique)
            shop: {
                id: listing.user.id,
                name: listing.user.name,
                subdomain: listing.user.subdomain,
                verified: listing.user.verified,
            },
        }));

        return NextResponse.json({
            success: true,
            products: formattedProducts,
            total: formattedProducts.length,
        });
    } catch (error) {
        console.error('Erreur récupération produits premium:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur lors de la récupération des produits premium',
            },
            { status: 500 }
        );
    }
}

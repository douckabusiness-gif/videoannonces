import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const userId = session.user.id;

        // Récupérer les statistiques réelles
        const [
            totalListings,
            activeListings,
            listingsWithViews,
            totalConversations,
            respondedConversations
        ] = await Promise.all([
            // Total d'annonces
            prisma.listing.count({
                where: { userId }
            }),

            // Annonces actives
            prisma.listing.count({
                where: {
                    userId,
                    status: 'active'
                }
            }),

            // Somme des vues
            prisma.listing.aggregate({
                where: { userId },
                _sum: {
                    views: true
                }
            }),

            // Total conversations (en tant que vendeur)
            prisma.conversation.count({
                where: {
                    sellerId: userId
                }
            }),

            // Conversations avec au moins une réponse du vendeur
            prisma.conversation.count({
                where: {
                    sellerId: userId,
                    messages: {
                        some: {
                            senderId: userId
                        }
                    }
                }
            })
        ]);

        const totalViews = listingsWithViews._sum.views || 0;

        // Calculer le taux de réponse
        const responseRate = totalConversations > 0
            ? Math.round((respondedConversations / totalConversations) * 100)
            : 0;

        return NextResponse.json({
            totalListings,
            activeListings,
            totalViews,
            totalMessages: totalConversations,
            responseRate
        });

    } catch (error) {
        console.error('Erreur récupération stats dashboard:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

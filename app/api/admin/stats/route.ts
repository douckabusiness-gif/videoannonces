import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Vérification Admin (Temporaire: on vérifie juste si connecté pour l'instant, à sécuriser avec le rôle)
        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // TODO: Vérifier session.user.role === 'ADMIN' une fois le type mis à jour dans NextAuth

        const [
            totalUsers,
            totalListings,
            activeListings,
            totalSales,
            premiumUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.listing.count(),
            prisma.listing.count({ where: { status: 'active' } }),
            prisma.transaction.aggregate({ _sum: { amount: true } }),
            prisma.user.count({ where: { premium: true } })
        ]);

        // Récupérer les dernières inscriptions
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
                role: true
            }
        });

        return NextResponse.json({
            stats: {
                users: totalUsers,
                listings: totalListings,
                activeListings,
                revenue: totalSales._sum.amount || 0,
                premiumUsers
            },
            recentUsers
        });

    } catch (error) {
        console.error('Erreur stats admin:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

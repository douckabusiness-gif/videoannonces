import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7days';

        // Calculer la date de début selon la plage
        const now = new Date();
        const startDate = new Date();

        switch (range) {
            case '7days':
                startDate.setDate(now.getDate() - 7);
                break;
            case '30days':
                startDate.setDate(now.getDate() - 30);
                break;
            case '90days':
                startDate.setDate(now.getDate() - 90);
                break;
            case '1year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        // Récupérer les annonces de l'utilisateur
        const listings = await prisma.listing.findMany({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                id: true,
                title: true,
                views: true,
                status: true,
                createdAt: true,
            },
        });

        // Calculer les statistiques
        const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
        const activeListings = listings.filter(l => l.status === 'active').length;

        // Mock data pour les autres métriques (à remplacer par vraies données)
        const totalClicks = Math.floor(totalViews * 0.37);
        const conversionRate = ((totalClicks / totalViews) * 100) || 0;
        const avgViewDuration = 45;
        const totalRevenue = totalClicks * 275; // Estimation

        // Top listings
        const topListings = listings
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map(l => ({
                id: l.id,
                title: l.title,
                views: l.views,
                clicks: Math.floor(l.views * 0.37),
                conversion: ((Math.floor(l.views * 0.37) / l.views) * 100).toFixed(1),
            }));

        // Vues par jour (mock - à remplacer par vraies données)
        const viewsData = [];
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            viewsData.push({
                date: days[date.getDay()],
                views: Math.floor(Math.random() * 200) + 100,
            });
        }

        return NextResponse.json({
            stats: {
                totalViews,
                totalClicks,
                conversionRate: parseFloat(conversionRate.toFixed(1)),
                avgViewDuration,
                totalRevenue,
                activeListings,
            },
            topListings,
            viewsData,
        });
    } catch (error) {
        console.error('Erreur analytics:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

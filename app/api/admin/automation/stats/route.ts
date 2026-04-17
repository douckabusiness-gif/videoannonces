import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

/**
 * GET - Statistiques complètes des automatisations
 */
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '7'; // jours
        const days = parseInt(period);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Statistiques générales
        const [
            totalConfigs,
            enabledConfigs,
            totalLogs,
            successLogs,
            failedLogs,
            totalCost,
            configsByCategory,
            recentLogs
        ] = await Promise.all([
            prisma.automationConfig.count(),
            prisma.automationConfig.count({ where: { enabled: true } }),
            prisma.automationLog.count({ where: { createdAt: { gte: startDate } } }),
            prisma.automationLog.count({
                where: {
                    action: 'executed',
                    createdAt: { gte: startDate }
                }
            }),
            prisma.automationLog.count({
                where: {
                    action: 'failed',
                    createdAt: { gte: startDate }
                }
            }),
            prisma.automationConfig.aggregate({
                _sum: { totalCost: true }
            }),
            prisma.automationConfig.groupBy({
                by: ['category'],
                _count: true,
                where: { enabled: true }
            }),
            prisma.automationLog.findMany({
                take: 100,
                orderBy: { createdAt: 'desc' },
                where: { createdAt: { gte: startDate } },
                select: {
                    id: true,
                    feature: true,
                    action: true,
                    executionTime: true,
                    cost: true,
                    createdAt: true
                }
            })
        ]);

        // Logs par jour (pour graphiques)
        const logsByDay = await prisma.automationLog.groupBy({
            by: ['createdAt'],
            _count: true,
            where: { createdAt: { gte: startDate } }
        });

        // Regrouper par jour
        const dailyStats: Record<string, { date: string; count: number; success: number; failed: number }> = {};

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = { date: dateStr, count: 0, success: 0, failed: 0 };
        }

        recentLogs.forEach(log => {
            const dateStr = log.createdAt.toISOString().split('T')[0];
            if (dailyStats[dateStr]) {
                dailyStats[dateStr].count++;
                if (log.action === 'executed') dailyStats[dateStr].success++;
                if (log.action === 'failed') dailyStats[dateStr].failed++;
            }
        });

        // Statistiques par feature
        const statsByFeature = await prisma.automationLog.groupBy({
            by: ['feature'],
            _count: true,
            _avg: { executionTime: true, cost: true },
            _sum: { cost: true },
            where: { createdAt: { gte: startDate } }
        });

        // Top features les plus utilisées
        const topFeatures = statsByFeature
            .sort((a, b) => b._count - a._count)
            .slice(0, 5)
            .map(stat => ({
                feature: stat.feature,
                count: stat._count,
                avgExecutionTime: Math.round(stat._avg.executionTime || 0),
                totalCost: stat._sum.cost || 0
            }));

        // Coûts par jour
        const costsByDay = await prisma.automationLog.groupBy({
            by: ['createdAt'],
            _sum: { cost: true },
            where: {
                createdAt: { gte: startDate },
                cost: { not: null }
            }
        });

        const dailyCosts: Record<string, number> = {};
        costsByDay.forEach(item => {
            const dateStr = item.createdAt.toISOString().split('T')[0];
            dailyCosts[dateStr] = (dailyCosts[dateStr] || 0) + (item._sum.cost || 0);
        });

        // Taux de succès
        const successRate = totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0;

        return NextResponse.json({
            overview: {
                totalConfigs,
                enabledConfigs,
                disabledConfigs: totalConfigs - enabledConfigs,
                totalExecutions: totalLogs,
                successExecutions: successLogs,
                failedExecutions: failedLogs,
                successRate: Math.round(successRate * 10) / 10,
                totalCost: totalCost._sum.totalCost || 0,
                period: days
            },
            byCategory: configsByCategory.map(cat => ({
                category: cat.category,
                count: cat._count
            })),
            dailyStats: Object.values(dailyStats).reverse(),
            dailyCosts,
            topFeatures,
            recentActivity: recentLogs.slice(0, 20).map(log => ({
                ...log,
                createdAt: log.createdAt.toISOString()
            }))
        });

    } catch (error) {
        console.error('Erreur stats automation:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

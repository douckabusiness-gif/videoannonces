import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BadgeService } from '@/lib/badges/auto-assign';

/**
 * API Cron pour vérifier et attribuer les badges automatiquement
 * À appeler quotidiennement via un cron job
 */
export async function GET(request: NextRequest) {
    try {
        // Vérifier l'authentification du cron (optionnel mais recommandé)
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        console.log('🔄 Début de la vérification des badges...');

        // Récupérer tous les utilisateurs actifs
        const users = await prisma.user.findMany({
            where: {
                suspended: false
            },
            select: {
                id: true,
                name: true
            }
        });

        console.log(`👥 ${users.length} utilisateurs à vérifier`);

        let totalAssigned = 0;
        const results: Record<string, number> = {};

        // Vérifier chaque utilisateur
        for (const user of users) {
            try {
                const assignedBadges = await BadgeService.checkAndAssignBadges(user.id);

                if (assignedBadges.length > 0) {
                    totalAssigned += assignedBadges.length;
                    console.log(`✅ ${user.name}: ${assignedBadges.join(', ')}`);

                    for (const badge of assignedBadges) {
                        results[badge] = (results[badge] || 0) + 1;
                    }
                }
            } catch (error) {
                console.error(`❌ Erreur pour ${user.name}:`, error);
            }
        }

        // Logger dans la base de données
        await prisma.systemLog.create({
            data: {
                type: 'success',
                category: 'system',
                action: 'cron_assign_badges',
                message: `Vérification badges terminée: ${totalAssigned} badges attribués à ${users.length} utilisateurs`,
                metadata: results
            }
        });

        console.log('✨ Vérification terminée !');
        console.log(`📊 Total: ${totalAssigned} badges attribués`);
        console.log('📈 Détails:', results);

        return NextResponse.json({
            success: true,
            usersChecked: users.length,
            badgesAssigned: totalAssigned,
            breakdown: results,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur cron badges:', error);

        // Logger l'erreur
        await prisma.systemLog.create({
            data: {
                type: 'error',
                category: 'system',
                action: 'cron_assign_badges',
                message: `Erreur lors de la vérification des badges: ${error}`,
            }
        });

        return NextResponse.json(
            { error: 'Erreur serveur', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * POST - Forcer la vérification pour un utilisateur spécifique
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'userId requis' },
                { status: 400 }
            );
        }

        const assignedBadges = await BadgeService.checkAndAssignBadges(userId);

        return NextResponse.json({
            success: true,
            userId,
            badgesAssigned: assignedBadges,
            count: assignedBadges.length
        });

    } catch (error) {
        console.error('Erreur vérification badges:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

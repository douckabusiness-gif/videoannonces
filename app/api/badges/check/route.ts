import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { BadgeService } from '@/lib/badges/auto-assign';
import { BadgeType } from '@prisma/client';

/**
 * GET - Vérifier les badges de l'utilisateur connecté
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const assignedBadges = await BadgeService.checkAndAssignBadges(session.user.id);

        return NextResponse.json({
            success: true,
            newBadges: assignedBadges,
            count: assignedBadges.length,
            message: assignedBadges.length > 0
                ? `Félicitations ! Vous avez obtenu ${assignedBadges.length} nouveau(x) badge(s) !`
                : 'Aucun nouveau badge pour le moment'
        });

    } catch (error) {
        console.error('Erreur vérification badges:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * POST - Vérifier un badge spécifique
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { badgeType } = await request.json();

        if (!badgeType || !Object.values(BadgeType).includes(badgeType)) {
            return NextResponse.json(
                { error: 'Type de badge invalide' },
                { status: 400 }
            );
        }

        const assigned = await BadgeService.checkSpecificBadge(session.user.id, badgeType as BadgeType);

        return NextResponse.json({
            success: true,
            badgeType,
            assigned,
            message: assigned
                ? `Badge ${badgeType} attribué !`
                : `Vous ne remplissez pas encore les critères pour le badge ${badgeType}`
        });

    } catch (error) {
        console.error('Erreur vérification badge spécifique:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

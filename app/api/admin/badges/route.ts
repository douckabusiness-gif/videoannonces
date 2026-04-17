import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { manuallyAwardBadge, removeBadge } from '@/lib/badges/badgeEngine';
import { BadgeType } from '@prisma/client';

// POST - Attribuer manuellement un badge (admin)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { userId, badgeType, expiresAt } = await request.json();

        if (!userId || !badgeType) {
            return NextResponse.json(
                { error: 'userId et badgeType requis' },
                { status: 400 }
            );
        }

        const userBadge = await manuallyAwardBadge(
            userId,
            badgeType as BadgeType,
            expiresAt ? new Date(expiresAt) : undefined
        );

        return NextResponse.json(userBadge);
    } catch (error) {
        console.error('Erreur attribution badge:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// DELETE - Retirer un badge (admin)
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { userId, badgeType } = await request.json();

        if (!userId || !badgeType) {
            return NextResponse.json(
                { error: 'userId et badgeType requis' },
                { status: 400 }
            );
        }

        await removeBadge(userId, badgeType as BadgeType);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur retrait badge:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

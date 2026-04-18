import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les badges d'un utilisateur
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const userBadges = await prisma.userBadge.findMany({
            where: { userId: id },
            include: { badge: true },
            orderBy: { awardedAt: 'desc' },
        });

        return NextResponse.json(userBadges);
    } catch (error) {
        console.error('Erreur récupération badges utilisateur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer tous les badges disponibles
export async function GET(request: NextRequest) {
    try {
        const badges = await prisma.badge.findMany({
            orderBy: { type: 'asc' },
        });

        return NextResponse.json(badges);
    } catch (error) {
        console.error('Erreur récupération badges:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

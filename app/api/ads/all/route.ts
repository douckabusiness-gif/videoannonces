import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les publicités (pour l'admin)
export async function GET(request: NextRequest) {
    try {
        const ads = await prisma.ad.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ ads });
    } catch (error) {
        console.error('Erreur récupération publicités:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

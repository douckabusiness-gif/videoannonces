import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Liste des packages de boost actifs (accessible à tous)
export async function GET(request: NextRequest) {
    try {
        const boosts = await prisma.boostPackage.findMany({
            where: { active: true },
            orderBy: { price: 'asc' }
        });

        return NextResponse.json({ boosts });
    } catch (error) {
        console.error('Error fetching boost packages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

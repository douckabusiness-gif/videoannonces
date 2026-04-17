import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Liste des plans actifs (accessible à tous)
export async function GET(request: NextRequest) {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            where: { active: true },
            orderBy: { price: 'asc' }
        });

        return NextResponse.json({ plans });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

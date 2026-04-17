import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer le message actif (accessible à tous)
export async function GET(request: NextRequest) {
    try {
        const message = await prisma.paymentMessage.findFirst({
            where: { active: true }
        });

        return NextResponse.json({ message: message || null });
    } catch (error) {
        console.error('Error fetching active payment message:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

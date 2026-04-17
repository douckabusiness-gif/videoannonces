import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Liste les moyens de paiement actifs (public)
export async function GET(request: NextRequest) {
    try {
        const methods = await prisma.paymentMethod.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                name: true,
                code: true,
                description: true,
                icon: true,
                color: true,
                order: true,
                phoneNumber: true,
                phoneNumber: true,
                paymentLink: true,
                instruction: true,
            }
        });

        return NextResponse.json({ methods });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

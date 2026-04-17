import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { planId, paymentMethod, phoneNumber } = body;

        // Récupérer le plan
        const plan = await prisma.subscriptionPlan.findFirst({
            where: { slug: planId }
        });

        if (!plan) {
            return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 });
        }

        // Créer le paiement
        const payment = await prisma.payment.create({
            data: {
                userId: session.user.id,
                amount: plan.price,
                currency: 'XOF',
                status: 'pending',
                paymentMethod,
                reference: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                metadata: {
                    type: 'subscription',
                    planId: plan.id,
                    phoneNumber
                }
            }
        });

        return NextResponse.json({
            paymentId: payment.id,
            reference: payment.reference
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating subscription payment:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

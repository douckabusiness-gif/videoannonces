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
        const { planId, paymentMethodId, transactionId, proofUrl, phoneNumber } = body;

        // Validation basique
        if (!planId || !paymentMethodId || !transactionId) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        // Récupérer le plan
        const plan = await prisma.subscriptionPlan.findFirst({
            where: { slug: planId }
        });

        if (!plan) {
            return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 });
        }

        // Récupérer la méthode de paiement
        const method = await prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId }
        });

        if (!method) {
            return NextResponse.json({ error: 'Méthode de paiement non trouvée' }, { status: 400 });
        }

        // Vérifier si l'ID de transaction existe déjà (optionnel mais recommandé)
        const existingPayment = await prisma.payment.findFirst({
            where: { transactionId }
        });

        if (existingPayment) {
            return NextResponse.json({ error: 'Cet ID de transaction a déjà été utilisé' }, { status: 400 });
        }

        // Créer le paiement
        const payment = await prisma.payment.create({
            data: {
                userId: session.user.id,
                amount: plan.price,
                currency: 'XOF',
                status: 'pending',

                // Relations et données manuelles
                paymentMethodId: method.id,
                paymentMethod: method.name, // Fallback string
                transactionId,
                proofUrl,

                reference: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                metadata: {
                    type: 'subscription',
                    planId: plan.id,
                    phoneNumber,
                    methodName: method.name
                }
            }
        });

        // TODO: Notifier les admins (Optionnel)

        return NextResponse.json({
            success: true,
            paymentId: payment.id,
            reference: payment.reference
        }, { status: 201 });

    } catch (error) {
        console.error('Error submitting manual payment:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Refuser une demande d'abonnement
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Vérifier que l'utilisateur est admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Accès refusé - Admin uniquement' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { paymentId } = body;

        if (!paymentId) {
            return NextResponse.json(
                { error: 'PaymentId manquant' },
                { status: 400 }
            );
        }

        // Récupérer le paiement
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId }
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Paiement non trouvé' },
                { status: 404 }
            );
        }

        if (payment.status !== 'pending') {
            return NextResponse.json(
                { error: 'Ce paiement n\'est plus en attente' },
                { status: 400 }
            );
        }

        // Mettre à jour le paiement comme "failed"
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'failed' }
        });

        // Créer un log admin
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'subscription_rejected',
                targetType: 'payment',
                targetId: paymentId,
                details: {
                    reference: payment.reference,
                    userId: payment.userId
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Demande refusée'
        });

    } catch (error) {
        console.error('Error rejecting subscription:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

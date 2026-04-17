import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Approuver une demande d'abonnement
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
        const { paymentId, userId } = body;

        if (!paymentId || !userId) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Récupérer le paiement
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                user: true
            }
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

        // Mettre à jour le paiement comme "completed"
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'completed' }
        });

        // Activer le Premium pour l'utilisateur
        await prisma.user.update({
            where: { id: userId },
            data: {
                premium: true,
                isVendor: true // S'assurer qu'il est vendeur
            }
        });

        // Créer un log admin
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'subscription_approved',
                targetType: 'user',
                targetId: userId,
                details: {
                    paymentId,
                    reference: payment.reference,
                    amount: payment.amount
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Abonnement activé avec succès'
        });

    } catch (error) {
        console.error('Error approving subscription:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

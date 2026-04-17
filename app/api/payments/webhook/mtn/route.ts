import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiKey = request.headers.get('x-api-key');

        // Valider l'API key
        if (apiKey !== process.env.MTN_MOMO_API_KEY) {
            console.error('Invalid MTN MoMo API key');
            return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        }

        const { referenceId, status, financialTransactionId } = body;

        // Trouver le paiement
        const payment = await prisma.payment.findFirst({
            where: { id: referenceId },
            include: { user: true },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Mettre à jour le paiement
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: status === 'SUCCESSFUL' ? 'completed' : 'failed',
                transactionId: financialTransactionId,
                webhookReceived: true,
                webhookData: body,
            },
        });

        // Si paiement réussi, activer l'abonnement
        if (status === 'SUCCESSFUL') {
            await activateSubscription(payment.userId, payment.id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('MTN MoMo webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

async function activateSubscription(userId: string, paymentId: string) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.upsert({
        where: { userId },
        create: {
            userId,
            plan: 'premium',
            status: 'active',
            startDate,
            endDate,
            paymentId,
            lastPaymentDate: startDate,
            nextPaymentDate: endDate,
            renewalCount: 1,
        },
        update: {
            status: 'active',
            endDate,
            paymentId,
            lastPaymentDate: startDate,
            nextPaymentDate: endDate,
            renewalCount: { increment: 1 },
        },
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            premium: true,
            premiumUntil: endDate,
            premiumTier: 'premium',
        },
    });
}

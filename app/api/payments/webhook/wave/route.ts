import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const signature = request.headers.get('x-wave-signature');

        // Valider la signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.WAVE_SECRET || 'secret')
            .update(JSON.stringify(body))
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid Wave signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const { checkout_id, status, transaction_id } = body;

        // Trouver le paiement
        const payment = await prisma.payment.findFirst({
            where: { id: checkout_id },
            include: { user: true },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Mettre à jour le paiement
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: status === 'completed' ? 'completed' : 'failed',
                transactionId: transaction_id,
                webhookReceived: true,
                webhookData: body,
            },
        });

        // Si paiement réussi, activer l'abonnement
        if (status === 'completed') {
            await activateSubscription(payment.userId, payment.id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Wave webhook error:', error);
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

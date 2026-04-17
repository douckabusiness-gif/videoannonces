import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const body = await request.json();
        const { method, amount, phoneNumber, plan } = body;

        // Validation
        if (!method || !amount || !phoneNumber || !plan) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Vérifier le numéro de téléphone
        const phoneRegex = /^(07|05|01)\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return NextResponse.json(
                { error: 'Numéro de téléphone invalide' },
                { status: 400 }
            );
        }

        // Créer le paiement en base
        const payment = await prisma.payment.create({
            data: {
                userId: user.id,
                amount: parseFloat(amount),
                currency: 'XOF',
                method,
                status: 'pending',
                phoneNumber,
                metadata: {
                    plan,
                    userEmail: user.email,
                    userName: user.name,
                },
            },
        });

        // Initier le paiement selon la méthode
        let paymentResponse;

        switch (method) {
            case 'orange_money':
                paymentResponse = await initiateOrangeMoneyPayment(payment, phoneNumber, amount);
                break;

            case 'mtn_momo':
                paymentResponse = await initiateMTNMoMoPayment(payment, phoneNumber, amount);
                break;

            case 'wave':
                paymentResponse = await initiateWavePayment(payment, phoneNumber, amount);
                break;

            default:
                return NextResponse.json(
                    { error: 'Méthode de paiement non supportée' },
                    { status: 400 }
                );
        }

        // Mettre à jour le paiement avec la réponse du provider
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                transactionId: paymentResponse.transactionId,
                providerResponse: paymentResponse,
            },
        });

        return NextResponse.json({
            success: true,
            paymentId: payment.id,
            transactionId: paymentResponse.transactionId,
            message: 'Paiement initié. Veuillez confirmer sur votre téléphone.',
            ...paymentResponse,
        });

    } catch (error) {
        console.error('Erreur initiation paiement:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'initiation du paiement' },
            { status: 500 }
        );
    }
}

// Orange Money Payment
async function initiateOrangeMoneyPayment(payment: any, phoneNumber: string, amount: number) {
    // TODO: Implémenter l'API Orange Money
    // Pour l'instant, retourner un mock pour le développement

    console.log('Initiation Orange Money:', { phoneNumber, amount });

    // En production, appeler l'API Orange Money
    // const response = await fetch('https://api.orange.com/orange-money-webpay/...', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     merchant_key: process.env.ORANGE_MONEY_MERCHANT_ID,
    //     currency: 'XOF',
    //     order_id: payment.id,
    //     amount: amount,
    //     return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/callback`,
    //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/cancel`,
    //     notif_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook/orange`,
    //     lang: 'fr',
    //     reference: payment.id,
    //   }),
    // });

    return {
        transactionId: `OM_${Date.now()}`,
        status: 'pending',
        message: 'Veuillez confirmer le paiement sur votre téléphone',
    };
}

// MTN Mobile Money Payment
async function initiateMTNMoMoPayment(payment: any, phoneNumber: string, amount: number) {
    // TODO: Implémenter l'API MTN MoMo

    console.log('Initiation MTN MoMo:', { phoneNumber, amount });

    // En production, appeler l'API MTN MoMo
    // const response = await fetch('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.MTN_MOMO_API_KEY}`,
    //     'X-Reference-Id': payment.id,
    //     'X-Target-Environment': 'sandbox',
    //     'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     amount: amount.toString(),
    //     currency: 'XOF',
    //     externalId: payment.id,
    //     payer: {
    //       partyIdType: 'MSISDN',
    //       partyId: phoneNumber,
    //     },
    //     payerMessage: 'Abonnement Premium VideoBoutique',
    //     payeeNote: `Payment for ${payment.id}`,
    //   }),
    // });

    return {
        transactionId: `MTN_${Date.now()}`,
        status: 'pending',
        message: 'Veuillez confirmer le paiement sur votre téléphone',
    };
}

// Wave Payment
async function initiateWavePayment(payment: any, phoneNumber: string, amount: number) {
    // TODO: Implémenter l'API Wave

    console.log('Initiation Wave:', { phoneNumber, amount });

    // En production, appeler l'API Wave
    // const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WAVE_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     amount: amount,
    //     currency: 'XOF',
    //     error_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/error`,
    //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success`,
    //   }),
    // });

    return {
        transactionId: `WAVE_${Date.now()}`,
        status: 'pending',
        checkoutUrl: `https://pay.wave.com/checkout/${payment.id}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=wave://pay/${payment.id}`,
        message: 'Scannez le QR code ou cliquez sur le lien',
    };
}

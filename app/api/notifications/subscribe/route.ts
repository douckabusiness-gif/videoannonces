import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { subscription, userAgent } = await request.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json(
                { error: 'Données d\'abonnement invalides' },
                { status: 400 }
            );
        }

        // Créer ou mettre à jour l'abonnement
        const pushSubscription = await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            create: {
                userId: session.user.id,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                userAgent: userAgent || null,
            },
            update: {
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                userAgent: userAgent || null,
            },
        });

        console.log('✅ Abonnement push créé/mis à jour:', pushSubscription.id);

        return NextResponse.json({
            success: true,
            subscriptionId: pushSubscription.id,
        });
    } catch (error) {
        console.error('❌ Erreur abonnement push:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Vérifier si l'utilisateur est admin
async function checkAdminAccess(session: any) {
    if (!session?.user) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'ADMIN';
}

// PATCH - Valider ou refuser un paiement
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { status } = body; // 'completed' ou 'failed'

        if (!['completed', 'failed'].includes(status)) {
            return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: id }
        });

        if (!payment) {
            return NextResponse.json({ error: 'Paiement non trouvé' }, { status: 404 });
        }

        // Si on valide le paiement, on active le service
        if (status === 'completed' && payment.status !== 'completed') {
            const metadata = payment.metadata as any;
            console.log('Validating payment with metadata:', metadata);

            if (metadata?.type === 'boost') {
                // Activer le boost
                const { listingId, duration } = metadata;
                console.log(`Activating boost for listing ${listingId} for ${duration} days`);

                if (listingId && duration) {
                    try {
                        const updatedListing = await prisma.listing.update({
                            where: { id: listingId },
                            data: {
                                boosted: true,
                                isUrgent: true,
                                boostedUntil: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
                            }
                        });
                        console.log('Listing updated successfully:', updatedListing.id);
                    } catch (err) {
                        console.error('Error updating listing:', err);
                    }
                } else {
                    console.error('Missing listingId or duration in metadata');
                }
            } else if (metadata?.type === 'subscription') {
                // Activer l'abonnement
                const planId = metadata.planId;

                if (planId) {
                    try {
                        // Récupérer les détails du plan
                        const plan = await prisma.subscriptionPlan.findUnique({
                            where: { id: planId }
                        });

                        if (plan) {
                            // Date de fin (30 jours par défaut)
                            const startDate = new Date();
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + 30);

                            // 1. Créer ou mettre à jour l'abonnement
                            await prisma.subscription.upsert({
                                where: { userId: payment.userId },
                                create: {
                                    userId: payment.userId,
                                    plan: plan.slug,
                                    status: 'active',
                                    startDate,
                                    endDate,
                                    autoRenew: true,
                                    paymentMethodId: payment.id // Lier au paiement
                                },
                                update: {
                                    plan: plan.slug,
                                    status: 'active',
                                    startDate,
                                    endDate,
                                    autoRenew: true,
                                    paymentMethodId: payment.id
                                }
                            });

                            // 2. Mettre à jour l'utilisateur
                            await prisma.user.update({
                                where: { id: payment.userId },
                                data: {
                                    isPremium: true, // Pour la section "Boutiques Premium"
                                    premium: true,   // Legacy flag
                                    premiumTier: plan.slug,
                                    premiumUntil: endDate,
                                    isVendor: true, // Activer le mode vendeur
                                    role: 'USER' // Reste USER mais avec privilèges
                                }
                            });

                            console.log(`Subscription activated for user ${payment.userId} with plan ${plan.slug}`);

                            // 3. (Optionnel) Envoyer une notification ou email

                        } else {
                            console.error(`Plan not found: ${planId}`);
                        }
                    } catch (err) {
                        console.error('Error activating subscription:', err);
                    }
                } else {
                    console.error('Missing planId in metadata');
                }
            }
        }

        // Mettre à jour le statut du paiement
        const updatedPayment = await prisma.payment.update({
            where: { id: id },
            data: { status }
        });

        return NextResponse.json({ payment: updatedPayment });

    } catch (error) {
        console.error('Error updating payment:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

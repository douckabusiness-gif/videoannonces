import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

// GET - Liste de tous les paiements
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const payments = await prisma.payment.findMany({
            where: status && status !== 'all' ? { status } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                method: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
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

        let activationResult = null;

        // Si on valide le paiement, on active le service
        if (status === 'completed' && payment.status !== 'completed') {

            // 1. Parsing robuste des métadonnées
            let metadata = payment.metadata as any;
            if (typeof metadata === 'string') {
                try {
                    metadata = JSON.parse(metadata);
                } catch (e) {
                    console.error('Failed to parse metadata JSON:', e);
                }
            }

            console.log(`Processing validation for payment ${id} with type: ${metadata?.type}`);
            console.log('Metadata:', metadata);

            if (metadata?.type === 'boost') {
                // Activer le boost
                const { listingId, duration } = metadata;
                const durationDays = Number(duration);

                console.log(`Attempting to boost listing ${listingId} for ${durationDays} days`);

                if (listingId && !isNaN(durationDays)) {
                    try {
                        const boostedUntil = new Date();
                        boostedUntil.setDate(boostedUntil.getDate() + durationDays);

                        const updatedListing = await prisma.listing.update({
                            where: { id: listingId },
                            data: {
                                boosted: true,
                                isUrgent: true,
                                boostedUntil: boostedUntil
                            }
                        });
                        console.log('✅ Listing boosted successfully:', updatedListing.id);
                        activationResult = { success: true, type: 'boost', listingId: updatedListing.id };
                    } catch (err) {
                        console.error('❌ Error updating listing for boost:', err);
                        activationResult = { success: false, error: 'Listing update failed' };
                    }
                } else {
                    console.error('❌ Missing or invalid listingId/duration for boost activation', { listingId, duration });
                    activationResult = { success: false, error: 'Invalid metadata' };
                }

            } else if (metadata?.type === 'subscription') {
                // Activer l'abonnement
                const planId = metadata.planId;
                if (planId) {
                    try {
                        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
                        if (plan) {
                            const startDate = new Date();
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + 30);

                            await prisma.subscription.upsert({
                                where: { userId: payment.userId },
                                create: {
                                    userId: payment.userId,
                                    plan: plan.slug,
                                    status: 'active',
                                    startDate,
                                    endDate,
                                    autoRenew: true,
                                    paymentMethodId: payment.id
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

                            await prisma.user.update({
                                where: { id: payment.userId },
                                data: {
                                    isPremium: true,
                                    premium: true,
                                    premiumTier: plan.slug,
                                    premiumUntil: endDate,
                                    isVendor: true,
                                    role: 'USER'
                                }
                            });
                            console.log('✅ Subscription activated successfully');
                        }
                    } catch (err) {
                        console.error('❌ Error activating subscription:', err);
                    }
                }
            }
        }

        const updatedPayment = await prisma.payment.update({
            where: { id: id },
            data: { status }
        });

        return NextResponse.json({
            payment: updatedPayment,
            activationResult
        });

    } catch (error) {
        console.error('Error updating payment:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

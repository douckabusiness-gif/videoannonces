import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Acheter un boost pour une annonce
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { boostPackageId, paymentMethod, phoneNumber } = body;

        // Vérifier que l'annonce appartient à l'utilisateur
        const listing = await prisma.listing.findUnique({
            where: { id: id }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
        }

        if (listing.userId !== session.user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Récupérer le package de boost
        const boostPackage = await prisma.boostPackage.findUnique({
            where: { id: boostPackageId }
        });

        if (!boostPackage || !boostPackage.active) {
            return NextResponse.json({ error: 'Package non disponible' }, { status: 404 });
        }

        // Créer le paiement (En attente de validation admin)
        const payment = await prisma.payment.create({
            data: {
                userId: session.user.id,
                amount: boostPackage.price,
                currency: 'XOF',
                status: 'pending',
                paymentMethod,
                reference: `BOOST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                metadata: {
                    type: 'boost',
                    listingId: id,
                    boostPackageId,
                    duration: boostPackage.duration,
                    phoneNumber
                }
            }
        });

        // NOTE: L'activation se fera via l'admin après validation du paiement

        // TODO: Intégrer avec l'API de paiement (Orange Money, MTN, Wave)
        // Pour l'instant, on simule un paiement en attente

        return NextResponse.json({
            paymentId: payment.id,
            reference: payment.reference,
            amount: payment.amount
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating boost payment:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

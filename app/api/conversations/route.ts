import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les conversations de l'utilisateur
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { buyerId: session.user.id },
                    { sellerId: session.user.id }
                ]
            },
            include: {
                buyer: {
                    select: { id: true, name: true, avatar: true }
                },
                // On devra récupérer le vendeur manuellement car il n'y a pas de relation directe 'seller' dans le schema actuel
                // ou on suppose que l'autre participant est le vendeur si on est l'acheteur
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                }
            },
            orderBy: { lastMessageAt: 'desc' }
        });

        // Enrichir les conversations avec les infos de l'autre participant
        const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
            const isBuyer = conv.buyerId === session.user.id;
            const otherUserId = isBuyer ? conv.sellerId : conv.buyerId;

            const otherUser = await prisma.user.findUnique({
                where: { id: otherUserId },
                select: { id: true, name: true, avatar: true, subdomain: true }
            });

            // Récupérer l'annonce liée
            const listing = await prisma.listing.findUnique({
                where: { id: conv.listingId },
                select: { id: true, title: true, thumbnailUrl: true, price: true }
            });

            return {
                ...conv,
                otherUser,
                listing,
                lastMessage: conv.messages[0] || null
            };
        }));

        return NextResponse.json(enrichedConversations);

    } catch (error) {
        console.error('Erreur récupération conversations:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer une nouvelle conversation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { listingId, sellerId } = body;

        if (!listingId || !sellerId) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        // Vérifier si conversation existe déjà
        const existingConv = await prisma.conversation.findUnique({
            where: {
                listingId_buyerId: {
                    listingId,
                    buyerId: session.user.id
                }
            }
        });

        if (existingConv) {
            return NextResponse.json(existingConv);
        }

        // Créer nouvelle conversation
        const conversation = await prisma.conversation.create({
            data: {
                listingId,
                sellerId,
                buyerId: session.user.id,
            }
        });

        return NextResponse.json(conversation, { status: 201 });

    } catch (error) {
        console.error('Erreur création conversation:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

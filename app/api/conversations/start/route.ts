import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const { listingId } = await request.json();

        if (!listingId) {
            return NextResponse.json({ error: 'ID annonce requis' }, { status: 400 });
        }

        // Récupérer l'annonce
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { id: true, userId: true, title: true }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
        }

        // Empêcher de se contacter soi-même
        if (listing.userId === session.user.id) {
            return NextResponse.json({
                error: 'Vous ne pouvez pas contacter votre propre annonce'
            }, { status: 400 });
        }

        const vendorId = listing.userId;
        const clientId = session.user.id;

        // Vérifier si une conversation existe déjà
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                listingId: listingId,
                OR: [
                    {
                        AND: [
                            { participants: { some: { userId: clientId } } },
                            { participants: { some: { userId: vendorId } } }
                        ]
                    }
                ]
            },
            select: { id: true }
        });

        if (existingConversation) {
            return NextResponse.json({
                conversationId: existingConversation.id,
                isNew: false
            }, { status: 200 });
        }

        // Créer une nouvelle conversation
        const conversation = await prisma.conversation.create({
            data: {
                listingId: listingId,
                participants: {
                    create: [
                        { userId: clientId },
                        { userId: vendorId }
                    ]
                }
            },
            select: { id: true }
        });

        // Créer un message système initial
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: clientId,
                content: `Bonjour, je suis intéressé par votre annonce "${listing.title}"`,
                type: 'text',
                read: false
            }
        });

        return NextResponse.json({
            conversationId: conversation.id,
            isNew: true
        }, { status: 201 });

    } catch (error) {
        console.error('Error starting conversation:', error);
        return NextResponse.json({
            error: 'Erreur lors de la création de la conversation'
        }, { status: 500 });
    }
}

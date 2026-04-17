import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Récupérer la conversation active avec ce vendeur
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const sellerId = searchParams.get('sellerId');

        if (!session?.user?.id) {
            return NextResponse.json({ authenticated: false });
        }

        if (!sellerId) {
            return NextResponse.json({ error: 'Seller ID required' }, { status: 400 });
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                buyerId: session.user.id,
                sellerId: sellerId
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    take: 50 // Charger les 50 derniers messages
                }
            }
        });

        return NextResponse.json({
            authenticated: true,
            conversation: conversation || null
        });

    } catch (error) {
        console.error('Error fetching chat widget data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Envoyer un message (ou créer conversation)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { sellerId, content, conversationId } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ error: 'Message empty' }, { status: 400 });
        }

        // 1. Utiliser conversation existante ou en créer une
        let finalConversationId = conversationId;

        if (!finalConversationId) {
            // Vérifier si existe déjà
            const existingConv = await prisma.conversation.findFirst({
                where: {
                    buyerId: session.user.id,
                    sellerId: sellerId
                }
            });

            if (existingConv) {
                finalConversationId = existingConv.id;
            } else {
                // Créer nouvelle conversation
                const newConv = await prisma.conversation.create({
                    data: {
                        buyerId: session.user.id,
                        sellerId: sellerId,
                        unreadCount: 1, // Pour le vendeur
                        lastMessage: content.substring(0, 100),
                        lastMessageAt: new Date()
                    }
                });
                finalConversationId = newConv.id;
            }
        }

        // 2. Créer le message
        const message = await prisma.message.create({
            data: {
                conversationId: finalConversationId,
                senderId: session.user.id,
                content: content,
                read: false
            }
        });

        // 3. Mettre à jour la conversation
        const conversation = await prisma.conversation.update({
            where: { id: finalConversationId },
            data: {
                lastMessage: content.substring(0, 100),
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 }
            }
        });

        // 4. Automatisation (Règles + IA) - Seulement si c'est l'acheteur qui écrit
        if (session.user.id !== sellerId) {
            try {
                const { automationService } = await import('@/lib/automation-service');
                const autoResponse = await automationService.processMessage(
                    content,
                    sellerId,
                    session.user.id,
                    conversation.listingId // Optionnel
                );

                if (autoResponse) {
                    // Créer le message de réponse automatique (du vendeur)
                    await prisma.message.create({
                        data: {
                            conversationId: finalConversationId,
                            senderId: sellerId,
                            content: autoResponse,
                            read: false
                        }
                    });

                    // Mettre à jour la conversation à nouveau
                    await prisma.conversation.update({
                        where: { id: finalConversationId },
                        data: {
                            lastMessage: autoResponse.substring(0, 100),
                            lastMessageAt: new Date(),
                            unreadCount: 0 // On suppose que le vendeur a "répondu"
                        }
                    });
                }
            } catch (autoError) {
                console.error('Erreur automation silente:', autoError);
                // On ne bloque pas l'envoi du message initial
            }
        }

        return NextResponse.json(message);

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

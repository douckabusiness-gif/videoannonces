import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const conversationId = params.id;

        // Vérifier que l'utilisateur fait partie de la conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation introuvable' }, { status: 404 });
        }

        if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        // Récupérer les messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error('Erreur récupération messages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

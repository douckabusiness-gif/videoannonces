import { Server } from 'socket.io';
import { prisma } from '@/lib/prisma';

let io: Server;

export function initSocket(server: any) {
    if (io) return io;

    // Connexion au serveur Socket.IO dédié sur le port 3001
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    io = new (require('socket.io-client').io)(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
    });

    io.on('connection', (socket) => {
        console.log('Client connecté:', socket.id);

        // Rejoindre une conversation
        socket.on('join-conversation', (conversationId: string) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`Socket ${socket.id} a rejoint conversation:${conversationId}`);
        });

        // Quitter une conversation
        socket.on('leave-conversation', (conversationId: string) => {
            socket.leave(`conversation:${conversationId}`);
        });

        // Envoyer un message
        socket.on('send-message', async (data: {
            conversationId: string;
            senderId: string;
            content: string;
            type: string;
            mediaUrl?: string;
            duration?: number;
        }) => {
            try {
                // Créer le message dans la DB
                const message = await prisma.message.create({
                    data: {
                        conversationId: data.conversationId,
                        senderId: data.senderId,
                        listingId: '', // À récupérer de la conversation
                        content: data.content,
                        type: data.type,
                        mediaUrl: data.mediaUrl,
                        duration: data.duration,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            }
                        }
                    }
                });

                // Mettre à jour lastMessageAt
                await prisma.conversation.update({
                    where: { id: data.conversationId },
                    data: { lastMessageAt: new Date() }
                });

                // Émettre le message à tous dans la conversation
                io.to(`conversation:${data.conversationId}`).emit('new-message', message);
            } catch (error) {
                console.error('Erreur envoi message:', error);
                socket.emit('message-error', { error: 'Erreur envoi message' });
            }
        });

        // Typing indicator
        socket.on('typing', (data: { conversationId: string; userId: string; userName: string }) => {
            socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
                userId: data.userId,
                userName: data.userName,
            });
        });

        socket.on('stop-typing', (data: { conversationId: string; userId: string }) => {
            socket.to(`conversation:${data.conversationId}`).emit('user-stop-typing', {
                userId: data.userId,
            });
        });

        // Marquer comme lu
        socket.on('mark-read', async (data: { conversationId: string; userId: string }) => {
            try {
                await prisma.message.updateMany({
                    where: {
                        conversationId: data.conversationId,
                        senderId: { not: data.userId },
                        read: false,
                    },
                    data: { read: true }
                });

                socket.to(`conversation:${data.conversationId}`).emit('messages-read', {
                    conversationId: data.conversationId,
                });
            } catch (error) {
                console.error('Erreur mark-read:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client déconnecté:', socket.id);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO non initialisé');
    }
    return io;
}

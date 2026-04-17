import { prisma } from '@/lib/prisma';
import { webpush } from './webpush';

interface NotificationData {
    userId: string;
    type: 'MESSAGE' | 'LIVE_STARTED' | 'LIVE_REMINDER' | 'SALE' | 'ORDER' | 'REVIEW' | 'SYSTEM';
    title: string;
    body: string;
    icon?: string;
    url?: string;
    data?: any;
}

export async function sendPushNotification(notificationData: NotificationData) {
    try {
        // 1. Créer notification dans DB
        const notification = await prisma.notification.create({
            data: {
                userId: notificationData.userId,
                type: notificationData.type,
                title: notificationData.title,
                body: notificationData.body,
                icon: notificationData.icon,
                url: notificationData.url,
                data: notificationData.data,
            },
        });

        // 2. Récupérer abonnements push de l'utilisateur
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId: notificationData.userId },
        });

        if (subscriptions.length === 0) {
            console.log('Aucun abonnement push pour cet utilisateur');
            return notification;
        }

        // 3. Envoyer à tous les appareils
        const promises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth,
                },
            };

            const payload = JSON.stringify({
                id: notification.id,
                type: notificationData.type,
                title: notificationData.title,
                body: notificationData.body,
                icon: notificationData.icon,
                url: notificationData.url,
            });

            try {
                await webpush.sendNotification(pushSubscription, payload);
                console.log('✅ Notification envoyée:', sub.endpoint.substring(0, 50));
            } catch (error: any) {
                console.error('❌ Erreur envoi notification:', error.message);

                // Si abonnement expiré (410 Gone), le supprimer
                if (error.statusCode === 410) {
                    console.log('🗑️ Suppression abonnement expiré');
                    await prisma.pushSubscription.delete({
                        where: { id: sub.id },
                    });
                }
            }
        });

        await Promise.allSettled(promises);

        // 4. Marquer comme envoyée
        await prisma.notification.update({
            where: { id: notification.id },
            data: { sent: true },
        });

        console.log('✅ Notification traitée:', notification.id);
        return notification;
    } catch (error) {
        console.error('❌ Erreur envoi notification push:', error);
        throw error;
    }
}

// Envoyer notification à plusieurs utilisateurs
export async function sendBulkPushNotification(
    userIds: string[],
    notificationData: Omit<NotificationData, 'userId'>
) {
    const promises = userIds.map((userId) =>
        sendPushNotification({ ...notificationData, userId })
    );

    const results = await Promise.allSettled(promises);

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`📊 Notifications envoyées: ${successful} succès, ${failed} échecs`);

    return { successful, failed };
}

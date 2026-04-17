// Service Worker pour Push Notifications VideoBoutique

// Installation
self.addEventListener('install', (event) => {
    console.log('🔔 Service Worker installé');
    self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
    console.log('🔔 Service Worker activé');
    event.waitUntil(self.clients.claim());
});

// Réception notification push
self.addEventListener('push', (event) => {
    console.log('🔔 Notification push reçue');

    if (!event.data) {
        console.log('Pas de données dans la notification');
        return;
    }

    try {
        const data = event.data.json();
        console.log('Données notification:', data);

        const options = {
            body: data.body,
            icon: data.icon || '/icon-192.png',
            badge: '/badge-72.png',
            vibrate: [200, 100, 200],
            tag: data.type || 'notification',
            requireInteraction: false,
            data: {
                url: data.url || '/',
                notificationId: data.id,
                type: data.type,
            },
            actions: [
                {
                    action: 'open',
                    title: 'Ouvrir',
                    icon: '/icons/open.png',
                },
                {
                    action: 'close',
                    title: 'Fermer',
                    icon: '/icons/close.png',
                },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    } catch (error) {
        console.error('Erreur traitement notification:', error);
    }
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Clic sur notification:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const url = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Chercher une fenêtre déjà ouverte
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }

                // Ouvrir nouvelle fenêtre
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// Fermeture notification
self.addEventListener('notificationclose', (event) => {
    console.log('🔔 Notification fermée');
});

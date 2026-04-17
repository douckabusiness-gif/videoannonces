import webpush from 'web-push';

// Clés VAPID pour Web Push
// Générer avec: npx web-push generate-vapid-keys
const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

// Configuration Web Push
if (vapidKeys.publicKey && vapidKeys.privateKey) {
    webpush.setVapidDetails(
        'mailto:contact@videoboutique.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
}

export { webpush, vapidKeys };

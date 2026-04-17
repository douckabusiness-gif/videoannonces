import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function usePushNotifications() {
    const { data: session } = useSession();
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Vérifier support navigateur
        const supported = 'serviceWorker' in navigator && 'PushManager' in window;
        setIsSupported(supported);
    }, []);

    useEffect(() => {
        if (!isSupported || !session) return;

        // Enregistrer service worker et vérifier abonnement
        registerServiceWorker();
    }, [isSupported, session]);

    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker enregistré');

            const sub = await registration.pushManager.getSubscription();

            setSubscription(sub);
            setIsSubscribed(!!sub);

            console.log('Abonnement actuel:', sub ? 'Actif' : 'Inactif');
        } catch (error) {
            console.error('❌ Erreur enregistrement SW:', error);
        }
    };

    const subscribe = async () => {
        if (!isSupported) {
            alert('Les notifications push ne sont pas supportées par votre navigateur');
            return;
        }

        setIsLoading(true);

        try {
            // Demander permission
            const permission = await Notification.requestPermission();

            if (permission !== 'granted') {
                alert('Permission refusée pour les notifications');
                setIsLoading(false);
                return;
            }

            const registration = await navigator.serviceWorker.ready;

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            // Envoyer au serveur
            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription: sub.toJSON(),
                    userAgent: navigator.userAgent,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur serveur');
            }

            setSubscription(sub);
            setIsSubscribed(true);

            console.log('✅ Abonné aux notifications push');
        } catch (error) {
            console.error('❌ Erreur abonnement:', error);
            alert('Erreur lors de l\'abonnement aux notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        if (!subscription) return;

        setIsLoading(true);

        try {
            await subscription.unsubscribe();

            await fetch('/api/notifications/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                }),
            });

            setSubscription(null);
            setIsSubscribed(false);

            console.log('✅ Désabonné des notifications push');
        } catch (error) {
            console.error('❌ Erreur désabonnement:', error);
            alert('Erreur lors du désabonnement');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isSupported,
        isSubscribed,
        isLoading,
        subscribe,
        unsubscribe,
    };
}

// Utilitaire pour convertir clé VAPID
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

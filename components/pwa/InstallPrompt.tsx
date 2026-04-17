'use client';

import { useEffect, useState } from 'react';
import { X, Share, PlusSquare } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
    const { siteSettings } = useSiteSettings();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Détecter si on est déjà installé/mode standalone
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Détecter iOS
        const userAgent = window.navigator.userAgent;
        const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // Vérifier si l'utilisateur a déjà refusé (cookie/localStorage)
        const hasDeclined = localStorage.getItem('pwa-install-declined');
        if (hasDeclined) {
            const declinedDate = new Date(hasDeclined);
            const daysSinceDecline = (Date.now() - declinedDate.getTime()) / (1000 * 60 * 60 * 24);

            // Réafficher après 7 jours
            if (daysSinceDecline < 7) {
                return;
            }
        }

        // Pour Android/Chrome : Écouter l'événement beforeinstallprompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Afficher après 5 secondes pour Chrome
            setTimeout(() => {
                setShowPrompt(true);
            }, 5000);
        };

        // Pour iOS : Afficher le prompt après une petite délai (car pas d'événement auto)
        if (ios) {
            setTimeout(() => {
                setShowPrompt(true);
            }, 6000);
        }

        window.addEventListener('beforeinstallprompt', handler);

        // Écouter l'installation
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowPrompt(false);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Afficher le prompt natif (Chrome/Android/Desktop)
        deferredPrompt.prompt();

        // Attendre la réponse de l'utilisateur
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
        } else {
            localStorage.setItem('pwa-install-declined', new Date().toISOString());
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-declined', new Date().toISOString());
    };

    // Ne rien afficher si installé ou déjà fermé
    if (isInstalled || !showPrompt) {
        return null;
    }

    // --- VERSION iOS (Guide Manuel) ---
    if (isIOS) {
        return (
            <div className="fixed bottom-6 left-4 right-4 z-[9999] animate-bounce-in">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-black/5">
                    <div className="p-5 flex items-start gap-4">
                        {/* Logo Dynamique */}
                        <div className="flex-shrink-0 w-14 h-14 bg-orange-50 rounded-2xl p-2.5 shadow-sm border border-orange-100">
                            <img
                                src={siteSettings?.logo || "/icon-192.png"}
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-extrabold text-gray-900 text-lg">Installer l'App</h3>
                                <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                Ajoutez <strong>{siteSettings?.siteName || 'VideoBoutique'}</strong> à votre écran d'accueil pour un accès instantané.
                            </p>

                            {/* Instructions iOS */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-xs font-bold">1</span>
                                    <span>Appuyez sur le bouton <Share className="w-4 h-4 inline-block text-blue-500" /> "Partager"</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm text-xs font-bold">2</span>
                                    <span>Sélectionnez <PlusSquare className="w-4 h-4 inline-block" /> "Sur l'écran d'accueil"</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VERSION ANDROID / DESKTOP (Prompt Natif) ---
    if (!deferredPrompt) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[9999] animate-slide-up">
            <div className="max-w-md mx-auto bg-gray-900 rounded-[2rem] shadow-2xl p-6 text-white border border-white/10">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-lg flex-shrink-0">
                        <img
                            src={siteSettings?.logo || "/icon-192.png"}
                            alt="Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-black">{siteSettings?.siteName || 'VideoAnnonces'}</h3>
                        <p className="text-gray-400 text-xs">Installez l'application pour plus de fluidité</p>
                    </div>
                    <button onClick={handleDismiss} className="ml-auto p-2 text-gray-500 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleInstall}
                        className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition shadow-lg active:scale-95"
                    >
                        Installer l'App
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition"
                    >
                        Plus tard
                    </button>
                </div>
            </div>
        </div>
    );
}

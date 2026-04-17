'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

export default function GeoRestrictionBanner() {
    const { t } = useTranslation();
    const [isRestricted, setIsRestricted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Lecture du cookie positionné par le middleware
        const checkGeo = () => {
            const cookies = document.cookie.split('; ');
            const geoCookie = cookies.find(row => row.startsWith('geoRestricted='));
            if (geoCookie) {
                const value = geoCookie.split('=')[1];
                setIsRestricted(value === 'true');
            }
        };

        checkGeo();
        // Optionnel : vérifier périodiquement si besoin, mais le cookie est stable par session
    }, []);

    if (!isRestricted || !isVisible) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-2xl border border-blue-400/30 backdrop-blur-md">
                <div className="flex gap-4">
                    <div className="text-3xl flex-shrink-0 mt-1">🌍</div>
                    <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1 leading-tight">Version Internationale</h4>
                        <p className="text-blue-50 text-sm leading-relaxed">
                            Vous consultez VidéoAnnonces depuis l'extérieur de la Côte d'Ivoire.
                            Le dépôt d'annonces et le contact direct sont restreints pour votre sécurité.
                        </p>
                        <div className="mt-3 flex gap-3">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
                            >
                                J'ai compris
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

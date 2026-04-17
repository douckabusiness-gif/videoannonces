'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ad {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    position: 'top' | 'middle' | 'bottom';
    isActive: boolean;
}

interface AdBannerProps {
    position?: 'top' | 'middle' | 'bottom';
    adId?: string;
    className?: string;
}

export default function AdBanner({ position, adId, className = '' }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAd();
    }, [position, adId]);

    const fetchAd = async () => {
        try {
            let url = '';
            if (adId) {
                url = `/api/ads?id=${adId}`;
            } else if (position) {
                url = `/api/ads?position=${position}`;
            } else {
                setLoading(false);
                return;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.ad) {
                setAd(data.ad);
            }
        } catch (error) {
            console.error('Erreur chargement publicité:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !ad) {
        return null;
    }

    return (
        <div className={`relative group ${className}`}>
            {/* Label "Publicité" */}
            <div className="text-center mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Publicité</span>
            </div>

            {/* Bannière */}
            <Link
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative overflow-hidden rounded-2xl border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group"
            >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                {/* Image de la publicité */}
                <div className="relative aspect-[728/90] md:aspect-[970/90] bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                    <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Badge "Cliquez ici" au hover */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-6 py-3 bg-purple-600 text-white rounded-full font-bold shadow-2xl">
                        Cliquez ici →
                    </div>
                </div>
            </Link>
        </div>
    );
}

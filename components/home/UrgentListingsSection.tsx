'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    videoUrl: string;
    thumbnailUrl: string;
    location: string;
    views: number;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
        rating: number;
    };
}

export default function UrgentListingsSection() {
    const { t } = useTranslation();
    const { siteSettings } = useSiteSettings();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUrgentListings();
    }, []);

    const fetchUrgentListings = async () => {
        try {
            const response = await fetch('/api/listings?urgent=true&limit=6', {
                cache: 'no-store'
            });
            const data = await response.json();
            setListings(data.listings || []);
        } catch (error) {
            console.error('Erreur chargement annonces urgentes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Ne pas afficher la section si pas d'annonces
    if (!loading && listings.length === 0) {
        return null;
    }

    if (loading) {
        return (
            <section className="py-12" style={{ backgroundColor: siteSettings?.urgentBgColor || '#FFFFFF' }}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="h-8 bg-gray-100 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm animate-pulse border border-gray-100">
                                <div className="aspect-[3/4] bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 relative overflow-hidden" style={{ backgroundColor: siteSettings?.urgentBgColor || '#FFFFFF' }}>
            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête de section */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse">
                            <span className="text-xl">⚡</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: siteSettings?.urgentTextColor || '#111827' }}>
                                {t('home.sections.urgent')}
                            </h2>
                        </div>
                    </div>
                    <Link
                        href="/listings?urgent=true"
                        className="text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 group transition-colors"
                    >
                        {t('home.sections.viewAll')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Grille d'annonces */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {listings.map((listing) => (
                        <Link
                            key={listing.id}
                            href={`/listings/${listing.id}?autoplay=true`}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-orange-200"
                            onClick={() => {
                                // Arrêter TOUTES les vidéos avant navigation
                                const allVideos = document.querySelectorAll('video');
                                allVideos.forEach((video) => {
                                    video.pause();
                                    video.currentTime = 0;
                                    video.muted = true;
                                });
                            }}
                            onMouseEnter={(e) => {
                                const video = e.currentTarget.querySelector('video');
                                if (video) {
                                    video.muted = true; // FORCE MUTE VIA JS
                                    video.play().catch(() => { });
                                }
                            }}
                            onMouseLeave={(e) => {
                                const video = e.currentTarget.querySelector('video');
                                if (video) video.pause();
                            }}
                        >
                            {/* Thumbnail vidéo */}
                            <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
                                <video
                                    src={listing.videoUrl}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    muted={true}
                                    loop
                                    playsInline
                                // autoPlay removed to prevent background audio leaks
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                {/* Badge URGENT */}
                                <div className="absolute top-2 left-2 z-20">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded-md text-[10px] font-bold shadow-sm animate-pulse">
                                        <span>⚡</span>
                                        <span>URGENT</span>
                                    </div>
                                </div>

                                {/* Prix */}
                                <div className="absolute bottom-3 left-3 right-3 z-20">
                                    <p className="text-white font-bold text-lg leading-tight mb-0.5 drop-shadow-md">
                                        {listing.price.toLocaleString()} FCFA
                                    </p>
                                    <p className="text-white/80 text-xs line-clamp-1 drop-shadow-sm">
                                        {listing.title}
                                    </p>
                                </div>
                            </div>

                            {/* Info User */}
                            <div className="p-3 bg-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-[10px] font-bold text-orange-600">
                                        {listing.user.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-900 truncate">{listing.user.name}</p>
                                    </div>
                                    <div className="text-[10px] text-gray-400">
                                        {listing.location}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section >
    );
}

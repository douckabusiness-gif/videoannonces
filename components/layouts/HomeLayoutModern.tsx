'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import HomeBanner from '../HomeBanner';
import AdBanner from '../AdBanner';
import UrgentListingsSection from '../home/UrgentListingsSection';
import PremiumShopsSection from '../home/PremiumShopsSection';

interface LayoutProps {
    colors: any;
    siteSettings: any;
}

export default function HomeLayoutModern({ colors, siteSettings: initialSiteSettings }: LayoutProps) {
    const siteSettings = initialSiteSettings;
    const { t } = useTranslation();
    const [category, setCategory] = useState('');
    const [listings, setListings] = useState<any[]>([]);
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await fetch('/api/categories?onlyActive=true&onlyMain=true');
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setDynamicCategories(catData);
                }

                // Fetch recent listings
                const listRes = await fetch('/api/listings?limit=12&sort=recent');
                if (listRes.ok) {
                    const listData = await listRes.json();
                    setListings(listData.listings || []);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Default sections if none provided
    const defaultSections = [
        { id: 'hero', type: 'hero' },
        { id: 'categories', type: 'categories' },
        { id: 'urgent', type: 'urgent' },
        { id: 'recent', type: 'recent' },
    ];

    const rawSections = siteSettings.homepageSections || defaultSections;
    const sections = (Array.isArray(rawSections) ? rawSections : defaultSections).filter(
        (s: any) => s?.id !== 'shops' && s?.type !== 'shops'
    );

    // Use colors from props or fallbacks
    const primaryColor = colors?.primary || '#FF6B35';
    const secondaryColor = colors?.secondary || '#F7931E';
    const accentColor = colors?.accent || '#FDC830';
    const backgroundColor = colors?.background || '#FFF7ED';

    const renderSection = (section: any) => {
        switch (section.id) {
            case 'hero':
                return (
                    <section key={section.id} className="relative py-12 overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="container mx-auto px-4 relative z-10">
                            <div className="max-w-2xl mx-auto text-center">
                                {/* Titre */}
                                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">
                                    {siteSettings.heroTitle === 'Achetez et Vendez avec des Annonces Vidéo' ? t('home.hero.title') : siteSettings.heroTitle}
                                </h1>
                                <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-sm">
                                    {siteSettings.heroSubtitle === 'La marketplace moderne où chaque produit prend vie en vidéo' ? t('home.hero.subtitle') : siteSettings.heroSubtitle}
                                </p>

                                {/* Formulaire de recherche */}
                                <div className="mb-8">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                                        <div className="flex flex-col md:flex-row gap-3">
                                            {/* Barre de recherche */}
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder={t('home.hero.searchPlaceholder')}
                                                    className="w-full px-6 py-4 rounded-xl border-2 border-white/30 bg-white/90 focus:bg-white focus:border-white focus:outline-none text-gray-700 placeholder-gray-500 shadow-sm transition-all"
                                                    style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                                                />
                                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>

                                            {/* Sélecteur de catégorie */}
                                            <select
                                                className="px-6 py-4 rounded-xl border-2 border-white/30 bg-white/90 focus:bg-white focus:border-white focus:outline-none text-gray-700 shadow-sm font-medium"
                                                onChange={(e) => setCategory(e.target.value)}
                                                value={category}
                                            >
                                                <option value="">{t('home.hero.allCategories')}</option>
                                                {dynamicCategories.map((cat: any) => (
                                                    <option key={cat.id} value={cat.slug}>
                                                        {cat.icon} {cat.nameFr}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Bouton rechercher */}
                                            <button
                                                className="px-8 py-4 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200 font-bold flex items-center gap-2 justify-center transition-all"
                                                style={{ color: primaryColor }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                {t('home.hero.searchButton')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'banner':
                return <HomeBanner key={section.id} />;
            case 'ad':
                return section.adId ? (
                    <div key={section.id} className="container mx-auto px-4 py-8">
                        <AdBanner adId={section.adId} />
                    </div>
                ) : null;
            case 'urgent':
                return (
                    <UrgentListingsSection key={section.id} />
                );
            case 'shops':
                if (siteSettings?.shopsEnabled === false) return null;
                return (
                    <PremiumShopsSection key={section.id} />
                );
            case 'categories':
                return null;
            case 'recent':
                // Ne pas afficher la section si aucune annonce
                if (!loading && listings.length === 0) {
                    return null;
                }

                return (
                    <section key={section.id} className="py-20" style={{ backgroundColor: siteSettings?.recentBgColor || '#FFFFFF' }}>
                        <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold" style={{ color: siteSettings?.recentTextColor || '#111827' }}>
                                    {t('home.sections.recent')}
                                </h2>
                                <Link
                                    href="/listings"
                                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 group"
                                >
                                    {t('home.sections.viewAll')}
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>

                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                                            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {listings.slice(0, 12).map((listing: any) => (
                                        <div key={listing.id}>
                                            <Link
                                                href={`/listings/${listing.id}?autoplay=true`}
                                                className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 transform block h-full"
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
                                                        video.muted = true;
                                                        video.play().catch(() => { });
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    const video = e.currentTarget.querySelector('video');
                                                    if (video) video.pause();
                                                }}
                                            >
                                                {/* Listing Card Content */}
                                                <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
                                                    <video
                                                        src={listing.videoUrl}
                                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                        muted={true}
                                                        loop
                                                        playsInline
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                        <span>👁️</span> {listing.views || 0}
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                        <p className="text-white font-bold text-lg mb-1 drop-shadow-md">
                                                            {listing.price?.toLocaleString() || 0} FCFA
                                                        </p>
                                                        <p className="text-white/90 text-sm line-clamp-1 font-medium drop-shadow-sm">
                                                            {listing.title}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-white relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 p-0.5">
                                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-orange-600 font-bold text-xs">
                                                                {listing.user?.name?.[0] || '?'}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                                                {listing.user?.name || 'Inconnu'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <span>📍 {listing.location || 'Côte d\'Ivoire'}</span>
                                                                <span>•</span>
                                                                <span className="text-orange-400">★ {(listing.user?.rating || 5).toFixed(1)}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative" style={{ background: backgroundColor }}>
            {/* Subtle Gradient Overlay for 'Modern' feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/5 pointer-events-none" />

            <style jsx global>{`
        :root {
          --color-primary: ${primaryColor};
          --color-secondary: ${secondaryColor};
          --color-accent: ${accentColor};
          --color-background: ${backgroundColor};
        }
      `}</style>

            {/* Stories Bar - DISABLED FOR MVP */}

            {/* Dynamic Sections Rendering */}
            {sections.map((section: any) => renderSection(section))}
        </div>
    );
}

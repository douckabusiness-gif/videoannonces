'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';

import UrgentListingsSection from '@/components/home/UrgentListingsSection';
import PremiumShopsSection from '@/components/home/PremiumShopsSection';
import HomeBanner from '@/components/HomeBanner';
import AdBanner from '@/components/AdBanner';

interface Listing {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    category: string;
    views: number;
    location: string;
}

interface LayoutProps {
    siteSettings?: {
        siteName: string;
        siteSlogan: string;
        siteDescription: string;
        logo: string | null;
        heroTitle?: string;
        heroSubtitle?: string;
        urgentSectionTitle?: string;
        recentSectionTitle?: string;
        shopsSectionTitle?: string;
        homepageSections?: any[];
    };
}

export default function HomeLayoutNebulaGrid({ siteSettings: initialSiteSettings }: LayoutProps) {
    const { t } = useTranslation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [siteSettings, setSiteSettings] = useState({
        heroTitle: initialSiteSettings?.heroTitle || 'VIDEOBOUTIQUE',
        heroSubtitle: initialSiteSettings?.heroSubtitle || 'Votre Marketplace Premium',
        urgentSectionTitle: initialSiteSettings?.urgentSectionTitle || 'Annonces Urgentes',
        recentSectionTitle: initialSiteSettings?.recentSectionTitle || 'Découvertes Récentes',
        shopsSectionTitle: initialSiteSettings?.shopsSectionTitle || 'Boutiques Premium',
    });

    const [sections, setSections] = useState<any[]>(
        initialSiteSettings?.homepageSections?.filter((s: any) => s.enabled) || [
            { id: 'hero', type: 'system' },
            { id: 'banner', type: 'system' },
            { id: 'stories', type: 'system' },
            { id: 'urgent', type: 'system' },
            { id: 'shops', type: 'system' },
            { id: 'recent', type: 'system' },
            { id: 'categories', type: 'system' },
        ]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        fetchData();
        fetchSiteSettings();
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const fetchSiteSettings = async () => {
        try {
            const response = await fetch('/api/settings/site');
            if (response.ok) {
                const data = await response.json();
                if (data.heroTitle || data.heroSubtitle) {
                    setSiteSettings({
                        heroTitle: data.heroTitle || 'VIDEOBOUTIQUE',
                        heroSubtitle: data.heroSubtitle || 'Votre Marketplace Premium',
                        urgentSectionTitle: data.urgentSectionTitle || 'Annonces Urgentes',
                        recentSectionTitle: data.recentSectionTitle || 'Découvertes Récentes',
                        shopsSectionTitle: data.shopsSectionTitle || 'Boutiques Premium',
                    });
                }

                if (data.homepageSections && Array.isArray(data.homepageSections) && data.homepageSections.length > 0) {
                    setSections(data.homepageSections.filter((s: any) => s.enabled));
                } else {
                    setSections([
                        { id: 'hero', type: 'system' },
                        { id: 'banner', type: 'system' },
                        { id: 'stories', type: 'system' },
                        { id: 'urgent', type: 'system' },
                        { id: 'shops', type: 'system' },
                        { id: 'recent', type: 'system' },
                        { id: 'categories', type: 'system' },
                    ]);
                }
            }
        } catch (error) {
            console.error('Erreur chargement paramètres site:', error);
        }
    };

    const fetchData = async () => {
        try {
            const recentRes = await fetch('/api/listings?limit=12');
            const recentData = await recentRes.json();
            setListings(recentData.listings || []);
        } catch (error) {
            console.error('Erreur chargement données:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', name: t('home.categories.all'), icon: '🏪' },
        { id: 'electronics', name: t('home.categories.electronics'), icon: '📱' },
        { id: 'fashion', name: t('home.categories.fashion'), icon: '👔' },
        { id: 'vehicles', name: t('home.categories.vehicles'), icon: '🚗' },
        { id: 'real-estate', name: t('home.categories.realEstate'), icon: '🏠' },
        { id: 'services', name: t('home.categories.services'), icon: '🛠️' },
        { id: 'home', name: t('home.categories.home'), icon: '🪑' },
        { id: 'sports', name: t('home.categories.sports'), icon: '⚽' },
        { id: 'other', name: t('home.categories.other'), icon: '📦' },
    ];

    const renderSection = (section: any) => {
        switch (section.id) {
            case 'hero':
                return (
                    <div key={section.id} className="text-center mb-16">
                        <h1 className="text-7xl font-black mb-4 relative inline-block">
                            <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
                            <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {siteSettings.heroTitle}
                            </span>
                        </h1>

                        <div className="max-w-3xl mx-auto mb-8">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-50"></div>
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Rechercher des produits..."
                                                className="w-full px-6 py-4 rounded-xl border-2 border-purple-500/30 bg-black/30 focus:bg-black/50 focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 shadow-sm"
                                            />
                                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <select className="px-6 py-4 rounded-xl border-2 border-purple-500/30 bg-black/30 focus:bg-black/50 focus:border-purple-400 focus:outline-none text-white shadow-sm font-medium">
                                            <option value="">{t('home.hero.allCategories')}</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 transition shadow-xl hover:shadow-purple-500/50 hover:scale-105 transform duration-200 font-bold flex items-center gap-2 justify-center">
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
                );
            case 'banner':
                return <HomeBanner key={section.id} />;
            // STORIES TEMPORARILY DISABLED FOR MVP
            // case 'stories':

            case 'ad':
                return section.adId ? (
                    <div key={section.id} className="container mx-auto px-4 py-8">
                        <AdBanner adId={section.adId} />
                    </div>
                ) : null;
            case 'urgent':
                return <UrgentListingsSection key={section.id} />;
            case 'shops':
                return <PremiumShopsSection key={section.id} />;
            case 'recent':
                // Ne pas afficher la section si aucune annonce
                if (!loading && listings.length === 0) {
                    return null;
                }

                return (
                    <div key={section.id} className="mb-20">
                        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-5xl">💫</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                {siteSettings.recentSectionTitle === 'Découvertes Récentes' ? t('home.sections.recent') : siteSettings.recentSectionTitle}
                            </span>
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {listings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}?autoplay=true`}
                                    className="group relative transform transition-all duration-500 hover:scale-105"
                                >
                                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                                        <div className="aspect-square overflow-hidden relative">
                                            <video
                                                src={listing.thumbnailUrl}
                                                muted
                                                loop
                                                playsInline
                                                autoPlay
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/20">
                                                {listing.category}
                                            </div>
                                            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] text-white">
                                                <span>👁️</span>
                                                <span>{listing.views}</span>
                                            </div>
                                        </div>

                                        <div className="p-3 relative">
                                            <h3 className="text-sm font-bold text-white truncate mb-1">
                                                {listing.title}
                                            </h3>
                                            <p className="text-base font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                                {listing.price.toLocaleString()} F
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            case 'categories':
                return (
                    <div key={section.id} className="mb-20">
                        <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
                            <span className="text-5xl">🌌</span>
                            {t('home.sections.categories')}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className="group relative p-4 rounded-xl transition-all duration-500 transform hover:scale-110 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 hover:border-purple-400/50"
                                >
                                    <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                                        {cat.icon}
                                    </div>
                                    <div className="text-xs font-bold tracking-wide text-purple-200">
                                        {cat.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200 font-medium">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-black relative overflow-hidden">
            <div
                className="fixed inset-0 pointer-events-none opacity-30"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
                }}
            />

            <div className="fixed inset-0 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7 + 0.3,
                            animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {sections.map(section => renderSection(section))}            </div>

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

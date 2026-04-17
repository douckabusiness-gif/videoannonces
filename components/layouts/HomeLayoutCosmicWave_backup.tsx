'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UrgentListingsSection from '@/components/home/UrgentListingsSection';
import PremiumShopsSection from '@/components/home/PremiumShopsSection';
import HomeBanner from '@/components/HomeBanner';
import AdBanner from '@/components/AdBanner';

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

interface LayoutProps {
    colors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export default function HomeLayoutModern({ colors }: LayoutProps) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [siteSettings, setSiteSettings] = useState({
        heroTitle: 'Achetez et Vendez avec des Annonces Vidéo',
        heroSubtitle: 'La marketplace moderne où chaque produit prend vie en vidéo',
        urgentSectionTitle: 'Annonces Urgentes',
        recentSectionTitle: 'Annonces Récentes',
        shopsSectionTitle: 'Boutiques Premium',
    });

    const [sections, setSections] = useState<any[]>([]);

    const primaryColor = colors?.primary || '#FF6B35';
    const secondaryColor = colors?.secondary || '#F7931E';
    const accentColor = colors?.accent || '#FDC830';

    useEffect(() => {
        fetchListings();
        fetchSiteSettings();
    }, [category]);

    const fetchSiteSettings = async () => {
        try {
            const response = await fetch('/api/settings/site');
            if (response.ok) {
                const data = await response.json();
                if (data.heroTitle || data.heroSubtitle) {
                    setSiteSettings({
                        heroTitle: data.heroTitle || 'Achetez et Vendez avec des Annonces Vidéo',
                        heroSubtitle: data.heroSubtitle || 'La marketplace moderne où chaque produit prend vie en vidéo',
                        urgentSectionTitle: data.urgentSectionTitle || 'Annonces Urgentes',
                        recentSectionTitle: data.recentSectionTitle || 'Annonces Récentes',
                        shopsSectionTitle: data.shopsSectionTitle || 'Boutiques Premium',
                    });
                }

                // Set sections from settings or default
                if (data.homepageSections && Array.isArray(data.homepageSections) && data.homepageSections.length > 0) {
                    setSections(data.homepageSections.filter((s: any) => s.enabled));
                } else {
                    // Default sections
                    setSections([
                        { id: 'hero', type: 'system' },
                        { id: 'banner', type: 'system' },
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

    const fetchListings = async () => {
        try {
            const url = category
                ? `/api/listings?category=${category}`
                : '/api/listings';

            const response = await fetch(url);
            const data = await response.json();

            setListings(data.listings || []);
        } catch (error) {
            console.error('Erreur chargement annonces:', error);
        } finally {
            setLoading(false);
        };
    };

    const categories = [
        { id: 'all', name: 'Tout', icon: '🏪' },
        { id: 'electronics', name: 'Électronique', icon: '📱' },
        { id: 'fashion', name: 'Mode', icon: '👔' },
        { id: 'vehicles', name: 'Véhicules', icon: '🚗' },
        { id: 'real-estate', name: 'Immobilier', icon: '🏠' },
        { id: 'services', name: 'Services', icon: '🛠️' },
        { id: 'home', name: 'Maison', icon: '🪑' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'other', name: 'Autre', icon: '📦' },
    ];

    const renderSection = (section: any) => {
        switch (section.id) {
            case 'hero':
                return (
                    <section key={section.id} className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
                        </div>

                        <div className="container mx-auto px-4 relative z-10">
                            <div className="max-w-3xl mx-auto text-center">
                                {/* Titre */}
                                <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                                    {siteSettings.heroTitle}
                                </h1>
                                <p className="text-xl md:text-2xl text-orange-100 mb-8">
                                    {siteSettings.heroSubtitle}
                                </p>

                                {/* Formulaire de recherche en dessous du titre */}
                                <div className="mb-8">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                                        <div className="flex flex-col md:flex-row gap-3">
                                            {/* Barre de recherche */}
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher des annonces..."
                                                    className="w-full px-6 py-4 rounded-xl border-2 border-white/30 bg-white/90 focus:bg-white focus:border-orange-300 focus:outline-none text-gray-700 placeholder-gray-500 shadow-sm"
                                                />
                                                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>

                                            {/* Sélecteur de catégorie */}
                                            <select className="px-6 py-4 rounded-xl border-2 border-white/30 bg-white/90 focus:bg-white focus:border-orange-300 focus:outline-none text-gray-700 shadow-sm font-medium">
                                                <option value="">Toutes catégories</option>
                                                <option value="electronics">📱 Électronique</option>
                                                <option value="fashion">👔 Mode</option>
                                                <option value="vehicles">🚗 Véhicules</option>
                                                <option value="real-estate">🏠 Immobilier</option>
                                                <option value="services">🛠️ Services</option>
                                                <option value="home">🪑 Maison</option>
                                                <option value="sports">⚽ Sports</option>
                                                <option value="other">📦 Autre</option>
                                            </select>

                                            {/* Bouton rechercher */}
                                            <button className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200 font-bold flex items-center gap-2 justify-center">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                Rechercher
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/listings"
                                        className="px-8 py-4 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200 font-bold text-lg"
                                    >
                                        🎥 Explorer les annonces
                                    </Link>
                                    <Link
                                        href="/dashboard/listings/new"
                                        className="px-8 py-4 bg-orange-800/50 backdrop-blur-sm text-white rounded-xl hover:bg-orange-800/70 transition border-2 border-white/20 hover:border-white/40 hover:scale-105 transform duration-200 font-bold text-lg"
                                    >
                                        ✨ Créer une annonce
                                    </Link>
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
                return (
                    <PremiumShopsSection key={section.id} />
                );
            case 'categories':
                return (
                    <section key={section.id} className="py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                Parcourir par catégorie
                            </h2>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id === 'all' ? '' : cat.id)}
                                        className={`p-4 rounded-xl transition-all duration-300 hover:scale-110 ${(category === '' && cat.id === 'all') || category === cat.id
                                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                                            : 'bg-white hover:bg-orange-50 text-gray-700 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{cat.icon}</div>
                                        <div className="text-xs font-medium">{cat.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'recent':
                return (
                    <section key={section.id} className="py-16 bg-gradient-to-br from-gray-50 to-orange-50/30">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Toutes les annonces
                                </h2>
                                <Link
                                    href="/listings"
                                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2 group"
                                >
                                    Voir tout
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
                                    {listings.slice(0, 12).map((listing) => (
                                        <Link
                                            key={listing.id}
                                            href={`/listings/${listing.id}`}
                                            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
                                        >
                                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                                <video
                                                    src={listing.videoUrl}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    muted
                                                    loop
                                                    playsInline
                                                    autoPlay
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
                                                    {listing.views} vues
                                                </div>
                                            </div>

                                            <div className="p-3">
                                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-orange-600 transition">
                                                    {listing.title}
                                                </h3>
                                                <p className="text-lg font-bold text-orange-600 mb-2">
                                                    {listing.price.toLocaleString()} DH
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">📍 {listing.location}</p>

                                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                                                        {listing.user.name[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-gray-900 truncate">
                                                            {listing.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ⭐ {listing.user.rating.toFixed(1)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!loading && listings.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Aucune annonce trouvée</p>
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <style jsx global>{`
        :root {
          --color-primary: ${primaryColor};
          --color-secondary: ${secondaryColor};
          --color-accent: ${accentColor};
        }
      `}</style>

            {/* Dynamic Sections Rendering */}
            {sections.map(section => renderSection(section))}
        </div>
    );
}

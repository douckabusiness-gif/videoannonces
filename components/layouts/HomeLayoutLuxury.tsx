'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';

import UrgentListingsSection from '@/components/home/UrgentListingsSection';
import PremiumShopsSection from '@/components/home/PremiumShopsSection';
import AdBanner from '@/components/AdBanner';
import HomeBanner from '@/components/HomeBanner';

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
    };
}

export default function HomeLayoutLuxury({ colors, siteSettings: initialSiteSettings }: LayoutProps) {
    const { t } = useTranslation();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [scrollY, setScrollY] = useState(0);
    const [siteSettings, setSiteSettings] = useState({
        heroTitle: initialSiteSettings?.heroTitle || 'VIDEOBOUTIQUE',
        heroSubtitle: initialSiteSettings?.heroSubtitle || 'Votre Marketplace Vidéo en Ligne',
        urgentSectionTitle: initialSiteSettings?.urgentSectionTitle || 'URGENCES',
        recentSectionTitle: initialSiteSettings?.recentSectionTitle || 'GALAXIE PREMIUM',
        shopsSectionTitle: initialSiteSettings?.shopsSectionTitle || 'GALAXIE PREMIUM',
    });

    const [sections, setSections] = useState<any[]>([]);

    const primaryColor = colors?.primary || '#FF6B35';
    const secondaryColor = colors?.secondary || '#F7931E';
    const accentColor = colors?.accent || '#FDC830';

    useEffect(() => {
        fetchListings();
        fetchSiteSettings();

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        const handleScroll = () => setScrollY(window.scrollY);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [category]);

    const fetchSiteSettings = async () => {
        try {
            const response = await fetch('/api/settings/site');
            if (response.ok) {
                const data = await response.json();
                if (data.heroTitle || data.heroSubtitle) {
                    setSiteSettings({
                        heroTitle: data.heroTitle || 'VIDEOBOUTIQUE',
                        heroSubtitle: data.heroSubtitle || 'Votre Marketplace Vidéo en Ligne',
                        urgentSectionTitle: data.urgentSectionTitle || 'URGENCES',
                        recentSectionTitle: data.recentSectionTitle || 'GALAXIE PREMIUM',
                        shopsSectionTitle: data.shopsSectionTitle || 'GALAXIE PREMIUM',
                    });
                }

                // Set sections from settings or default
                if (data.homepageSections && Array.isArray(data.homepageSections) && data.homepageSections.length > 0) {
                    setSections(data.homepageSections.filter((s: any) => s.enabled));
                } else {
                    // Default sections
                    setSections([
                        { id: 'hero', type: 'system' },
                        { id: 'urgent', type: 'system' },
                        { id: 'shops', type: 'system' },
                        { id: 'categories', type: 'system' },
                        { id: 'recent', type: 'system' },
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
                    <section key={section.id} className="relative py-16 overflow-hidden">
                        <div className="container mx-auto px-8 relative z-10 text-center">
                            <div className="mb-4 relative inline-block">
                                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-50 animate-pulse" />
                                <h1 className="relative text-5xl md:text-6xl font-black tracking-tighter">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]"
                                        style={{
                                            backgroundSize: '200% auto',
                                            backgroundImage: 'linear-gradient(90deg, #a78bfa 0%, #ec4899 25%, #60a5fa 50%, #a78bfa 75%, #ec4899 100%)',
                                        }}>
                                        {siteSettings.heroTitle}
                                    </span>
                                </h1>
                            </div>

                            <div className="max-w-3xl mx-auto mb-6">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500" />

                                    <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-500">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder={t('home.luxury.search.placeholder')}
                                                    className="w-full px-4 py-3 rounded-lg border border-purple-500/30 bg-black/50 focus:bg-black/70 focus:border-purple-400 focus:outline-none text-white placeholder-purple-300/50 shadow-lg font-medium transition-all"
                                                />
                                            </div>

                                            <select className="px-4 py-3 rounded-lg border border-purple-500/30 bg-black/50 focus:bg-black/70 focus:border-purple-400 focus:outline-none text-white shadow-lg font-medium cursor-pointer transition-all">
                                                <option value="">{t('home.luxury.search.categories')}</option>
                                                <option value="electronics">📱 {t('home.categories.electronics')}</option>
                                                <option value="fashion">👔 {t('home.categories.fashion')}</option>
                                                <option value="vehicles">🚗 {t('home.categories.vehicles')}</option>
                                                <option value="real-estate">🏠 {t('home.categories.realEstate')}</option>
                                                <option value="services">🛠️ {t('home.categories.services')}</option>
                                                <option value="home">🪑 {t('home.categories.home')}</option>
                                                <option value="sports">⚽ {t('home.categories.sports')}</option>
                                                <option value="other">📦 {t('home.categories.other')}</option>
                                            </select>

                                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 transition-all shadow-xl hover:shadow-purple-500/50 hover:scale-105 transform duration-300 font-bold flex items-center gap-2 justify-center">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                {t('home.luxury.cta.explore')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/listings"
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl hover:shadow-purple-500/50 hover:scale-105 transform duration-300 font-bold"
                                >
                                    {t('home.luxury.cta.discover')}
                                </Link>
                                <Link
                                    href="/dashboard/listings/new"
                                    className="px-8 py-3 bg-transparent text-white rounded-lg border border-purple-400/50 hover:border-purple-400 hover:bg-purple-500/20 transition-all backdrop-blur-sm hover:scale-105 transform duration-300 font-bold"
                                >
                                    {t('home.luxury.cta.create')}
                                </Link>
                            </div>
                        </div>
                    </section>
                );
            case 'banner':
                return <HomeBanner key={section.id} />;
            case 'ad':
                return section.adId ? (
                    <div key={section.id} className="container mx-auto px-8 py-8">
                        <AdBanner adId={section.adId} />
                    </div>
                ) : null;
            case 'urgent':
                return (
                    <section key={section.id} className="py-16 relative">
                        <div className="container mx-auto px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-4 animate-pulse">
                                    🔥 {siteSettings.urgentSectionTitle === 'URGENCES' ? t('home.luxury.sections.urgent') : siteSettings.urgentSectionTitle}
                                </h2>
                                <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-yellow-500 mx-auto rounded-full" />
                            </div>
                            <UrgentListingsSection />
                        </div>
                    </section>
                );
            case 'shops':
                return (
                    <section key={section.id} className="py-16 relative">
                        <div className="container mx-auto px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 mb-4">
                                    👑 {siteSettings.shopsSectionTitle === 'GALAXIE PREMIUM' ? t('home.luxury.sections.shops') : siteSettings.shopsSectionTitle}
                                </h2>
                                <div className="w-32 h-2 bg-gradient-to-r from-yellow-500 to-pink-500 mx-auto rounded-full" />
                            </div>
                            <PremiumShopsSection />
                        </div>
                    </section>
                );
            case 'categories':
                return (
                    <section key={section.id} className="py-8 relative">
                        <div className="container mx-auto px-8">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-3">
                                    {t('home.luxury.sections.categories')}
                                </h2>
                                <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto rounded-full" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id === 'all' ? '' : cat.id)}
                                        className={`group relative p-4 rounded-xl transition-all duration-500 transform hover:scale-110 ${(category === '' && cat.id === 'all') || category === cat.id
                                            ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50 scale-105'
                                            : 'bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 hover:border-purple-400/50'
                                            }`}
                                    >
                                        <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                                            {cat.icon}
                                        </div>
                                        <div className={`text-xs font-bold tracking-wide ${(category === '' && cat.id === 'all') || category === cat.id
                                            ? 'text-white'
                                            : 'text-purple-200'
                                            }`}>
                                            {cat.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'recent':
                // Ne pas afficher la section si aucune annonce
                if (!loading && listings.length === 0) {
                    return null;
                }

                return (
                    <section key={section.id} className="py-16 relative">
                        <div className="container mx-auto px-8">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
                                        {category ? categories.find(c => c.id === category)?.name : t('home.luxury.sections.collection')}
                                    </h2>
                                    <div className="w-32 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full" />
                                </div>
                                <Link
                                    href="/listings"
                                    className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-2 group text-lg"
                                >
                                    {t('home.sections.viewAll')}
                                    <span className="group-hover:translate-x-2 transition-transform text-2xl">→</span>
                                </Link>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 animate-pulse border border-white/10">
                                            <div className="bg-white/10 aspect-square rounded-xl mb-3" />
                                            <div className="bg-white/10 h-3 rounded mb-2" />
                                            <div className="bg-white/10 h-3 rounded w-2/3" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {listings.slice(0, 12).map((listing) => (
                                        <Link
                                            key={listing.id}
                                            href={`/listings/${listing.id}?autoplay=true`}
                                            className="group relative transform transition-all duration-500 hover:scale-105 hover:z-10"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500" />

                                            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-400/50 transition-all">
                                                <div className="relative aspect-square bg-gradient-to-br from-purple-900/20 to-pink-900/20 overflow-hidden">
                                                    <video
                                                        src={listing.videoUrl}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        muted
                                                        loop
                                                        playsInline
                                                        autoPlay
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 backdrop-blur-md text-white rounded-lg text-xs font-bold border border-white/20">
                                                        {listing.views} 👁️
                                                    </div>
                                                </div>

                                                <div className="p-3 space-y-2">
                                                    <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                                                        {listing.title}
                                                    </h3>
                                                    <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                                        {listing.price.toLocaleString()} <span className="text-xs">DH</span>
                                                    </p>
                                                    <p className="text-xs text-purple-300/70 flex items-center gap-1">
                                                        <span>📍</span> {listing.location}
                                                    </p>

                                                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/50">
                                                            {listing.user.name[0]}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-white truncate">
                                                                {listing.user.name}
                                                            </p>
                                                            <p className="text-[10px] text-purple-300/70 flex items-center gap-1">
                                                                <span className="text-yellow-400">⭐</span> {listing.user.rating.toFixed(1)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!loading && listings.length === 0 && (
                                <div className="text-center py-16">
                                    <p className="text-purple-400 text-xl font-light">{t('home.luxury.sections.noListings')}</p>
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
        <div className="min-h-screen bg-black relative overflow-hidden">
            <style jsx global>{`
                :root {
                    --color-primary: ${primaryColor};
                    --color-secondary: ${secondaryColor};
                    --color-accent: ${accentColor};
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Fond Cosmique Animé */}
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-60 transition-all duration-1000"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
                            rgba(139, 92, 246, 0.6) 0%, 
                            rgba(236, 72, 153, 0.4) 20%, 
                            rgba(59, 130, 246, 0.3) 40%, 
                            rgba(16, 185, 129, 0.2) 60%, 
                            transparent 80%)`,
                    }}
                />

                <div className="absolute top-0 left-0 w-full h-full">
                    <div
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-[rotate-slow_30s_linear_infinite]"
                        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                    />
                    <div
                        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] animate-[rotate-slow_25s_linear_infinite_reverse]"
                        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] animate-[rotate-slow_20s_linear_infinite]"
                        style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)` }}
                    />
                </div>

                <div className="absolute inset-0">
                    {[...Array(150)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full"
                            style={{
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `pulse-glow ${Math.random() * 3 + 2}s infinite`,
                                animationDelay: `${Math.random() * 3}s`,
                                boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`,
                            }}
                        />
                    ))}
                </div>

                <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#EC4899" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[...Array(20)].map((_, i) => (
                        <line
                            key={i}
                            x1={`${Math.random() * 100}%`}
                            y1={`${Math.random() * 100}%`}
                            x2={`${Math.random() * 100}%`}
                            y2={`${Math.random() * 100}%`}
                            stroke="url(#line-gradient)"
                            strokeWidth="1"
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </svg>
            </div>

            <div className="relative z-10">
                {/* Stories Bar - DISABLED FOR MVP */}


                {/* Dynamic Sections Rendering */}
                {sections.map(section => renderSection(section))}
            </div>
        </div>
    );
}

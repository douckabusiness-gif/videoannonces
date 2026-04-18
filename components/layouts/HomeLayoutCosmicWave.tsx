'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, LayoutGrid, Compass, Zap, Crown, ChevronRight } from 'lucide-react';

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

export default function HomeLayoutCosmicWave({ siteSettings: initialSiteSettings }: LayoutProps) {
    const { t } = useTranslation();
    const [scrollY, setScrollY] = useState(0);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
    const [siteSettings, setSiteSettings] = useState({
        heroTitle: initialSiteSettings?.heroTitle || 'VIDEOBOUTIQUE',
        heroSubtitle: initialSiteSettings?.heroSubtitle || 'Votre Marketplace Vidéo en Ligne',
        urgentSectionTitle: initialSiteSettings?.urgentSectionTitle || 'Annonces Urgentes',
        recentSectionTitle: initialSiteSettings?.recentSectionTitle || 'Annonces Récentes',
        shopsSectionTitle: initialSiteSettings?.shopsSectionTitle || 'Boutiques Premium',
    });

    const [sections, setSections] = useState<any[]>(
        (initialSiteSettings?.homepageSections && Array.isArray(initialSiteSettings.homepageSections))
            ? initialSiteSettings.homepageSections.filter((s: any) => s.enabled)
            : [
                { id: 'hero', type: 'system' },
                { id: 'categories', type: 'system' },
                { id: 'banner', type: 'system' },
                { id: 'urgent', type: 'system' },
                { id: 'shops', type: 'system' },
                { id: 'recent', type: 'system' },
            ]
    );

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        fetchData();
        fetchCategories();
        fetchSiteSettings();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [category]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories?onlyMain=true');
            if (response.ok) {
                const data = await response.json();
                setDynamicCategories(data);
            }
        } catch (error) {
            console.error('[PremiumLayout] Erreur chargement catégories:', error);
        }
    };

    const fetchSiteSettings = async () => {
        try {
            const response = await fetch('/api/settings/site');
            if (response.ok) {
                const data = await response.json();
                if (data.heroTitle || data.heroSubtitle) {
                    setSiteSettings({
                        heroTitle: data.heroTitle || 'VIDEOBOUTIQUE',
                        heroSubtitle: data.heroSubtitle || 'Votre Marketplace Vidéo en Ligne',
                        urgentSectionTitle: data.urgentSectionTitle || 'Annonces Urgentes',
                        recentSectionTitle: data.recentSectionTitle || 'Annonces Récentes',
                        shopsSectionTitle: data.shopsSectionTitle || 'Boutiques Premium',
                    });
                }

                if (data.homepageSections && Array.isArray(data.homepageSections) && data.homepageSections.some((s: any) => s.enabled)) {
                    setSections(data.homepageSections.filter((s: any) => s.enabled));
                } else {
                    setSections([
                        { id: 'hero', type: 'system' },
                        { id: 'categories', type: 'system' },
                        { id: 'banner', type: 'system' },
                        { id: 'urgent', type: 'system' },
                        { id: 'shops', type: 'system' },
                        { id: 'recent', type: 'system' },
                    ]);
                }
            }
        } catch (error) {
            console.error('[PremiumLayout] Erreur chargement paramètres site:', error);
        }
    };

    const fetchData = async () => {
        try {
            const url = category
                ? `/api/listings?limit=12&category=${category}`
                : '/api/listings?limit=12';
            const recentRes = await fetch(url);
            const recentData = await recentRes.json();
            setListings(recentData.listings || []);
        } catch (error) {
            console.error('[PremiumLayout] Erreur chargement données:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSection = (section: any) => {
        switch (section.id) {
            case 'hero':
                return (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24 relative"
                    >
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />

                        <motion.h1
                            className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-b from-white via-green-200 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                            {siteSettings.heroTitle}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl text-green-100/70 mb-12 font-medium tracking-widest uppercase italic"
                        >
                            {siteSettings.heroSubtitle}
                        </motion.p>

                        <div className="max-w-4xl mx-auto mb-8 px-4">
                            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-2 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] group hover:border-green-500/50 transition-colors duration-500">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <div className="flex-1 relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-green-400">
                                            <Search size={22} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Trouvez votre bonheur sur VideoAnnonces..."
                                            className="w-full pl-16 pr-6 py-5 rounded-2xl bg-black/40 border-none focus:ring-2 focus:ring-green-500/50 text-white placeholder-green-200/30 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-row md:flex-row gap-2">
                                        <select
                                            className="px-6 py-5 rounded-2xl bg-black/40 border-none text-white focus:ring-2 focus:ring-green-500/50 appearance-none min-w-[180px] cursor-pointer font-semibold"
                                            onChange={(e) => setCategory(e.target.value)}
                                            value={category}
                                        >
                                            <option value="">{t('home.hero.allCategories')}</option>
                                            {dynamicCategories.map((cat) => (
                                                <option key={cat.id} value={cat.slug}>
                                                    {cat.nameFr}
                                                </option>
                                            ))}
                                        </select>
                                        <button className="px-10 py-5 bg-gradient-to-br from-green-400 to-emerald-600 text-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_5px_20px_rgba(34,197,94,0.4)] font-black uppercase tracking-tighter flex items-center gap-3">
                                            <Zap size={20} fill="currentColor" />
                                            {t('home.hero.searchButton')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 'banner':
                return (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-24 rounded-3xl overflow-hidden shadow-2xl shadow-green-950/50"
                    >
                        <HomeBanner />
                    </motion.div>
                );
            case 'urgent':
                return <UrgentListingsSection key={section.id} />;
            case 'shops':
                return <PremiumShopsSection key={section.id} />;
            case 'recent':
                if (!loading && listings.length === 0) return null;

                return (
                    <div key={section.id} className="mb-24">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex items-center justify-between mb-12"
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Sparkles className="text-green-400 animate-pulse" size={40} />
                                {siteSettings.recentSectionTitle === 'Annonces Récentes' ? t('home.sections.recent') : siteSettings.recentSectionTitle}
                            </h2>
                            <Link href="/listings" className="text-green-400 hover:text-green-300 transition flex items-center gap-2 font-bold uppercase text-sm tracking-widest group">
                                Tout Voir <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            <AnimatePresence>
                                {listings.map((listing, index) => (
                                    <motion.div
                                        key={listing.id}
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -10 }}
                                        className="relative group"
                                    >
                                        <Link href={`/listings/${listing.id}?autoplay=true`}>
                                            <div className="absolute -inset-0.5 bg-gradient-to-b from-green-400/50 to-emerald-600/50 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                            <div className="relative bg-black/60 backdrop-blur-3xl rounded-[2rem] overflow-hidden border border-white/5 flex flex-col h-full shadow-2xl">
                                                <div className="aspect-[4/5] overflow-hidden relative">
                                                    <video
                                                        src={listing.thumbnailUrl}
                                                        muted
                                                        loop
                                                        playsInline
                                                        autoPlay
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase font-bold text-green-300 tracking-wider">
                                                        {listing.category}
                                                    </div>
                                                </div>

                                                <div className="p-5 flex-1 flex flex-col justify-end">
                                                    <h3 className="text-sm font-bold text-white/90 truncate mb-1 group-hover:text-green-400 transition-colors">
                                                        {listing.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-black bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                                            {listing.price.toLocaleString()} F
                                                        </span>
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-green-500 group-hover:text-black transition-all">
                                                            <ChevronRight size={14} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            case 'categories':
                return (
                    <div key={section.id} className="mb-24">
                        <motion.h2
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-black text-white mb-12 flex items-center gap-4 italic uppercase tracking-tighter"
                        >
                            <LayoutGrid className="text-green-400" size={40} />
                            Découvrez nos Univers
                        </motion.h2>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCategory('')}
                                className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 border ${category === ''
                                    ? 'bg-green-500 text-black border-transparent shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                                    : 'bg-white/5 text-white border-white/10 hover:border-green-500/50'
                                    }`}
                            >
                                <Compass size={20} />
                                <span className="font-black uppercase tracking-wide text-xs">Tout explorer</span>
                            </motion.button>

                            {dynamicCategories.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCategory(cat.slug)}
                                    className={`px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 border ${category === cat.slug
                                        ? 'bg-green-500 text-black border-transparent shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                                        : 'bg-white/5 text-white border-white/10 hover:border-green-500/50'
                                        }`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span className="font-black uppercase tracking-wide text-xs">{cat.nameFr}</span>
                                </motion.button>
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden font-sans selection:bg-green-500/30 selection:text-green-300">
            {/* Background Dynamics */}

            <motion.div
                className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                    background: `radial-gradient(circle at ${50 + scrollY * 0.05}% ${30 + scrollY * 0.02}%, rgba(16, 185, 129, 0.08) 0%, transparent 60%),
                                 radial-gradient(circle at ${80 - scrollY * 0.03}% ${70 - scrollY * 0.04}%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)`,
                }}
            />

            {/* Content Wrapper */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    {sections.map(section => renderSection(section))}
                </motion.div>
            </div>

            {/* Floating Premium Badge */}
            <motion.div
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                className="fixed bottom-8 right-8 z-50"
            >
                <Link href="/dashboard/subscription" className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-2xl text-black font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all group">
                    <Crown size={16} className="group-hover:rotate-12 transition-transform" />
                    Premium Pass
                </Link>
            </motion.div>
        </div>
    );
}


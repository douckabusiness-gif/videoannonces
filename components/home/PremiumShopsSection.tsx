'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';
import { Crown, MapPin, Play, LayoutGrid, ChevronRight, CheckCircle2, Flame, ArrowRight, Store, Star, Video } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface ShopProduct {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    views: number;
}

interface PremiumShop {
    id: string;
    name: string;
    avatar?: string;
    subdomain?: string;
    description?: string;
    address?: string;
    rating: number;
    totalSales: number;
    verified: boolean;
    bannerUrl?: string;
    featuredVideoUrl?: string; // Nouvelle propriété pour la vidéo showcase
    _count: {
        listings: number;
    };
    products?: ShopProduct[];
}

// Définition des thèmes de couleurs
const CARD_THEMES = [
    {
        name: 'Emerald',
        gradient: 'from-emerald-600 to-green-700',
        lightGradient: 'from-emerald-500 to-green-600',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        shadow: 'shadow-emerald-900/20'
    },
    {
        name: 'Sapphire',
        gradient: 'from-blue-600 to-indigo-700',
        lightGradient: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200',
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700',
        shadow: 'shadow-blue-900/20'
    },
    {
        name: 'Ruby',
        gradient: 'from-red-600 to-rose-700',
        lightGradient: 'from-red-500 to-rose-600',
        border: 'border-red-200',
        text: 'text-red-700',
        bg: 'bg-red-50',
        button: 'bg-red-600 hover:bg-red-700',
        shadow: 'shadow-red-900/20'
    },
    {
        name: 'Amethyst',
        gradient: 'from-purple-600 to-violet-700',
        lightGradient: 'from-purple-500 to-violet-600',
        border: 'border-purple-200',
        text: 'text-purple-700',
        bg: 'bg-purple-50',
        button: 'bg-purple-600 hover:bg-purple-700',
        shadow: 'shadow-purple-900/20'
    },
    {
        name: 'Amber',
        gradient: 'from-amber-500 to-orange-600',
        lightGradient: 'from-amber-400 to-orange-500',
        border: 'border-amber-200',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        button: 'bg-amber-600 hover:bg-amber-700',
        shadow: 'shadow-amber-900/20'
    },
    {
        name: 'Cyan',
        gradient: 'from-cyan-600 to-teal-700',
        lightGradient: 'from-cyan-500 to-teal-600',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        bg: 'bg-cyan-50',
        button: 'bg-cyan-600 hover:bg-cyan-700',
        shadow: 'shadow-cyan-900/20'
    }
];

export default function PremiumShopsSection() {
    const { t } = useTranslation();
    const { siteSettings } = useSiteSettings();
    const [shops, setShops] = useState<PremiumShop[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentOrigin, setCurrentOrigin] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const port = window.location.port ? `:${window.location.port}` : '';
            const protocol = window.location.protocol;

            // Si on est sur localhost, on ajoute le sous-domaine avant localhost
            if (hostname === 'localhost') {
                setCurrentOrigin(`${protocol}//.localhost${port}`);
            } else {
                // Pour les autres cas (ex: videoboutique.ci, domaine.test), on préfixe le domaine actuel
                setCurrentOrigin(`${protocol}//.${hostname}${port}`);
            }
        }
    }, []);

    const getShopUrl = (shop: PremiumShop) => {
        if (!shop.subdomain) return `/shop/${shop.id}`;
        if (!currentOrigin) return `/shop/${shop.id}`; // Fallback durant SSR/Hydration

        // Insérer le sous-domaine après le protocole (//) et avant le premier point
        // La logique ici est simplifiée car currentOrigin est préparé comme `${protocol}//.domaine:port`
        // On remplace `//.` par `//${shop.subdomain}.`
        return currentOrigin.replace('//.', `//${shop.subdomain}.`);
    };

    useEffect(() => {
        fetchPremiumShops();
    }, []);

    const fetchPremiumShops = async () => {
        try {
            // Récupérer les boutiques premium
            const response = await fetch('/api/shops/premium?limit=6&includeProducts=true');
            const data = await response.json();

            // Pour chaque boutique, récupérer ses produits et enrichir
            const shopsWithProducts = await Promise.all(
                (data.shops || []).map(async (shop: PremiumShop) => {
                    try {
                        const productsRes = await fetch(`/api/listings?userId=${shop.id}&limit=3`); // Limit to 3 for the new design
                        const productsData = await productsRes.json();

                        // Fallback data simulation for locations if missing
                        const enrichedShop = {
                            ...shop,
                            address: shop.address || 'Abidjan, CI',
                            products: productsData.listings || []
                        };
                        return enrichedShop;
                    } catch (error) {
                        console.error(`Erreur chargement produits boutique ${shop.id}:`, error);
                        return { ...shop, products: [] };
                    }
                })
            );

            setShops(shopsWithProducts);
        } catch (error) {
            console.error('Erreur chargement boutiques premium:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-[500px] shadow-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (shops.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden font-sans" style={{ backgroundColor: siteSettings?.shopsBgColor || '#F3F4F6' }}>
            {/* Décoration d'arrière-plan légère */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête de section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                            <Crown className="text-white w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tight" style={{ color: siteSettings?.shopsTextColor || '#111827' }}>
                                {t('home.sections.shops') || 'Boutiques Premium'}
                            </h2>
                            <p className="font-medium" style={{ color: siteSettings?.shopsTextColor || '#6B7280', opacity: 0.7 }}>Les meilleures boutiques et leurs produits</p>
                        </div>
                    </div>

                </div>

                {/* Grille de cartes Premium */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {shops.map((shop, index) => {
                        // Rotation des thèmes
                        const theme = CARD_THEMES[index % CARD_THEMES.length];

                        return (
                            <motion.div
                                key={shop.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`group relative bg-white rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border-[2px] ${theme.border}`}
                            >
                                {/* 1. Header coloré */}
                                <div className={`relative h-20 bg-gradient-to-r ${theme.gradient} p-3 flex items-start justify-between`}>
                                    <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
                                    <div className="relative z-10 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/30 hidden sm:flex">
                                        <Crown size={10} className="text-white fill-white" />
                                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">Premium</span>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shadow-lg ml-auto sm:ml-0`}>
                                        {shop.avatar ? (
                                            <Image src={shop.avatar} alt={shop.name} width={40} height={40} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full bg-white flex items-center justify-center text-lg font-bold text-gray-400">
                                                {shop.name[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Corps de la carte (chevauchement) */}
                                <div className="px-3 pb-4 -mt-6 relative z-10">
                                    <div className="flex flex-col gap-0.5 mb-3">
                                        <h3 className="text-lg font-black text-white drop-shadow-md leading-tight truncate">
                                            {shop.name}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-[10px] font-medium text-white/90">
                                            <span className="flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-sm truncate max-w-full">
                                                <MapPin size={10} /> {shop.address || 'Abidjan'}
                                            </span>
                                            <span className="hidden sm:flex items-center gap-0.5 bg-green-500/80 px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm ring-1 ring-green-400/50">
                                                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                                Actif
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3. Media Showcase (Vidéo ou Bannière) */}
                                    <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shadow group-hover:shadow-lg transition-all duration-500 ring-1 ring-black/5">
                                        {shop.bannerUrl ? (
                                            <Image
                                                src={shop.bannerUrl}
                                                alt={shop.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} opacity-50`} />
                                        )}

                                        {/* Overlay & Bouton Play */}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg cursor-pointer">
                                                <Play size={16} className="text-white fill-white ml-0.5" />
                                            </div>
                                        </div>

                                        {/* Stats vidéo */}
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-bold text-white drop-shadow-md">
                                            <span className="flex items-center gap-0.5">
                                                <Play size={8} fill="currentColor" /> {Math.floor(Math.random() * 500) + 50}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-2 right-2 text-[9px] font-bold text-white bg-black/50 px-1 py-0.5 rounded backdrop-blur-sm">
                                            0:20
                                        </div>
                                    </div>

                                    {/* 4. Galerie Compacte (3 produits) - Masquée sur mobile très petit ou conservée ? Conservée mais plus petite */}
                                    <div className="grid grid-cols-3 gap-1 mt-3">
                                        {shop.products && shop.products.slice(0, 3).map((product) => (
                                            <Link key={product.id} href={`/listings/${product.id}`} className="block aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:ring-1 hover:ring-offset-0 transition-all" style={{ '--tw-ring-color': `var(--${theme.name}-500)` } as any}>
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={product.thumbnailUrl}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(max-width: 768px) 33vw, 10vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        ))}
                                        {/* Placeholder si pas assez de produits */}
                                        {(!shop.products || shop.products.length < 3) && [...Array(3 - (shop.products?.length || 0))].map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-[4/3] rounded-lg bg-gray-50 flex items-center justify-center opacity-50 border border-dashed border-gray-300">
                                                <LayoutGrid size={12} className="text-gray-300" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* 5. Footer */}
                                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900">{shop._count.listings} ann.</span>
                                        </div>

                                        <Link
                                            href={getShopUrl(shop)}
                                            className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow hover:shadow-md transition-all flex items-center gap-1 ${theme.button}`}
                                        >
                                            Voir
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

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
    isUrgent?: boolean;
}

export default function ListingsPage() {
    const { data: session } = useSession();
    const { siteSettings } = useSiteSettings();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchListings();
    }, [category]);

    const fetchListings = async () => {
        setLoading(true);
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
        { id: 'all', name: 'Tout', icon: '💎' },
        { id: 'electronics', name: 'Électronique', icon: '📱' },
        { id: 'fashion', name: 'Mode', icon: '👗' },
        { id: 'vehicles', name: 'Véhicules', icon: '🚗' },
        { id: 'real-estate', name: 'Immobilier', icon: '🏡' },
        { id: 'services', name: 'Services', icon: '🛠️' },
        { id: 'home', name: 'Maison', icon: '🛋️' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'other', name: 'Autre', icon: '📦' },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* Header Amélioré */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        {siteSettings.logo ? (
                            <img
                                src={siteSettings.logo}
                                alt={siteSettings.siteName}
                                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                            />
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-all">
                                    <span className="text-white font-black text-xl">V</span>
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    {siteSettings.siteName}
                                </span>
                            </>
                        )}
                    </Link>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-full transition"
                            >
                                <span>📊</span>
                                <span>Tableau de bord</span>
                            </Link>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition">
                                    Connexion
                                </Link>
                                <span className="text-gray-300">|</span>
                            </div>
                        )}

                        <Link
                            href="/create"
                            className="px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-xl shadow-black/10 hover:shadow-black/20 font-bold text-sm tracking-wide flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span>✨</span>
                            <span>Publier</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section Minimaliste */}
            <div className="bg-white border-b border-gray-100 pt-8 pb-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Explorez nos <br />
                        <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            Pépites Vidéo
                        </span>
                    </h1>

                    {/* Categories Bubbles */}
                    <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id === 'all' ? '' : cat.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm ${(cat.id === 'all' && !category) || category === cat.id
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-xl font-bold text-gray-900">
                            {category ? categories.find(c => c.id === category)?.name : 'Récemment ajoutés'}
                        </h2>
                        <span className="text-sm text-gray-400 font-medium">
                            {listings.length} résultats
                        </span>
                    </div>
                    {/* Filters Placeholder */}
                    <button className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-2">
                        <span>🏷️</span> Filtrer
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden h-[350px] animate-pulse">
                                <div className="h-[250px] bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
                            📹
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">C'est calme par ici...</h3>
                        <p className="text-gray-500 mb-8 max-w-md">Aucune annonce ne correspond à votre recherche pour le moment.</p>
                        <Link
                            href="/create"
                            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition shadow-xl"
                        >
                            Soyez le premier à publier
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {listings.map((listing, index) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/listings/${listing.id}?autoplay=true`}
                                    className="group block relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col"
                                >
                                    {/* Video Thumbnail */}
                                    <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
                                        <Image
                                            src={listing.thumbnailUrl}
                                            alt={listing.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                            {listing.isUrgent && (
                                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg tracking-wider">
                                                    URGENT
                                                </span>
                                            )}
                                            <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10">
                                                <span>👁️</span> {listing.views}
                                            </div>
                                        </div>

                                        {/* Price Tag (Floating) */}
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                                            <span className="font-black text-gray-900">
                                                {listing.price.toLocaleString()}
                                                <span className="text-[10px] text-gray-500 ml-1">FCFA</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug mb-3 group-hover:text-orange-600 transition-colors">
                                            {listing.title}
                                        </h3>

                                        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-gray-50">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                                                {listing.user.avatar ? (
                                                    <Image src={listing.user.avatar} alt={listing.user.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-[10px] font-bold text-gray-600">
                                                        {listing.user.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-gray-500 truncate">{listing.user.name}</p>
                                            </div>
                                            <div className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold">
                                                ★ {listing.user.rating.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}

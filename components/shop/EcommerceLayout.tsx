'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import NativeChatWidget from '@/components/features/NativeChat/ChatWidget';

interface Listing {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    videoUrl: string;
    views: number;
    category: string;
    isUrgent?: boolean;
}

interface ShopData {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    rating: number;
    totalRatings: number;
    totalSales: number;
    verified: boolean;
    premium: boolean;
    whatsappNumber: string | null;
    bannerUrl: string | null;
    customColors: any;
    videoUrl: string | null;
    logoUrl: string | null;
    backgroundUrl: string | null;
}

interface EcommerceLayoutProps {
    shop: ShopData;
    listings: Listing[];
}

export default function EcommerceLayout({ shop, listings }: EcommerceLayoutProps) {
    // État pour les filtres
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'popular'>('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Slider hero
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroBanners = [
        shop.bannerUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
        'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200',
    ];

    // Extraire les catégories uniques
    const categories = useMemo(() => {
        const cats = new Set(listings.map(l => l.category));
        return Array.from(cats).map(cat => ({
            name: cat,
            count: listings.filter(l => l.category === cat).length,
            icon: getCategoryIcon(cat)
        }));
    }, [listings]);

    // Filtrer les produits
    const filteredListings = useMemo(() => {
        let filtered = [...listings];

        // Recherche
        if (searchQuery) {
            filtered = filtered.filter(l =>
                l.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Catégorie
        if (selectedCategory) {
            filtered = filtered.filter(l => l.category === selectedCategory);
        }

        // Prix
        filtered = filtered.filter(l => l.price >= minPrice && l.price <= maxPrice);

        // Tri
        if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === 'popular') filtered.sort((a, b) => b.views - a.views);

        return filtered;
    }, [listings, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginatedListings = filteredListings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [siteSettings, setSiteSettings] = useState<{ logo?: string; siteName?: string }>({});

    useEffect(() => {
        fetch('/api/settings/site')
            .then(res => res.json())
            .then(data => setSiteSettings(data))
            .catch(err => console.error('Erreur chargement settings:', err));
    }, []);

    const primaryColor = shop.customColors?.primary || '#FF5733';
    const secondaryColor = shop.customColors?.secondary || '#C70039';

    return (
        <div
            className="min-h-screen"
            style={{
                background: shop.backgroundUrl
                    ? (shop.backgroundUrl.startsWith('#')
                        ? shop.backgroundUrl
                        : `url('${shop.backgroundUrl}') center/cover fixed`)
                    : '#f9fafb'
            }}
        >


            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Shop Name */}
                        <div className="flex items-center gap-3">
                            {shop.logoUrl || shop.avatar ? (
                                <img src={shop.logoUrl || shop.avatar!} alt={shop.name} className="w-10 h-10 rounded-full" />
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {shop.name[0]}
                                </div>
                            )}
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">{shop.name}</h1>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center">
                                        {'⭐'.repeat(Math.floor(shop.rating))}
                                        <span className="ml-1 text-gray-600">({shop.rating.toFixed(1)})</span>
                                    </div>
                                    {shop.verified && (
                                        <span className="text-green-600 font-medium">✓ Vérifié</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#produits" className="text-gray-700 hover:text-orange-600 font-medium">Produits</a>
                            <a href="#categories" className="text-gray-700 hover:text-orange-600 font-medium">Catégories</a>
                            <Link href="/" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                                Accueil
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Slider */}
            <section className="relative h-64 md:h-96 bg-gray-900 overflow-hidden">
                {heroBanners.map((banner, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={banner}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                            <div className="container mx-auto px-4">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                    Bienvenue chez {shop.name}
                                </h2>
                                {shop.bio && (
                                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
                                        {shop.bio}
                                    </p>
                                )}
                                <a
                                    href="#produits"
                                    className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold"
                                >
                                    Découvrir nos produits
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slider Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {heroBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-white"
                >
                    ←
                </button>
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center text-white"
                >
                    →
                </button>
            </section>

            {/* Categories Grid */}
            <section id="categories" className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Catégories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <button
                        onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                        className={`p-4 rounded-xl border-2 transition ${selectedCategory === null
                            ? 'border-orange-600 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 bg-white'
                            }`}
                    >
                        <div className="text-3xl mb-2">🏪</div>
                        <div className="font-semibold text-sm">Tout</div>
                        <div className="text-xs text-gray-600">{listings.length} produits</div>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                            className={`p-4 rounded-xl border-2 transition ${selectedCategory === cat.name
                                ? 'border-orange-600 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-300 bg-white'
                                }`}
                        >
                            <div className="text-3xl mb-2">{cat.icon}</div>
                            <div className="font-semibold text-sm truncate">{cat.name}</div>
                            <div className="text-xs text-gray-600">{cat.count} produits</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Search & Filters */}
            <section id="produits" className="container mx-auto px-4 py-4 bg-white rounded-xl shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="recent">Plus récent</option>
                        <option value="price-asc">Prix croissant</option>
                        <option value="price-desc">Prix décroissant</option>
                        <option value="popular">Plus populaire</option>
                    </select>
                </div>
            </section>

            {/* Products Grid */}
            <section className="container mx-auto px-4 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {filteredListings.length} produit{filteredListings.length > 1 ? 's' : ''}
                        {selectedCategory && ` dans ${selectedCategory}`}
                    </h2>
                </div>

                {paginatedListings.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-600">Aucun produit trouvé</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory(null);
                                setCurrentPage(1);
                            }}
                            className="mt-4 text-orange-600 hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginatedListings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}?autoplay=true`}
                                    className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition"
                                >
                                    {/* Image/Video */}
                                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                                        <video
                                            src={listing.videoUrl}
                                            poster={listing.thumbnailUrl}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
                                            👁️ {listing.views}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 md:p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 mb-2 min-h-[40px]">
                                            {listing.title}
                                        </h3>
                                        <div className="text-lg md:text-xl font-bold text-orange-600">
                                            {listing.price.toLocaleString()} FCFA
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Précédent
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg font-medium ${currentPage === page
                                            ? 'bg-orange-600 text-white'
                                            : 'border hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Badges de Confiance */}
            {shop.trustBadges && Array.isArray(shop.trustBadges) && shop.trustBadges.length > 0 && (
                <section className="container mx-auto px-4 pb-12">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-xl border-2 border-green-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            ✅ Nos Garanties
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {shop.trustBadges.map((badge: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
                                >
                                    <div className="text-3xl">{badge.icon}</div>
                                    <div className="font-semibold text-gray-800">{badge.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="font-bold text-lg mb-2">{shop.name}</p>
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} Tous droits réservés.
                            </p>
                        </div>

                        {/* Platform Branding */}
                        <div className="flex flex-col items-center md:items-end gap-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Propulsé par</span>
                            <Link href="/" className="group flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                                {siteSettings.logo ? (
                                    <img
                                        src={siteSettings.logo}
                                        alt={siteSettings.siteName || 'VideoAnnonces'}
                                        className="h-12 w-auto object-contain"
                                    />
                                ) : (
                                    <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-green-500 to-orange-600 bg-clip-text text-transparent">
                                        {siteSettings.siteName || 'VideoAnnonces-CI'}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
            <NativeChatWidget sellerId={shop.id} />
        </div>
    );
}

function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        'electronics': '📱',
        'vehicles': '🚗',
        'fashion': '👗',
        'home': '🏠',
        'services': '🔧',
        'education': '📚',
        'health': '⚕️',
        'sports': '⚽',
        'food': '🍔',
        'default': '📦'
    };
    return icons[category.toLowerCase()] || icons['default'];
}

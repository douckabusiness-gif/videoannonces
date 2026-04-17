'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import MessengerButton from './MessengerButton';

interface Listing {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    videoUrl: string;
    views: number;
    category: string;
    createdAt: Date;
    isUrgent: boolean;
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    reviewer: {
        name: string;
        avatar: string | null;
    };
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
    aboutSection: string | null;
    socialLinks: any;
    trustBadges: any;
    bannerUrl: string | null;
    customColors: any;
    logoUrl: string | null;
    backgroundUrl: string | null;
}

interface MobileFirstLayoutProps {
    shop: ShopData;
    listings: Listing[];
    reviews: Review[];
}

export default function MobileFirstLayout({ shop, listings, reviews }: MobileFirstLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [siteSettings, setSiteSettings] = useState<{ logo?: string; siteName?: string }>({});

    useEffect(() => {
        fetch('/api/settings/site')
            .then(res => res.json())
            .then(data => setSiteSettings(data))
            .catch(err => console.error('Erreur chargement settings:', err));
    }, []);

    // Extract data
    const trustBadges = shop.trustBadges ? (Array.isArray(shop.trustBadges) ? shop.trustBadges : []) : [];
    const socialLinks = shop.socialLinks ? (typeof shop.socialLinks === 'object' ? shop.socialLinks as any : {}) : {};
    const customColors = shop.customColors ? (typeof shop.customColors === 'object' ? shop.customColors as any : {}) : {};
    const primaryColor = customColors.primary || '#FF6B00';
    const secondaryColor = customColors.secondary || '#9333EA';
    const headerBg = customColors.headerBg || 'rgba(255, 255, 255, 0.9)';
    const headerText = customColors.headerText || '#111827';
    const bannerBg = customColors.bannerBg || `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    const bannerText = customColors.bannerText || '#FFFFFF';
    const footerBg = customColors.footerBg || '#111827';
    const footerText = customColors.footerText || '#FFFFFF';
    const pageBg = customColors.pageBg || 'linear-gradient(135deg, #f5f7fa 0%, #ffe8e1 50%, #fef1f5 100%)';

    // Get unique categories
    const categories = [...new Set(listings.map(l => l.category))];

    // Filter listings
    const filteredListings = selectedCategory
        ? listings.filter(l => l.category === selectedCategory)
        : listings;

    // Star rating helper
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="text-yellow-400">⭐</span>);
        }
        if (hasHalfStar) {
            stars.push(<span key="half" className="text-yellow-400">⭐</span>);
        }

        return stars;
    };

    return (
        <div
            className="min-h-screen"
            style={{
                background: shop.backgroundUrl
                    ? (shop.backgroundUrl.startsWith('#')
                        ? shop.backgroundUrl
                        : `url('${shop.backgroundUrl}') center/cover fixed`)
                    : pageBg
            }}
        >


            {/* Messenger Button */}
            {socialLinks.facebook && (
                <MessengerButton facebookPageId={socialLinks.facebook} shopName={shop.name} />
            )}

            {/* Sticky Header */}
            <header
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-200 shadow-sm"
                style={{ backgroundColor: headerBg, color: headerText }}
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo/Avatar */}
                        <Link href="/" className="flex items-center gap-2">
                            {shop.avatar ? (
                                <img
                                    src={shop.avatar}
                                    alt={shop.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {shop.name[0]}
                                </div>
                            )}

                            {shop.logoUrl ? (
                                <img src={shop.logoUrl} alt={shop.name} className="h-8 max-w-[150px] object-contain" />
                            ) : (
                                <span className="font-bold text-lg" style={{ color: headerText }}>{shop.name}</span>
                            )}

                            {shop.verified && (
                                <span className="text-blue-500" title="Boutique vérifiée">✓</span>
                            )}
                        </Link>

                        {/* Menu Toggle (Mobile) */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden transition"
                            style={{ color: headerText }}
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Navigation (Desktop) */}
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#annonces" className="transition font-medium opacity-80 hover:opacity-100" style={{ color: headerText }}>Annonces</a>
                            <a href="#about" className="transition font-medium opacity-80 hover:opacity-100" style={{ color: headerText }}>À propos</a>
                            <a href="#avis" className="transition font-medium opacity-80 hover:opacity-100" style={{ color: headerText }}>Avis</a>
                            <Link
                                href="/"
                                className="px-4 py-2 text-white rounded-lg transition shadow"
                                style={{ background: primaryColor }}
                            >
                                Accueil
                            </Link>
                        </nav>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="flex flex-col gap-3">
                                <a href="#annonces" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-600 transition font-medium">Annonces</a>
                                <a href="#about" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-600 transition font-medium">À propos</a>
                                <a href="#avis" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-600 transition font-medium">Avis</a>
                                <Link
                                    href="/"
                                    className="text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition"
                                >
                                    Accueil
                                </Link>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section
                className="pt-24 pb-16 relative overflow-hidden"
                style={{
                    background: shop.bannerUrl
                        ? `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%), url('${shop.bannerUrl}')`
                        : bannerBg,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: bannerText
                }}
            >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    {/* Large Avatar */}
                    <div className="mb-6">
                        {shop.logoUrl || shop.avatar ? (
                            <img
                                src={shop.logoUrl || shop.avatar!}
                                alt={shop.name}
                                className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-white shadow-2xl object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-4 border-white shadow-2xl bg-white/20 flex items-center justify-center text-white text-4xl font-bold">
                                {shop.name[0]}
                            </div>
                        )}
                    </div>

                    {/* Shop Name */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: bannerText }}>
                        {shop.name}
                        {shop.verified && <span className="ml-2">✓</span>}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex">{renderStars(shop.rating)}</div>
                        <span className="font-medium opacity-90" style={{ color: bannerText }}>
                            {shop.rating.toFixed(1)} ({shop.totalRatings} avis)
                        </span>
                    </div>

                    {/* Bio */}
                    {shop.bio && (
                        <p className="max-w-2xl mx-auto text-lg opacity-90" style={{ color: bannerText }}>
                            {shop.bio}
                        </p>
                    )}
                </div>
            </section>

            {/* Quick Stats */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                    {/* Ventes */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition p-4 md:p-6 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">
                            {shop.totalSales}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium">Ventes</div>
                    </div>

                    {/* Avis */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition p-4 md:p-6 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
                            {shop.totalRatings}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium">Avis</div>
                    </div>

                    {/* Annonces */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition p-4 md:p-6 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                            {listings.length}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium">Annonces</div>
                    </div>
                </div>
            </div>

            {/* Annonces Section */}
            <section id="annonces" className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Annonces</h2>
                    {listings.length > 0 && (
                        <span className="text-sm text-gray-600">{filteredListings.length} produits</span>
                    )}
                </div>

                {/* Category Filter */}
                {categories.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === null
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Tout
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === cat
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Listings Grid */}
                {filteredListings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredListings.map(listing => (
                            <Link
                                key={listing.id}
                                href={`/listings/${listing.id}?autoplay=true`}
                                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                                onClick={() => {
                                    const allVideos = document.querySelectorAll('video');
                                    allVideos.forEach((video) => { video.pause(); video.currentTime = 0; video.muted = true; });
                                }}
                            >
                                {/* Video Thumbnail with Autoplay */}
                                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                                    <video
                                        src={listing.videoUrl}
                                        poster={listing.thumbnailUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Play Button Overlay (decorative, appears on hover) */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Views */}
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        {listing.views}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3 md:p-4">
                                    <h3 className="font-bold text-sm md:text-base text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition">
                                        {listing.title}
                                    </h3>
                                    <p className="text-orange-600 font-bold text-lg md:text-xl">
                                        {listing.price.toLocaleString()} FCFA
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-gray-600 text-lg">Aucune annonce disponible</p>
                    </div>
                )}
            </section>

            {/* About Section */}
            {shop.aboutSection && (
                <section id="about" className="bg-white py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">À Propos</h2>
                        <div className="prose max-w-none text-gray-700 leading-relaxed">
                            {shop.aboutSection}
                        </div>

                        {/* Trust Badges */}
                        {trustBadges.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                                {trustBadges.map((badge: any, i: number) => (
                                    <div key={i} className="bg-gradient-to-br from-orange-50 to-purple-50 p-4 md:p-6 rounded-xl text-center hover:shadow-lg transition">
                                        <div className="text-3xl md:text-4xl mb-2">{badge.icon}</div>
                                        <div className="text-sm md:text-base font-medium text-gray-900">{badge.text}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
                <section id="avis" className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Avis Clients</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                                <div className="flex items-center gap-3 mb-4">
                                    {review.reviewer.avatar ? (
                                        <img
                                            src={review.reviewer.avatar}
                                            alt={review.reviewer.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {review.reviewer.name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-gray-900">{review.reviewer.name}</div>
                                        <div className="flex">{renderStars(review.rating)}</div>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-8 mt-12" style={{ backgroundColor: footerBg, color: footerText }}>
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-2 opacity-80">© {new Date().getFullYear()} {shop.name}.</p>
                    <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                        <span className="text-xs">Powered by</span>
                        {siteSettings.logo ? (
                            <img src={siteSettings.logo} alt="VideoBoutique" className="h-5 w-auto object-contain" />
                        ) : (
                            <span className="font-bold text-orange-500">VideoBoutique</span>
                        )}
                    </div>
                    <Link href="/" className="transition text-sm opacity-60 hover:opacity-100" style={{ color: footerText }}>
                        Retour à l'accueil
                    </Link>
                </div>
            </footer>
        </div>
    );
}

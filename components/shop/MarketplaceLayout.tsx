'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    videoUrl: string | null; // Added videoUrl for shop presentation
    customColors: any;
    trustBadges: any;
    logoUrl: string | null;
    backgroundUrl: string | null;
}

interface MarketplaceLayoutProps {
    shop: ShopData;
    listings: Listing[];
}

export default function MarketplaceLayout({ shop, listings }: MarketplaceLayoutProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [siteSettings, setSiteSettings] = useState<{ logo?: string; siteName?: string }>({});

    useEffect(() => {
        fetch('/api/settings/site')
            .then(res => res.json())
            .then(data => setSiteSettings(data))
            .catch(err => console.error('Erreur chargement settings:', err));
    }, []);

    // Slider state
    const [currentSlide, setCurrentSlide] = useState(0);

    const itemsPerPage = 12;

    // Build Hero Slides (Shop Branding Mixed with Promotions)
    const heroSlides = useMemo(() => {
        const slides = [];

        // Slide 1: Main Banner (Image)
        if (shop.bannerUrl) {
            slides.push({ type: 'image', src: shop.bannerUrl, title: `Bienvenue chez ${shop.name}` });
        } else {
            // Fallback generic banner
            slides.push({ type: 'image', src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', title: 'Découvrez nos produits' });
        }

        // Slide 2: Presentation Video (if available) - Or generic fallback
        if (shop.videoUrl) {
            slides.push({ type: 'video', src: shop.videoUrl, title: 'Qui sommes-nous ?' });
        } else {
            slides.push({ type: 'image', src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', title: 'Qualité Garantie' });
        }

        return slides;
    }, [shop]);

    // Categories with Icons
    const uniqueCategories = useMemo(() => {
        const cats = new Set(listings.map(l => l.category));
        return Array.from(cats).map(cat => ({
            name: cat,
            count: listings.filter(l => l.category === cat).length,
            icon: getCategoryIcon(cat)
        }));
    }, [listings]);

    // Filtering
    const filteredListings = useMemo(() => {
        let filtered = [...listings];
        if (searchQuery) {
            filtered = filtered.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedCategory) {
            filtered = filtered.filter(l => l.category === selectedCategory);
        }
        return filtered;
    }, [listings, searchQuery, selectedCategory]);

    // Pagination
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    const paginatedListings = filteredListings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div
            className="min-h-screen font-sans"
            style={{
                background: shop.backgroundUrl
                    ? (shop.backgroundUrl.startsWith('#')
                        ? shop.backgroundUrl
                        : `url('${shop.backgroundUrl}') center/cover fixed`)
                    : (shop.customColors?.pageBg || 'linear-gradient(135deg, #f5f5f5 0%, #fef3e8 50%, #fef3f1 100%)')
            }}
        >
            {/* --- MARKETPLACE HEADER --- */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                {/* Top Bar (Brand Color) */}
                <div
                    className="text-white py-2"
                    style={{ backgroundColor: shop.customColors?.primary || '#2c2c2c' }}
                >
                    <div className="container mx-auto px-4 flex justify-between items-center text-xs md:text-sm">
                        <span className="font-medium">✨ Boutique Officielle : {shop.name}</span>
                        <div className="flex gap-4">
                            <span>⭐ {shop.rating.toFixed(1)}/5 ({shop.totalRatings} avis)</span>
                            {shop.verified && <span className="text-white font-bold">✓ Vérifié</span>}
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div
                    className="container mx-auto px-4 py-6"
                    style={{ backgroundColor: shop.customColors?.headerBg || '#FFFFFF', color: shop.customColors?.headerText || '#111827' }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Logo & Brand */}
                        <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
                            <Link href="/" className="relative group">
                                {shop.avatar ? (
                                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                                        <Image
                                            src={shop.avatar}
                                            alt={shop.name}
                                            fill
                                            className="rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-[#f68b1e] rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                                        {shop.name[0]}
                                    </div>
                                )}
                            </Link>
                            <div className="hidden md:block">
                                {shop.logoUrl ? (
                                    <img
                                        src={shop.logoUrl}
                                        alt={shop.name}
                                        className="h-20 md:h-[200px] w-auto max-w-[600px] object-contain mb-1"
                                    />
                                ) : (
                                    <h1 className="font-black text-2xl text-gray-900 tracking-tight leading-none">
                                        {shop.name}
                                    </h1>
                                )}
                                <p className="text-xs text-gray-500 mt-1 max-w-[200px] line-clamp-1">{shop.bio || 'Bienvenue dans notre boutique'}</p>
                            </div>
                        </div>

                        {/* Search Bar (Massive & Central) */}
                        <div className="flex-1 w-full relative group">
                            <input
                                type="text"
                                placeholder="🔍 Que recherchez-vous chez nous ?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-4 pl-6 pr-16 bg-gray-100 border-2 border-transparent rounded-xl outline-none transition-all shadow-inner text-lg placeholder-gray-400"
                                style={{
                                    borderInlineColor: shop.customColors?.primary ? 'transparent' : undefined,
                                }}
                            />
                            <button
                                className="absolute right-2 top-2 bottom-2 text-white px-6 rounded-lg font-bold shadow-md hover:scale-105 active:scale-95 transition-transform"
                                style={{ backgroundColor: shop.customColors?.primary || '#f68b1e' }}
                            >
                                OK
                            </button>
                        </div>

                        {/* WhatsApp / Contact */}
                        <div className="hidden md:flex items-center gap-3">
                            {shop.whatsappNumber && (
                                <a
                                    href={`https://wa.me/${shop.whatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition"
                                >
                                    <span className="text-xl">💬</span>
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold uppercase">Discuter sur</div>
                                        <div className="font-bold leading-none">WhatsApp</div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION (Sidebar + Slider + Promos) --- */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">

                    {/* LEFT SIDEBAR (Categories) */}
                    <div className="hidden lg:flex flex-col w-64 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex-shrink-0">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-800 flex items-center justify-between">
                            <span>NOS RAYONS</span>
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">{listings.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full px-4 py-3 text-left rounded-lg transition-all flex items-center gap-3 ${selectedCategory === null ? 'bg-orange-50 text-[#f68b1e] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="text-lg">🏢</span>
                                <span>Tout voir</span>
                            </button>
                            {uniqueCategories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`w-full px-4 py-3 text-left rounded-lg transition-all flex items-center gap-3 ${selectedCategory === cat.name ? 'bg-orange-50 text-[#f68b1e] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg opacity-70">{cat.icon}</span>
                                    <span className="line-clamp-1">{cat.name}</span>
                                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{cat.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CENTER (Impactful Slider) */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg bg-black group">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {slide.type === 'video' ? (
                                    <video
                                        src={slide.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                ) : (
                                    <img
                                        src={slide.src}
                                        alt={slide.title}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                )}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-end p-8 md:p-12">
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg transform translate-y-0 transition-transform">{slide.title}</h2>
                                    <button
                                        className="w-fit text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg border-2 border-white/20 backdrop-blur-sm"
                                        style={{ backgroundColor: shop.customColors?.primary || '#f68b1e' }}
                                    >
                                        Visiter la boutique
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Slider Nav */}
                        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                            {heroSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-[#f68b1e] w-8' : 'bg-white/50 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Info Banners) */}
                    <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0">
                        {/* Info Card 1 */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                            <div className="w-14 h-14 bg-orange-50 text-[#f68b1e] rounded-full flex items-center justify-center mb-3 text-2xl shadow-inner animate-pulse">⚡</div>
                            <div className="font-bold text-gray-900">Livraison Rapide</div>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Nous livrons partout à Abidjan sous 24h.</p>
                        </div>

                        {/* Info Card 2 */}
                        <div className="flex-1 bg-[#2c2c2c] rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="font-bold text-lg mb-1 relative">Besoin d'aide ?</div>
                            <div className="text-2xl font-black text-[#f68b1e] relative">{shop.whatsappNumber || 'Contact'}</div>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider relative">Service Client 24/7</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- VIDEO PRODUCT GRID --- */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <span className="text-[#f68b1e]">🔥</span>
                            {selectedCategory ? selectedCategory : 'Nos Meilleures Offres'}
                        </h2>
                        {selectedCategory && (
                            <button onClick={() => setSelectedCategory(null)} className="text-sm text-gray-500 hover:text-[#f68b1e] underline">
                                Voir tout
                            </button>
                        )}
                    </div>

                    {paginatedListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 text-gray-300">📦</div>
                            <h3 className="text-xl font-bold text-gray-700">Aucun produit trouvé</h3>
                            <p className="text-gray-500">Essayez une autre catégorie.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {paginatedListings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}?autoplay=true`}
                                    className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-100 flex flex-col"
                                >
                                    {/* Video Container */}
                                    <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden">
                                        <VideoCard
                                            videoUrl={listing.videoUrl}
                                            thumbnailUrl={listing.thumbnailUrl}
                                        />

                                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 z-20">
                                            👁️ {listing.views}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 h-10 mb-2 group-hover:text-[#f68b1e] transition-colors">
                                            {listing.title}
                                        </h3>

                                        <div className="mt-auto flex items-end justify-between">
                                            <div>
                                                <div className="font-black text-gray-900 text-lg">
                                                    {listing.price.toLocaleString()} F
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-3 w-full bg-gray-100 hover:bg-[#f68b1e] hover:text-white text-gray-700 font-bold text-xs py-2.5 rounded-lg text-center transition-colors">
                                            VOIR DÉTAILS
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12 gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentPage === page ? 'bg-[#f68b1e] text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="bg-[#1a1a1a] text-gray-400 text-sm py-12 mt-12 border-t-4 border-[#f68b1e]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
                        {/* ... (other columns unchanged) ... */}
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#f68b1e] rounded-full flex items-center justify-center text-white font-bold">{shop.name[0]}</div>
                                <h4 className="text-white font-bold text-lg">{shop.name}</h4>
                            </div>
                            <p className="leading-relaxed text-xs max-w-xs mx-auto md:mx-0">
                                {shop.bio || 'Votre satisfaction est notre priorité. Découvrez nos produits de qualité.'}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Informations</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition">À propos de nous</a></li>
                                <li><a href="#" className="hover:text-white transition">Politique de livraison</a></li>
                                <li><a href="#" className="hover:text-white transition">Conditions générales</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Contact</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-center md:justify-start gap-2">
                                    <span>📞</span> {shop.whatsappNumber || 'Non spécifié'}
                                </li>
                                <li className="flex items-center justify-center md:justify-start gap-2">
                                    <span>📍</span> Abidjan, Côte d'Ivoire
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-xs flex flex-col items-center gap-2">
                        <p>&copy; {new Date().getFullYear()} {shop.name}.</p>
                        <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition">
                            <span>Propulsé par</span>
                            {siteSettings.logo ? (
                                <img src={siteSettings.logo} alt="VideoBoutique" className="h-10 w-auto object-contain" />
                            ) : (
                                <span className="font-bold text-orange-500">VideoBoutique</span>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
            <NativeChatWidget sellerId={shop.id} />
        </div>
    );
}

// Helper Component for Video Hover Effect
function VideoCard({ videoUrl, thumbnailUrl }: { videoUrl: string, thumbnailUrl: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return (
        <div
            className="w-full h-full relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl}
                muted
                loop
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'scale-110' : 'scale-100'}`}
                style={{ objectFit: 'cover' }}
            />
            {/* Play Icon when not playing */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <span className="text-[#f68b1e] text-xl ml-1">▶</span>
                </div>
            </div>
        </div>
    );
}

function getCategoryIcon(cat: string) {
    const map: Record<string, string> = {
        'Électronique': '💻',
        'Mode': '👕',
        'Maison': '🏠',
        'Beauté': '💄',
        'Sport': '⚽',
        'Auto': '🚗',
    };
    return map[cat] || '📦';
}

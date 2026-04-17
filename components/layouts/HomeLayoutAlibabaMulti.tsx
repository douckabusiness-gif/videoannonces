'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { BannerConfig } from '@/types/banner';

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
    boosted?: boolean;
    isUrgent?: boolean;
    user: {
        id: string;
        name: string;
        avatar?: string;
        rating: number;
        subdomain?: string;
        phone?: string;
    };
}

interface Seller {
    id: string;
    name: string;
    avatar?: string;
    subdomain?: string;
    rating: number;
    totalRatings: number;
    verified?: boolean;
    totalListings?: number;
    totalViews?: number;
}

interface LayoutProps {
    siteSettings?: {
        siteName: string;
        siteSlogan: string;
        siteDescription: string;
        logo: string | null;
    };
}

export default function HomeLayoutAlibabaMulti({ siteSettings }: LayoutProps) {
    const { t } = useTranslation();
    const [urgentListings, setUrgentListings] = useState<Listing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [premiumSellers, setPremiumSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const [bannerConfig, setBannerConfig] = useState<BannerConfig | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    // Banner Autoplay
    useEffect(() => {
        if (!bannerConfig?.enabled || !bannerConfig.slides.length || bannerConfig.slides.length === 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerConfig.slides.length);
        }, 6000); // 6 seconds per slide

        return () => clearInterval(timer);
    }, [bannerConfig]);

    const fetchData = async () => {
        try {
            // Fetch Banner Config
            const bannerRes = await fetch('/api/admin/banner');
            if (bannerRes.ok) {
                const config = await bannerRes.json();
                setBannerConfig(config);
            }

            // Fetch urgent listings
            const urgentRes = await fetch('/api/listings?urgent=true&limit=6', { cache: 'no-store' });
            const urgentData = await urgentRes.json();
            setUrgentListings(urgentData.listings || []);

            // Fetch All Listings (replacing trending and new)
            const allRes = await fetch('/api/listings?limit=60&sort=recent', { cache: 'no-store' });
            const allData = await allRes.json();
            setAllListings(allData.listings || []);

            // Fetch premium sellers
            const sellersRes = await fetch('/api/premium-sellers?limit=6', { cache: 'no-store' });
            const sellersData = await sellersRes.json();
            setPremiumSellers(sellersData.sellers || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: 'Électronique', icon: '📱', slug: 'electronique' },
        { name: 'Automobiles', icon: '🚗', slug: 'automobiles' },
        { name: 'Mode', icon: '👗', slug: 'mode' },
        { name: 'Maison', icon: '🏠', slug: 'maison' },
        { name: 'Sports', icon: '⚽', slug: 'sports' },
        { name: 'Loisirs', icon: '🎮', slug: 'loisirs' },
    ];

    const ProductCard = ({ listing }: { listing: Listing }) => {
        const [isVideoPlaying, setIsVideoPlaying] = useState(false);
        const videoRef = useRef<HTMLVideoElement>(null);

        const handleMouseEnter = () => {
            setIsVideoPlaying(true);
            videoRef.current?.play();
        };

        const handleMouseLeave = () => {
            setIsVideoPlaying(false);
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.currentTime = 0;
        };

        // Cleanup: Arrêter la vidéo au démontage du composant
        useEffect(() => {
            return () => {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                    videoRef.current.src = '';
                }
            };
        }, []);

        // Gestionnaire de clic pour arrêter la vidéo avant navigation
        const handleCardClick = () => {
            // Arrêter cette vidéo
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
            
            // Arrêter TOUTES les vidéos de la page
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach((video) => {
                video.pause();
                video.currentTime = 0;
                video.muted = true;
            });
        };

        return (
            <Link
                href={`/listings/${listing.id}?autoplay=true`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleCardClick}
            >
                {/* Video Thumbnail */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
                    <video
                        ref={videoRef}
                        src={listing.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {listing.isUrgent && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-black shadow-xl animate-pulse">
                                <span>⚡</span>
                                <span>URGENT</span>
                            </div>
                        )}
                        {listing.boosted && (
                            <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-xs font-black shadow-xl">
                                <span>🔥 FLASH</span>
                            </div>
                        )}
                    </div>

                    {/* Play Button */}
                    {!isVideoPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                                <div className="absolute inset-0 w-16 h-16 bg-cyan-500/40 rounded-full animate-ping" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl font-black text-lg shadow-2xl">
                            {listing.price.toLocaleString()} F
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {listing.title}
                    </h3>

                    {/* Location & Views */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{listing.views >= 1000 ? (listing.views / 1000).toFixed(1) + 'k' : listing.views}</span>
                        </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center overflow-hidden">
                                {listing.user.avatar ? (
                                    <Image src={listing.user.avatar} alt={listing.user.name} width={32} height={32} className="object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-cyan-600">{listing.user.name[0]}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{listing.user.name}</p>
                                {listing.user.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-yellow-500">⭐</span>
                                        <span className="text-xs text-gray-600">{listing.user.rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(`https://wa.me/${listing.user.phone}?text=Bonjour, je suis intéressé par ${listing.title}`, '_blank');
                            }}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Link>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            {siteSettings?.logo ? (
                                <img
                                    src={siteSettings.logo}
                                    alt={siteSettings.siteName}
                                    className="h-10 object-contain"
                                />
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black bg-gradient-to-r from-orange-500 via-green-500 to-orange-600 bg-clip-text text-transparent">
                                            {siteSettings?.siteName || 'VideoAnnonces-CI'}
                                        </span>
                                        <span className="text-xs text-gray-600 -mt-1">
                                            {siteSettings?.siteSlogan || 'Vos annonces en vidéo!'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher des produits..."
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-cyan-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium">Compte</span>
                            </Link>
                            <Link href="/dashboard/create" className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-shadow">
                                + Publier
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Categories Bar */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/listings?category=${cat.slug}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                <span className="font-semibold text-gray-700 group-hover:text-cyan-600">{cat.name}</span>
                            </Link>
                        ))}
                        <button className="flex items-center gap-2 px-4 py-2 text-cyan-600 font-semibold hover:bg-cyan-50 rounded-lg transition-colors">
                            <span>Plus</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamic Hero Banner */}
            {bannerConfig?.enabled && bannerConfig.slides.length > 0 ? (
                <div className="relative h-[60vh] min-h-[400px] overflow-hidden bg-black group">
                    {/* Background Video */}
                    {bannerConfig.slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                            <video
                                src={slide.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />

                            {/* Slide Content */}
                            <div className="absolute inset-0 flex items-center z-20">
                                <div className="container mx-auto px-4">
                                    <div className="max-w-3xl transform transition-all duration-700 translate-y-0 opacity-100">
                                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                            {slide.title}
                                        </h1>
                                        {slide.description && (
                                            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-medium max-w-2xl drop-shadow-md">
                                                {slide.description}
                                            </p>
                                        )}
                                        {slide.buttonText && (
                                            <Link
                                                href={slide.buttonLink || '/listings'}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black text-lg hover:scale-105 hover:shadow-cyan-500/25 transition-all shadow-2xl group-hover:shadow-cyan-500/40"
                                            >
                                                {slide.buttonText}
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Dots */}
                    {bannerConfig.slides.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                            {bannerConfig.slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-10 bg-cyan-500' : 'bg-white/50 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Fallback Static Banner */
                <div className="relative h-[60vh] min-h-[400px] overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 drop-shadow-2xl">
                                Trouvez tout ce que vous cherchez
                            </h1>
                            <Link
                                href="/listings"
                                className="inline-block px-10 py-4 bg-white text-cyan-600 rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-2xl"
                            >
                                Commencer →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - Full Width */}
            <div className="container mx-auto px-4 py-8">
                {/* Urgent Listings Section with Innovative Dynamic Style */}
                {urgentListings.length > 0 && (
                    <section className="relative mb-12 bg-gradient-to-br from-red-50 via-white to-red-50 rounded-3xl p-6 md:p-8 border border-red-100 shadow-xl overflow-hidden isolate">
                        {/* Innovative Background Elements */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#fee2e2_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

                        <div className="relative z-10">
                            {/* Header for Urgent Listings - Simple & Clean */}
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl shadow-inner">🚨</span>
                                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">ANNONCES URGENTES</span>
                                </h2>
                                <Link href="/listings?urgent=true" className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:shadow-md hover:ring-1 hover:ring-red-100">
                                    Voir tout
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </Link>
                            </div>

                            {/* Urgent Cards Grid with Special Styling */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {urgentListings.map((listing) => (
                                    <div key={listing.id} className="relative group">
                                        {/* Urgent Fire Badge Overlay */}
                                        <div className="absolute -top-2 -right-2 z-20">
                                            <span className="flex h-8 w-8 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-8 w-8 bg-red-600 items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
                                                    🔥
                                                </span>
                                            </span>
                                        </div>
                                        <ProductCard listing={listing} />
                                        {/* Red border on hover effect handled by parent div */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500 pointer-events-none transition-colors duration-300 z-10"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Premium Sellers Section */}
                {premiumSellers.length > 0 && (
                    <section className="mb-12">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-xl opacity-30 animate-pulse"></div>
                                    <h2 className="relative text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3">
                                        <span className="text-4xl md:text-5xl">👑</span>
                                        <span className="bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                                            BOUTIQUES OFFICIELLES
                                        </span>
                                    </h2>
                                </div>
                            </div>
                            <Link
                                href="/shops"
                                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                            >
                                <span>Voir tout</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Sellers Grid/Slider */}
                        <div className="relative">
                            {/* Horizontal Scroll Container for Mobile / Grid for Desktop */}
                            <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 gap-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:pb-0 scrollbar-hide">
                                {premiumSellers.map((seller) => (
                                    <Link
                                        key={seller.id}
                                        href={`https://${seller.subdomain}.${process.env.NEXT_PUBLIC_DOMAIN || 'videoboutique.com'}`}
                                        target="_blank"
                                        className="snap-center flex-shrink-0 w-72 md:w-auto group relative"
                                    >
                                        {/* Card */}
                                        <div className="relative h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col items-center">

                                            {/* Top Banner Background */}
                                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 to-gray-800"></div>
                                            <div className="absolute top-0 left-0 right-0 h-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                                            {/* Avatar */}
                                            <div className="relative mt-8 mb-4">
                                                <div className="w-24 h-24 relative">
                                                    {/* Gold Ring */}
                                                    <div className="absolute -inset-1 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-200 rounded-full animate-spin-slow"></div>
                                                    <div className="absolute inset-0.5 bg-white rounded-full"></div>

                                                    {/* Avatar Image */}
                                                    <div className="absolute inset-1.5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-2xl font-black shadow-inner overflow-hidden">
                                                        {seller.avatar ? (
                                                            <Image
                                                                src={seller.avatar}
                                                                alt={seller.name}
                                                                width={80}
                                                                height={80}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <span>{seller.name[0]}</span>
                                                        )}
                                                    </div>

                                                    {/* Crown/Verified Badge */}
                                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                                                        <span className="text-sm">👑</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Seller Info */}
                                            <div className="text-center w-full space-y-3 mt-auto">
                                                {/* Name */}
                                                <div>
                                                    <h3 className="font-black text-lg text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
                                                        {seller.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 font-medium">Boutique Officielle</p>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="flex items-center justify-center gap-4 py-3 border-t border-b border-gray-50 w-full">
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Note</div>
                                                        <div className="flex items-center gap-1 font-bold text-gray-900">
                                                            <span className="text-yellow-500">★</span>
                                                            {seller.rating.toFixed(1)}
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100"></div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Ventes</div>
                                                        <div className="font-bold text-gray-900">
                                                            {seller.totalListings || 0}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Visit Button */}
                                                <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-yellow-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                                    <span>Visiter la boutique</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile "Voir tout" (si beaucoup de boutiques, sinon le scroll suffit) */}
                        <div className="md:hidden mt-2 text-center">
                            <p className="text-sm text-gray-400 italic">Glissez pour voir plus →</p>
                        </div>
                    </section>
                )}

                {/* All Products Section */}
                {allListings.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <span className="text-4xl">🛍️</span>
                                TOUS NOS PRODUITS
                            </h2>
                            <Link href="/listings" className="text-cyan-600 font-bold hover:text-cyan-700">
                                Voir tout →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {allListings.map((listing) => (
                                <ProductCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

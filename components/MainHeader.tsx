'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';

interface MainHeaderProps {
    siteSettings?: any;
}

export default function MainHeader({ siteSettings: propSettings }: MainHeaderProps) {
    const { siteSettings: contextSettings } = useSiteSettings();
    // Prefer context settings if available (client-side), otherwise props (server-side initial)
    const siteSettings = contextSettings || propSettings;

    const { data: session, status } = useSession();
    const geoRestricted = useGeoRestriction();
    
    // Solo Mode logic - check context/prop flag
    const soloModeEnabled = siteSettings?.soloMode === true;
    
    // Role logic
    const isAdmin = session?.user?.role === 'ADMIN';
    const isSpecialPublisher = session?.user?.canPublishListings === true;
    
    // Visibility decision: Show if (Not in Solo Mode) OR (Is Admin) OR (Is Whitelisted)
    const canShowPublishCta = !soloModeEnabled || isAdmin || isSpecialPublisher;
    const [categories, setCategories] = useState<any[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);

    // Dynamic colors
    const primaryColor = siteSettings?.primaryColor || '#FF6B35';
    const secondaryColor = siteSettings?.secondaryColor || '#F7931E';
    const headerColor = siteSettings?.headerColor || '#FFFFFF';
    const headerTextColor = siteSettings?.headerTextColor || '#000000';

    useEffect(() => {
        fetchCategories();

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories?onlyMain=true');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            // Fallback categories if API fails
            setCategories([
                { nameFr: 'Électronique', icon: '📱', slug: 'electronique' },
                { nameFr: 'Automobiles', icon: '🚗', slug: 'automobiles' },
                { nameFr: 'Mode', icon: '👗', slug: 'mode' },
                { nameFr: 'Maison', icon: '🏠', slug: 'maison' },
            ]);
        }
    };

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl shadow-lg border-b border-gray-200/50' : 'border-b border-gray-100'}`} style={{ backgroundColor: isScrolled ? `${headerColor}E6` : headerColor }}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between min-h-[100px] py-2">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {siteSettings?.logo ? (
                            <img
                                src={siteSettings.logo}
                                alt={siteSettings.siteName}
                                style={{ height: '80px', maxWidth: '300px', width: 'auto', objectFit: 'contain' }}
                                className="group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                                        boxShadow: `0 10px 15px -3px ${primaryColor}40`
                                    }}
                                >
                                    <span className="text-2xl">🛍️</span>
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className="text-xl font-black bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                                        }}
                                    >
                                        {siteSettings?.siteName}
                                    </span>
                                    {!isScrolled && siteSettings?.siteSlogan && (
                                        <span className="text-xs font-medium tracking-wide" style={{ color: headerTextColor }}>
                                            {siteSettings.siteSlogan}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </Link>

                    {/* Spacer pour pousser les actions à droite si nécessaire */}
                    <div className="flex-1"></div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-4">
                        {status === 'loading' ? (
                            <div className="w-32 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <>
                                {session ? (
                                    <Link
                                        href="/dashboard"
                                        className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 font-medium transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Compte</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 font-bold transition-colors"
                                    >
                                        Connexion
                                    </Link>
                                )}

                                {!canShowPublishCta ? null : geoRestricted ? (
                                    <button
                                        disabled
                                        className="px-6 py-3 bg-gray-400 text-white rounded-xl font-bold opacity-50 cursor-not-allowed flex items-center gap-2"
                                        title="Le dépôt d'annonces est limité à la Côte d'Ivoire"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="hidden sm:inline">Publier une annonce</span>
                                        <span className="sm:hidden">Publier</span>
                                    </button>
                                ) : (
                                    <Link
                                        href="/dashboard/create"
                                        className="px-6 py-3 text-white rounded-xl font-bold hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                        style={{
                                            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                                            boxShadow: `0 10px 15px -3px ${primaryColor}40`
                                        }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="hidden sm:inline">Publier une annonce</span>
                                        <span className="sm:hidden">Publier</span>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Categories Bar - Secondary Navigation */}
                <div className={`hidden md:flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide border-t border-white/10 pt-3 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden py-0 border-none' : 'h-auto opacity-100'}`}>
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            href={`/listings?category=${cat.slug}`}
                            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden"
                            style={{ color: headerTextColor }}
                        >
                            {/* Background Hover Effect */}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>

                            {/* Content */}
                            <span className="relative z-10 text-xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                                {cat.icon}
                            </span>
                            <span className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-300">
                                {cat.nameFr || cat.name}
                            </span>

                            {/* Status Indicator (Subtle) */}
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 delay-100"></div>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}

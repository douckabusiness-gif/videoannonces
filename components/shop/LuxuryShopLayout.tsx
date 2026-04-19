'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
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
    createdAt: string;
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
    videoUrl: string | null;
    customColors: any;
    trustBadges: any;
    logoUrl: string | null;
    backgroundUrl: string | null;
    premiumTier: string;
}

interface LuxuryShopLayoutProps {
    shop: ShopData;
    listings: Listing[];
}

export default function LuxuryShopLayout({ shop, listings }: LuxuryShopLayoutProps) {
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Color tokens
    const primaryColor = shop.customColors?.primary || '#FF6B00';
    
    // Categories data
    const categories = useMemo(() => {
        const cats = new Set(listings.map(l => l.category));
        return Array.from(cats);
    }, [listings]);

    // Data Segregation
    const newArrivals = useMemo(() => {
        return [...listings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
    }, [listings]);

    const listingsByCategory = useMemo(() => {
        const grouped: Record<string, Listing[]> = {};
        categories.forEach(cat => {
            grouped[cat] = listings.filter(l => l.category === cat);
        });
        return grouped;
    }, [listings, categories]);

    const logoToUse = shop.logoUrl || shop.avatar;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-white font-sans">
            {/* --- 1. PREMIUM CENTERED HEADER --- */}
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 ${
                    isScrolled 
                    ? 'py-3 bg-black/40 backdrop-blur-2xl border-b border-white/5' 
                    : 'py-8 bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                    {/* Left: Search placeholder or small nav */}
                    <div className="w-1/3 hidden md:flex items-center gap-6">
                        <button className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 hover:text-white transition-colors">Collection</button>
                        <button className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 hover:text-white transition-colors">Contact</button>
                    </div>

                    {/* Center: Centered Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <Link href={`/shop/${shop.id}`} className="group flex flex-col items-center gap-2">
                            {logoToUse ? (
                                <div className={`relative transition-all duration-500 overflow-hidden border border-white/10 ${isScrolled ? 'w-10 h-10 rounded-full' : 'w-20 h-20 rounded-xl'}`}>
                                    <Image src={logoToUse} alt={shop.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className={`bg-orange-600 flex items-center justify-center font-black transition-all duration-500 ${isScrolled ? 'w-10 h-10 rounded-full text-lg' : 'w-16 h-16 rounded-xl text-3xl'}`}>
                                    {shop.name[0]}
                                </div>
                            )}
                            {!isScrolled && (
                                <span className="font-black text-xs tracking-[0.4em] uppercase opacity-80 mt-1">{shop.name}</span>
                            )}
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="w-1/3 flex justify-end items-center gap-6">
                        {shop.whatsappNumber && (
                            <a 
                                href={`https://wa.me/${shop.whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] tracking-[0.2em] uppercase font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-orange-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                WhatsApp
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* --- 2. IMMERSIVE HERO --- */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-110">
                    {shop.videoUrl ? (
                        <video 
                            src={shop.videoUrl} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image 
                            src={shop.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600'} 
                            alt={shop.name} 
                            fill 
                            className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505]" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <div className="overflow-hidden mb-4">
                        <h2 className="text-orange-500 font-bold tracking-[0.5em] uppercase text-xs animate-slide-up">Maison {shop.name}</h2>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] animate-fade-in-blur">
                        EXCELLENCE<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">DISTINGUÉE</span>
                    </h1>
                    <p className="text-base md:text-xl text-white/60 mb-12 max-w-xl mx-auto font-medium leading-relaxed animate-fade-in delay-500">
                        {shop.bio || "Une collection exclusive pensée pour ceux qui exigent la perfection."}
                    </p>
                    <button 
                        onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-110 active:scale-95 animate-fade-in delay-700"
                    >
                        DÉCOUVREZ L'UNIVERS
                        <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-pulse opacity-30">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white" />
                </div>
            </section>

            {/* --- 3. VISUAL CATEGORIES (GLASSMORPHISM) --- */}
            <section id="categories" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px]">Navigation</span>
                    <h3 className="text-3xl font-black mt-2 uppercase">Les Collections</h3>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <button 
                            key={cat}
                            onClick={() => document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-orange-500/50 hover:bg-white/[0.05]"
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <span className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">✨</span>
                                <h4 className="text-sm font-black tracking-widest uppercase">{cat}</h4>
                                <div className="mt-4 w-0 h-[1px] bg-orange-500 group-hover:w-full transition-all duration-500" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-40" />
                        </button>
                    ))}
                </div>
            </section>

            {/* --- 4. NEW ARRIVALS --- */}
            <section className="py-24 bg-gradient-to-b from-transparent to-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px]">Nouveautés</span>
                            <h3 className="text-5xl font-black mt-2 uppercase tracking-tighter">Dernières<br/>Créations</h3>
                        </div>
                        <div className="hidden md:block h-[1px] flex-grow mx-12 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {newArrivals.map((listing) => (
                            <LuxuryListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. CATEGORY ROWS --- */}
            <main className="py-24 bg-[#050505]">
                {categories.map((cat) => (
                    <section key={cat} id={`cat-${cat}`} className="mb-32">
                        <div className="max-w-7xl mx-auto px-6 mb-12 flex items-baseline justify-between border-b border-white/5 pb-6">
                            <h3 className="text-2xl font-black uppercase tracking-widest">{cat}</h3>
                            <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{listingsByCategory[cat].length} Pièces</span>
                        </div>
                        
                        <div className="relative group">
                            <div className="flex gap-8 overflow-x-auto px-6 md:px-[calc((100vw-80rem)/2)] scroll-smooth scrollbar-none pb-8">
                                {listingsByCategory[cat].map((listing) => (
                                    <div key={listing.id} className="flex-none w-[280px] md:w-[350px]">
                                        <LuxuryListingCard listing={listing} />
                                    </div>
                                ))}
                                <div className="flex-none w-20" /> {/* Spacer */}
                            </div>
                        </div>
                    </section>
                ))}
            </main>

            {/* --- PREMIUM FOOTER --- */}
            <footer className="bg-white text-black py-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-12 relative overflow-hidden rounded-2xl border border-black/5">
                        {logoToUse ? (
                            <Image src={logoToUse} alt={shop.name} fill className="object-cover" />
                        ) : (
                            <div className="bg-orange-600 w-full h-full flex items-center justify-center font-black text-4xl text-white">
                                {shop.name[0]}
                            </div>
                        )}
                    </div>
                    <h4 className="text-4xl font-black mb-6 uppercase tracking-tight">{shop.name}</h4>
                    <p className="text-black/50 max-w-md mb-16 leading-relaxed font-medium">
                        {shop.bio || "Rejoignez l'univers de notre boutique et vivez une expérience d'achat unique à travers nos sélections premium."}
                    </p>
                    
                    <div className="flex gap-12 mb-24 grayscale opacity-50">
                        <span className="text-[10px] font-bold tracking-widest uppercase">Paris</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase">Abidjan</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase">Dubaï</span>
                    </div>

                    <div className="w-full h-[1px] bg-black/5 mb-12" />
                    
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                        <p>© {new Date().getFullYear()} {shop.name}. Powered by VIDEOannonce.</p>
                        <div className="flex gap-8">
                            <Link href="/terms" className="hover:text-orange-600 transition-colors">CGV</Link>
                            <Link href="/privacy" className="hover:text-orange-600 transition-colors">Confidentialité</Link>
                            <Link href="/help" className="hover:text-orange-600 transition-colors">Support</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <NativeChatWidget sellerId={shop.id} />

            <style jsx global>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-blur {
                    from { opacity: 0; filter: blur(20px); transform: scale(1.1); }
                    to { opacity: 1; filter: blur(0); transform: scale(1); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in-blur { animation: fade-in-blur 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-700 { animation-delay: 0.7s; }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                body { background-color: #050505; }
            `}</style>
        </div>
    );
}

function LuxuryListingCard({ listing }: { listing: Listing }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered && videoRef.current) {
            videoRef.current.play().catch(() => {});
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered]);

    return (
        <Link 
            href={`/listings/${listing.id}?autoplay=true`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-3xl border border-white/5 transition-all duration-700 group-hover:border-orange-500/30 shadow-2xl">
                <Image 
                    src={listing.thumbnailUrl} 
                    alt={listing.title} 
                    fill 
                    className={`object-cover transition-all duration-1000 ease-in-out ${isHovered ? 'scale-110 blur-sm opacity-50' : 'scale-100 opacity-100'}`}
                />
                <video 
                    ref={videoRef}
                    src={listing.videoUrl} 
                    muted 
                    loop 
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                />
                
                {/* Visual Depth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-orange-500 font-black text-2xl mb-1 tracking-tighter drop-shadow-lg">
                        {listing.price.toLocaleString()} <span className="text-xs uppercase ml-1">FCFA</span>
                    </span>
                    <h4 className="text-lg font-black text-white leading-tight mb-4 group-hover:text-orange-500 transition-colors drop-shadow-md">
                        {listing.title}
                    </h4>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="w-8 h-[1px] bg-white/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Details</span>
                    </div>
                </div>

                {/* Badge Urgent */}
                {listing.isUrgent && (
                    <div className="absolute top-6 left-6 bg-white text-black text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-2xl">
                        URGENT
                    </div>
                )}
            </div>
        </Link>
    );
}

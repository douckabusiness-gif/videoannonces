'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HeroSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'Toutes catégories', icon: '🔍' },
        { value: 'electronics', label: 'Électronique', icon: '📱' },
        { value: 'fashion', label: 'Mode', icon: '👗' },
        { value: 'home', label: 'Maison', icon: '🏠' },
        { value: 'vehicles', label: 'Véhicules', icon: '🚗' },
        { value: 'services', label: 'Services', icon: '🛠️' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        router.push(`/listings?${params.toString()}`);
    };

    return (
        <section className="relative h-[600px] md:h-[700px] overflow-hidden">
            {/* Vidéo de fond */}
            <div className="absolute inset-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/hero-banner.mp4" type="video/mp4" />
                    {/* Fallback gradient si la vidéo ne charge pas */}
                </video>

                {/* Overlay gradient pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>

                {/* Overlay avec motif */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
            </div>

            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                <div className="w-full max-w-4xl mx-auto text-center">
                    {/* Badge animé */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-white mb-6 border border-white/20 shadow-2xl animate-fade-in">
                        <span className="text-2xl animate-bounce">🎉</span>
                        <span className="font-bold text-sm md:text-base">Bienvenue sur VideoBoutique</span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                        Achetez et Vendez
                        <br />
                        <span className="bg-gradient-to-r from-orange-400 via-yellow-300 to-amber-200 bg-clip-text text-transparent animate-gradient">
                            en Vidéo
                        </span>
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-lg md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-medium drop-shadow-lg">
                        Découvrez des milliers d'annonces avec vidéos, des boutiques premium et des offres urgentes
                    </p>

                    {/* Barre de recherche améliorée */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 border border-white/50">
                            {/* Sélecteur de catégorie */}
                            <div className="relative flex-shrink-0">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none w-full md:w-auto pl-4 pr-10 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none font-bold text-gray-700 cursor-pointer transition-all hover:from-gray-100 hover:to-gray-200"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.icon} {cat.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Champ de recherche */}
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher des produits, services, boutiques..."
                                    className="w-full px-6 py-4 rounded-xl border-2 border-transparent focus:border-orange-500 focus:outline-none text-gray-800 font-semibold placeholder-gray-400 bg-white"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bouton de recherche */}
                            <button
                                type="submit"
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white rounded-xl font-black shadow-xl hover:shadow-2xl hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="hidden md:inline">Rechercher</span>
                            </button>
                        </div>
                    </form>

                    {/* Tags populaires */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-white/90 font-semibold text-sm">Recherches populaires:</span>
                        {['iPhone', 'Voiture', 'Appartement', 'Vêtements', 'Électronique'].map((tag) => (
                            <Link
                                key={tag}
                                href={`/listings?q=${tag}`}
                                className="px-4 py-2 bg-white/15 backdrop-blur-md text-white rounded-lg hover:bg-white/25 transition-all border border-white/20 font-semibold hover:scale-110 transform shadow-lg text-sm"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vague en bas pour transition fluide */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path
                        d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </section>
    );
}

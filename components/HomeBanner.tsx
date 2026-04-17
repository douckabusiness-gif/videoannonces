'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BannerSlide {
    id: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    videoUrl: string;
    order: number;
}

export default function HomeBanner() {
    const [slides, setSlides] = useState<BannerSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        fetchBannerConfig();
    }, []);

    // Auto-play diaporama
    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const fetchBannerConfig = async () => {
        try {
            const res = await fetch('/api/admin/banner');
            const data = await res.json();

            if (data.enabled && data.slides && data.slides.length > 0) {
                setSlides(data.slides.sort((a: BannerSlide, b: BannerSlide) => a.order - b.order));
                setEnabled(true);
            }
        } catch (error) {
            console.error('Error fetching banner:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !enabled || slides.length === 0) {
        return null;
    }

    const slide = slides[currentSlide];

    return (
        <div className="relative w-full max-w-7xl aspect-[21/9] max-h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl mx-auto my-8 shadow-2xl group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 animate-gradient-shift" />

            {/* Médias (Vidéos/Images) */}
            {slides.map((s, index) => {
                const isSlideVideo = s.videoUrl.includes('.mp4') || s.videoUrl.includes('.webm');
                return isSlideVideo ? (
                    <video
                        key={s.id}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <source src={s.videoUrl} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        key={s.id}
                        src={s.videoUrl}
                        alt={s.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                );
            })}

            {/* Multi-layer overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Animated particles effect */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float-slow" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float-medium" />
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-300 rounded-full animate-float-fast" />
                <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-orange-300 rounded-full animate-float-slow" />
            </div>

            {/* Contenu */}
            <div className="relative h-full flex items-center">
                <div className="container mx-auto px-12">
                    <div className="max-w-3xl">
                        {/* Badge/Tag avec glassmorphism */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 mb-8 animate-fade-in shadow-lg">
                            <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                            <span className="text-white text-sm font-bold tracking-wide">✨ Nouveau</span>
                        </div>

                        {/* Titre avec effet de texte premium */}
                        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight animate-fade-in-delay">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-pink-100 drop-shadow-2xl">
                                {slide.title}
                            </span>
                        </h1>

                        {/* Description avec meilleure lisibilité */}
                        {slide.description && (
                            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl leading-relaxed animate-fade-in-delay-2 font-medium drop-shadow-lg">
                                {slide.description}
                            </p>
                        )}

                        {/* Bouton CTA Premium avec effet glow */}
                        {slide.buttonText && slide.buttonLink && (
                            <div className="animate-fade-in-delay-3">
                                <Link
                                    href={slide.buttonLink}
                                    className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 group shadow-2xl overflow-hidden"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />

                                    {/* Button content */}
                                    <span className="relative z-10">{slide.buttonText}</span>
                                    <svg
                                        className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>

                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicateurs de slides - Design moderne avec glassmorphism */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-12 flex gap-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className="group relative"
                            aria-label={`Slide ${index + 1}`}
                        >
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 w-16 shadow-lg shadow-orange-500/50'
                                : 'bg-white/40 w-10 group-hover:bg-white/70 group-hover:w-12'
                                }`} />
                        </button>
                    ))}
                </div>
            )}

            {/* Boutons de navigation - Design premium */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center transition-all duration-300 z-20 border border-white/30 group hover:scale-110 shadow-xl"
                        aria-label="Slide précédente"
                    >
                        <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center transition-all duration-300 z-20 border border-white/30 group hover:scale-110 shadow-xl"
                        aria-label="Slide suivante"
                    >
                        <svg className="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Effet de brillance au survol - Enhanced */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500" />
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes gradient-shift {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }

                @keyframes float-medium {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-15px) translateX(-10px);
                    }
                }

                @keyframes float-fast {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-25px) translateX(15px);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }

                .animate-fade-in-delay {
                    animation: fade-in 1s ease-out 0.3s both;
                }

                .animate-fade-in-delay-2 {
                    animation: fade-in 1s ease-out 0.5s both;
                }

                .animate-fade-in-delay-3 {
                    animation: fade-in 1s ease-out 0.7s both;
                }

                .animate-gradient-shift {
                    animation: gradient-shift 8s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

interface Stats {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalMessages: number;
    responseRate: number;
}

export default function PremiumDashboardHome() {
    const { data: session } = useSession();
    const { t } = useTranslation();
    const [stats, setStats] = useState<Stats>({
        totalListings: 0,
        activeListings: 0,
        totalViews: 0,
        totalMessages: 0,
        responseRate: 0,
    });
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    // Particle animation for premium feel
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }[] = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                ctx.fill();
            });
            animRef.current = requestAnimationFrame(draw);
        };
        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Erreur stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const tierLabel = session?.user?.premiumTier === 'ELITE' ? 'ÉLITE'
        : session?.user?.premiumTier === 'PRO' ? 'PRO'
        : 'PREMIUM';

    const tierColor = session?.user?.premiumTier === 'ELITE'
        ? 'from-purple-400 via-pink-400 to-purple-600'
        : 'from-amber-300 via-yellow-400 to-amber-600';

    const firstName = session?.user?.name?.split(' ')[0] || 'Patron';

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Gold particle canvas background */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ background: 'transparent' }}
            />

            {/* Dark luxury background */}
            <div className="fixed inset-0 -z-10 bg-[#080808]" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,175,55,0.08),transparent)]" />

            <div className="relative z-10 px-4 md:px-6 py-6 space-y-8 max-w-7xl mx-auto">

                {/* ─── TOP BADGE ─── */}
                <div className={`transform transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${tierColor} text-black text-xs font-black tracking-widest uppercase shadow-lg shadow-amber-500/20`}>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            Boutique {tierLabel}
                        </div>
                    </div>

                    {/* Gold divider line */}
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mt-4" />
                </div>

                {/* ─── HERO GREETING ─── */}
                <div className={`transform transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <p className="text-amber-400/60 text-xs font-bold tracking-[0.4em] uppercase mb-2">
                        Tableau de Bord Exclusif
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none text-white mb-3">
                        Bienvenue,{' '}
                        <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            {firstName}
                        </span>
                    </h1>
                    <p className="text-white/40 text-sm md:text-base max-w-xl">
                        Gérez votre boutique premium et accédez à des outils exclusifs réservés à votre niveau d'abonnement.
                    </p>
                </div>

                {/* ─── LUXURY KPI CARDS ─── */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transform transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {[
                        {
                            label: 'Annonces Actives',
                            value: loading ? '—' : `${stats.activeListings}/${stats.totalListings}`,
                            icon: '📦',
                            accent: 'amber',
                        },
                        {
                            label: 'Vues Totales',
                            value: loading ? '—' : stats.totalViews.toLocaleString(),
                            icon: '👁️',
                            accent: 'amber',
                        },
                        {
                            label: 'Messages',
                            value: loading ? '—' : stats.totalMessages,
                            icon: '💬',
                            accent: 'amber',
                        },
                        {
                            label: 'Taux de Réponse',
                            value: loading ? '—' : `${stats.responseRate}%`,
                            icon: '⚡',
                            accent: 'amber',
                        },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            className="group relative rounded-2xl overflow-hidden"
                            style={{ transitionDelay: `${200 + i * 80}ms` }}
                        >
                            {/* Gold border glow on hover */}
                            <div className="absolute -inset-[1px] bg-gradient-to-br from-amber-400/40 via-yellow-500/20 to-amber-400/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative bg-[#121212] border border-white/5 rounded-2xl p-5 h-full group-hover:border-amber-500/20 transition-colors duration-500">
                                {/* Icon */}
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{kpi.icon}</div>
                                
                                {/* Value */}
                                <div className="text-3xl font-black text-white mb-1 tabular-nums">
                                    {kpi.value}
                                </div>
                                
                                {/* Label */}
                                <div className="text-[11px] font-bold uppercase tracking-widest text-white/30">
                                    {kpi.label}
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── PREMIUM ACTIONS ─── */}
                <div className={`transform transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-4 mb-5">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60">Actions Exclusives</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            {
                                href: '/dashboard/create',
                                icon: '✦',
                                label: 'Nouvelle Annonce',
                                sub: 'Publier du contenu',
                                gold: true,
                            },
                            {
                                href: '/dashboard/listings',
                                icon: '◈',
                                label: 'Mes Annonces',
                                sub: 'Gérer le catalogue',
                            },
                            {
                                href: '/dashboard/shop',
                                icon: '◉',
                                label: 'Ma Boutique',
                                sub: 'Personnaliser',
                            },
                            {
                                href: '/dashboard/analytics',
                                icon: '◆',
                                label: 'Analytiques',
                                sub: 'Performances',
                            },
                            {
                                href: '/dashboard/messages',
                                icon: '◐',
                                label: 'Messages',
                                sub: 'Conversations',
                            },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                {action.gold ? (
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 opacity-100" />
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-[#121212]" />
                                        <div className="absolute inset-[1px] rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-colors duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </>
                                )}
                                
                                <div className="relative p-5">
                                    <div className={`text-3xl font-black mb-3 ${action.gold ? 'text-black' : 'text-amber-400/60 group-hover:text-amber-400 transition-colors'}`}>
                                        {action.icon}
                                    </div>
                                    <p className={`text-sm font-black leading-tight mb-0.5 ${action.gold ? 'text-black' : 'text-white'}`}>
                                        {action.label}
                                    </p>
                                    <p className={`text-[10px] font-bold uppercase tracking-wider ${action.gold ? 'text-black/60' : 'text-white/30'}`}>
                                        {action.sub}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ─── PREMIUM FEATURES SPOTLIGHT ─── */}
                <div className={`transform transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-4 mb-5">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60">Fonctionnalités Premium</span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Boutique personnalisée */}
                        <Link href="/dashboard/shop" className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/5 hover:border-amber-500/20 transition-all duration-500 p-6 block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                            
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-black mb-1">Boutique Luxe</h3>
                                <p className="text-white/30 text-xs leading-relaxed">Votre vitrine premium avec layout immersif et personnalisation avancée.</p>
                                <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs font-bold">
                                    <span>Configurer</span>
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Analytiques avancées */}
                        <Link href="/dashboard/analytics" className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/5 hover:border-amber-500/20 transition-all duration-500 p-6 block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                            
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-black mb-1">Analytiques Avancées</h3>
                                <p className="text-white/30 text-xs leading-relaxed">Suivez vos performances en temps réel : vues, clics, conversions.</p>
                                <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs font-bold">
                                    <span>Consulter</span>
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Abonnement */}
                        <Link href="/dashboard/subscription" className="group relative rounded-2xl overflow-hidden bg-[#0f0f0f] border border-white/5 hover:border-amber-500/20 transition-all duration-500 p-6 block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700" />
                            
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-black mb-1">Mon Abonnement</h3>
                                <p className="text-white/30 text-xs leading-relaxed">Gérez votre plan {tierLabel} et découvrez les avantages exclusifs.</p>
                                <div className="mt-4 flex items-center gap-2 text-amber-400 text-xs font-bold">
                                    <span>Voir le plan</span>
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* ─── GOLD STATUS BAR ─── */}
                <div className={`transform transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative rounded-2xl overflow-hidden">
                        {/* Gold gradient border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-400/10 to-amber-500/20 rounded-2xl" />
                        <div className="absolute inset-[1px] bg-[#0d0d0d] rounded-2xl" />
                        
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-6">
                            <div className="flex items-center gap-4">
                                {/* Premium star */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
                                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm">Statut Boutique {tierLabel}</p>
                                    <p className="text-white/30 text-xs">Accès complet à toutes les fonctionnalités premium</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard/shop"
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider rounded-full hover:from-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
                                >
                                    Voir ma boutique
                                </Link>
                                <Link
                                    href="/dashboard/subscription"
                                    className="px-5 py-2.5 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider rounded-full hover:bg-amber-500/10 transition-all duration-300"
                                >
                                    Mon plan
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom spacing */}
                <div className="h-8" />
            </div>

            {/* Subtle gold vignette */}
            <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
}

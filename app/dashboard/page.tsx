'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CosmicBackground from '@/components/dashboard/CosmicBackground';
import PremiumDashboardHome from '@/components/dashboard/PremiumDashboardHome';
import { useTranslation } from '@/contexts/I18nContext';

// Détecte si l'utilisateur est un vendeur abonné premium
function isPremiumVendor(user: any): boolean {
    return !!(user?.premium && user?.premiumTier && user?.premiumTier !== 'FREE');
}

interface Stats {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    totalMessages: number;
    responseRate: number;
}

export default function DashboardPage() {
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

    const fetchRealStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats');
            if (response.ok) {
                const data = await response.json();
                setStats({
                    totalListings: data.totalListings,
                    activeListings: data.activeListings,
                    totalViews: data.totalViews,
                    totalMessages: data.totalMessages,
                    responseRate: data.responseRate,
                });
            }
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchRealStats();
    }, []);

    // ─── Page d'accueil exclusive pour vendeurs premium ───
    if (session && isPremiumVendor(session.user)) {
        return <PremiumDashboardHome />;
    }



    const statCards = [
        {
            title: t('dashboard.stats.activeListings'),
            value: stats.activeListings,
            total: stats.totalListings,
            icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            gradient: 'from-blue-400 via-blue-500 to-purple-600',
            glowColor: 'shadow-blue-500/50',
        },
        {
            title: t('dashboard.stats.totalViews'),
            value: stats.totalViews,
            icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            gradient: 'from-green-400 via-emerald-500 to-teal-600',
            glowColor: 'shadow-green-500/50',
        },
        {
            title: t('dashboard.stats.messages'),
            value: stats.totalMessages,
            icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
            gradient: 'from-purple-400 via-pink-500 to-red-600',
            glowColor: 'shadow-purple-500/50',
        },
        {
            title: t('dashboard.stats.responseRate'),
            value: `${stats.responseRate}%`,
            icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-orange-400 via-amber-500 to-yellow-600',
            glowColor: 'shadow-orange-500/50',
        },
    ];

    const quickActions = [
        {
            title: t('dashboard.quickActions.create.title'),
            description: t('dashboard.quickActions.create.desc'),
            href: '/dashboard/create',
            icon: '🚀',
            gradient: 'from-orange-500 via-red-500 to-pink-600',
        },
        {
            title: t('dashboard.quickActions.viewListings.title'),
            description: t('dashboard.quickActions.viewListings.desc'),
            href: '/dashboard/listings',
            icon: '📦',
            gradient: 'from-blue-500 via-cyan-500 to-teal-600',
        },
        {
            title: t('dashboard.quickActions.messages.title'),
            description: t('dashboard.quickActions.messages.desc'),
            href: '/dashboard/messages',
            icon: '💬',
            gradient: 'from-purple-500 via-violet-500 to-indigo-600',
        },
        {
            title: t('dashboard.quickActions.premium.title'),
            description: t('dashboard.quickActions.premium.desc'),
            href: '/dashboard/subscription',
            icon: '⭐',
            gradient: 'from-yellow-400 via-amber-500 to-orange-600',
        },
    ];

    return (
        <>
            {/* Cosmic Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 -z-10" />
            <CosmicBackground />

            <div className="relative z-10 space-y-6 md:space-y-8 px-4 md:px-0">
                {/* Header with Glow Effect */}
                <div className={`transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        {t('dashboard.welcomeUser', { name: session?.user?.name?.split(' ')[0] || 'Utilisateur' })}
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base lg:text-lg">{t('dashboard.subtitle')}</p>
                </div>

                {/* Stats Grid with Stagger Animation */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`group relative transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-xl md:rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse`} />

                            {/* Card */}
                            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                                <div className="flex items-start justify-between mb-3 md:mb-4">
                                    <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glowColor}`}>
                                        <div className="text-white">{stat.icon}</div>
                                    </div>
                                </div>
                                <div className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1">
                                    {stat.value}
                                    {stat.total && <span className="text-sm md:text-lg text-gray-400">/{stat.total}</span>}
                                </div>
                                <div className="text-xs md:text-sm text-gray-400 font-medium leading-tight">{stat.title}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions with Hover Effects */}
                <div className={`transform transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                        <span className="text-3xl md:text-4xl">⚡</span>
                        {t('dashboard.quickActions.title')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`group relative transform transition-all duration-500 hover:scale-105 md:hover:scale-110 active:scale-95 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${600 + index * 100}ms` }}
                            >
                                {/* Animated Border */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${action.gradient} rounded-xl md:rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse`} />

                                {/* Card */}
                                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700/50 group-hover:border-gray-600 transition-all duration-300">
                                    <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                                        {action.icon}
                                    </div>
                                    <h3 className={`text-sm md:text-base lg:text-lg font-bold text-white mb-1 group-hover:bg-gradient-to-r ${action.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight`}>
                                        {action.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-400 leading-tight hidden md:block">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Premium Banner with Pulse Animation */}
                {!session?.user?.premium && (
                    <div className={`transform transition-all duration-1000 delay-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="relative group">
                            {/* Animated Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 rounded-2xl md:rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />

                            {/* Banner */}
                            <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden">
                                {/* Animated Background Pattern */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" style={{
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 3s infinite'
                                    }} />
                                </div>

                                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-2">
                                            {t('dashboard.premiumBanner.title')}
                                            <span className="animate-bounce">⭐</span>
                                        </h3>
                                        <p className="text-orange-100 mb-4 text-sm md:text-base lg:text-lg leading-relaxed">
                                            {t('dashboard.premiumBanner.desc')}
                                        </p>
                                        <Link
                                            href="/dashboard/subscription"
                                            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-all font-bold shadow-2xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transform duration-300 text-sm md:text-base"
                                        >
                                            {t('dashboard.premiumBanner.cta')}
                                        </Link>
                                    </div>
                                    <div className="hidden lg:block text-7xl xl:text-9xl animate-bounce">🚀</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </>
    );
}

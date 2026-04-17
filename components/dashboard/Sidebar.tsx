'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useTranslation } from '@/contexts/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface SidebarProps {
    className?: string;
    onNavigate?: () => void;
    isVendor: boolean;
    userName: string;
    userAvatar?: string | null;
}

export default function Sidebar({ className = '', onNavigate, isVendor, userName, userAvatar }: SidebarProps) {
    const pathname = usePathname();
    const { siteSettings } = useSiteSettings();
    const { t } = useTranslation();

    const { data: session } = useSession();
    // Solo Mode logic
    const soloModeEnabled = siteSettings?.soloMode === true;
    
    // Role logic
    const isAdmin = session?.user?.role === 'ADMIN';
    const isSpecialPublisher = session?.user?.canPublishListings === true;
    
    // Vendor Nav logic
    const canShowVendorNav = isVendor || isAdmin || isSpecialPublisher;

    const allMenuItems = [
        {
            name: t('dashboard.menu.dashboard'),
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            gradient: 'from-blue-400 to-purple-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.listings'),
            href: '/dashboard/listings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            gradient: 'from-green-400 to-teal-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.create'),
            href: '/dashboard/create',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            gradient: 'from-orange-400 to-pink-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.messages'),
            href: '/dashboard/messages',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            gradient: 'from-purple-400 to-indigo-600',
            vendorOnly: true
        },
        {
            name: 'Avis Clients', // Fallback name if translation key missing
            href: '/dashboard/reviews',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ),
            gradient: 'from-yellow-400 to-amber-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.analytics'),
            href: '/dashboard/analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
            ),
            gradient: 'from-cyan-400 to-blue-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.shop'),
            href: '/dashboard/shop',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            gradient: 'from-pink-400 to-rose-600',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.subscription'),
            href: '/dashboard/subscription',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            gradient: 'from-brand-primary to-brand-secondary',
            vendorOnly: true
        },
        {
            name: t('dashboard.menu.settings'),
            href: '/dashboard/settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            gradient: 'from-gray-400 to-gray-600',
        },
        {
            name: 'SEO Référencement',
            href: '/dashboard/settings/seo',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7v6m4-6v6m4-6v6" />
                </svg>
            ),
            gradient: 'from-purple-500 to-blue-500',
            vendorOnly: true
        },

        {
            name: 'Publicités',
            href: '/admin/banner',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            gradient: 'from-purple-500 to-indigo-600',
            adminOnly: true
        }
    ];

    const menuItems = allMenuItems.filter(item => {
        // Filtrage Admin
        // @ts-ignore
        if (item.adminOnly) {
            return isAdmin;
        }

        // Filtrage Premium
        // @ts-ignore
        if (item.premiumOnly && !session?.user?.premium) {
            return false;
        }

        if (!canShowVendorNav) {
            // @ts-ignore
            return !item.vendorOnly;
        }
        return true;
    });

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <aside className={`relative bg-gray-900/95 backdrop-blur-xl border-r border-purple-500/20 flex flex-col ${className} overflow-hidden`}>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-violet-900/20 pointer-events-none" />

            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-pink-500/5 animate-pulse pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {/* Logo */}
                <div className="p-6 border-b border-purple-500/20">
                    <Link href="/" className="block group mb-4">
                        {siteSettings?.logo ? (
                            <div className="relative w-full h-auto min-h-[80px] flex items-center justify-start py-2">
                                {/* Glow effect behind logo */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                                <img
                                    src={siteSettings.logo}
                                    alt={siteSettings.siteName || 'VideoAnnonces'}
                                    className="relative z-10 h-full w-auto max-w-full object-contain object-left transition-transform duration-300 group-hover:scale-105"
                                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />

                                    {/* Logo */}
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <span className="text-white font-bold text-2xl">V</span>
                                    </div>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white via-orange-100 to-red-100 bg-clip-text text-transparent tracking-tighter truncate">
                                    VIDEOANNONCES-CI
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Notification Bell */}
                    <div className="flex justify-start px-2">
                        <NotificationBell />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavigate}
                                className="group relative block"
                            >
                                {/* Glow effect for active/hover */}
                                {isActive && (
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-50 animate-pulse`} />
                                )}

                                {/* Menu Item */}
                                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}>
                                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-medium">{item.name}</span>

                                    {/* Hover glow */}
                                    {!isActive && (
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300`} />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-purple-500/20 space-y-4">
                    {/* Language Switcher */}
                    <div className="flex justify-center">
                        <LanguageSwitcher />
                    </div>

                    <button
                        onClick={handleLogout}
                        className="group relative w-full"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />

                        {/* Button */}
                        <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium">{t('dashboard.menu.logout')}</span>
                        </div>
                    </button>
                </div>
            </div>
        </aside>
    );
}

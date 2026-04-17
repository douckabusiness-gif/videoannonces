'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function MobileNavigation() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Simuler le comptage des messages non lus
    useEffect(() => {
        if (session) {
            // TODO: Remplacer par un vrai appel API
            setUnreadMessages(3);
        }
    }, [session]);

    const { siteSettings } = useSiteSettings();
    const isAdmin = session?.user?.role === 'ADMIN';
    const isSpecialPublisher = session?.user?.canPublishListings === true;
    const canPublish = !siteSettings?.soloMode || isAdmin || isSpecialPublisher;

    const navItems = [
        {
            name: 'Accueil',
            href: '/',
            icon: '🏠',
            activeIcon: '🏠',
        },
        {
            name: 'Annonces',
            href: '/listings',
            icon: '📋',
            activeIcon: '📋',
        },
        // Bouton central de publication (seulement si autorisé)
        ...(canPublish ? [{
            name: 'Publier',
            href: '/dashboard/create',
            icon: '✨',
            activeIcon: '✨',
            isSpecial: true
        }] : []),
        {
            name: 'Boutiques',
            href: '/shops',
            icon: '🏪',
            activeIcon: '🏪',
        },
        {
            name: 'Messages',
            href: session ? '/dashboard/messages' : '/login',
            icon: '💬',
            activeIcon: '💬',
            badge: unreadMessages > 0 ? unreadMessages : null,
        },
        {
            name: 'Profil',
            href: session ? '/dashboard' : '/login',
            icon: '👤',
            activeIcon: '👤',
        },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
            <div className="flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
                {navItems
                    // Filtrer pour n'afficher "Messages" que si l'utilisateur est connecté
                    .filter(item => item.name !== 'Messages' || session)
                    .map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300
                ${item.isSpecial ? 'bg-orange-500 text-white shadow-lg -mt-8 w-14 h-14 rounded-full border-4 border-white' : 
                  active
                                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110 shadow-lg shadow-orange-500/30'
                                        : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50 active:scale-95'
                                    }
              `}
                            >
                                {/* Badge de notification */}
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}

                                {/* Icône */}
                                <span className={`text-2xl transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                                    {active ? item.activeIcon : item.icon}
                                </span>

                                {/* Label */}
                                <span className={`text-xs font-medium transition-all duration-300 ${active ? 'font-bold' : ''}`}>
                                    {item.name}
                                </span>

                                {/* Indicateur actif */}
                                {active && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                                )}
                            </Link>
                        );
                    })}
            </div>

            {/* Barre d'indication pour iPhone */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 opacity-50" />
        </nav>
    );
}

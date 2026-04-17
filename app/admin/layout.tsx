'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import CollapsibleMenuSection from '@/components/admin/CollapsibleMenuSection';
import MobileNavigation from '@/components/MobileNavigation';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isCheckingRole, setIsCheckingRole] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // 🔒 PROTECTION ADMIN - VÉRIFICATION DU RÔLE
    useEffect(() => {
        // Si on est sur la page de login, pas de vérification
        if (pathname === '/admin/login') {
            setIsCheckingRole(false);
            return;
        }

        // Attendre que la session soit chargée
        if (status === 'loading') {
            return;
        }

        // Si pas connecté, rediriger vers login admin
        if (status === 'unauthenticated') {
            router.push('/admin/login');
            return;
        }

        // Si connecté, vérifier le rôle
        if (status === 'authenticated') {
            // @ts-ignore - role est ajouté dans types/next-auth.d.ts
            const userRole = session?.user?.role;

            // ❌ ACCÈS REFUSÉ SI PAS ADMIN
            if (userRole !== 'ADMIN') {
                console.error('🚫 ACCÈS REFUSÉ - Rôle requis: ADMIN, Rôle actuel:', userRole);
                alert('⛔ Accès Refusé\n\nVous devez être administrateur pour accéder à cette section.\n\nVous allez être redirigé vers la page d\'accueil.');
                router.push('/');
                return;
            }

            // ✅ ACCÈS AUTORISÉ
            console.log('✅ Accès admin autorisé pour:', session.user.name);
            setIsCheckingRole(false);
        }
    }, [status, session, pathname, router]);

    // Fermer le menu mobile lors de la navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Si on est sur la page de login, ne pas afficher le layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Afficher un loader pendant la vérification
    if (status === 'loading' || isCheckingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-bold">Vérification des accès...</p>
                    <p className="text-gray-400 text-sm mt-2">Authentification admin en cours</p>
                </div>
            </div>
        );
    }

    // Si pas ADMIN, ne rien afficher (redirection en cours)
    // @ts-ignore
    if (session?.user?.role !== 'ADMIN') {
        return null;
    }

    const menuSections = [
        {
            title: 'Gestion',
            icon: '👥',
            items: [
                {
                    name: '✨ Publier une annonce',
                    href: '/admin/listings/new',
                    icon: (
                        <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    ),
                    className: "bg-red-600/10 border-l-4 border-red-600 ml-[-8px] pl-2" // Custom styling if supported
                },
                {
                    name: t('admin.sidebar.users'),
                    href: '/admin/users',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.listings'),
                    href: '/admin/listings',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.categories'),
                    href: '/admin/categories',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.moderation'),
                    href: '/admin/moderation',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Commerce',
            icon: '💰',
            items: [
                {
                    name: 'Validations Paiements', // Ou t('admin.sidebar.paymentValidations')
                    href: '/admin/payments',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.subscriptions'),
                    href: '/admin/subscriptions',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.plans'),
                    href: '/admin/plans',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.paymentMethods'),
                    href: '/admin/payment-methods',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.boosts'),
                    href: '/admin/boosts',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    )
                },
                {
                    name: 'Message Paiement',
                    href: '/admin/payment-message',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Personnalisation',
            icon: '🎨',
            items: [
                {
                    name: t('admin.sidebar.banner'),
                    href: '/admin/banner',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.homeAppearance'),
                    href: '/admin/home-appearance',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.i18n'),
                    href: '/admin/i18n-settings',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Système',
            icon: '⚙️',
            items: [
                {
                    name: t('admin.features.title') || 'Gestion des Fonctions',
                    href: '/admin/features',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 11-4 0V4zM7 8a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11h2m-1-1v2" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.settings'),
                    href: '/admin/settings',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.generalSettings'),
                    href: '/admin/settings/general',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.emailSettings'),
                    href: '/admin/settings/email',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.seoSettings'),
                    href: '/admin/settings/seo',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.automation'),
                    href: '/admin/automation',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: 'Outils',
            icon: '🔧',
            items: [
                {
                    name: t('admin.sidebar.analytics'),
                    href: '/admin/analytics',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    )
                },
                {
                    name: t('admin.sidebar.logs'),
                    href: '/admin/logs',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )
                }
            ]
        }
    ];

    // Filtrer les sections selon la recherche
    const filteredSections = searchQuery
        ? menuSections.map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(section => section.items.length > 0)
        : menuSections;



    return (
        <>
            {/* Navigation Mobile Globale (affichée par dessus le layout) */}
            <MobileNavigation />

            <div className="flex h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-[60] px-4 py-3 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">
                        A
                    </div>
                    <span className="font-bold text-lg">{t('admin.sidebar.adminPanel')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/listings/new"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-lg animate-pulse"
                    >
                        <span>✨</span>
                        <span>Publier</span>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Admin */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">
                            A
                        </div>
                        <span className="font-bold text-lg">{t('admin.sidebar.adminPanel')}</span>
                    </div>
                </div>

                {/* Barre de recherche */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none text-sm"
                        />
                        <svg
                            className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredSections.map((section) => (
                        <CollapsibleMenuSection
                            key={section.title}
                            title={section.title}
                            icon={section.icon}
                            items={section.items}
                            defaultOpen={section.title === 'Dashboard' || pathname.startsWith(`/admin/${section.title.toLowerCase()}`)}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white font-bold text-sm">
                                    {session?.user?.name?.[0] || 'A'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-400 truncate">{t('admin.sidebar.adminRole')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">{t('admin.sidebar.logout')}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 lg:pt-8">
                {children}
            </main>
        </div>
    </>
);
}

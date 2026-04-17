'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import NotificationBell from '@/components/notifications/NotificationBell';

interface DashboardShellProps {
    children: React.ReactNode;
    isVendor: boolean;
    userName: string;
    userAvatar?: string | null;
}

export default function DashboardShell({ children, isVendor, userName, userAvatar }: DashboardShellProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Empêcher le scroll du body quand le menu est ouvert
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleNavigate = () => {
        setMobileMenuOpen(false);
    };

    const toggleMenu = () => {
        console.log('🔘 Bouton hamburger cliqué! État actuel:', mobileMenuOpen);
        setMobileMenuOpen(prev => {
            console.log('📱 Nouveau état du menu:', !prev);
            return !prev;
        });
    };

    return (
        <div className="min-h-screen flex relative">
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                    onClick={() => {
                        console.log('🖱️ Clic sur overlay - fermeture du menu');
                        setMobileMenuOpen(false);
                    }}
                />
            )}

            <div className="hidden lg:block">
                <Sidebar
                    onNavigate={handleNavigate}
                    className="w-96 h-screen sticky top-0"
                    isVendor={isVendor}
                    userName={userName}
                    userAvatar={userAvatar}
                />
            </div>

            <div className={`
                lg:hidden fixed inset-y-0 left-0 z-[110] w-96 transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar
                    onNavigate={handleNavigate}
                    className="h-full"
                    isVendor={isVendor}
                    userName={userName}
                    userAvatar={userAvatar}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full lg:w-auto">
                {/* Top Bar Mobile */}
                <div className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/20 p-4 sticky top-0 z-50">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-violet-900/20 pointer-events-none" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Logo with Glow */}
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl blur opacity-75 animate-pulse pointer-events-none" />
                                <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">V</span>
                                </div>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                VideoBoutique
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative z-10">
                                <NotificationBell />
                            </div>
                            <button
                                type="button"
                                onClick={toggleMenu}
                                className="relative z-20 p-3 hover:bg-white/10 active:bg-white/20 rounded-lg transition-all text-white"
                                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                <div className="relative w-6 h-6">
                                    {mobileMenuOpen ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

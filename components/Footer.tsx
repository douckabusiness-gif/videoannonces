'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { siteSettings, loading } = useSiteSettings();

    const primaryColor = siteSettings.primaryColor || '#FF6B00';
    const secondaryColor = siteSettings.secondaryColor || '#FF8C00';
    const footerColor = siteSettings.footerColor || '#FFFFFF';
    const footerTextColor = siteSettings.footerTextColor || '#000000';

    // Modifié : On affiche le footer même pendant le chargement, avec des skeletons si nécessaire
    // if (loading) { return null; }

    return (
        <footer className="border-t border-gray-100 pt-16 pb-8" style={{ backgroundColor: footerColor }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Col 1: Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            {loading ? (
                                <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
                            ) : siteSettings.logo ? (
                                <img
                                    src={siteSettings.logo}
                                    alt={siteSettings.siteName}
                                    className="h-12 object-contain"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white"
                                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                    >
                                        <span className="text-xl">🛍️</span>
                                    </div>
                                    <span
                                        className="text-xl font-bold bg-clip-text text-transparent"
                                        style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                                    >
                                        {siteSettings.siteName || 'VideoBoutique'}
                                    </span>
                                </div>
                            )}
                        </Link>
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ) : siteSettings.siteDescription && (
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {siteSettings.siteDescription}
                            </p>
                        )}
                    </div>

                    {/* Col 2: Navigation */}
                    <div>
                        <h3 className="font-bold mb-4" style={{ color: footerTextColor }}>Navigation</h3>
                        <ul className="space-y-2 text-sm" style={{ color: footerTextColor }}>
                            <li><Link href="/listings" className="hover:text-orange-600 transition-colors">Toutes les annonces</Link></li>
                            <li><Link href="/shops" className="hover:text-orange-600 transition-colors">Boutiques</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Legal */}
                    <div>
                        <h3 className="font-bold mb-4" style={{ color: footerTextColor }}>Légal</h3>
                        <ul className="space-y-2 text-sm" style={{ color: footerTextColor }}>
                            <li><Link href="/terms" className="hover:text-orange-600 transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link href="/privacy" className="hover:text-orange-600 transition-colors">Politique de confidentialité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: footerTextColor }}>
                    <p>© {currentYear} {siteSettings.siteName}. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

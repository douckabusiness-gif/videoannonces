'use client';

import Link from 'next/link';

interface ShopHeaderProps {
    shop: {
        name: string;
        avatar?: string | null;
    };
    subdomain: string;
}

export default function ShopHeader({ shop, subdomain }: ShopHeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={`/shop/${subdomain}`} className="flex items-center gap-3">
                        {shop.avatar && (
                            <img
                                src={shop.avatar}
                                alt={shop.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        )}
                        <span className="text-xl font-black text-gray-900">{shop.name}</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href={`/shop/${subdomain}`}
                            className="text-gray-700 hover:text-orange-600 font-medium transition"
                        >
                            Accueil
                        </Link>
                        <Link
                            href={`/shop/${subdomain}#annonces`}
                            className="text-gray-700 hover:text-orange-600 font-medium transition"
                        >
                            Annonces
                        </Link>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
                        >
                            Retour à VideoBoutique
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import ListingVideoPlayer from '@/components/ListingVideoPlayer';
import ContactWhatsAppButton from '@/components/ContactWhatsAppButton';

interface ListingPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ autoplay?: string }>;
}

async function getListingData(id: string) {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        rating: true,
                    }
                }
            }
        });

        if (!listing) {
            return null;
        }

        // Incrémenter les vues
        await prisma.listing.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        return listing;
    } catch (error) {
        console.error('Erreur chargement annonce:', error);
        return null;
    }
}

async function getSiteSettings() {
    try {
        return await prisma.siteSettings.findFirst();
    } catch (error) {
        return null;
    }
}

import { headers } from 'next/headers';

// ... (previous imports)

// Helper to get subdomain (can be moved to utils later)
function getSubdomain(host: string | null) {
    if (!host) return null;
    if (host.includes('localhost')) {
        const parts = host.split('.');
        return parts.length > 1 && parts[0] !== 'localhost' ? parts[0] : null;
    }
    const parts = host.split('.');
    if (parts.length >= 3) {
        // Exclude generic subdomains if needed, or assume middleware handles routing
        const reserved = ['www', 'api', 'admin', 'dashboard', 'videoboutique'];
        if (reserved.includes(parts[0])) return null;
        return parts[0];
    }
    return null;
}

export default async function ListingDetailPage({ params, searchParams }: ListingPageProps) {
    const { id } = await params;
    const { autoplay } = await searchParams;
    const headersList = await headers();
    const host = headersList.get('host');
    const subdomain = getSubdomain(host);

    // Fetch listing and global settings first
    const [listing, siteSettings] = await Promise.all([
        getListingData(id),
        getSiteSettings()
    ]);

    if (!listing) {
        notFound();
    }

    // Attempt to fetch current shop context if subdomain exists
    let currentShop = null;
    if (subdomain) {
        currentShop = await prisma.user.findFirst({
            where: {
                OR: [
                    { subdomain: subdomain },
                    { id: subdomain } // Fallback for ID-based subdomains if used
                ]
            },
            select: {
                name: true,
                logoUrl: true,
                avatar: true,
                subdomain: true,
            }
        });
    }

    const shouldAutoplay = autoplay === 'true';


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Dynamic Brand Link */}
                    <Link href={currentShop ? "/" : "/"} className="flex items-center gap-3 group">
                        {currentShop ? (
                            // --- SHOP HEADER ---
                            <>
                                {currentShop.logoUrl ? (
                                    <img
                                        src={currentShop.logoUrl}
                                        alt={currentShop.name}
                                        className="h-10 md:h-12 w-auto object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {currentShop.avatar ? (
                                            <img src={currentShop.avatar} alt={currentShop.name} className="w-10 h-10 rounded-full object-cover border border-orange-200" />
                                        ) : (
                                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">{currentShop.name[0]}</div>
                                        )}
                                        <span className="font-bold text-gray-900 text-lg">{currentShop.name}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            // --- GLOBAL HEADER ---
                            siteSettings?.logo ? (
                                <img
                                    src={siteSettings.logo}
                                    alt={siteSettings.siteName || 'VideoAnnonces'}
                                    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    style={{ maxHeight: '48px', maxWidth: '200px' }}
                                />
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black bg-gradient-to-r from-orange-500 via-green-500 to-orange-600 bg-clip-text text-transparent">
                                            {siteSettings?.siteName || 'VideoAnnonces-CI'}
                                        </span>
                                        <span className="text-xs text-gray-600 -mt-1">
                                            {siteSettings?.siteSlogan || 'Vos annonces en vidéo!'}
                                        </span>
                                    </div>
                                </>
                            )
                        )}
                    </Link>

                    {/* Dynamic Back Link */}
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {currentShop ? "Retour boutique" : "Retour"}
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Vidéo - 3 colonnes */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-800/50">
                                <ListingVideoPlayer
                                    src={listing.videoUrl}
                                    poster={listing.thumbnailUrl}
                                    autoPlay={shouldAutoplay}
                                    muted={!shouldAutoplay}
                                />
                            </div>

                            {/* Stats */}
                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="font-medium">{listing.views} vues</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Détails - 2 colonnes */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Prix */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-2xl shadow-orange-500/30 transform hover:scale-105 transition-transform">
                            <div className="text-white/80 text-sm font-medium mb-1">Prix</div>
                            <div className="text-4xl font-black text-white mb-1">
                                {listing.price.toLocaleString()}
                            </div>
                            <div className="text-white/90 text-lg font-semibold">FCFA</div>
                        </div>

                        {/* Titre et localisation */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                                {listing.title}
                            </h1>

                            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-semibold">{listing.location}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>

                        {/* Vendeur */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                                Vendeur
                            </h3>
                            <Link href={`/shop/${listing.user.id}`} className="flex items-center gap-4 mb-6 group/vendor hover:bg-orange-50 p-2 -m-2 rounded-2xl transition-colors">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center overflow-hidden ring-4 ring-orange-500/20 shadow-lg group-hover/vendor:ring-orange-500/40 transition-all">
                                        {listing.user.avatar ? (
                                            <Image src={listing.user.avatar} alt={listing.user.name} width={64} height={64} className="object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-orange-600">
                                                {listing.user.name[0]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-gray-900 group-hover/vendor:text-orange-600 transition-colors uppercase">
                                        {listing.user.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(listing.user.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">({listing.user.rating.toFixed(1)})</span>
                                    </div>
                                    <div className="text-xs text-orange-600 font-bold mt-1 group-hover/vendor:underline">Voir le profil →</div>
                                </div>
                            </Link>

                            {/* Bouton Contact WhatsApp Protégé */}
                            <ContactWhatsAppButton
                                phone={listing.user.phone}
                                title={listing.title}
                                price={listing.price}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

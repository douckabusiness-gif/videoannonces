'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Listing {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    videoUrl: string;
    location: string;
    category: string;
    views: number;
}

interface ShopListingGridProps {
    listings: Listing[];
}

export default function ShopListingGrid({ listings }: ShopListingGridProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune annonce</h3>
                <p className="text-gray-600">Cette boutique n'a pas encore d'annonces actives</p>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
                <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/4] bg-gray-900">
                        <Image
                            src={listing.thumbnailUrl}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                                <svg className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Views */}
                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            {listing.views}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition">
                            {listing.title}
                        </h3>

                        <div className="text-2xl font-black text-orange-600 mb-3">
                            {listing.price.toLocaleString()} FCFA
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-gray-100 rounded-lg font-medium">
                                {listing.category}
                            </span>
                            <span>📍 {listing.location}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

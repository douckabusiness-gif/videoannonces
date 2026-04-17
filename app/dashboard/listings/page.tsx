'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';

interface Listing {
    id: string;
    title: string;
    price: number;
    videoUrl: string;
    thumbnailUrl: string;
    status: string;
    views: number;
    createdAt: string;
    boosted?: boolean;
}

export default function MyListingsPage() {
    const { t } = useTranslation();
    const [listings, setListings] = useState<Listing[]>([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await fetch('/api/listings?userId=me');
            if (response.ok) {
                const data = await response.json();
                setListings(data.listings || []);
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('listings.deleteConfirm') || 'Voulez-vous vraiment supprimer cette annonce ?')) return;

        try {
            const response = await fetch(`/api/listings/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setListings(listings.filter(l => l.id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur réseau');
        }
    };

    const filteredListings = listings.filter(listing => {
        if (filter === 'all') return true;
        return listing.status === filter;
    });

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2">{t('listings.title')}</h1>
                    <p className="text-purple-200 text-sm md:text-base">{t('listings.subtitle', { count: listings.length })}</p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/30 font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('listings.createButton')}
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                {[
                    { id: 'all', label: t('listings.filters.all') },
                    { id: 'active', label: t('listings.filters.active') },
                    { id: 'expired', label: t('listings.filters.expired') },
                    { id: 'draft', label: t('listings.filters.draft') },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === tab.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Listings Grid */}
            {
                loading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">{t('listings.loading')}</p>
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('listings.empty.title')}</h3>
                        <p className="text-gray-600 mb-6">{t('listings.empty.desc')}</p>
                        <Link
                            href="/dashboard/create"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg font-semibold"
                        >
                            {t('listings.empty.cta')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredListings.map((listing) => (
                            <div
                                key={listing.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-1"
                            >
                                {/* Thumbnail - FORMAT CARRÉ */}
                                <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                                    <Image
                                        src={listing.thumbnailUrl}
                                        alt={listing.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Badge de statut */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-lg flex items-center gap-1 ${listing.status === 'active'
                                            ? 'bg-green-500/90 text-white'
                                            : listing.status === 'expired'
                                                ? 'bg-red-500/90 text-white'
                                                : 'bg-gray-500/90 text-white'
                                            }`}>
                                            <span className={`w-1 h-1 rounded-full ${listing.status === 'active' ? 'bg-white animate-pulse' : 'bg-white/70'
                                                }`} />
                                            {listing.status === 'active' ? t('listings.status.active') : listing.status === 'expired' ? t('listings.status.expired') : t('listings.status.draft')}
                                        </span>
                                    </div>

                                    {/* Badge boosted */}
                                    {listing.boosted && (
                                        <div className="absolute top-2 left-2 z-10">
                                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white backdrop-blur-md shadow-lg flex items-center gap-1">
                                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {t('listings.card.boosted')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Icône play */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Info - VERSION COMPACTE */}
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-orange-600 transition-colors">
                                        {listing.title}
                                    </h3>

                                    {/* Prix */}
                                    <div className="mb-2 flex items-baseline gap-1">
                                        <span className="text-lg font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                            {listing.price.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] font-semibold text-gray-500">F</span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span className="font-medium">{listing.views}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(listing.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={`/listings/${listing.id}`}
                                            className="flex-1 px-2 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all text-center text-xs font-semibold border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-1 group/btn"
                                        >
                                            <svg className="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {t('listings.card.view')}
                                        </Link>
                                        <Link
                                            href={`/dashboard/listings/${listing.id}/boost`}
                                            className="flex-1 px-2 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-xs font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 flex items-center justify-center gap-1 group/btn"
                                        >
                                            <svg className="w-3 h-3 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                                            </svg>
                                            {t('listings.card.boost')}
                                        </Link>
                                        <Link
                                            href={`/dashboard/listings/${listing.id}`}
                                            className="flex-1 px-2 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all text-xs font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center justify-center gap-1 group/btn"
                                        >
                                            <svg className="w-3 h-3 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            {t('listings.card.edit')}
                                        </Link>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div >
    );
}

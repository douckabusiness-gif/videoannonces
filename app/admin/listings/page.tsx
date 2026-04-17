'use client';

import { useState, useEffect } from 'react';

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    status: string;
    moderationStatus: string;
    moderatedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date;
    thumbnailUrl: string | null;  // ✅ AJOUTÉ
    videoUrl: string | null;       // ✅ AJOUTÉ
    user: {
        id: string;
        name: string;
        email: string | null;
        avatar: string | null;
    };
}

export default function AdminListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [moderationFilter, setModerationFilter] = useState('pending');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        fetchListings();
    }, [moderationFilter, categoryFilter, page]);

    const fetchListings = async () => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(moderationFilter && { moderationStatus: moderationFilter }),
                ...(categoryFilter && { category: categoryFilter })
            });

            const res = await fetch(`/api/admin/listings?${params}`);
            if (res.ok) {
                const data = await res.json();
                setListings(data.listings);
                setTotalPages(data.pagination.totalPages);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (listingId: string, status: 'approved' | 'rejected', reason?: string) => {
        try {
            const res = await fetch(`/api/admin/listings/${listingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moderationStatus: status,
                    ...(reason && { rejectionReason: reason })
                })
            });

            if (res.ok) {
                fetchListings();
            }
        } catch (error) {
            console.error('Error moderating listing:', error);
        }
    };

    const handleDelete = async (listingId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

        try {
            const res = await fetch(`/api/admin/listings/${listingId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchListings();
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Modération des Annonces</h1>
                    <p className="text-gray-600 mt-1">Gérez et modérez toutes les annonces de la plateforme</p>
                </div>
                <a
                    href="/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-black shadow-lg shadow-red-200"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouvelle Annonce
                </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                    <p className="text-sm font-bold text-yellow-600 uppercase">En Attente</p>
                    <p className="text-3xl font-black text-yellow-700 mt-2">{stats.pending}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-sm font-bold text-green-600 uppercase">Approuvées</p>
                    <p className="text-3xl font-black text-green-700 mt-2">{stats.approved}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <p className="text-sm font-bold text-red-600 uppercase">Rejetées</p>
                    <p className="text-3xl font-black text-red-700 mt-2">{stats.rejected}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={moderationFilter}
                        onChange={(e) => setModerationFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvées</option>
                        <option value="rejected">Rejetées</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Filtrer par catégorie..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Listings */}
            <div className="space-y-4">
                {listings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex gap-6">
                            {/* Vidéo/Image Prévisualisation */}
                            {(listing.videoUrl || listing.thumbnailUrl) && (
                                <div className="w-64 flex-shrink-0">
                                    {listing.videoUrl ? (
                                        <video
                                            src={listing.videoUrl}
                                            controls
                                            className="w-full h-48 rounded-xl object-cover bg-black"
                                            poster={listing.thumbnailUrl || undefined}
                                        />
                                    ) : listing.thumbnailUrl ? (
                                        <img
                                            src={listing.thumbnailUrl}
                                            alt={listing.title}
                                            className="w-full h-48 rounded-xl object-cover"
                                        />
                                    ) : null}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Par {listing.user.name} • {new Date(listing.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${listing.moderationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            listing.moderationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {listing.moderationStatus === 'pending' ? 'EN ATTENTE' :
                                                listing.moderationStatus === 'approved' ? 'APPROUVÉE' : 'REJETÉE'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                            {listing.category}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>

                                <div className="flex items-center gap-4 mb-4">
                                    <p className="text-2xl font-black text-orange-600">{listing.price.toLocaleString()} FCFA</p>
                                </div>

                                {listing.rejectionReason && (
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                                        <p className="text-sm font-bold text-red-700">Raison du rejet:</p>
                                        <p className="text-sm text-red-600 mt-1">{listing.rejectionReason}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    {listing.moderationStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleModerate(listing.id, 'approved')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
                                            >
                                                ✓ Approuver
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt('Raison du rejet:');
                                                    if (reason) handleModerate(listing.id, 'rejected', reason);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
                                            >
                                                ✗ Rejeter
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(listing.id)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-bold"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Précédent
                </button>
                <span className="text-sm text-gray-600 font-medium">
                    Page {page} sur {totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

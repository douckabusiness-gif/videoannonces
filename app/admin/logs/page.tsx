'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Log {
    id: string;
    type: string;
    category: string;
    action: string;
    message: string;
    metadata?: any;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export default function LogsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<Log[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchLogs();
        }
    }, [status, router, page, typeFilter, categoryFilter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                ...(typeFilter && { type: typeFilter }),
                ...(categoryFilter && { category: categoryFilter }),
            });

            const response = await fetch(`/api/admin/logs?${params}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Erreur chargement logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCleanLogs = async (days: number) => {
        if (!confirm(`Supprimer les logs de plus de ${days} jours ?`)) return;

        try {
            const response = await fetch(`/api/admin/logs?days=${days}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Logs nettoyés avec succès !');
                fetchLogs();
            }
        } catch (error) {
            alert('Erreur lors du nettoyage');
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    };

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Logs Système</h1>
                <p className="text-gray-600 mt-2">Historique des événements et actions</p>
            </div>

            {/* Filtres et actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Tous</option>
                                <option value="info">Info</option>
                                <option value="success">Succès</option>
                                <option value="warning">Avertissement</option>
                                <option value="error">Erreur</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Toutes</option>
                                <option value="user">Utilisateur</option>
                                <option value="listing">Annonce</option>
                                <option value="payment">Paiement</option>
                                <option value="system">Système</option>
                                <option value="email">Email</option>
                                <option value="security">Sécurité</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleCleanLogs(30)}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold"
                        >
                            Nettoyer 30j+
                        </button>
                        <button
                            onClick={() => handleCleanLogs(90)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                        >
                            Nettoyer 90j+
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des logs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(log.type)}`}>
                                            <span>{getTypeIcon(log.type)}</span>
                                            <span>{log.type}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                            {log.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{log.message}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Aucun log trouvé
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Page {page} sur {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

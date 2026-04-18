'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    avatar: string | null;
    role: string;
    premium: boolean;
    premiumTier: string;
    suspended: boolean;
    suspendedUntil: Date | null;
    suspendedReason: string | null;
    verified: boolean;
    isVendor: boolean;
    createdAt: Date;
    _count: {
        listings: number;
        messages: number;
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [premiumFilter, setPremiumFilter] = useState('');
    const [suspendedFilter, setSuspendedFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [search, roleFilter, premiumFilter, suspendedFilter, page]);

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                ...(search && { search }),
                ...(roleFilter && { role: roleFilter }),
                ...(premiumFilter && { premium: premiumFilter }),
                ...(suspendedFilter && { suspended: suspendedFilter })
            });

            const res = await fetch(`/api/admin/users?${params}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId: string, updates: any) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                fetchUsers();
                setShowModal(false);
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleToggleVendor = async (userId: string, nextVendor: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVendor: nextVendor })
            });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error('Error toggling vendor:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Utilisateur supprimé avec succès');
                fetchUsers();
            } else {
                const data = await res.json();
                alert(`Erreur: ${data.error || 'Impossible de supprimer l\'utilisateur'}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Une erreur est survenue lors de la suppression');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900">Gestion des Utilisateurs</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Gérez tous les utilisateurs de la plateforme</p>
                </div>
            </div>

            <p className="text-sm text-gray-500">
                Les réglages <strong>inscription</strong> et <strong>nouveaux comptes vendeur</strong> se trouvent dans{' '}
                <strong>Admin → Paramètres → Général → onglet Avancé</strong>.
            </p>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="USER">Utilisateur</option>
                        <option value="ADMIN">Administrateur</option>
                    </select>
                    <select
                        value={premiumFilter}
                        onChange={(e) => setPremiumFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="true">Premium</option>
                        <option value="false">Gratuit</option>
                    </select>
                    <select
                        value={suspendedFilter}
                        onChange={(e) => setSuspendedFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="">Tous</option>
                        <option value="false">Actifs</option>
                        <option value="true">Suspendus</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Vendeur
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Activité
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                            {user.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{user.email || '—'}</p>
                                            <p className="text-sm text-gray-500">{user.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span
                                                    className={`inline-flex w-fit px-2 py-1 rounded-full text-xs font-bold ${
                                                        user.isVendor
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {user.isVendor ? 'Vendeur' : 'Client'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleVendor(user.id, !user.isVendor)
                                                    }
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                                                        user.isVendor
                                                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                    }`}
                                                >
                                                    {user.isVendor ? 'Désactiver vendeur' : 'Activer vendeur'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {user.premium && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                        {user.premiumTier.toUpperCase()}
                                                    </span>
                                                )}
                                                {user.suspended && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        SUSPENDU
                                                    </span>
                                                )}
                                                {!user.premium && !user.suspended && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                        ACTIF
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{user._count.listings} annonces</p>
                                            <p className="text-sm text-gray-500">{user._count.messages} messages</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                                >
                                                    Modifier
                                                </button>
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                                                    >
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
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

            {/* Edit Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">Modifier l'utilisateur</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rôle</label>
                                <select
                                    defaultValue={selectedUser.role}
                                    id="role-select"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="USER">Utilisateur</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Statut Premium</label>
                                <select
                                    defaultValue={selectedUser.premium ? 'true' : 'false'}
                                    id="premium-select"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="false">Gratuit</option>
                                    <option value="true">Premium</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Suspension</label>
                                <select
                                    defaultValue={selectedUser.suspended ? 'true' : 'false'}
                                    id="suspended-select"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="false">Actif</option>
                                    <option value="true">Suspendu</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Statut vendeur</label>
                                <select
                                    defaultValue={selectedUser.isVendor ? 'true' : 'false'}
                                    id="vendor-select"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="false">Client (pas vendeur)</option>
                                    <option value="true">Vendeur</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Raison de suspension</label>
                                <textarea
                                    id="suspend-reason"
                                    defaultValue={selectedUser.suspendedReason || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Raison de la suspension..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    const role = (document.getElementById('role-select') as HTMLSelectElement).value;
                                    const premium = (document.getElementById('premium-select') as HTMLSelectElement).value === 'true';
                                    const suspended = (document.getElementById('suspended-select') as HTMLSelectElement).value === 'true';
                                    const suspendedReason = (document.getElementById('suspend-reason') as HTMLTextAreaElement).value;
                                    const isVendor =
                                        (document.getElementById('vendor-select') as HTMLSelectElement).value === 'true';

                                    handleUpdateUser(selectedUser.id, {
                                        role,
                                        premium,
                                        suspended,
                                        suspendedReason: suspended ? suspendedReason : null,
                                        isVendor,
                                    });
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
                            >
                                Enregistrer
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

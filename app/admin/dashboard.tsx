'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Erreur stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement du dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Vue d'ensemble</h1>
                <p className="text-gray-600">Bienvenue sur le panneau d'administration autonome.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                    <p className="text-sm font-bold uppercase opacity-90">Utilisateurs</p>
                    <p className="text-4xl font-black mt-2">{stats?.stats.users}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-lg font-bold">
                            {stats?.stats.premiumUsers} Premium
                        </span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                    <p className="text-sm font-bold uppercase opacity-90">Annonces</p>
                    <p className="text-4xl font-black mt-2">{stats?.stats.listings}</p>
                    <p className="text-xs opacity-90 mt-3">{stats?.stats.activeListings} actives</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <p className="text-sm font-bold uppercase opacity-90">Revenus (Est.)</p>
                    <p className="text-4xl font-black mt-2">{stats?.stats.revenue.toLocaleString()}</p>
                    <p className="text-xs opacity-90 mt-3">FCFA</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
                    <p className="text-sm font-bold uppercase opacity-90">À Modérer</p>
                    <p className="text-4xl font-black mt-2">0</p>
                    <p className="text-xs opacity-90 mt-3">Annonces en attente</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-100"
                    >
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Gérer Utilisateurs</p>
                            <p className="text-xs text-gray-500">Voir tous les utilisateurs</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/listings"
                        className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition border border-green-100"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Modérer Annonces</p>
                            <p className="text-xs text-gray-500">Approuver/Rejeter</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/payments"
                        className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-100"
                    >
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Voir Paiements</p>
                            <p className="text-xs text-gray-500">Transactions</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition border border-orange-100"
                    >
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Analytics</p>
                            <p className="text-xs text-gray-500">Statistiques détaillées</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/listings/new"
                        className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100"
                    >
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                            ✨
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Publier une annonce</p>
                            <p className="text-xs text-gray-500">Ajouter du contenu</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Derniers Inscrits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Derniers Inscrits</h2>
                    <Link href="/admin/users" className="text-sm font-bold text-red-600 hover:text-red-700">
                        Voir tous →
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats?.recentUsers.map((user: any) => (
                        <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
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
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user.role}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Accès Rapide</h3>
                    <div className="space-y-2">
                        <Link href="/admin/moderation" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                            <p className="font-medium text-gray-900">Modération de Contenu</p>
                            <p className="text-xs text-gray-500">Gérer les signalements</p>
                        </Link>
                        <Link href="/admin/subscriptions" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                            <p className="font-medium text-gray-900">Abonnements Premium</p>
                            <p className="text-xs text-gray-500">Gérer les abonnements</p>
                        </Link>
                        <Link href="/admin/settings" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                            <p className="font-medium text-gray-900">Paramètres Système</p>
                            <p className="text-xs text-gray-500">Configuration globale</p>
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="font-bold mb-4">Système Autonome</h3>
                    <p className="text-sm opacity-90 mb-4">
                        Le panneau d'administration est maintenant entièrement autonome avec toutes les fonctionnalités de gestion.
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Gestion complète des utilisateurs
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Modération des annonces
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Suivi des paiements
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Analytics avancés
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

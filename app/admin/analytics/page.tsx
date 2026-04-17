'use client';

import { useState, useEffect } from 'react';

export default function AdminAnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`/api/admin/analytics?period=${period}`);
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900">Analytics</h1>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
                >
                    <option value="7">7 derniers jours</option>
                    <option value="30">30 derniers jours</option>
                    <option value="90">90 derniers jours</option>
                </select>
            </div>

            {/* User Analytics */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Utilisateurs</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <p className="text-sm font-bold text-gray-500 uppercase">Total</p>
                        <p className="text-3xl font-black text-gray-900 mt-2">{analytics?.users.total}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-sm font-bold text-green-600 uppercase">Nouveaux</p>
                        <p className="text-3xl font-black text-green-700 mt-2">{analytics?.users.new}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-600 uppercase">Actifs</p>
                        <p className="text-3xl font-black text-blue-700 mt-2">{analytics?.users.active}</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                        <p className="text-sm font-bold text-yellow-600 uppercase">Premium</p>
                        <p className="text-3xl font-black text-yellow-700 mt-2">{analytics?.users.premium}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <p className="text-sm font-bold text-red-600 uppercase">Suspendus</p>
                        <p className="text-3xl font-black text-red-700 mt-2">{analytics?.users.suspended}</p>
                    </div>
                </div>
            </div>

            {/* Listing Analytics */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Annonces</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <p className="text-sm font-bold text-gray-500 uppercase">Total</p>
                        <p className="text-3xl font-black text-gray-900 mt-2">{analytics?.listings.total}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-sm font-bold text-green-600 uppercase">Actives</p>
                        <p className="text-3xl font-black text-green-700 mt-2">{analytics?.listings.active}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-600 uppercase">Nouvelles</p>
                        <p className="text-3xl font-black text-blue-700 mt-2">{analytics?.listings.new}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
                    <h3 className="font-bold text-gray-900 mb-4">Par Catégorie</h3>
                    <div className="space-y-3">
                        {analytics?.listings.byCategory.map((cat: any) => (
                            <div key={cat.category} className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">{cat.category}</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-900">
                                    {cat.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Analytics */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Finances</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-sm font-bold text-green-600 uppercase">Revenu Total</p>
                        <p className="text-3xl font-black text-green-700 mt-2">
                            {analytics?.financial.totalRevenue.toLocaleString()} FCFA
                        </p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-600 uppercase">Cette Période</p>
                        <p className="text-3xl font-black text-blue-700 mt-2">
                            {analytics?.financial.revenueThisPeriod.toLocaleString()} FCFA
                        </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <p className="text-sm font-bold text-purple-600 uppercase">Transactions</p>
                        <p className="text-3xl font-black text-purple-700 mt-2">
                            {analytics?.financial.transactionCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Daily Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activité des 7 derniers jours</h2>
                <div className="space-y-3">
                    {analytics?.dailyActivity.map((day: any) => (
                        <div key={day.date} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-600 w-24">{day.date}</span>
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                                    <span className="text-xs text-blue-600 font-bold">Utilisateurs: {day.users}</span>
                                </div>
                                <div className="bg-green-50 px-3 py-2 rounded-lg">
                                    <span className="text-xs text-green-600 font-bold">Annonces: {day.listings}</span>
                                </div>
                                <div className="bg-purple-50 px-3 py-2 rounded-lg">
                                    <span className="text-xs text-purple-600 font-bold">Revenu: {day.revenue.toLocaleString()} F</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

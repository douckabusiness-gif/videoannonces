'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/contexts/I18nContext';

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState('7days');
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics?range=${timeRange}`);
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Erreur chargement analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('analytics.loading')}</p>
                </div>
            </div>
        );
    }

    const stats = analytics?.stats || {
        totalViews: 1234,
        totalClicks: 456,
        conversionRate: 12.5,
        avgViewDuration: 45,
        totalRevenue: 125000,
        activeListings: 8,
    };

    const topListings = analytics?.topListings || [
        { id: '1', title: 'iPhone 13 Pro Max', views: 456, clicks: 89, conversion: 19.5 },
        { id: '2', title: 'MacBook Pro M2', views: 389, clicks: 67, conversion: 17.2 },
        { id: '3', title: 'AirPods Pro', views: 234, clicks: 45, conversion: 19.2 },
    ];

    const viewsData = analytics?.viewsData || [
        { date: 'Lun', views: 120 },
        { date: 'Mar', views: 180 },
        { date: 'Mer', views: 150 },
        { date: 'Jeu', views: 220 },
        { date: 'Ven', views: 280 },
        { date: 'Sam', views: 310 },
        { date: 'Dim', views: 174 },
    ];

    const maxViews = Math.max(...viewsData.map(d => d.views));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">{t('analytics.header.title')}</h1>
                    <p className="text-sm md:text-base text-gray-600">{t('analytics.header.subtitle')}</p>
                </div>

                {/* Time Range Selector */}
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border-2 border-gray-300 rounded-xl font-semibold focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                    <option value="7days">{t('analytics.timeRange.7days')}</option>
                    <option value="30days">{t('analytics.timeRange.30days')}</option>
                    <option value="90days">{t('analytics.timeRange.90days')}</option>
                    <option value="1year">{t('analytics.timeRange.1year')}</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">👁️</div>
                        <div className="text-blue-100 text-sm font-bold">+12%</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.totalViews.toLocaleString()}</div>
                    <div className="text-blue-100">{t('analytics.stats.totalViews')}</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">🖱️</div>
                        <div className="text-green-100 text-sm font-bold">+8%</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.totalClicks.toLocaleString()}</div>
                    <div className="text-green-100">{t('analytics.stats.totalClicks')}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📈</div>
                        <div className="text-purple-100 text-sm font-bold">+2.3%</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.conversionRate}%</div>
                    <div className="text-purple-100">{t('analytics.stats.conversionRate')}</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">⏱️</div>
                        <div className="text-orange-100 text-sm font-bold">+5s</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.avgViewDuration}s</div>
                    <div className="text-orange-100">{t('analytics.stats.avgViewDuration')}</div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">💰</div>
                        <div className="text-pink-100 text-sm font-bold">+18%</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.totalRevenue.toLocaleString()} FCFA</div>
                    <div className="text-pink-100">{t('analytics.stats.totalRevenue')}</div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📦</div>
                        <div className="text-indigo-100 text-sm font-bold">Actif</div>
                    </div>
                    <div className="text-3xl font-black mb-1">{stats.activeListings}</div>
                    <div className="text-indigo-100">{t('analytics.stats.activeListings')}</div>
                </div>
            </div>

            {/* Views Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">{t('analytics.charts.viewsPerDay')}</h2>

                <div className="space-y-3">
                    {viewsData.map((day, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-12 text-sm font-bold text-gray-600">{day.date}</div>
                            <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full flex items-center px-4 transition-all duration-500"
                                    style={{ width: `${(day.views / maxViews) * 100}%` }}
                                >
                                    <span className="text-white font-bold text-sm">{day.views}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Listings */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">{t('analytics.charts.topListings')}</h2>

                <div className="space-y-4">
                    {topListings.map((listing, index) => (
                        <div key={listing.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-black">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-gray-900">{listing.title}</div>
                                <div className="text-sm text-gray-600">
                                    {listing.views} {t('analytics.charts.columns.views')} · {listing.clicks} {t('analytics.charts.columns.clicks')} · {listing.conversion}% {t('analytics.charts.columns.conversion')}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-orange-600">{listing.views}</div>
                                <div className="text-xs text-gray-500">{t('analytics.charts.columns.views')}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-2xl p-6">
                    <div className="text-3xl mb-3">💡</div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{t('analytics.insights.insightTitle')}</h3>
                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('analytics.insights.insightText') }} />
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-2xl p-6">
                    <div className="text-3xl mb-3">🎯</div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">{t('analytics.insights.recommendationTitle')}</h3>
                    <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: t('analytics.insights.recommendationText') }} />
                </div>
            </div>
        </div>
    );
}

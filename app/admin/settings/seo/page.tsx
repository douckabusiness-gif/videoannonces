'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/admin/Toast';

export default function SeoSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; text: string } | null>(null);

    const [settings, setSettings] = useState({
        defaultTitle: '',
        defaultDescription: '',
        defaultKeywords: '',
        ogImage: '',
        ogType: 'website',
        twitterHandle: '',
        twitterCardType: 'summary_large_image',
        googleAnalyticsId: '',
        googleTagManagerId: '',
        facebookPixelId: '',
        sitemapEnabled: true,
        robotsTxt: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchSettings();
        }
    }, [status, router]);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings/seo');
            if (response.ok) {
                const data = await response.json();
                setSettings({ ...settings, ...data });
            }
        } catch (error) {
            console.error('Erreur chargement SEO:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/settings/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setMessage({ type: 'success', title: 'Sauvegardé !', text: 'Configuration SEO enregistrée avec succès' });
            } else {
                setMessage({ type: 'error', title: 'Erreur', text: 'Erreur lors de la sauvegarde' });
            }
        } catch (error) {
            setMessage({ type: 'error', title: 'Erreur', text: 'Erreur serveur' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                    <span>🔍</span>
                    Configuration SEO
                </h1>
                <p className="text-purple-100">Optimisez le référencement naturel de votre site web</p>
            </div>

            {/* Toast Notifications */}
            {message && (
                <Toast
                    type={message.type}
                    title={message.title}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meta Tags par défaut */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>📝</span>
                        Meta Tags par défaut
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Titre par défaut
                            </label>
                            <input
                                type="text"
                                value={settings.defaultTitle || ''}
                                onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
                                placeholder="VideoAnnonces-CI - Marketplace vidéo"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                maxLength={60}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-500">Recommandé: 50-60 caractères</p>
                                <p className="text-xs text-purple-600 font-medium">{(settings.defaultTitle || '').length}/60</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Description par défaut
                            </label>
                            <textarea
                                value={settings.defaultDescription || ''}
                                onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
                                rows={3}
                                placeholder="Achetez et vendez avec des annonces vidéo en Côte d'Ivoire..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                maxLength={160}
                            />
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-500">Recommandé: 150-160 caractères</p>
                                <p className="text-xs text-purple-600 font-medium">{(settings.defaultDescription || '').length}/160</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Mots-clés par défaut
                            </label>
                            <input
                                type="text"
                                value={settings.defaultKeywords || ''}
                                onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value })}
                                placeholder="marketplace, vidéo, annonces, vente, côte d'ivoire"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
                        </div>
                    </div>
                </div>

                {/* Open Graph */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-blue-600">📘</span>
                        Open Graph (Facebook)
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Image OG par défaut
                            </label>
                            <input
                                type="url"
                                value={settings.ogImage || ''}
                                onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                                placeholder="https://example.com/og-image.jpg"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommandé: 1200x630px</p>
                            {settings.ogImage && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <img src={settings.ogImage} alt="OG Preview" className="h-32 object-cover rounded" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Type OG
                            </label>
                            <select
                                value={settings.ogType || 'website'}
                                onChange={(e) => setSettings({ ...settings, ogType: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            >
                                <option value="website">Website</option>
                                <option value="article">Article</option>
                                <option value="product">Product</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Twitter Cards */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="text-sky-500">🐦</span>
                        Twitter Cards
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Handle Twitter
                            </label>
                            <input
                                type="text"
                                value={settings.twitterHandle || ''}
                                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                                placeholder="@videoannonces"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Type de carte
                            </label>
                            <select
                                value={settings.twitterCardType || 'summary_large_image'}
                                onChange={(e) => setSettings({ ...settings, twitterCardType: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            >
                                <option value="summary">Summary</option>
                                <option value="summary_large_image">Summary Large Image</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>📊</span>
                        Analytics & Tracking
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-red-600">🔴</span>
                                Google Analytics ID
                            </label>
                            <input
                                type="text"
                                value={settings.googleAnalyticsId || ''}
                                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-blue-600">🏷️</span>
                                Google Tag Manager ID
                            </label>
                            <input
                                type="text"
                                value={settings.googleTagManagerId || ''}
                                onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                                placeholder="GTM-XXXXXXX"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-blue-700">📘</span>
                                Facebook Pixel ID
                            </label>
                            <input
                                type="text"
                                value={settings.facebookPixelId || ''}
                                onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                                placeholder="XXXXXXXXXXXXXXX"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Sitemap & Robots */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>🗺️</span>
                        Sitemap & Robots.txt
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                            <input
                                type="checkbox"
                                id="sitemapEnabled"
                                checked={settings.sitemapEnabled}
                                onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
                                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                            />
                            <label htmlFor="sitemapEnabled" className="text-sm font-bold text-gray-700 cursor-pointer">
                                ✅ Activer le sitemap automatique
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Contenu robots.txt
                            </label>
                            <textarea
                                value={settings.robotsTxt || ''}
                                onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                                rows={6}
                                placeholder={"User-agent: *\nAllow: /"}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 bg-white font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Boutons Actions */}
                <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-purple-500 transition-all font-semibold"
                    >
                        ← Retour
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                💾 Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

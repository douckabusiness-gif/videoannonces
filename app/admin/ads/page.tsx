'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ad {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    position: string;
    isActive: boolean;
    clicks: number;
    impressions: number;
}

export default function AdminAdsPage() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        linkUrl: '',
        position: 'top',
    });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const response = await fetch('/api/ads/all');
            const data = await response.json();
            setAds(data.ads || []);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({ title: '', imageUrl: '', linkUrl: '', position: 'top' });
                fetchAds();
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const toggleActive = async (id: string, isActive: boolean) => {
        try {
            await fetch('/api/ads', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !isActive }),
            });
            fetchAds();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const deleteAd = async (id: string) => {
        if (!confirm('Supprimer cette publicité ?')) return;

        try {
            await fetch(`/api/ads?id=${id}`, { method: 'DELETE' });
            fetchAds();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">
                            💰 Gestion des Publicités
                        </h1>
                        <p className="text-purple-300">Gérez vos bannières publicitaires pour générer des revenus</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        + Nouvelle Publicité
                    </button>
                </div>

                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Créer une publicité</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-white mb-2">Titre</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">URL de l'image (728x90 ou 970x90)</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">URL de destination</label>
                                <input
                                    type="url"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Position</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                >
                                    <option value="top">Top (Après Hero)</option>
                                    <option value="middle">Middle (Entre sections)</option>
                                    <option value="bottom">Bottom (Avant footer)</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                                >
                                    Créer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Liste des publicités */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="text-center text-white py-12">Chargement...</div>
                    ) : ads.length === 0 ? (
                        <div className="text-center text-purple-300 py-12">
                            Aucune publicité créée
                        </div>
                    ) : (
                        ads.map((ad) => (
                            <div
                                key={ad.id}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{ad.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-purple-300">
                                            <span>📍 Position: {ad.position}</span>
                                            <span>👁️ {ad.impressions} vues</span>
                                            <span>🖱️ {ad.clicks} clics</span>
                                            <span>📊 CTR: {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleActive(ad.id, ad.isActive)}
                                            className={`px-4 py-2 rounded-lg font-bold ${ad.isActive
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-gray-600 text-white'
                                                }`}
                                        >
                                            {ad.isActive ? '✓ Actif' : '✗ Inactif'}
                                        </button>
                                        <button
                                            onClick={() => deleteAd(ad.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Aperçu */}
                                <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/30">
                                    <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="mt-4">
                                    <a
                                        href={ad.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 text-sm"
                                    >
                                        🔗 {ad.linkUrl}
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

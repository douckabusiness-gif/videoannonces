'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AISettingsPage() {
    const [aiEnabled, setAiEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/ai-settings');
            const data = await res.json();
            setAiEnabled(data.enableAIDescriptionGenerator ?? true);
        } catch (error) {
            console.error('Erreur récupération settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/ai-settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enableAIDescriptionGenerator: !aiEnabled
                }),
            });

            if (res.ok) {
                setAiEnabled(!aiEnabled);
                alert(aiEnabled ? '🤖 Générateur IA désactivé !' : '🤖 Générateur IA activé !');
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black mb-2">🤖 Paramètres IA</h1>
                        <p className="text-purple-100">Gérez les fonctionnalités d'intelligence artificielle</p>
                    </div>
                    <Link
                        href="/admin/automation"
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition font-bold"
                    >
                        ← Retour
                    </Link>
                </div>
            </div>

            {/* Générateur de Descriptions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                                ✍️
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Générateur de Descriptions</h2>
                                <p className="text-sm text-gray-500">Utilise Groq (gratuit)</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                            Permet aux vendeurs de générer automatiquement des descriptions attractives et professionnelles
                            pour leurs annonces en utilisant l'intelligence artificielle Groq (100% gratuit).
                        </p>

                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                            <p className="text-sm font-bold text-purple-900 mb-2">📍 Emplacement :</p>
                            <p className="text-sm text-purple-700">
                                <code className="bg-purple-100 px-2 py-1 rounded">/dashboard/create</code> →
                                Champ "Description" → Bouton 🤖 "Générer avec IA"
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Toggle Switch */}
                            <button
                                onClick={handleToggle}
                                disabled={saving}
                                className={`relative w-16 h-8 rounded-full transition-colors ${aiEnabled ? 'bg-green-500' : 'bg-gray-300'
                                    } disabled:opacity-50`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${aiEnabled ? 'translate-x-8' : 'translate-x-0'
                                        }`}
                                />
                            </button>

                            <span className={`font-bold text-lg ${aiEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                                {saving ? 'Enregistrement...' : aiEnabled ? '✅ Activé' : '❌ Désactivé'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-black text-gray-900 mb-2">Avantages du Générateur IA</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span><strong>100% Gratuit</strong> - Utilise Groq (pas de coût)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span><strong>Ultra Rapide</strong> - Génération en 1-2 secondes</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span><strong>Descriptions Professionnelles</strong> - Augmente les conversions</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span><strong>Adaptatif</strong> - S'adapte à chaque catégorie de produit</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Stats Mockup */}
            {aiEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Générations (estimé)</p>
                        <p className="text-3xl font-black text-purple-600">0</p>
                        <p className="text-xs text-gray-400 mt-1">Démarrera après activation</p>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Coût Total</p>
                        <p className="text-3xl font-black text-green-600">$0</p>
                        <p className="text-xs text-gray-400 mt-1">Gratuit avec Groq</p>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                        <p className="text-sm text-gray-500 mb-1">Temps moyen</p>
                        <p className="text-3xl font-black text-blue-600">~1s</p>
                        <p className="text-xs text-gray-400 mt-1">Ultra rapide</p>
                    </div>
                </div>
            )}
        </div>
    );
}

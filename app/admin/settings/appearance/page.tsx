'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppearancePage() {
    const router = useRouter();
    const [currentLayout, setCurrentLayout] = useState('modern');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/layout');
            if (res.ok) {
                const data = await res.json();
                setCurrentLayout(data.homeLayout || 'modern');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (layout: string) => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/settings/layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ homeLayout: layout }),
            });

            if (!res.ok) throw new Error('Failed to save');

            setCurrentLayout(layout);
            setMessage({ type: 'success', text: 'Layout activé avec succès !' });
            router.refresh();

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
        } finally {
            setSaving(false);
        }
    };

    const layouts = [
        {
            id: 'modern',
            title: 'Modern Grid',
            description: 'Design équilibré et moderne avec grille 6 colonnes',
            icon: '🎨',
            color: 'from-blue-500 to-purple-600',
            features: ['Grille 6 colonnes', 'Cartes moyennes', 'Glassmorphism', 'Animations fluides'],
            bestFor: 'Tech, Mode, Général'
        },
        {
            id: 'luxury',
            title: 'Luxury Showcase',
            description: 'Design élégant et spacieux avec grille 4 colonnes',
            icon: '✨',
            color: 'from-amber-500 to-orange-600',
            features: ['Grille 4 colonnes', 'Grandes cartes', 'Espaces généreux', 'Animations subtiles'],
            bestFor: 'Luxe, Immobilier, Art'
        },
        {
            id: 'cosmic',
            title: 'Cosmic Wave',
            description: 'Design cosmique avec effet de vague et particules flottantes',
            icon: '🌊',
            color: 'from-cyan-500 to-purple-600',
            features: ['Grille 6 colonnes', 'Effet vague 3D', 'Particules animées', 'Hologrammes'],
            bestFor: 'Tech, Gaming, Futuriste'
        },
        {
            id: 'nebula',
            title: 'Nebula Grid',
            description: 'Grille nébuleuse avec glassmorphism et fond stellaire',
            icon: '💫',
            color: 'from-blue-500 to-pink-600',
            features: ['Grille 6 colonnes', 'Glassmorphism', 'Fond animé', 'Effets glow'],
            bestFor: 'Premium, Luxe, Innovation'
        }
    ];

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Apparence de la Page d'Accueil</h1>
                <p className="text-gray-600 mt-2">Choisissez le style d'affichage pour votre page d'accueil</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {layouts.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => handleSave(layout.id)}
                        disabled={saving}
                        className={`group relative p-1 rounded-3xl transition-all duration-300 ${currentLayout === layout.id
                            ? 'scale-105'
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                    >
                        {/* Border Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${layout.color} rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500`} />

                        {/* Card Content */}
                        <div className="relative h-full bg-white rounded-[22px] p-8 border border-gray-200">
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">
                                {layout.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{layout.title}</h3>
                            <p className="text-gray-600 text-sm mb-6">{layout.description}</p>

                            {/* Features */}
                            <div className="space-y-2 mb-6">
                                {layout.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="text-green-500">✓</span>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Best For */}
                            <div className="pt-4 border-t border-gray-200 mb-6">
                                <p className="text-sm text-gray-500">
                                    <strong>Idéal pour :</strong> {layout.bestFor}
                                </p>
                            </div>

                            <div className={`px-4 py-2 rounded-full text-sm font-bold transition-colors text-center ${currentLayout === layout.id
                                ? `bg-gradient-to-r ${layout.color} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {currentLayout === layout.id ? '✓ Actif' : 'Activer'}
                            </div>

                            {currentLayout === layout.id && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Astuce</h3>
                <p className="text-gray-700 mb-4">
                    Pour voir les changements en temps réel, ouvrez la page d'accueil dans un nouvel onglet et rechargez après avoir sauvegardé.
                </p>
                <a
                    href="/"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Ouvrir la page d'accueil
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

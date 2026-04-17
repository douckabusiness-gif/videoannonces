'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CosmicBackground from '@/components/dashboard/CosmicBackground';

export default function AdminAppearancePage() {
    const router = useRouter();
    const [currentLayout, setCurrentLayout] = useState('nebula');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings/appearance');
            const data = await res.json();
            if (data.dashboardLayout) {
                setCurrentLayout(data.dashboardLayout);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (layout: string) => {
        setSaving(true);
        try {
            await fetch('/api/admin/settings/appearance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dashboardLayout: layout }),
            });
            setCurrentLayout(layout);
            router.refresh();
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const layouts = [
        {
            id: 'nebula',
            title: 'Nebula Stream',
            description: 'Flux vertical immersif avec effet de profondeur 3D et particules.',
            icon: '🌠',
            color: 'from-blue-500 to-purple-600'
        },
        {
            id: 'orbital',
            title: 'Orbital Command',
            description: 'Navigation radiale futuriste autour d\'un noyau central.',
            icon: '🪐',
            color: 'from-orange-500 to-red-600'
        },
        {
            id: 'holographic',
            title: 'Holographic Grid',
            description: 'Interface style Cyberpunk avec grille 3D et effets glitch.',
            icon: '💠',
            color: 'from-cyan-500 to-blue-600'
        }
    ];

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Cosmic Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 -z-10" />
            <CosmicBackground />

            <div className="relative z-10 p-8">
                <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
                    <span className="text-5xl">🎨</span>
                    Apparence du Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {layouts.map((layout) => (
                        <button
                            key={layout.id}
                            onClick={() => handleSave(layout.id)}
                            className={`group relative p-1 rounded-3xl transition-all duration-300 ${currentLayout === layout.id
                                    ? 'scale-105'
                                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                                }`}
                        >
                            {/* Border Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${layout.color} rounded-3xl blur opacity-50 group-hover:opacity-100 transition duration-500`} />

                            {/* Card Content */}
                            <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-[22px] p-6 border border-white/10 flex flex-col items-center text-center">
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition duration-300">
                                    {layout.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{layout.title}</h3>
                                <p className="text-gray-400 text-sm mb-6">{layout.description}</p>

                                <div className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${currentLayout === layout.id
                                        ? `bg-gradient-to-r ${layout.color} text-white shadow-lg`
                                        : 'bg-gray-800 text-gray-500'
                                    }`}>
                                    {currentLayout === layout.id ? 'Actif' : 'Activer'}
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

                <div className="mt-12 p-6 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Aperçu en direct</h3>
                    <p className="text-gray-400 mb-4">
                        Vous pouvez visualiser les différents layouts sur la page de démonstration avant de les activer.
                    </p>
                    <a
                        href="/showcase"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                    >
                        Voir le Showcase
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

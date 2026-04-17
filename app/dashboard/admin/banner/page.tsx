'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface BannerSlide {
    id: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    videoUrl: string; // Peut être une image ou une vidéo
    order: number;
}

interface BannerConfig {
    enabled: boolean;
    slides: BannerSlide[];
}

export default function BannerManagerPage() {
    const { data: session } = useSession();
    const [config, setConfig] = useState<BannerConfig>({ enabled: true, slides: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // État pour le formulaire d'ajout/édition
    const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/banner');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (err) {
            console.error('Erreur chargement bannière:', err);
            setError('Impossible de charger la configuration.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async (newConfig: BannerConfig) => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig),
            });

            if (!res.ok) throw new Error('Erreur sauvegarde');

            setConfig(newConfig);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la sauvegarde.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSlide = () => {
        setEditingSlide({
            id: Date.now().toString(),
            title: '',
            description: '',
            buttonText: 'En savoir plus',
            buttonLink: '/listings',
            videoUrl: '',
            order: config.slides.length,
        });
        setIsFormOpen(true);
    };

    const handleEditSlide = (slide: BannerSlide) => {
        setEditingSlide({ ...slide });
        setIsFormOpen(true);
    };

    const handleDeleteSlide = (id: string) => {
        if (confirm('Supprimer ce slide ?')) {
            const newSlides = config.slides.filter(s => s.id !== id);
            handleSaveConfig({ ...config, slides: newSlides });
        }
    };

    const handleSubmitSlide = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSlide) return;

        let newSlides = [...config.slides];
        const index = newSlides.findIndex(s => s.id === editingSlide.id);

        if (index > -1) {
            newSlides[index] = editingSlide;
        } else {
            newSlides.push(editingSlide);
        }

        handleSaveConfig({ ...config, slides: newSlides });
        setIsFormOpen(false);
    };

    const toggleEnabled = () => {
        handleSaveConfig({ ...config, enabled: !config.enabled });
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    if (session?.user?.role !== 'ADMIN') {
        return <div className="p-8 text-red-500 text-center">Accès non autorisé.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Publicités (Bannières)</h1>
                    <p className="text-gray-500 mt-1">Gérez les grands visuels de la page d'accueil.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                        <span className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-700">
                            {config.enabled ? 'Activé' : 'Désactivé'}
                        </span>
                        <button
                            onClick={toggleEnabled}
                            className="ml-2 text-xs text-blue-600 hover:underline"
                        >
                            Changer
                        </button>
                    </div>
                    <button
                        onClick={handleAddSlide}
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg flex items-center gap-2"
                    >
                        <span>+ Ajouter une pub</span>
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

            {/* Liste des slides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.slides.map((slide, index) => (
                    <div key={slide.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all">
                        <div className="aspect-video bg-gray-100 relative">
                            {slide.videoUrl.match(/\.(mp4|webm)$/) ? (
                                <video src={slide.videoUrl} className="w-full h-full object-cover" muted loop />
                            ) : (
                                <img src={slide.videoUrl || '/placeholder.jpg'} alt={slide.title} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleEditSlide(slide)}
                                    className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Supprimer
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                Slide #{index + 1}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{slide.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{slide.description}</p>
                            {slide.buttonText && (
                                <div className="inline-block px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-lg">
                                    Bouton: {slide.buttonText} ({slide.buttonLink})
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {config.slides.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">Aucune publicité active.</p>
                        <button onClick={handleAddSlide} className="mt-2 text-orange-600 font-medium hover:underline">
                            Commencer par en ajouter une
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Formulaire */}
            {isFormOpen && editingSlide && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <form onSubmit={handleSubmitSlide} className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {config.slides.find(s => s.id === editingSlide.id) ? 'Modifier' : 'Ajouter'} une publicité
                                </h2>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    Fermer
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Média (Image ou Vidéo MP4)</label>
                                    <input
                                        type="url"
                                        required
                                        value={editingSlide.videoUrl}
                                        onChange={e => setEditingSlide({ ...editingSlide, videoUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        placeholder="https://exemple.com/image.jpg ou video.mp4"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lien direct vers le fichier.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingSlide.title}
                                            onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={editingSlide.description}
                                            onChange={e => setEditingSlide({ ...editingSlide, description: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Texte du Bouton (Optionnel)</label>
                                        <input
                                            type="text"
                                            value={editingSlide.buttonText}
                                            onChange={e => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lien du Bouton</label>
                                        <input
                                            type="text"
                                            value={editingSlide.buttonLink}
                                            onChange={e => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                            placeholder="/listings ou https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

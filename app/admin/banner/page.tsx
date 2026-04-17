'use client';

import { useState, useEffect } from 'react';
import { BannerConfig, BannerSlide } from '@/types/banner';
import FileUpload from '@/components/FileUpload';

export default function AdminBannerPage() {
    const [config, setConfig] = useState<BannerConfig>({ enabled: false, slides: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        videoUrl: '',
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/banner');
            const data = await res.json();
            // S'assurer que slides existe toujours
            setConfig({
                enabled: data.enabled || false,
                slides: data.slides || []
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Configuration sauvegardée !');
            } else {
                console.error('Erreur API:', data);
                alert(`❌ Erreur: ${data.error || 'Erreur inconnue'}\n${data.details || ''}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const addSlide = () => {
        if (!formData.title || !formData.videoUrl) {
            alert('Titre et URL média requis');
            return;
        }

        const newSlide: BannerSlide = {
            id: Date.now().toString(),
            ...formData,
            order: config.slides.length,
        };

        setConfig({
            ...config,
            slides: [...config.slides, newSlide],
        });

        setFormData({ title: '', description: '', buttonText: '', buttonLink: '', videoUrl: '' });
        setShowForm(false);
    };

    const updateSlide = () => {
        if (!editingSlide) return;

        setConfig({
            ...config,
            slides: config.slides.map(s =>
                s.id === editingSlide.id
                    ? { ...editingSlide, ...formData }
                    : s
            ),
        });

        setEditingSlide(null);
        setFormData({ title: '', description: '', buttonText: '', buttonLink: '', videoUrl: '' });
    };

    const deleteSlide = (id: string) => {
        if (!confirm('Supprimer cette publicité ?')) return;

        setConfig({
            ...config,
            slides: config.slides.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })),
        });
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...config.slides];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex < 0 || newIndex >= newSlides.length) return;

        [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
        newSlides.forEach((s, i) => s.order = i);

        setConfig({ ...config, slides: newSlides });
    };

    const startEdit = (slide: BannerSlide) => {
        setEditingSlide(slide);
        setFormData({
            title: slide.title,
            description: slide.description,
            buttonText: slide.buttonText,
            buttonLink: slide.buttonLink,
            videoUrl: slide.videoUrl,
        });
        setShowForm(true);
    };

    const isVideoConfig = (url: string) => {
        if (!url) return false;
        return url.toLowerCase().endsWith('.mp4') ||
            url.toLowerCase().endsWith('.webm') ||
            url.toLowerCase().includes('video');
    };

    if (loading) {
        return <div className="p-8 text-white">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">
                            🎬 Gestion des Publicités (Bannières)
                        </h1>
                        <p className="text-purple-300">Créez un diaporama spectaculaire pour l'accueil</p>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                            <input
                                type="checkbox"
                                checked={config.enabled}
                                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <span className="text-white font-bold">Activer les publicités</span>
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
                        </button>
                    </div>
                </div>

                {/* Bouton Ajouter */}
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingSlide(null);
                        setFormData({ title: '', description: '', buttonText: '', buttonLink: '', videoUrl: '' });
                    }}
                    className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                    + Ajouter une Publicité
                </button>

                {/* Formulaire */}
                {showForm && (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingSlide ? 'Modifier la publicité' : 'Nouvelle publicité'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-white mb-2">Titre *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    placeholder="Ex: Découvrez nos produits"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-white mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    rows={3}
                                    placeholder="Description de la publicité..."
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Texte du bouton</label>
                                <input
                                    type="text"
                                    value={formData.buttonText}
                                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    placeholder="Ex: Découvrir"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Lien du bouton</label>
                                <input
                                    type="text"
                                    value={formData.buttonLink}
                                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white"
                                    placeholder="/listings"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-white mb-2">Image ou Vidéo *</label>
                                <FileUpload
                                    onUploadComplete={(url) => setFormData({ ...formData, videoUrl: url })}
                                    currentFile={formData.videoUrl}
                                />
                                {formData.videoUrl && (
                                    <div className="mt-2 text-sm text-purple-300">
                                        ✅ Fichier: {formData.videoUrl}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={editingSlide ? updateSlide : addSlide}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                            >
                                {editingSlide ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingSlide(null);
                                    setFormData({ title: '', description: '', buttonText: '', buttonLink: '', videoUrl: '' });
                                }}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Liste des slides */}
                <div className="space-y-4">
                    {!config.slides || config.slides.length === 0 ? (
                        <div className="text-center text-purple-300 py-12 bg-white/5 rounded-2xl">
                            Aucune publicité ajoutée. Cliquez sur "+ Ajouter une Publicité"
                        </div>
                    ) : (
                        config.slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Aperçu média */}
                                    <div className="w-64 h-36 bg-black rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {isVideoConfig(slide.videoUrl) ? (
                                            <video
                                                src={slide.videoUrl}
                                                className="w-full h-full object-cover"
                                                muted
                                            />
                                        ) : (
                                            <img
                                                src={slide.videoUrl}
                                                alt={slide.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* Infos */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{slide.title}</h3>
                                        {slide.description && (
                                            <p className="text-purple-200 mb-2">{slide.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-purple-300">
                                            {slide.buttonText && <span>🔘 {slide.buttonText}</span>}
                                            {slide.buttonLink && <span>🔗 {slide.buttonLink}</span>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => moveSlide(index, 'up')}
                                            disabled={index === 0}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-30"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            onClick={() => moveSlide(index, 'down')}
                                            disabled={index === config.slides.length - 1}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-30"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            onClick={() => startEdit(slide)}
                                            className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteSlide(slide.id)}
                                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

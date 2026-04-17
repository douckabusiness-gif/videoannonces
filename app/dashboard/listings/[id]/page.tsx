'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/I18nContext';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
    const { id } = use(params);
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        quartier: '',
        videoUrl: '',
        thumbnailUrl: '',
    });

    const categories = [
        { id: 'electronics', name: t('createListing.details.form.category.options.electronics'), icon: '📱' },
        { id: 'fashion', name: t('createListing.details.form.category.options.fashion'), icon: '👔' },
        { id: 'vehicles', name: t('createListing.details.form.category.options.vehicles'), icon: '🚗' },
        { id: 'real-estate', name: t('createListing.details.form.category.options.real-estate'), icon: '🏠' },
        { id: 'services', name: t('createListing.details.form.category.options.services'), icon: '🛠️' },
        { id: 'home', name: t('createListing.details.form.category.options.home'), icon: '🪑' },
        { id: 'sports', name: t('createListing.details.form.category.options.sports'), icon: '⚽' },
        { id: 'other', name: t('createListing.details.form.category.options.other'), icon: '📦' },
    ];

    const citiesWithQuartiers: { [key: string]: string[] } = {
        'Abidjan': ['Cocody', 'Yopougon', 'Plateau', 'Adjamé', 'Treichville', 'Marcory', 'Koumassi', 'Port-Bouët', 'Attécoubé', 'Abobo', 'Bingerville', 'Anyama', 'Songon', 'Riviera', 'Deux-Plateaux', 'Angré', 'Zone 4', 'Williamsville'],
        'Yamoussoukro': ['Centre-ville', 'Habitat', 'N\'Gokro', 'Millionnaire'],
        'Bouaké': ['Centre-ville', 'Air France', 'Koko', 'Dar-es-Salam'],
        'Daloa': ['Centre-ville', 'Commerce', 'Lobia'],
        'San-Pédro': ['Centre-ville', 'Balmer', 'Bardot'],
        'Korhogo': ['Centre-ville', 'Petit Paris', 'Sinistré'],
        'Man': ['Centre-ville'],
        'Gagnoa': ['Centre-ville'],
    };

    const ivorianCities = Object.keys(citiesWithQuartiers).sort();

    useEffect(() => {
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            const response = await fetch(`/api/listings/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    category: data.category,
                    location: data.location,
                    quartier: data.quartier || '',
                    videoUrl: data.videoUrl,
                    thumbnailUrl: data.thumbnailUrl,
                });
                setVideoPreview(data.videoUrl);
            } else {
                alert('Erreur: Annonce non trouvée');
                router.push('/dashboard/listings');
            }
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setUploadProgress(0);

        try {
            let { videoUrl, thumbnailUrl } = formData;

            // 1. Upload new video if changed
            if (videoFile) {
                const videoFormData = new FormData();
                videoFormData.append('video', videoFile);

                const uploadResponse = await fetch('/api/upload/video', {
                    method: 'POST',
                    body: videoFormData,
                });

                if (!uploadResponse.ok) throw new Error('Erreur upload');
                const uploadData = await uploadResponse.json();
                videoUrl = uploadData.videoUrl;
                thumbnailUrl = uploadData.thumbnailUrl;
            }

            // 2. Update listing
            const response = await fetch(`/api/listings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    videoUrl,
                    thumbnailUrl,
                }),
            });

            if (response.ok) {
                router.push('/dashboard/listings');
                router.refresh();
            } else {
                const err = await response.json();
                alert('Erreur: ' + (err.error || 'Impossible de mettre à jour'));
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const availableQuartiers = formData.location && citiesWithQuartiers[formData.location]
        ? citiesWithQuartiers[formData.location]
        : [];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <button onClick={() => router.back()} className="text-purple-200 hover:text-white flex items-center gap-2 mb-4">
                    ← {t('common.back') === 'common.back' ? 'Retour' : t('common.back')}
                </button>
                <h1 className="text-3xl font-black text-white">Modifier l'annonce</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vidéo Section */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Vidéo de l'annonce</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                            <video src={videoPreview} controls className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <label className="cursor-pointer bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl p-6 text-center hover:bg-orange-100 transition-all">
                                <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                                <span className="text-orange-600 font-bold block mb-1">Changer la vidéo</span>
                                <span className="text-xs text-gray-500">Formats supportés: MP4, WebM (Max 50MB)</span>
                            </label>
                            {videoFile && <p className="mt-2 text-xs text-green-600 font-medium">✓ Nouvelle vidéo sélectionnée</p>}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'annonce</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Prix (CFA)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900 font-bold"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                                required
                            >
                                <option value="">Choisir...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ville</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value, quartier: '' })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                                required
                            >
                                <option value="">Choisir...</option>
                                {ivorianCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Quartier</label>
                            <select
                                value={formData.quartier}
                                onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                                required
                            >
                                <option value="">Choisir...</option>
                                {availableQuartiers.map(q => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
                                fetch(`/api/listings/${id}`, { method: 'DELETE' })
                                    .then(() => router.push('/dashboard/listings'));
                            }
                        }}
                        className="px-6 bg-red-50 text-red-600 font-bold py-4 rounded-xl border border-red-200 hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}

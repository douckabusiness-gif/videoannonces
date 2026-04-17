'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/contexts/I18nContext';

export default function AdminCreateListingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [generatingDescription, setGeneratingDescription] = useState(false);
    const [aiEnabled, setAiEnabled] = useState(true);

    // Seuls les admins peuvent accéder à cette page
    useEffect(() => {
        if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
        } else if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, session, router]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        quartier: '',
    });

    const categories = [
        { id: 'electronics', name: 'Électronique & Informatique', icon: '📱' },
        { id: 'fashion', name: 'Mode & Vêtements', icon: '👔' },
        { id: 'vehicles', name: 'Véhicules & Transports', icon: '🚗' },
        { id: 'real-estate', name: 'Immobilier', icon: '🏠' },
        { id: 'services', name: 'Services', icon: '🛠️' },
        { id: 'home', name: 'Maison & Jardin', icon: '🪑' },
        { id: 'sports', name: 'Sports & Loisirs', icon: '⚽' },
        { id: 'other', name: 'Autres', icon: '📦' },
    ];

    const citiesWithQuartiers: { [key: string]: string[] } = {
        'Abidjan': [
            'Cocody', 'Yopougon', 'Plateau', 'Adjamé', 'Treichville',
            'Marcory', 'Koumassi', 'Port-Bouët', 'Attécoubé', 'Abobo',
            'Bingerville', 'Anyama', 'Songon', 'Riviera', 'Deux-Plateaux',
            'Angré', 'Zone 4', 'Williamsville',
        ],
        'Yamoussoukro': ['Centre-ville', 'Habitat', 'N\'Gokro', 'Millionnaire'],
        'Bouaké': ['Centre-ville', 'Air France', 'Koko', 'Dar-es-Salam'],
        'Daloa': ['Centre-ville', 'Commerce', 'Lobia'],
        'San-Pédro': ['Centre-ville', 'Balmer', 'Bardot'],
        'Korhogo': ['Centre-ville', 'Petit Paris', 'Sinistré'],
        'Man': ['Centre-ville'],
        'Gagnoa': ['Centre-ville'],
    };

    const ivorianCities = Object.keys(citiesWithQuartiers).concat([
        'Divo', 'Abengourou', 'Grand-Bassam', 'Dabou', 'Agboville',
        'Adzopé', 'Bondoukou', 'Boundiali', 'Daoukro', 'Dimbokro',
        'Ferkessédougou', 'Grand-Lahou', 'Guiglo', 'Issia', 'Katiola',
        'Odienné', 'Sassandra', 'Séguéla', 'Sinfra', 'Soubré',
        'Tabou', 'Tanda', 'Tiassalé', 'Touba', 'Toumodi',
    ]).sort();

    const availableQuartiers = formData.location && citiesWithQuartiers[formData.location]
        ? citiesWithQuartiers[formData.location]
        : [];

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    useEffect(() => {
        fetch('/api/admin/ai-settings')
            .then(res => res.json())
            .then(data => setAiEnabled(data.enableAIDescriptionGenerator ?? true))
            .catch(err => console.error('Erreur récup settings IA:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoFile) {
            alert('Veuillez sélectionner une vidéo.');
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            // 1. Upload vidéo
            const videoFormData = new FormData();
            videoFormData.append('video', videoFile);

            const uploadResponse = await fetch('/api/upload/video', {
                method: 'POST',
                body: videoFormData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json().catch(() => ({}));
                throw new Error(errorData.error || 'Erreur lors du téléchargement de la vidéo');
            }

            const { videoUrl, thumbnailUrl } = await uploadResponse.json();
            setUploadProgress(50);

            // 2. Créer l'annonce
            const listingResponse = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    videoUrl,
                    thumbnailUrl,
                    duration: 0,
                }),
            });

            if (!listingResponse.ok) {
                const errorData = await listingResponse.json().catch(() => ({}));
                let errorMessage = errorData.error || 'Erreur lors de la création de l\'annonce';
                if (errorData.details && Array.isArray(errorData.details)) {
                    errorMessage += ':\n' + errorData.details.map((d: any) => `- ${d.message}`).join('\n');
                }
                throw new Error(errorMessage);
            }

            const listing = await listingResponse.json();
            setUploadProgress(100);

            alert('✅ Annonce publiée avec succès !');

            // Rediriger vers la liste des annonces admin
            setTimeout(() => {
                router.push('/admin/listings');
            }, 800);

        } catch (error: any) {
            console.error('Erreur:', error);
            alert(`❌ ${error.message || 'Une erreur est survenue'}`);
            setLoading(false);
        }
    };

    if (authStatus === 'loading') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
            {/* Header Admin */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.push('/admin/listings')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">✨ Publier une Annonce</h1>
                    <p className="text-gray-500 text-sm">Publication en tant qu'Administrateur</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Vidéo */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900">📹 Vidéo de l'annonce</h2>
                            <p className="text-sm text-gray-500">MP4, MOV, AVI • Max 500MB</p>
                        </div>
                    </div>

                    {!videoPreview ? (
                        <label className="block border-3 border-dashed border-red-200 rounded-2xl p-10 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all bg-gray-50">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                                required
                            />
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-gray-700">Cliquez pour sélectionner une vidéo</p>
                                <p className="text-sm text-gray-400">ou glissez-déposez ici</p>
                            </div>
                        </label>
                    ) : (
                        <div className="space-y-3">
                            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                                <video src={videoPreview} controls className="w-full aspect-video object-contain" />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                                className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition font-bold"
                            >
                                🗑️ Changer la vidéo
                            </button>
                        </div>
                    )}
                </div>

                {/* Détails */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-6">📋 Détails de l'annonce</h2>

                    <div className="space-y-4">
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Titre de l'annonce *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900 font-semibold"
                                placeholder="Ex: iPhone 15 Pro Max 256Go Noir"
                                minLength={5}
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700">Description *</label>
                                {aiEnabled && formData.title && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!formData.title || !formData.category) {
                                                alert('Remplissez le titre et la catégorie d\'abord.');
                                                return;
                                            }
                                            setGeneratingDescription(true);
                                            try {
                                                const response = await fetch('/api/ai/generate-description', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        title: formData.title,
                                                        category: formData.category,
                                                        price: formData.price,
                                                    }),
                                                });
                                                const data = await response.json();
                                                if (data.description) {
                                                    setFormData({ ...formData, description: data.description });
                                                }
                                            } catch (err) {
                                                alert('Erreur IA');
                                            } finally {
                                                setGeneratingDescription(false);
                                            }
                                        }}
                                        disabled={generatingDescription}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-xs font-bold disabled:opacity-50"
                                    >
                                        {generatingDescription ? (
                                            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Génération...</>
                                        ) : (
                                            <>🤖 Générer avec IA</>
                                        )}
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900"
                                placeholder="Décrivez votre produit en détail..."
                                minLength={20}
                                maxLength={3000}
                                required
                            />
                        </div>

                        {/* Prix & Catégorie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Prix (FCFA) *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900 font-bold"
                                    placeholder="Ex: 150000"
                                    min={0}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Catégorie *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900"
                                    required
                                >
                                    <option value="">Choisir une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Ville */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Ville *</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value, quartier: '' })}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900"
                                required
                            >
                                <option value="">Sélectionner une ville</option>
                                {ivorianCities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Quartier */}
                        {availableQuartiers.length > 0 && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Quartier *</label>
                                <select
                                    value={formData.quartier}
                                    onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-900"
                                    required
                                >
                                    <option value="">Sélectionner un quartier</option>
                                    {availableQuartiers.map((q) => (
                                        <option key={q} value={q}>{q}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bouton submit */}
                <div className="bg-red-600 rounded-2xl p-6 shadow-xl">
                    {loading && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white font-bold">Téléchargement en cours...</span>
                                <span className="text-white font-black text-xl">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-3">
                                <div
                                    className="bg-white h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-6 py-5 rounded-xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 ${loading
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-white text-red-600 hover:scale-[1.02] active:scale-95'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                                Publication en cours...
                            </>
                        ) : (
                            <>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                ✨ Publier l'Annonce
                            </>
                        )}
                    </button>
                    <p className="text-center text-white/80 text-sm font-medium mt-3">
                        L'annonce sera publiée immédiatement sur la plateforme
                    </p>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CreateListingPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const videoInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'electronics',
        location: '',
    });

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vérifier le type
        if (!file.type.startsWith('video/')) {
            setError('Veuillez sélectionner un fichier vidéo');
            return;
        }

        // Vérifier la taille (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('La vidéo ne doit pas dépasser 50MB');
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!videoFile) {
            setError('Veuillez sélectionner une vidéo');
            return;
        }

        setUploading(true);
        setUploadProgress(10);

        try {
            // 1. Upload vidéo
            const videoFormData = new FormData();
            videoFormData.append('video', videoFile);

            setUploadProgress(30);
            const uploadResponse = await fetch('/api/upload/video', {
                method: 'POST',
                body: videoFormData,
            });

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json();
                throw new Error(error.error || 'Erreur upload vidéo');
            }

            const videoData = await uploadResponse.json();
            setUploadProgress(70);

            // 2. Créer l'annonce
            const listingResponse = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    price: parseInt(formData.price),
                    category: formData.category,
                    location: formData.location,
                    videoUrl: videoData.videoUrl,
                    thumbnailUrl: videoData.thumbnailUrl,
                    duration: videoData.duration,
                }),
            });

            if (!listingResponse.ok) {
                const error = await listingResponse.json();
                throw new Error(error.error || 'Erreur création annonce');
            }

            const listing = await listingResponse.json();
            setUploadProgress(100);

            // Rediriger vers l'annonce
            router.push(`/listings/${listing.id}`);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">V</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                            VideoBoutique
                        </span>
                    </Link>
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                        ← Retour
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">Créer une annonce vidéo</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Video Upload */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Vidéo de présentation * (max 60 secondes, 50MB)
                        </label>

                        {!videoPreview ? (
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                            >
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-600 font-medium mb-1">Cliquez pour sélectionner une vidéo</p>
                                <p className="text-sm text-gray-500">MP4, MOV, AVI - Max 50MB</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full rounded-lg max-h-96"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVideoFile(null);
                                        setVideoPreview('');
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="hidden"
                        />
                    </div>

                    {/* Title */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Titre de l'annonce *
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: iPhone 13 Pro 256GB comme neuf"
                            maxLength={100}
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.title.length}/100</p>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            rows={5}
                            placeholder="Décrivez votre produit en détail..."
                            maxLength={1000}
                        />
                        <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000</p>
                    </div>

                    {/* Price & Category */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Prix (FCFA) *
                            </label>
                            <input
                                id="price"
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="50000"
                                min="0"
                            />
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie *
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="electronics">📱 Électronique</option>
                                <option value="fashion">👔 Mode</option>
                                <option value="vehicles">🚗 Véhicules</option>
                                <option value="real-estate">🏠 Immobilier</option>
                                <option value="services">🛠️ Services</option>
                                <option value="home">🪑 Maison</option>
                                <option value="sports">⚽ Sports</option>
                                <option value="other">📦 Autre</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Localisation *
                        </label>
                        <input
                            id="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: Cocody, Abidjan"
                        />
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-orange-900">Upload en cours...</span>
                                <span className="text-sm font-bold text-orange-900">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2">
                                <div
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={uploading || !videoFile}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/30 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Publication en cours...' : 'Publier l\'annonce'}
                    </button>
                </form>
            </main>
        </div>
    );
}

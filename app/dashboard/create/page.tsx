'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { useTranslation } from '@/contexts/I18nContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function CreateListingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { data: session, status: authStatus, update } = useSession();
    const { siteSettings, loading: settingsLoading } = useSiteSettings();
    const [loading, setLoading] = useState(false);

    // Protection Mode Solo
    useEffect(() => {
        if (!settingsLoading && siteSettings?.soloMode && authStatus === 'authenticated') {
            const isAdmin = session?.user?.role === 'ADMIN';
            const isSpecialPublisher = session?.user?.canPublishListings === true;
            
            if (!isAdmin && !isSpecialPublisher) {
                console.log('🚫 [Mode Solo] Publication refusée pour cet utilistateur');
                router.push('/');
            }
        } else if (!settingsLoading && siteSettings?.soloMode && authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [siteSettings, settingsLoading, authStatus, session, router]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [generatingDescription, setGeneratingDescription] = useState(false); // 🤖 IA
    const [aiEnabled, setAiEnabled] = useState(true); // 🤖 IA activée ?

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',  // Ville
        quartier: '',  // 🆕 QUARTIER
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

    // 🌍 Villes et Quartiers de Côte d'Ivoire
    const citiesWithQuartiers: { [key: string]: string[] } = {
        'Abidjan': [
            'Cocody',
            'Yopougon',
            'Plateau',
            'Adjamé',
            'Treichville',
            'Marcory',
            'Koumassi',
            'Port-Bouët',
            'Attécoubé',
            'Abobo',
            'Bingerville',
            'Anyama',
            'Songon',
            'Riviera',
            'Deux-Plateaux',
            'Angré',
            'Zone 4',
            'Williamsville',
        ],
        'Yamoussoukro': [
            'Centre-ville',
            'Habitat',
            'N\'Gokro',
            'Millionnaire',
        ],
        'Bouaké': [
            'Centre-ville',
            'Air France',
            'Koko',
            'Dar-es-Salam',
        ],
        'Daloa': ['Centre-ville', 'Commerce', 'Lobia'],
        'San-Pédro': ['Centre-ville', 'Balmer', 'Bardot'],
        'Korhogo': ['Centre-ville', 'Petit Paris', 'Sinistré'],
        'Man': ['Centre-ville'],
        'Gagnoa': ['Centre-ville'],
    };

    const ivorianCities = Object.keys(citiesWithQuartiers).concat([
        'Divo',
        'Abengourou',
        'Grand-Bassam',
        'Dabou',
        'Agboville',
        'Adzopé',
        'Bondoukou',
        'Boundiali',
        'Daoukro',
        'Dimbokro',
        'Ferkessédougou',
        'Grand-Lahou',
        'Guiglo',
        'Issia',
        'Katiola',
        'Odienné',
        'Sassandra',
        'Séguéla',
        'Sinfra',
        'Soubré',
        'Tabou',
        'Tanda',
        'Tiassalé',
        'Touba',
        'Toumodi',
    ]).sort();

    // Quartiers disponibles selon la ville sélectionnée
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

    // Vérifier si l'IA est activée au chargement
    useEffect(() => {
        fetch('/api/admin/ai-settings')
            .then(res => res.json())
            .then(data => setAiEnabled(data.enableAIDescriptionGenerator ?? true))
            .catch(err => console.error('Erreur récup settings IA:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoFile) {
            alert(t('createListing.alerts.selectVideo'));
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            // 1. Upload video
            const videoFormData = new FormData();
            videoFormData.append('video', videoFile);

            const uploadResponse = await fetch('/api/upload/video', {
                method: 'POST',
                body: videoFormData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json().catch(() => ({}));
                const errorMessage = errorData.error || t('createListing.video.uploadError');
                throw new Error(errorMessage);
            }

            const { videoUrl, thumbnailUrl } = await uploadResponse.json();
            setUploadProgress(50);

            // 2. Create listing
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
                console.error('❌ Erreur API listings:', errorData);
                const errorMessage = errorData.error || t('createListing.alerts.createError');
                throw new Error(errorMessage);
            }

            const listing = await listingResponse.json();
            setUploadProgress(100);

            // Mettre à jour la session pour refléter le statut vendeur
            await update();

            // Redirect to listing
            setTimeout(() => {
                router.push(`/listings/${listing.id}`);
            }, 1000);

        } catch (error) {
            console.error('Erreur:', error);
            alert(t('createListing.alerts.createError'));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
            {/* Header - Plus percutant */}
            <div className="text-center">
                <div className="inline-block mb-3 md:mb-4 px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs md:text-sm font-bold shadow-lg">
                    {t('createListing.header.badge')}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 md:mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: t('createListing.header.title') }} />
                <p className="text-base md:text-xl text-purple-200 font-medium">
                    {t('createListing.header.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {/* Video Upload - Plus visible */}
                <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border-2 border-orange-100">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-black text-gray-900">{t('createListing.video.title')}</h2>
                            <p className="text-xs md:text-sm text-gray-600 font-medium">{t('createListing.video.step')}</p>
                        </div>
                    </div>

                    {!videoPreview ? (
                        <label className="block border-4 border-dashed border-orange-300 rounded-3xl p-16 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all bg-white shadow-inner">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                                required
                            />
                            <div className="space-y-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900 mb-3">
                                        📹 {t('createListing.video.dragDrop')}
                                    </p>
                                    <p className="text-lg text-gray-700 font-semibold mb-2">
                                        {t('createListing.video.formats')}
                                    </p>
                                    <p className="text-orange-600 font-bold">
                                        {t('createListing.video.duration')}
                                    </p>
                                </div>
                            </div>
                        </label>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-orange-500/50">
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full aspect-video object-contain"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoFile(null);
                                    setVideoPreview('');
                                }}
                                className="w-full px-6 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition font-bold text-lg shadow-lg"
                            >
                                {t('createListing.video.change')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Listing Details - Plus percutant */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border-2 border-blue-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">{t('createListing.details.title')}</h2>
                            <p className="text-gray-600 font-medium">{t('createListing.details.step')}</p>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm md:text-base font-black text-gray-900 mb-2 md:mb-3">
                                {t('createListing.details.form.title.label')}
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 md:px-6 py-3 md:py-4 border-2 md:border-3 border-gray-300 rounded-xl md:rounded-2xl focus:ring-2 md:focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-base md:text-lg font-semibold text-gray-900 placeholder-gray-400"
                                placeholder={t('createListing.details.form.title.placeholder')}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-base font-black text-gray-900">
                                    ✍️ Description détaillée *
                                </label>
                                {/* Bouton Générer avec IA - Affiché dès que titre rempli */}
                                {aiEnabled && formData.title && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!formData.title || !formData.category) {
                                                alert(t('createListing.alerts.fillTitleCategory'));
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
                                                } else {
                                                    alert('Erreur : ' + (data.error || 'Impossible de générer'));
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                alert(t('createListing.alerts.aiError'));
                                            } finally {
                                                setGeneratingDescription(false);
                                            }
                                        }}
                                        disabled={generatingDescription}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generatingDescription ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                {t('createListing.details.form.description.aiGenerating')}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                </svg>
                                                {t('createListing.details.form.description.aiButton')}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={6}
                                className="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-medium text-gray-900 placeholder-gray-400"
                                placeholder={t('createListing.details.form.description.placeholder')}
                                required
                            />
                            <p className="text-sm text-blue-600 font-bold mt-3 flex items-center gap-2">
                                <span>💡</span>
                                <span>{t('createListing.details.form.description.tip')}</span>
                            </p>
                        </div>

                        {/* Price & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">
                                    {t('createListing.details.form.price.label')}
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-bold text-gray-900 placeholder-gray-400"
                                    placeholder={t('createListing.details.form.price.placeholder')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">
                                    {t('createListing.details.form.category.label')}
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-bold text-gray-900"
                                    required
                                >
                                    <option value="" className="text-gray-400">{t('createListing.details.form.category.placeholder')}</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="font-bold">
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location - Villes de Côte d'Ivoire */}
                        <div>
                            <label className="block text-base font-black text-gray-900 mb-3">
                                {t('createListing.details.form.location.label')}
                            </label>
                            <select
                                value={formData.location}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                        quartier: '' // Réinitialiser le quartier
                                    });
                                }}
                                className="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-bold text-gray-900"
                                required
                            >
                                <option value="" className="text-gray-400">{t('createListing.details.form.location.placeholder')}</option>
                                {ivorianCities.map((city) => (
                                    <option key={city} value={city} className="font-bold">
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quartier - Affiché si la ville a des quartiers */}
                        {availableQuartiers.length > 0 && (
                            <div>
                                <label className="block text-base font-black text-gray-900 mb-3">
                                    {t('createListing.details.form.quartier.label')}
                                </label>
                                <select
                                    value={formData.quartier}
                                    onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                                    className="w-full px-6 py-4 border-3 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-bold text-gray-900"
                                    required
                                >
                                    <option value="" className="text-gray-400">{t('createListing.details.form.quartier.placeholder')}</option>
                                    {availableQuartiers.map((quartier) => (
                                        <option key={quartier} value={quartier} className="font-bold">
                                            {quartier}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button - Très percutant */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
                    {loading && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-black text-white">{t('createListing.submit.uploading')}</span>
                                <span className="text-2xl font-black text-white">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-white h-full transition-all duration-300 shadow-lg"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-6 md:px-8 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl transition-all shadow-2xl flex items-center justify-center gap-3 md:gap-4 ${loading
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-white text-orange-600 hover:scale-105 active:scale-95 hover:shadow-white/50'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                {t('createListing.submit.loading')}
                            </>
                        ) : (
                            <>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('createListing.submit.default')}
                            </>
                        )}
                    </button>

                    <p className="text-center text-base text-white font-bold mt-4 opacity-90">
                        {t('createListing.submit.reassurance')}
                    </p>
                </div>
            </form>
        </div>
    );
}

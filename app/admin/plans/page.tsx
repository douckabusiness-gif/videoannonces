'use client';

import { useState, useEffect } from 'react';

interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    features: string[];
    maxListings: number | null;
    maxVideosPerListing: number | null;
    maxVideoDuration: number | null;
    allowSubdomain: boolean;
    allowCustomDomain: boolean;
    allowLiveStreaming: boolean;
    allowStories: boolean;
    active: boolean;
    popular: boolean;
    color: string | null;
    createdAt: Date;
}

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        features: [''],
        maxListings: '',
        maxVideosPerListing: '1',
        maxVideoDuration: '60', // 60 secondes par défaut
        allowSubdomain: false,
        allowCustomDomain: false,
        allowLiveStreaming: false,
        allowStories: false,
        active: true,
        popular: false,
        color: '#3B82F6' // Bleu par défaut
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/subscription-plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Générer le slug à partir du nom
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: !editingPlan ? generateSlug(name) : prev.slug
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingPlan
            ? `/api/admin/subscription-plans/${editingPlan.id}`
            : '/api/admin/subscription-plans';

        const method = editingPlan ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    features: formData.features.filter(f => f.trim() !== '')
                })
            });

            if (res.ok) {
                fetchPlans();
                setShowModal(false);
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur de connexion');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan?')) return;

        try {
            const res = await fetch(`/api/admin/subscription-plans/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchPlans();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openEditModal = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            slug: plan.slug,
            description: plan.description || '',
            price: plan.price.toString(),
            features: plan.features.length > 0 ? plan.features : [''],
            maxListings: plan.maxListings ? plan.maxListings.toString() : '',
            maxVideosPerListing: plan.maxVideosPerListing ? plan.maxVideosPerListing.toString() : '1',
            maxVideoDuration: plan.maxVideoDuration ? plan.maxVideoDuration.toString() : '',
            allowSubdomain: plan.allowSubdomain,
            allowCustomDomain: plan.allowCustomDomain,
            allowLiveStreaming: plan.allowLiveStreaming,
            allowStories: plan.allowStories,
            active: plan.active,
            popular: plan.popular,
            color: plan.color || '#3B82F6'
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingPlan(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            price: '',
            features: [''],
            maxListings: '',
            maxVideosPerListing: '1',
            maxVideoDuration: '60',
            allowSubdomain: false,
            allowCustomDomain: false,
            allowLiveStreaming: false,
            allowStories: false,
            active: true,
            popular: false,
            color: '#3B82F6'
        });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Plans d'Abonnement</h1>
                    <p className="text-gray-600 mt-1">Gérez les plans et fonctionnalités premium</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau Plan
                </button>
            </div>

            {/* Liste des plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative overflow-hidden transition-all hover:shadow-md ${!plan.active ? 'opacity-75 grayscale' : ''}`}
                        style={{ borderColor: plan.popular ? (plan.color || '#F97316') : '#E5E7EB' }}
                    >
                        {/* Bandeau Populaire */}
                        {plan.popular && (
                            <div
                                className="absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl"
                                style={{ backgroundColor: plan.color || '#F97316' }}
                            >
                                POPULAIRE
                            </div>
                        )}

                        {/* En-tête */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                            <p className="text-xs text-gray-400 font-mono mt-1">slug: {plan.slug}</p>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{plan.description}</p>
                        </div>

                        {/* Prix */}
                        <div className="my-6 p-4 bg-gray-50 rounded-xl text-center">
                            <p className="text-3xl font-black text-gray-900">
                                {plan.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">par mois</p>
                        </div>

                        {/* Fonctionnalités Premium (Badges) */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {plan.allowSubdomain && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                                    🌐 Sous-domaine
                                </span>
                            )}
                            {plan.allowCustomDomain && (
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                                    🌍 Domaine Perso
                                </span>
                            )}
                            {plan.allowLiveStreaming && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                                    📹 Live
                                </span>
                            )}
                            {plan.allowStories && (
                                <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-lg border border-pink-200">
                                    📱 Stories
                                </span>
                            )}
                        </div>

                        {/* Limites */}
                        <div className="grid grid-cols-3 gap-2 mb-6 text-sm">
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="block text-gray-500 text-xs">Annonces</span>
                                <span className="font-bold text-gray-900">
                                    {plan.maxListings === null ? 'Illimité' : plan.maxListings}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="block text-gray-500 text-xs">Vidéos/Annonce</span>
                                <span className="font-bold text-gray-900">
                                    {plan.maxVideosPerListing || 1}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="block text-gray-500 text-xs">Durée Vidéo</span>
                                <span className="font-bold text-gray-900">
                                    {plan.maxVideoDuration ? `${Math.floor(plan.maxVideoDuration / 60)} min` : 'Illimité'}
                                </span>
                            </div>
                        </div>

                        {/* Liste Fonctionnalités */}
                        <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => openEditModal(plan)}
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Création/Modification */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">
                                {editingPlan ? 'Modifier le Plan' : 'Nouveau Plan'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Informations de base */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                                    Informations Générales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Plan</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Premium, Pro, Gold..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Slug (Identifiant unique)</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={2}
                                            placeholder="Description courte du plan..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Prix Mensuel (FCFA)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-16"
                                                placeholder="0"
                                                required
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Couleur d'affichage</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={formData.color}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                className="h-10 w-20 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.color}
                                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Limites et Quotas */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
                                    Limites & Quotas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre max d'annonces</label>
                                        <input
                                            type="number"
                                            value={formData.maxListings}
                                            onChange={(e) => setFormData({ ...formData, maxListings: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            placeholder="Laisser vide pour illimité"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Vide = Illimité</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Vidéos par annonce</label>
                                        <input
                                            type="number"
                                            value={formData.maxVideosPerListing}
                                            onChange={(e) => setFormData({ ...formData, maxVideosPerListing: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            placeholder="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Durée max vidéo (secondes)</label>
                                        <input
                                            type="number"
                                            value={formData.maxVideoDuration}
                                            onChange={(e) => setFormData({ ...formData, maxVideoDuration: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                            placeholder="Ex: 60 pour 1 minute"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Ex: 300 = 5 minutes</p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Fonctionnalités Premium */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">3</span>
                                    Fonctionnalités Premium
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.allowSubdomain}
                                            onChange={(e) => setFormData({ ...formData, allowSubdomain: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="block font-bold text-gray-900">Sous-domaine</span>
                                            <span className="text-xs text-gray-500">boutique.videoboutique.com</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.allowCustomDomain}
                                            onChange={(e) => setFormData({ ...formData, allowCustomDomain: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="block font-bold text-gray-900">Domaine Personnalisé</span>
                                            <span className="text-xs text-gray-500">votre-site.com</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.allowLiveStreaming}
                                            onChange={(e) => setFormData({ ...formData, allowLiveStreaming: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="block font-bold text-gray-900">Live Streaming</span>
                                            <span className="text-xs text-gray-500">Diffusion en direct</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={formData.allowStories}
                                            onChange={(e) => setFormData({ ...formData, allowStories: e.target.checked })}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="block font-bold text-gray-900">Stories</span>
                                            <span className="text-xs text-gray-500">Stories vidéo 24h</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Liste des avantages */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm">4</span>
                                    Liste des avantages (Marketing)
                                </h3>
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Ex: Support prioritaire 24/7..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                                    >
                                        + Ajouter un avantage
                                    </button>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Options d'affichage */}
                            <section className="flex gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="font-medium text-gray-900">Plan Actif</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.popular}
                                            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </div>
                                    <span className="font-medium text-gray-900">Marquer comme Populaire</span>
                                </label>
                            </section>

                            <div className="flex gap-4 pt-6 border-t">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {editingPlan ? 'Mettre à jour le Plan' : 'Créer le Plan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold text-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

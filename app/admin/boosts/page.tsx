'use client';

import { useState, useEffect } from 'react';

interface BoostPackage {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    features: string[];
    active: boolean;
}

export default function BoostsPage() {
    const [boosts, setBoosts] = useState<BoostPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBoost, setEditingBoost] = useState<BoostPackage | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '7',
        features: [''],
        active: true
    });

    useEffect(() => {
        fetchBoosts();
    }, []);

    const fetchBoosts = async () => {
        try {
            const res = await fetch('/api/admin/boosts');
            if (res.ok) {
                const data = await res.json();
                setBoosts(data.boosts);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingBoost
            ? `/api/admin/boosts/${editingBoost.id}`
            : '/api/admin/boosts';

        const method = editingBoost ? 'PATCH' : 'POST';

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
                fetchBoosts();
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce package?')) return;

        try {
            const res = await fetch(`/api/admin/boosts/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchBoosts();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openEditModal = (boost: BoostPackage) => {
        setEditingBoost(boost);
        setFormData({
            name: boost.name,
            description: boost.description || '',
            price: boost.price.toString(),
            duration: boost.duration.toString(),
            features: boost.features.length > 0 ? boost.features : [''],
            active: boost.active
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingBoost(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: '7',
            features: [''],
            active: true
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
                    <h1 className="text-3xl font-black text-gray-900">Packages de Boost</h1>
                    <p className="text-gray-600 mt-1">Gérez les offres de mise en avant</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-bold flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau Boost
                </button>
            </div>

            {/* Liste des boosts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boosts.map((boost) => (
                    <div
                        key={boost.id}
                        className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative overflow-hidden transition-all hover:shadow-md ${!boost.active ? 'opacity-75 grayscale' : ''}`}
                        style={{ borderColor: '#F97316' }}
                    >
                        {/* En-tête */}
                        <div className="mb-4">
                            <h3 className="text-2xl font-black text-gray-900">{boost.name}</h3>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{boost.description}</p>
                        </div>

                        {/* Prix et Durée */}
                        <div className="my-6 p-4 bg-orange-50 rounded-xl text-center">
                            <p className="text-3xl font-black text-gray-900">
                                {boost.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span>
                            </p>
                            <p className="text-sm font-bold text-orange-600 mt-1">
                                Pendant {boost.duration} jours
                            </p>
                        </div>

                        {/* Liste Fonctionnalités */}
                        <ul className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                            {boost.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => openEditModal(boost)}
                                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(boost.id)}
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
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">
                                {editingBoost ? 'Modifier le Boost' : 'Nouveau Boost'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Informations de base */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Package</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    placeholder="Ex: Urgent 7 Jours"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    rows={2}
                                    placeholder="Description courte..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prix (FCFA)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="2000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Durée (Jours)</label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        placeholder="7"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Liste des avantages */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Avantages inclus</label>
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                                placeholder="Ex: Badge Urgent..."
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
                                        className="text-sm text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                                    >
                                        + Ajouter un avantage
                                    </button>
                                </div>
                            </div>

                            {/* Options */}
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </div>
                                <span className="font-medium text-gray-900">Package Actif</span>
                            </label>

                            <div className="flex gap-4 pt-6 border-t">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {editingBoost ? 'Mettre à jour' : 'Créer le Boost'}
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

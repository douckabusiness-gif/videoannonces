'use client';

import { useState, useEffect } from 'react';

interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    description: string | null;
    instruction: string | null;
    icon: string | null;
    color: string;
    active: boolean;
    order: number;
    phoneNumber: string | null;
    paymentLink: string | null;
    createdAt: Date;
}

export default function PaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        instruction: '',
        icon: '',
        color: 'from-gray-500 to-gray-600',
        active: true,
        order: 0,
        phoneNumber: '',
        paymentLink: ''
    });

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const res = await fetch('/api/admin/payment-methods');
            if (res.ok) {
                const data = await res.json();
                setMethods(data.methods);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Uploader le logo s'il a été sélectionné
            let iconUrl = formData.icon;
            if (logoFile) {
                const uploadedUrl = await uploadLogo();
                if (uploadedUrl) {
                    iconUrl = uploadedUrl;
                }
            }

            const url = editingMethod
                ? `/api/admin/payment-methods/${editingMethod.id}`
                : '/api/admin/payment-methods';

            const method = editingMethod ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    icon: iconUrl
                })
            });

            if (res.ok) {
                fetchMethods();
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce mode de paiement?')) return;

        try {
            const res = await fetch(`/api/admin/payment-methods/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchMethods();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openEditModal = (method: PaymentMethod) => {
        setEditingMethod(method);
        setFormData({
            name: method.name,
            code: method.code,
            description: method.description || '',
            instruction: method.instruction || '',
            icon: method.icon || '',
            color: method.color,
            active: method.active,
            order: method.order,
            phoneNumber: method.phoneNumber || '',
            paymentLink: method.paymentLink || ''
        });
        setShowModal(true);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            // Créer une prévisualisation
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async (): Promise<string | null> => {
        if (!logoFile) return null;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', logoFile);

            const res = await fetch('/api/upload/payment-logo', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading logo:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setEditingMethod(null);
        setLogoFile(null);
        setLogoPreview('');
        setFormData({
            name: '',
            code: '',
            description: '',
            instruction: '',
            icon: '',
            color: 'from-gray-500 to-gray-600',
            active: true,
            order: 0,
            phoneNumber: '',
            paymentLink: ''
        });
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Modes de Paiement</h1>
                    <p className="text-gray-600 mt-1">Gérez les modes de paiement disponibles</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                >
                    + Nouveau Mode
                </button>
            </div>

            {/* Liste des modes de paiement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {methods.map((method) => (
                    <div key={method.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {method.icon ? (
                                    <img src={method.icon} alt={method.name} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        {method.name[0]}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900">{method.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{method.code}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${method.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {method.active ? 'ACTIF' : 'INACTIF'}
                            </span>
                        </div>

                        {method.description && (
                            <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                        )}

                        {method.instruction && (
                            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-xs text-gray-600 font-mono border border-gray-100">
                                <strong>Instructions :</strong><br />
                                {method.instruction}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(method)}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(method.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {methods.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">Aucun mode de paiement configuré</p>
                    <p className="text-sm text-gray-400 mt-2">Cliquez sur "Nouveau Mode" pour commencer</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">
                            {editingMethod ? 'Modifier le Mode de Paiement' : 'Nouveau Mode de Paiement'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Orange Money"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Code</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                                        placeholder="orange_money"
                                        required
                                        disabled={!!editingMethod}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Paiement via Orange Money..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Instructions de Paiement</label>
                                <p className="text-xs text-gray-500 mb-1">Utilisez {'{amount}'} pour le montant. Expliquez les étapes (ex: #144*...)</p>
                                <textarea
                                    value={formData.instruction}
                                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                                    className="w-full px-4 py-2 border border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    rows={3}
                                    placeholder="Composez le #144*82*... pour envoyer {amount} FCFA vers le..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Logo / Icône</label>
                                <div className="space-y-3">
                                    {/* Input file pour upload */}
                                    <div>
                                        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm font-bold text-blue-600">
                                                {uploading ? 'Upload en cours...' : 'Uploader un logo'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG, WEBP (max 2MB)</p>
                                    </div>

                                    {/* Prévisualisation du logo */}
                                    {logoPreview && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <img src={logoPreview} alt="Preview" className="w-12 h-12 object-contain rounded" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700">Logo sélectionné</p>
                                                <p className="text-xs text-gray-500">{logoFile?.name}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLogoFile(null);
                                                    setLogoPreview('');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* OU saisir un emoji manuellement */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-gray-500">OU</span>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl"
                                        placeholder="🟠 Emoji"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Couleur</label>
                                    <select
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="from-orange-500 to-orange-600">Orange</option>
                                        <option value="from-yellow-500 to-yellow-600">Jaune</option>
                                        <option value="from-blue-500 to-blue-600">Bleu</option>
                                        <option value="from-green-500 to-green-600">Vert</option>
                                        <option value="from-red-500 to-red-600">Rouge</option>
                                        <option value="from-purple-500 to-purple-600">Violet</option>
                                        <option value="from-gray-500 to-gray-600">Gris</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ordre</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de Téléphone</label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="+225 07 09 19 43 18"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Lien de Paiement</label>
                                    <input
                                        type="url"
                                        value={formData.paymentLink}
                                        onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://pay.wave.com/m/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Actif</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                                >
                                    {editingMethod ? 'Mettre à jour' : 'Créer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
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

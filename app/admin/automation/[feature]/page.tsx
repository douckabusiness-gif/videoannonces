'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AutomationConfig {
    id: string;
    feature: string;
    name: string;
    description: string;
    category: string;
    enabled: boolean;
    config: any;
    apiProvider: string | null;
    apiKey: string | null;
    apiEndpoint: string | null;
    dailyQuota: number | null;
    monthlyQuota: number | null;
    usageCount: number;
    costPerCall: number | null;
    totalCost: number;
    priority: number;
    version: string;
    createdAt: string;
    updatedAt: string;
}

export default function AutomationConfigPage() {
    const params = useParams();
    const router = useRouter();
    const feature = params.feature as string;

    const [config, setConfig] = useState<AutomationConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchConfig();
    }, [feature]);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/automation');
            if (res.ok) {
                const configs = await res.json();
                const found = configs.find((c: AutomationConfig) => c.feature === feature);
                if (found) {
                    setConfig(found);
                    setFormData(found.config || {});
                }
            }
        } catch (error) {
            console.error('Erreur chargement config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;

        setSaving(true);
        try {
            const res = await fetch('/api/admin/automation', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: config.id,
                    config: formData
                })
            });

            if (res.ok) {
                alert('✅ Configuration sauvegardée !');
                await fetchConfig();
            } else {
                alert('❌ Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('❌ Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    const updateFormData = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⚙️</div>
                    <p className="text-gray-600">Chargement de la configuration...</p>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-gray-600 mb-4">Configuration non trouvée</p>
                    <Link href="/admin/automation" className="text-blue-600 hover:underline">
                        Retour au dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/automation"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour au dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        ⚙️ {config.name}
                    </h1>
                    <p className="text-gray-600">{config.description}</p>
                </div>

                {/* Status Card */}
                <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 mb-8 ${config.enabled ? 'border-green-200' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-gray-600 mb-1">STATUT</div>
                            <div className={`text-2xl font-black ${config.enabled ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                {config.enabled ? '✅ ACTIF' : '⏸️ INACTIF'}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-sm text-gray-600">Exécutions</div>
                                <div className="text-2xl font-bold text-blue-600">{config.usageCount}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Coût total</div>
                                <div className="text-2xl font-bold text-orange-600">${config.totalCost.toFixed(2)}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Quota</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {config.dailyQuota ? `${config.dailyQuota}/j` : '∞'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Configuration</h2>

                    <div className="space-y-6">
                        {/* Render dynamic form based on config */}
                        {Object.keys(formData).map(key => (
                            <div key={key}>
                                <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </label>
                                {typeof formData[key] === 'boolean' ? (
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData[key]}
                                            onChange={(e) => updateFormData(key, e.target.checked)}
                                            className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <span className="text-gray-700">
                                            {formData[key] ? 'Activé' : 'Désactivé'}
                                        </span>
                                    </label>
                                ) : typeof formData[key] === 'number' ? (
                                    <input
                                        type="number"
                                        value={formData[key]}
                                        onChange={(e) => updateFormData(key, parseFloat(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                ) : Array.isArray(formData[key]) ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData[key].map((item: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData[key]}
                                        onChange={(e) => updateFormData(key, e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all ${saving
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-105 shadow-lg'
                                }`}
                        >
                            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
                        </button>
                        <button
                            onClick={() => setFormData(config.config || {})}
                            className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition"
                        >
                            🔄 Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <h3 className="text-lg font-black text-blue-900 mb-3">ℹ️ Informations</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700 font-bold">Catégorie:</span>
                            <span className="ml-2 text-blue-900">{config.category}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-bold">Provider:</span>
                            <span className="ml-2 text-blue-900">{config.apiProvider || 'Custom'}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-bold">Version:</span>
                            <span className="ml-2 text-blue-900">{config.version}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-bold">Priorité:</span>
                            <span className="ml-2 text-blue-900">{config.priority}</span>
                        </div>
                        {config.costPerCall && (
                            <div>
                                <span className="text-blue-700 font-bold">Coût/appel:</span>
                                <span className="ml-2 text-blue-900">${config.costPerCall.toFixed(4)}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-blue-700 font-bold">Dernière MAJ:</span>
                            <span className="ml-2 text-blue-900">
                                {new Date(config.updatedAt).toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

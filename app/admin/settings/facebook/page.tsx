'use client';

import { useState, useEffect } from 'react';
import { getFacebookSettings, saveFacebookSettings } from './actions';
import { Facebook, Save, Shield, Key, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/contexts/I18nContext';

export default function FacebookSettingsPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    
    const [formData, setFormData] = useState({
        facebookAppId: '',
        facebookAppSecret: '',
        facebookLoginEnabled: false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getFacebookSettings();
                setFormData({
                    facebookAppId: data.facebookAppId || '',
                    facebookAppSecret: data.facebookAppSecret || '',
                    facebookLoginEnabled: data.facebookLoginEnabled || false,
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg('');
        
        const result = await saveFacebookSettings(formData);
        
        if (result.success) {
            setSuccessMsg('Paramètres Facebook enregistrés avec succès.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } else {
            alert('Erreur lors de la sauvegarde: ' + result.error);
        }
        
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <Facebook className="w-8 h-8 text-blue-600" />
                    Intégration Facebook & API
                </h1>
                <p className="text-gray-600 mt-2">
                    Configurez l'authentification Facebook et l'API Marketing pour permettre aux vendeurs de lier automatiquement leurs pages sociales à leur boutique.
                </p>
            </div>

            {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{successMsg}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900">Application Facebook Developer</h2>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">Graph API v19.0+</span>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* App ID */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Facebook App ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Facebook className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Ex: 123456789012345"
                                        value={formData.facebookAppId}
                                        onChange={(e) => setFormData({ ...formData, facebookAppId: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">L'identifiant unique de votre application Meta.</p>
                            </div>

                            {/* App Secret */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Facebook App Secret</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••••••"
                                        value={formData.facebookAppSecret}
                                        onChange={(e) => setFormData({ ...formData, facebookAppSecret: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">La clé secrète (Ne la partagez jamais).</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Fonctionnalités */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Fonctionnalités Activées</h2>
                    </div>
                    
                    <div className="p-6">
                        <div 
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => setFormData({ ...formData, facebookLoginEnabled: !formData.facebookLoginEnabled })}
                        >
                            <div>
                                <h3 className="font-bold text-gray-900">Facebook Login pour les Vendeurs</h3>
                                <p className="text-sm text-gray-500 mt-1">Autorise les vendeurs à lier leur compte et récupérer leurs pages Facebook directement depuis leur dashboard.</p>
                            </div>
                            <div>
                                {formData.facebookLoginEnabled ? (
                                    <ToggleRight className="w-10 h-10 text-green-500" />
                                ) : (
                                    <ToggleLeft className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-600/20 disabled:opacity-70"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Enregistrement...' : 'Enregistrer la Configuration'}
                    </button>
                </div>
            </form>

            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Instructions pour l'application Meta</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
                    <li>Rendez-vous sur <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="underline font-bold">developers.facebook.com</a> et créez une application.</li>
                    <li>Ajoutez le produit <strong>Facebook Login pour les entreprises</strong>.</li>
                    <li>Configurez les <strong>URI de redirection OAuth autorisés</strong> avec l'URL de votre site (ex: <code>https://afrivideoannonce.com/api/auth/callback/facebook</code> si utilisation de NextAuth).</li>
                    <li>Demandez l'autorisation <code>pages_show_list</code> pour pouvoir lister les pages du vendeur.</li>
                </ul>
            </div>
        </div>
    );
}

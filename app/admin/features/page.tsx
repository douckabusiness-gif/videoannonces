'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

export default function AdminFeaturesPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        publicRegistrationEnabled: false,
        signupDefaultVendor: false,
        soloModeEnabled: false,
        shopsEnabled: false,
    });
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch('/api/admin/platform')
            .then(res => res.json())
            .then(data => {
                setSettings({
                    publicRegistrationEnabled: data.publicRegistrationEnabled ?? false,
                    signupDefaultVendor: data.signupDefaultVendor ?? false,
                    soloModeEnabled: data.soloModeEnabled ?? false,
                    shopsEnabled: data.shopsEnabled ?? false,
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleToggle = async (key: keyof typeof settings) => {
        const newValue = !settings[key];
        const oldSettings = { ...settings };
        
        // Optimistic update
        setSettings(prev => ({ ...prev, [key]: newValue }));
        setSaving(true);
        setStatusMessage(null);

        try {
            const res = await fetch('/api/admin/platform', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: newValue }),
            });

            if (!res.ok) throw new Error();
            
            setStatusMessage({ 
                type: 'success', 
                text: t('admin.features.success') || 'Mise à jour réussie' 
            });
        } catch (error) {
            setSettings(oldSettings);
            setStatusMessage({ 
                type: 'error', 
                text: t('admin.features.error') || 'Erreur lors de la mise à jour' 
            });
        } finally {
            setSaving(false);
            // Auto hide success message after 3 seconds
            if (statusMessage?.type === 'success') {
                setTimeout(() => setStatusMessage(null), 3000);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {t('admin.features.title')}
                </h1>
                <p className="text-gray-500 mt-2">
                    {t('admin.features.subtitle')}
                </p>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
                    statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {statusMessage.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span className="font-medium text-sm">{statusMessage.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{t('admin.features.registration.title')}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {t('admin.features.registration.description')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase tracking-wider ${settings.publicRegistrationEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                                {settings.publicRegistrationEnabled ? t('admin.features.registration.enabled') : t('admin.features.registration.disabled')}
                            </span>
                        </div>
                        <button
                            onClick={() => handleToggle('publicRegistrationEnabled')}
                            disabled={saving}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                settings.publicRegistrationEnabled ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    settings.publicRegistrationEnabled ? 'translate-x-6' : 'translate-x-1'
                                } shadow-sm`}
                            />
                        </button>
                    </div>
                </div>

                {/* Default Vendor Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{t('admin.features.defaultVendor.title')}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {t('admin.features.defaultVendor.description')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase tracking-wider ${settings.signupDefaultVendor ? 'text-amber-600' : 'text-gray-400'}`}>
                                {settings.signupDefaultVendor ? t('admin.features.defaultVendor.enabled') : t('admin.features.defaultVendor.disabled')}
                            </span>
                        </div>
                        <button
                            onClick={() => handleToggle('signupDefaultVendor')}
                            disabled={saving}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                settings.signupDefaultVendor ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    settings.signupDefaultVendor ? 'translate-x-6' : 'translate-x-1'
                                } shadow-sm`}
                            />
                        </button>
                    </div>
                </div>

                {/* Solo Mode Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{t('admin.features.soloMode.title')}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {t('admin.features.soloMode.description')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase tracking-wider ${settings.soloModeEnabled ? 'text-blue-600' : 'text-gray-400'}`}>
                                {settings.soloModeEnabled ? t('admin.features.soloMode.enabled') : t('admin.features.soloMode.disabled')}
                            </span>
                        </div>
                        <button
                            onClick={() => handleToggle('soloModeEnabled')}
                            disabled={saving}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                settings.soloModeEnabled ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    settings.soloModeEnabled ? 'translate-x-6' : 'translate-x-1'
                                } shadow-sm`}
                            />
                        </button>
                    </div>
                </div>

                {/* Boutique System Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{t('admin.features.shops.title')}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {t('admin.features.shops.description')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold uppercase tracking-wider ${settings.shopsEnabled ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {settings.shopsEnabled ? t('admin.features.shops.enabled') : t('admin.features.shops.disabled')}
                            </span>
                        </div>
                        <button
                            onClick={() => handleToggle('shopsEnabled')}
                            disabled={saving}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                                settings.shopsEnabled ? 'bg-red-600' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                    settings.shopsEnabled ? 'translate-x-6' : 'translate-x-1'
                                } shadow-sm`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-red-900 font-bold">Conseil de gestion</h4>
                        <p className="text-red-800/80 text-sm mt-1">
                            Ces paramètres affectent directement l'acquisition de nouveaux utilisateurs. Désactiver les inscriptions publiques est recommandé lors de périodes de maintenance ou si vous gérez les comptes manuellement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

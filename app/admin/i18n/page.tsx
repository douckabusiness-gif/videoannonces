'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function I18nSettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [multiLanguageEnabled, setMultiLanguageEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchSettings();
    }, [session, router]);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/i18n-settings');
            if (response.ok) {
                const data = await response.json();
                setMultiLanguageEnabled(data.multiLanguageEnabled);
            }
        } catch (error) {
            console.error('Error fetching i18n settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/admin/i18n-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ multiLanguageEnabled }),
            });

            if (response.ok) {
                alert('✅ Paramètres sauvegardés avec succès !');
                // Recharger la page pour appliquer les changements
                window.location.reload();
            } else {
                alert('❌ Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('❌ Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🌍 Paramètres Multi-langues
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Gérez le système de traduction multilingue de la plateforme
                    </p>

                    {/* Toggle Multi-langues */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    Activer le Multi-langues
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Permet aux utilisateurs de changer la langue de l'interface (FR, EN, ES)
                                </p>
                            </div>
                            <button
                                onClick={() => setMultiLanguageEnabled(!multiLanguageEnabled)}
                                className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${multiLanguageEnabled ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${multiLanguageEnabled ? 'translate-x-13' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Langues disponibles */}
                    {multiLanguageEnabled && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Langues Disponibles
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg text-center border-2 border-green-200">
                                    <div className="text-4xl mb-2">🇫🇷</div>
                                    <div className="font-bold">Français</div>
                                    <div className="text-xs text-gray-500">Par défaut</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg text-center border-2 border-gray-200">
                                    <div className="text-4xl mb-2">🇬🇧</div>
                                    <div className="font-bold">English</div>
                                    <div className="text-xs text-gray-500">Disponible</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg text-center border-2 border-gray-200">
                                    <div className="text-4xl mb-2">🇪🇸</div>
                                    <div className="font-bold">Español</div>
                                    <div className="text-xs text-gray-500">Disponible</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informations */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Note :</strong> Les changements prennent effet immédiatement pour tous les utilisateurs.
                                    {!multiLanguageEnabled && ' Le sélecteur de langue sera masqué.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de sauvegarde */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-bold shadow-lg disabled:opacity-50"
                        >
                            {saving ? 'Sauvegarde...' : '💾 Enregistrer'}
                        </button>
                    </div>
                </div>

                {/* Statistiques */}
                {multiLanguageEnabled && (
                    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            📊 Statistiques d'Utilisation
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-600">75%</div>
                                <div className="text-sm text-gray-600">Français</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-600">20%</div>
                                <div className="text-sm text-gray-600">English</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-3xl font-bold text-orange-600">5%</div>
                                <div className="text-sm text-gray-600">Español</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

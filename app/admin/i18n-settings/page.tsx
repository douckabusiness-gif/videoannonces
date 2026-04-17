'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

interface I18nSettings {
    multiLanguageEnabled: boolean;
    availableLanguages: string[];
    defaultLanguage: string;
    autoDetect: boolean;
}

export default function I18nSettingsPage() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<I18nSettings>({
        multiLanguageEnabled: true,
        availableLanguages: ['fr', 'en', 'es'],
        defaultLanguage: 'fr',
        autoDetect: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/i18n-settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/i18n-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert(t('admin.i18n.success'));
                // Force reload to apply changes immediately
                window.location.reload();
            } else {
                alert(t('admin.i18n.error'));
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(t('admin.i18n.error'));
        } finally {
            setSaving(false);
        }
    };

    const toggleLanguage = (lang: string) => {
        if (settings.availableLanguages.includes(lang)) {
            // Empêcher de désactiver la langue par défaut
            if (lang === settings.defaultLanguage) {
                alert('Impossible de désactiver la langue par défaut'); // Todo: Add translation for this alert if needed
                return;
            }
            setSettings({
                ...settings,
                availableLanguages: settings.availableLanguages.filter(l => l !== lang)
            });
        } else {
            setSettings({
                ...settings,
                availableLanguages: [...settings.availableLanguages, lang]
            });
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent mx-auto"></div></div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{t('admin.i18n.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('admin.i18n.subtitle')}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-8">

                {/* Activation Globale */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-bold text-gray-900">{t('admin.i18n.enable.title')}</h3>
                        <p className="text-sm text-gray-500">{t('admin.i18n.enable.desc')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.multiLanguageEnabled}
                            onChange={(e) => setSettings({ ...settings, multiLanguageEnabled: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>

                {/* Langue par défaut */}
                <div className="space-y-3">
                    <label className="block font-bold text-gray-900">{t('admin.i18n.defaultLanguage.label')}</label>
                    <select
                        value={settings.defaultLanguage}
                        onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                        <option value="fr">Français (France)</option>
                        <option value="en">English (International)</option>
                        <option value="es">Español (España)</option>
                    </select>
                    <p className="text-sm text-gray-500">{t('admin.i18n.defaultLanguage.help')}</p>
                </div>

                {/* Langues Disponibles */}
                <div className="space-y-3">
                    <label className="block font-bold text-gray-900">{t('admin.i18n.availableLanguages.label')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { code: 'fr', label: 'Français', flag: '🇫🇷' },
                            { code: 'en', label: 'English', flag: '🇬🇧' },
                            { code: 'es', label: 'Español', flag: '🇪🇸' },
                        ].map((lang) => (
                            <div
                                key={lang.code}
                                onClick={() => toggleLanguage(lang.code)}
                                className={`
                                    cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                    ${settings.availableLanguages.includes(lang.code)
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-200'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                </div>
                                {settings.availableLanguages.includes(lang.code) && (
                                    <div className="text-orange-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Auto Détection */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <input
                        type="checkbox"
                        id="autoDetect"
                        checked={settings.autoDetect}
                        onChange={(e) => setSettings({ ...settings, autoDetect: e.target.checked })}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="autoDetect" className="text-gray-700 cursor-pointer select-none">
                        {t('admin.i18n.autoDetect')}
                    </label>
                </div>

                {/* Save Button */}
                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? t('admin.i18n.saving') : t('admin.i18n.save')}
                    </button>
                </div>
            </div>
        </div>
    );
}

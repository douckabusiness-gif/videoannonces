'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

export default function AdminSettingsPage() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<any>({ grouped: {} });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetting = async (key: string, value: string, description: string, category: string) => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, description, category })
            });

            if (res.ok) {
                fetchSettings();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">{t('admin.settings.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('admin.settings.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        const key = prompt(t('admin.settings.prompts.key'));
                        const value = prompt(t('admin.settings.prompts.value'));
                        const description = prompt(t('admin.settings.prompts.description'));
                        const category = prompt(t('admin.settings.prompts.category'));
                        if (key && value && category) {
                            handleSaveSetting(key, value, description || '', category);
                        }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold"
                >
                    {t('admin.settings.new')}
                </button>
            </div>

            {Object.keys(settings.grouped).length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">{t('admin.settings.empty.title')}</p>
                    <p className="text-sm text-gray-400 mt-2">{t('admin.settings.empty.desc')}</p>
                </div>
            ) : (
                Object.entries(settings.grouped).map(([category, items]: [string, any]) => (
                    <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 uppercase">{category}</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map((setting: any) => (
                                <div key={setting.id} className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{setting.key}</h3>
                                            {setting.description && (
                                                <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                                            )}
                                            <p className="text-sm text-gray-700 mt-2 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">
                                                {setting.value}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newValue = prompt(t('admin.settings.prompts.newValue'), setting.value);
                                                if (newValue !== null) {
                                                    handleSaveSetting(setting.key, newValue, setting.description, setting.category);
                                                }
                                            }}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                        >
                                            {t('admin.settings.modify')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Quick Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t('admin.settings.quickSettings.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('admin.settings.quickSettings.platformCommission')}
                        </label>
                        <input
                            type="number"
                            defaultValue="10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('admin.settings.quickSettings.listingDuration')}
                        </label>
                        <input
                            type="number"
                            defaultValue="30"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('admin.settings.quickSettings.premiumPrice')}
                        </label>
                        <input
                            type="number"
                            defaultValue="5000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {t('admin.settings.quickSettings.autoModeration')}
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                            <option value="true">{t('admin.settings.quickSettings.enabled')}</option>
                            <option value="false">{t('admin.settings.quickSettings.disabled')}</option>
                        </select>
                    </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold">
                    {t('admin.settings.quickSettings.save')}
                </button>
            </div>
        </div>
    );
}

'use client';

import { useTranslation } from '@/contexts/I18nContext';

export default function ChatSettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-black text-gray-900">{t('dashboard.settings.chat.title')}</h1>

            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                    🛠️
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Système de Chat Natif Activé</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Le widget de discussion est désormais actif sur votre boutique.
                    Les clients peuvent vous contacter directement et les messages arriveront dans votre boîte de réception.
                </p>
            </div>
        </div>
    );
}

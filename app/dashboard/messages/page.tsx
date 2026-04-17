'use client';

import ChatLayout from '@/components/chat/ChatLayout';
import { useTranslation } from '@/contexts/I18nContext';

export default function MessagesPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-gray-900">{t('messages.page.title')}</h1>
                <p className="text-gray-600">{t('messages.page.desc')}</p>
            </div>

            <ChatLayout />
        </div>
    );
}

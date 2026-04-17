'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { useTranslation } from '@/contexts/I18nContext';

export default function ChatLayout() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const conversationParam = searchParams.get('conversation');

    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversationParam);
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    // Auto-sélectionner la conversation depuis l'URL
    useEffect(() => {
        if (conversationParam) {
            setSelectedConversationId(conversationParam);
            if (window.innerWidth < 768) {
                setIsMobileListVisible(false);
            }
        }
    }, [conversationParam]);

    // Sur mobile, quand on sélectionne une conv, on cache la liste
    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        if (window.innerWidth < 768) {
            setIsMobileListVisible(false);
        }
    };

    const handleBackToList = () => {
        setIsMobileListVisible(true);
        setSelectedConversationId(null);
    };

    return (
        <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] bg-white md:rounded-2xl shadow-xl overflow-hidden border-t md:border border-gray-200 -mx-4 md:mx-0">
            {/* Liste des conversations (Sidebar) */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col ${!isMobileListVisible ? 'hidden md:flex' : 'flex'
                }`}>
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="text-xl font-black text-gray-900">{t('messages.layout.title')}</h2>
                </div>
                <ConversationList
                    selectedId={selectedConversationId}
                    onSelect={handleSelectConversation}
                />
            </div>

            {/* Fenêtre de chat */}
            <div className={`w-full md:w-2/3 flex flex-col bg-white ${isMobileListVisible ? 'hidden md:flex' : 'flex'
                }`}>
                {selectedConversationId ? (
                    <ChatWindow
                        conversationId={selectedConversationId}
                        onBack={handleBackToList}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">{t('messages.layout.empty.title')}</h3>
                        <p className="mb-6">{t('messages.layout.empty.desc')}</p>
                        <a
                            href="/"
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/30 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {t('messages.layout.empty.cta')}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Conversation {
    id: string;
    lastMessageAt: string;
    otherUser: {
        id: string;
        name: string;
        avatar: string | null;
    };
    listing: {
        id: string;
        title: string;
        thumbnailUrl: string;
        price: number;
    } | null;
    lastMessage: {
        content: string;
        read: boolean;
        createdAt: string;
        senderId: string;
    } | null;
}

interface ConversationListProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function ConversationList({ selectedId, onSelect }: ConversationListProps) {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
        // Poll toutes les 10s pour update liste
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Erreur chargement conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                <p>Aucune conversation pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
                const isUnread = conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.senderId !== session?.user?.id;

                return (
                    <button
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 text-left ${selectedId === conv.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                {conv.otherUser.avatar ? (
                                    <img src={conv.otherUser.avatar} alt={conv.otherUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-xl">
                                        {conv.otherUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            {isUnread && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`truncate font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {conv.otherUser.name}
                                </h3>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                    {conv.lastMessage && formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true, locale: fr })}
                                </span>
                            </div>

                            {conv.listing && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                    <span className="truncate max-w-[150px]">📦 {conv.listing.title}</span>
                                    <span className="font-bold text-orange-600">• {conv.listing.price.toLocaleString()} FCFA</span>
                                </div>
                            )}

                            <p className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                {conv.lastMessage ? conv.lastMessage.content : 'Nouvelle conversation'}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useGeoRestriction } from '@/hooks/useGeoRestriction';

type Message = {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
};

type Conversation = {
    id: string;
    messages: Message[];
};

export default function NativeChatWidget({ sellerId }: { sellerId: string }) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Charger la conversation à l'ouverture
    useEffect(() => {
        if (isOpen && session?.user) {
            fetchConversation();
        }
    }, [isOpen, session]);

    // Scroll vers le bas à chaque nouveau message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Polling simple pour les nouveaux messages (toutes les 5s si ouvert)
    useEffect(() => {
        if (!isOpen || !session?.user || !conversationId) return;

        const interval = setInterval(() => {
            fetchConversation(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [isOpen, session, conversationId]);

    const fetchConversation = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`/api/chat/widget?sellerId=${sellerId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated && data.conversation) {
                    setConversationId(data.conversation.id);
                    setMessages(data.conversation.messages);
                }
            }
        } catch (error) {
            console.error('Error fetching chat:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user) return;

        setSending(true);
        try {
            const res = await fetch('/api/chat/widget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sellerId,
                    content: newMessage,
                    conversationId
                })
            });

            if (res.ok) {
                const savedMessage = await res.json();
                setMessages([...messages, savedMessage]);
                setNewMessage('');
                if (!conversationId) {
                    fetchConversation(); // Recharger pour avoir l'ID conversation
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const isRestricted = useGeoRestriction();

    if (!isOpen) {
        return (
            <button
                onClick={() => isRestricted ? null : setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 text-white rounded-full shadow-2xl transition-all z-50 flex items-center gap-2 group ${isRestricted ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-orange-600 hover:bg-orange-700 hover:scale-105'}`}
                title={isRestricted ? "Le chat est restreint à la Côte d'Ivoire" : "Discuter avec le vendeur"}
            >
                <div className="relative">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {!isRestricted && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </div>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
                    {isRestricted ? "Chat Restreint" : "Discuter avec le vendeur"}
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 bg-orange-600 text-white flex justify-between items-center bg-gradient-to-r from-orange-600 to-red-600">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        💬
                    </div>
                    <div>
                        <h3 className="font-bold">Discussion</h3>
                        <p className="text-xs text-orange-100">En direct avec le vendeur</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                {!session?.user ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl mb-2">
                            🔒
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">Connectez-vous pour discuter</h4>
                        <p className="text-gray-500 text-sm">
                            Pour garantir la qualité des échanges avec nos vendeurs, vous devez être connecté.
                        </p>
                        <button
                            onClick={() => signIn()}
                            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition w-full shadow-lg"
                        >
                            Se connecter / S'inscrire
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center h-full text-gray-400 gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p>👋 Bonjour !</p>
                        <p className="text-sm mt-2">Posez votre question, le vendeur vous répondra rapidement.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] p-3 rounded-2xl text-sm shadow-sm
                                ${msg.senderId === session.user.id
                                    ? 'bg-orange-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {session?.user && (
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            disabled={sending}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition outline-none text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                        >
                            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatbotWidget() {
    const { siteSettings } = useSiteSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Bonjour ! 👋 Je suis l'assistant ${siteSettings.siteName}. Comment puis-je vous aider aujourd'hui ?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickQuestions = [
        'Comment créer une annonce ?',
        'Quels sont les tarifs Premium ?',
        'Comment contacter un vendeur ?',
        'Comment booster une annonce ?',
    ];

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Erreur chatbot:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const pathname = usePathname();
    const [shouldShow, setShouldShow] = useState(true);

    useEffect(() => {
        // Logique pour masquer le chatbot sur les sous-domaines boutiques
        const checkVisibility = () => {
            const hostname = window.location.hostname;
            const parts = hostname.split('.');
            let subdomain = '';

            // Gestion localhost (sub.localhost)
            if (hostname.includes('localhost')) {
                if (parts.length > 1 && parts[0] !== 'localhost') {
                    subdomain = parts[0];
                }
            }
            // Gestion Prod (sub.domain.com)
            else if (parts.length >= 3) {
                subdomain = parts[0];
            }

            // Liste des sous-domaines "Système" (où le chatbot DOIT s'afficher)
            const systemSubdomains = ['www', 'admin', 'dashboard', 'app', 'secure'];

            // Si c'est un sous-domaine qui n'est PAS système (donc une boutique) -> on cache
            if (subdomain && !systemSubdomains.includes(subdomain)) {
                setShouldShow(false);
                return;
            }

            // Fallback : check pathname (cas accès direct /shop/...)
            if (pathname?.startsWith('/shop/')) {
                setShouldShow(false);
                return;
            }

            setShouldShow(true);
        };

        checkVisibility();
    }, [pathname]);

    if (!shouldShow) return null;

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                🤖
                            </div>
                            <div>
                                <div className="font-bold">Assistant {siteSettings.siteName}</div>
                                <div className="text-xs text-orange-100">En ligne</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                        : 'bg-white text-gray-900 shadow-md'
                                        }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 1 && (
                        <div className="p-4 bg-white border-t border-gray-200">
                            <p className="text-xs font-bold text-gray-600 mb-2">Questions fréquentes :</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => sendMessage(question)}
                                        className="text-xs px-3 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-lg transition font-medium"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Posez votre question..."
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

'use client';

import { useState } from 'react';
import MessageStatus from '@/components/messages/MessageStatus';
import TypingIndicator from '@/components/messages/TypingIndicator';

interface DemoMessage {
    id: string;
    content: string;
    isMine: boolean;
    createdAt: Date;
    deliveredAt?: Date | null;
    readAt?: Date | null;
}

export default function MessageFeaturesDemoPage() {
    const [showTyping, setShowTyping] = useState(false);
    const [messages, setMessages] = useState<DemoMessage[]>([
        {
            id: '1',
            content: 'Salut ! Comment vas-tu ? 👋',
            isMine: true,
            createdAt: new Date(Date.now() - 3600000),
            deliveredAt: new Date(Date.now() - 3500000),
            readAt: new Date(Date.now() - 3400000),
        },
        {
            id: '2',
            content: 'Je vais bien merci ! Et toi ?',
            isMine: false,
            createdAt: new Date(Date.now() - 3300000),
        },
        {
            id: '3',
            content: 'Super ! J\'ai regardé ton annonce pour le téléphone',
            isMine: true,
            createdAt: new Date(Date.now() - 3000000),
            deliveredAt: new Date(Date.now() - 2900000),
            readAt: null, // Délivré mais pas lu
        },
        {
            id: '4',
            content: 'Est-ce qu\'il est toujours disponible ?',
            isMine: true,
            createdAt: new Date(Date.now() - 60000),
            deliveredAt: new Date(Date.now() - 50000),
            readAt: null, // Délivré mais pas lu
        },
        {
            id: '5',
            content: 'Message en cours d\'envoi...',
            isMine: true,
            createdAt: new Date(),
            deliveredAt: null, // Pas encore délivré
            readAt: null,
        },
    ]);

    // Simuler "typing"
    const handleToggleTyping = () => {
        setShowTyping(!showTyping);
    };

    // Simuler lecture de message
    const markAsRead = (messageId: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, readAt: new Date() }
                : msg
        ));
    };

    // Simuler livraison de message
    const markAsDelivered = (messageId: string) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId
                ? { ...msg, deliveredAt: new Date() }
                : msg
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* En-tête */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        💬 Fonctionnalités Messagerie
                    </h1>
                    <p className="text-gray-600">
                        Accusés de lecture & Indicateur "en train d'écrire"
                    </p>
                </div>

                {/* Contrôles de démo */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contrôles de Démo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleToggleTyping}
                            className={`px-4 py-3 rounded-xl font-bold transition ${showTyping
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {showTyping ? '✓ Typing actif' : 'Activer "typing..."'}
                        </button>

                        <button
                            onClick={() => markAsDelivered('5')}
                            className="px-4 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition"
                        >
                            Marquer comme délivré
                        </button>

                        <button
                            onClick={() => markAsRead('4')}
                            className="px-4 py-3 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition"
                        >
                            Marquer message 4 lu
                        </button>
                    </div>
                </div>

                {/* Légende des statuts */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Légende des Statuts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <MessageStatus isSent={true} />
                            <div>
                                <p className="font-bold text-gray-900">Envoyé</p>
                                <p className="text-sm text-gray-600">Message envoyé au serveur</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <MessageStatus isSent={true} deliveredAt={new Date()} />
                            <div>
                                <p className="font-bold text-gray-900">Délivré</p>
                                <p className="text-sm text-gray-600">Message reçu par le destinataire</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <MessageStatus isSent={true} deliveredAt={new Date()} readAt={new Date()} />
                            <div>
                                <p className="font-bold text-gray-900">Lu</p>
                                <p className="text-sm text-gray-600">Message lu par le destinataire</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat simulé */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* En-tête de conversation */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                                A
                            </div>
                            <div>
                                <h3 className="font-bold">Amadou Diallo</h3>
                                <p className="text-xs text-white/80">En ligne</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-sm ${message.isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                    {/* Bulle de message */}
                                    <div className={`px-4 py-3 rounded-2xl ${message.isMine
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <p>{message.content}</p>
                                    </div>

                                    {/* Métadonnées */}
                                    <div className="flex items-center gap-2 px-2">
                                        <span className="text-xs text-gray-500">
                                            {message.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>

                                        {message.isMine && (
                                            <MessageStatus
                                                isSent={true}
                                                deliveredAt={message.deliveredAt}
                                                readAt={message.readAt}
                                                size="sm"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Indicateur typing */}
                        {showTyping && (
                            <div className="flex justify-start">
                                <TypingIndicator userName="Amadou" />
                            </div>
                        )}
                    </div>

                    {/* Zone de saisie */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Tapez votre message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition">
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-yellow-900 mb-3">💡 Comment ça marche</h3>
                    <div className="space-y-3 text-sm text-yellow-800">
                        <div>
                            <p className="font-bold">Accusés de Lecture :</p>
                            <ul className="ml-4 mt-1 list-disc">
                                <li><strong>✓ (gris)</strong> : Message envoyé</li>
                                <li><strong>✓✓ (gris)</strong> : Message délivré</li>
                                <li><strong>✓✓ (bleu)</strong> : Message lu</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold">Indicateur "Typing" :</p>
                            <p className="ml-4 mt-1">Animation avec 3 points qui rebondissent quand l'autre personne écrit</p>
                        </div>

                        <div>
                            <p className="font-bold">Utilisation :</p>
                            <ul className="ml-4 mt-1 list-disc">
                                <li>Cliquez sur les boutons au-dessus pour tester les différents états</li>
                                <li>Les timestamps sont affichés en tooltip (survol)</li>
                                <li>L'indicateur "typing" s'affiche automatiquement quand quelqu'un écrit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

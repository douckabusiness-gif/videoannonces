'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getIO } from '@/lib/socket';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import VoiceRecorder from '@/components/messages/VoiceRecorder';
import AudioPlayer from '@/components/messages/AudioPlayer';
import MessageStatus from '@/components/messages/MessageStatus';
import TypingIndicator from '@/components/messages/TypingIndicator';

import { useTranslation } from '@/contexts/I18nContext';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    read: boolean;
    type: string;
    mediaUrl?: string;
    sender: {
        name: string;
        avatar: string | null;
    };
    // Nouveaux champs pour messages vocaux et accusés de lecture
    audioDuration?: number;
    fileSize?: number;
    deliveredAt?: string | null;
    readAt?: string | null;
}

interface ChatWindowProps {
    conversationId: string;
    onBack: () => void;
}

export default function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
    const { data: session } = useSession();
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);

    // New features state
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<any>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Init Socket & Load Messages
    useEffect(() => {
        if (!session?.user) return;

        setLoading(true);
        fetchMessages();

        // Socket connection
        try {
            const socket = getIO();
            socketRef.current = socket;

            socket.emit('join-conversation', conversationId);

            socket.on('new-message', (message: Message) => {
                if (message.senderId !== session.user.id) { // Avoid duplicate if we optimistically added it
                    setMessages(prev => [...prev, message]);
                    // Mark as read immediately if window is open
                    socket.emit('mark-read', { conversationId, userId: session.user.id });
                }
            });

            socket.on('user-typing', (data: { userName: string }) => {
                setTypingUser(data.userName);
            });

            socket.on('user-stop-typing', () => {
                setTypingUser(null);
            });

            // Mark messages as read on enter
            socket.emit('mark-read', { conversationId, userId: session.user.id });

            return () => {
                socket.emit('leave-conversation', conversationId);
                socket.off('new-message');
                socket.off('user-typing');
                socket.off('user-stop-typing');
            };
        } catch (err) {
            console.error('Socket error:', err);
        } finally {
            setLoading(false);
        }
    }, [conversationId, session]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Erreur chargement messages:', error);
        }
    };

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !session?.user) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'image');

            const res = await fetch('/api/upload/chat', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const { url } = await res.json();
                if (socketRef.current) {
                    socketRef.current.emit('send-message', {
                        conversationId,
                        senderId: session.user.id,
                        content: t('messages.window.imageSent'),
                        type: 'image',
                        mediaUrl: url
                    });
                }
            }
        } catch (error) {
            console.error('Erreur upload image:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Voice Recording avec VoiceRecorder component
    const handleVoiceRecordingComplete = async (blob: Blob, duration: number) => {
        if (!session?.user) return;

        try {
            const formData = new FormData();
            formData.append('audio', blob, 'voice.webm');

            const res = await fetch('/api/upload/voice-message', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const { url, fileSize } = await res.json();
                if (socketRef.current) {
                    socketRef.current.emit('send-message', {
                        conversationId,
                        senderId: session.user.id,
                        content: t('messages.window.audioSent'),
                        type: 'audio',
                        mediaUrl: url,
                        audioDuration: duration,
                        fileSize: fileSize
                    });
                }
            }
        } catch (error) {
            console.error('Erreur envoi vocal:', error);
        } finally {
            setShowVoiceRecorder(false);
        }
    };

    // Handle Location
    const handleLocationShare = () => {
        if (!navigator.geolocation || !session?.user) {
            alert(t('messages.window.geoError'));
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

            if (socketRef.current) {
                socketRef.current.emit('send-message', {
                    conversationId,
                    senderId: session.user.id,
                    content: t('messages.window.locationSent'),
                    type: 'location',
                    mediaUrl: mapUrl
                });
            }
        }, (error) => {
            console.error('Erreur géolocalisation:', error);
            alert(t('messages.window.geoRetrieveError'));
        });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !session?.user) return;

        const content = newMessage.trim();
        setNewMessage('');

        // Optimistic update
        const tempMessage: Message = {
            id: Date.now().toString(),
            content,
            senderId: session.user.id,
            createdAt: new Date().toISOString(),
            read: false,
            type: 'text',
            sender: {
                name: session.user.name || t('messages.window.me'),
                avatar: session.user.image || null,
            }
        };
        setMessages(prev => [...prev, tempMessage]);

        // Send via Socket
        if (socketRef.current) {
            socketRef.current.emit('send-message', {
                conversationId,
                senderId: session.user.id,
                content,
                type: 'text'
            });
            socketRef.current.emit('stop-typing', { conversationId, userId: session.user.id });
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (socketRef.current && session?.user) {
            if (!isTyping) {
                setIsTyping(true);
                socketRef.current.emit('typing', {
                    conversationId,
                    userId: session.user.id,
                    userName: session.user.name
                });
            }

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                socketRef.current.emit('stop-typing', { conversationId, userId: session.user.id });
            }, 2000);
        }
    };

    const renderMessageContent = (msg: Message) => {
        switch (msg.type) {
            case 'image':
                return (
                    <div className="space-y-2">
                        {msg.mediaUrl && (
                            <img
                                src={msg.mediaUrl}
                                alt={t('messages.window.sharedImage')}
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition"
                                onClick={() => window.open(msg.mediaUrl, '_blank')}
                            />
                        )}
                        <p className="text-sm opacity-75">{msg.content}</p>
                    </div>
                );
            case 'audio':
                return msg.mediaUrl ? (
                    <AudioPlayer
                        audioUrl={msg.mediaUrl}
                        duration={msg.audioDuration}
                        senderName={msg.sender.name}
                    />
                ) : null;
            case 'location':
                return (
                    <a
                        href={msg.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:underline"
                    >
                        <span className="text-2xl">📍</span>
                        <span>{t('messages.window.viewMap')}</span>
                    </a>
                );
            default:
                return <p className="text-sm md:text-base">{msg.content}</p>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-4 bg-white shadow-sm z-10">
                <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h3 className="font-bold text-gray-900">{t('messages.window.header')}</h3>
                    {typingUser && (
                        <div className="-mb-1">
                            <TypingIndicator userName={typingUser} />
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === session?.user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                    {/* Render content based on type */}
                                    {renderMessageContent(msg)}

                                    <div className="flex items-center justify-end gap-2 mt-1">
                                        <p className={`text-[10px] ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                        </p>
                                        {isMe && (
                                            <MessageStatus
                                                isSent={true}
                                                deliveredAt={msg.deliveredAt ? new Date(msg.deliveredAt) : null}
                                                readAt={msg.readAt ? new Date(msg.readAt) : null}
                                                size="sm"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-2 md:p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                    {/* Image Upload Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition"
                        title={t('messages.window.sendImage')}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Voice Message Button */}
                    <button
                        type="button"
                        onClick={() => setShowVoiceRecorder(true)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                        title={t('messages.window.recordAudio')}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>

                    {/* Location Button */}
                    <button
                        type="button"
                        onClick={handleLocationShare}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition"
                        title={t('messages.window.shareLocation')}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder={t('messages.window.inputPlaceholder')}
                        className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-orange-500/30"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Modal VoiceRecorder */}
            {showVoiceRecorder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <VoiceRecorder
                        onRecordingComplete={handleVoiceRecordingComplete}
                        onCancel={() => setShowVoiceRecorder(false)}
                    />
                </div>
            )}
        </div>
    );
}

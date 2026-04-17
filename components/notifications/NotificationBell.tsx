'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import Link from 'next/link';

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    icon?: string;
    url?: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const { data: session } = useSession();
    const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!session) return;
        fetchNotifications();

        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [session]);

    useEffect(() => {
        // Fermer dropdown si clic extérieur
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/notifications?limit=20');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            fetchNotifications();
        } catch (error) {
            console.error('Erreur marquage:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications', { method: 'POST' });
            fetchNotifications();
        } catch (error) {
            console.error('Erreur marquage tout:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'MESSAGE':
                return '💬';
            case 'LIVE_STARTED':
                return '🎥';
            case 'SALE':
                return '💰';
            case 'ORDER':
                return '📦';
            case 'REVIEW':
                return '⭐';
            default:
                return '🔔';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes}min`;
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${days}j`;
    };

    if (!session) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Notifications"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Tout marquer lu
                                </button>
                            )}
                        </div>

                        {/* Bouton activer/désactiver */}
                        {isSupported && (
                            <button
                                onClick={isSubscribed ? unsubscribe : subscribe}
                                disabled={isLoading}
                                className={`w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSubscribed
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-orange-600 text-white hover:bg-orange-700'
                                    } disabled:opacity-50`}
                            >
                                {isLoading ? (
                                    'Chargement...'
                                ) : isSubscribed ? (
                                    '🔕 Désactiver les notifications'
                                ) : (
                                    '🔔 Activer les notifications'
                                )}
                            </button>
                        )}
                    </div>

                    {/* Liste */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">🔔</div>
                                <p className="text-gray-500 font-medium">Aucune notification</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Vous serez notifié ici
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        if (notif.url) {
                                            window.location.href = notif.url;
                                        }
                                    }}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-orange-50 border-l-4 border-l-orange-600' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icône */}
                                        <div className="flex-shrink-0">
                                            {notif.icon ? (
                                                <img
                                                    src={notif.icon}
                                                    alt=""
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                                                    {getNotificationIcon(notif.type)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {notif.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notif.body}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTime(notif.createdAt)}
                                            </p>
                                        </div>

                                        {/* Badge non lu */}
                                        {!notif.read && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t bg-gray-50 text-center">
                            <Link
                                href="/dashboard/notifications"
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Voir toutes les notifications →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

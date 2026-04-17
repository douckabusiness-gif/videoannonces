'use client';

import { useState } from 'react';

interface BadgeDisplayProps {
    icon: string;
    name: string;
    description: string;
    color: string;
    earned?: boolean;
    earnedAt?: Date;
}

export function BadgeCard({ icon, name, description, color, earned = false, earnedAt }: BadgeDisplayProps) {
    return (
        <div className={`relative p-6 rounded-2xl border-2 transition-all ${earned
                ? 'bg-white border-green-500 shadow-lg'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}>
            {earned && (
                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Obtenu
                    </span>
                </div>
            )}

            <div className="flex items-start gap-4">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                    style={{ backgroundColor: earned ? color : '#E5E7EB' }}
                >
                    {icon}
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{description}</p>

                    {earned && earnedAt && (
                        <p className="text-xs text-green-600 font-medium">
                            🎉 Obtenu le {new Date(earnedAt).toLocaleDateString('fr-FR')}
                        </p>
                    )}

                    {!earned && (
                        <p className="text-xs text-gray-500 italic">
                            Continuez vos efforts pour débloquer ce badge !
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export function BadgeCheckButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const checkBadges = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/badges/check');
            const data = await response.json();

            if (data.success) {
                if (data.count > 0) {
                    setMessage(`🎉 Félicitations ! Vous avez obtenu ${data.count} nouveau(x) badge(s) !`);
                    // Recharger la page après 2 secondes
                    setTimeout(() => window.location.reload(), 2000);
                } else {
                    setMessage('✅ Vos badges sont à jour !');
                }
            }
        } catch (error) {
            setMessage('❌ Erreur lors de la vérification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <button
                onClick={checkBadges}
                disabled={loading}
                className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all ${loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 shadow-lg'
                    }`}
            >
                {loading ? '🔄 Vérification...' : '🔍 Vérifier mes badges'}
            </button>

            {message && (
                <div className={`p-4 rounded-xl text-center font-medium ${message.includes('❌')
                        ? 'bg-red-50 text-red-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PaymentMessage {
    id: string;
    message: string;
    active: boolean;
    bgColor: string;
    textColor: string;
}

export default function PaymentMessagePage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [message, setMessage] = useState('');
    const [active, setActive] = useState(true);
    const [bgColor, setBgColor] = useState('#FF6B35');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (session?.user?.role !== 'ADMIN') {
            router.push('/');
        } else {
            fetchMessage();
        }
    }, [status, session, router]);

    const fetchMessage = async () => {
        try {
            const res = await fetch('/api/admin/payment-message');
            if (res.ok) {
                const data = await res.json();
                if (data.message) {
                    setMessage(data.message.message);
                    setActive(data.message.active);
                    setBgColor(data.message.bgColor);
                    setTextColor(data.message.textColor);
                }
            }
        } catch (error) {
            console.error('Error fetching message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!message.trim()) {
            setError('Le message ne peut pas être vide');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/payment-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, active, bgColor, textColor })
            });

            if (res.ok) {
                setSuccess('Message enregistré avec succès !');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Error saving message:', error);
            setError('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        💳 Message de Paiement
                    </h1>
                    <p className="text-gray-600">
                        Configurez un message personnalisé qui s'affichera sur la page de checkout
                    </p>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="space-y-6">
                        {/* Message Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900"
                                rows={4}
                                placeholder="Ex: 🎉 Promotion spéciale ! Contactez le +225 07 09 19 43 18 pour finaliser votre paiement."
                            />
                            <p className="text-sm text-gray-500 mt-2">{message.length} caractères</p>
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Couleur de fond
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900 font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Couleur du texte
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900 font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <h3 className="font-bold text-gray-900">Activer le message</h3>
                                <p className="text-sm text-gray-600">Le message sera affiché sur la page de checkout</p>
                            </div>
                            <button
                                onClick={() => setActive(!active)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${active ? 'bg-orange-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${active ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                {message && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">👁️ Aperçu</h3>
                        <div
                            className="p-6 rounded-xl shadow-lg"
                            style={{ backgroundColor: bgColor, color: textColor }}
                        >
                            <p className="text-center font-semibold">{message}</p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving || !message.trim()}
                    className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-xl transition-all ${saving || !message.trim()
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl'
                        }`}
                >
                    {saving ? '💾 Enregistrement...' : '💾 Enregistrer le message'}
                </button>
            </div>
        </div>
    );
}

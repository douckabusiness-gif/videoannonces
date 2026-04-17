'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/admin/Toast';

export default function EmailConfigPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; text: string } | null>(null);
    const [testEmail, setTestEmail] = useState('');

    const [config, setConfig] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: '',
        isActive: false,
        welcomeTemplate: '',
        verificationTemplate: '',
        resetPasswordTemplate: '',
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchConfig();
        }
    }, [status, router]);

    const fetchConfig = async () => {
        try {
            const response = await fetch('/api/admin/settings/email');
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setConfig({ ...config, ...data, smtpPassword: '' });
                }
            }
        } catch (error) {
            console.error('Erreur chargement config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/settings/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (response.ok) {
                setMessage({ type: 'success', title: 'Sauvegardé !', text: 'Configuration email enregistrée avec succès' });
            } else {
                setMessage({ type: 'error', title: 'Erreur', text: 'Erreur lors de la sauvegarde' });
            }
        } catch (error) {
            setMessage({ type: 'error', title: 'Erreur', text: 'Erreur serveur' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!testEmail) {
            setMessage({ type: 'warning', title: 'Attention', text: 'Veuillez entrer un email de test' });
            return;
        }

        setTesting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/settings/email', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', title: 'Test réussi !', text: data.message });
            } else {
                setMessage({ type: 'error', title: 'Test échoué', text: data.error || 'Échec du test' });
            }
        } catch (error) {
            setMessage({ type: 'error', title: 'Erreur', text: 'Erreur serveur' });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                    <span>📧</span>
                    Configuration Email
                </h1>
                <p className="text-blue-100">Configurez le serveur SMTP pour l'envoi d'emails automatiques</p>
            </div>

            {/* Toast Notifications */}
            {message && (
                <Toast
                    type={message.type}
                    title={message.title}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Configuration SMTP */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>🌐</span>
                        Serveur SMTP
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Hôte SMTP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.smtpHost}
                                    onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                                    placeholder="smtp.gmail.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Port <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={config.smtpPort}
                                    onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">587 ou 465</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Utilisateur SMTP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={config.smtpUser}
                                    onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                                    placeholder="votre@email.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Mot de passe SMTP
                                </label>
                                <input
                                    type="password"
                                    value={config.smtpPassword}
                                    onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver l'actuel</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expéditeur */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>👤</span>
                        Informations d'expéditeur
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email d'expédit ion <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={config.fromEmail}
                                onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                                placeholder="noreply@videoannonces-ci.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Nom d'expéditeur <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={config.fromName}
                                onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                                placeholder="VideoAnnonces-CI"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Activation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={config.isActive}
                            onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer">
                            ✅ Activer l'envoi d'emails automatiques
                        </label>
                    </div>
                </div>

                {/* Test */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🧪</span>
                        Tester la configuration
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Envoyez un email de test pour vérifier que tout fonctionne correctement</p>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="email@test.com"
                            className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        <button
                            type="button"
                            onClick={handleTest}
                            disabled={testing}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-bold shadow-lg transition-all flex items-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Envoi...
                                </>
                            ) : (
                                <>
                                    📨 Envoyer test
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Boutons Actions */}
                <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <button
                        type="button"
                        onClick={() => router.push('/admin')}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 transition-all font-semibold"
                    >
                        ← Retour
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                💾 Sauvegarder
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

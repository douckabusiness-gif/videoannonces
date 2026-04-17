'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/I18nContext';

export default function SettingsPage() {
    const { t } = useTranslation();
    const { data: session, update } = useSession();
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: session?.user?.whatsappNumber || '',
        bio: session?.user?.bio || '',
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Toujours récupérer les données fraîches depuis la base de données
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/users/profile', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.whatsappNumber || '',
                        bio: data.bio || '',
                    });
                }
            } catch (err) {
                console.error("Erreur de chargement du profil", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    whatsappNumber: formData.phone,
                    bio: formData.bio,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erreur lors de la sauvegarde');
            }
            // Force fetch user data from database by triggering update
            await update();

            alert(t('settings.saved'));
        } catch (error: any) {
            console.error('Erreur:', error);
            alert(error.message || 'Une erreur est survenue.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl pb-10">
            {/* Header with Glassmorphism Effect */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-8 border border-white/10 backdrop-blur-xl">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                        {t('settings.header.title')}
                    </h1>
                    <p className="text-purple-100/70 text-lg">
                        {t('settings.header.subtitle')}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & General */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profil Section */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group/avatar">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 p-1 shadow-xl">
                                    <div className="w-full h-full rounded-[14px] bg-gray-900 flex items-center justify-center overflow-hidden">
                                        {session?.user?.image || session?.user?.avatar ? (
                                            <img src={(session.user.image || session.user.avatar) as string} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-bold text-white tracking-widest">
                                                {session?.user?.name?.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white text-gray-900 rounded-lg shadow-lg hover:scale-110 transition cursor-pointer">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">{t('settings.profile.title')}</h2>
                                <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('settings.profile.name')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all hover:bg-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('settings.profile.email')}</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all hover:bg-white/10"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('settings.profile.phone')}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all hover:bg-white/10"
                                    placeholder="0709194318"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t('settings.profile.bio')}</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all hover:bg-white/10 resize-none"
                                    placeholder={t('settings.profile.bioPlaceholder')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Notifications & Save */}
                <div className="space-y-8 flex flex-col h-full">
                    {/* Notifications Section */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <span className="text-2xl">🔔</span> {t('settings.notifications.title')}
                        </h2>

                        <div className="space-y-4">
                            {[
                                { label: t('settings.notifications.messages'), id: 'messages', icon: '💬' },
                                { label: t('settings.notifications.views'), id: 'views', icon: '👁️' },
                                { label: t('settings.notifications.expired'), id: 'expired', icon: '⌛' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final Save Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full relative group mt-auto"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                        <div className={`relative w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-lg transition shadow-xl flex items-center justify-center gap-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}>
                            {isSaving ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>💾</span>
                                    {t('settings.save')}
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
}

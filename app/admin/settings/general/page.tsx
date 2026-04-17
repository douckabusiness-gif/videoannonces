'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/admin/Toast';
import DragDropUpload from '@/components/admin/DragDropUpload';
import LivePreview from '@/components/admin/LivePreview';

type TabId = 'general' | 'appearance' | 'contact' | 'social' | 'advanced';

export default function GeneralSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; title: string; text: string } | null>(null);
    const [platform, setPlatform] = useState<{
        publicRegistrationEnabled: boolean;
        signupDefaultVendor: boolean;
    }>({
        publicRegistrationEnabled: true,
        signupDefaultVendor: true,
    });
    const [platformSaving, setPlatformSaving] = useState(false);
    const [platformLoadState, setPlatformLoadState] = useState<'idle' | 'loading' | 'error'>('idle');

    const [settings, setSettings] = useState({
        siteName: '',
        siteSlogan: '',
        siteDescription: '',
        heroTitle: '',
        heroSubtitle: '',
        urgentSectionTitle: '',
        recentSectionTitle: '',
        shopsSectionTitle: '',
        logo: '',
        favicon: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        socialFacebook: '',
        socialTwitter: '',
        socialInstagram: '',
        socialLinkedIn: '',
        socialYouTube: '',
        socialTikTok: '',
        maintenanceMode: false,
        maintenanceMessage: '',
    });

    const tabs = [
        { id: 'general' as TabId, label: 'Général', icon: '⚙️' },
        { id: 'appearance' as TabId, label: 'Apparence', icon: '🎨' },
        { id: 'contact' as TabId, label: 'Contact', icon: '📧' },
        { id: 'social' as TabId, label: 'Réseaux Sociaux', icon: '🌐' },
        { id: 'advanced' as TabId, label: 'Avancé', icon: '🔧' }
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchSettings();
            fetchPlatform();
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'authenticated') return;
        if (activeTab === 'advanced') {
            fetchPlatform();
        }
    }, [activeTab, status]);

    const fetchPlatform = async () => {
        setPlatformLoadState('loading');
        try {
            const r = await fetch('/api/admin/platform', {
                credentials: 'same-origin',
                cache: 'no-store',
            });
            const data = await r.json().catch(() => null);
            if (r.ok && data && typeof data.publicRegistrationEnabled === 'boolean') {
                setPlatform({
                    publicRegistrationEnabled: data.publicRegistrationEnabled,
                    signupDefaultVendor: Boolean(data.signupDefaultVendor),
                });
                setPlatformLoadState('idle');
                return;
            }
            setPlatformLoadState('error');
            if (data?.error) {
                setMessage({
                    type: 'warning',
                    title: 'Réglages inscription / vendeurs',
                    text: String(data.error),
                });
            }
        } catch {
            setPlatformLoadState('error');
        }
    };

    const patchPlatform = async (partial: {
        publicRegistrationEnabled?: boolean;
        signupDefaultVendor?: boolean;
    }) => {
        setPlatformSaving(true);
        try {
            const res = await fetch('/api/admin/platform', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partial),
                credentials: 'same-origin',
            });
            if (res.ok) {
                const data = await res.json();
                setPlatform(data);
                setMessage({
                    type: 'success',
                    title: 'Enregistré',
                    text: 'Réglages inscription et comptes vendeurs mis à jour.',
                });
            } else {
                setMessage({
                    type: 'error',
                    title: 'Erreur',
                    text: 'Impossible de mettre à jour ces réglages.',
                });
            }
        } catch {
            setMessage({ type: 'error', title: 'Erreur', text: 'Erreur réseau ou serveur.' });
        } finally {
            setPlatformSaving(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings/site');
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Erreur chargement paramètres:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (file: File, type: 'logo' | 'favicon') => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/banner', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            if (type === 'logo') {
                setSettings({ ...settings, logo: data.url });
                setMessage({ type: 'success', title: 'Succès !', text: 'Logo téléchargé avec succès' });
            } else {
                setSettings({ ...settings, favicon: data.url });
                setMessage({ type: 'success', title: 'Succès !', text: 'Favicon téléchargé avec succès' });
            }
        } else {
            throw new Error('Upload échoué');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/settings/site', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setMessage({ type: 'success', title: 'Sauvegardé !', text: 'Paramètres enregistrés avec succès' });
            } else {
                setMessage({ type: 'error', title: 'Erreur', text: 'Erreur lors de la sauvegarde' });
            }
        } catch (error) {
            setMessage({ type: 'error', title: 'Erreur', text: 'Erreur serveur' });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm('Voulez-vous vraiment réinitialiser tous les paramètres ?')) return;

        try {
            await fetchSettings();
            setMessage({ type: 'info', title: 'Réinitialisé', text: 'Paramètres rechargés depuis la base de données' });
        } catch (error) {
            setMessage({ type: 'error', title: 'Erreur', text: 'Impossible de réinitialiser' });
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
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 mb-8">
                <h1 className="text-4xl font-black text-white mb-2">Paramètres Généraux</h1>
                <p className="text-orange-100">Configurez votre site VideoAnnonces-CI</p>
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

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-4 font-semibold transition-all border-b-2 flex items-center gap-2 ${activeTab === tab.id
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Onglet Général */}
                        {activeTab === 'general' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>⚙️</span>
                                    Informations de base
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Nom du site <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900"
                                            placeholder="VideoAnnonces-CI"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Slogan du site
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.siteSlogan || ''}
                                            onChange={(e) => setSettings({ ...settings, siteSlogan: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900"
                                            placeholder="Vos annonces en vidéo!"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Description (SEO)
                                        </label>
                                        <textarea
                                            value={settings.siteDescription || ''}
                                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900"
                                            placeholder="Description for SEO..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Apparence */}
                        {activeTab === 'appearance' && (
                            <>
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span>🎨</span>
                                        Logos & Images
                                    </h2>

                                    <div className="space-y- 6">
                                        <DragDropUpload
                                            onUpload={(file) => handleLogoUpload(file, 'logo')}
                                            currentImage={settings.logo}
                                            label="Logo du site"
                                            accept="image/*"
                                            maxSize={5}
                                            onRemove={() => setSettings({ ...settings, logo: '' })}
                                        />

                                        <DragDropUpload
                                            onUpload={(file) => handleLogoUpload(file, 'favicon')}
                                            currentImage={settings.favicon}
                                            label="Favicon (icône du site)"
                                            accept="image/*"
                                            maxSize={1}
                                            onRemove={() => setSettings({ ...settings, favicon: '' })}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span>📝</span>
                                        Textes de la page d'accueil
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Titre du héro
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.heroTitle || ''}
                                                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                placeholder="Ex: Trouvez tout ce que vous cherchez"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Sous-titre du héro
                                            </label>
                                            <textarea
                                                value={settings.heroSubtitle || ''}
                                                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                placeholder="Ex: Des milliers de produits disponibles..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Section Urgentes
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.urgentSectionTitle || ''}
                                                    onChange={(e) => setSettings({ ...settings, urgentSectionTitle: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                    placeholder="Annonces Urgentes"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Section Récentes
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.recentSectionTitle || ''}
                                                    onChange={(e) => setSettings({ ...settings, recentSectionTitle: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                    placeholder="Nouveautés"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Section Boutiques
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.shopsSectionTitle || ''}
                                                    onChange={(e) => setSettings({ ...settings, shopsSectionTitle: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                    placeholder="Boutiques Premium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Onglet Contact */}
                        {activeTab === 'contact' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>📧</span>
                                    Informations de contact
                                </h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Email de contact
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.contactEmail || ''}
                                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                placeholder="contact@videoannonces-ci.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.contactPhone || ''}
                                                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                                placeholder="+225 XX XX XX XX XX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Adresse
                                        </label>
                                        <textarea
                                            value={settings.address || ''}
                                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                            placeholder="Abidjan, Côte d'Ivoire"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Réseaux Sociaux */}
                        {activeTab === 'social' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>🌐</span>
                                    Réseaux sociaux
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span className="text-blue-600">📘</span> Facebook
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialFacebook || ''}
                                            onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                                            placeholder="https://facebook.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span className="text-sky-500">🐦</span> Twitter
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialTwitter || ''}
                                            onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                                            placeholder="https://twitter.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span className="text-pink-600">📷</span> Instagram
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialInstagram || ''}
                                            onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                                            placeholder="https://instagram.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span className="text-blue-700">💼</span> LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialLinkedIn || ''}
                                            onChange={(e) => setSettings({ ...settings, socialLinkedIn: e.target.value })}
                                            placeholder="https://linkedin.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span className="text-red-600">📺</span> YouTube
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialYouTube || ''}
                                            onChange={(e) => setSettings({ ...settings, socialYouTube: e.target.value })}
                                            placeholder="https://youtube.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <span>🎵</span> TikTok
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.socialTikTok || ''}
                                            onChange={(e) => setSettings({ ...settings, socialTikTok: e.target.value })}
                                            placeholder="https://tiktok.com/..."
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Onglet Avancé */}
                        {activeTab === 'advanced' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span>🔧</span>
                                    Paramètres avancés
                                </h2>

                                <div className="space-y-6">
                                    <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                                        <div className="flex items-center gap-3 mb-3">
                                            <input
                                                type="checkbox"
                                                id="maintenanceMode"
                                                checked={settings.maintenanceMode}
                                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                                className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                                            />
                                            <label htmlFor="maintenanceMode" className="text-sm font-bold text-gray-700 cursor-pointer">
                                                ⚠️ Activer le mode maintenance
                                            </label>
                                        </div>

                                        {settings.maintenanceMode && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Message de maintenance
                                                </label>
                                                <textarea
                                                    value={settings.maintenanceMessage || ''}
                                                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                                    rows={3}
                                                    placeholder="Le site est actuellement en maintenance..."
                                                    className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-8 mt-8 border-t-2 border-gray-200 space-y-4">
                                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                <span>👥</span>
                                                Inscription & comptes vendeurs
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Ces options s’appliquent à tout le site. Elles sont enregistrées tout de
                                                suite (pas besoin du bouton « Sauvegarder » en bas).
                                            </p>
                                            {platformLoadState === 'loading' && (
                                                <p className="text-sm text-orange-600 font-medium">
                                                    Chargement des réglages depuis le serveur…
                                                </p>
                                            )}
                                            {platformLoadState === 'error' && (
                                                <p className="text-sm text-red-600 font-medium">
                                                    Impossible de lire l’état exact (vérifiez que vous êtes bien
                                                    administrateur). Les boutons utilisent les valeurs par défaut jusqu’à
                                                    la prochaine réussite.
                                                </p>
                                            )}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="rounded-xl border-2 border-gray-100 bg-slate-50 p-4 space-y-3">
                                                    <p className="font-bold text-gray-900">① Inscription sur internet</p>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Autoriser ou fermer la page « Créer un compte » et le lien sur la
                                                        connexion.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                platformSaving ||
                                                                platform.publicRegistrationEnabled
                                                            }
                                                            onClick={() =>
                                                                patchPlatform({ publicRegistrationEnabled: true })
                                                            }
                                                            className="px-3 py-2 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40"
                                                        >
                                                            Autoriser
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                platformSaving ||
                                                                !platform.publicRegistrationEnabled
                                                            }
                                                            onClick={() =>
                                                                patchPlatform({ publicRegistrationEnabled: false })
                                                            }
                                                            className="px-3 py-2 rounded-lg text-sm font-bold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40"
                                                        >
                                                            Fermer
                                                        </button>
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        État :{' '}
                                                        <span
                                                            className={
                                                                platform.publicRegistrationEnabled
                                                                    ? 'text-emerald-700'
                                                                    : 'text-rose-700'
                                                            }
                                                        >
                                                            {platform.publicRegistrationEnabled
                                                                ? 'ouvertes'
                                                                : 'fermées'}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="rounded-xl border-2 border-gray-100 bg-slate-50 p-4 space-y-3">
                                                    <p className="font-bold text-gray-900">② Nouveaux = vendeurs ?</p>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Si oui, chaque nouvel inscrit a le tableau de bord vendeur. Sinon
                                                        il arrive client (modifiable par utilisateur plus bas dans
                                                        Admin → Utilisateurs).
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={platformSaving || platform.signupDefaultVendor}
                                                            onClick={() => patchPlatform({ signupDefaultVendor: true })}
                                                            className="px-3 py-2 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40"
                                                        >
                                                            Oui, vendeurs
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={platformSaving || !platform.signupDefaultVendor}
                                                            onClick={() => patchPlatform({ signupDefaultVendor: false })}
                                                            className="px-3 py-2 rounded-lg text-sm font-bold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40"
                                                        >
                                                            Non, clients
                                                        </button>
                                                    </div>
                                                    <p className="text-xs font-semibold text-gray-500">
                                                        État :{' '}
                                                        <span
                                                            className={
                                                                platform.signupDefaultVendor
                                                                    ? 'text-emerald-700'
                                                                    : 'text-rose-700'
                                                            }
                                                        >
                                                            {platform.signupDefaultVendor
                                                                ? 'nouveaux = vendeur'
                                                                : 'nouveaux = client'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Preview Sidebar */}
                    <div className="lg:col-span-1">
                        <LivePreview settings={settings} />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => window.open('/', '_blank')}
                            className="px-4 py-2 border-2 border-gray-300 rounded-xl hover:border-orange-500 transition-all flex items-center gap-2 font-semibold text-gray-700"
                        >
                            👁️ Prévisualiser
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 font-semibold"
                        >
                            🔄 Réinitialiser
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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



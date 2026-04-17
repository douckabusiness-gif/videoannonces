'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AutomationTab from '@/components/dashboard/AutomationTab';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';

export default function ShopPage() {
    const { t } = useTranslation();
    const { data: session, update } = useSession();
    // Les admins ont accès à toutes les fonctionnalités sans abonnement premium
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    const isPremiumOrAdmin = isAdmin || !!session?.user?.premium;
    const [subdomain, setSubdomain] = useState('');
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState<string | null>(null);

    // Configuration boutique
    const [shopTheme, setShopTheme] = useState('default');
    const [bio, setBio] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [previewBannerUrl, setPreviewBannerUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [aboutSection, setAboutSection] = useState('');
    const [shopLayout, setShopLayout] = useState('mobile-first');

    // Réseaux sociaux
    const [facebookPage, setFacebookPage] = useState('');
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');
    const [tiktok, setTiktok] = useState('');

    // Badges de confiance
    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

    // Phase 1 - Personnalisation
    const [primaryColor, setPrimaryColor] = useState('#FF5733');
    const [secondaryColor, setSecondaryColor] = useState('#C70039');
    const [logoUrl, setLogoUrl] = useState('');
    const [previewLogoUrl, setPreviewLogoUrl] = useState('');
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [previewBackgroundUrl, setPreviewBackgroundUrl] = useState('');
    const [businessHours, setBusinessHours] = useState({
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '', close: '', closed: true },
    });

    // Navigation par onglets
    const [activeTab, setActiveTab] = useState<'general' | 'design' | 'features' | 'social' | 'automation' | 'content'>('general');

    // Charger les données depuis la session
    useEffect(() => {
        if (session?.user) {
            const userData = session.user as any;

            setBio(userData.bio || '');
            setShopTheme(userData.shopTheme || 'default');
            setBannerUrl(userData.bannerUrl || '');
            setVideoUrl(userData.videoUrl || '');
            setWhatsappNumber(userData.whatsappNumber || '');
            setAboutSection(userData.aboutSection || '');
            setShopLayout(userData.shopLayout || 'mobile-first');

            // Charger les réseaux sociaux
            if (userData.socialLinks) {
                const social = typeof userData.socialLinks === 'object' ? userData.socialLinks : {};
                setFacebookPage(social.facebook || '');
                setInstagram(social.instagram || '');
                setYoutube(social.youtube || '');
                setTiktok(social.tiktok || '');
            }

            if (userData.trustBadges) {
                const badges = Array.isArray(userData.trustBadges) ? userData.trustBadges : [];
                setSelectedBadges(badges.map((b: any) => b.text));
            }

            // Phase 1 - Charger personnalisation
            if (userData.customColors) {
                const colors = typeof userData.customColors === 'object' ? userData.customColors as any : {};
                setPrimaryColor(colors.primary || '#FF5733');
                setSecondaryColor(colors.secondary || '#C70039');
            }
            setLogoUrl(userData.logoUrl || '');
            setBackgroundUrl(userData.backgroundUrl || '');
            if (userData.businessHours) {
                setBusinessHours(userData.businessHours as any);
            }
        }
    }, [session]);

    const checkAvailability = async () => {
        if (!subdomain || subdomain.length < 3) {
            setError('Le sous-domaine doit contenir au moins 3 caractères');
            return;
        }

        setChecking(true);
        setError('');
        setAvailable(null);

        try {
            const response = await fetch('/api/shop/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subdomain }),
            });

            const data = await response.json();

            if (data.available) {
                setAvailable(true);
            } else {
                setAvailable(false);
                setError(data.error || 'Sous-domaine non disponible');
            }
        } catch (err) {
            setError(t('shop.checkError'));
        } finally {
            setChecking(false);
        }
    };

    const claimSubdomain = async () => {
        try {
            const response = await fetch('/api/shop/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subdomain }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Sous-domaine réservé ! Votre boutique est accessible sur ${data.shopUrl}`);
                await update();
                window.location.reload();
            } else {
                setError(data.error || t('shop.claimError'));
            }
        } catch (err) {
            setError(t('shop.claimError'));
        }
    };

    const saveCustomization = async () => {
        setSaving(true);

        const trustBadges = selectedBadges.map(text => ({
            icon: getIconForBadge(text),
            text
        }));

        const socialLinks = {
            facebook: facebookPage,
            instagram,
            youtube,
            tiktok,
        };

        const customColors = {
            primary: primaryColor,
            secondary: secondaryColor,
        };

        try {
            const response = await fetch('/api/shop/customize', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopTheme,
                    bio,
                    bannerUrl,
                    videoUrl,
                    whatsappNumber,
                    aboutSection,
                    trustBadges,
                    socialLinks,
                    // Phase 1
                    customColors,
                    logoUrl,
                    backgroundUrl,
                    businessHours,
                    shopLayout,
                }),
            });

            const data = await response.json();
            console.log('Response:', response.status, data);

            if (response.ok) {
                // Nettoyer les previews locales après succès
                setPreviewBannerUrl('');
                setPreviewLogoUrl('');
                setPreviewBackgroundUrl('');

                alert(`✅ ${t('shop.successUpdate')}`);
                // Mettre à jour la session avec les nouvelles données
                await update({
                    shopTheme,
                    bio,
                    bannerUrl,
                    videoUrl,
                    whatsappNumber,
                    aboutSection,
                    trustBadges,
                    socialLinks,
                    customColors,
                    logoUrl,
                    backgroundUrl,
                    businessHours,
                    shopLayout,
                });
            } else {
                alert(`❌ ${t('shop.errorUpdate')}: ${data.error || 'Erreur inconnue'}`);
                console.error('Erreur API:', data);
            }
        } catch (err) {
            console.error('Erreur catch:', err);
            alert(`❌ ${t('shop.errorUpdate')}: ${err}`);
        } finally {
            setSaving(false);
        }
    };

    // Composant bouton enregistrer réutilisable
    const SaveSectionButton = () => (
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <button
                onClick={saveCustomization}
                disabled={saving}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg shadow-xl hover:shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
            >
                {saving ? (
                    <>
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        {t('shop.saveChanges')}...
                    </>
                ) : (
                    <>
                        <span className="text-xl">💾</span> {t('shop.saveChanges')}
                    </>
                )}
            </button>
        </div>
    );

    const getIconForBadge = (text: string) => {
        const icons: Record<string, string> = {
            'Livraison Rapide': '🚀',
            'Paiement Sécurisé': '🔒',
            '100% Satisfait ou Remboursé': '✅',
            'Support 24/7': '💬',
            'Produits Authentiques': '🛡️',
            'Vendeur Vérifié': '✓',
        };
        return icons[text] || '⭐';
    };

    const themes = [
        { id: 'default', name: 'Défaut', color: 'from-orange-500 to-orange-600', preview: '🧡' },
        { id: 'dark', name: 'Sombre', color: 'from-gray-800 to-gray-900', preview: '🖤' },
        { id: 'minimal', name: 'Minimaliste', color: 'from-gray-100 to-gray-200', preview: '🤍' },
        { id: 'vibrant', name: 'Vibrant', color: 'from-purple-500 to-pink-600', preview: '💜' },
    ];

    const availableBadges = [
        'Livraison Rapide',
        'Paiement Sécurisé',
        '100% Satisfait ou Remboursé',
        'Support 24/7',
        'Produits Authentiques',
        'Vendeur Vérifié',
    ];

    // Composant de verrouillage Premium
    const PremiumLock = ({ title, description }: { title: string, description: string }) => (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 text-center shadow-inner">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">{description}</p>
            <Link
                href="/dashboard/subscription"
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
            >
                Passer Premium 🚀
            </Link>
        </div>
    );

    const getBadgeLabel = (badge: string) => {
        const map: Record<string, string> = {
            'Livraison Rapide': t('badges.fastDelivery'),
            'Paiement Sécurisé': t('badges.securePayment'),
            '100% Satisfait ou Remboursé': t('badges.moneyBack'),
            'Support 24/7': t('badges.support'),
            'Produits Authentiques': t('badges.authentic'),
            'Vendeur Vérifié': t('badges.verified'),
        };
        return map[badge] || badge;
    };

    const toggleBadge = (badge: string) => {
        setSelectedBadges(prev =>
            prev.includes(badge)
                ? prev.filter(b => b !== badge)
                : [...prev, badge]
        );
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 md:mb-2">🏪 {t('shop.title') || 'Ma Boutique'}</h1>
                <p className="text-sm md:text-base text-gray-600">{t('shop.subtitle')}</p>
            </div>





            {/* Barre d'onglets */}
            <div className="bg-white rounded-2xl p-2 shadow-lg mb-6 sticky top-4 z-40">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'general'
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">🏠</span>
                            <span className="hidden sm:inline">{t('shop.tabs.general')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'design'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">🎨</span>
                            <span className="hidden sm:inline">{t('shop.tabs.design')}</span>
                            {!session?.user?.premium && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('features')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'features'
                            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">✨</span>
                            <span className="hidden sm:inline">{t('shop.tabs.features')}</span>
                            {!session?.user?.premium && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('social')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'social'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">📱</span>
                            <span className="hidden sm:inline">{t('shop.tabs.social')}</span>
                            {!session?.user?.premium && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('automation')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'automation'
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span className="hidden sm:inline">Automatisation</span>
                            {!session?.user?.premium && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-bold transition-all duration-200 ${activeTab === 'content'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-xl">📄</span>
                            <span className="hidden sm:inline">{t('shop.tabs.content')}</span>
                            {!session?.user?.premium && <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-1">🔒</span>}
                        </div>
                    </button>
                </div>
            </div>

            {/* Conteneur des sections avec affichage conditionnel */}
            <div className="space-y-6">

                {/* ONGLET GÉNÉRAL */}
                {activeTab === 'general' && (
                    <>
                        {!isPremiumOrAdmin ? (
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white shadow-lg">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="text-5xl">🔒</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">Fonctionnalité Premium</h3>
                                            <p className="text-orange-50 mb-4">
                                                La création de sous-domaine personnalisé (ex: <strong>monshop.videoboutique.ci</strong>) est réservée aux membres Premium.
                                            </p>
                                            <Link
                                                href="/dashboard/subscription"
                                                className="inline-block bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition shadow-md"
                                            >
                                                Passer Premium 🚀
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                !session?.user?.subdomain ? (
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl">🏪</span>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">{t('shop.createSubdomain')}</h2>
                                                <p className="text-sm text-gray-600">{t('shop.subdomainDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {t('shop.yourSubdomain')}
                                                </label>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        type="text"
                                                        value={subdomain}
                                                        onChange={(e) => {
                                                            setSubdomain(e.target.value.toLowerCase());
                                                            setAvailable(null);
                                                            setError('');
                                                        }}
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                        placeholder="monshop"
                                                    />
                                                    <button
                                                        onClick={checkAvailability}
                                                        disabled={checking}
                                                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:opacity-50 shadow-lg"
                                                    >
                                                        {checking ? t('shop.verifying') : t('shop.verify')}
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    {t('shop.accessibleAt')}{' '}
                                                    <strong className="text-orange-600">{subdomain || 'monshop'}.localhost:3000</strong>
                                                </p>

                                                {available === true && (
                                                    <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-xl">
                                                        <p className="text-green-600 font-bold mb-3">
                                                            ✅ {t('shop.available')}
                                                        </p>
                                                        <button
                                                            onClick={claimSubdomain}
                                                            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-bold shadow-lg"
                                                        >
                                                            {t('shop.claim')}
                                                        </button>
                                                    </div>
                                                )}

                                                {error && (
                                                    <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                                                        <p className="text-red-600 font-bold">❌ {error}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Info sous-domaine */}
                                        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl">✅</span>
                                                <div>
                                                    <h3 className="text-lg font-bold text-green-900">{t('shop.online')}</h3>
                                                    <p className="text-sm text-green-700">
                                                        {t('shop.accessibleAt')}{' '}
                                                        <a
                                                            href={`http://${session?.user?.subdomain}.localhost:3000`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-bold underline hover:text-green-900"
                                                        >
                                                            {session?.user?.subdomain}.localhost:3000
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                                            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 {t('shop.bio')}</h2>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                                rows={3}
                                                placeholder={t('shop.bioPlaceholder')}
                                                maxLength={200}
                                            />
                                            <p className="text-sm text-gray-500 mt-2">{bio.length} / 200 caractères</p>
                                        </div>

                                        <SaveSectionButton />
                                    </div>
                                )
                            )}
                        </>
                )}


                {/* ONGLET DESIGN */}
                {activeTab === 'design' && (
                    <>
                        {!isPremiumOrAdmin ? (
                            <PremiumLock
                                title="Personnalisation Avancée"
                                description="Débloquez la personnalisation complète de votre boutique : Couleurs, Logo, Bannières et Mise en page."
                            />
                        ) : (
                            <div className="space-y-6">
                                {/* Accès Rapide Apparence Avancée */}
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">✨</div>
                                        <div>
                                            <h3 className="text-xl font-bold">Personnalisation Ultra-Premium</h3>
                                            <p className="text-purple-100 text-sm">Accédez aux thèmes pro, au contraste intelligent et aux réglages avancés.</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard/settings/appearance"
                                        className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition shadow-lg whitespace-nowrap"
                                    >
                                        Configurer l'Apparence 🎨
                                    </Link>
                                </div>

                                {/* Bannière */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">🖼️ Bannière de la Boutique</h2>
                                    <div className="mb-4">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition font-semibold shadow-lg">
                                            {uploadingImage === 'banner' ? (
                                                <>
                                                    <span className="animate-spin text-xl">⏳</span>
                                                    <span>Téléchargement...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>📤 Télécharger une image</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={!!uploadingImage}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 5 * 1024 * 1024) {
                                                            alert('❌ L\'image est trop grande (max 5MB)');
                                                            return;
                                                        }

                                                        // Prévisualisation locale immédiate
                                                        const localUrl = URL.createObjectURL(file);
                                                        setPreviewBannerUrl(localUrl);

                                                        try {
                                                            setUploadingImage('banner');
                                                            const formData = new FormData();
                                                            formData.append('file', file);
                                                            const res = await fetch('/api/upload/banner', { method: 'POST', body: formData });
                                                            const data = await res.json();
                                                            if (res.ok) {
                                                                setBannerUrl(data.url);
                                                                // Garder le localUrl pour un affichage instantané, mais l'URL finale sera data.url après save
                                                            } else {
                                                                setPreviewBannerUrl(''); // Reset preview on error
                                                                alert(`❌ Erreur: ${data.error}`);
                                                            }
                                                        } catch (error) {
                                                            setPreviewBannerUrl('');
                                                            alert('❌ Erreur lors du téléchargement');
                                                        } finally {
                                                            setUploadingImage(null);
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">💡 Taille recommandée : 1200×400 pixels | Max 5MB</p>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-600 mb-3 font-bold flex items-center gap-2">
                                            <span>👁️</span> {t('shop.preview') || 'Aperçu de la bannière'}
                                        </p>
                                        <div className="relative rounded-2xl overflow-hidden border-4 border-gray-100 shadow-2xl h-64 bg-gray-50 flex items-center justify-center group">
                                            {previewBannerUrl || bannerUrl ? (
                                                <>
                                                    <img 
                                                        key={previewBannerUrl || bannerUrl || 'empty'}
                                                        src={previewBannerUrl || bannerUrl} 
                                                        alt="Aperçu bannière" 
                                                        className={`w-full h-full object-cover transition-all duration-500 ${uploadingImage === 'banner' ? 'opacity-40 scale-105 blur-sm' : 'opacity-100 scale-100'}`} 
                                                        onError={() => {
                                                            setBannerUrl('');
                                                            setPreviewBannerUrl('');
                                                        }} 
                                                    />
                                                    {uploadingImage === 'banner' && (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
                                                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                                            <p className="text-orange-600 font-black text-sm uppercase tracking-widest">{t('shop.uploading') || 'Téléchargement...'}</p>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">Aperçu en direct</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400 p-8 text-center">
                                                    <div className="text-6xl mb-4 opacity-20">🖼️</div>
                                                    <p className="font-bold">Aucune bannière configurée</p>
                                                    <p className="text-xs max-w-[200px] mt-1">Ajoutez une image pour donner une identité visuelle à votre boutique.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Logo */}
                                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">📸 {t('shop.shopLogo')}</h3>
                                    <div className="mb-4">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition font-semibold shadow-lg">
                                            {uploadingImage === 'logo' ? (
                                                <>
                                                    <span className="animate-spin text-xl">⏳</span>
                                                    <span>Chargement...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>📤 {t('shop.uploadLogo')}</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={!!uploadingImage}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            alert('❌ Le logo est trop volumineux (max 2MB)');
                                                            return;
                                                        }

                                                        // Prévisualisation locale
                                                        const localUrl = URL.createObjectURL(file);
                                                        setPreviewLogoUrl(localUrl);

                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        try {
                                                            setUploadingImage('logo');
                                                            const res = await fetch('/api/upload/logo', { method: 'POST', body: formData });
                                                            const data = await res.json();
                                                            if (res.ok) {
                                                                setLogoUrl(data.url);
                                                            } else {
                                                                setPreviewLogoUrl('');
                                                                alert(`❌ Erreur: ${data.error}`);
                                                            }
                                                        } catch (error) {
                                                            setPreviewLogoUrl('');
                                                            alert('❌ Erreur lors du téléchargement');
                                                        } finally {
                                                            setUploadingImage(null);
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-600 mb-3 font-bold flex items-center gap-2">
                                            <span>👁️</span> {t('shop.logoPreview') || 'Aperçu du logo'}
                                        </p>
                                        <div className="relative rounded-2xl p-8 border-4 border-gray-100 shadow-xl bg-gray-50 flex items-center justify-center min-h-[200px] group transition-all hover:bg-white">
                                            {previewLogoUrl || logoUrl ? (
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="relative">
                                                        <img 
                                                            key={previewLogoUrl || logoUrl || 'empty-logo'}
                                                            src={previewLogoUrl || logoUrl} 
                                                            alt="Logo boutique" 
                                                            className={`max-w-[180px] max-h-[180px] object-contain transition-all duration-500 ${uploadingImage === 'logo' ? 'opacity-40 scale-90 blur-sm' : 'opacity-100 scale-100'}`} 
                                                            onError={() => {
                                                                setLogoUrl('');
                                                                setPreviewLogoUrl('');
                                                            }} 
                                                        />
                                                        {uploadingImage === 'logo' && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => {
                                                            if (confirm(t('shop.confirmDeleteLogo') || 'Voulez-vous vraiment supprimer ce logo ?')) {
                                                                setLogoUrl('');
                                                                setPreviewLogoUrl('');
                                                            }
                                                        }}
                                                        className="flex items-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 hover:text-red-700 transition-all font-bold shadow-sm active:scale-95"
                                                    >
                                                        <span>🗑️ </span>
                                                        {t('common.delete') || 'Supprimer'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400 text-center">
                                                    <div className="text-5xl mb-3 opacity-20">📸</div>
                                                    <p className="font-bold">Aucun logo</p>
                                                    <p className="text-xs max-w-[150px] mt-1">Format carré recommandé (PNG ou SVG).</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Fond de boutique */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">🎨</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Fond de Boutique</h2>
                                            <p className="text-sm text-gray-600">Personnalisez l'arrière-plan de votre boutique (image ou couleur)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Image de fond</label>
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition shadow-lg font-semibold">
                                                {uploadingImage === 'background' ? (
                                                    <>
                                                        <span className="animate-spin text-xl">⏳</span>
                                                        <span>Chargement...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xl">📤</span>
                                                        <span>Uploader une image</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={!!uploadingImage}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.size > 2 * 1024 * 1024) {
                                                                alert('❌ Image trop volumineuse (max 2MB)');
                                                                return;
                                                            }

                                                            // Preview locale
                                                            const localUrl = URL.createObjectURL(file);
                                                            setPreviewBackgroundUrl(localUrl);

                                                            const formData = new FormData();
                                                            formData.append('file', file);
                                                            try {
                                                                setUploadingImage('background');
                                                                const res = await fetch('/api/upload/logo', { method: 'POST', body: formData });
                                                                const data = await res.json();
                                                                if (res.ok) {
                                                                    setBackgroundUrl(data.url);
                                                                } else {
                                                                    setPreviewBackgroundUrl('');
                                                                    alert(`❌ ${data.error}`);
                                                                }
                                                            } catch (error) {
                                                                setPreviewBackgroundUrl('');
                                                                alert('❌ Erreur upload');
                                                            } finally {
                                                                setUploadingImage(null);
                                                            }
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-600 mb-3 font-bold flex items-center gap-2">
                                                <span>👁️</span> Aperçu du fond
                                            </p>
                                            <div className="relative rounded-2xl overflow-hidden border-4 border-gray-100 shadow-xl min-h-[150px] bg-gray-50 flex items-center justify-center group">
                                                {previewBackgroundUrl || backgroundUrl ? (
                                                    <div className="w-full h-full min-h-[150px] relative">
                                                        <div
                                                            className={`w-full h-full min-h-[150px] transition-all duration-500 ${uploadingImage === 'background' ? 'opacity-40 blur-sm scale-105' : 'opacity-100 scale-100'}`}
                                                            style={{ 
                                                                background: (previewBackgroundUrl || backgroundUrl).startsWith('#') 
                                                                    ? (previewBackgroundUrl || backgroundUrl) 
                                                                    : `url('${previewBackgroundUrl || backgroundUrl}') center/cover` 
                                                            }}
                                                        />
                                                        {uploadingImage === 'background' && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                            <button
                                                                onClick={() => {
                                                                    setBackgroundUrl('');
                                                                    setPreviewBackgroundUrl('');
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-xl hover:bg-red-700 active:scale-95"
                                                            >
                                                                <span>🗑️</span>
                                                                <span>Supprimer le fond</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400 text-center p-8">
                                                        <div className="text-5xl mb-3 opacity-20">🎨</div>
                                                        <p className="font-bold">Aucun fond personnalisé</p>
                                                        <p className="text-xs mt-1">L'image ou la couleur sera appliquée à l'arrière-plan de votre boutique.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <SaveSectionButton />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ONGLET FONCTIONNALITÉS */}
                {activeTab === 'features' && (
                    <>
                        {!isPremiumOrAdmin ? (
                            <PremiumLock
                                title="Fonctionnalités & Badges"
                                description="Activez les badges de confiance, la vidéo de présentation, le contact WhatsApp direct et vos horaires d'ouverture."
                            />
                        ) : (
                            <div className="space-y-6">
                                {/* Vidéo Présentation */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">🎥</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{t('shop.presentationVideo')}</h2>
                                            <p className="text-sm text-gray-600">{t('shop.videoDesc')}</p>
                                        </div>
                                    </div>

                                    {/* Bouton Upload */}
                                    <div className="mb-4">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition font-semibold shadow-lg">
                                            <span>📤 {t('shop.uploadVideo')}</span>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('video', file);

                                                        try {
                                                            const res = await fetch('/api/upload/video?storage=local', {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            const data = await res.json();

                                                            if (res.ok) {
                                                                setVideoUrl(data.videoUrl);
                                                                alert('✅ Vidéo uploadée avec succès !');
                                                            } else {
                                                                alert(`❌ Erreur: ${data.error}`);
                                                            }
                                                        } catch (error) {
                                                            console.error('Upload error:', error);
                                                            alert('❌ Erreur lors du téléchargement de la vidéo');
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Formats acceptés : MP4, WebM, AVI, MOV</p>
                                    </div>

                                    {/* Input URL */}
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('shop.videoUrlLabel')}
                                        </label>
                                        <input
                                            type="url"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                            placeholder="https://youtube.com/watch?v=... ou https://exemple.com/video.mp4"
                                        />
                                    </div>

                                    {/* Prévisualisation */}
                                    {videoUrl && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-2 font-medium">{t('shop.preview')}</p>
                                            <div className="aspect-video bg-black rounded-xl overflow-hidden">
                                                <video
                                                    src={videoUrl}
                                                    controls
                                                    className="w-full h-full"
                                                    onError={() => {
                                                        // Si c'est une vidéo directe qui échoue, on affiche un message
                                                        console.log('Erreur de chargement vidéo');
                                                    }}
                                                >
                                                    Votre navigateur ne supporte pas la lecture de vidéos.
                                                </video>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                💡 Pour YouTube/Vimeo, l'aperçu ne s'affiche pas ici mais fonctionnera sur votre boutique
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Contact WhatsApp */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">💬</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{t('shop.whatsappContact')}</h2>
                                            <p className="text-sm text-gray-600">{t('shop.whatsappDesc')}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                                        placeholder="+225 XX XX XX XX XX"
                                    />
                                </div>

                                {/* Badges de Confiance */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">🛡️</span>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{t('shop.trustBadges')}</h2>
                                            <p className="text-sm text-gray-600">{t('shop.selectGuarantees')}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {availableBadges.map((badge) => (
                                            <button
                                                key={badge}
                                                onClick={() => toggleBadge(badge)}
                                                className={`p-4 rounded-xl border-2 transition text-left ${selectedBadges.includes(badge)
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                            >
                                                <span className="text-2xl mr-2">{getIconForBadge(badge)}</span>
                                                <span className="font-semibold">{badge}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Heures d'Ouverture - Phase 1 */}
                                <div className="bg-white rounded-xl p-6 shadow-md">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        🕐 {t('shop.businessHours')}
                                    </h3>
                                    <div className="space-y-3">
                                        {Object.entries(businessHours).map(([day, hours]: [string, any]) => {
                                            const dayLabels: any = {
                                                monday: 'Lundi',
                                                tuesday: 'Mardi',
                                                wednesday: 'Mercredi',
                                                thursday: 'Jeudi',
                                                friday: 'Vendredi',
                                                saturday: 'Samedi',
                                                sunday: 'Dimanche'
                                            };

                                            return (
                                                <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="w-28 font-semibold text-gray-900">
                                                        {t('days.' + day)}
                                                    </div>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={!hours.closed}
                                                            onChange={(e) => setBusinessHours({
                                                                ...businessHours,
                                                                [day]: { ...hours, closed: !e.target.checked }
                                                            })}
                                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm text-gray-600">{t('shop.open')}</span>
                                                    </label>
                                                    {!hours.closed && (
                                                        <>
                                                            <input
                                                                type="time"
                                                                value={hours.open}
                                                                onChange={(e) => setBusinessHours({
                                                                    ...businessHours,
                                                                    [day]: { ...hours, open: e.target.value }
                                                                })}
                                                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500"
                                                            />
                                                            <span className="text-gray-600">-</span>
                                                            <input
                                                                type="time"
                                                                value={hours.close}
                                                                onChange={(e) => setBusinessHours({
                                                                    ...businessHours,
                                                                    [day]: { ...hours, close: e.target.value }
                                                                })}
                                                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500"
                                                            />
                                                        </>
                                                    )}
                                                    {hours.closed && (
                                                        <span className="text-gray-400 italic ml-4">{t('shop.closed')}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <SaveSectionButton />
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ONGLET RÉSEAUX SOCIAUX */}
                {activeTab === 'social' && (
                    <>
                        {!isPremiumOrAdmin ? (
                            <PremiumLock
                                title="Réseaux Sociaux"
                                description="Affichez vos réseaux sociaux sur votre boutique pour augmenter votre communauté."
                            />
                        ) : (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">📱</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{t('shop.socialTitle')}</h2>
                                        <p className="text-sm text-gray-600">{t('shop.socialDesc')}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🔵 Facebook Page (ID ou nom)
                                        </label>
                                        <input
                                            type="text"
                                            value={facebookPage}
                                            onChange={(e) => setFacebookPage(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                            placeholder="votrepagefacebook ou 123456789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            📸 Instagram (@username)
                                        </label>
                                        <input
                                            type="text"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                                            placeholder="votre_instagram"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🎥 YouTube (@channel ou ID)
                                        </label>
                                        <input
                                            type="text"
                                            value={youtube}
                                            onChange={(e) => setYoutube(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                                            placeholder="@votrechannel"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            🎵 TikTok (@username)
                                        </label>
                                        <input
                                            value={tiktok}
                                            onChange={(e) => setTiktok(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-900"
                                            placeholder="@votre_tiktok"
                                        />
                                    </div>
                                </div>
                                <SaveSectionButton />
                            </div>
                        )}
                    </>
                )}


                {/* ONGLET AUTOMATISATION */}
                {activeTab === 'automation' && (
                    <>
                        {!isPremiumOrAdmin ? (
                            <PremiumLock
                                title="Automatisation & IA"
                                description="Automatisez vos réponses clients et boostez vos ventes grâce à l'intelligence artificielle."
                            />
                        ) : (
                            <div className="space-y-6">
                                <AutomationTab />
                                <SaveSectionButton />
                            </div>
                        )}
                    </>
                )}

                {/* ONGLET CONTENU */}
                {activeTab === 'content' && (
                    <>
                        {!isPremiumOrAdmin ? (
                            <PremiumLock
                                title="Section À Propos"
                                description="Racontez votre histoire et présentez vos activités à vos visiteurs."
                            />
                        ) : (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">📖</span>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{t('shop.aboutSection')}</h2>
                                        <p className="text-sm text-gray-600">{t('shop.aboutDesc')}</p>
                                    </div>
                                </div>
                                <textarea
                                    value={aboutSection}
                                    onChange={(e) => setAboutSection(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                                    rows={8}
                                    placeholder={t('shop.aboutPlaceholder')}
                                />
                                <p className="text-sm text-gray-500 mt-2">{aboutSection.length} caractères</p>
                                <SaveSectionButton />
                            </div>
                        )}
                    </>
                )}

            </div>


        </div >
    );
}

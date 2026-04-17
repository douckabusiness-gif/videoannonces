'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/I18nContext';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type LayoutOption = {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    preview: string;
};

const LAYOUT_OPTIONS: LayoutOption[] = [
    {
        id: 'mobile-first',
        title: 'Mobile First',
        description: 'Optimisé pour la navigation sur smartphone.',
        icon: '📱',
        color: 'from-orange-500 to-red-600',
        preview: 'bg-gradient-to-br from-orange-50 to-red-50',
    },
    {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Un design plus large pour les grands écrans.',
        icon: '🏪',
        color: 'from-purple-600 to-indigo-700',
        preview: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    }
];

const COLOR_PRESETS = [
    {
        name: 'Classic Orange',
        colors: {
            primary: '#FF6B00',
            secondary: '#9333EA',
            headerBg: '#FFFFFF',
            headerText: '#000000',
            bannerBg: '#FF6B00',
            bannerText: '#FFFFFF',
            footerBg: '#111827',
            footerText: '#FFFFFF',
            pageBg: '#F9FAFB'
        }
    },
    {
        name: 'Dark Luxe',
        colors: {
            primary: '#D4AF37',
            secondary: '#AA8A2E',
            headerBg: '#0F172A',
            headerText: '#FFFFFF',
            bannerBg: '#D4AF37',
            bannerText: '#000000',
            footerBg: '#020617',
            footerText: '#FFFFFF',
            pageBg: '#0F172A'
        }
    },
    {
        name: 'Ocean Blue',
        colors: {
            primary: '#0EA5E9',
            secondary: '#6366F1',
            headerBg: '#FFFFFF',
            headerText: '#000000',
            bannerBg: '#0EA5E9',
            bannerText: '#FFFFFF',
            footerBg: '#0C4A6E',
            footerText: '#FFFFFF',
            pageBg: '#F0F9FF'
        }
    },
    {
        name: 'Forest Zen',
        colors: {
            primary: '#10B981',
            secondary: '#059669',
            headerBg: '#FFFFFF',
            headerText: '#000000',
            bannerBg: '#10B981',
            bannerText: '#FFFFFF',
            footerBg: '#064E3B',
            footerText: '#FFFFFF',
            pageBg: '#F0FDF4'
        }
    }
];

export default function VendorAppearancePage() {
    const { t } = useTranslation();
    const [currentLayout, setCurrentLayout] = useState('mobile-first');
    const [colors, setColors] = useState({
        primary: '#FF6B00',
        secondary: '#9333EA',
        headerBg: '#FFFFFF',
        headerText: '#000000',
        bannerBg: '#FF6B00',
        bannerText: '#FFFFFF',
        footerBg: '#111827',
        footerText: '#FFFFFF',
        pageBg: '#F9FAFB'
    });
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            if (!(session?.user as any)?.premium) {
                toast.error('Accès réservé aux membres Premium');
                router.push('/dashboard/subscription');
            } else {
                fetchSettings();
            }
        } else if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [session, status, router]);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/dashboard/premium/appearance');
            if (res.ok) {
                const data = await res.json();
                if (data.shopLayout) setCurrentLayout(data.shopLayout);
                if (data.customColors && Object.keys(data.customColors).length > 0) {
                    setColors(prev => ({ ...prev, ...data.customColors }));
                }
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/dashboard/premium/appearance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopLayout: currentLayout,
                    customColors: colors
                })
            });

            if (res.ok) {
                toast.success('Apparence mise à jour !');
            } else {
                toast.error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Erreur serveur');
        } finally {
            setIsSaving(false);
        }
    };

    const applyPreset = (preset: any) => {
        setColors(preset.colors);
    };

    const getContrastColor = (hex: string) => {
        if (!hex || !hex.startsWith('#')) return '#000000';
        const rawHex = hex.replace('#', '');
        const r = parseInt(rawHex.substring(0, 2), 16);
        const g = parseInt(rawHex.substring(2, 4), 16);
        const b = parseInt(rawHex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    const updateBgWithContrast = (key: string, value: string, textKey: string) => {
        const contrast = getContrastColor(value);
        setColors(prev => ({
            ...prev,
            [key]: value,
            [textKey]: contrast
        }));
    };

    if (loading) {
        return <div className="p-12 text-center animate-pulse">Chargement de votre style...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[2rem] p-8 mb-12 relative overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        🎨 Design de votre Boutique
                    </h1>
                    <p className="text-purple-100 text-lg opacity-80 max-w-2xl">
                        Personnalisez l'apparence de votre espace de vente pour qu'il reflète l'identité de votre marque.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Controls */}
                <div className="lg:col-span-2 space-y-10">

                    {/* SECTION 1: LAYOUT */}
                    <section className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>1. Structure de la Boutique</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {LAYOUT_OPTIONS.map((layout) => (
                                <button
                                    key={layout.id}
                                    onClick={() => setCurrentLayout(layout.id)}
                                    className={`relative group overflow-hidden rounded-2xl border-2 transition-all duration-300 ${currentLayout === layout.id ? 'border-orange-500 ring-4 ring-orange-500/20 bg-orange-500/5' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                                >
                                    <div className="p-6">
                                        <div className={`text-4xl mb-4 p-4 rounded-xl inline-block ${layout.preview}`}>{layout.icon}</div>
                                        <h3 className="text-lg font-bold text-white mb-1">{layout.title}</h3>
                                        <p className="text-gray-400 text-sm">{layout.description}</p>
                                    </div>
                                    {currentLayout === layout.id && (
                                        <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full p-1 shadow-lg">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 2: COLOR PRESETS */}
                    <section className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6">2. Thèmes Prédéfinis Pro</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {COLOR_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset)}
                                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500 transition-all"
                                >
                                    <div className="flex -space-x-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-900 shadow-xl" style={{ background: preset.colors.primary }} />
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-900 shadow-xl" style={{ background: preset.colors.headerBg }} />
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-900 shadow-xl" style={{ background: preset.colors.bannerBg }} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 3: CUSTOM COLORS */}
                    <section className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-8">3. Couleurs Personnalisées</h2>

                        <div className="space-y-8">
                            {/* Key Colors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Couleur Primaire (Boutons, Liens)</label>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <input
                                            type="color"
                                            value={colors.primary}
                                            onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                            className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20"
                                        />
                                        <code className="text-xs text-orange-400 font-mono bg-orange-400/10 px-3 py-1 rounded-full uppercase">{colors.primary}</code>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Arrière-plan Global</label>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <input
                                            type="color"
                                            value={colors.pageBg}
                                            onChange={(e) => setColors({ ...colors, pageBg: e.target.value })}
                                            className="w-14 h-14 rounded-xl cursor-pointer border-2 border-white/20"
                                        />
                                        <code className="text-xs text-blue-400 font-mono bg-blue-400/10 px-3 py-1 rounded-full uppercase">{colors.pageBg}</code>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/5" />

                            {/* Section Specific */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Header */}
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">En-tête (Header)</span>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={colors.headerBg}
                                            onChange={(e) => updateBgWithContrast('headerBg', e.target.value, 'headerText')}
                                            className="w-12 h-12 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="color"
                                                value={colors.headerText}
                                                onChange={(e) => setColors({ ...colors, headerText: e.target.value })}
                                                className="w-8 h-8 rounded-full cursor-pointer float-right"
                                                title="Texte de l'en-tête"
                                            />
                                            <p className="text-[10px] text-gray-400">Fond & Texte</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Banner/Hero */}
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Bannière (Hero)</span>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={colors.bannerBg}
                                            onChange={(e) => updateBgWithContrast('bannerBg', e.target.value, 'bannerText')}
                                            className="w-12 h-12 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="color"
                                                value={colors.bannerText}
                                                onChange={(e) => setColors({ ...colors, bannerText: e.target.value })}
                                                className="w-8 h-8 rounded-full cursor-pointer float-right"
                                                title="Texte de la bannière"
                                            />
                                            <p className="text-[10px] text-gray-400">Fond & Texte</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Pied de page</span>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={colors.footerBg}
                                            onChange={(e) => updateBgWithContrast('footerBg', e.target.value, 'footerText')}
                                            className="w-12 h-12 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="color"
                                                value={colors.footerText}
                                                onChange={(e) => setColors({ ...colors, footerText: e.target.value })}
                                                className="w-8 h-8 rounded-full cursor-pointer float-right"
                                                title="Texte du footer"
                                            />
                                            <p className="text-[10px] text-gray-400">Fond & Texte</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Preview & Stats */}
                <div className="space-y-8">
                    {/* Live Preview Side */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden sticky top-8 border-8 border-gray-900 aspect-[9/16] max-h-[700px]">
                        <div className="h-full overflow-y-auto" style={{ background: colors.pageBg }}>
                            {/* Fake Header */}
                            <div className="p-4 flex items-center justify-between border-b border-black/5" style={{ background: colors.headerBg }}>
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                <div className="flex gap-2">
                                    <div className="w-6 h-1 rounded-full opacity-50" style={{ background: colors.headerText }} />
                                    <div className="w-4 h-1 rounded-full opacity-30" style={{ background: colors.headerText }} />
                                </div>
                            </div>

                            {/* Fake Hero */}
                            <div className="p-8 text-center space-y-4" style={{ background: colors.bannerBg, color: colors.bannerText }}>
                                <div className="w-16 h-16 mx-auto rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm" />
                                <h4 className="font-bold text-xl uppercase tracking-wider">Ma Super Boutique</h4>
                                <p className="text-xs opacity-70">Découvrez nos produits innovants</p>
                            </div>

                            {/* Fake Content */}
                            <div className="p-4 space-y-4">
                                <div className="flex gap-2 overflow-x-auto">
                                    {['Mode', 'Tech', 'Home'].map(t => (
                                        <span key={t} className="px-3 py-1 rounded-full text-[10px] font-bold shadow-sm" style={{ background: colors.primary, color: '#FFFFFF' }}>{t}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                                            <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-2" />
                                            <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-1" />
                                            <div className="w-1/2 h-4 rounded-md" style={{ background: colors.primary + '20' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fake Footer */}
                            <div className="mt-8 p-6 text-center space-y-2" style={{ background: colors.footerBg, color: colors.footerText }}>
                                <p className="text-[10px] font-bold">© 2024 MA BOUTIQUE</p>
                                <div className="w-12 h-0.5 mx-auto bg-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Final Actions */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500" />
                            <div className={`relative px-8 py-5 rounded-2xl font-black text-xl text-white transition flex items-center justify-center gap-3 ${isSaving ? 'bg-orange-600/50' : 'bg-gradient-to-r from-orange-500 to-red-600 hover:scale-[1.02] shadow-xl'}`}>
                                {isSaving ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        <span>PUBLIER LE LOOK</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

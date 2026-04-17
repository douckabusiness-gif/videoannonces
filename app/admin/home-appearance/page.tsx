'use client';

import { useEffect, useState } from 'react';

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
        id: 'modern',
        title: 'Standard',
        description: 'Le design standard actuel.',
        icon: '🎨',
        color: 'from-orange-500 to-orange-600',
        preview: 'bg-gradient-to-br from-orange-50 to-orange-100',
    }
];

const COLOR_PRESETS = [
    {
        name: 'Standard Orange',
        colors: {
            primary: '#FF6B35',
            secondary: '#F7931E',
            accent: '#FDC830',
            background: '#FFF7ED',
            header: '#FFFFFF',
            footer: '#FFFFFF',
            headerText: '#000000',
            footerText: '#000000',
            urgentBg: '#FFFFFF',
            urgentText: '#000000',
            shopsBg: '#F3F4F6',
            shopsText: '#000000',
            recentBg: '#FFFFFF',
            recentText: '#000000',
        }
    },
    {
        name: 'Luxe Royal',
        colors: {
            primary: '#D4AF37', // Gold
            secondary: '#AA8A2E',
            accent: '#FFFFFF',
            background: '#0F172A', // Navy/Dark
            header: '#0F172A',
            footer: '#020617',
            headerText: '#FFFFFF',
            footerText: '#FFFFFF',
            urgentBg: '#1E293B',
            urgentText: '#FFFFFF',
            shopsBg: '#0F172A',
            shopsText: '#D4AF37',
            recentBg: '#020617',
            recentText: '#FFFFFF',
        }
    },
    {
        name: 'Deep Ocean',
        colors: {
            primary: '#0EA5E9',
            secondary: '#0284C7',
            accent: '#38BDF8',
            background: '#F0F9FF',
            header: '#0C4A6E',
            footer: '#0C4A6E',
            headerText: '#FFFFFF',
            footerText: '#FFFFFF',
            urgentBg: '#E0F2FE',
            urgentText: '#0369A1',
            shopsBg: '#BAE6FD',
            shopsText: '#075985',
            recentBg: '#F0F9FF',
            recentText: '#0C4A6E',
        }
    },
    {
        name: 'Forest Zen',
        colors: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#10B981',
            background: '#F0FDF4',
            header: '#064E3B',
            footer: '#064E3B',
            headerText: '#FFFFFF',
            footerText: '#FFFFFF',
            urgentBg: '#DCFCE7',
            urgentText: '#065F46',
            shopsBg: '#F0FDF4',
            shopsText: '#064E3B',
            recentBg: '#F0FDF4',
            recentText: '#064E3B',
        }
    }
];

export default function HomeAppearancePage() {
    const [currentLayout, setCurrentLayout] = useState<LayoutOption['id']>('modern');
    const [colors, setColors] = useState({
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FDC830',
        background: '#FFF7ED',
        header: '#FFFFFF',
        footer: '#FFFFFF',
        headerText: '#000000',
        footerText: '#000000',
        urgentBg: '#FFFFFF',
        shopsBg: '#FFFFFF',
        recentBg: '#FFFFFF',
        urgentText: '#000000',
        shopsText: '#000000',
        recentText: '#000000',
    });
    const [icons, setIcons] = useState({
        pwaIcon: '',
        logo: '',
        favicon: ''
    });
    const [uploadingIcons, setUploadingIcons] = useState({ pwaIcon: false, logo: false, favicon: false });
    const [loading, setLoading] = useState(true);

    // Load saved layout and colors from API on mount
    useEffect(() => {
        const fetchCurrentSettings = async () => {
            try {
                // Fetch layout
                const layoutRes = await fetch('/api/settings/layout');
                if (layoutRes.ok) {
                    const data = await layoutRes.json();
                    if (data.homeLayout && LAYOUT_OPTIONS.some((layout) => layout.id === data.homeLayout)) {
                        setCurrentLayout(data.homeLayout);
                    }
                }

                // Fetch colors (we can assume /api/settings/site returns them as it returns all siteSettings)
                const siteRes = await fetch('/api/settings/site');
                if (siteRes.ok) {
                    const data = await siteRes.json();
                    if (data) {
                        setIcons({
                            pwaIcon: data.pwaIcon || '',
                            logo: data.logo || '',
                            favicon: data.favicon || ''
                        });
                    }
                    if (data.primaryColor) {
                        setColors({
                            primary: data.primaryColor,
                            secondary: data.secondaryColor || '#F7931E',
                            accent: data.accentColor || '#FDC830',
                            background: data.backgroundColor || '#FFF7ED',
                            header: data.headerColor || '#FFFFFF',
                            footer: data.footerColor || '#FFFFFF',
                            headerText: data.headerTextColor || '#000000',
                            footerText: data.footerTextColor || '#000000',
                            urgentBg: data.urgentBgColor || '#FFFFFF',
                            shopsBg: data.shopsBgColor || '#FFFFFF',
                            recentBg: data.recentBgColor || '#FFFFFF',
                            urgentText: data.urgentTextColor || '#000000',
                            shopsText: data.shopsTextColor || '#000000',
                            recentText: data.recentTextColor || '#000000',
                        });
                    }
                }
            } catch (error) {
                console.error('Erreur chargement configuration:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentSettings();
    }, []);

    const handleSaveLayout = async (layoutId: LayoutOption['id']) => {
        const previousLayout = currentLayout;
        setCurrentLayout(layoutId);
        await saveSettings({ homeLayout: layoutId }, () => setCurrentLayout(previousLayout));
    };

    const handleSaveColors = async () => {
        await saveSettings({
            primaryColor: colors.primary,
            secondaryColor: colors.secondary,
            accentColor: colors.accent,
            backgroundColor: colors.background,
            headerColor: colors.header,
            footerColor: colors.footer,
            headerTextColor: colors.headerText,
            footerTextColor: colors.footerText,
            urgentBgColor: colors.urgentBg,
            shopsBgColor: colors.shopsBg,
            recentBgColor: colors.recentBg,
            urgentTextColor: colors.urgentText,
            shopsTextColor: colors.shopsText,
            recentTextColor: colors.recentText,
        });
    };

    const applyPreset = (preset: any) => {
        setColors(preset.colors);
    };

    const getContrastColor = (hex: string) => {
        if (!hex) return '#000000';
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

    const handleUploadIcon = async (e: React.ChangeEvent<HTMLInputElement>, key: 'pwaIcon' | 'logo' | 'favicon') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingIcons(prev => ({ ...prev, [key]: true }));
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (data.url) {
                setIcons(prev => ({ ...prev, [key]: data.url }));
                await saveSettings({ [key]: data.url });
            } else {
                alert('Erreur: ' + (data.error || 'Erreur lors de l\'upload'));
            }
        } catch (error) {
            console.error('Erreur upload:', error);
            alert('Erreur lors de l\'upload du fichier');
        } finally {
            setUploadingIcons(prev => ({ ...prev, [key]: false }));
        }
    };

    const saveSettings = async (data: any, onError?: () => void) => {
        try {
            const response = await fetch('/api/admin/settings/layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            if (data.homeLayout) window.localStorage.setItem('home-layout', data.homeLayout);
            alert('✅ Modifications enregistrées avec succès !');

        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('❌ Erreur lors de la sauvegarde.');
            if (onError) onError();
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Chargement de la configuration...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">🎨 Apparence & Couleurs</h1>

            {/* SECTION 1: LAYOUTS */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>1. Disposition (Layout)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {LAYOUT_OPTIONS.map((layout) => (
                        <button
                            key={layout.id}
                            onClick={() => handleSaveLayout(layout.id)}
                            className={`group relative p-1 rounded-2xl transition-all duration-300 ${currentLayout === layout.id ? 'scale-105 ring-4 ring-offset-2 ring-orange-500' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${layout.color} rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500`} />
                            <div className="relative h-full bg-white rounded-[14px] p-6 border border-gray-200 flex flex-col">
                                <div className={`w-full h-32 ${layout.preview} rounded-xl mb-4 flex items-center justify-center text-6xl`}>{layout.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{layout.title}</h3>
                                <div
                                    className={`mt-auto px-4 py-2 rounded-full text-sm font-bold transition-colors text-center ${currentLayout === layout.id ? `bg-gradient-to-r ${layout.color} text-white shadow-lg` : 'bg-gray-100 text-gray-600'}`}
                                >
                                    {currentLayout === layout.id ? '✓ Actif' : 'Activer'}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* SECTION 2: COLORS */}
            <section className="mb-12 bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span>2. Palette de Couleurs</span>
                    </h2>
                    <button
                        onClick={handleSaveColors}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                    >
                        💾 Sauvegarder les Couleurs
                    </button>
                </div>

                {/* PRESETS BUTTONS */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">✨ Thèmes Prédéfinis (Pro)</h3>
                    <div className="flex flex-wrap gap-4">
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="group flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                            >
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: preset.colors.primary }} />
                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: preset.colors.background }} />
                                    <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ background: preset.colors.header }} />
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-orange-700">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Primary Color */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">Couleur Principale</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                value={colors.primary}
                                onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Boutons, Titres</p>
                            </div>
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">Fond de Page</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                value={colors.background}
                                onChange={(e) => setColors({ ...colors, background: e.target.value })}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Arrière-plan</p>
                            </div>
                        </div>
                    </div>

                    {/* Header Color */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">En-tête (Header)</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                value={colors.header}
                                onChange={(e) => updateBgWithContrast('header', e.target.value, 'headerText')}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                            />
                            <div className="flex-1 text-center">
                                <input
                                    type="color"
                                    value={colors.headerText}
                                    onChange={(e) => setColors({ ...colors, headerText: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    title="Couleur du texte"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Texte Header</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Color */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">Pied de page (Footer)</label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="color"
                                value={colors.footer}
                                onChange={(e) => updateBgWithContrast('footer', e.target.value, 'footerText')}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                            />
                            <div className="flex-1 text-center">
                                <input
                                    type="color"
                                    value={colors.footerText}
                                    onChange={(e) => setColors({ ...colors, footerText: e.target.value })}
                                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    title="Couleur du texte"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Texte Footer</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Homepage Sections */}
                <div className="mt-12 pt-12 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm">🏠</span>
                        Couleurs des Sections de l'Accueil
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Urgent Section */}
                        <div className="space-y-4 p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                            <label className="block font-bold text-gray-700">Annonces Urgentes</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={colors.urgentBg}
                                    onChange={(e) => updateBgWithContrast('urgentBg', e.target.value, 'urgentText')}
                                    className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                                />
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.urgentText}
                                            onChange={(e) => setColors({ ...colors, urgentText: e.target.value })}
                                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500">Texte / Titre</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Contraste auto activé</p>
                                </div>
                            </div>
                        </div>

                        {/* Shops Section */}
                        <div className="space-y-4 p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                            <label className="block font-bold text-gray-700">Boutiques Premium</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={colors.shopsBg}
                                    onChange={(e) => updateBgWithContrast('shopsBg', e.target.value, 'shopsText')}
                                    className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                                />
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.shopsText}
                                            onChange={(e) => setColors({ ...colors, shopsText: e.target.value })}
                                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500">Texte / Titre</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Contraste auto activé</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Section */}
                        <div className="space-y-4 p-4 rounded-3xl bg-gray-50/50 border border-gray-100">
                            <label className="block font-bold text-gray-700">Annonces Récentes</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={colors.recentBg}
                                    onChange={(e) => updateBgWithContrast('recentBg', e.target.value, 'recentText')}
                                    className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-lg"
                                />
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={colors.recentText}
                                            onChange={(e) => setColors({ ...colors, recentText: e.target.value })}
                                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500">Texte / Titre</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400">Contraste auto activé</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview Bar */}
                <div className="mt-12 p-8 rounded-[2rem] border-2 border-dashed border-gray-200" style={{ background: colors.background }}>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Aperçu du Style</h3>
                    <div className="flex flex-wrap gap-6 items-center">
                        <button
                            style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary || colors.primary})` }}
                            className="px-8 py-4 text-white rounded-2xl font-black shadow-xl transform hover:scale-105 transition-all"
                        >
                            BOUTON
                        </button>
                        <button
                            style={{ color: colors.primary, borderColor: colors.primary }}
                            className="px-8 py-4 bg-white border-2 rounded-2xl font-black"
                        >
                            OUTLINE
                        </button>
                        <span style={{ color: colors.accent }} className="text-3xl font-black drop-shadow-sm">
                            25.000 FCFA
                        </span>
                    </div>
                </div>
            </section>

            {/* SECTION 3: ICONS */}
            <section className="mb-12 bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-8">
                    <span>3. Icônes & PWA</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* PWA ICON */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">Icône PWA (512x512)</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm relative">
                                {icons.pwaIcon ? (
                                    <img src={icons.pwaIcon} alt="PWA Icon" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">📱</span>
                                )}
                                {uploadingIcons.pwaIcon && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-bold transition-all inline-block shadow-sm">
                                    Changer l'icône
                                    <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleUploadIcon(e, 'pwaIcon')} disabled={uploadingIcons.pwaIcon} />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Format carré recommandé (png, jpg). Installée sur les mobiles récents.</p>
                            </div>
                        </div>
                    </div>

                    {/* LOGO */}
                    <div className="space-y-4">
                        <label className="block font-bold text-gray-700">Logo Principal</label>
                        <div className="flex items-center gap-4">
                            <div className="w-full h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm relative px-4">
                                {icons.logo ? (
                                    <img src={icons.logo} alt="Logo" className="max-h-16 object-contain" />
                                ) : (
                                    <span className="text-4xl">🏷️</span>
                                )}
                                {uploadingIcons.logo && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-600 px-4 py-2 rounded-xl text-sm font-bold transition-all inline-block shadow-sm whitespace-nowrap">
                                    Changer Logo
                                    <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleUploadIcon(e, 'logo')} disabled={uploadingIcons.logo} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

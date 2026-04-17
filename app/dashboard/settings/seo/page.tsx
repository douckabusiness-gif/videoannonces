'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/contexts/I18nContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function SeoSettingsPage() {
    const { t } = useTranslation();
    const { data: session } = useSession();
    const { siteSettings } = useSiteSettings();

    const [formData, setFormData] = useState({
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSeoSettings();
    }, []);

    const fetchSeoSettings = async () => {
        try {
            const res = await fetch('/api/user/settings/seo');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    seoTitle: data.seoTitle || '',
                    seoDescription: data.seoDescription || '',
                    seoKeywords: data.seoKeywords || '',
                });
            }
        } catch (error) {
            console.error('Error fetching SEO settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/settings/seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert(t('settings.saved'));
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving SEO settings:', error);
            alert('Erreur serveur');
        } finally {
            setIsSaving(false);
        }
    };

    const shopUrl = session?.user?.subdomain
        ? `${session.user.subdomain}.${window.location.host}`
        : `${window.location.host}/shop/${session?.user?.id}`;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl pb-10">
            {/* Main Header with Orbit Effect */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 p-10 shadow-2xl">
                {/* Background Cosmic Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Propulser votre visibilité
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            SEO & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Visibilité Boutique</span>
                        </h1>
                        <p className="text-blue-100/60 text-lg leading-relaxed">
                            Optimisez la manière dont votre boutique apparaît sur Google et les réseaux sociaux pour attirer plus de clients.
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3 group-hover:rotate-6 transition-transform">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor Card */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                📝
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Éditeur de Métadonnées</h3>
                                <p className="text-sm text-gray-500">Personnalisez vos balises pour les moteurs de recherche</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Titre SEO */}
                            <div className="space-y-3 group/field">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                        Titre SEO (Balise Title)
                                        <div className="w-1 h-1 rounded-full bg-blue-500/50" />
                                    </label>
                                    <span className={`text-[10px] font-bold ${formData.seoTitle.length > 60 ? 'text-amber-400' : 'text-gray-600'}`}>
                                        {formData.seoTitle.length} / 70
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all hover:bg-white/[0.08] placeholder:text-gray-700"
                                        placeholder={session?.user?.name || 'Ma Boutique de Luxe'}
                                    />
                                    <div className="absolute inset-x-6 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div className="space-y-3 group/field">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                        Meta Description
                                        <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
                                    </label>
                                    <span className={`text-[10px] font-bold ${formData.seoDescription.length > 150 ? 'text-amber-400' : 'text-gray-600'}`}>
                                        {formData.seoDescription.length} / 160
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        rows={4}
                                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white/[0.08] placeholder:text-gray-700 resize-none leading-relaxed"
                                        placeholder="Votre boutique n°1 pour [vos produits]. Livraison gratuite à Abidjan et partout en Côte d'Ivoire. Cliquez pour voir nos vidéos !"
                                    />
                                    <div className="absolute inset-x-6 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>

                            {/* Mots-clés */}
                            <div className="space-y-3 group/field">
                                <label className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    Mots-clés (Keywords)
                                    <div className="w-1 h-1 rounded-full bg-teal-500/50" />
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.seoKeywords}
                                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-all hover:bg-white/[0.08] placeholder:text-gray-700"
                                        placeholder="chaussures, mode, abidjan, pas cher"
                                    />
                                    <div className="absolute inset-x-6 bottom-0 h-[2px] bg-gradient-to-r from-teal-500 to-emerald-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full relative group pt-2"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500" />
                                <div className={`relative w-full px-8 py-5 bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-2px] active:scale-[0.98]'}`}>
                                    {isSaving ? (
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-2xl">✨</span>
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preview & Tips Column */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Live Preview Console */}
                    <div className="bg-slate-900 rounded-[2rem] border border-white/10 p-0 shadow-2xl overflow-hidden group">
                        <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/20 group-hover:bg-amber-500 transition-colors" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Google Simulator v1.0</span>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.545 11.027a14.557 14.557 0 0 1 .126 5.821 14.997 14.997 0 0 1-5.718-3.148 14.996 14.996 0 0 1 3.313-2.319l.06-.027-.061.027a14.996 14.996 0 0 1 2.28 12.016 1.13 1.13 0 0 1-1.071.744h-5.96a1.13 1.13 0 0 1-1.047-1.13v-5.96a1.13 1.13 0 0 1 .744-1.071 14.996 14.996 0 0 1 12.016 2.22l.027.06-.027-.06a14.996 14.996 0 0 1-2.319 3.313 14.997 14.997 0 0 1-3.148-5.718z" />
                                    </svg>
                                </div>
                                <h4 className="text-white font-bold opacity-80">Aperçu dans les résultats</h4>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-xl space-y-2 group/card transition-all hover:scale-[1.02]">
                                <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer line-clamp-2 leading-tight">
                                    {formData.seoTitle || `${session?.user?.name || 'Ma Boutique'} | VideoAnnonces CI`}
                                </div>
                                <div className="flex items-center gap-1 text-[#006621] text-sm">
                                    https://{shopUrl}
                                    <svg className="w-3 h-3 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6L6 10l4 4V6z" /></svg>
                                </div>
                                <div className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed font-sans">
                                    {formData.seoDescription || "La meilleure boutique pour vos achats en ligne en Côte d'Ivoire. Qualité premium, vidéos exclusives et livraison rapide à domicile."}
                                </div>
                            </div>

                            <p className="text-[10px] text-center text-gray-500 uppercase font-bold tracking-tighter">
                                L'algorithme de Google prend généralement 1 à 2 semaines pour mettre à jour ces infos.
                            </p>
                        </div>
                    </div>

                    {/* Educational Card */}
                    <div className="relative group rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-8">
                        <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:scale-125 transition-transform duration-500">💡</div>
                        <h4 className="text-blue-400 font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                            SEO Expert Tips
                        </h4>
                        <ul className="space-y-4">
                            {[
                                "Ajoutez votre ville dans le titre pour plus de ventes locales.",
                                "Mentionnez la livraison dans la meta description.",
                                "Utilisez des mots d'action comme 'Découvrez' ou 'Achetez'.",
                                "Visez entre 50 et 160 caractères pour la description."
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-3 text-sm text-blue-100/60 leading-relaxed">
                                    <span className="text-blue-500 font-bold">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function LoginPage() {
    const router = useRouter();
    const { siteSettings } = useSiteSettings();
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationOpen, setRegistrationOpen] = useState(true);

    useEffect(() => {
        fetch('/api/platform/registration-status')
            .then((r) => r.json())
            .then((d) => setRegistrationOpen(d.publicRegistrationEnabled !== false))
            .catch(() => setRegistrationOpen(true));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                phone: formData.phone,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Téléphone ou mot de passe incorrect');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual Branding (Cosmic Professional) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] overflow-hidden flex-col items-center justify-center text-center p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a] opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />

                {/* Animated Orbs (Subtle) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 flex justify-center">
                        {siteSettings.logo ? (
                            <img
                                src={siteSettings.logo}
                                alt={siteSettings.siteName}
                                className="h-20 w-auto object-contain drop-shadow-2xl"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                                <span className="text-white font-black text-4xl">V</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
                        {siteSettings.siteName}
                    </h1>
                    <p className="text-lg text-indigo-100/80 leading-relaxed font-light mb-8">
                        Connectez-vous à votre espace et gérez vos annonces en toute simplicité.
                    </p>

                    {/* Trust Indicators / Features */}
                    <div className="grid grid-cols-2 gap-4 text-left mt-8">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-semibold mb-1">Espace Vendeur</h3>
                            <p className="text-xs text-indigo-200">Gérez votre boutique et vos abonnés.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-semibold mb-1">Messages</h3>
                            <p className="text-xs text-indigo-200">Répondez instantanément à vos clients.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="absolute bottom-8 text-xs text-indigo-400/50">
                    &copy; {new Date().getFullYear()} {siteSettings.siteName}. Tous droits réservés.
                </div>
            </div>

            {/* Right Side - Form (Clean Professional) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="text-center mb-8 lg:hidden">
                        <h1 className="text-2xl font-bold text-gray-900">{siteSettings.siteName}</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Bon retour !</h2>
                        <p className="text-gray-500 text-sm">Entrez vos identifiants pour continuer</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                                    placeholder="0123456789"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Connexion en cours...</span>
                                    </>
                                ) : (
                                    <span>Se connecter</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        {registrationOpen ? (
                            <>
                                <p className="text-gray-600 mb-4">Pas encore de compte ?</p>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 hover:border-purple-500 hover:text-purple-600 rounded-xl font-semibold text-gray-700 bg-white transition-all group"
                                >
                                    <span>Créer un compte</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">
                                La création de compte en ligne est désactivée. Contactez le propriétaire du site.
                            </p>
                        )}
                    </div>

                    {/* Back to home simplified */}
                    <div className="mt-8 text-center lg:hidden">
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                            &larr; Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

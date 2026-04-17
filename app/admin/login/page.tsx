'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                phone,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Identifiants incorrects');
                setLoading(false);
                return;
            }

            // Vérifier si l'utilisateur est admin
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session?.user?.role !== 'ADMIN') {
                setError('Accès refusé. Vous devez être administrateur.');
                setLoading(false);
                return;
            }

            // Rediriger vers le dashboard admin
            router.push('/admin');
            router.refresh();
        } catch (err) {
            setError('Une erreur est survenue');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual Branding (Admin Secure) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] overflow-hidden flex-col items-center justify-center text-center p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3f0f18] via-[#1f1012] to-[#000000] opacity-90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />

                {/* Animated Orbs (Red/Pink for Admin) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
                        Administration
                    </h1>
                    <p className="text-lg text-red-100/80 leading-relaxed font-light mb-8">
                        Portail d'administration sécurisé. Gestion des utilisateurs, validation des annonces et surveillance du système.
                    </p>

                    {/* Security Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Connexion Sécurisée AES-256</span>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="absolute bottom-8 text-xs text-red-400/30">
                    Système d'administration interne • Accès restreint
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="text-center mb-8 lg:hidden">
                        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Vérification</h2>
                        <p className="text-gray-500 text-sm">Veuillez vous identifier pour accéder au panneau.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Numéro de téléphone</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                                    placeholder="0709194318"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white rounded-xl font-bold shadow-lg shadow-red-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Vérification...</span>
                                    </>
                                ) : (
                                    <span>Accéder au Dashboard</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition inline-flex items-center gap-2 group">
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Retour au site public
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

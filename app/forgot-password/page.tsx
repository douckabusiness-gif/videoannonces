'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] overflow-hidden flex-col items-center justify-center text-center p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/90" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />

                {/* Animated Orbs */}
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Sécurité <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            Maximale
                        </span>
                    </h1>
                    <p className="text-xl text-indigo-100/80 leading-relaxed font-light">
                        Nous prenons la sécurité de votre compte très au sérieux.
                        La procédure de récupération est protégée pour garantir que vous seul y ayez accès.
                    </p>
                </div>
            </div>

            {/* Right Side - Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50/50">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 bg-white/80 backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Mot de passe oublié ?</h2>
                        <p className="text-gray-500 mt-2">Pas de panique, ça arrive à tout le monde.</p>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-6 mb-8">
                        <h3 className="text-sm font-semibold text-orange-800 mb-2">Procédure de sécurité</h3>
                        <p className="text-sm text-orange-700/80 leading-relaxed">
                            Pour des raisons de sécurité, la réinitialisation automatique est temporairement désactivée.
                            Veuillez contacter notre support pour vérifier votre identité et récupérer l'accès à votre compte.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/contact"
                            className="block w-full py-4 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-center"
                        >
                            Contacter le Support
                        </Link>

                        <Link
                            href="/login"
                            className="block w-full py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

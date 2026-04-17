'use client';

import Link from 'next/link';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                            />
                        </svg>
                    </div>
                </div>

                {/* Titre */}
                <h1 className="text-2xl font-black text-gray-900 mb-3">
                    📡 Vous êtes hors ligne
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    Vérifiez votre connexion internet pour accéder aux dernières annonces.
                </p>

                {/* Conseils */}
                <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">💡 En attendant :</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Les annonces récentes sont en cache</li>
                        <li>• Vos messages sont sauvegardés</li>
                        <li>• Vous pouvez préparer une annonce</li>
                    </ul>
                </div>

                {/* Bouton Réessayer */}
                <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-600 transition shadow-lg mb-3"
                >
                    🔄 Réessayer
                </button>

                {/* Lien vers page d'accueil */}
                <Link
                    href="/"
                    className="block text-orange-600 hover:text-orange-700 font-medium transition"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}

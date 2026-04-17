import Link from 'next/link';

export default function ShopNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl mb-6">🏪</div>
                <h1 className="text-4xl font-black text-gray-900 mb-4">
                    Boutique non trouvée
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Cette boutique n'existe pas ou n'est plus disponible
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition font-bold text-lg shadow-lg"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface BoostPackage {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    features: string[];
}

interface Listing {
    id: string;
    title: string;
    price: number;
}

export default function SelectBoostPage() {
    const router = useRouter();
    const params = useParams();
    const listingId = params.id as string;

    const [boosts, setBoosts] = useState<BoostPackage[]>([]);
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBoost, setSelectedBoost] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [boostsRes, listingRes] = await Promise.all([
                fetch('/api/boosts'),
                fetch(`/api/listings/${listingId}`)
            ]);

            if (boostsRes.ok) {
                const data = await boostsRes.json();
                setBoosts(data.boosts);
            }

            if (listingRes.ok) {
                const data = await listingRes.json();
                setListing(data.listing);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (selectedBoost) {
            router.push(`/dashboard/listings/${listingId}/boost/checkout?packageId=${selectedBoost}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold shadow-lg">
                        ⚡ Booster votre annonce
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        Choisissez votre package
                    </h1>
                    {listing && (
                        <p className="text-xl text-gray-600">
                            Pour l'annonce : <span className="font-bold">{listing.title}</span>
                        </p>
                    )}
                </div>

                {/* Packages */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {boosts.map((boost) => (
                        <button
                            key={boost.id}
                            onClick={() => setSelectedBoost(boost.id)}
                            className={`relative bg-white rounded-2xl shadow-lg p-6 transition-all transform hover:scale-105 ${selectedBoost === boost.id
                                    ? 'ring-4 ring-orange-500 shadow-orange-500/50'
                                    : 'hover:shadow-xl'
                                }`}
                        >
                            {/* Badge sélectionné */}
                            {selectedBoost === boost.id && (
                                <div className="absolute top-4 right-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Nom */}
                            <h3 className="text-2xl font-black text-gray-900 mb-2">{boost.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{boost.description}</p>

                            {/* Prix */}
                            <div className="mb-6 p-4 bg-orange-50 rounded-xl text-center">
                                <p className="text-3xl font-black text-orange-600">
                                    {boost.price.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
                                </p>
                                <p className="text-sm font-bold text-gray-700 mt-1">
                                    Pendant {boost.duration} jours
                                </p>
                            </div>

                            {/* Fonctionnalités */}
                            <ul className="space-y-2">
                                {boost.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                        <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>

                {/* Boutons */}
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/dashboard/listings"
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-bold"
                    >
                        Annuler
                    </Link>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedBoost}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform ${selectedBoost
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:-translate-y-1'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Continuer vers le paiement
                    </button>
                </div>
            </div>
        </div>
    );
}

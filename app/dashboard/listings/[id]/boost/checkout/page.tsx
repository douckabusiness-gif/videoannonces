'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

interface BoostPackage {
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
}

interface Listing {
    id: string;
    title: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    icon: string;
    color: string;
}

export default function BoostCheckoutPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const listingId = params.id as string;
    const packageId = searchParams.get('packageId');

    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [boostPackage, setBoostPackage] = useState<BoostPackage | null>(null);
    const [listing, setListing] = useState<Listing | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    useEffect(() => {
        if (listingId && packageId) {
            fetchData();
        }
    }, [listingId, packageId]);

    const fetchData = async () => {
        try {
            setPageLoading(true);
            setError('');

            const [boostsRes, listingRes, methodsRes] = await Promise.all([
                fetch('/api/boosts'),
                fetch(`/api/listings/${listingId}`),
                fetch('/api/payment-methods')
            ]);

            if (!boostsRes.ok) throw new Error(`Erreur API Boosts: ${boostsRes.status}`);
            if (!listingRes.ok) throw new Error(`Erreur API Listing: ${listingRes.status}`);
            if (!methodsRes.ok) throw new Error(`Erreur API Moyens de paiement: ${methodsRes.status}`);

            const boostsData = await boostsRes.json();

            // Charger le premier package disponible
            if (boostsData.boosts && boostsData.boosts.length > 0) {
                setBoostPackage(boostsData.boosts[0]);
            } else {
                throw new Error('Aucun package de boost disponible');
            }

            const listingData = await listingRes.json();
            if (listingData && listingData.id) {
                setListing(listingData);
            } else {
                throw new Error('Annonce introuvable');
            }

            const methodsData = await methodsRes.json();
            if (methodsData.methods && methodsData.methods.length > 0) {
                setPaymentMethods(methodsData.methods);
            } else {
                throw new Error('Aucun moyen de paiement disponible');
            }

        } catch (error: any) {
            console.error('❌ Erreur:', error);
            setError(error.message || 'Erreur de chargement');
        } finally {
            setPageLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedMethod) {
            setError('Veuillez sélectionner une méthode de paiement');
            return;
        }

        if (!phoneNumber) {
            setError('Veuillez entrer votre numéro de téléphone');
            return;
        }

        const phoneRegex = /^(07|05|01)\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Numéro de téléphone invalide (format: 0709194318)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/listings/${listingId}/boost`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    boostPackageId: packageId,
                    paymentMethod: selectedMethod,
                    phoneNumber
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors du paiement');
            }

            alert('Votre demande a été envoyée ! Un administrateur vous contactera très bientôt avec le lien de paiement.');
            router.push('/dashboard/listings');

        } catch (err: any) {
            setError(err.message || 'Erreur lors du paiement');
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Erreur</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Réessayer
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    if (!boostPackage || !listing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Package non disponible</h1>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold shadow-lg">
                        ⚡ Booster votre annonce
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        Finaliser le paiement
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Récapitulatif */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border-2 border-orange-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Récapitulatif</h3>

                            <div className="space-y-4 mb-6">
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="block text-xs text-gray-500 mb-1">Annonce</span>
                                    <span className="font-bold text-gray-900">{listing.title}</span>
                                </div>
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="block text-xs text-gray-500 mb-1">Package</span>
                                    <span className="font-bold text-gray-900">{boostPackage.name}</span>
                                </div>
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="block text-xs text-gray-500 mb-1">Durée</span>
                                    <span className="font-bold text-gray-900">{boostPackage.duration} jours</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-black text-gray-900">Total</span>
                                    <span className="font-black text-orange-600">{boostPackage.price.toLocaleString()} FCFA</span>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">Inclus :</h4>
                                <ul className="space-y-2">
                                    {boostPackage.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Paiement */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-8">
                                {/* Méthodes de paiement */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Moyen de paiement</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.code}
                                                onClick={() => setSelectedMethod(method.code)}
                                                className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group ${selectedMethod === method.code
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden`}>
                                                    {method.icon && (method.icon.startsWith('http') || method.icon.startsWith('/')) ? (
                                                        <img
                                                            src={method.icon}
                                                            alt={method.name}
                                                            className="w-10 h-10 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl">{method.icon}</span>
                                                    )}
                                                </div>
                                                <span className={`font-bold text-sm ${selectedMethod === method.code ? 'text-orange-700' : 'text-gray-700'}`}>
                                                    {method.name}
                                                </span>
                                                {selectedMethod === method.code && (
                                                    <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Numéro de téléphone */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Numéro de paiement</h3>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-bold text-lg">🇨🇮 +225</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhoneNumber(val);
                                            }}
                                            placeholder="0709194318"
                                            className="w-full pl-24 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-xl font-bold text-gray-900 placeholder-gray-300 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={loading || !selectedMethod || !phoneNumber}
                                    className={`w-full py-5 rounded-xl font-black text-xl text-white shadow-xl transition-all transform ${loading || !selectedMethod || !phoneNumber
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0'
                                        }`}
                                >
                                    {loading ? 'Traitement...' : `Payer ${boostPackage.price.toLocaleString()} FCFA`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

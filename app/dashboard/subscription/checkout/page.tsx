'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
}

interface PaymentMethod {
    id: string;
    name: string;
    code: string;
    icon: string;
    color: string;
}

interface PaymentMessage {
    id: string;
    message: string;
    active: boolean;
    bgColor: string;
    textColor: string;
}

export default function SubscriptionCheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedMethodId, setSelectedMethodId] = useState<string>('');
    const [transactionId, setTransactionId] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    // State pour l'affichage
    const [showInstructions, setShowInstructions] = useState(false);
    const [uploadingProof, setUploadingProof] = useState(false);

    const [error, setError] = useState('');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentMessage, setPaymentMessage] = useState<PaymentMessage | null>(null);

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            const [planRes, methodsRes, messageRes] = await Promise.all([
                fetch('/api/subscription-plans'),
                fetch('/api/payment-methods'), // Utiliser l'API publique
                fetch('/api/payment-message')
            ]);

            if (planRes.ok) {
                const data = await planRes.json();
                const proPlan = data.plans.find((p: any) => p.slug === 'pro');
                setPlan(proPlan);
            }

            if (methodsRes.ok) {
                const data = await methodsRes.json();
                // Filtrer seulement les actifs
                setPaymentMethods(data.methods || []);
            }

            if (messageRes.ok) {
                const data = await messageRes.json();
                if (data.message && data.message.active) {
                    setPaymentMessage(data.message);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadProof = async (): Promise<string | null> => {
        if (!proofFile) return null;

        const formData = new FormData();
        formData.append('file', proofFile);

        try {
            const res = await fetch('/api/upload/payment-proof', { // Assurez-vous que cette API existe ou utilisez une générique
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
            return null;
        } catch (e) {
            console.error("Upload error", e);
            return null;
        }
    }

    const handlePayment = async () => {
        if (!selectedMethodId) {
            setError('Veuillez sélectionner une méthode de paiement');
            return;
        }

        if (!transactionId) {
            setError('Veuillez entrer l\'ID de la transaction');
            return;
        }

        if (!phoneNumber) {
            setError('Veuillez entrer votre numéro de téléphone');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            // 1. Upload preuve si présente
            let proofUrl = null;
            if (proofFile) {
                setUploadingProof(true);
                // Note: Si /api/upload/payment-proof n'existe pas, il faudra le créer.
                // Pour l'instant on suppose qu'on peut utiliser /api/upload/image ou similaire
                const formData = new FormData();
                formData.append('file', proofFile);
                const uploadRes = await fetch('/api/upload/image', { method: 'POST', body: formData });
                if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    proofUrl = data.url;
                }
                setUploadingProof(false);
            }

            // 2. Soumettre paiement
            const res = await fetch('/api/payments/manual/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: 'pro',
                    paymentMethodId: selectedMethodId,
                    transactionId,
                    phoneNumber,
                    proofUrl
                })
            });

            if (res.ok) {
                alert('Votre paiement a été soumis avec succès ! Il sera validé par un administrateur dans les plus brefs délais.');
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error(error);
            setError('Erreur de connexion');
        } finally {
            setProcessing(false);
            setUploadingProof(false);
        }
    };

    const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan non disponible</h1>
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
                {/* Payment Message Banner */}
                {paymentMessage && (
                    <div
                        className="mb-8 p-6 rounded-2xl shadow-xl text-center font-semibold"
                        style={{
                            backgroundColor: paymentMessage.bgColor,
                            color: paymentMessage.textColor
                        }}
                    >
                        {paymentMessage.message}
                    </div>
                )}

                <div className="text-center mb-8">
                    <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold shadow-lg">
                        💎 Abonnement Premium
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        Finaliser l'abonnement
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Récapitulatif */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8 border-2 border-orange-100">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Récapitulatif</h3>

                            <div className="space-y-4 mb-6">
                                <div className="pb-4 border-b border-gray-100">
                                    <span className="block text-xs text-gray-500 mb-1">Plan</span>
                                    <span className="font-bold text-gray-900">{plan.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-black text-gray-900">Total</span>
                                    <span className="font-black text-orange-600">{plan.price.toLocaleString()} FCFA</span>
                                    <span className="text-xs text-gray-500">/mois</span>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-xl p-4">
                                <h4 className="font-bold text-gray-900 mb-3 text-sm">Inclus :</h4>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
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
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">1. Choisissez un moyen de paiement</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedMethodId(method.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 group ${selectedMethodId === method.id
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
                                                <span className={`font-bold text-sm ${selectedMethodId === method.id ? 'text-orange-700' : 'text-gray-700'}`}>
                                                    {method.name}
                                                </span>
                                                {selectedMethodId === method.id && (
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

                                {selectedMethod && (
                                    <div className="animate-fade-in">
                                        <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                                <span className="text-xl">ℹ️</span> Instructions de paiement
                                            </h4>
                                            <p className="text-blue-800 whitespace-pre-line text-sm leading-relaxed">
                                                {selectedMethod.instruction
                                                    ? selectedMethod.instruction.replace('{amount}', plan.price.toLocaleString())
                                                    : `Veuillez envoyer ${plan.price.toLocaleString()} FCFA via ${selectedMethod.name}.`}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">2. ID de Transaction</label>
                                                <p className="text-xs text-gray-500 mb-2">Entrez l'ID reçu par SMS après le paiement</p>
                                                <input
                                                    type="text"
                                                    value={transactionId}
                                                    onChange={(e) => setTransactionId(e.target.value)}
                                                    placeholder="Ex: PP230412..."
                                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-lg font-mono font-bold text-gray-900 placeholder-gray-300"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">3. Numéro ayant effectué le paiement</label>
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
                                                        className="w-full pl-24 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 text-lg font-bold text-gray-900 placeholder-gray-300"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">4. Capture d'écran (Preuve)</label>
                                                <p className="text-xs text-gray-500 mb-2">Optionnel mais recommandé pour une validation rapide</p>
                                                <div className="flex items-center justify-center w-full">
                                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            {proofFile ? (
                                                                <>
                                                                    <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    <p className="text-sm text-gray-500 font-semibold">{proofFile.name}</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                    </svg>
                                                                    <p className="text-sm text-gray-500"><span className="font-semibold">Cliquez pour uploader</span></p>
                                                                    <p className="text-xs text-gray-400">PNG, JPG (MAX 2MB)</p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => e.target.files && setProofFile(e.target.files[0])}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handlePayment}
                                                disabled={processing || !selectedMethodId || !transactionId || !phoneNumber || uploadingProof}
                                                className={`w-full py-5 rounded-xl font-black text-xl text-white shadow-xl transition-all transform mt-6 ${processing || !selectedMethodId || !transactionId || !phoneNumber || uploadingProof
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0'
                                                    }`}
                                            >
                                                {processing || uploadingProof ? 'Traitement...' : 'Soumettre le paiement'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    features: string[];
    maxListings: number | null;
    maxVideosPerListing: number | null;
    maxVideoDuration: number | null;
    allowSubdomain: boolean;
    allowCustomDomain: boolean;
    allowLiveStreaming: boolean;
    allowStories: boolean;
    active: boolean;
    popular: boolean;
    color: string | null;
}

export default function SubscriptionPage() {
    const { data: session } = useSession();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/subscription-plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data.plans.filter((p: SubscriptionPlan) => p.active));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Plan gratuit en dur (toujours affiché)
    const freePlan = {
        id: 'free',
        name: 'Gratuit',
        price: 0,
        period: '',
        description: 'Parfait pour commencer',
        features: [
            '5 annonces maximum',
            'Durée: 30 jours par annonce',
            'Support email',
            'Vidéos jusqu\'à 60 secondes',
        ],
        limitations: [
            'Pas de sous-domaine',
            'Pas de boost',
            'Analytics basiques',
        ],
        color: 'from-gray-500 to-gray-600',
        buttonText: 'Plan actuel',
        disabled: true,
    };

    // Transformer les plans BDD en format d'affichage
    const displayPlans = [
        freePlan,
        ...plans.map(plan => ({
            id: plan.slug,
            name: plan.name,
            price: plan.price,
            period: '/mois',
            description: plan.description || '',
            features: plan.features,
            color: plan.color || 'from-orange-500 to-orange-600',
            buttonText: `Passer à ${plan.name}`,
            popular: plan.popular,
            disabled: false,
        }))
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Chargement des plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8 pb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        💎
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black">Abonnements</h1>
                        <p className="text-orange-100">Choisissez le plan qui vous convient</p>
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6">
                {displayPlans.map((plan: any) => (
                    <div
                        key={plan.id}
                        className={`bg-white rounded-2xl p-6 shadow-xl border-2 transition-transform hover:scale-105 ${plan.popular ? 'border-orange-500' : 'border-gray-200'
                            }`}
                    >
                        {plan.popular && (
                            <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                                ⭐ RECOMMANDÉ
                            </div>
                        )}

                        <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 mb-4">{plan.description}</p>

                        <div className="mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900">
                                    {plan.price.toLocaleString()}
                                </span>
                                <span className="text-xl text-gray-600">FCFA{plan.period}</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {plan.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                            {plan.limitations?.map((limitation: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="text-red-500 text-xl">✗</div>
                                    <span className="text-gray-500">{limitation}</span>
                                </div>
                            ))}
                        </div>

                        {plan.id !== 'free' ? (
                            <Link
                                href="/dashboard/subscription/checkout"
                                className="block w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 hover:scale-105 transition-all font-bold text-center text-lg shadow-lg"
                            >
                                {plan.buttonText}
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="w-full px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-bold text-lg cursor-not-allowed"
                            >
                                {plan.buttonText}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Questions fréquentes</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">Comment puis-je payer ?</h3>
                        <p className="text-gray-600">Nous acceptons Orange Money, MTN Mobile Money et Wave.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">Puis-je annuler mon abonnement ?</h3>
                        <p className="text-gray-600">Oui, vous pouvez annuler à tout moment. Vous conserverez l'accès Premium jusqu'à la fin de la période payée.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">Que se passe-t-il si j'atteins la limite gratuite ?</h3>
                        <p className="text-gray-600">Vous devrez passer à Premium ou supprimer des annonces existantes pour en publier de nouvelles.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

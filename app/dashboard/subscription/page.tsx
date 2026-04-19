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

    // Déterminer le plan actuel de l'utilisateur
    const currentPlanSlug = session?.user?.premiumTier || 'free';

    // Transformer les plans BDD en format d'affichage
    const displayPlans = plans.map(plan => ({
        id: plan.slug,
        name: plan.name,
        price: plan.price,
        period: '/mois',
        description: plan.description || '',
        features: plan.features,
        color: plan.slug === 'free' ? 'from-gray-500 to-gray-600' : (plan.slug === 'premium' ? 'from-orange-500 to-orange-600' : 'from-purple-600 to-indigo-700'),
        buttonText: plan.slug === currentPlanSlug ? 'Plan Actuel' : `Passer à ${plan.name}`,
        popular: plan.popular,
        isCurrent: plan.slug === currentPlanSlug,
        slug: plan.slug
    }));

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {displayPlans.map((plan: any) => (
                    <div
                        key={plan.id}
                        className={`relative bg-white rounded-3xl p-8 shadow-2xl border-2 transition-all duration-300 hover:scale-[1.03] ${plan.popular ? 'border-orange-500 ring-4 ring-orange-500/10' : 'border-gray-100 hover:border-gray-300'
                            } ${plan.isCurrent ? 'opacity-90' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
                                ⭐ RECOMMANDÉ
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
                            {plan.slug === 'free' ? '🌱' : (plan.slug === 'premium' ? '🚀' : '👑')}
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{plan.name}</h3>
                        <p className="text-gray-500 text-sm mb-6 h-10 line-clamp-2">{plan.description}</p>

                        <div className="mb-8 p-6 bg-gray-50 rounded-2xl flex flex-col items-center">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-gray-900">
                                    {plan.price.toLocaleString()}
                                </span>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">FCFA</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">{plan.period}</span>
                        </div>

                        <div className="space-y-4 mb-8 min-h-[200px]">
                            {plan.features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                                        ✓
                                    </div>
                                    <span className="text-gray-700 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {!plan.isCurrent ? (
                            <Link
                                href={`/dashboard/subscription/checkout?plan=${plan.slug}`}
                                className={`block w-full px-6 py-4 bg-gradient-to-r ${plan.color} text-white rounded-2xl hover:brightness-110 hover:shadow-xl transition-all font-black text-center text-lg active:scale-95`}
                            >
                                {plan.buttonText}
                            </Link>
                        ) : (
                            <div className="w-full px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-center text-lg flex items-center justify-center gap-2 border-2 border-dashed border-gray-200">
                                <span>✨</span>
                                {plan.buttonText}
                            </div>
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

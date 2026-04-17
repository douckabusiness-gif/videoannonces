'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BadgeCard, BadgeCheckButton } from '@/components/badges/BadgeDisplay';

interface Badge {
    type: string;
    name: string;
    nameFr: string;
    description: string;
    icon: string;
    color: string;
}

interface UserBadge {
    badgeType: string;
    awardedAt: string;
    badge: Badge;
}

export default function BadgesPage() {
    const { data: session } = useSession();
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchBadges();
        }
    }, [session]);

    const fetchBadges = async () => {
        try {
            // Récupérer tous les badges disponibles
            const badgesRes = await fetch('/api/users/profile');
            if (badgesRes.ok) {
                const userData = await badgesRes.json();

                // Récupérer les badges de l'utilisateur
                const userBadgesRes = await fetch(`/api/users/${session?.user?.id}/badges`);
                if (userBadgesRes.ok) {
                    const userBadgesData = await userBadgesRes.json();
                    setUserBadges(userBadgesData);
                }
            }

            // Récupérer tous les badges disponibles
            const allBadgesRes = await fetch('/api/badges');
            if (allBadgesRes.ok) {
                const allBadgesData = await allBadgesRes.json();
                setAllBadges(allBadgesData);
            }
        } catch (error) {
            console.error('Erreur chargement badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasBadge = (badgeType: string) => {
        return userBadges.some(ub => ub.badgeType === badgeType);
    };

    const getBadgeDate = (badgeType: string) => {
        const userBadge = userBadges.find(ub => ub.badgeType === badgeType);
        return userBadge ? new Date(userBadge.awardedAt) : undefined;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-gray-600">Chargement de vos badges...</p>
                </div>
            </div>
        );
    }

    const earnedCount = userBadges.length;
    const totalCount = allBadges.length;
    const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4">
                        Mes Badges 🏆
                    </h1>
                    <p className="text-base md:text-xl text-gray-600">
                        Débloquez des badges en accomplissant des objectifs !
                    </p>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm mb-6 md:mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900">Progression</h2>
                            <p className="text-sm md:text-base text-gray-600">
                                {earnedCount} sur {totalCount} badges obtenus
                            </p>
                        </div>
                        <div className="text-5xl">
                            {progress === 100 ? '🎉' : '🎯'}
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-2">
                        {Math.round(progress)}% complété
                    </p>
                </div>

                {/* Check Button */}
                <div className="mb-8">
                    <BadgeCheckButton />
                </div>

                {/* Badges Grid */}
                <div className="space-y-4 md:space-y-6">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900">Tous les badges</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {allBadges.map((badge) => (
                            <BadgeCard
                                key={badge.type}
                                icon={badge.icon}
                                name={badge.nameFr}
                                description={badge.description}
                                color={badge.color}
                                earned={hasBadge(badge.type)}
                                earnedAt={getBadgeDate(badge.type)}
                            />
                        ))}
                    </div>

                    {allBadges.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <div className="text-6xl mb-4">🏅</div>
                            <p className="text-gray-600">Aucun badge disponible pour le moment</p>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 md:mt-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
                    <h3 className="text-xl md:text-2xl font-black mb-4">💡 Comment obtenir des badges ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">🆕</div>
                            <strong>Nouveau Vendeur</strong>
                            <p className="text-white/90 mt-1">Automatique lors de l'inscription</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">⭐</div>
                            <strong>Premium</strong>
                            <p className="text-white/90 mt-1">Souscrivez à l'abonnement Premium</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">🏆</div>
                            <strong>Top Vendeur</strong>
                            <p className="text-white/90 mt-1">Réalisez plus de 50 ventes</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">⚡</div>
                            <strong>Réponse Rapide</strong>
                            <p className="text-white/90 mt-1">Répondez en moins d'1h en moyenne</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">🛡️</div>
                            <strong>De Confiance</strong>
                            <p className="text-white/90 mt-1">10+ avis avec 100% positifs</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-2xl mb-2">🎓</div>
                            <strong>Expert</strong>
                            <p className="text-white/90 mt-1">30+ annonces dans une catégorie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

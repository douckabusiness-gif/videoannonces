'use client';

import { useState, useEffect } from 'react';

interface Badge {
    type: string;
    name: string;
    nameFr: string;
    description: string;
    icon: string;
    color: string;
    criteria?: any;
}

interface UserBadge {
    badge: Badge;
    awardedAt: string;
}

interface BadgeListProps {
    userId: string;
}

export default function BadgeList({ userId }: BadgeListProps) {
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadges();
    }, [userId]);

    const fetchBadges = async () => {
        try {
            // Récupérer tous les badges
            const badgesRes = await fetch('/api/badges');
            const allBadgesData = await badgesRes.json();
            setAllBadges(allBadgesData);

            // Récupérer les badges de l'utilisateur
            const userBadgesRes = await fetch(`/api/users/${userId}/badges`);
            const userBadgesData = await userBadgesRes.json();
            setUserBadges(userBadgesData);
        } catch (error) {
            console.error('Erreur chargement badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasBadge = (badgeType: string) => {
        return userBadges.some((ub) => ub.badge.type === badgeType);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse h-32"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Badges Obtenus ({userBadges.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {allBadges.map((badge) => {
                        const earned = hasBadge(badge.type);
                        const userBadge = userBadges.find((ub) => ub.badge.type === badge.type);

                        return (
                            <div
                                key={badge.type}
                                className={`relative rounded-xl p-4 transition-all duration-300 ${earned
                                        ? 'bg-white shadow-lg hover:shadow-xl border-2'
                                        : 'bg-gray-100 opacity-50'
                                    }`}
                                style={earned ? { borderColor: badge.color } : {}}
                            >
                                {/* Badge Icon */}
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 ${earned ? 'shadow-lg' : 'grayscale'
                                        }`}
                                    style={earned ? { backgroundColor: badge.color } : { backgroundColor: '#E5E7EB' }}
                                >
                                    {badge.icon}
                                </div>

                                {/* Badge Name */}
                                <h4 className="text-center font-bold text-gray-900 mb-1">
                                    {badge.nameFr}
                                </h4>

                                {/* Description */}
                                <p className="text-xs text-gray-600 text-center line-clamp-2">
                                    {badge.description}
                                </p>

                                {/* Date d'obtention */}
                                {earned && userBadge && (
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Obtenu le {new Date(userBadge.awardedAt).toLocaleDateString('fr-FR')}
                                    </p>
                                )}

                                {/* Critères si non obtenu */}
                                {!earned && badge.criteria && (
                                    <div className="mt-2 text-xs text-gray-500 text-center">
                                        <p className="font-medium">Pour obtenir :</p>
                                        <p>{badge.criteria.description}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

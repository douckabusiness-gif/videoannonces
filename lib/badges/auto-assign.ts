import { prisma } from '@/lib/prisma';
import { BadgeType } from '@prisma/client';

interface BadgeCriteria {
    type: BadgeType;
    check: (userId: string) => Promise<boolean>;
    description: string;
}

/**
 * Service d'attribution automatique de badges
 */
export class BadgeService {

    /**
     * Vérifie et attribue tous les badges applicables pour un utilisateur
     */
    static async checkAndAssignBadges(userId: string): Promise<BadgeType[]> {
        const assignedBadges: BadgeType[] = [];

        for (const criteria of this.getAllCriteria()) {
            const shouldHaveBadge = await criteria.check(userId);
            const hasBadge = await this.userHasBadge(userId, criteria.type);

            if (shouldHaveBadge && !hasBadge) {
                await this.assignBadge(userId, criteria.type);
                assignedBadges.push(criteria.type);
            } else if (!shouldHaveBadge && hasBadge) {
                // Retirer le badge si les critères ne sont plus remplis
                await this.removeBadge(userId, criteria.type);
            }
        }

        return assignedBadges;
    }

    /**
     * Vérifie si un utilisateur a un badge spécifique
     */
    static async userHasBadge(userId: string, badgeType: BadgeType): Promise<boolean> {
        const badge = await prisma.userBadge.findUnique({
            where: {
                userId_badgeType: {
                    userId,
                    badgeType
                }
            }
        });

        return badge !== null && (!badge.expiresAt || badge.expiresAt > new Date());
    }

    /**
     * Attribue un badge à un utilisateur
     */
    static async assignBadge(userId: string, badgeType: BadgeType): Promise<void> {
        try {
            // Vérifier si le badge existe dans la table Badge
            const badgeExists = await prisma.badge.findUnique({
                where: { type: badgeType }
            });

            if (!badgeExists) {
                console.warn(`Badge ${badgeType} n'existe pas dans la table Badge`);
                return;
            }

            // Créer l'attribution
            await prisma.userBadge.create({
                data: {
                    userId,
                    badgeType,
                    awardedAt: new Date(),
                    // Certains badges expirent (ex: PREMIUM)
                    expiresAt: badgeType === BadgeType.PREMIUM ? undefined : null
                }
            });

            // Créer une notification
            await this.createBadgeNotification(userId, badgeType);

            console.log(`✅ Badge ${badgeType} attribué à l'utilisateur ${userId}`);
        } catch (error) {
            console.error(`Erreur attribution badge ${badgeType}:`, error);
        }
    }

    /**
     * Retire un badge à un utilisateur
     */
    static async removeBadge(userId: string, badgeType: BadgeType): Promise<void> {
        try {
            await prisma.userBadge.delete({
                where: {
                    userId_badgeType: {
                        userId,
                        badgeType
                    }
                }
            });

            console.log(`🗑️ Badge ${badgeType} retiré de l'utilisateur ${userId}`);
        } catch (error) {
            // Ignore si le badge n'existe pas
        }
    }

    /**
     * Crée une notification pour l'attribution d'un badge
     */
    static async createBadgeNotification(userId: string, badgeType: BadgeType): Promise<void> {
        try {
            const badge = await prisma.badge.findUnique({
                where: { type: badgeType }
            });

            if (!badge) return;

            await prisma.notification.create({
                data: {
                    userId,
                    type: 'SYSTEM',
                    title: `🏆 Nouveau badge obtenu !`,
                    body: `Félicitations ! Vous avez obtenu le badge "${badge.nameFr}" ${badge.icon}`,
                    icon: badge.icon,
                    url: '/dashboard/settings',
                    data: {
                        badgeType,
                        badgeName: badge.nameFr
                    }
                }
            });
        } catch (error) {
            console.error('Erreur création notification badge:', error);
        }
    }

    /**
     * Définit tous les critères de badges
     */
    static getAllCriteria(): BadgeCriteria[] {
        return [
            {
                type: BadgeType.NEW_SELLER,
                description: 'Nouveau vendeur (moins de 30 jours)',
                check: async (userId: string) => {
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { createdAt: true }
                    });

                    if (!user) return false;

                    const daysSinceCreation = Math.floor(
                        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return daysSinceCreation < 30;
                }
            },
            {
                type: BadgeType.PREMIUM,
                description: 'Abonnement Premium actif',
                check: async (userId: string) => {
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { premium: true, premiumUntil: true }
                    });

                    if (!user) return false;

                    return user.premium && (!user.premiumUntil || user.premiumUntil > new Date());
                }
            },
            {
                type: BadgeType.TOP_SELLER,
                description: 'Plus de 50 ventes',
                check: async (userId: string) => {
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { totalSales: true }
                    });

                    return (user?.totalSales || 0) >= 50;
                }
            },
            {
                type: BadgeType.FAST_RESPONDER,
                description: 'Répond en moins d\'1 heure en moyenne',
                check: async (userId: string) => {
                    // Récupérer les 20 dernières conversations
                    const conversations = await prisma.conversation.findMany({
                        where: { sellerId: userId },
                        take: 20,
                        orderBy: { updatedAt: 'desc' },
                        include: {
                            messages: {
                                orderBy: { createdAt: 'asc' },
                                take: 10
                            }
                        }
                    });

                    if (conversations.length < 5) return false;

                    let totalResponseTime = 0;
                    let responseCount = 0;

                    for (const conv of conversations) {
                        const messages = conv.messages;
                        for (let i = 1; i < messages.length; i++) {
                            if (messages[i].senderId === userId && messages[i - 1].senderId !== userId) {
                                const responseTime = messages[i].createdAt.getTime() - messages[i - 1].createdAt.getTime();
                                totalResponseTime += responseTime;
                                responseCount++;
                            }
                        }
                    }

                    if (responseCount === 0) return false;

                    const avgResponseTime = totalResponseTime / responseCount;
                    const oneHourInMs = 60 * 60 * 1000;

                    return avgResponseTime < oneHourInMs;
                }
            },
            {
                type: BadgeType.TRUSTED,
                description: '100% avis positifs avec au moins 10 avis',
                check: async (userId: string) => {
                    const reviews = await prisma.review.findMany({
                        where: { reviewedId: userId }
                    });

                    if (reviews.length < 10) return false;

                    const allPositive = reviews.every(review => review.rating >= 4);

                    return allPositive;
                }
            },
            {
                type: BadgeType.EXPERT,
                description: 'Plus de 30 annonces dans la même catégorie',
                check: async (userId: string) => {
                    const listings = await prisma.listing.findMany({
                        where: {
                            userId,
                            status: { in: ['active', 'sold'] }
                        },
                        select: { category: true }
                    });

                    if (listings.length < 30) return false;

                    // Compter par catégorie
                    const categoryCounts: Record<string, number> = {};
                    for (const listing of listings) {
                        categoryCounts[listing.category] = (categoryCounts[listing.category] || 0) + 1;
                    }

                    // Vérifier si au moins une catégorie a 30+ annonces
                    return Object.values(categoryCounts).some(count => count >= 30);
                }
            }
        ];
    }

    /**
     * Vérifie un badge spécifique pour un utilisateur
     */
    static async checkSpecificBadge(userId: string, badgeType: BadgeType): Promise<boolean> {
        const criteria = this.getAllCriteria().find(c => c.type === badgeType);
        if (!criteria) return false;

        const shouldHave = await criteria.check(userId);
        const has = await this.userHasBadge(userId, badgeType);

        if (shouldHave && !has) {
            await this.assignBadge(userId, badgeType);
            return true;
        } else if (!shouldHave && has) {
            await this.removeBadge(userId, badgeType);
        }

        return false;
    }
}

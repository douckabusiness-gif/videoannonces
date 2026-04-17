import { prisma } from '@/lib/prisma';
import { BadgeType } from '@prisma/client';

interface BadgeCriteria {
    minSales?: number;
    minRating?: number;
    minReviews?: number;
    maxAccountAge?: number; // en jours
    responseTime?: number; // en heures
    isPremium?: boolean;
}

/**
 * Vérifie et attribue automatiquement les badges à un utilisateur
 */
export async function checkAndAwardBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            badges: true,
            reviews: true,
            listings: true,
        },
    });

    if (!user) return;

    const accountAgeDays = Math.floor(
        (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // TOP_SELLER: >50 ventes
    if (user.totalSales >= 50) {
        await awardBadge(userId, BadgeType.TOP_SELLER);
    } else {
        await removeBadge(userId, BadgeType.TOP_SELLER);
    }

    // TRUSTED: 100% avis positifs (min 10 avis)
    const positiveReviews = user.reviews.filter((r) => r.rating >= 4).length;
    if (user.reviews.length >= 10 && positiveReviews === user.reviews.length) {
        await awardBadge(userId, BadgeType.TRUSTED);
    } else {
        await removeBadge(userId, BadgeType.TRUSTED);
    }

    // NEW_SELLER: Compte < 30 jours
    if (accountAgeDays < 30) {
        await awardBadge(userId, BadgeType.NEW_SELLER);
    } else {
        await removeBadge(userId, BadgeType.NEW_SELLER);
    }

    // PREMIUM: Abonnement premium actif
    if (user.premium && user.premiumUntil && user.premiumUntil > new Date()) {
        await awardBadge(userId, BadgeType.PREMIUM);
    } else {
        await removeBadge(userId, BadgeType.PREMIUM);
    }

    // VERIFIED: Vérifié manuellement (ne pas retirer automatiquement)
    // FAST_RESPONDER: À calculer depuis les messages (TODO)
    // EXPERT: À définir par catégorie (TODO)
}

/**
 * Attribue un badge à un utilisateur
 */
export async function awardBadge(userId: string, badgeType: BadgeType) {
    try {
        // Vérifier si l'utilisateur a déjà ce badge
        const existing = await prisma.userBadge.findUnique({
            where: {
                userId_badgeType: {
                    userId,
                    badgeType,
                },
            },
        });

        if (existing) return; // Déjà attribué

        // Attribuer le badge
        await prisma.userBadge.create({
            data: {
                userId,
                badgeType,
            },
        });

        console.log(`Badge ${badgeType} attribué à ${userId}`);
    } catch (error) {
        console.error(`Erreur attribution badge ${badgeType}:`, error);
    }
}

/**
 * Retire un badge à un utilisateur
 */
export async function removeBadge(userId: string, badgeType: BadgeType) {
    try {
        await prisma.userBadge.deleteMany({
            where: {
                userId,
                badgeType,
            },
        });
    } catch (error) {
        // Ignore si le badge n'existe pas
    }
}

/**
 * Attribue manuellement un badge (admin)
 */
export async function manuallyAwardBadge(
    userId: string,
    badgeType: BadgeType,
    expiresAt?: Date
) {
    return await prisma.userBadge.upsert({
        where: {
            userId_badgeType: {
                userId,
                badgeType,
            },
        },
        create: {
            userId,
            badgeType,
            expiresAt,
        },
        update: {
            expiresAt,
            awardedAt: new Date(),
        },
    });
}

/**
 * Récupère tous les badges d'un utilisateur
 */
export async function getUserBadges(userId: string) {
    return await prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { awardedAt: 'desc' },
    });
}

/**
 * Vérifie si un utilisateur a un badge spécifique
 */
export async function hasBadge(userId: string, badgeType: BadgeType): Promise<boolean> {
    const badge = await prisma.userBadge.findUnique({
        where: {
            userId_badgeType: {
                userId,
                badgeType,
            },
        },
    });

    return !!badge;
}

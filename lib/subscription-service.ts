import { prisma } from './prisma';

export interface PlanLimits {
    maxListings: number | null;
    maxVideosPerListing: number;
    maxVideoDuration: number | null;
    allowSubdomain: boolean;
    allowCustomDomain: boolean;
    allowLiveStreaming: boolean;
    allowStories: boolean;
}

export class SubscriptionService {
    /**
     * Récupère le plan actif d'un utilisateur
     */
    static async getUserPlan(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                premiumTier: true,
                isPremium: true,
                premiumUntil: true,
            }
        });

        if (!user) return null;

        // Si l'utilisateur n'est pas premium ou que son abonnement a expiré, on retourne le plan free
        if (!user.isPremium || (user.premiumUntil && user.premiumUntil < new Date())) {
            return await prisma.subscriptionPlan.findUnique({ where: { slug: 'free' } });
        }

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { slug: user.premiumTier || 'free' }
        });

        return plan || await prisma.subscriptionPlan.findUnique({ where: { slug: 'free' } });
    }

    /**
     * Vérifie si un utilisateur peut créer une nouvelle annonce
     */
    static async canCreateListing(userId: string): Promise<{ allowed: boolean; error?: string }> {
        const plan = await this.getUserPlan(userId);
        if (!plan) return { allowed: false, error: 'Utilisateur non trouvé' };

        if (plan.maxListings === null) return { allowed: true };

        const activeListings = await prisma.listing.count({
            where: {
                userId,
                status: 'active'
            }
        });

        if (activeListings >= plan.maxListings) {
            return {
                allowed: false,
                error: `Votre plan actuel (${plan.name}) est limité à ${plan.maxListings} annonces actives.`
            };
        }

        return { allowed: true };
    }

    /**
     * Vérifie si un utilisateur a accès à une fonctionnalité spécifique
     */
    static async hasFeature(userId: string, feature: keyof PlanLimits): Promise<boolean> {
        const plan = await this.getUserPlan(userId);
        if (!plan) return false;

        return !!plan[feature];
    }
}

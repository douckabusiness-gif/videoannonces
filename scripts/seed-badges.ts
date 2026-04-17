import { PrismaClient, BadgeType } from '@prisma/client';

const prisma = new PrismaClient();

const badges = [
    {
        type: BadgeType.VERIFIED,
        name: 'Verified',
        nameFr: 'Vérifié',
        nameAr: 'موثق',
        description: 'Identité vérifiée par l\'équipe VideoBoutique',
        icon: '✅',
        color: '#10B981',
        criteria: {
            manual: true,
            description: 'Vérification manuelle de l\'identité'
        }
    },
    {
        type: BadgeType.TOP_SELLER,
        name: 'Top Seller',
        nameFr: 'Top Vendeur',
        nameAr: 'أفضل بائع',
        description: 'Plus de 50 ventes réussies',
        icon: '🏆',
        color: '#F59E0B',
        criteria: {
            totalSales: 50,
            description: 'Avoir réalisé plus de 50 ventes'
        }
    },
    {
        type: BadgeType.FAST_RESPONDER,
        name: 'Fast Responder',
        nameFr: 'Réponse Rapide',
        nameAr: 'استجابة سريعة',
        description: 'Répond en moins d\'1 heure en moyenne',
        icon: '⚡',
        color: '#3B82F6',
        criteria: {
            avgResponseTime: 3600,
            description: 'Temps de réponse moyen inférieur à 1 heure'
        }
    },
    {
        type: BadgeType.PREMIUM,
        name: 'Premium',
        nameFr: 'Premium',
        nameAr: 'بريميوم',
        description: 'Membre Premium actif',
        icon: '⭐',
        color: '#8B5CF6',
        criteria: {
            premiumActive: true,
            description: 'Abonnement Premium actif'
        }
    },
    {
        type: BadgeType.NEW_SELLER,
        name: 'New Seller',
        nameFr: 'Nouveau Vendeur',
        nameAr: 'بائع جديد',
        description: 'Nouveau sur VideoBoutique (moins de 30 jours)',
        icon: '🆕',
        color: '#06B6D4',
        criteria: {
            accountAge: 30,
            description: 'Compte créé il y a moins de 30 jours'
        }
    },
    {
        type: BadgeType.TRUSTED,
        name: 'Trusted',
        nameFr: 'De Confiance',
        nameAr: 'موثوق',
        description: '100% d\'avis positifs avec au moins 10 avis',
        icon: '🛡️',
        color: '#14B8A6',
        criteria: {
            minReviews: 10,
            minRating: 4.0,
            description: 'Au moins 10 avis avec une note moyenne de 4/5 ou plus'
        }
    },
    {
        type: BadgeType.EXPERT,
        name: 'Expert',
        nameFr: 'Expert',
        nameAr: 'خبير',
        description: 'Spécialiste d\'une catégorie (30+ annonces)',
        icon: '🎓',
        color: '#EC4899',
        criteria: {
            categoryListings: 30,
            description: 'Plus de 30 annonces dans une même catégorie'
        }
    }
];

async function main() {
    console.log('🏅 Initialisation des badges...');

    for (const badge of badges) {
        try {
            const existing = await prisma.badge.findUnique({
                where: { type: badge.type }
            });

            if (existing) {
                // Mettre à jour si existe déjà
                await prisma.badge.update({
                    where: { type: badge.type },
                    data: {
                        name: badge.name,
                        nameFr: badge.nameFr,
                        nameAr: badge.nameAr,
                        description: badge.description,
                        icon: badge.icon,
                        color: badge.color,
                        criteria: badge.criteria
                    }
                });
                console.log(`✅ Badge ${badge.nameFr} mis à jour`);
            } else {
                // Créer si n'existe pas
                await prisma.badge.create({
                    data: badge
                });
                console.log(`✨ Badge ${badge.nameFr} créé`);
            }
        } catch (error) {
            console.error(`❌ Erreur pour ${badge.nameFr}:`, error);
        }
    }

    console.log('🎉 Initialisation des badges terminée !');
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

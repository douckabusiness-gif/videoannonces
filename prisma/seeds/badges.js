import { PrismaClient, BadgeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏆 Seeding badges...');

    const badges = [
        {
            type: BadgeType.VERIFIED,
            name: 'Verified',
            nameFr: 'Vérifié',
            nameAr: 'موثق',
            description: 'Identité vérifiée par l\'équipe VideoBoutique',
            icon: '✓',
            color: '#3B82F6',
            criteria: { manual: true, description: 'Vérification manuelle par admin' },
        },
        {
            type: BadgeType.TOP_SELLER,
            name: 'Top Seller',
            nameFr: 'Top Vendeur',
            nameAr: 'أفضل بائع',
            description: 'Plus de 50 ventes réussies',
            icon: '👑',
            color: '#F59E0B',
            criteria: { minSales: 50, description: 'Minimum 50 ventes' },
        },
        {
            type: BadgeType.FAST_RESPONDER,
            name: 'Fast Responder',
            nameFr: 'Réponse Rapide',
            nameAr: 'استجابة سريعة',
            description: 'Répond généralement en moins d\'1 heure',
            icon: '⚡',
            color: '#10B981',
            criteria: { responseTime: 1, description: 'Temps de réponse moyen < 1h' },
        },
        {
            type: BadgeType.PREMIUM,
            name: 'Premium',
            nameFr: 'Premium',
            nameAr: 'مميز',
            description: 'Membre premium de VideoBoutique',
            icon: '⭐',
            color: '#8B5CF6',
            criteria: { isPremium: true, description: 'Abonnement premium actif' },
        },
        {
            type: BadgeType.NEW_SELLER,
            name: 'New Seller',
            nameFr: 'Nouveau Vendeur',
            nameAr: 'بائع جديد',
            description: 'Nouveau sur la plateforme',
            icon: '🌟',
            color: '#06B6D4',
            criteria: { maxAccountAge: 30, description: 'Compte créé il y a moins de 30 jours' },
        },
        {
            type: BadgeType.TRUSTED,
            name: 'Trusted',
            nameFr: 'Fiable',
            nameAr: 'موثوق',
            description: '100% d\'avis positifs',
            icon: '🛡️',
            color: '#14B8A6',
            criteria: { minRating: 4, minReviews: 10, description: 'Minimum 10 avis, tous positifs (≥4 étoiles)' },
        },
        {
            type: BadgeType.EXPERT,
            name: 'Expert',
            nameFr: 'Expert',
            nameAr: 'خبير',
            description: 'Spécialiste dans une catégorie',
            icon: '🎓',
            color: '#EF4444',
            criteria: { manual: true, description: 'Attribution manuelle pour expertise' },
        },
    ];

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { type: badge.type },
            update: badge,
            create: badge,
        });
        console.log(`✓ Badge ${badge.nameFr} créé/mis à jour`);
    }

    console.log('✅ Badges seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

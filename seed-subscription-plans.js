const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Création des plans d\'abonnement...');

    // Vérifier si les plans existent déjà
    const existing = await prisma.subscriptionPlan.findMany();
    if (existing.length > 0) {
        console.log('✅ Plans déjà existants, skip.');
        return;
    }

    // Créer le plan Premium
    const premiumPlan = await prisma.subscriptionPlan.create({
        data: {
            name: 'Premium',
            slug: 'premium',
            description: 'Pour les vendeurs professionnels',
            price: 5000, // 5000 FCFA/mois
            features: [
                '✨ Annonces illimitées',
                '🌐 Sous-domaine personnalisé (monshop.videoboutique.ci)',
                '🚀 Boost d\'annonces',
                '📊 Analytics avancés',
                '⏰ Durée illimitée',
                '✅ Badge vérifié',
                '🎯 Support prioritaire',
            ],
            maxListings: null, // Illimité
            maxVideosPerListing: 5,
            maxVideoDuration: 120, // 2 minutes
            allowSubdomain: true,
            allowCustomDomain: false,
            allowLiveStreaming: true,
            allowStories: true,
            active: true,
            popular: true,
            color: '#FF6B35',
        },
    });

    // Créer le plan Pro (optionnel, plus cher)
    const proPlan = await prisma.subscriptionPlan.create({
        data: {
            name: 'Pro',
            slug: 'pro',
            description: 'Pour les grandes entreprises',
            price: 15000, // 15000 FCFA/mois
            features: [
                '🌟 Tout Premium +',
                '🏢 Domaine personnalisé',
                '📺 Live Shopping',
                '🤖 Automatisation avancée',
                '👥 Multi-utilisateurs',
                '📞 Support téléphonique',
                '🎨 Design sur mesure',
            ],
            maxListings: null,
            maxVideosPerListing: 10,
            maxVideoDuration: 300, // 5 minutes
            allowSubdomain: true,
            allowCustomDomain: true,
            allowLiveStreaming: true,
            allowStories: true,
            active: true,
            popular: false,
            color: '#FDC830',
        },
    });

    console.log('✅ Plans créés :');
    console.log('  - Premium (5000 FCFA/mois)');
    console.log('  - Pro (15000 FCFA/mois)');
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

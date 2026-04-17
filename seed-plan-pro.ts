import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlan() {
    console.log('🌱 Initialisation du Plan Pro...\n');

    const planData = {
        name: 'Pro',
        slug: 'pro',
        description: 'Plan professionnel avec toutes les fonctionnalités premium : domaine personnalisé, annonces illimitées, live streaming, stories et support prioritaire.',
        price: 25000, // 25000 FCFA/mois
        features: [
            'Annonces illimitées',
            'Vidéos jusqu\'à 5 minutes',
            'Sous-domaine personnalisé (votreboutique.videoboutique.com)',
            'Domaine personnalisé (votresite.com)',
            'Live streaming illimité',
            'Stories 24h illimitées',
            'Badge "PRO" sur votre profil',
            'Statistiques avancées',
            'Support prioritaire 24/7',
            'Pas de publicités'
        ],
        maxListings: null, // Illimité
        maxVideoDuration: 300, // 5 minutes en secondes
        allowSubdomain: true,
        allowCustomDomain: true,
        allowLiveStreaming: true,
        allowStories: true,
        priority: 1,
        active: true,
        popular: true,
        color: '#FF6B35' // Orange premium
    };

    try {
        // Vérifier si le plan existe déjà
        const existing = await prisma.subscriptionPlan.findUnique({
            where: { slug: 'pro' }
        });

        if (existing) {
            console.log('✓ Plan Pro existe déjà, mise à jour...');
            await prisma.subscriptionPlan.update({
                where: { slug: 'pro' },
                data: planData
            });
            console.log('✓ Plan Pro mis à jour');
        } else {
            console.log('✓ Création du Plan Pro...');
            await prisma.subscriptionPlan.create({
                data: planData
            });
            console.log('✓ Plan Pro créé');
        }

        console.log('\n📊 Détails du Plan Pro:');
        console.log(`   Nom: ${planData.name}`);
        console.log(`   Prix: ${planData.price.toLocaleString()} FCFA/mois`);
        console.log(`   Annonces: Illimitées`);
        console.log(`   Vidéos: ${planData.maxVideoDuration / 60} minutes max`);
        console.log(`   Sous-domaine: ✅`);
        console.log(`   Domaine personnalisé: ✅`);
        console.log(`   Live streaming: ✅`);
        console.log(`   Stories: ✅`);
        console.log(`   Fonctionnalités: ${planData.features.length} incluses`);

        console.log('\n✅ Initialisation terminée!');
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedPlan();

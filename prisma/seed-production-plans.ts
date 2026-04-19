import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Nettoyage et création des plans de production...');

  // 1. Supprimer les anciens plans pour repartir sur une base propre
  await prisma.subscriptionPlan.deleteMany({});

  // 2. Créer le plan GRATUIT
  const freePlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Gratuit',
      slug: 'free',
      description: 'Idéal pour tester la plateforme et diffuser vos premières annonces.',
      price: 0,
      features: [
        '5 annonces actives',
        '1 vidéo par annonce',
        'Vidéos de 60 secondes max',
        'Statistiques de base',
        'Support standard'
      ],
      maxListings: 5,
      maxVideosPerListing: 1,
      maxVideoDuration: 60,
      allowSubdomain: false,
      allowCustomDomain: false,
      allowLiveStreaming: false,
      allowStories: false,
      priority: 0,
      active: true,
      popular: false,
      color: '#6B7280' // Gris
    }
  });

  // 3. Créer le plan BOUTIQUE PREMIUM (Le seul plan payant à 25k)
  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Boutique Premium',
      slug: 'premium',
      description: 'La solution complète pour les vendeurs professionnels. Boutique exclusive, domaine personnalisé et visibilité maximale.',
      price: 25000,
      features: [
        '✨ Annonces illimitées',
        '📹 Vidéos de 2 minutes (120s) max',
        '🌐 Sous-domaine personnalisé (boutique.afrivideoannonce.com)',
        '🌍 Domaine personnalisé (votre-site.com)',
        '📊 Analytics avancés & Insights',
        '📱 Accès aux Stories Vendeurs',
        '🚀 Boost prioritaire des annonces',
        '✅ Badge de confiance vérifié',
        '🎭 Interface Luxury Elite',
        '🤖 Assistant IA (Réponses automatiques)',
        '📞 Support prioritaire 24/7'
      ],
      maxListings: null, // Illimité
      maxVideosPerListing: 5,
      maxVideoDuration: 120, // 2 minutes
      allowSubdomain: true,
      allowCustomDomain: true,
      allowLiveStreaming: true,
      allowStories: true,
      priority: 1,
      active: true,
      popular: true,
      color: '#F97316' // Orange Premium
    }
  });

  console.log('✅ Base de données mise à jour avec succès !');
  console.log('---');
  console.log(`Plan: ${freePlan.name} - ${freePlan.price} FCFA`);
  console.log(`Plan: ${premiumPlan.name} - ${premiumPlan.price} FCFA`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

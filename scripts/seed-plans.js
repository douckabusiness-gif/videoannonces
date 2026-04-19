const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Strat Seeding Subscription Plans...');

  const plans = [
    {
      name: 'Gratuit',
      slug: 'free',
      description: 'Idéal pour tester la plateforme',
      price: 0,
      features: ['5 annonces max', '1 vidéo par annonce', 'Vidéos de 60s max', 'Support standard'],
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
      color: '#6B7280', // Gray
    },
    {
      name: 'Premium',
      slug: 'premium',
      description: 'Pour les vendeurs ambitieux',
      price: 10000,
      features: ['50 annonces max', '3 vidéos par annonce', 'Vidéos de 120s max', 'Sous-domaine personnalisé', 'Statistiques avancées', 'Accès aux Stories'],
      maxListings: 50,
      maxVideosPerListing: 3,
      maxVideoDuration: 120,
      allowSubdomain: true,
      allowCustomDomain: false,
      allowLiveStreaming: false,
      allowStories: true,
      priority: 1,
      active: true,
      popular: true,
      color: '#F97316', // Orange
    },
    {
      name: 'Professionnel',
      slug: 'pro',
      description: 'La solution complète pour boutiques',
      price: 25000,
      features: ['Annonces illimitées', '5 vidéos par annonce', 'Vidéos de 5min max', 'Domaine personnalisé', 'Live Streaming illimité', 'Support VIP 24/7'],
      maxListings: null, // Unlimited
      maxVideosPerListing: 5,
      maxVideoDuration: 300,
      allowSubdomain: true,
      allowCustomDomain: true,
      allowLiveStreaming: true,
      allowStories: true,
      priority: 2,
      active: true,
      popular: false,
      color: '#8B5CF6', // Purple
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
    console.log(`✅ Plan ${plan.name} upserted.`);
  }

  console.log('✔ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

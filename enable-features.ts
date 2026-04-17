import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function enableFeatures() {
  console.log('Connexion à la base de données...');

  // Afficher les paramètres actuels
  const current = await prisma.setting.findMany({
    where: { key: { startsWith: 'platform.' } },
  });
  console.log('\nParametres actuels:', JSON.stringify(current, null, 2));

  // Activer l'inscription publique
  await prisma.setting.upsert({
    where: { key: 'platform.public_registration_enabled' },
    create: { key: 'platform.public_registration_enabled', value: 'true', description: 'Inscription publique activee' },
    update: { value: 'true' },
  });
  console.log('\n✅ Inscription publique : ACTIVEE');

  // Activer le mode multi-vendeur
  await prisma.setting.upsert({
    where: { key: 'platform.signup_default_vendor' },
    create: { key: 'platform.signup_default_vendor', value: 'true', description: 'Nouveaux comptes crees comme vendeur' },
    update: { value: 'true' },
  });
  console.log('✅ Mode multi-vendeur (signup_default_vendor) : ACTIVE');

  // Vérifier le résultat
  const updated = await prisma.setting.findMany({
    where: { key: { startsWith: 'platform.' } },
  });
  console.log('\nParametres mis à jour:', JSON.stringify(updated, null, 2));

  await prisma.$disconnect();
  console.log('\nTerminé avec succès !');
}

enableFeatures().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});

/**
 * Script pour corriger le statut vendeur
 * Lance ce script avec: node fix-vendor.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const targetPhone = '0759579042';

    console.log(`🔧 Correction du statut vendeur pour ${targetPhone}\n`);
    console.log('='.repeat(50));

    // Mettre à jour isVendor = true
    const updated = await prisma.user.update({
        where: { phone: targetPhone },
        data: { isVendor: true }
    });

    console.log('\n✅ CORRECTION RÉUSSIE !\n');
    console.log(`Nom: ${updated.name}`);
    console.log(`Téléphone: ${updated.phone}`);
    console.log(`isVendor: ${updated.isVendor ? '✅ OUI' : '❌ NON'}`);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Le compte peut maintenant accéder à /dashboard');
    console.log('='.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

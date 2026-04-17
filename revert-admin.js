/**
 * Script pour rétrograder un utilisateur ADMIN en USER/VENDOR
 * Lance ce script avec: node revert-admin.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Rétrogradation Utilisateur\n');
    console.log('=' .repeat(50));

    // Lister les admins
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            createdAt: true
        }
    });

    console.log(`\n📊 ${admins.length} administrateur(s) trouvé(s):\n`);
    admins.forEach((user, idx) => {
        console.log(`${idx + 1}. 👑 ${user.name}`);
        console.log(`   📱 ${user.phone}`);
        console.log(`   📅 Créé: ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`);
        console.log('');
    });

    // Rétrograder Oumar Doucoure (0709194341) qui a été promu par erreur
    const targetPhone = '0709194341';
    const targetUser = admins.find(u => u.phone === targetPhone);

    if (!targetUser) {
        console.log(`❌ Utilisateur ${targetPhone} non trouvé ou n'est pas ADMIN`);
        return;
    }

    console.log(`\n🎯 Rétrogradation de : ${targetUser.name} (${targetPhone})`);
    console.log(`   De: ADMIN → Vers: USER`);

    // Mise à jour
    await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'USER' }
    });

    console.log('\n✅ Rétrogradation réussie !');
    console.log(`\n📋 ${targetUser.name} est maintenant USER\n`);
    console.log('=' .repeat(50));

    // Vérification
    const updated = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { name: true, phone: true, role: true }
    });

    console.log('\n✓ Vérification:');
    console.log(`  ${updated?.name} (${updated?.phone}) → ${updated?.role}`);
    console.log('\nCe compte peut maintenant accéder normalement au dashboard vendeur.');
    console.log('=' .repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

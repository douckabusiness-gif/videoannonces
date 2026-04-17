/**
 * Script pour promouvoir un utilisateur en ADMIN
 * Lance ce script avec: npx ts-node make-admin.ts
 * 
 * Ce script va :
 * 1. Lister tous les utilisateurs
 * 2. Vous permettre de choisir qui devient admin
 * 3. Mettre à jour le rôle en ADMIN
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('👑 Promotion Administrateur\n');
    console.log('='.repeat(50));

    // 1. Lister tous les utilisateurs
    console.log('\n[1/3] Liste des utilisateurs:');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (users.length === 0) {
        console.log('❌ Aucun utilisateur trouvé dans la base de données !');
        console.log('Créez d\'abord un compte via l\'application.');
        return;
    }

    console.log(`\n📊 ${users.length} utilisateur(s) trouvé(s):\n`);
    users.forEach((user, idx) => {
        const roleEmoji = user.role === 'ADMIN' ? '👑' : user.role === 'VENDOR' ? '🏪' : '👤';
        const roleColor = user.role === 'ADMIN' ? '✨' : '';
        console.log(`${idx + 1}. ${roleEmoji} ${user.name}`);
        console.log(`   📱 ${user.phone || user.email || 'Pas de contact'}`);
        console.log(`   🎭 Rôle: ${user.role} ${roleColor}`);
        console.log(`   📅 Créé: ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`);
        console.log('');
    });

    // 2. Promouvoir le premier utilisateur (ou tous si vous voulez)
    console.log('\n[2/3] Promotion en ADMIN:');
    console.log('Options:');
    console.log('  1. Promouvoir le premier utilisateur (le plus ancien)');
    console.log('  2. Promouvoir TOUS les utilisateurs');
    console.log('  3. Manuel (modifier le script)\n');

    // Par défaut, on promeut le premier utilisateur
    const targetUser = users[0];

    if (targetUser.role === 'ADMIN') {
        console.log(`✅ ${targetUser.name} est déjà ADMIN !`);
        console.log('Aucune action nécessaire.');
        return;
    }

    console.log(`🎯 Promotion de : ${targetUser.name}`);
    console.log(`   De: ${targetUser.role} → Vers: ADMIN`);

    // 3. Mise à jour
    console.log('\n[3/3] Mise à jour du rôle...');
    await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'ADMIN' }
    });

    console.log('✅ Promotion réussie !');
    console.log(`\n👑 ${targetUser.name} est maintenant ADMIN\n`);

    console.log('='.repeat(50));
    console.log('🎉 SUCCÈS !');
    console.log('\nActions suivantes:');
    console.log('  1. Déconnectez-vous de l\'application');
    console.log('  2. Reconnectez-vous');
    console.log('  3. Accédez à /admin/automation');
    console.log('\n💡 Astuce: La session doit être rafraîchie pour voir les nouveaux droits');
    console.log('='.repeat(50));

    // Vérification finale
    const updatedUser = await prisma.user.findUnique({
        where: { id: targetUser.id },
        select: { name: true, role: true }
    });

    console.log('\n✓ Vérification:');
    console.log(`  ${updatedUser?.name} → ${updatedUser?.role}`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

/**
 * Script pour vérifier l'état d'un utilisateur spécifique
 * Lance ce script avec: node check-user.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const targetPhone = '0759579042';

    console.log(`🔍 Vérification du compte ${targetPhone}\n`);
    console.log('='.repeat(50));

    const user = await prisma.user.findUnique({
        where: { phone: targetPhone },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isVendor: true,
            createdAt: true,
            _count: {
                select: {
                    listings: true,
                    conversations: true
                }
            }
        }
    });

    if (!user) {
        console.log('❌ Utilisateur non trouvé !');
        return;
    }

    console.log('\n📊 INFORMATIONS DU COMPTE:\n');
    console.log(`Nom: ${user.name}`);
    console.log(`Téléphone: ${user.phone}`);
    console.log(`Email: ${user.email || 'Non renseigné'}`);
    console.log(`Rôle: ${user.role}`);
    console.log(`Vendeur: ${user.isVendor ? '✅ OUI' : '❌ NON'}`);
    console.log(`Annonces: ${user._count.listings}`);
    console.log(`Conversations: ${user._count.conversations}`);
    console.log(`Créé le: ${new Date(user.createdAt).toLocaleDateString('fr-FR')}`);

    console.log('\n📋 ACCÈS AUTORISÉS:\n');
    console.log(`/ (Accueil): ✅ OUI`);
    console.log(`/messages: ✅ OUI (connecté)`);
    console.log(`/dashboard: ${user.isVendor ? '✅ OUI (vendeur)' : '❌ NON (pas vendeur)'}`);
    console.log(`/admin: ${user.role === 'ADMIN' ? '✅ OUI' : '❌ NON'}`);

    if (!user.isVendor && user._count.listings > 0) {
        console.log('\n⚠️ ANOMALIE DÉTECTÉE:');
        console.log(`Ce compte a ${user._count.listings} annonce(s) mais isVendor = false`);
        console.log('Cela devrait être automatiquement corrigé lors de la création d\'annonce.');
    }

    console.log('\n='.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

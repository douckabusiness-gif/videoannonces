import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnose() {
    console.log('🔍 DÉBUT DU DIAGNOSTIC SYSTÈME PAIEMENT\n');

    try {
        // 1. Vérification des Boost Packages
        console.log('1️⃣ Vérification des Boost Packages en DB...');
        const boosts = await prisma.boostPackage.findMany();
        if (boosts.length === 0) {
            console.error('❌ AUCUN BoostPackage trouvé en base de données !');
            console.log('👉 Solution : Exécuter "npx tsx seed-boosts.ts"');
        } else {
            console.log(`✅ ${boosts.length} package(s) trouvé(s) :`);
            boosts.forEach(b => {
                console.log(`   - [${b.id}] ${b.name} (${b.price} FCFA) - Active: ${b.active}`);
            });
        }

        // 2. Vérification d'un Listing Test
        console.log('\n2️⃣ Vérification d\'une annonce test...');
        const listing = await prisma.listing.findFirst();
        if (!listing) {
            console.error('❌ AUCUNE annonce trouvée en base !');
            console.log('👉 Solution : Créer une annonce via le dashboard.');
        } else {
            console.log(`✅ Annonce trouvée : [${listing.id}] ${listing.title}`);
        }

        // 3. Simulation API Publique Boosts
        console.log('\n3️⃣ Simulation logique API /api/boosts...');
        const activeBoosts = await prisma.boostPackage.findMany({
            where: { active: true },
            orderBy: { price: 'asc' }
        });
        console.log(`✅ API renverrait ${activeBoosts.length} package(s) actifs.`);

        // 4. Vérification des Paiements Récents
        console.log('\n4️⃣ Vérification des derniers paiements...');
        const payments = await prisma.payment.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });
        if (payments.length === 0) {
            console.log('ℹ️ Aucun paiement enregistré pour le moment.');
        } else {
            console.log(`✅ ${payments.length} dernier(s) paiement(s) :`);
            payments.forEach(p => {
                console.log(`   - [${p.status}] ${p.amount} FCFA par ${p.user.email} (Ref: ${p.reference})`);
            });
        }

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE LORS DU DIAGNOSTIC :', error);
    } finally {
        await prisma.$disconnect();
        console.log('\n🏁 FIN DU DIAGNOSTIC');
    }
}

diagnose();

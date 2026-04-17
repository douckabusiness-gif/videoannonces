import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPlans() {
    console.log('🔍 Vérification des plans...\n');

    try {
        // Essayer de récupérer les plans
        const plans = await prisma.subscriptionPlan.findMany();
        console.log(`📊 Nombre de plans trouvés: ${plans.length}`);

        if (plans.length > 0) {
            console.log('Plans:', JSON.stringify(plans, null, 2));
        } else {
            console.log('❌ Aucun plan trouvé.');
        }

        // Vérifier si les nouvelles colonnes existent en essayant de créer un plan avec elles
        // Si ça échoue, c'est que le schéma n'est pas à jour
        console.log('\n🔍 Test de compatibilité du schéma...');
        try {
            // @ts-ignore - On ignore les erreurs TS pour tester si le champ existe en DB
            const test = await prisma.subscriptionPlan.findFirst({
                select: { allowSubdomain: true }
            });
            console.log('✅ Colonne allowSubdomain détectée.');
        } catch (e) {
            console.log('❌ Colonne allowSubdomain NON détectée. La migration a échoué.');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPlans();

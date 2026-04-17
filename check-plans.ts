import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPlans() {
    try {
        const plans = await prisma.subscriptionPlan.findMany();
        console.log('=== PLANS DANS LA BASE DE DONNÉES ===');
        console.log(`Nombre de plans: ${plans.length}`);
        console.log('');

        plans.forEach((plan, index) => {
            console.log(`Plan ${index + 1}:`);
            console.log(`  ID: ${plan.id}`);
            console.log(`  Nom: ${plan.name}`);
            console.log(`  Slug: ${plan.slug}`);
            console.log(`  Prix: ${plan.price} FCFA`);
            console.log(`  Actif: ${plan.active}`);
            console.log(`  Populaire: ${plan.popular}`);
            console.log('');
        });
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPlans();

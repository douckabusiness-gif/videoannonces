const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestSubscriptionRequest() {
    console.log('🧪 Création d\'une demande d\'abonnement de test...\n');

    // Récupérer un utilisateur vendeur (pas admin)
    const vendor = await prisma.user.findFirst({
        where: {
            role: 'USER',
            isVendor: true
        }
    });

    if (!vendor) {
        console.log('❌ Aucun vendeur trouvé dans la base de données');
        console.log('💡 Créez d\'abord un compte vendeur ou connectez-vous avec 0509194344');
        await prisma.$disconnect();
        return;
    }

    console.log(`👤 Vendeur trouvé: ${vendor.name} (${vendor.email})\n`);

    // Récupérer le plan Pro
    const proPlan = await prisma.subscriptionPlan.findFirst({
        where: { slug: 'pro' }
    });

    if (!proPlan) {
        console.log('❌ Plan Pro non trouvé');
        await prisma.$disconnect();
        return;
    }

    console.log(`💎 Plan trouvé: ${proPlan.name} - ${proPlan.price} FCFA\n`);

    // Créer un paiement de test
    const payment = await prisma.payment.create({
        data: {
            userId: vendor.id,
            amount: proPlan.price,
            currency: 'XOF',
            status: 'pending',
            paymentMethod: 'orange_money',
            reference: `TEST-${Date.now()}`,
            metadata: {
                type: 'subscription',
                planId: proPlan.id,
                phoneNumber: vendor.phone || '0700000000'
            }
        }
    });

    console.log('✅ Demande de test créée avec succès !');
    console.log(`   Référence: ${payment.reference}`);
    console.log(`   Montant: ${payment.amount} FCFA`);
    console.log(`   Statut: ${payment.status}`);
    console.log(`   Metadata: ${JSON.stringify(payment.metadata, null, 2)}\n`);

    console.log('🎯 Allez maintenant sur /admin/subscriptions pour voir la demande !');

    await prisma.$disconnect();
}

createTestSubscriptionRequest().catch(error => {
    console.error('Erreur:', error);
    prisma.$disconnect();
});

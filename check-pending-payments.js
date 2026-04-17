const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPendingPayments() {
    console.log('🔍 Vérification des paiements en attente...\n');

    // Tous les paiements
    const allPayments = await prisma.payment.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10
    });

    console.log('📝 Tous les paiements (10 derniers):');
    allPayments.forEach(p => {
        console.log(`  - ${p.reference} | ${p.user.name} | ${p.status} | ${p.amount} FCFA | ${JSON.stringify(p.metadata)}`);
    });

    console.log('\n---\n');

    // Paiements PENDING
    const pendingPayments = await prisma.payment.findMany({
        where: {
            status: 'pending'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    console.log('⏳ Paiements PENDING:');
    if (pendingPayments.length === 0) {
        console.log('  ❌ Aucun paiement PENDING trouvé');
    } else {
        pendingPayments.forEach(p => {
            console.log(`  - ${p.reference} | ${p.user.name} | Metadata: ${JSON.stringify(p.metadata)}`);
        });
    }

    console.log('\n---\n');

    // Paiements PENDING de type subscription
    const subscriptionPayments = await prisma.payment.findMany({
        where: {
            status: 'pending',
            metadata: {
                path: ['type'],
                equals: 'subscription'
            }
        }
    });

    console.log('💎 Paiements PENDING de type SUBSCRIPTION:');
    if (subscriptionPayments.length === 0) {
        console.log('  ❌ Aucun paiement subscription PENDING');
        console.log('  💡 Il faut faire une demande d\'abonnement depuis /dashboard/subscription');
    } else {
        console.log(`  ✅ ${subscriptionPayments.length} demande(s) trouvée(s)`);
        subscriptionPayments.forEach(p => {
            console.log(`     ${p.reference} | ${p.amount} FCFA`);
        });
    }

    await prisma.$disconnect();
}

checkPendingPayments().catch(console.error);

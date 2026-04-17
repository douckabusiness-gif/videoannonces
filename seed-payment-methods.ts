import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Initialisation des moyens de paiement...\n');

    const paymentMethods = [
        {
            name: 'Orange Money',
            code: 'orange_money',
            description: 'Paiement via Orange Money Côte d\'Ivoire',
            icon: '🟠',
            color: 'from-orange-500 to-orange-600',
            active: true,
            order: 1,
            phoneNumber: null, // À configurer par l'admin
            paymentLink: null,
        },
        {
            name: 'MTN Mobile Money',
            code: 'mtn_momo',
            description: 'Paiement via MTN Mobile Money',
            icon: '🟡',
            color: 'from-yellow-500 to-yellow-600',
            active: true,
            order: 2,
            phoneNumber: null, // À configurer par l'admin
            paymentLink: null,
        },
        {
            name: 'Wave',
            code: 'wave',
            description: 'Paiement via Wave',
            icon: '💙',
            color: 'from-blue-500 to-blue-600',
            active: true,
            order: 3,
            phoneNumber: null,
            paymentLink: 'https://pay.wave.com/m/M_ci_kAXFcuRHsGu2/c/ci/', // Exemple
        },
    ];

    for (const method of paymentMethods) {
        const existing = await prisma.paymentMethod.findUnique({
            where: { code: method.code }
        });

        if (existing) {
            console.log(`✅ ${method.name} existe déjà`);
            // Mise à jour pour ajouter les nouveaux champs
            await prisma.paymentMethod.update({
                where: { code: method.code },
                data: {
                    color: method.color,
                    order: method.order,
                    phoneNumber: method.phoneNumber,
                    paymentLink: method.paymentLink,
                }
            });
            console.log(`   ↳ Mis à jour avec les nouveaux champs`);
        } else {
            await prisma.paymentMethod.create({
                data: method
            });
            console.log(`✅ ${method.name} créé`);
        }
    }

    console.log('\n✅ Moyens de paiement initialisés avec succès !');
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

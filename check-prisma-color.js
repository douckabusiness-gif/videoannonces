
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPrismaModel() {
    try {
        console.log('Checking PaymentMethod model...');
        // On essaie de créer un PaymentMethod avec le champ color pour voir si ça passe
        // On utilise une transaction qui échouera pour ne rien écrire en base
        await prisma.$transaction(async (tx) => {
            const method = await tx.paymentMethod.create({
                data: {
                    name: "Test Color",
                    code: "test_color_" + Date.now(),
                    color: "from-red-500 to-red-600",
                    active: false
                }
            });
            console.log('✅ PaymentMethod created successfully with color:', method.color);
            throw new Error('Rollback'); // Pour annuler la création
        });
    } catch (error) {
        if (error.message === 'Rollback') {
            console.log('✅ Rollback successful. Prisma Client accepts the color field.');
        } else {
            console.error('❌ Error:', error.message);
            console.error('Full error:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkPrismaModel();

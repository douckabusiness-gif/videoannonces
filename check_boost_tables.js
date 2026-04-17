const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
    try {
        console.log('Checking BoostPackage table...');
        try {
            const boosts = await prisma.boostPackage.findMany();
            console.log('✅ BoostPackage exists, count:', boosts.length);
        } catch (e) {
            console.error('❌ BoostPackage table likely missing:', e.message);
        }

        console.log('Checking PaymentMethod table...');
        try {
            const methods = await prisma.paymentMethod.findMany();
            console.log('✅ PaymentMethod exists, count:', methods.length);
        } catch (e) {
            console.error('❌ PaymentMethod table likely missing:', e.message);
        }

    } catch (e) {
        console.error('Global error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTables();

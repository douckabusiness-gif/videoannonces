const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkColumn() {
    try {
        console.log('Checking paymentMethod column...');
        await prisma.$queryRaw`SELECT paymentMethod FROM Payment LIMIT 1`;
        console.log('✅ Column paymentMethod exists');
    } catch (e) {
        console.error('❌ Column paymentMethod likely missing:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkColumn();

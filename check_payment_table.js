const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPaymentTable() {
    try {
        console.log('Checking Payment table...');
        try {
            const payments = await prisma.payment.findMany();
            console.log('✅ Payment table exists, count:', payments.length);
        } catch (e) {
            console.error('❌ Payment table likely missing:', e.message);
        }
    } catch (e) {
        console.error('Global error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkPaymentTable();

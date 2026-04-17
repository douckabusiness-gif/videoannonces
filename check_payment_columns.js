const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkColumns() {
    try {
        console.log('Describing Payment table...');
        const result = await prisma.$queryRaw`DESCRIBE Payment`;
        console.log(result);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkColumns();

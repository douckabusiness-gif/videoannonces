const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPackages() {
    try {
        const packages = await prisma.boostPackage.findMany();
        console.log('--- PACKAGES ---');
        console.log(JSON.stringify(packages, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkPackages();

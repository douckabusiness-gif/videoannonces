import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const boosts = await prisma.boostPackage.findMany();
        console.log('Boost Packages found:', boosts.length);
        boosts.forEach(b => {
            console.log(`- [${b.active ? 'ACTIVE' : 'INACTIVE'}] ${b.name}: Price=${b.price}, Duration=${b.duration}`);
        });
    } catch (e) {
        console.error('Error checking boosts:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

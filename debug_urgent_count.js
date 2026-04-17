const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUrgentCount() {
    try {
        const count = await prisma.listing.count({
            where: {
                isUrgent: true,
                status: 'active'
            }
        });

        console.log('Total Active Urgent Listings:', count);

        const listings = await prisma.listing.findMany({
            where: { isUrgent: true, status: 'active' },
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, createdAt: true }
        });

        console.log('--- RECENT URGENT LISTINGS ---');
        console.log(JSON.stringify(listings, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUrgentCount();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkListingStatus() {
    try {
        const listingId = 'cmjiaz31s0009kc6gxzacjzz1';
        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        });

        console.log('--- LISTING DETAILS ---');
        console.log('ID:', listing.id);
        console.log('Status:', listing.status); // This is critical
        console.log('isUrgent:', listing.isUrgent);
        console.log('Boosted:', listing.boosted);
        console.log('BoostedUntil:', listing.boostedUntil);
        console.log('CreatedAt:', listing.createdAt);
        console.log('ExpiresAt:', listing.expiresAt);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkListingStatus();

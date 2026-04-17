const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveListing() {
    try {
        const listingId = 'cmjiaz31s0009kc6gxzacjzz1';

        const listing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                moderationStatus: 'approved'
            }
        });

        console.log('✅ Listing approved:', listing.id);
        console.log('New moderationStatus:', listing.moderationStatus);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

approveListing();

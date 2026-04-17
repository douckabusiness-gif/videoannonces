const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function forceUpdate() {
    try {
        const listingId = 'cmjiaz31s0009kc6gxzacjzz1';
        const duration = 7; // Assuming 7 days from metadata

        console.log(`Attempting to update listing ${listingId}...`);

        const boostUntilDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
        console.log('Boost Until:', boostUntilDate);

        const updatedListing = await prisma.listing.update({
            where: { id: listingId },
            data: {
                boosted: true,
                isUrgent: true,
                boostedUntil: boostUntilDate
            }
        });

        console.log('✅ Success! Listing updated:', updatedListing.id);
        console.log('New isUrgent:', updatedListing.isUrgent);

    } catch (e) {
        console.error('❌ Error updating listing:', e);
    } finally {
        await prisma.$disconnect();
    }
}

forceUpdate();

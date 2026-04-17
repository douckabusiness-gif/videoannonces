const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMinimal() {
    try {
        const payment = await prisma.payment.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (!payment) {
            console.log('No payment found');
            return;
        }

        console.log('Payment ID:', payment.id);
        console.log('Payment Status:', payment.status);

        const meta = payment.metadata;
        console.log('Meta Type:', meta ? meta.type : 'N/A');
        console.log('Listing ID:', meta ? meta.listingId : 'N/A');

        if (meta && meta.listingId) {
            const listing = await prisma.listing.findUnique({
                where: { id: meta.listingId },
                select: { id: true, isUrgent: true, boosted: true }
            });
            console.log('Listing isUrgent:', listing ? listing.isUrgent : 'Not found');
            console.log('Listing boosted:', listing ? listing.boosted : 'Not found');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkMinimal();

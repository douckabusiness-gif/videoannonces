const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestPayment() {
    try {
        const payment = await prisma.payment.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        console.log('--- PAYMENT ---');
        console.log(JSON.stringify(payment, null, 2));

        if (payment && payment.metadata) {
            const meta = payment.metadata; // Prisma handles JSON automatically usually
            console.log('--- METADATA ---');
            console.log(JSON.stringify(meta, null, 2));

            if (meta.listingId) {
                const listing = await prisma.listing.findUnique({
                    where: { id: meta.listingId }
                });
                console.log('--- LISTING ---');
                console.log(JSON.stringify(listing, null, 2));
            } else {
                console.log('NO LISTING ID IN METADATA');
            }
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLatestPayment();

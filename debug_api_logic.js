const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateApi() {
    try {
        // Simulate: /api/listings?urgent=true&limit=6
        // Logic from route.ts
        const where = {};

        // "Sinon, on affiche seulement les annonces actives publiquement"
        where.status = 'active';

        // "Filtrer les annonces urgentes"
        where.isUrgent = true;

        console.log('Query "where" object:', JSON.stringify(where, null, 2));

        const listings = await prisma.listing.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        rating: true,
                        subdomain: true,
                    }
                }
            },
            orderBy: [
                { boosted: 'desc' },
                { createdAt: 'desc' }
            ],
            take: 6,
        });

        console.log('--- FOUND LISTINGS ---');
        console.log(`Count: ${listings.length}`);
        if (listings.length > 0) {
            console.log(JSON.stringify(listings[0], null, 2)); // Show first one
        } else {
            console.log('No listings found with these criteria.');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

simulateApi();

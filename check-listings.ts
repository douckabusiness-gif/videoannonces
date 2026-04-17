import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkListings() {
    try {
        const count = await prisma.listing.count();
        console.log(`\n📊 Nombre d'annonces: ${count}`);

        if (count > 0) {
            const listings = await prisma.listing.findMany({
                take: 5,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            console.log('\n✅ Annonces trouvées:');
            listings.forEach((l, i) => {
                console.log(`${i + 1}. ${l.title} - ${l.price} FCFA (par ${l.user.name})`);
                console.log(`   URL: http://localhost:3000/listings/${l.id}`);
            });
        } else {
            console.log('\n❌ Aucune annonce dans la base de données');
            console.log('💡 Créez une annonce via: http://localhost:3000/dashboard/create');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkListings();

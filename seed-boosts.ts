import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Initialisation des Boosts...');

    const urgentBoost = await prisma.boostPackage.create({
        data: {
            name: 'Annonce Urgente',
            description: 'Mettez votre annonce en avant pendant 7 jours pour vendre plus vite.',
            price: 2000,
            duration: 7,
            features: [
                'Badge "URGENT" sur l\'annonce',
                'Affichage en tête de liste',
                'Visibilité x10 sur la page d\'accueil',
                'Mise en avant dans les résultats de recherche'
            ],
            active: true
        }
    });

    console.log('✓ Boost créé:', urgentBoost.name);
    console.log('✅ Initialisation terminée!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

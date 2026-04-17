import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
    console.log('🔍 Vérification des catégories...\n');

    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: 'asc' }
        });

        console.log(`📊 Nombre de catégories: ${categories.length}\n`);

        if (categories.length === 0) {
            console.log('❌ Aucune catégorie trouvée dans la base de données!\n');
            console.log('💡 Exécutez: npx tsx seed-categories.ts\n');
        } else {
            console.log('✅ Catégories trouvées:\n');
            categories.forEach(cat => {
                console.log(`  ${cat.icon} ${cat.nameFr} (${cat.slug}) - Ordre: ${cat.order} - Actif: ${cat.isActive}`);
            });
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories();

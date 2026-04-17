import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
    console.log('🌱 Initialisation des catégories...\n');

    const categories = [
        {
            name: 'Tout',
            nameFr: 'Tout',
            nameAr: 'الكل',
            nameEn: 'All',
            slug: 'all',
            icon: '🏪',
            description: 'Toutes les catégories',
            order: 0,
            isActive: true
        },
        {
            name: 'Électronique',
            nameFr: 'Électronique',
            nameAr: 'إلكترونيات',
            nameEn: 'Electronics',
            slug: 'electronics',
            icon: '📱',
            description: 'Téléphones, ordinateurs, tablettes, accessoires électroniques',
            order: 1,
            isActive: true
        },
        {
            name: 'Mode',
            nameFr: 'Mode',
            nameAr: 'موضة',
            nameEn: 'Fashion',
            slug: 'fashion',
            icon: '👔',
            description: 'Vêtements, chaussures, accessoires de mode',
            order: 2,
            isActive: true
        },
        {
            name: 'Véhicules',
            nameFr: 'Véhicules',
            nameAr: 'مركبات',
            nameEn: 'Vehicles',
            slug: 'vehicles',
            icon: '🚗',
            description: 'Voitures, motos, pièces automobiles',
            order: 3,
            isActive: true
        },
        {
            name: 'Immobilier',
            nameFr: 'Immobilier',
            nameAr: 'عقارات',
            nameEn: 'Real Estate',
            slug: 'real-estate',
            icon: '🏠',
            description: 'Maisons, appartements, terrains, locations',
            order: 4,
            isActive: true
        },
        {
            name: 'Services',
            nameFr: 'Services',
            nameAr: 'خدمات',
            nameEn: 'Services',
            slug: 'services',
            icon: '🛠️',
            description: 'Services professionnels, réparations, cours',
            order: 5,
            isActive: true
        },
        {
            name: 'Maison',
            nameFr: 'Maison & Jardin',
            nameAr: 'منزل وحديقة',
            nameEn: 'Home & Garden',
            slug: 'home',
            icon: '🪑',
            description: 'Meubles, décoration, jardinage',
            order: 6,
            isActive: true
        },
        {
            name: 'Sports',
            nameFr: 'Sports & Loisirs',
            nameAr: 'رياضة وترفيه',
            nameEn: 'Sports & Leisure',
            slug: 'sports',
            icon: '⚽',
            description: 'Équipements sportifs, loisirs, jeux',
            order: 7,
            isActive: true
        },
        {
            name: 'Autre',
            nameFr: 'Autre',
            nameAr: 'أخرى',
            nameEn: 'Other',
            slug: 'other',
            icon: '📦',
            description: 'Autres catégories',
            order: 8,
            isActive: true
        }
    ];

    for (const category of categories) {
        try {
            const existing = await prisma.category.findUnique({
                where: { slug: category.slug }
            });

            if (existing) {
                console.log(`✓ ${category.nameFr} existe déjà`);
            } else {
                await prisma.category.create({
                    data: category
                });
                console.log(`✓ ${category.nameFr} créée`);
            }
        } catch (error) {
            console.error(`✗ Erreur pour ${category.nameFr}:`, error);
        }
    }

    console.log('\n✅ Initialisation terminée!');
    await prisma.$disconnect();
}

seedCategories();

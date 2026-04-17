import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
    {
        name: 'Électronique',
        nameFr: 'Électronique',
        nameEn: 'Electronics',
        nameAr: 'إلكترونيات',
        slug: 'electronique',
        icon: '📱',
        color: '#3B82F6',
        order: 1,
        isActive: true,
        description: 'Téléphones, ordinateurs, tablettes et accessoires électroniques'
    },
    {
        name: 'Mode & Beauté',
        nameFr: 'Mode & Beauté',
        nameEn: 'Fashion & Beauty',
        nameAr: 'الموضة والجمال',
        slug: 'mode-beaute',
        icon: '👗',
        color: '#EC4899',
        order: 2,
        isActive: true,
        description: 'Vêtements, chaussures, accessoires et produits de beauté'
    },
    {
        name: 'Maison & Jardin',
        nameFr: 'Maison & Jardin',
        nameEn: 'Home & Garden',
        nameAr: 'المنزل والحديقة',
        slug: 'maison-jardin',
        icon: '🏠',
        color: '#10B981',
        order: 3,
        isActive: true,
        description: 'Meubles, décoration, électroménager et jardinage'
    },
    {
        name: 'Véhicules',
        nameFr: 'Véhicules',
        nameEn: 'Vehicles',
        nameAr: 'المركبات',
        slug: 'vehicules',
        icon: '🚗',
        color: '#EF4444',
        order: 4,
        isActive: true,
        description: 'Voitures, motos, pièces détachées et accessoires auto'
    },
    {
        name: 'Immobilier',
        nameFr: 'Immobilier',
        nameEn: 'Real Estate',
        nameAr: 'العقارات',
        slug: 'immobilier',
        icon: '🏢',
        color: '#F59E0B',
        order: 5,
        isActive: true,
        description: 'Vente et location de maisons, appartements et terrains'
    },
    {
        name: 'Emploi',
        nameFr: 'Emploi',
        nameEn: 'Jobs',
        nameAr: 'الوظائف',
        slug: 'emploi',
        icon: '💼',
        color: '#8B5CF6',
        order: 6,
        isActive: true,
        description: 'Offres d\'emploi et opportunités de carrière'
    },
    {
        name: 'Services',
        nameFr: 'Services',
        nameEn: 'Services',
        nameAr: 'الخدمات',
        slug: 'services',
        icon: '🛠️',
        color: '#06B6D4',
        order: 7,
        isActive: true,
        description: 'Services professionnels et prestations diverses'
    },
    {
        name: 'Loisirs & Divertissement',
        nameFr: 'Loisirs & Divertissement',
        nameEn: 'Leisure & Entertainment',
        nameAr: 'الترفيه والتسلية',
        slug: 'loisirs-divertissement',
        icon: '🎮',
        color: '#14B8A6',
        order: 8,
        isActive: true,
        description: 'Jeux, sports, musique et activités de loisirs'
    },
    {
        name: 'Animaux',
        nameFr: 'Animaux',
        nameEn: 'Pets',
        nameAr: 'الحيوانات الأليفة',
        slug: 'animaux',
        icon: '🐾',
        color: '#F97316',
        order: 9,
        isActive: true,
        description: 'Animaux de compagnie et accessoires pour animaux'
    },
    {
        name: 'Alimentation',
        nameFr: 'Alimentation',
        nameEn: 'Food',
        nameAr: 'الطعام',
        slug: 'alimentation',
        icon: '🍔',
        color: '#84CC16',
        order: 10,
        isActive: true,
        description: 'Produits alimentaires et boissons'
    },
    {
        name: 'Éducation',
        nameFr: 'Éducation',
        nameEn: 'Education',
        nameAr: 'التعليم',
        slug: 'education',
        icon: '📚',
        color: '#6366F1',
        order: 11,
        isActive: true,
        description: 'Cours, formations et matériel éducatif'
    },
    {
        name: 'Santé & Bien-être',
        nameFr: 'Santé & Bien-être',
        nameEn: 'Health & Wellness',
        nameAr: 'الصحة والعافية',
        slug: 'sante-bien-etre',
        icon: '💊',
        color: '#22C55E',
        order: 12,
        isActive: true,
        description: 'Produits de santé, fitness et bien-être'
    },
    {
        name: 'Bébés & Enfants',
        nameFr: 'Bébés & Enfants',
        nameEn: 'Babies & Kids',
        nameAr: 'الأطفال والرضع',
        slug: 'bebes-enfants',
        icon: '👶',
        color: '#FB923C',
        order: 13,
        isActive: true,
        description: 'Articles pour bébés et enfants'
    },
    {
        name: 'Autres',
        nameFr: 'Autres',
        nameEn: 'Others',
        nameAr: 'أخرى',
        slug: 'autres',
        icon: '📦',
        color: '#64748B',
        order: 14,
        isActive: true,
        description: 'Autres catégories non classées'
    }
];

async function main() {
    console.log('🌱 Début du seeding des catégories...');

    for (const category of categories) {
        try {
            const existing = await prisma.category.findUnique({
                where: { slug: category.slug }
            });

            if (existing) {
                console.log(`⏭️  Catégorie "${category.name}" existe déjà`);
                continue;
            }

            await prisma.category.create({
                data: category
            });

            console.log(`✅ Catégorie "${category.name}" créée`);
        } catch (error) {
            console.error(`❌ Erreur pour "${category.name}":`, error);
        }
    }

    console.log('✨ Seeding terminé !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

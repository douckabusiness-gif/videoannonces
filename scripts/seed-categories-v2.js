const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
    {
        name: 'Électronique',
        nameFr: 'Électronique',
        slug: 'electronics',
        icon: '📱',
        order: 1,
        color: 'from-blue-500 to-indigo-600',
        subcategories: [
            { name: 'Téléphones & Tablettes', nameFr: 'Téléphones & Tablettes', slug: 'phones-tablets', icon: '📲' },
            { name: 'Ordinateurs', nameFr: 'Ordinateurs', slug: 'computers', icon: '💻' },
            { name: 'Accessoires', nameFr: 'Accessoires', slug: 'electronics-accessories', icon: '🎧' },
            { name: 'TV & Audio', nameFr: 'TV & Audio', slug: 'tv-audio', icon: '📺' }
        ]
    },
    {
        name: 'Mode',
        nameFr: 'Mode',
        slug: 'fashion',
        icon: '👔',
        order: 2,
        color: 'from-pink-500 to-rose-600',
        subcategories: [
            { name: 'Vêtements Homme', nameFr: 'Vêtements Homme', slug: 'men-fashion', icon: '👕' },
            { name: 'Vêtements Femme', nameFr: 'Vêtements Femme', slug: 'women-fashion', icon: '👗' },
            { name: 'Chaussures', nameFr: 'Chaussures', slug: 'shoes', icon: '👟' },
            { name: 'Sacs & Accessoires', nameFr: 'Sacs & Accessoires', slug: 'fashion-accessories', icon: '👜' }
        ]
    },
    {
        name: 'Véhicules',
        nameFr: 'Véhicules',
        slug: 'vehicles',
        icon: '🚗',
        order: 3,
        color: 'from-orange-500 to-red-600',
        subcategories: [
            { name: 'Voitures', nameFr: 'Voitures', slug: 'cars', icon: '🏎️' },
            { name: 'Motos & Scooters', nameFr: 'Motos & Scooters', slug: 'motorcycles', icon: '🏍️' },
            { name: 'Pièces Détachées', nameFr: 'Pièces Détachées', slug: 'vehicle-parts', icon: '⚙️' },
            { name: 'Engins Lourds', nameFr: 'Engins Lourds', slug: 'heavy-equipment', icon: '🚜' }
        ]
    },
    {
        name: 'Immobilier',
        nameFr: 'Immobilier',
        slug: 'real-estate',
        icon: '🏠',
        order: 4,
        color: 'from-emerald-500 to-teal-600',
        subcategories: [
            { name: 'Appartements à louer', nameFr: 'Appartements à louer', slug: 'apartments-rent', icon: '🏢' },
            { name: 'Maisons à vendre', nameFr: 'Maisons à vendre', slug: 'houses-sale', icon: '🏡' },
            { name: 'Terrains', nameFr: 'Terrains', slug: 'land', icon: '📐' },
            { name: 'Bureaux & Commerces', nameFr: 'Bureaux & Commerces', slug: 'commercial', icon: '🏪' }
        ]
    },
    {
        name: 'Maison',
        nameFr: 'Maison',
        slug: 'home',
        icon: '🪑',
        order: 5,
        color: 'from-amber-500 to-yellow-600',
        subcategories: [
            { name: 'Meubles', nameFr: 'Meubles', slug: 'furniture', icon: '🛋️' },
            { name: 'Électroménager', nameFr: 'Électroménager', slug: 'appliances', icon: '🍳' },
            { name: 'Décoration', nameFr: 'Décoration', slug: 'decoration', icon: '🖼️' },
            { name: 'Jardin & Bricolage', nameFr: 'Jardin & Bricolage', slug: 'garden-diy', icon: '🛠️' }
        ]
    },
    {
        name: 'Services',
        nameFr: 'Services',
        slug: 'services',
        icon: '🛠️',
        order: 6,
        color: 'from-cyan-500 to-blue-600',
        subcategories: [
            { name: 'Cours & Formations', nameFr: 'Cours & Formations', slug: 'training', icon: '📚' },
            { name: 'Réparation & Travaux', nameFr: 'Réparation & Travaux', slug: 'repairs', icon: '🔨' },
            { name: 'Événementiel', nameFr: 'Événementiel', slug: 'events', icon: '🎉' },
            { name: 'Transport & Déménagement', nameFr: 'Transport & Déménagement', slug: 'transport', icon: '🚚' }
        ]
    },
    {
        name: 'Beauté & Santé',
        nameFr: 'Beauté & Santé',
        slug: 'beauty-health',
        icon: '💄',
        order: 7,
        color: 'from-purple-500 to-violet-600',
        subcategories: [
            { name: 'Cosmétiques', nameFr: 'Cosmétiques', slug: 'cosmetics', icon: '💅' },
            { name: 'Soins du corps', nameFr: 'Soins du corps', slug: 'body-care', icon: '🧴' },
            { name: 'Parfums', nameFr: 'Parfums', slug: 'perfumes', icon: '✨' },
            { name: 'Équipements médicaux', nameFr: 'Équipements médicaux', slug: 'medical-equipment', icon: '🩺' }
        ]
    },
    {
        name: 'Agriculture & Alimentation',
        nameFr: 'Agriculture & Alimentation',
        slug: 'agriculture-food',
        icon: '🌾',
        order: 8,
        color: 'from-lime-500 to-green-600',
        subcategories: [
            { name: 'Produits Agricoles', nameFr: 'Produits Agricoles', slug: 'farm-products', icon: '🍅' },
            { name: 'Élevage', nameFr: 'Élevage', slug: 'livestock', icon: '🐄' },
            { name: 'Matériel Agricole', nameFr: 'Matériel Agricole', slug: 'farm-tools', icon: '🚜' },
            { name: 'Epicerie', nameFr: 'Epicerie', slug: 'grocery', icon: '🥫' }
        ]
    },
    {
        name: 'Emploi',
        nameFr: 'Emploi',
        slug: 'jobs',
        icon: '💼',
        order: 9,
        color: 'from-slate-500 to-gray-600',
        subcategories: [
            { name: 'Offres d\'emploi', nameFr: 'Offres d\'emploi', slug: 'job-offers', icon: '📝' },
            { name: 'Demandes d\'emploi', nameFr: 'Demandes d\'emploi', slug: 'job-requests', icon: '🤝' }
        ]
    },
    {
        name: 'Sports & Loisirs',
        nameFr: 'Sports & Loisirs',
        slug: 'sports',
        icon: '⚽',
        order: 10,
        color: 'from-indigo-500 to-blue-700',
        subcategories: [
            { name: 'Équipement Sportif', nameFr: 'Équipement Sportif', slug: 'sport-gear', icon: '🏀' },
            { name: 'Loisirs & Jeux', nameFr: 'Loisirs & Jeux', slug: 'leisure-games', icon: '🎮' },
            { name: 'Livres & Musique', nameFr: 'Livres & Musique', slug: 'books-music', icon: '🎸' }
        ]
    },
    {
        name: 'Autre',
        nameFr: 'Autre',
        slug: 'other',
        icon: '📦',
        order: 11,
        color: 'from-gray-400 to-gray-500',
        subcategories: []
    }
];

async function main() {
    console.log('Suppression des anciennes catégories...');
    await prisma.category.deleteMany({});

    console.log('Seeding des nouvelles catégories...');
    for (const catData of categories) {
        const { subcategories, ...mainCat } = catData;

        const category = await prisma.category.create({
            data: {
                ...mainCat,
                isActive: true
            }
        });

        console.log(`- Catégorie : ${category.nameFr}`);

        if (subcategories && subcategories.length > 0) {
            for (const sub of subcategories) {
                await prisma.category.create({
                    data: {
                        ...sub,
                        parentId: category.id,
                        isActive: true
                    }
                });
                console.log(`  └ Sub : ${sub.nameFr}`);
            }
        }
    }

    console.log('Seed terminé avec succès !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

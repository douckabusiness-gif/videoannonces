import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding...');

    const hashedPassword = await bcrypt.hash('demo123', 10);

    // 0. Plans d'abonnement
    console.log("💎 Création des plans d'abonnement...");

    const plans = [
        {
            name: 'Gratuit',
            slug: 'free',
            description: 'Pour débuter votre activité',
            price: 0,
            features: [
                '5 annonces vidéo',
                'Vidéos de 60 secondes max',
                'Statistiques basiques',
                'Support standard'
            ],
            maxListings: 5,
            maxVideoDuration: 60,
            allowSubdomain: false,
            allowCustomDomain: false,
            active: true,
            popular: false,
            color: '#64748b'
        },
        {
            name: 'Boutique Premium',
            slug: 'premium',
            description: "L'expérience ultime pour booster vos ventes",
            price: 25000,
            features: [
                'Annonces vidéo illimitées',
                'Vidéos de 2 minutes max',
                'Nom de domaine personnalisé',
                'Interface Luxury Elite (Design Premium)',
                'Tableau de bord Business intelligent',
                'Assistant IA pour vos annonces',
                'Support VIP 24h/24'
            ],
            maxListings: 9999,
            maxVideoDuration: 120,
            allowSubdomain: true,
            allowCustomDomain: true,
            allowLiveStreaming: true,
            allowStories: true,
            active: true,
            popular: true,
            color: '#b45309'
        }
    ];

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { slug: plan.slug },
            update: plan,
            create: plan,
        });
    }
    console.log("✅ Plans d'abonnement créés");

    // 1. Utilisateurs démo
    console.log('👤 Création des utilisateurs...');

    // Votre compte Admin
    await prisma.user.upsert({
        where: { phone: '0709194318' },
        update: { 
            role: 'ADMIN', 
            verified: true,
            password: hashedPassword 
        },
        create: {
            phone: '0709194318',
            name: 'Administrateur',
            email: 'admin@afrivideoannonce.com',
            password: hashedPassword,
            verified: true,
            role: 'ADMIN',
        },
    });

    const demoUser = await prisma.user.upsert({
        where: { phone: '+2250700000001' },
        update: {
            password: hashedPassword,
            verified: true
        },
        create: {
            phone: '+2250700000001',
            name: 'Jean Kouassi',
            email: 'jean@demo.com',
            password: hashedPassword,
            verified: true,
            premium: false,
            subdomain: 'jean-shop',
            bio: 'Vendeur de confiance depuis 2020',
            rating: 4.5,
            totalRatings: 45,
            totalSales: 120,
        },
    });

    const premiumUser1 = await prisma.user.upsert({
        where: { phone: '+2250700000002' },
        update: {
            password: hashedPassword,
            verified: true
        },
        create: {
            phone: '+2250700000002',
            name: 'Boutique TechPro',
            email: 'techpro@demo.com',
            password: hashedPassword,
            verified: true,
            premium: true,
            isPremium: true,
            premiumTier: 'premium',
            subdomain: 'techpro',
            bio: "🏆 Spécialiste en électronique et gadgets high-tech. Livraison rapide partout en Côte d'Ivoire.",
            rating: 4.8,
            totalRatings: 156,
            totalSales: 450,
        },
    });

    const premiumUser2 = await prisma.user.upsert({
        where: { phone: '+2250700000003' },
        update: {
            password: hashedPassword,
            verified: true
        },
        create: {
            phone: '+2250700000003',
            name: 'Fashion Store CI',
            email: 'fashion@demo.com',
            password: hashedPassword,
            verified: true,
            premium: true,
            isPremium: true,
            premiumTier: 'premium',
            subdomain: 'fashion-ci',
            bio: '👗 Mode et accessoires tendance. Collection exclusive importée.',
            rating: 4.7,
            totalRatings: 98,
            totalSales: 320,
        },
    });

    const premiumUser3 = await prisma.user.upsert({
        where: { phone: '+2250700000004' },
        update: {},
        create: {
            phone: '+2250700000004',
            name: 'Auto Plus Abidjan',
            email: 'autoplus@demo.com',
            password: hashedPassword,
            verified: true,
            premium: true,
            isPremium: true,
            premiumTier: 'premium',
            subdomain: 'autoplus',
            bio: "🚗 Vente de véhicules d'occasion vérifiés. Garantie et financement disponibles.",
            rating: 4.9,
            totalRatings: 203,
            totalSales: 89,
        },
    });

    console.log('✅ Utilisateurs créés');

    // 2. Annonces urgentes
    console.log('⚡ Création des annonces urgentes...');

    const urgentListings = [
        {
            userId: demoUser.id,
            title: 'iPhone 14 Pro Max 256GB - URGENT',
            description: 'iPhone 14 Pro Max en excellent état, 256GB, couleur Deep Purple. Vente urgente pour voyage. Tous accessoires inclus.',
            price: 450000,
            category: 'electronics',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1678652197950-d4b8e6c20d6e?w=800',
            location: 'Cocody, Abidjan',
            isUrgent: true,
            status: 'active',
            moderationStatus: 'approved',
            duration: 30,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser1.id,
            title: 'MacBook Pro M2 - Prix Cassé !',
            description: 'MacBook Pro 14" M2, 16GB RAM, 512GB SSD. Neuf sous garantie. Offre limitée !',
            price: 850000,
            category: 'electronics',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
            location: 'Plateau, Abidjan',
            isUrgent: true,
            status: 'active',
            moderationStatus: 'approved',
            duration: 45,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser2.id,
            title: 'Sac à Main Louis Vuitton - Urgent',
            description: "Sac à main Louis Vuitton authentique, modèle Neverfull MM. Certificat d'authenticité inclus.",
            price: 320000,
            category: 'fashion',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
            location: 'Marcory, Abidjan',
            isUrgent: true,
            status: 'active',
            moderationStatus: 'approved',
            duration: 25,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser3.id,
            title: 'Toyota Corolla 2020 - Départ Urgent',
            description: 'Toyota Corolla 2020, 45000 km, excellent état. Climatisation, vitres électriques. Vente urgente.',
            price: 8500000,
            category: 'vehicles',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
            location: 'Yopougon, Abidjan',
            isUrgent: true,
            status: 'active',
            moderationStatus: 'approved',
            duration: 60,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    ];

    for (const listing of urgentListings) {
        await prisma.listing.create({ data: listing });
    }
    console.log('✅ Annonces urgentes créées');

    // 3. Annonces normales
    console.log('📦 Création des annonces normales...');

    const normalListings = [
        {
            userId: premiumUser1.id,
            title: 'Samsung Galaxy S23 Ultra',
            description: 'Samsung Galaxy S23 Ultra 512GB, couleur Phantom Black. État neuf, sous garantie.',
            price: 550000,
            category: 'electronics',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
            location: 'Cocody, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 35,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser1.id,
            title: 'AirPods Pro 2ème génération',
            description: 'AirPods Pro 2ème génération, neufs dans leur boîte. Réduction de bruit active.',
            price: 95000,
            category: 'electronics',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
            location: 'Plateau, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 20,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser2.id,
            title: 'Robe de Soirée Élégante',
            description: 'Magnifique robe de soirée, taille M, couleur bordeaux. Parfaite pour événements.',
            price: 45000,
            category: 'fashion',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
            location: 'Marcory, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 28,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser2.id,
            title: 'Sneakers Nike Air Max',
            description: 'Nike Air Max 2023, pointure 42, neuves. Design moderne et confortable.',
            price: 65000,
            category: 'fashion',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
            location: 'Cocody, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 22,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: demoUser.id,
            title: 'Canapé 3 Places Moderne',
            description: 'Canapé 3 places en tissu gris, très confortable. Excellent état, peu utilisé.',
            price: 180000,
            category: 'home',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            location: 'Yopougon, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 40,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser3.id,
            title: 'Honda Civic 2019',
            description: 'Honda Civic 2019, automatique, 60000 km. Entretien régulier, carnet à jour.',
            price: 7200000,
            category: 'vehicles',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
            location: 'Abobo, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 55,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: demoUser.id,
            title: 'Villa Duplex 5 Pièces',
            description: 'Magnifique villa duplex de 5 pièces avec piscine et jardin. Quartier résidentiel calme et sécurisé.',
            price: 150000000,
            category: 'real-estate',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-22b8c153bd95?w=800',
            location: 'Riviera Golf, Abidjan',
            isUrgent: true,
            status: 'active',
            moderationStatus: 'approved',
            duration: 60,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser1.id,
            title: 'Installation Caméras Surveillance',
            description: "Service professionnel d'installation de caméras de surveillance. Devis gratuit.",
            price: 50000,
            category: 'services',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
            location: 'Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 45,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            userId: premiumUser2.id,
            title: 'Vélo de Route Carbon',
            description: 'Vélo de route cadre carbone, équipement Shimano Ultegra. Très léger et performant.',
            price: 850000,
            category: 'sports',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57e36cf?w=800',
            location: 'Zone 4, Abidjan',
            isUrgent: false,
            status: 'active',
            moderationStatus: 'approved',
            duration: 30,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    ];

    for (const listing of normalListings) {
        await prisma.listing.create({ data: listing });
    }
    console.log('✅ Annonces normales créées');

    // 4. Catégories
    console.log('📂 Création des catégories...');

    const categories = [
        { slug: 'electronics', name: 'Electronics', nameFr: 'Électronique', icon: '📱', order: 1 },
        { slug: 'phones-tablets', name: 'Phones & Tablets', nameFr: 'Téléphones & Tablettes', icon: '🤳', order: 2 },
        { slug: 'computers', name: 'Computers', nameFr: 'Ordinateurs', icon: '💻', order: 3 },
        { slug: 'electronics-accessories', name: 'Accessories', nameFr: 'Accessoires', icon: '🔌', order: 4 },
        { slug: 'tv-audio', name: 'TV & Audio', nameFr: 'TV & Audio', icon: '📺', order: 5 },
        { slug: 'fashion', name: 'Fashion', nameFr: 'Mode', icon: '👕', order: 6 },
        { slug: 'men-fashion', name: "Men's Fashion", nameFr: 'Vêtements Homme', icon: '🤵', order: 7 },
        { slug: 'women-fashion', name: "Women's Fashion", nameFr: 'Vêtements Femme', icon: '👗', order: 8 },
        { slug: 'shoes', name: 'Shoes', nameFr: 'Chaussures', icon: '👟', order: 9 },
        { slug: 'watches-jewelry', name: 'Watches & Jewelry', nameFr: 'Montres & Bijoux', icon: '⌚', order: 10 },
        { slug: 'vehicles', name: 'Vehicles', nameFr: 'Véhicules', icon: '🚗', order: 11 },
        { slug: 'cars', name: 'Cars', nameFr: 'Voitures', icon: '🚘', order: 12 },
        { slug: 'motorcycles', name: 'Motorcycles', nameFr: 'Motos', icon: '🏍️', order: 13 },
        { slug: 'trucks', name: 'Trucks', nameFr: 'Camions', icon: '🚛', order: 14 },
        { slug: 'auto-parts', name: 'Auto Parts', nameFr: 'Pièces Auto', icon: '⚙️', order: 15 },
        { slug: 'real-estate', name: 'Real Estate', nameFr: 'Immobilier', icon: '🏠', order: 16 },
        { slug: 'apartments', name: 'Apartments', nameFr: 'Appartements', icon: '🏢', order: 17 },
        { slug: 'houses', name: 'Houses', nameFr: 'Maisons', icon: '🏡', order: 18 },
        { slug: 'land', name: 'Land', nameFr: 'Terrains', icon: '🌍', order: 19 },
        { slug: 'commercial-space', name: 'Commercial Space', nameFr: 'Bureaux & Commerces', icon: '🏪', order: 20 },
        { slug: 'home', name: 'Home & Garden', nameFr: 'Maison & Jardin', icon: '🛋️', order: 21 },
        { slug: 'furniture', name: 'Furniture', nameFr: 'Meubles', icon: '🛏️', order: 22 },
        { slug: 'appliances', name: 'Appliances', nameFr: 'Électroménager', icon: '🧺', order: 23 },
        { slug: 'decor', name: 'Decor', nameFr: 'Décoration', icon: '🖼️', order: 24 },
        { slug: 'garden', name: 'Garden', nameFr: 'Jardin & Bricolage', icon: '⚒️', order: 25 },
        { slug: 'services', name: 'Services', nameFr: 'Services', icon: '🛠️', order: 26 },
        { slug: 'job-offers', name: 'Job Offers', nameFr: 'Emploi', icon: '💼', order: 27 },
        { slug: 'freelance', name: 'Freelance', nameFr: 'Freelance & Freelancer', icon: '👨‍💻', order: 28 },
        { slug: 'training', name: 'Training', nameFr: 'Cours & Formations', icon: '🎓', order: 29 },
        { slug: 'events', name: 'Events', nameFr: 'Événements', icon: '🎉', order: 30 },
        { slug: 'beauty-health', name: 'Beauty & Health', nameFr: 'Beauté & Santé', icon: '💄', order: 31 },
        { slug: 'cosmetics', name: 'Cosmetics', nameFr: 'Cosmétiques', icon: '🧴', order: 32 },
        { slug: 'spa-massage', name: 'Spa & Massage', nameFr: 'Bien-être', icon: '💆', order: 33 },
        { slug: 'sports', name: 'Sports', nameFr: 'Sports & Loisirs', icon: '⚽', order: 34 },
        { slug: 'books', name: 'Books', nameFr: 'Livres', icon: '📚', order: 35 },
        { slug: 'art-collection', name: 'Art & Collection', nameFr: 'Art & Collection', icon: '🎨', order: 36 },
        { slug: 'kids', name: 'Kids', nameFr: 'Enfants & Bébés', icon: '👶', order: 37 },
        { slug: 'toys', name: 'Toys', nameFr: 'Jouets', icon: '🧸', order: 38 },
        { slug: 'pets', name: 'Pets', nameFr: 'Animaux', icon: '🐾', order: 39 },
        { slug: 'food', name: 'Food', nameFr: 'Alimentation', icon: '🍎', order: 40 },
        { slug: 'restaurants', name: 'Restaurants', nameFr: 'Restos & Cafés', icon: '🍴', order: 41 },
        { slug: 'travel', name: 'Travel', nameFr: 'Voyages & Tourisme', icon: '✈️', order: 42 },
        { slug: 'agriculture', name: 'Agriculture', nameFr: 'Agriculture', icon: '🚜', order: 43 },
        { slug: 'industry', name: 'Industry', nameFr: 'Industrie', icon: '🏗️', order: 44 },
        { slug: 'finance', name: 'Finance', nameFr: 'Finance & Assurances', icon: '💰', order: 45 },
        { slug: 'legal', name: 'Legal', nameFr: 'Juridique', icon: '⚖️', order: 46 },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: category,
            create: category,
        });
    }
    console.log('✅ Catégories créées');

    // 5. Méthodes de paiement
    console.log('💰 Création des méthodes de paiement...');

    const paymentMethods = [
        {
            name: 'Orange Money',
            code: 'OM',
            phoneNumber: '0700000000',
            description: 'Paiement via Orange Money',
            instruction: 'Composez le #144*... pour effectuer le paiement de {amount} FCFA vers le 0700000000.',
            icon: '🟠',
            color: 'from-orange-500 to-orange-600',
            active: true,
            order: 1
        },
        {
            name: 'Wave',
            code: 'WAVE',
            phoneNumber: '0700000000',
            description: 'Paiement sans frais via Wave',
            instruction: "Envoyez {amount} FCFA vers le 0700000000 via l'application Wave.",
            icon: '🌊',
            color: 'from-blue-400 to-blue-500',
            active: true,
            order: 2
        },
        {
            name: 'MTN Mobile Money',
            code: 'MTN',
            phoneNumber: '0500000000',
            description: 'Paiement via MTN MoMo',
            instruction: 'Composez le *133*... pour envoyer {amount} FCFA vers le 0500000000.',
            icon: '🟡',
            color: 'from-yellow-400 to-yellow-500',
            active: true,
            order: 3
        },
        {
            name: 'Moov Money',
            code: 'MOOV',
            phoneNumber: '0100000000',
            description: 'Paiement via Moov Money',
            instruction: 'Effectuez un transfert de {amount} FCFA vers le 0100000000.',
            icon: '🔵',
            color: 'from-blue-600 to-blue-700',
            active: true,
            order: 4
        }
    ];

    for (const method of paymentMethods) {
        await prisma.paymentMethod.upsert({
            where: { code: method.code },
            update: method,
            create: method,
        });
    }
    console.log('✅ Méthodes de paiement créées');

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log('\n📋 Résumé :');
    console.log('   - 4 utilisateurs créés (1 normal, 3 premium)');
    console.log('   - 4 annonces urgentes');
    console.log('   - 9 annonces normales');
    console.log('\n🔑 Identifiants de connexion :');
    console.log('   Email: jean@demo.com | Mot de passe: demo123');
    console.log('   Email: techpro@demo.com | Mot de passe: demo123');
    console.log('   Email: fashion@demo.com | Mot de passe: demo123');
    console.log('   Email: autoplus@demo.com | Mot de passe: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
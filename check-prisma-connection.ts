
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrisma() {
    console.log('--- Diagnostic Prisma ---');
    try {
        await prisma.$connect();
        console.log('✅ Connexion à la base de données réussie.');

        const userCount = await prisma.user.count();
        console.log(`📊 Nombre d'utilisateurs en base : ${userCount}`);

        const config = await prisma.siteSettings.findFirst();
        console.log('🔗 Accès aux paramètres du site :', config ? 'OUI' : 'NON (Table vide)');

    } catch (error: any) {
        console.error('❌ Échec de la connexion Prisma :', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkPrisma().catch(console.error);

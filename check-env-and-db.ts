
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('--- Environment Check ---');
    if (process.env.NEXTAUTH_SECRET) {
        console.log('NEXTAUTH_SECRET is set (length: ' + process.env.NEXTAUTH_SECRET.length + ')');
    } else {
        console.error('ERROR: NEXTAUTH_SECRET is NOT set');
    }

    if (process.env.DATABASE_URL) {
        console.log('DATABASE_URL is set');
    } else {
        console.error('ERROR: DATABASE_URL is NOT set');
    }

    console.log('\n--- Database Check ---');
    try {
        await prisma.$connect();
        console.log('Connected to DB');

        console.log('Checking SiteSettings...');
        const settings = await prisma.siteSettings.findFirst();
        console.log('SiteSettings query successful. Found:', settings ? 'Yes' : 'No');

    } catch (e) {
        console.error('Database error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

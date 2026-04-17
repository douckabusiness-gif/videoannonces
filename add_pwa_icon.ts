import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$executeRawUnsafe('ALTER TABLE sitesettings ADD COLUMN pwaIcon VARCHAR(191) NULL;');
        console.log('Successfully added pwaIcon column');
    } catch (e: any) {
        if (e.message.includes('Duplicate column name')) {
            console.log('Column already exists');
        } else {
            console.error('Error:', e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}
main();

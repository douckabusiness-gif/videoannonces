
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
    console.log('--- Liste des Utilisateurs ---');

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            isVendor: true,
            verified: true
        }
    });

    if (users.length === 0) {
        console.log('Aucun utilisateur trouvé.');
    } else {
        console.table(users);
    }

    await prisma.$disconnect();
}

listUsers().catch(console.error);

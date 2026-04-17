
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUser() {
    console.log('--- Recherche Utilisateur 0123456789 ---');
    const user = await prisma.user.findUnique({
        where: { phone: '0123456789' }
    });

    if (user) {
        console.log('✅ Utilisateur trouvé !');
        console.log('ID:', user.id);
        console.log('Vérifié:', user.verified);
        console.log('Role:', user.role);
    } else {
        console.log('❌ Utilisateur 0123456789 NON trouvé.');
    }

    // Listons aussi tous les numéros pour voir
    const allPhones = await prisma.user.findMany({
        select: { phone: true, name: true }
    });
    console.log('Tous les numéros en base :', allPhones);

    await prisma.$disconnect();
}

findUser().catch(console.error);

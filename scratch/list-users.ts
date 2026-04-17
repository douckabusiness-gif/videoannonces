import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: {
            id: true,
            phone: true,
            name: true,
            role: true,
            isVendor: true
        }
    });

    console.log('--- LISTE DES ADMINS ---');
    if (admins.length === 0) {
        console.log('Aucun admin trouvé !');
    } else {
        admins.forEach(a => console.log(`${a.phone} - ${a.name} (ID: ${a.id}, isVendor: ${a.isVendor})`));
    }

    const vendors = await prisma.user.findMany({
        where: { isVendor: true },
        select: {
            id: true,
            phone: true,
            name: true,
            role: true
        }
    });

    console.log('\n--- LISTE DES VENDEURS ---');
    vendors.forEach(v => console.log(`${v.phone} - ${v.name} (Role: ${v.role})`));
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());

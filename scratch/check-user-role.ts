import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phone = process.argv[2];
    if (!phone) {
        console.log('Usage: npx tsx scratch/check-user-role.ts [PHONE_NUMBER]');
        return;
    }

    const user = await prisma.user.findUnique({
        where: { phone },
        select: {
            id: true,
            phone: true,
            name: true,
            role: true,
            isVendor: true,
            verified: true,
        }
    });

    if (!user) {
        console.log(`❌ Utilisateur avec le numéro ${phone} non trouvé.`);
        return;
    }

    console.log('--- DONNÉES UTILISATEUR ---');
    console.log(`ID: ${user.id}`);
    console.log(`Nom: ${user.name}`);
    console.log(`Téléphone: ${user.phone}`);
    console.log(`Rôle: ${user.role} ${user.role === 'ADMIN' ? '✅' : '❌ (Devrait être ADMIN)'}`);
    console.log(`Vendeur: ${user.isVendor ? 'OUI' : 'NON'}`);
    console.log(`Vérifié: ${user.verified ? 'OUI' : 'NON'}`);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());

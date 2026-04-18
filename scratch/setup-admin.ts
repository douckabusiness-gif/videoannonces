import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const phone = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!phone || !password) {
        console.log('❌ Utilisation : npx tsx scratch/setup-admin.ts [TELEPHONE] [MOT_DE_PASSE] [NOM_OPTIONNEL]');
        console.log('Exemple : npx tsx scratch/setup-admin.ts 0700000000 Admin123 "Afri Admin"');
        return;
    }

    console.log(`🚀 Préparation de la création du compte admin pour ${phone}...`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.upsert({
            where: { phone },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                verified: true,
                isVendor: true
            },
            create: {
                phone,
                password: hashedPassword,
                name,
                email: `admin_${Date.now()}@afrivideoannonce.com`, // Email unique requis
                role: 'ADMIN',
                verified: true,
                isVendor: true,
                subdomain: 'admin-shop',
                language: 'fr'
            }
        });

        console.log('✅ Compte administrateur prêt !');
        console.log('--- RÉSUMÉ ---');
        console.log(`Nom: ${admin.name}`);
        console.log(`Téléphone: ${admin.phone}`);
        console.log(`Rôle: ${admin.role}`);
        console.log(`Statut: Vérifié ✅`);
        console.log('--------------');
        console.log('Vous pouvez maintenant vous connecter sur /admin/login');

    } catch (error) {
        console.error('❌ Erreur lors de la création de l admin :', error);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔐 Création/Mise à jour du compte admin...');

    const phone = '0709194318';
    const password = '0709194318d';

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si l'admin existe déjà
    const existing = await prisma.user.findUnique({
        where: { phone }
    });

    if (existing) {
        console.log('⚠️  Un utilisateur avec ce numéro existe déjà');

        // Mettre à jour le mot de passe ET le rôle admin
        await prisma.user.update({
            where: { phone },
            data: {
                role: 'ADMIN',
                password: hashedPassword,
                premium: true,
                verified: true
            }
        });

        console.log('✅ Compte admin mis à jour (rôle + mot de passe)');
        console.log(`📱 Téléphone: ${phone}`);
        console.log(`🔑 Mot de passe: ${password}`);
        return;
    }

    // Créer l'admin
    const admin = await prisma.user.create({
        data: {
            phone,
            password: hashedPassword,
            name: 'Administrateur',
            email: 'admin@videoboutique.ci',
            role: 'ADMIN',
            premium: true,
            verified: true
        }
    });

    console.log('✅ Compte admin créé avec succès !');
    console.log(`📱 Téléphone: ${phone}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👤 ID: ${admin.id}`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

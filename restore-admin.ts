
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function restoreAdmin() {
    console.log('--- Restauration Compte Admin ---');

    const phone = '0123456789';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si existe
    const existing = await prisma.user.findUnique({
        where: { phone }
    });

    if (existing) {
        console.log(`⚠️ L'utilisateur ${phone} existe déjà (ID: ${existing.id}).`);
        console.log('🔄 Mise à jour du mot de passe et validation...');

        await prisma.user.update({
            where: { phone },
            data: {
                password: hashedPassword,
                verified: true,
                role: 'ADMIN',
                isVendor: true
            }
        });
        console.log('✅ Compte mis à jour ! Mot de passe réinitialisé à "admin123".');
    } else {
        console.log(`ℹ️ L'utilisateur ${phone} n'existe pas. Création...`);

        await prisma.user.create({
            data: {
                phone,
                password: hashedPassword,
                name: 'Super Admin',
                email: 'admin@videoboutique.ci', // Email fictif pour admin
                role: 'ADMIN',
                isVendor: true,
                verified: true,
                language: 'fr'
            }
        });
        console.log('✅ Compte Admin créé ! Mot de passe: "admin123".');
    }

    await prisma.$disconnect();
}

restoreAdmin().catch(console.error);

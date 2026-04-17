import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Vérifier si un admin existe déjà
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('✅ Un admin existe déjà:', existingAdmin.phone);
            return;
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Créer l'admin
        const admin = await prisma.user.create({
            data: {
                phone: '0123456789',
                password: hashedPassword,
                name: 'Admin',
                role: 'ADMIN',
                isVendor: true,
                premium: true,
            }
        });

        console.log('✅ Compte admin créé avec succès !');
        console.log('📞 Téléphone: 0123456789');
        console.log('🔑 Mot de passe: admin123');
        console.log('\n➡️ Vous pouvez maintenant vous connecter !');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();

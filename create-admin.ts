import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        const phone = '0709194318';
        const passwordPlain = '0919Douck@';
        
        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        // Créer ou mettre à jour l'admin
        const admin = await prisma.user.upsert({
            where: { phone: phone },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                isVendor: true,
                premium: true,
            },
            create: {
                phone: phone,
                password: hashedPassword,
                name: 'Admin Douck',
                role: 'ADMIN',
                isVendor: true,
                premium: true,
            }
        });

        console.log('✅ Compte admin prêt !');
        console.log('📞 Téléphone:', phone);
        console.log('🔑 Mot de passe:', passwordPlain);
        console.log('\n➡️ Vous pouvez maintenant vous connecter !');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();

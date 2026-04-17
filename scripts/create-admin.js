const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Hasher le mot de passe fourni par l'utilisateur
        const hashedPassword = await bcrypt.hash('0709194318d', 10);

        // Créer ou mettre à jour l'utilisateur admin
        // On cherche par email ou téléphone pour être sûr
        const admin = await prisma.user.upsert({
            where: { email: 'admin@videoboutique.com' },
            update: {
                phone: '0709194318',
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                name: 'Admin',
                phone: '0709194318',
                email: 'admin@videoboutique.com',
                password: hashedPassword,
                role: 'ADMIN',
                language: 'fr',
            },
        });

        console.log('✅ Compte admin mis à jour avec succès !');
        console.log('📱 Téléphone: 0709194318');
        console.log('🔑 Mot de passe: 0709194318d');
        console.log('');
        console.log('🔗 Connectez-vous sur: http://localhost:3000/admin/login');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();

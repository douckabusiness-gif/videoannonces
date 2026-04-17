const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createEmailAdmin() {
    try {
        // Vérifier si l'admin existe déjà
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@videoboutique.com' }
        });

        if (existingAdmin) {
            console.log('✅ Admin existe déjà');
            // Mettre à jour le rôle
            await prisma.user.update({
                where: { id: existingAdmin.id },
                data: { role: 'ADMIN' }
            });
            console.log('✅ Rôle mis à jour vers ADMIN');
            return;
        }

        // Créer le mot de passe hashé
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Créer l'utilisateur admin
        const admin = await prisma.user.create({
            data: {
                phone: '+212600000001',
                name: 'Admin VideoBoutique',
                email: 'admin@videoboutique.com',
                password: hashedPassword,
                role: 'ADMIN',
                verified: true,
                language: 'fr'
            }
        });

        console.log('✅ Admin créé avec succès !');
        console.log('📧 Email: admin@videoboutique.com');
        console.log('🔑 Mot de passe: admin123');
        console.log('👤 Nom:', admin.name);
        console.log('🎭 Rôle:', admin.role);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createEmailAdmin();

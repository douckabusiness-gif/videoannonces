
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function revertEmailConfig() {
    console.log('--- Revert Config Email (Match Real ISPConfig) ---');

    // Chercher la config "corrigée" (qui est maintenant fausse par rapport au serveur)
    const config = await prisma.emailConfig.findFirst({
        where: {
            smtpUser: 'videoannonces-ci@ivoireci.site'
        }
    });

    if (config) {
        console.log('✅ Config "videoannonces-ci" trouvée. Revert vers "videoannoncse-ci" (Serveur réel)...');

        const updated = await prisma.emailConfig.update({
            where: { id: config.id },
            data: {
                smtpUser: 'videoannoncse-ci@ivoireci.site' // Retour à la version avec faute (car c'est le vrai compte)
            }
        });

        console.log('✅ Config revertée :');
        console.log('   User DB:', updated.smtpUser);
    } else {
        console.log('ℹ️ Config "videoannonces-ci" non trouvée.');
        // Check if typo config exists
        const typo = await prisma.emailConfig.findFirst({
            where: {
                smtpUser: 'videoannoncse-ci@ivoireci.site'
            }
        });
        if (typo) {
            console.log('✅ La config est déjà alignée sur le serveur (videoannoncse-ci).');
        }
    }

    await prisma.$disconnect();
}

revertEmailConfig().catch(console.error);

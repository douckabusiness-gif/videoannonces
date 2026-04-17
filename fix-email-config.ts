
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixEmailConfig() {
    console.log('--- Correction Config Email ---');

    // Chercher la config avec la faute de frappe
    const config = await prisma.emailConfig.findFirst({
        where: {
            smtpUser: 'videoannoncse-ci@ivoireci.site'
        }
    });

    if (config) {
        console.log('✅ Config incorrecte trouvée (avec "cse"). Correction en cours...');

        const updated = await prisma.emailConfig.update({
            where: { id: config.id },
            data: {
                smtpUser: 'videoannonces-ci@ivoireci.site' // Correction: "ces"
            }
        });

        console.log('✅ Config mise à jour :');
        console.log('   Ancien User:', 'videoannoncse-ci@ivoireci.site');
        console.log('   Nouveau User:', updated.smtpUser);
    } else {
        console.log('ℹ️ Aucune config avec la faute de frappe "cse" touvée.');
        // Check if correct config exists
        const correct = await prisma.emailConfig.findFirst({
            where: {
                smtpUser: 'videoannonces-ci@ivoireci.site'
            }
        });
        if (correct) {
            console.log('✅ La config semble déjà correcte (videoannonces-ci).');
        } else {
            console.log('❌ Aucune config trouvée pour cet utilisateur.');
        }
    }

    await prisma.$disconnect();
}

fixEmailConfig().catch(console.error);

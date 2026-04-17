import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const config = await prisma.emailConfig.findFirst();
        if (!config) {
            console.log('No EmailConfig found.');
            return;
        }
        console.log('EmailConfig found:');
        console.log('- SMTP Host:', config.smtpHost);
        console.log('- SMTP Port:', config.smtpPort);
        console.log('- SMTP User:', config.smtpUser);
        console.log('- From Email:', config.fromEmail);
        console.log('- Is Active:', config.isActive);
        console.log('- Password encrypted length:', config.smtpPassword.length);
        console.log('- Password format valid (contains colon):', config.smtpPassword.includes(':'));

        if (config.smtpPassword.includes(':')) {
            const parts = config.smtpPassword.split(':');
            console.log('- IV length (hex):', parts[0].length);
            console.log('- Encrypted data length (hex):', parts[1].length);
        }
    } catch (e) {
        console.error('Error checking config:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();

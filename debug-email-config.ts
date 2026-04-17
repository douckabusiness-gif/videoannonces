
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

function decrypt(text: string): string {
    try {
        if (!process.env.ENCRYPTION_KEY) return text;
        const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest();
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        console.error('Erreur déchiffrement:', e);
        return 'ERROR_DECRYPT';
    }
}

async function checkConfig() {
    console.log('--- Vérification Configuration Email ---');

    // 1. Env Vars
    console.log('ENV SMTP_USER:', process.env.SMTP_USER);
    console.log('ENV SMTP_HOST:', process.env.SMTP_HOST);

    // 2. DB Config
    const config = await prisma.emailConfig.findFirst();
    if (config) {
        console.log('DB Config Found:');
        console.log('  ID:', config.id);
        console.log('  Active:', config.isActive);
        console.log('  Host:', config.smtpHost);
        console.log('  User:', config.smtpUser);
        console.log('  Port:', config.smtpPort);

        const decryptedPass = decrypt(config.smtpPassword);
        console.log('  Password Decrypted Length:', decryptedPass.length);
        console.log('  Password Starts With:', decryptedPass.substring(0, 2) + '***');
    } else {
        console.log('❌ Aucune configuration en base de données.');
    }

    await prisma.$disconnect();
}

checkConfig().catch(console.error);

import nodemailer from 'nodemailer';
// Force refresh: 1
import { prisma } from './prisma';
import crypto from 'crypto';

// Fonction utilitaire pour déchiffrer (identique à celle de l'API)
// Fonction utilitaire pour déchiffrer (identique à celle de l'API)
function decrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    try {
        // Utiliser SHA-256 pour garantir une clé de 32 octets (identique à l'API Admin)
        const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-!!').digest();

        const parts = text.split(':');
        if (parts.length < 2) return text;

        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error('Erreur déchiffrement EmailService:', e);
        return text;
    }
}


class EmailService {
    async getTransporter(): Promise<nodemailer.Transporter | null> {
        try {
            // 1. Essayer de récupérer la config depuis la DB
            const dbConfig = await prisma.emailConfig.findFirst();

            let config: any = {};

            if (dbConfig && dbConfig.isActive) {
                const password = decrypt(dbConfig.smtpPassword);
                console.log('DEBUG EmailService: Utilisation config DB');
                console.log('DEBUG EmailService: Host:', dbConfig.smtpHost);
                console.log('DEBUG EmailService: User:', dbConfig.smtpUser);
                console.log('DEBUG EmailService: Pass length:', password.length);

                config = {
                    host: dbConfig.smtpHost,
                    port: dbConfig.smtpPort,
                    secure: dbConfig.smtpPort === 465 || dbConfig.smtpPort === 585,
                    auth: {
                        user: dbConfig.smtpUser,
                        pass: password,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                };
            } else {
                console.log('DEBUG EmailService: Pas de config DB active, fallback ENV');
                // 2. Fallback sur le .env
                if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
                    console.error('DEBUG EmailService: Pas de config ENV non plus');
                    return null;
                }
                config = {
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587'),
                    secure: process.env.SMTP_PORT === '465' || process.env.SMTP_PORT === '585',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                };
            }

            return nodemailer.createTransport(config);

        } catch (error) {
            console.error('Erreur chargement config email:', error);
            return null;
        }
    }

    async sendVerificationEmail(email: string, code: string, name: string): Promise<boolean> {
        const dbConfig = await prisma.emailConfig.findFirst();
        const settings = await prisma.siteSettings.findFirst();
        const transporter = await this.getTransporter();

        if (!transporter || !dbConfig) {
            console.error('❌ SMTP non configuré. Impossible d\'envoyer l\'email.');
            console.log(`📧 Code de vérification pour ${email}: ${code}`);
            return false;
        }

        const siteName = settings?.siteName || 'VideoAnnonces-CI';
        const logoPath = settings?.logo;

        // Résoudre le chemin local pour l'attachement CID
        const absoluteLogoPath = logoPath ? require('path').join(process.cwd(), 'public', logoPath) : null;

        const mailOptions: any = {
            from: `"${dbConfig.fromName}" <${dbConfig.fromEmail}>`,
            to: email,
            subject: `🔐 Votre code de vérification - ${siteName}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #FF6B00 0%, #FF8533 100%); padding: 40px 30px; text-align: center;">
                            ${logoPath ? `<img src="cid:logo" alt="${siteName}" style="max-height: 60px; margin-bottom: 20px;">` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">${siteName}</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Vérification de votre compte</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">Bonjour ${name} ! 👋</h2>
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Bienvenue sur <strong>${siteName}</strong> ! Pour activer votre compte vendeur, veuillez utiliser le code de vérification ci-dessous :
                            </p>
                            
                            <!-- Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #FF6B00; border-radius: 12px; padding: 30px; display: inline-block;">
                                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Code de vérification</p>
                                            <p style="margin: 0; color: #FF6B00; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                ⏱️ <strong>Ce code expire dans 15 minutes.</strong><br>
                                🔒 Ne partagez jamais ce code avec personne.
                            </p>
                            
                            <p style="margin: 20px 0 0 0; color: #a0aec0; font-size: 13px; line-height: 1.6;">
                                Si vous n'avez pas demandé ce code, ignorez simplement cet email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; font-weight: 600;">${siteName}</p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">${settings?.siteSlogan || 'La première plateforme de petites annonces vidéo en Côte d\'Ivoire'}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
            attachments: absoluteLogoPath ? [
                {
                    filename: 'logo.png',
                    path: absoluteLogoPath,
                    cid: 'logo'
                }
            ] : []
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email de vérification envoyé à ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            return false;
        }
    }

    async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
        const dbConfig = await prisma.emailConfig.findFirst();
        const settings = await prisma.siteSettings.findFirst();
        const transporter = await this.getTransporter();

        if (!transporter || !dbConfig) {
            console.log(`📧 Email de bienvenue pour ${email} (SMTP non configuré)`);
            return false;
        }

        const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const siteName = settings?.siteName || 'VideoAnnonces-CI';
        const logoPath = settings?.logo;

        // Résoudre le chemin local pour l'attachement CID
        const absoluteLogoPath = logoPath ? require('path').join(process.cwd(), 'public', logoPath) : null;

        const mailOptions: any = {
            from: `"${dbConfig.fromName}" <${dbConfig.fromEmail}>`,
            to: email,
            subject: `🎉 Bienvenue sur ${siteName} !`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            ${logoPath ? `<img src="cid:logo" alt="${siteName}" style="max-height: 80px;">` : ''}
            <h1 style="color: #FF6B00; margin-top: 20px;">Bienvenue ${name} ! 🎉</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Votre compte a été vérifié avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités de <strong>${siteName}</strong> :
        </p>
        <ul style="font-size: 15px; line-height: 1.8; color: #555;">
            <li>📹 Publier des annonces vidéo</li>
            <li>💬 Communiquer avec les acheteurs</li>
            <li>📊 Suivre vos statistiques</li>
            <li>🏪 Créer votre boutique personnalisée</li>
        </ul>
        <p style="text-align: center; margin-top: 30px;">
            <a href="${siteUrl}/dashboard" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #FF6B00, #FF8533); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder à mon tableau de bord</a>
        </p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #999; text-align: center;">
            ${siteName} - ${settings?.siteSlogan || 'Votre marketplace vidéo en Côte d\'Ivoire'}
        </p>
    </div>
</body>
</html>
            `,
            attachments: absoluteLogoPath ? [
                {
                    filename: 'logo.png',
                    path: absoluteLogoPath,
                    cid: 'logo'
                }
            ] : []
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email de bienvenue envoyé à ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi email bienvenue:', error);
            return false;
        }
    }
}

export const emailService = new EmailService();

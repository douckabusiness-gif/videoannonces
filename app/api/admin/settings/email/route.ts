import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Fonction pour chiffrer le mot de passe SMTP
function encrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    // Utiliser SHA-256 pour garantir une clé de 32 octets, quelle que soit la longueur de ENCRYPTION_KEY
    const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-!!').digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Fonction pour déchiffrer le mot de passe SMTP
function decrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    // Utiliser SHA-256 pour garantir une clé de 32 octets, quelle que soit la longueur de ENCRYPTION_KEY
    const key = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-!!').digest();
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// GET - Récupérer la configuration email
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        let config = await prisma.emailConfig.findFirst();

        if (config) {
            // Ne pas retourner le mot de passe
            const { smtpPassword, ...safeConfig } = config;
            return NextResponse.json({
                ...safeConfig,
                hasPassword: !!smtpPassword,
            });
        }

        return NextResponse.json(null);
    } catch (error) {
        console.error('Erreur récupération config email:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Sauvegarder la configuration email
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const data = await request.json();

        // Chiffrer le mot de passe
        const encryptedPassword = data.smtpPassword ? encrypt(data.smtpPassword) : undefined;

        let config = await prisma.emailConfig.findFirst();

        if (config) {
            // Mettre à jour
            config = await prisma.emailConfig.update({
                where: { id: config.id },
                data: {
                    smtpHost: data.smtpHost,
                    smtpPort: parseInt(data.smtpPort),
                    smtpUser: data.smtpUser,
                    ...(encryptedPassword && { smtpPassword: encryptedPassword }),
                    fromEmail: data.fromEmail,
                    fromName: data.fromName,
                    isActive: data.isActive,
                    welcomeTemplate: data.welcomeTemplate,
                    verificationTemplate: data.verificationTemplate,
                    resetPasswordTemplate: data.resetPasswordTemplate,
                },
            });
        } else {
            // Créer
            config = await prisma.emailConfig.create({
                data: {
                    smtpHost: data.smtpHost,
                    smtpPort: parseInt(data.smtpPort),
                    smtpUser: data.smtpUser,
                    smtpPassword: encryptedPassword || '',
                    fromEmail: data.fromEmail,
                    fromName: data.fromName,
                    isActive: data.isActive,
                    welcomeTemplate: data.welcomeTemplate,
                    verificationTemplate: data.verificationTemplate,
                    resetPasswordTemplate: data.resetPasswordTemplate,
                },
            });
        }

        // Log
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'system',
                action: 'update_email_config',
                message: 'Configuration email mise à jour',
                userId: session.user.id,
            },
        });

        const { smtpPassword, ...safeConfig } = config;
        return NextResponse.json({
            ...safeConfig,
            hasPassword: !!smtpPassword,
        });
    } catch (error) {
        console.error('Erreur sauvegarde config email:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PUT - Tester la configuration email
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { testEmail } = await request.json();

        // Récupérer la config
        const config = await prisma.emailConfig.findFirst();

        if (!config) {
            return NextResponse.json(
                { error: 'Configuration email non trouvée' },
                { status: 404 }
            );
        }

        // Déchiffrer le mot de passe
        const password = decrypt(config.smtpPassword);
        console.log('DEBUG: Mot de passe déchiffré:', password ? '********' : 'VIDE');
        console.log('DEBUG: Config SMTP:', {
            host: config.smtpHost,
            port: config.smtpPort,
            user: config.smtpUser
        });

        // Créer le transporteur
        const transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpPort === 465 || config.smtpPort === 585, // Souvent SSL pour 465 et 585
            auth: {
                user: config.smtpUser,
                pass: password,
            },
            tls: {
                // Ne pas échouer sur les certificats auto-signés
                rejectUnauthorized: false
            },
            debug: true, // Affiche le log dans le terminal
            logger: true // Log les événements SMTP
        });

        console.log('DEBUG: Tentative d\'envoi d\'email de test...');

        // Envoyer un email de test
        await transporter.sendMail({
            from: `${config.fromName} <${config.fromEmail}>`,
            to: testEmail,
            subject: 'Test de configuration email - VideoBoutique',
            html: `
                <h1>Test réussi !</h1>
                <p>Votre configuration email fonctionne correctement.</p>
                <p>Cet email a été envoyé depuis le tableau de bord admin de VideoBoutique.</p>
            `,
        });

        // Log
        await prisma.systemLog.create({
            data: {
                type: 'success',
                category: 'email',
                action: 'test_email',
                message: `Email de test envoyé à ${testEmail}`,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true, message: 'Email de test envoyé avec succès' });
    } catch (error: any) {
        console.error('Erreur test email:', error);

        // Log de l'erreur
        const session = await getServerSession(authOptions);
        if (session) {
            await prisma.systemLog.create({
                data: {
                    type: 'error',
                    category: 'email',
                    action: 'test_email_failed',
                    message: `Échec du test email: ${error.message}`,
                    userId: session.user.id,
                },
            });
        }

        return NextResponse.json(
            { error: 'Échec de l\'envoi de l\'email de test', details: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}

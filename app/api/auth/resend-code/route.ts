import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email-service';

// Limite de requêtes par email (anti-spam)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email requis' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();

        // Vérifier rate limit (3 tentatives max par 15 min)
        const now = Date.now();
        const limit = rateLimits.get(normalizedEmail);

        if (limit) {
            if (now < limit.resetAt) {
                if (limit.count >= 3) {
                    const minutesLeft = Math.ceil((limit.resetAt - now) / 60000);
                    return NextResponse.json(
                        { error: `Trop de tentatives. Réessayez dans ${minutesLeft} minute(s).` },
                        { status: 429 }
                    );
                }
                limit.count++;
            } else {
                // Reset après 15 min
                rateLimits.set(normalizedEmail, {
                    count: 1,
                    resetAt: now + 15 * 60 * 1000
                });
            }
        } else {
            rateLimits.set(normalizedEmail, {
                count: 1,
                resetAt: now + 15 * 60 * 1000
            });
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Aucun compte associé à cet email' },
                { status: 404 }
            );
        }

        if (user.verified) {
            return NextResponse.json(
                { error: 'Email déjà vérifié' },
                { status: 400 }
            );
        }

        // Invalider les anciens codes
        await prisma.verificationCode.updateMany({
            where: {
                email: normalizedEmail,
                type: 'EMAIL_VERIFICATION',
                used: false
            },
            data: { used: true }
        });

        // Générer nouveau code (6 chiffres)
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Créer le code de vérification (expire dans 15 min)
        await prisma.verificationCode.create({
            data: {
                email: normalizedEmail,
                code,
                type: 'EMAIL_VERIFICATION',
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
            }
        });

        // Envoyer l'email
        const emailSent = await emailService.sendVerificationEmail(normalizedEmail, code, user.name);

        if (!emailSent) {
            // SMTP non configuré, mais on retourne quand même le code en dev
            console.log(`🔐 Code de vérification pour ${normalizedEmail}: ${code}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Code de vérification renvoyé avec succès',
            email: normalizedEmail
        });

    } catch (error: any) {
        console.error('Erreur renvoi code:', error);
        return NextResponse.json(
            { error: 'Erreur lors du renvoi du code' },
            { status: 500 }
        );
    }
}

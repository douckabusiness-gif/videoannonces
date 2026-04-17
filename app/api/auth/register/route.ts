import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { userRegisterSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { emailService } from '@/lib/email-service';
import { getPublicRegistrationEnabled, getSignupDefaultVendor } from '@/lib/platform-flags';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Registration request body:', body);

        // Validation avec Zod
        const validationResult = userRegisterSchema.safeParse(body);

        if (!validationResult.success) {
            console.error('Validation errors:', validationResult.error.issues);
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    details: validationResult.error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            );
        }

        const validated = validationResult.data;

        if (!(await getPublicRegistrationEnabled())) {
            return NextResponse.json(
                { error: 'Les inscriptions publiques sont fermées. Contactez le support.' },
                { status: 403 }
            );
        }

        // Vérifier si le téléphone existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { phone: validated.phone }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Ce numéro de téléphone est déjà utilisé' },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà (si fourni)
        if (validated.email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email: validated.email }
            });

            if (existingEmail) {
                return NextResponse.json(
                    { error: 'Cet email est déjà utilisé' },
                    { status: 400 }
                );
            }
        }

        // ✅ Email est maintenant OBLIGATOIRE
        if (!validated.email) {
            return NextResponse.json(
                { error: 'L\'email est obligatoire pour l\'inscription' },
                { status: 400 }
            );
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(validated.password, 10);
        const defaultVendor = await getSignupDefaultVendor();

        // Créer l'utilisateur avec verified = false
        const user = await prisma.user.create({
            data: {
                name: validated.name,
                phone: validated.phone,
                email: validated.email.toLowerCase(),
                password: hashedPassword,
                language: validated.language || 'fr',
                isVendor: defaultVendor,
                verified: false, // 🔒 Compte non vérifié par défaut
            },
            select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                language: true,
                verified: true,
                createdAt: true,
            }
        });

        // Générer code de vérification (6 chiffres)
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Sauvegarder le code (expire dans 15 min)
        await prisma.verificationCode.create({
            data: {
                email: validated.email.toLowerCase(),
                code,
                type: 'EMAIL_VERIFICATION',
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        // Envoyer l'email de vérification
        const emailSent = await emailService.sendVerificationEmail(
            validated.email,
            code,
            validated.name
        );

        if (!emailSent) {
            // SMTP non configuré, afficher le code en console (dev mode)
            console.log(`🔐 Code de vérification pour ${validated.email}: ${code}`);
        }

        // Note: Les badges seront attribués APRÈS vérification email
        // On ne les attribue pas maintenant pour éviter que des comptes non vérifiés aient des badges

        return NextResponse.json({
            message: 'Code de vérification envoyé à votre email',
            requiresVerification: true,
            email: validated.email,
            user: {
                id: user.id,
                name: user.name,
                verified: false
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Erreur inscription:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de l\'inscription' },
            { status: 500 }
        );
    }
}

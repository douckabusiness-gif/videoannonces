import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email et code requis' },
                { status: 400 }
            );
        }

        // Chercher le code de vérification
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                email: email.toLowerCase(),
                code,
                type: 'EMAIL_VERIFICATION',
                used: false,
                expiresAt: {
                    gt: new Date() // Pas expiré
                }
            }
        });

        if (!verificationCode) {
            return NextResponse.json(
                { error: 'Code invalide ou expiré' },
                { status: 400 }
            );
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur introuvable' },
                { status: 404 }
            );
        }

        if (user.verified) {
            return NextResponse.json(
                { error: 'Email déjà vérifié' },
                { status: 400 }
            );
        }

        // Marquer le code comme utilisé
        await prisma.verificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true }
        });

        // Marquer l'utilisateur comme vérifié
        await prisma.user.update({
            where: { id: user.id },
            data: { verified: true }
        });

        // Attribution automatique du badge NEW_SELLER (maintenant que le compte est vérifié)
        try {
            const { BadgeService } = await import('@/lib/badges/auto-assign');
            await BadgeService.checkAndAssignBadges(user.id);
        } catch (badgeError) {
            console.error('Erreur attribution badge:', badgeError);
            // Ne pas bloquer la vérification si attribution échoue
        }

        // Envoyer email de bienvenue (non-bloquant)
        emailService.sendWelcomeEmail(email, user.name).catch(err => {
            console.error('Erreur envoi email bienvenue:', err);
        });

        return NextResponse.json({
            success: true,
            message: 'Email vérifié avec succès !',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                verified: true
            }
        });

    } catch (error: any) {
        console.error('Erreur vérification email:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la vérification' },
            { status: 500 }
        );
    }
}

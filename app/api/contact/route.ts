import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { name, email, phone, subject, message } = data;

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Tous les champs obligatoires doivent être remplis' },
                { status: 400 }
            );
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email invalide' },
                { status: 400 }
            );
        }

        // Enregistrer le message de contact dans la base de données
        const contact = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message,
                status: 'pending',
                createdAt: new Date()
            }
        });

        // Log système
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'contact',
                action: 'new_contact_message',
                message: `Nouveau message de contact de ${name} (${email}) - Sujet: ${subject}`,
            }
        });

        // TODO: Envoyer un email de notification à l'équipe
        // TODO: Envoyer un email de confirmation à l'utilisateur

        return NextResponse.json({
            success: true,
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les 24 heures.',
            id: contact.id
        });

    } catch (error) {
        console.error('Erreur envoi message contact:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de l\'envoi du message' },
            { status: 500 }
        );
    }
}

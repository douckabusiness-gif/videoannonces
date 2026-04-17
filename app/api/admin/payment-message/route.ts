import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer le message actif (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const message = await prisma.paymentMessage.findFirst({
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ message: message || null });
    } catch (error) {
        console.error('Error fetching payment message:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer/Mettre à jour le message (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { message, active, bgColor, textColor } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message requis' }, { status: 400 });
        }

        // Récupérer le message existant
        const existing = await prisma.paymentMessage.findFirst();

        let result;
        if (existing) {
            // Mise à jour
            result = await prisma.paymentMessage.update({
                where: { id: existing.id },
                data: {
                    message,
                    active: active !== undefined ? active : true,
                    bgColor: bgColor || '#FF6B35',
                    textColor: textColor || '#FFFFFF'
                }
            });
        } else {
            // Création
            result = await prisma.paymentMessage.create({
                data: {
                    message,
                    active: active !== undefined ? active : true,
                    bgColor: bgColor || '#FF6B35',
                    textColor: textColor || '#FFFFFF'
                }
            });
        }

        return NextResponse.json({ message: result });
    } catch (error) {
        console.error('Error saving payment message:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

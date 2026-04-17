import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Marquer comme lue
        const notification = await prisma.notification.update({
            where: {
                id,
                userId: session.user.id, // Sécurité: vérifier que c'est bien sa notification
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({ success: true, notification });
    } catch (error) {
        console.error('❌ Erreur marquage notification:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

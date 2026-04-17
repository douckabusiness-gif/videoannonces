import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { endpoint } = await request.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint requis' },
                { status: 400 }
            );
        }

        // Supprimer l'abonnement
        await prisma.pushSubscription.deleteMany({
            where: {
                endpoint,
                userId: session.user.id,
            },
        });

        console.log('✅ Abonnement push supprimé');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Erreur désabonnement push:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

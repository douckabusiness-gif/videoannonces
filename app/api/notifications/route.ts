import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer notifications de l'utilisateur
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
                ...(unreadOnly ? { read: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        // Compter non lues
        const unreadCount = await prisma.notification.count({
            where: {
                userId: session.user.id,
                read: false,
            },
        });

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('❌ Erreur récupération notifications:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Marquer toutes comme lues
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                read: false,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('❌ Erreur marquage notifications:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

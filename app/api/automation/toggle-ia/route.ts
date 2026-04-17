import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { enabled } = body;

        if (typeof enabled !== 'boolean') {
            return NextResponse.json({ error: 'Donnée invalide' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { aiReplyEnabled: enabled }
        });

        return NextResponse.json({ success: true, aiReplyEnabled: updatedUser.aiReplyEnabled });

    } catch (error) {
        console.error('Erreur toggle-ia:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

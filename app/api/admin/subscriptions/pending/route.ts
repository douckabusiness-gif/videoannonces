import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Liste des paiements en attente pour les abonnements
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Vérifier que l'utilisateur est admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Accès refusé - Admin uniquement' },
                { status: 403 }
            );
        }

        // Récupérer tous les paiements PENDING (probablement des abonnements)
        const payments = await prisma.payment.findMany({
            where: {
                status: 'pending'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error('Error fetching pending subscriptions:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeSubdomain, validateSubdomain } from '@/lib/subdomain';
import { isSoloBusinessMode } from '@/lib/solo-business';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Les admins peuvent toujours réclamer un domaine, même en mode solo
        const isAdmin = session.user.role === 'ADMIN';
        const isSolo = await isSoloBusinessMode();

        if (!isAdmin && isSolo) {
            return NextResponse.json(
                {
                    error:
                        'La réclamation de sous-domaine boutique est désactivée en mode vitrine solo.',
                },
                { status: 403 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Vérifier que l'utilisateur est Premium (les admins sont exempts)
        if (!isAdmin && !user.premium) {
            return NextResponse.json(
                { error: 'Fonctionnalité réservée aux membres Premium' },
                { status: 403 }
            );
        }


        const { subdomain } = await request.json();

        if (!subdomain) {
            return NextResponse.json(
                { error: 'Sous-domaine requis' },
                { status: 400 }
            );
        }

        // Normaliser
        const normalized = normalizeSubdomain(subdomain);

        // Valider
        const validation = validateSubdomain(normalized);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Vérifier disponibilité
        const existing = await prisma.user.findUnique({
            where: { subdomain: normalized },
        });

        if (existing) {
            console.log('Existing owner ID:', existing.id);
            console.log('Current user ID:', user.id);
            if (existing.id !== user.id) {
                return NextResponse.json(
                    { error: 'Ce sous-domaine est déjà utilisé' },
                    { status: 409 }
                );
            }
        }

        // Réserver le sous-domaine
        await prisma.user.update({
            where: { id: user.id },
            data: { subdomain: normalized },
        });

        return NextResponse.json({
            success: true,
            subdomain: normalized,
            shopUrl: `${normalized}.${process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}`,
        });
    } catch (error) {
        console.error('Erreur claim sous-domaine:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la réservation du sous-domaine' },
            { status: 500 }
        );
    }
}

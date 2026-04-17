import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subdomainSchema } from '@/lib/validations';

// GET - Vérifier disponibilité d'un sous-domaine
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const subdomain = searchParams.get('subdomain');

        if (!subdomain) {
            return NextResponse.json(
                { error: 'Sous-domaine requis' },
                { status: 400 }
            );
        }

        // Valider le format
        try {
            subdomainSchema.parse({ subdomain });
        } catch (error: any) {
            return NextResponse.json({
                available: false,
                error: error.errors[0]?.message || 'Format invalide'
            });
        }

        // Vérifier disponibilité
        const existing = await prisma.user.findUnique({
            where: { subdomain }
        });

        return NextResponse.json({
            available: !existing,
            subdomain
        });

    } catch (error) {
        console.error('Erreur vérification sous-domaine:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Créer/Modifier sous-domaine
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        // Vérifier si premium
        if (!user?.premium) {
            return NextResponse.json(
                { error: 'Fonctionnalité Premium uniquement' },
                { status: 403 }
            );
        }

        const { subdomain } = await request.json();

        // Valider
        const validated = subdomainSchema.parse({ subdomain });

        // Vérifier disponibilité
        const existing = await prisma.user.findUnique({
            where: { subdomain: validated.subdomain }
        });

        if (existing && existing.id !== session.user.id) {
            return NextResponse.json(
                { error: 'Ce sous-domaine est déjà pris' },
                { status: 400 }
            );
        }

        // Mettre à jour
        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: { subdomain: validated.subdomain }
        });

        return NextResponse.json({
            success: true,
            subdomain: updated.subdomain,
            url: `https://${validated.subdomain}.videoboutique.com`
        });

    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Données invalides', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Erreur configuration sous-domaine:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

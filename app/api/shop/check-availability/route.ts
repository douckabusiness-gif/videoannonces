import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSubdomain, validateSubdomain } from '@/lib/subdomain';

export async function POST(request: NextRequest) {
    try {
        const { subdomain } = await request.json();

        if (!subdomain) {
            return NextResponse.json(
                { available: false, error: 'Sous-domaine requis' },
                { status: 400 }
            );
        }

        // Normaliser
        const normalized = normalizeSubdomain(subdomain);

        // Valider le format
        const validation = validateSubdomain(normalized);
        if (!validation.valid) {
            return NextResponse.json(
                { available: false, error: validation.error },
                { status: 400 }
            );
        }

        // Vérifier la disponibilité dans la base de données
        const existing = await prisma.user.findUnique({
            where: { subdomain: normalized },
        });

        if (existing) {
            return NextResponse.json({
                available: false,
                error: 'Ce sous-domaine est déjà utilisé',
            });
        }

        return NextResponse.json({
            available: true,
            subdomain: normalized,
        });
    } catch (error) {
        console.error('Erreur vérification sous-domaine:', error);
        return NextResponse.json(
            { available: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

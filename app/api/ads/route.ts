import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une publicité selon la position
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const position = searchParams.get('position') as 'top' | 'middle' | 'bottom' | null;

        if (id) {
            const ad = await prisma.ad.findUnique({
                where: { id },
            });
            return NextResponse.json({ ad });
        }

        if (position) {
            // Récupérer une publicité active pour cette position
            const ad = await prisma.ad.findFirst({
                where: {
                    position,
                    isActive: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return NextResponse.json({ ad });
        }

        return NextResponse.json({ error: 'ID ou Position requis' }, { status: 400 });
    } catch (error) {
        console.error('Erreur récupération publicité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer une nouvelle publicité (admin seulement)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, imageUrl, linkUrl, position } = body;

        if (!title || !imageUrl || !linkUrl || !position) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const ad = await prisma.ad.create({
            data: {
                title,
                imageUrl,
                linkUrl,
                position,
                isActive: true,
            },
        });

        return NextResponse.json({ ad }, { status: 201 });
    } catch (error) {
        console.error('Erreur création publicité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// PUT - Mettre à jour une publicité
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, imageUrl, linkUrl, position, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const ad = await prisma.ad.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(imageUrl && { imageUrl }),
                ...(linkUrl && { linkUrl }),
                ...(position && { position }),
                ...(typeof isActive === 'boolean' && { isActive }),
            },
        });

        return NextResponse.json({ ad });
    } catch (error) {
        console.error('Erreur mise à jour publicité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer une publicité
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        await prisma.ad.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Publicité supprimée' });
    } catch (error) {
        console.error('Erreur suppression publicité:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listingSchema } from '@/lib/validations';

// GET - Récupérer une annonce spécifique
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,  // 📞 Pour WhatsApp
                        avatar: true,
                        rating: true,
                        totalRatings: true,
                        subdomain: true,
                        verified: true,
                    }
                }
            }
        });

        if (!listing) {
            return NextResponse.json(
                { error: 'Annonce non trouvée' },
                { status: 404 }
            );
        }

        // Incrémenter les vues
        await prisma.listing.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json(listing);

    } catch (error) {
        console.error('Erreur récupération annonce:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PATCH - Mettre à jour une annonce
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const existing = await prisma.listing.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Annonce non trouvée' },
                { status: 404 }
            );
        }

        if (existing.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validated = listingSchema.partial().parse(body);

        const listing = await prisma.listing.update({
            where: { id },
            data: validated
        });

        return NextResponse.json(listing);

    } catch (error: any) {
        console.error('Erreur mise à jour annonce:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une annonce
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const existing = await prisma.listing.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Annonce non trouvée' },
                { status: 404 }
            );
        }

        if (existing.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        await prisma.listing.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Annonce supprimée' });

    } catch (error) {
        console.error('Erreur suppression annonce:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}

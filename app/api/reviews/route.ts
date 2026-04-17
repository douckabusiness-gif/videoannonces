import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les avis
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');

        const where: any = {
            reviewedId: session.user.id
        };

        if (featured === 'true') {
            where.featured = true;
        }

        const reviews = await prisma.review.findMany({
            where,
            include: {
                reviewer: {
                    select: {
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Mettre à jour le statut "featured"
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, featured } = body;

        // Vérifier que l'avis appartient bien au vendeur
        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review || review.reviewedId !== session.user.id) {
            return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { featured }
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

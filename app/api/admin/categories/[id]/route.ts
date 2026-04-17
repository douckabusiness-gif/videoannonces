import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une catégorie spécifique
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Catégorie non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Erreur récupération catégorie:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour une catégorie
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name: data.name,
                nameFr: data.nameFr,
                nameAr: data.nameAr,
                nameEn: data.nameEn,
                icon: data.icon,
                image: data.image,
                description: data.description,
                order: data.order,
                color: data.color,
                isActive: data.isActive,
            },
        });

        // Log
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'system',
                action: 'update_category',
                message: `Catégorie mise à jour: ${category.name}`,
                userId: session.user.id,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Erreur mise à jour catégorie:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const category = await prisma.category.delete({
            where: { id: params.id },
        });

        // Log
        await prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'system',
                action: 'delete_category',
                message: `Catégorie supprimée: ${category.name}`,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur suppression catégorie:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

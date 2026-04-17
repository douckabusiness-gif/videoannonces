import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function checkAdminAccess() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Non authentifié', status: 401 };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        return { error: 'Accès refusé', status: 403 };
    }

    return { adminId: session.user.id };
}

/**
 * GET - Récupérer toutes les catégories
 */
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const categories = await prisma.category.findMany({
            orderBy: {
                order: 'asc'
            }
        });

        // Compter manuellement les annonces pour chaque catégorie
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const listingsCount = await prisma.listing.count({
                    where: { category: category.slug }
                });

                return {
                    ...category,
                    _count: {
                        listings: listingsCount
                    }
                };
            })
        );

        return NextResponse.json({ categories: categoriesWithCount });

    } catch (error: any) {
        console.error('Erreur récupération catégories:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * POST - Créer une nouvelle catégorie
 */
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { name, nameFr, nameAr, nameEn, slug, icon, description, order, isActive, parentId } = await request.json();

        if (!nameFr || !slug) {
            return NextResponse.json(
                { error: 'Nom français et slug requis' },
                { status: 400 }
            );
        }

        // Vérifier si le slug existe déjà
        const existing = await prisma.category.findUnique({
            where: { slug }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Une catégorie avec ce slug existe déjà' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: name || nameFr,
                nameFr,
                nameAr,
                nameEn,
                slug,
                icon: icon || '📦',
                description,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
                parentId: parentId || null
            }
        });

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: 'success',
                category: 'admin',
                action: 'category_created',
                message: `Catégorie "${nameFr}" créée`,
                userId: accessCheck.adminId,
                metadata: { categoryId: category.id }
            }
        });

        return NextResponse.json({ category }, { status: 201 });

    } catch (error: any) {
        console.error('Erreur création catégorie:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Mettre à jour une catégorie
 */
export async function PATCH(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { id, name, nameFr, nameAr, nameEn, slug, icon, description, order, isActive } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            );
        }

        // Si le slug change, vérifier qu'il n'existe pas déjà
        if (slug) {
            const existing = await prisma.category.findFirst({
                where: {
                    slug,
                    NOT: { id }
                }
            });

            if (existing) {
                return NextResponse.json(
                    { error: 'Une catégorie avec ce slug existe déjà' },
                    { status: 400 }
                );
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(nameFr && { nameFr }),
                ...(nameAr !== undefined && { nameAr }),
                ...(nameEn !== undefined && { nameEn }),
                ...(slug && { slug }),
                ...(icon && { icon }),
                ...(description !== undefined && { description }),
                ...(order !== undefined && { order }),
                ...(isActive !== undefined && { isActive })
            }
        });

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'admin',
                action: 'category_updated',
                message: `Catégorie "${category.nameFr}" mise à jour`,
                userId: accessCheck.adminId,
                metadata: { categoryId: category.id }
            }
        });

        return NextResponse.json({ category });

    } catch (error: any) {
        console.error('Erreur mise à jour catégorie:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Supprimer une catégorie
 */
export async function DELETE(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            );
        }

        // Vérifier s'il y a des annonces dans cette catégorie
        const category = await prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Catégorie non trouvée' },
                { status: 404 }
            );
        }

        // Compter manuellement les annonces
        const listingsCount = await prisma.listing.count({
            where: { category: category.slug }
        });

        if (listingsCount > 0) {
            return NextResponse.json(
                { error: `Impossible de supprimer: ${listingsCount} annonce(s) utilisent cette catégorie` },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id }
        });

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'admin',
                action: 'category_deleted',
                message: `Catégorie "${category.nameFr}" supprimée`,
                userId: accessCheck.adminId,
                metadata: { categoryId: id }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Erreur suppression catégorie:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

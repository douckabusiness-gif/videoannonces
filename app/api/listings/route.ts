import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { listingSchema } from '@/lib/validations';
import { isSoloBusinessMode, soloPublishDeniedMessage, userCanPublishListings } from '@/lib/solo-business';
import { SubscriptionService } from '@/lib/subscription-service';

// GET - Récupérer les annonces
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;
        const userIdParam = searchParams.get('userId');
        const urgent = searchParams.get('urgent'); // Nouveau paramètre pour annonces urgentes

        // Gérer userId=me pour récupérer les annonces de l'utilisateur connecté
        let userId = userIdParam;
        if (userIdParam === 'me') {
            const session = await getServerSession(authOptions);
            if (!session?.user?.id) {
                return NextResponse.json(
                    { error: 'Non authentifié' },
                    { status: 401 }
                );
            }
            userId = session.user.id;
        }

        const where: any = {};

        // Si userId est spécifié, on ne filtre PAS par status pour voir toutes les annonces de l'utilisateur
        if (userId) {
            where.userId = userId;
        } else {
            // Sinon, on affiche seulement les annonces actives publiquement
            where.status = 'active';
        }

        if (category) {
            where.category = category;
        }

        // Filtrer les annonces urgentes
        if (urgent === 'true') {
            where.isUrgent = true;
        }

        // Filtrer les annonces boostées (Flash Sales)
        const boosted = searchParams.get('boosted');
        if (boosted === 'true') {
            where.boosted = true;
        }

        // Paramètre de tri
        const sort = searchParams.get('sort');
        let orderBy: any = [
            { boosted: 'desc' },
            { createdAt: 'desc' }
        ];

        if (sort === 'views') {
            orderBy = [{ views: 'desc' }, { createdAt: 'desc' }];
        } else if (sort === 'recent') {
            orderBy = [{ createdAt: 'desc' }];
        }

        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            rating: true,
                            subdomain: true,
                        }
                    }
                },
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.listing.count({ where })
        ]);

        return NextResponse.json({
            listings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erreur récupération annonces:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Créer une annonce
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        if (
            (await isSoloBusinessMode()) &&
            !(await userCanPublishListings(session.user.id, session.user.role))
        ) {
            return NextResponse.json(
                { error: soloPublishDeniedMessage() },
                { status: 403 }
            );
        }

        const body = await request.json();
        console.log('📝 Données reçues pour création annonce:', JSON.stringify(body, null, 2));

        // Validation
        const validationResult = listingSchema.safeParse(body);

        if (!validationResult.success) {
            console.error('❌ Validation échouée:', validationResult.error.issues);
            return NextResponse.json(
                {
                    error: 'Données invalides',
                    details: validationResult.error.issues.map((issue: any) => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                },
                { status: 400 }
            );
        }

        const validated = validationResult.data;

        // Vérifier les limites de l'abonnement via le service dédié
        const subscriptionCheck = await SubscriptionService.canCreateListing(session.user.id);
        if (!subscriptionCheck.allowed) {
            return NextResponse.json(
                { error: subscriptionCheck.error },
                { status: 403 }
            );
        }

        // Créer l'annonce
        const listing = await prisma.listing.create({
            data: {
                ...validated,
                duration: validated.duration || 0, // Ensure duration is set
                userId: session.user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        subdomain: true,
                    }
                }
            }
        });

        // Mettre à jour le statut vendeur de l'utilisateur
        await prisma.user.update({
            where: { id: session.user.id },
            data: { isVendor: true }
        });

        console.log('✅ Annonce créée:', listing.id);
        return NextResponse.json(listing, { status: 201 });

    } catch (error: any) {
        console.error('❌ Erreur création annonce:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

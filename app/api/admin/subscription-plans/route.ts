import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Vérifier si l'utilisateur est admin
async function checkAdminAccess(session: any) {
    if (!session?.user) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'ADMIN';
}

// GET - Lister tous les plans d'abonnement
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ plans });
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer un nouveau plan d'abonnement
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name, description, price, features,
            maxListings, maxVideosPerListing, maxVideoDuration,
            allowSubdomain, allowCustomDomain, allowLiveStreaming, allowStories,
            active, popular, color, slug
        } = body;

        // Validation
        if (!name || !price || !slug) {
            return NextResponse.json({ error: 'Données manquantes (nom, prix, slug)' }, { status: 400 });
        }

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                features: features || [],
                maxListings: maxListings ? parseInt(maxListings) : null,
                maxVideosPerListing: maxVideosPerListing ? parseInt(maxVideosPerListing) : 1,
                maxVideoDuration: maxVideoDuration ? parseInt(maxVideoDuration) : null,
                allowSubdomain: allowSubdomain || false,
                allowCustomDomain: allowCustomDomain || false,
                allowLiveStreaming: allowLiveStreaming || false,
                allowStories: allowStories || false,
                active: active !== undefined ? active : true,
                popular: popular || false,
                color: color || null
            }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'subscription_plan_created',
                targetType: 'subscription_plan',
                targetId: plan.id,
                details: { planName: name }
            }
        });

        return NextResponse.json({ plan }, { status: 201 });
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

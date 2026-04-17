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

// PATCH - Modifier un plan d'abonnement
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const {
            name, description, price, features,
            maxListings, maxVideoDuration,
            allowSubdomain, allowCustomDomain, allowLiveStreaming, allowStories,
            active, popular, color, slug
        } = body;

        const plan = await prisma.subscriptionPlan.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(slug && { slug }),
                ...(description !== undefined && { description }),
                ...(price && { price: parseFloat(price) }),
                ...(features && { features }),
                ...(maxListings !== undefined && { maxListings: maxListings ? parseInt(maxListings) : null }),
                ...(maxVideoDuration !== undefined && { maxVideoDuration: maxVideoDuration ? parseInt(maxVideoDuration) : null }),
                ...(allowSubdomain !== undefined && { allowSubdomain }),
                ...(allowCustomDomain !== undefined && { allowCustomDomain }),
                ...(allowLiveStreaming !== undefined && { allowLiveStreaming }),
                ...(allowStories !== undefined && { allowStories }),
                ...(active !== undefined && { active }),
                ...(popular !== undefined && { popular }),
                ...(color !== undefined && { color })
            }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'subscription_plan_updated',
                targetType: 'subscription_plan',
                targetId: plan.id,
                details: { planName: plan.name }
            }
        });

        return NextResponse.json({ plan });
    } catch (error) {
        console.error('Error updating subscription plan:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer un plan d'abonnement
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const plan = await prisma.subscriptionPlan.delete({
            where: { id }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'subscription_plan_deleted',
                targetType: 'subscription_plan',
                targetId: plan.id,
                details: { planName: plan.name }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subscription plan:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

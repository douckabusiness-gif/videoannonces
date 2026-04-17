import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check admin access
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

// Helper function to log admin actions
async function logAdminAction(adminId: string, action: string, targetType?: string, targetId?: string, details?: any, request?: NextRequest) {
    try {
        await prisma.adminLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                details,
                ipAddress: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown'
            }
        });
    } catch (error) {
        console.error('Error logging admin action:', error);
    }
}

// PATCH - Moderate listing (approve/reject)
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const body = await request.json();
        const { moderationStatus, rejectionReason } = body;

        if (!['approved', 'rejected'].includes(moderationStatus)) {
            return NextResponse.json({ error: 'Statut de modération invalide' }, { status: 400 });
        }

        const updateData: any = {
            moderationStatus,
            moderatedBy: accessCheck.adminId,
            moderatedAt: new Date()
        };

        if (moderationStatus === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const listing = await prisma.listing.update({
            where: { id: params.id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Log admin action
        await logAdminAction(
            accessCheck.adminId,
            `listing_${moderationStatus}`,
            'listing',
            params.id,
            { title: listing.title, reason: rejectionReason },
            request
        );

        return NextResponse.json({
            listing,
            message: `Annonce ${moderationStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`
        });

    } catch (error) {
        console.error('Error moderating listing:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Delete listing
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const listing = await prisma.listing.findUnique({
            where: { id: params.id },
            select: { title: true }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Annonce non trouvée' }, { status: 404 });
        }

        await prisma.listing.delete({
            where: { id: params.id }
        });

        // Log admin action
        await logAdminAction(
            accessCheck.adminId,
            'listing_deleted',
            'listing',
            params.id,
            { title: listing.title },
            request
        );

        return NextResponse.json({ message: 'Annonce supprimée avec succès' });

    } catch (error) {
        console.error('Error deleting listing:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

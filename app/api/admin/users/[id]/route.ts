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

// GET - Get specific user details
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        listings: true,
                        messages: true,
                        buyerConversations: true,
                        sellerConversations: true,
                        reviewsGiven: true,
                        reviewsReceived: true,
                        payments: true
                    }
                },
                subscription: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json({ user });

    } catch (error: any) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: `Erreur serveur: ${error.message || 'Inconnue'}` }, { status: 500 });
    }
}

// PATCH - Update user (role, suspend, etc.)
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const body = await request.json();
        const {
            role,
            suspended,
            suspendedUntil,
            suspendedReason,
            premium,
            premiumTier,
            isVendor,
        } = body;

        const updateData: any = {};
        let action = '';

        if (isVendor !== undefined) {
            updateData.isVendor = Boolean(isVendor);
            action = isVendor ? 'user_vendor_enabled' : 'user_vendor_disabled';
        }

        if (role !== undefined) {
            updateData.role = role;
            action = action || `user_role_changed_to_${role}`;
        }

        if (suspended !== undefined) {
            updateData.suspended = suspended;
            if (suspended) {
                updateData.suspendedUntil = suspendedUntil ? new Date(suspendedUntil) : null;
                updateData.suspendedReason = suspendedReason || null;
                action = 'user_suspended';
            } else {
                updateData.suspendedUntil = null;
                updateData.suspendedReason = null;
                action = 'user_unsuspended';
            }
        }

        if (premium !== undefined) {
            updateData.premium = premium;
            action = premium ? 'user_premium_granted' : 'user_premium_revoked';
        }

        if (premiumTier !== undefined) {
            updateData.premiumTier = premiumTier;
            action = `user_premium_tier_changed_to_${premiumTier}`;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Log admin action
        await logAdminAction(accessCheck.adminId, action, 'user', id, body, request);

        return NextResponse.json({ user, message: 'Utilisateur mis à jour avec succès' });

    } catch (error: any) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: `Erreur serveur: ${error.message || 'Inconnue'}` }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        // Prevent deleting admin users
        if (user.role === 'ADMIN') {
            return NextResponse.json({ error: 'Impossible de supprimer un administrateur' }, { status: 403 });
        }

        // Delete user and related data (cascade)
        await prisma.user.delete({
            where: { id }
        });

        // Log admin action
        await logAdminAction(accessCheck.adminId, 'user_deleted', 'user', id, { userName: user.name }, request);

        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });

    } catch (error: any) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ 
            error: `Erreur serveur: ${error.message || 'Inconnue'}`,
            details: error.code || undefined
        }, { status: 500 });
    }
}

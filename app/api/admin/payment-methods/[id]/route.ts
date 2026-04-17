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

// PATCH - Modifier un mode de paiement
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { name, code, description, instruction, icon, color, active, order, phoneNumber, paymentLink, config } = body;

        const method = await prisma.paymentMethod.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(code && { code }),
                ...(description !== undefined && { description }),
                ...(instruction !== undefined && { instruction }),
                ...(icon !== undefined && { icon }),
                ...(color !== undefined && { color }),
                ...(active !== undefined && { active }),
                ...(order !== undefined && { order }),
                ...(phoneNumber !== undefined && { phoneNumber }),
                ...(paymentLink !== undefined && { paymentLink }),
                ...(config !== undefined && { config })
            }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'payment_method_updated',
                targetType: 'payment_method',
                targetId: method.id,
                details: { methodName: method.name }
            }
        });

        return NextResponse.json({ method });
    } catch (error) {
        console.error('Error updating payment method:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer un mode de paiement
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const method = await prisma.paymentMethod.delete({
            where: { id: params.id }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'payment_method_deleted',
                targetType: 'payment_method',
                targetId: method.id,
                details: { methodName: method.name }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

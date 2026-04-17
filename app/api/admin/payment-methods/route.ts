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

// GET - Lister tous les modes de paiement
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const methods = await prisma.paymentMethod.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({ methods });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer un nouveau mode de paiement
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { name, code, description, instruction, icon, color, active, order, phoneNumber, paymentLink, config } = body;

        // Validation
        if (!name || !code) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const method = await prisma.paymentMethod.create({
            data: {
                name,
                code,
                description,
                instruction,
                icon,
                color: color || 'from-gray-500 to-gray-600',
                active: active !== undefined ? active : true,
                order: order || 0,
                phoneNumber,
                paymentLink,
                config: config || null
            }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'payment_method_created',
                targetType: 'payment_method',
                targetId: method.id,
                details: { methodName: name }
            }
        });

        return NextResponse.json({ method }, { status: 201 });
    } catch (error) {
        console.error('Error creating payment method:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

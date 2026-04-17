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

// GET - Lister tous les packages de boost
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const boosts = await prisma.boostPackage.findMany({
            orderBy: { price: 'asc' }
        });

        return NextResponse.json({ boosts });
    } catch (error) {
        console.error('Error fetching boost packages:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer un nouveau package de boost
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, price, duration, features, active } = body;

        // Validation
        if (!name || !price || !duration) {
            return NextResponse.json({ error: 'Données manquantes (nom, prix, durée)' }, { status: 400 });
        }

        const boost = await prisma.boostPackage.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration),
                features: features || [],
                active: active !== undefined ? active : true
            }
        });

        // Log admin action
        await prisma.adminLog.create({
            data: {
                adminId: session.user.id,
                action: 'boost_package_created',
                targetType: 'boost_package',
                targetId: boost.id,
                details: { boostName: name }
            }
        });

        return NextResponse.json({ boost }, { status: 201 });
    } catch (error) {
        console.error('Error creating boost package:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

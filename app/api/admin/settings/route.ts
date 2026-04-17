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

// GET - Get all system settings
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';

        const where: any = {};
        if (category) {
            where.category = category;
        }

        const settings = await prisma.systemSettings.findMany({
            where,
            orderBy: { category: 'asc' }
        });

        // Group by category
        const grouped = settings.reduce((acc, setting) => {
            if (!acc[setting.category]) {
                acc[setting.category] = [];
            }
            acc[setting.category].push(setting);
            return acc;
        }, {} as any);

        return NextResponse.json({ settings, grouped });

    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Create or update a setting
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const body = await request.json();
        const { key, value, description, category } = body;

        const setting = await prisma.systemSettings.upsert({
            where: { key },
            update: {
                value,
                description,
                category,
                updatedBy: accessCheck.adminId
            },
            create: {
                key,
                value,
                description,
                category,
                updatedBy: accessCheck.adminId
            }
        });

        return NextResponse.json({ setting, message: 'Paramètre enregistré avec succès' });

    } catch (error) {
        console.error('Error saving setting:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Delete a setting
export async function DELETE(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Clé requise' }, { status: 400 });
        }

        await prisma.systemSettings.delete({
            where: { key }
        });

        return NextResponse.json({ message: 'Paramètre supprimé avec succès' });

    } catch (error) {
        console.error('Error deleting setting:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

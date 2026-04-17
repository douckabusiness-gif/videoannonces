import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper pour vérifier l'accès admin
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
        return { error: 'Accès refusé - Admin uniquement', status: 403 };
    }

    return { adminId: session.user.id };
}

/**
 * GET - Récupérer toutes les configurations d'automatisation
 */
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const enabled = searchParams.get('enabled');

        const where: any = {};
        if (category) where.category = category;
        if (enabled !== null) where.enabled = enabled === 'true';

        const configs = await prisma.automationConfig.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: { logs: true }
                }
            }
        });

        // Masquer les API keys sensibles
        const sanitized = configs.map(config => ({
            ...config,
            apiKey: config.apiKey ? '***HIDDEN***' : null
        }));

        return NextResponse.json(sanitized);

    } catch (error) {
        console.error('Erreur récupération configs:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * POST - Créer une nouvelle configuration
 */
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const data = await request.json();

        const config = await prisma.automationConfig.create({
            data: {
                feature: data.feature,
                name: data.name,
                description: data.description,
                category: data.category,
                enabled: data.enabled || false,
                config: data.config || {},
                apiProvider: data.apiProvider,
                apiKey: data.apiKey,
                apiEndpoint: data.apiEndpoint,
                dailyQuota: data.dailyQuota,
                monthlyQuota: data.monthlyQuota,
                costPerCall: data.costPerCall,
                schedule: data.schedule,
                conditions: data.conditions,
                priority: data.priority || 0,
                version: data.version || '1.0'
            }
        });

        // Log de création
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'automation',
                action: 'config_created',
                message: `Configuration "${config.name}" créée`,
                userId: accessCheck.adminId,
                metadata: { configId: config.id, feature: config.feature }
            }
        });

        return NextResponse.json(config, { status: 201 });

    } catch (error: any) {
        console.error('Erreur création config:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * PATCH - Mettre à jour une configuration
 */
export async function PATCH(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json(
                { error: 'ID requis' },
                { status: 400 }
            );
        }

        const config = await prisma.automationConfig.update({
            where: { id },
            data: updateData
        });

        // Log de modification
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'automation',
                action: 'config_updated',
                message: `Configuration "${config.name}" mise à jour`,
                userId: accessCheck.adminId,
                metadata: { configId: config.id, changes: Object.keys(updateData) }
            }
        });

        return NextResponse.json(config);

    } catch (error: any) {
        console.error('Erreur mise à jour config:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Supprimer une configuration
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

        const config = await prisma.automationConfig.delete({
            where: { id }
        });

        // Log de suppression
        await prisma.systemLog.create({
            data: {
                type: 'warning',
                category: 'automation',
                action: 'config_deleted',
                message: `Configuration "${config.name}" supprimée`,
                userId: accessCheck.adminId,
                metadata: { feature: config.feature }
            }
        });

        return NextResponse.json({ success: true, message: 'Configuration supprimée' });

    } catch (error: any) {
        console.error('Erreur suppression config:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

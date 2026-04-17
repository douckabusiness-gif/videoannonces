import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

/**
 * POST - Toggle l'état d'une automatisation (ON/OFF)
 */
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { feature, enabled } = await request.json();

        if (!feature || enabled === undefined) {
            return NextResponse.json(
                { error: 'feature et enabled requis' },
                { status: 400 }
            );
        }

        const config = await prisma.automationConfig.update({
            where: { feature },
            data: { enabled }
        });

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: enabled ? 'success' : 'warning',
                category: 'automation',
                action: enabled ? 'automation_enabled' : 'automation_disabled',
                message: `Automatisation "${config.name}" ${enabled ? 'activée' : 'désactivée'}`,
                userId: accessCheck.adminId,
                metadata: { feature, enabled }
            }
        });

        // Log dans AutomationLog
        await prisma.automationLog.create({
            data: {
                configId: config.id,
                feature,
                action: enabled ? 'enabled' : 'disabled',
                metadata: {
                    adminId: accessCheck.adminId,
                    timestamp: new Date().toISOString()
                }
            }
        });

        return NextResponse.json({
            success: true,
            config,
            message: `Automatisation ${enabled ? 'activée' : 'désactivée'} avec succès`
        });

    } catch (error: any) {
        console.error('Erreur toggle automation:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

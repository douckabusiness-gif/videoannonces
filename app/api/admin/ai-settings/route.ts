import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les paramètres IA
export async function GET(request: NextRequest) {
    try {
        const settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            return NextResponse.json({
                id: 'default',
                enableAIDescriptionGenerator: true,
            });
        }

        return NextResponse.json({
            id: settings.id,
            enableAIDescriptionGenerator: settings.enableAIDescriptionGenerator,
        });
    } catch (error: any) {
        console.error('Erreur récupération settings IA:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// PATCH - Mettre à jour les paramètres IA (Admin uniquement)
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Vérifier que l'utilisateur est admin
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        });

        if (user?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Accès refusé - Admin uniquement' },
                { status: 403 }
            );
        }

        const { enableAIDescriptionGenerator } = await request.json();

        // Mettre à jour ou créer
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'VideoBoutique',
                    enableAIDescriptionGenerator: enableAIDescriptionGenerator ?? true,
                }
            });
        } else {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    enableAIDescriptionGenerator: enableAIDescriptionGenerator ?? settings.enableAIDescriptionGenerator,
                }
            });
        }

        return NextResponse.json({
            success: true,
            settings: {
                id: settings.id,
                enableAIDescriptionGenerator: settings.enableAIDescriptionGenerator,
            }
        });
    } catch (error: any) {
        console.error('Erreur mise à jour settings IA:', error);
        return NextResponse.json(
            { error: 'Erreur serveur', message: error.message },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les templates de l'utilisateur
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const templates = await prisma.automationTemplate.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(templates);

    } catch (error) {
        console.error('Erreur récupération templates:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Créer ou mettre à jour un template
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const { trigger, response, active, id } = body;

        if (!trigger || !response) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        let template;

        if (id) {
            // Mise à jour
            template = await prisma.automationTemplate.update({
                where: { id },
                data: {
                    trigger: trigger.toLowerCase(),
                    actions: { response },
                    active
                }
            });
        } else {
            // Création
            template = await prisma.automationTemplate.create({
                data: {
                    userId: session.user.id,
                    name: `Auto Reply ${trigger}`,
                    trigger: trigger.toLowerCase(),
                    conditions: {},
                    actions: { response },
                    active: active ?? true
                }
            });
        }

        return NextResponse.json(template);

    } catch (error) {
        console.error('Erreur sauvegarde template:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer un template
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        // Vérification Premium
        if (!session.user.premium) {
            return NextResponse.json({ error: 'Réservé aux membres Premium' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

        await prisma.automationTemplate.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 });
    }
}

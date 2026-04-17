import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SETTINGS_KEY = 'i18n_settings';
const DEFAULT_SETTINGS = {
    multiLanguageEnabled: true,
    availableLanguages: ['fr', 'en', 'es'],
    defaultLanguage: 'fr',
    autoDetect: true
};

// GET - Récupérer les paramètres i18n
export async function GET() {
    try {
        // Note: On laisse l'accès public pour que le context puisse charger la config
        // Ou on limite si nécessaire, mais le frontend en a besoin pour tout le monde

        const settings = await prisma.setting.findUnique({
            where: { key: SETTINGS_KEY }
        });

        if (!settings) {
            return NextResponse.json(DEFAULT_SETTINGS);
        }

        return NextResponse.json(JSON.parse(settings.value));
    } catch (error) {
        console.error('Error fetching i18n settings:', error);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

// POST - Mettre à jour les paramètres i18n
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Vérifier que l'utilisateur est admin
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        // Validation basique
        const cleanSettings = {
            multiLanguageEnabled: Boolean(body.multiLanguageEnabled),
            availableLanguages: Array.isArray(body.availableLanguages) ? body.availableLanguages : ['fr'],
            defaultLanguage: typeof body.defaultLanguage === 'string' ? body.defaultLanguage : 'fr',
            autoDetect: Boolean(body.autoDetect)
        };

        const settings = await prisma.setting.upsert({
            where: { key: SETTINGS_KEY },
            update: { value: JSON.stringify(cleanSettings) },
            create: {
                key: SETTINGS_KEY,
                value: JSON.stringify(cleanSettings)
            }
        });

        return NextResponse.json({
            success: true,
            settings: JSON.parse(settings.value),
            message: 'Paramètres i18n mis à jour avec succès'
        });
    } catch (error) {
        console.error('Error updating i18n settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

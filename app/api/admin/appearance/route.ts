import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const SETTINGS_DIR = path.join(process.cwd(), '.settings');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'homepage-layout.json');

// Créer le dossier s'il n'existe pas
async function ensureSettingsDir() {
    if (!existsSync(SETTINGS_DIR)) {
        await mkdir(SETTINGS_DIR, { recursive: true });
    }
}

export async function GET() {
    try {
        await ensureSettingsDir();

        // Lire le fichier de paramètres s'il existe
        if (existsSync(SETTINGS_FILE)) {
            const data = await readFile(SETTINGS_FILE, 'utf-8');
            const settings = JSON.parse(data);
            return NextResponse.json({ settings });
        }

        // Retourner les paramètres par défaut
        return NextResponse.json({
            settings: {
                layout: 'modern',
                primaryColor: '#f97316',
                secondaryColor: '#fb923c',
                accentColor: '#fdba74',
            }
        });
    } catch (error) {
        console.error('Erreur récupération paramètres:', error);
        // Retourner les paramètres par défaut en cas d'erreur
        return NextResponse.json({
            settings: {
                layout: 'modern',
                primaryColor: '#f97316',
                secondaryColor: '#fb923c',
                accentColor: '#fdba74',
            }
        });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { layout, primaryColor, secondaryColor, accentColor } = body;

        const settings = {
            layout: layout || 'modern',
            primaryColor: primaryColor || '#f97316',
            secondaryColor: secondaryColor || '#fb923c',
            accentColor: accentColor || '#fdba74',
            updatedAt: new Date().toISOString()
        };

        // Créer le dossier et sauvegarder les paramètres
        await ensureSettingsDir();
        await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');

        return NextResponse.json({ success: true, settings });
    } catch (error) {
        console.error('Erreur sauvegarde paramètres:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

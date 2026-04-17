import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BannerConfig } from '@/types/banner';

// GET - Récupérer la configuration de la bannière
export async function GET() {
    try {
        // Récupérer depuis la base de données
        const setting = await prisma.setting.findUnique({
            where: { key: 'homepage_banner' }
        });

        if (!setting) {
            // Configuration par défaut
            const defaultConfig: BannerConfig = {
                enabled: false,
                slides: []
            };
            return NextResponse.json(defaultConfig);
        }

        return NextResponse.json(JSON.parse(setting.value));
    } catch (error) {
        console.error('Error fetching banner config:', error);
        return NextResponse.json(
            { error: 'Failed to fetch banner configuration' },
            { status: 500 }
        );
    }
}

// POST - Sauvegarder la configuration de la bannière
export async function POST(request: Request) {
    try {
        console.log('📝 Banner POST request received');

        const session = await getServerSession(authOptions);
        console.log('🔐 Session:', session ? 'Found' : 'Not found');

        // Vérifier que l'utilisateur est admin
        // Utiliser l'ID plutôt que l'email, car l'email peut être manquant pour les utilisateurs via téléphone
        if (!session?.user?.id) {
            console.log('❌ No session or missing user ID');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('👤 Looking for user ID:', session.user.id);
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        console.log('👤 User found:', user ? `${user.name} (${user.role})` : 'Not found');

        if (user?.role !== 'ADMIN') {
            console.log('❌ User is not admin');
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const config: BannerConfig = await request.json();
        console.log('📦 Config received:', config);

        // Valider les données
        if (typeof config.enabled !== 'boolean') {
            console.log('❌ enabled field is not boolean');
            return NextResponse.json(
                { error: 'enabled must be a boolean' },
                { status: 400 }
            );
        }

        if (!Array.isArray(config.slides)) {
            console.log('❌ slides is not an array');
            return NextResponse.json(
                { error: 'slides must be an array' },
                { status: 400 }
            );
        }

        // Valider chaque slide
        for (const slide of config.slides) {
            if (!slide.title || !slide.videoUrl) {
                console.log('❌ Missing title or videoUrl in slide:', slide);
                return NextResponse.json(
                    { error: 'Each slide must have title and videoUrl' },
                    { status: 400 }
                );
            }
        }

        console.log('💾 Saving to database...');
        // Sauvegarder dans la base de données
        const result = await prisma.setting.upsert({
            where: { key: 'homepage_banner' },
            update: {
                value: JSON.stringify(config),
                updatedAt: new Date()
            },
            create: {
                key: 'homepage_banner',
                value: JSON.stringify(config),
                description: 'Configuration de la bannière de la page d\'accueil'
            }
        });

        console.log('✅ Banner config saved successfully');
        return NextResponse.json({ success: true, config });
    } catch (error: any) {
        console.error('❌ Error saving banner config:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
        return NextResponse.json(
            {
                error: 'Failed to save banner configuration',
                details: error.message
            },
            { status: 500 }
        );
    }
}

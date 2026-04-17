import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les paramètres du site
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        // Récupérer ou créer les paramètres
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'VideoBoutique',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erreur récupération paramètres site:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Mettre à jour les paramètres du site
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const data = await request.json();

        // Récupérer les paramètres existants ou créer
        let settings = await prisma.siteSettings.findFirst();

        if (settings) {
            // Mettre à jour
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    siteName: data.siteName,
                    siteSlogan: data.siteSlogan,
                    siteDescription: data.siteDescription,
                    heroTitle: data.heroTitle,
                    heroSubtitle: data.heroSubtitle,
                    urgentSectionTitle: data.urgentSectionTitle,
                    recentSectionTitle: data.recentSectionTitle,
                    shopsSectionTitle: data.shopsSectionTitle,
                    logo: data.logo,
                    favicon: data.favicon,
                    contactEmail: data.contactEmail,
                    contactPhone: data.contactPhone,
                    address: data.address,
                    socialFacebook: data.socialFacebook,
                    socialTwitter: data.socialTwitter,
                    socialInstagram: data.socialInstagram,
                    socialLinkedIn: data.socialLinkedIn,
                    socialYouTube: data.socialYouTube,
                    socialTikTok: data.socialTikTok,
                    maintenanceMode: data.maintenanceMode,
                    maintenanceMessage: data.maintenanceMessage,
                    homepageSections: data.homepageSections,
                },
            });
        } else {
            // Créer
            settings = await prisma.siteSettings.create({
                data,
            });
        }

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'system',
                action: 'update_site_settings',
                message: 'Paramètres du site mis à jour',
                userId: session.user.id,
            },
        });

        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('Erreur mise à jour paramètres site:', error);
        console.error('Détails erreur:', error.message);
        console.error('Stack:', error.stack);
        return NextResponse.json(
            {
                error: 'Erreur serveur',
                details: error.message,
                code: error.code
            },
            { status: 500 }
        );
    }
}

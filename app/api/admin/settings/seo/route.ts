import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer la configuration SEO
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        let settings = await prisma.seoSettings.findFirst();

        if (!settings) {
            settings = await prisma.seoSettings.create({
                data: {},
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erreur récupération config SEO:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Mettre à jour la configuration SEO
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

        let settings = await prisma.seoSettings.findFirst();

        if (settings) {
            settings = await prisma.seoSettings.update({
                where: { id: settings.id },
                data: {
                    defaultTitle: data.defaultTitle,
                    defaultDescription: data.defaultDescription,
                    defaultKeywords: data.defaultKeywords,
                    ogImage: data.ogImage,
                    ogType: data.ogType,
                    twitterHandle: data.twitterHandle,
                    twitterCardType: data.twitterCardType,
                    googleAnalyticsId: data.googleAnalyticsId,
                    googleTagManagerId: data.googleTagManagerId,
                    facebookPixelId: data.facebookPixelId,
                    sitemapEnabled: data.sitemapEnabled,
                    robotsTxt: data.robotsTxt,
                },
            });
        } else {
            settings = await prisma.seoSettings.create({
                data,
            });
        }

        // Log
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'system',
                action: 'update_seo_settings',
                message: 'Configuration SEO mise à jour',
                userId: session.user.id,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erreur mise à jour config SEO:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

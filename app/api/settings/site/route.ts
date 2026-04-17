import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - Récupérer les paramètres publics du site
 * (Accessible sans authentification)
 */
export async function GET() {
    try {
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Créer des paramètres par défaut si aucun n'existe
            settings = await prisma.siteSettings.create({
                data: {
                    siteName: 'VideoBoutique',
                    siteSlogan: 'Votre marketplace vidéo en Côte d\'Ivoire',
                    siteDescription: 'La plateforme de commerce en vidéo qui révolutionne l\'achat et la vente en ligne.',
                },
            });
        }

        const soloModeSetting = await prisma.setting.findUnique({
            where: { key: 'PLATFORM_SOLO_MODE' }
        });

        const isSoloMode = soloModeSetting?.value === 'true';

        // Retourner uniquement les paramètres publics
        return NextResponse.json({
            siteName: settings.siteName,
            siteSlogan: settings.siteSlogan,
            siteDescription: settings.siteDescription,
            heroTitle: settings.heroTitle,
            heroSubtitle: settings.heroSubtitle,
            urgentSectionTitle: settings.urgentSectionTitle,
            recentSectionTitle: settings.recentSectionTitle,
            shopsSectionTitle: settings.shopsSectionTitle,
            logo: settings.logo,
            favicon: settings.favicon,
            pwaIcon: settings.pwaIcon,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            address: settings.address,
            socialFacebook: settings.socialFacebook,
            socialTwitter: settings.socialTwitter,
            socialInstagram: settings.socialInstagram,
            socialLinkedIn: settings.socialLinkedIn,
            socialYouTube: settings.socialYouTube,
            socialTikTok: settings.socialTikTok,
            homepageSections: settings.homepageSections,
            primaryColor: settings.primaryColor,
            secondaryColor: settings.secondaryColor,
            accentColor: settings.accentColor,
            backgroundColor: settings.backgroundColor,
            headerColor: settings.headerColor,
            footerColor: settings.footerColor,
            headerTextColor: settings?.headerTextColor,
            footerTextColor: settings?.footerTextColor,
            urgentBgColor: settings?.urgentBgColor,
            shopsBgColor: settings?.shopsBgColor,
            recentBgColor: settings?.recentBgColor,
            urgentTextColor: settings?.urgentTextColor,
            shopsTextColor: settings?.shopsTextColor,
            recentTextColor: settings?.recentTextColor,
            soloMode: isSoloMode,
        });
    } catch (error) {
        console.error('Erreur récupération paramètres site:', error);

        // Retourner des valeurs par défaut en cas d'erreur
        return NextResponse.json({
            siteName: 'VideoBoutique',
            siteSlogan: 'Votre marketplace vidéo',
            siteDescription: 'La plateforme de commerce en vidéo',
            logo: null,
            favicon: null,
            contactEmail: null,
            contactPhone: null,
            address: null,
            socialFacebook: null,
            socialTwitter: null,
            socialInstagram: null,
            socialLinkedIn: null,
            socialYouTube: null,
            socialTikTok: null,
        });
    }
}

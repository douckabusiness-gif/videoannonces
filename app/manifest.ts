import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    let settings = null;
    try {
        settings = await prisma.siteSettings.findFirst();
    } catch {
        // Build Docker / CI sans DB : valeurs par défaut
    }

    const siteName = settings?.siteName || 'VideoAnnonces-CI';
    const themeColor = settings?.primaryColor || '#FF6B00';
    const logoUrl = settings?.pwaIcon || settings?.logo || '/icon-512.png';

    return {
        name: siteName,
        short_name: siteName,
        description: settings?.siteDescription || 'La première plateforme de petites annonces vidéo en Côte d\'Ivoire.',
        start_url: '/?utm_source=pwa',
        display: 'standalone',
        background_color: settings?.backgroundColor || '#ffffff',
        theme_color: themeColor,
        orientation: 'portrait-primary',
        icons: [
            {
                src: logoUrl,
                sizes: 'any',
                type: logoUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
            },
            {
                src: logoUrl,
                sizes: '192x192',
                type: logoUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
            },
            {
                src: logoUrl,
                sizes: '512x512',
                type: logoUrl.endsWith('.png') ? 'image/png' : 'image/jpeg',
            },
        ],
    };
}

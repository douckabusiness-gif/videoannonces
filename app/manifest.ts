import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    let settings = null;
    try {
        settings = await prisma.siteSettings.findFirst();
    } catch {
        // Build Docker / CI sans DB : valeurs par défaut
    }

    const siteName = settings?.siteName || 'AfriVideoAnnonce';
    const themeColor = settings?.primaryColor || '#FF6B00';
    const backgroundColor = settings?.backgroundColor || '#ffffff';

    // Utiliser l'API dynamique d'icônes PWA pour avoir de vraies icônes carrées
    const pwaIconBase = '/api/pwa-icon';

    return {
        name: siteName,
        short_name: siteName.length > 12 ? siteName.substring(0, 12) : siteName,
        description: settings?.siteDescription || "La première plateforme de petites annonces vidéo en Côte d'Ivoire.",
        start_url: '/?utm_source=pwa',
        display: 'standalone',
        background_color: backgroundColor,
        theme_color: themeColor,
        orientation: 'portrait-primary',
        categories: ['shopping', 'marketplace'],
        icons: [
            {
                src: `${pwaIconBase}?size=72`,
                sizes: '72x72',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=96`,
                sizes: '96x96',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=128`,
                sizes: '128x128',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=144`,
                sizes: '144x144',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=152`,
                sizes: '152x152',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=192`,
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'maskable',
            },
            {
                src: `${pwaIconBase}?size=384`,
                sizes: '384x384',
                type: 'image/svg+xml',
            },
            {
                src: `${pwaIconBase}?size=512`,
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any',
            },
        ],
        shortcuts: [
            {
                name: 'Publier une annonce',
                short_name: 'Publier',
                description: 'Créer une nouvelle annonce vidéo',
                url: '/dashboard/create?utm_source=pwa',
                icons: [{ src: `${pwaIconBase}?size=96`, sizes: '96x96' }],
            },
            {
                name: 'Mes Annonces',
                short_name: 'Annonces',
                description: 'Voir mes annonces',
                url: '/dashboard/listings?utm_source=pwa',
                icons: [{ src: `${pwaIconBase}?size=96`, sizes: '96x96' }],
            },
        ],
    };
}

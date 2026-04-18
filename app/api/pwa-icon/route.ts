import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/pwa-icon?size=192
 * Génère une icône PWA carrée dynamique.
 * Priorité : favicon admin → pwaIcon → logo → lettre initiale
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const size = parseInt(searchParams.get('size') || '512');

    let settings = null;
    try {
        settings = await prisma.siteSettings.findFirst({
            select: {
                logo: true,
                pwaIcon: true,
                favicon: true,
                siteName: true,
                primaryColor: true,
                secondaryColor: true,
            },
        });
    } catch {
        // Fallback si DB non disponible
    }

    const primaryColor = settings?.primaryColor || '#FF6B35';
    const secondaryColor = settings?.secondaryColor || '#F7931E';
    const siteName = settings?.siteName || 'V';
    const letter = siteName.charAt(0).toUpperCase();

    // Priorité 1 : favicon uploadé dans l'admin (image réelle déjà carrée)
    const faviconUrl = settings?.favicon;
    if (faviconUrl) {
        return NextResponse.redirect(new URL(faviconUrl, request.url));
    }

    // Priorité 2 : icône PWA dédiée configurée dans l'admin
    const pwaIconUrl = settings?.pwaIcon;
    if (pwaIconUrl) {
        return NextResponse.redirect(new URL(pwaIconUrl, request.url));
    }

    // Priorité 3 : générer une icône SVG carrée avec le logo centré
    const logoUrl = settings?.logo;
    const padding = Math.round(size * 0.15);
    const logoSize = size - padding * 2;

    let svgContent: string;

    if (logoUrl) {
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
    <clipPath id="rounded">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" ry="${Math.round(size * 0.2)}" />
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" ry="${Math.round(size * 0.2)}" fill="url(#bg)" />
  <rect 
    x="${padding}" 
    y="${Math.round(size * 0.3)}" 
    width="${logoSize}" 
    height="${Math.round(logoSize * 0.4)}" 
    rx="${Math.round(size * 0.05)}" 
    fill="white" 
    fill-opacity="0.95"
  />
  <image 
    href="${logoUrl}" 
    x="${padding}" 
    y="${Math.round(size * 0.3)}" 
    width="${logoSize}" 
    height="${Math.round(logoSize * 0.4)}" 
    preserveAspectRatio="xMidYMid meet"
    clip-path="url(#rounded)"
  />
</svg>`;
    } else {
        // Priorité 4 : Icône avec la lettre initiale
        const fontSize = Math.round(size * 0.45);
        svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" ry="${Math.round(size * 0.2)}" fill="url(#bg)" />
  <text 
    x="${size / 2}" 
    y="${size / 2 + fontSize * 0.35}" 
    text-anchor="middle" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    font-weight="bold" 
    fill="white"
  >${letter}</text>
</svg>`;
    }

    return new NextResponse(svgContent, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}

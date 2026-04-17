import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';


export default function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const url = request.nextUrl;
    const userAgent = request.headers.get('user-agent') || '';

    // --- GEO-RESTRICTION LOGIC ---
    // On Vercel, x-vercel-ip-country is automated. 
    // For other environments, we can default to 'CI' or use an external check.
    const country = request.headers.get('x-vercel-ip-country') || 'CI'; // Default to CI for local dev
    const isGoogleBot = userAgent.toLowerCase().includes('googlebot') || userAgent.toLowerCase().includes('bingbot');

    // We allow Côte d'Ivoire (CI) and SEO Bots
    const isAllowedZone = country === 'CI' || isGoogleBot;

    // If it's an API call and NOT in allowed zone, block mutation methods
    if (url.pathname.startsWith('/api') && !isAllowedZone) {
        const sensitiveMethods = ['POST', 'PUT', 'DELETE'];
        if (sensitiveMethods.includes(request.method)) {
            return new NextResponse(
                JSON.stringify({ error: 'Accès restreint à la Côte d\'Ivoire pour cette opération.' }),
                { status: 403, headers: { 'content-type': 'application/json' } }
            );
        }
    }

    // 1. Gestion des sous-domaines
    const subdomain = getSubdomain(hostname);
    if (subdomain && subdomain !== 'www' && !isReservedSubdomain(subdomain)) {
        const globalRoutes = ['/listings', '/dashboard', '/admin', '/api', '/login', '/register', '/messages'];
        const isGlobalRoute = globalRoutes.some(route => url.pathname.startsWith(route));

        if (!isGlobalRoute) {
            // Réécriture transparente vers /shop/[subdomain]
            const newUrl = new URL(`/shop/${subdomain}${url.pathname}${url.search}`, request.url);
            const response = NextResponse.rewrite(newUrl);

            // On passe l'info de restriction au client via un header personnalisé
            response.headers.set('x-geo-restricted', isAllowedZone ? 'false' : 'true');
            return response;
        }
    }

    const response = NextResponse.next();
    // On passe l'info de restriction au client via un cookie (facile à lire côté client)
    response.cookies.set('geoRestricted', isAllowedZone ? 'false' : 'true', { path: '/' });
    return response;
}

// Helpers
function getSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    if (hostname.includes('localhost')) {
        const localParts = hostname.split('.');
        if (localParts.length > 1 && localParts[0] !== 'localhost') return localParts[0];
        return null;
    }
    if (parts.length >= 3) return parts[0];
    return null;
}

function isReservedSubdomain(subdomain: string): boolean {
    const reserved = ['www', 'api', 'admin', 'dashboard', 'app', 'mail', 'ftp', 'shop', 'videoboutique', 'localhost'];
    return reserved.includes(subdomain.toLowerCase());
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

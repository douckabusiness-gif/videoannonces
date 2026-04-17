// Utilitaires pour la gestion des sous-domaines

const RESERVED_SUBDOMAINS = [
    'www',
    'api',
    'admin',
    'dashboard',
    'app',
    'mail',
    'ftp',
    'blog',
    'shop',
    'store',
    'cdn',
    'static',
    'assets',
    'images',
    'videos',
    'files',
    'videoboutique',
    'localhost',
];

/**
 * Valide un nom de sous-domaine
 * - 3-20 caractères
 * - Lettres, chiffres, tirets uniquement
 * - Commence par une lettre
 * - Pas de mots réservés
 */
export function validateSubdomain(subdomain: string): {
    valid: boolean;
    error?: string;
} {
    // Vérifier la longueur
    if (subdomain.length < 3) {
        return { valid: false, error: 'Le sous-domaine doit contenir au moins 3 caractères' };
    }

    if (subdomain.length > 20) {
        return { valid: false, error: 'Le sous-domaine ne peut pas dépasser 20 caractères' };
    }

    // Vérifier le format
    const regex = /^[a-z][a-z0-9-]{2,19}$/;
    if (!regex.test(subdomain)) {
        return {
            valid: false,
            error: 'Le sous-domaine doit commencer par une lettre et contenir uniquement des lettres, chiffres et tirets',
        };
    }

    // Vérifier les mots réservés
    if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
        return { valid: false, error: 'Ce sous-domaine est réservé' };
    }

    // Vérifier qu'il ne commence/finit pas par un tiret
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
        return { valid: false, error: 'Le sous-domaine ne peut pas commencer ou finir par un tiret' };
    }

    // Vérifier qu'il n'y a pas de tirets consécutifs
    if (subdomain.includes('--')) {
        return { valid: false, error: 'Le sous-domaine ne peut pas contenir de tirets consécutifs' };
    }

    return { valid: true };
}

/**
 * Normalise un sous-domaine (lowercase, trim)
 */
export function normalizeSubdomain(subdomain: string): string {
    return subdomain.toLowerCase().trim();
}

/**
 * Génère un sous-domaine à partir d'un nom
 */
export function generateSubdomain(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-') // Remplacer caractères spéciaux par tirets
        .replace(/--+/g, '-') // Remplacer tirets multiples par un seul
        .replace(/^-|-$/g, '') // Supprimer tirets au début/fin
        .substring(0, 20); // Limiter à 20 caractères
}

/**
 * Construit l'URL complète d'une boutique
 */
export function getShopUrl(subdomain: string): string {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000';
    const protocol = domain.includes('localhost') ? 'http' : 'https';

    return `${protocol}://${subdomain}.${domain}`;
}

/**
 * Vérifie si un sous-domaine est réservé
 */
export function isReservedSubdomain(subdomain: string): boolean {
    return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

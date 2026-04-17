/**
 * Seul le compte autorisé (ou les admins) peut publier des annonces.
 */
import { getSoloModeEnabled } from './platform-flags';

export async function isSoloBusinessMode(): Promise<boolean> {
    // On prioritise la DB, mais on garde le fallback env si besoin d'overrider physiquement
    const dbValue = await getSoloModeEnabled();
    if (dbValue) return true;

    const v =
        process.env.SOLO_BUSINESS_MODE ?? process.env.NEXT_PUBLIC_SOLO_BUSINESS_MODE;
    return v === 'true' || v === '1';
}

export async function userCanPublishListings(userId: string, role?: string | null): Promise<boolean> {
    if (!(await isSoloBusinessMode())) return true;
    if (role === 'ADMIN') return true;

    const multi = process.env.SOLO_PUBLISHER_USER_IDS?.split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    if (multi && multi.length > 0) return multi.includes(userId);

    const single = process.env.SOLO_PUBLISHER_USER_ID?.trim();
    if (single) return userId === single;

    // Aucun ID configuré : seuls les admins peuvent publier
    return false;
}

export function soloPublishDeniedMessage(): string {
    return (
        process.env.SOLO_PUBLISH_DENIED_MESSAGE ||
        'La publication d’annonces est réservée au propriétaire du site. Mode vitrine solo activé.'
    );
}

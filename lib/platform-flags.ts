import { prisma } from '@/lib/prisma';

/** Inscription publique (création de compte) */
export const PLATFORM_PUBLIC_REGISTRATION = 'platform.public_registration_enabled';
/** Nouveaux comptes créés comme vendeur (isVendor) */
export const PLATFORM_SIGNUP_DEFAULT_VENDOR = 'platform.signup_default_vendor';
/** Mode Solo : Seul l'admin peut publier */
export const PLATFORM_SOLO_MODE = 'platform.solo_mode_enabled';

export async function getPublicRegistrationEnabled(): Promise<boolean> {
    const row = await prisma.setting.findUnique({
        where: { key: PLATFORM_PUBLIC_REGISTRATION },
    });
    if (!row) return true;
    return row.value === 'true' || row.value === '1';
}

export async function getSignupDefaultVendor(): Promise<boolean> {
    const row = await prisma.setting.findUnique({
        where: { key: PLATFORM_SIGNUP_DEFAULT_VENDOR },
    });
    if (!row) return true;
    return row.value === 'true' || row.value === '1';
}

export async function getSoloModeEnabled(): Promise<boolean> {
    const row = await prisma.setting.findUnique({
        where: { key: PLATFORM_SOLO_MODE },
    });
    if (!row) return false;
    return row.value === 'true' || row.value === '1';
}

export async function setPlatformBooleanFlag(
    key: string,
    value: boolean,
    description?: string
): Promise<void> {
    await prisma.setting.upsert({
        where: { key },
        create: {
            key,
            value: value ? 'true' : 'false',
            description: description ?? null,
        },
        update: { value: value ? 'true' : 'false' },
    });
}

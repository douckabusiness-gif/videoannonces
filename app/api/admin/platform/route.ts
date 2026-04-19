import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
    getPublicRegistrationEnabled,
    getSignupDefaultVendor,
    getSoloModeEnabled,
    getShopsEnabled,
    PLATFORM_PUBLIC_REGISTRATION,
    PLATFORM_SIGNUP_DEFAULT_VENDOR,
    PLATFORM_SOLO_MODE,
    PLATFORM_SHOPS_ENABLED,
    setPlatformBooleanFlag,
} from '@/lib/platform-flags';

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Non authentifié', status: 401 as const };
    }
    const u = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });
    if (u?.role !== 'ADMIN') {
        return { error: 'Accès refusé', status: 403 as const };
    }
    return { adminId: session.user.id };
}

export async function GET() {
    const access = await requireAdmin();
    if ('error' in access) {
        return NextResponse.json({ error: access.error }, { status: access.status });
    }
    const [publicRegistrationEnabled, signupDefaultVendor, soloModeEnabled, shopsEnabled] = await Promise.all([
        getPublicRegistrationEnabled(),
        getSignupDefaultVendor(),
        getSoloModeEnabled(),
        getShopsEnabled(),
    ]);
    return NextResponse.json({
        publicRegistrationEnabled,
        signupDefaultVendor,
        soloModeEnabled,
        shopsEnabled,
    });
}

export async function PATCH(request: NextRequest) {
    const access = await requireAdmin();
    if ('error' in access) {
        return NextResponse.json({ error: access.error }, { status: access.status });
    }

    const body = await request.json().catch(() => ({}));
    const { publicRegistrationEnabled, signupDefaultVendor, soloModeEnabled, shopsEnabled } = body as {
        publicRegistrationEnabled?: boolean;
        signupDefaultVendor?: boolean;
        soloModeEnabled?: boolean;
        shopsEnabled?: boolean;
    };

    if (typeof publicRegistrationEnabled === 'boolean') {
        await setPlatformBooleanFlag(
            PLATFORM_PUBLIC_REGISTRATION,
            publicRegistrationEnabled,
            'Autoriser la création de compte depuis la page inscription'
        );
    }
    if (typeof signupDefaultVendor === 'boolean') {
        await setPlatformBooleanFlag(
            PLATFORM_SIGNUP_DEFAULT_VENDOR,
            signupDefaultVendor,
            'Nouveaux comptes avec statut vendeur (isVendor)'
        );
    }
    if (typeof soloModeEnabled === 'boolean') {
        await setPlatformBooleanFlag(
            PLATFORM_SOLO_MODE,
            soloModeEnabled,
            'Mode Solo : Seul l’administrateur peut publier des annonces'
        );
    }
    if (typeof shopsEnabled === 'boolean') {
        await setPlatformBooleanFlag(
            PLATFORM_SHOPS_ENABLED,
            shopsEnabled,
            'Activer le système de boutiques (Boutiques Premium, Abonnements, SEO)'
        );
    }

    const [nextReg, nextVendor, nextSolo, nextShops] = await Promise.all([
        getPublicRegistrationEnabled(),
        getSignupDefaultVendor(),
        getSoloModeEnabled(),
        getShopsEnabled(),
    ]);

    try {
        await prisma.adminLog.create({
            data: {
                adminId: access.adminId,
                action: 'platform_flags_updated',
                targetType: 'platform',
                targetId: 'settings',
                details: {
                    publicRegistrationEnabled: nextReg,
                    signupDefaultVendor: nextVendor,
                    soloModeEnabled: nextSolo,
                    shopsEnabled: nextShops,
                },
                ipAddress:
                    request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown',
            },
        });
    } catch {
        // ignore log failure
    }

    return NextResponse.json({
        publicRegistrationEnabled: nextReg,
        signupDefaultVendor: nextVendor,
        soloModeEnabled: nextSolo,
        shopsEnabled: nextShops,
    });
}

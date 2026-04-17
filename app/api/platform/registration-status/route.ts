import { NextResponse } from 'next/server';
import { getPublicRegistrationEnabled, getSignupDefaultVendor } from '@/lib/platform-flags';

/** Lecture publique pour la page inscription (pas d'auth requise) */
export async function GET() {
    try {
        const [publicRegistrationEnabled, signupDefaultVendor] = await Promise.all([
            getPublicRegistrationEnabled(),
            getSignupDefaultVendor(),
        ]);
        return NextResponse.json({
            publicRegistrationEnabled,
            signupDefaultVendor,
        });
    } catch {
        return NextResponse.json(
            { publicRegistrationEnabled: true, signupDefaultVendor: true },
            { status: 200 }
        );
    }
}

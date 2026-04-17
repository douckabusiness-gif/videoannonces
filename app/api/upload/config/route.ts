import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Générer une signature pour l'upload unsigned
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        // Retourner les infos pour upload unsigned
        return NextResponse.json({
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            uploadPreset: 'videoboutique_unsigned', // Vous devrez créer ce preset
            folder: 'videoboutique/listings',
        });

    } catch (error: any) {
        console.error('Erreur config upload:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

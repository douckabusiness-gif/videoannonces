import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        // Vérifier authentification
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'image' | 'audio'

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Validation basique
        if (type === 'image' && !file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Format image invalide' }, { status: 400 });
        }
        if (type === 'audio' && !file.type.startsWith('audio/')) {
            return NextResponse.json({ error: 'Format audio invalide' }, { status: 400 });
        }

        // Conversion du fichier en buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload vers Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'videoboutique/chat',
                    resource_type: type === 'audio' ? 'video' : 'image', // Cloudinary traite l'audio comme 'video' souvent
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            url: (result as any).secure_url,
            type: type
        });

    } catch (error) {
        console.error('Erreur upload chat:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSoloBusinessMode, soloPublishDeniedMessage, userCanPublishListings } from '@/lib/solo-business';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const maxDuration = 300; // 5 minutes max for large video uploads

// Fonction pour uploader vers Cloudinary
async function uploadToCloudinary(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video',
                folder: 'videoboutique/listings',
                // Pas de preset: on utilise l'upload signé avec les clés API
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
}

// Fonction pour uploader localement
async function uploadLocally(file: File, userId: string): Promise<any> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    await mkdir(uploadsDir, { recursive: true });

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);

    // Sauvegarder le fichier
    await writeFile(filepath, buffer);

    // Retourner les URLs
    const videoUrl = `/uploads/videos/${filename}`;
    const thumbnailUrl = '/images/video-placeholder.jpg'; // Placeholder pour la miniature

    return {
        videoUrl,
        thumbnailUrl,
        publicId: filename,
        format: file.name.split('.').pop(),
        storage: 'local',
    };
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        if (
            isSoloBusinessMode() &&
            !userCanPublishListings(session.user.id, session.user.role)
        ) {
            return NextResponse.json(
                { error: soloPublishDeniedMessage() },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const forceLocal = searchParams.get('storage') === 'local';

        let formData: FormData;
        try {
            formData = await request.formData();
        } catch (parseError: any) {
            console.error('❌ Erreur parsing FormData (Probablement dépassement de limite de taille):', parseError);
            return NextResponse.json(
                { 
                    error: 'Échec de la lecture du fichier. Le fichier est peut-être trop volumineux pour le serveur.',
                    details: parseError.message 
                },
                { status: 500 }
            );
        }
        const videoFile = formData.get('video') as File;

        console.log('📦 FormData reçue:', {
            hasVideo: !!videoFile,
            videoType: videoFile?.type,
            videoSize: videoFile?.size,
            videoName: videoFile?.name
        });

        if (!videoFile) {
            console.error('❌ Fichier vidéo manquant dans FormData');
            return NextResponse.json(
                { error: 'Fichier vidéo manquant' },
                { status: 400 }
            );
        }

        // Vérifier la taille (max 300MB)
        const maxSize = 300 * 1024 * 1024;
        if (videoFile.size > maxSize) {
            console.error(`❌ Fichier trop volumineux: ${(videoFile.size / 1024 / 1024).toFixed(1)}MB`);
            return NextResponse.json(
                { error: `Fichier trop volumineux (${(videoFile.size / 1024 / 1024).toFixed(1)}MB). Maximum 300MB` },
                { status: 400 }
            );
        }

        console.log(`📹 Upload vidéo: ${videoFile.name}, taille: ${(videoFile.size / 1024 / 1024).toFixed(2)}MB`);

        let result: any;
        let storage = 'cloudinary';

        // Si force local ou pas de config Cloudinary
        if (forceLocal || !process.env.CLOUDINARY_CLOUD_NAME) {
            console.log('💾 Mode stockage local forcé ou Cloudinary non configuré');
            try {
                result = await uploadLocally(videoFile, session.user.id);
                storage = 'local';
            } catch (localError: any) {
                console.error('❌ Stockage local échoué:', localError);
                throw new Error('Impossible d\'uploader la vidéo localement');
            }
        } else {
            // Essayer Cloudinary avec timeout
            try {
                console.log('☁️ Tentative upload vers Cloudinary...');
                const bytes = await videoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Race entre upload et timeout de 60s (augmenté pour gros fichiers)
                const uploadPromise = uploadToCloudinary(buffer);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Cloudinary Timeout')), 60000)
                );

                result = await Promise.race([uploadPromise, timeoutPromise]);

                console.log('✅ Upload Cloudinary réussi:', result.public_id);

                // Générer miniature
                const thumbnailUrl = cloudinary.url(result.public_id, {
                    resource_type: 'video',
                    format: 'jpg',
                    transformation: [
                        { width: 360, height: 640, crop: 'fill', gravity: 'center' }
                    ]
                });

                return NextResponse.json({
                    videoUrl: result.secure_url,
                    thumbnailUrl,
                    duration: Math.round(result.duration || 0),
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    storage: 'cloudinary',
                });

            } catch (error: any) {
                console.warn(`⚠️ Cloudinary échoué (${error.message}). Basculement vers local...`);

                // Fallback vers stockage local
                try {
                    result = await uploadLocally(videoFile, session.user.id);
                    storage = 'local';
                    console.log('✅ Upload local réussi (fallback):', result.publicId);
                } catch (localError: any) {
                    console.error('❌ Stockage local échoué:', localError);
                    throw new Error('Impossible d\'uploader la vidéo (Cloudinary et stockage local ont échoué)');
                }
            }
        }

        return NextResponse.json({
            videoUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl,
            duration: 0,
            publicId: result.publicId,
            format: result.format,
            storage: 'local',
            warning: storage === 'local' ? 'Vidéo stockée localement' : undefined,
        });

    } catch (error: any) {
        console.error('❌ Erreur upload vidéo:', error);
        console.error('Stack trace:', error.stack);
        return NextResponse.json(
            {
                error: error.message || 'Erreur lors de l\'upload',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

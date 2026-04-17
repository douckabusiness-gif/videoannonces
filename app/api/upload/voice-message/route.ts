import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('audio') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier audio fourni' }, { status: 400 });
        }

        // Validation du type de fichier
        const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Type de fichier non autorisé. Utilisez WebM, MP3, WAV ou OGG'
            }, { status: 400 });
        }

        // Validation de la taille (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'Fichier trop volumineux. Taille maximale : 5MB'
            }, { status: 400 });
        }

        // Créer le dossier de destination s'il n'existe pas
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'voice-messages');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop() || 'webm';
        const filename = `voice-${timestamp}-${random}.${extension}`;

        // Sauvegarder le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Retourner l'URL publique et les métadonnées
        const publicUrl = `/uploads/voice-messages/${filename}`;

        return NextResponse.json({
            url: publicUrl,
            filename,
            fileSize: file.size,
            message: 'Message vocal uploadé avec succès'
        }, { status: 200 });

    } catch (error) {
        console.error('Error uploading voice message:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}

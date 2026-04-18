import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Vérifier le type de fichier
        const allowedTypes = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Type de fichier non autorisé. Utilisez MP4, WebM, JPG, PNG ou WebP'
            }, { status: 400 });
        }

        // Vérifier la taille (50MB max)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'Fichier trop volumineux. Maximum 50MB'
            }, { status: 400 });
        }

        // Créer le dossier uploads/banner s'il n'existe pas
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banner');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `${file.type.startsWith('video') ? 'video' : 'image'}-${timestamp}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        // Convertir le fichier en buffer et sauvegarder
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Retourner l'URL publique
        const fileUrl = `/uploads/banner/${fileName}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName,
            fileSize: file.size,
            fileType: file.type
        });
    } catch (error: any) {
        console.error('Erreur upload:', error);
        return NextResponse.json({
            error: 'Erreur lors de l\'upload du fichier',
            details: error.message
        }, { status: 500 });
    }
}


import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 });
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Image trop grande (max 5MB)' }, { status: 400 });
        }

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const fileName = `banner-${timestamp}-${randomStr}.${extension}`;

        // Créer le dossier uploads s'il n'existe pas
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Le dossier existe déjà
        }

        // Sauvegarder le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        // Retourner l'URL publique
        const publicUrl = `/uploads/banners/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            message: 'Image uploadée avec succès'
        });

    } catch (error) {
        console.error('Erreur upload:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload' },
            { status: 500 }
        );
    }
}

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

        // Vérifier la taille (max 2MB pour les logos)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'Logo trop volumineux (max 2MB)' }, { status: 400 });
        }

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const fileName = `logo-${timestamp}-${randomStr}.${extension}`;

        // Créer le dossier uploads/logos s'il n'existe pas
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
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
        const publicUrl = `/uploads/logos/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            message: 'Logo uploadé avec succès'
        });

    } catch (error) {
        console.error('Erreur upload logo:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload du logo' },
            { status: 500 }
        );
    }
}

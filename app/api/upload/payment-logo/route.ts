import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Vérifier si l'utilisateur est admin
async function checkAdminAccess(session: any) {
    if (!session?.user) {
        return false;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return user?.role === 'ADMIN';
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdminAccess(session);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Validation du type de fichier
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Type de fichier non autorisé. Utilisez PNG, JPG, SVG ou WEBP'
            }, { status: 400 });
        }

        // Validation de la taille (2MB max)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'Fichier trop volumineux. Taille maximale : 2MB'
            }, { status: 400 });
        }

        // Créer le dossier de destination s'il n'existe pas
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'payment-logos');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        const filename = `payment-logo-${timestamp}-${random}.${extension}`;

        // Sauvegarder le fichier
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Retourner l'URL publique
        const publicUrl = `/uploads/payment-logos/${filename}`;

        return NextResponse.json({
            url: publicUrl,
            filename,
            message: 'Logo uploadé avec succès'
        }, { status: 200 });

    } catch (error) {
        console.error('Error uploading payment logo:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}

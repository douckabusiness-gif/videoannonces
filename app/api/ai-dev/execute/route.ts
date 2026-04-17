import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// 🔒 Sécurité : Liste blanche des répertoires autorisés
const ALLOWED_DIRS = [
    'app/',
    'components/',
    'lib/',
    'contexts/',
    'hooks/',
    'styles/',
    'types/',
];

// 🔒 Sécurité : Dossiers interdits
const FORBIDDEN_DIRS = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.vercel',
    '.turbo',
    'prisma', // Interdire modification directe schema
];

// 🔒 Sécurité : Fichiers critiques interdits
const PROTECTED_FILES = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'next.config.ts',
    'next.config.js',
    'middleware.ts',
];

/**
 * Valide que le chemin est sûr
 */
function validatePath(fileName: string): { valid: boolean; error?: string } {
    // 1. Vérifier path traversal
    if (fileName.includes('../') || fileName.includes('..\\')) {
        return { valid: false, error: 'Path traversal détecté (../)' };
    }

    // 2. Vérifier que le fichier est dans un répertoire autorisé
    const isInAllowedDir = ALLOWED_DIRS.some(dir => fileName.startsWith(dir));
    if (!isInAllowedDir) {
        return {
            valid: false,
            error: `Répertoire non autorisé. Uniquement: ${ALLOWED_DIRS.join(', ')}`
        };
    }

    // 3. Vérifier dossiers interdits
    const isInForbiddenDir = FORBIDDEN_DIRS.some(dir => fileName.includes(dir));
    if (isInForbiddenDir) {
        return {
            valid: false,
            error: `Modification de ${FORBIDDEN_DIRS.find(d => fileName.includes(d))} interdite`
        };
    }

    // 4. Vérifier fichiers protégés
    const baseName = path.basename(fileName);
    if (PROTECTED_FILES.includes(baseName)) {
        return {
            valid: false,
            error: `Fichier protégé : ${baseName} ne peut pas être modifié`
        };
    }

    // 5. Vérifier extension autorisée
    const allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'];
    const ext = path.extname(fileName);
    if (!allowedExtensions.includes(ext)) {
        return {
            valid: false,
            error: `Extension ${ext} non autorisée. Uniquement: ${allowedExtensions.join(', ')}`
        };
    }

    return { valid: true };
}

export async function POST(request: NextRequest) {
    let adminId: string | undefined;

    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        adminId = session.user.id;

        const { fileName, code } = await request.json();

        if (!fileName || !code) {
            return NextResponse.json(
                { error: 'Nom de fichier et code requis' },
                { status: 400 }
            );
        }

        // 🔒 Validation de sécurité
        const validation = validatePath(fileName);
        if (!validation.valid) {
            // Logger la tentative suspecte
            await prisma.adminLog.create({
                data: {
                    adminId,
                    action: 'AI_CODE_BLOCKED',
                    targetType: 'FILE',
                    targetId: fileName,
                    details: {
                        reason: validation.error,
                        attemptedCode: code.substring(0, 100)
                    }
                }
            }).catch(err => console.error('Erreur log:', err));

            return NextResponse.json(
                { error: `🔒 Sécurité: ${validation.error}` },
                { status: 403 }
            );
        }

        const projectRoot = process.cwd();
        const fullPath = path.join(projectRoot, fileName);

        // Double vérification du chemin
        if (!fullPath.startsWith(projectRoot)) {
            return NextResponse.json(
                { error: 'Chemin invalide (hors projet)' },
                { status: 400 }
            );
        }

        // Créer le dossier si nécessaire
        const dirPath = path.dirname(fullPath);
        await fs.mkdir(dirPath, { recursive: true });

        // 📦 Backup si fichier existe
        let wasModification = false;
        try {
            await fs.access(fullPath);
            wasModification = true;
            const backupPath = `${fullPath}.backup-${Date.now()}`;
            await fs.copyFile(fullPath, backupPath);
            console.log(`✅ Backup créé: ${backupPath}`);
        } catch (error) {
            // Fichier n'existe pas (nouvelle création)
        }

        // ✍️ Écrire le fichier
        await fs.writeFile(fullPath, code, 'utf-8');

        // 📝 Logger l'action dans AdminLog
        await prisma.adminLog.create({
            data: {
                adminId,
                action: wasModification ? 'AI_CODE_MODIFIED' : 'AI_CODE_CREATED',
                targetType: 'FILE',
                targetId: fileName,
                details: {
                    linesOfCode: code.split('\n').length,
                    fileSize: Buffer.byteLength(code, 'utf8'),
                    preview: code.substring(0, 200)
                }
            }
        }).catch(err => console.error('Erreur log:', err));

        console.log(`✅ Fichier ${wasModification ? 'modifié' : 'créé'}: ${fileName}`);

        return NextResponse.json({
            success: true,
            message: `✅ Fichier ${fileName} ${wasModification ? 'modifié' : 'créé'} avec succès`,
            path: fileName,
            action: wasModification ? 'modified' : 'created'
        });
    } catch (error: any) {
        console.error('❌ Erreur création fichier:', error);

        // Logger l'erreur si admin ID disponible
        if (adminId) {
            await prisma.adminLog.create({
                data: {
                    adminId,
                    action: 'AI_CODE_ERROR',
                    targetType: 'FILE',
                    targetId: 'unknown',
                    details: {
                        error: error.message
                    }
                }
            }).catch(err => console.error('Erreur log:', err));
        }

        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

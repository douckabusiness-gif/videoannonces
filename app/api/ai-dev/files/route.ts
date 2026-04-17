import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
}

const IGNORED_DIRS = [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '.vercel',
    '.turbo',
];

const ALLOWED_EXTENSIONS = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
    '.css',
    '.md',
    '.prisma',
];

async function readDirectory(dirPath: string, basePath: string): Promise<FileNode[]> {
    const nodes: FileNode[] = [];

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name.startsWith('.') || IGNORED_DIRS.includes(entry.name)) {
                continue;
            }

            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(basePath, fullPath);

            if (entry.isDirectory()) {
                const children = await readDirectory(fullPath, basePath);
                if (children.length > 0) {
                    nodes.push({
                        name: entry.name,
                        path: relativePath,
                        type: 'directory',
                        children,
                    });
                }
            } else {
                const ext = path.extname(entry.name);
                if (ALLOWED_EXTENSIONS.includes(ext)) {
                    nodes.push({
                        name: entry.name,
                        path: relativePath,
                        type: 'file',
                    });
                }
            }
        }
    } catch (error) {
        console.error('Erreur lecture dossier:', error);
    }

    return nodes.sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
    });
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const projectRoot = process.cwd();
        const files = await readDirectory(projectRoot, projectRoot);

        return NextResponse.json({ files });
    } catch (error: any) {
        console.error('Erreur lecture fichiers:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { filePath } = await request.json();
        const projectRoot = process.cwd();
        const fullPath = path.join(projectRoot, filePath);

        if (!fullPath.startsWith(projectRoot)) {
            return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 });
        }

        const content = await fs.readFile(fullPath, 'utf-8');

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error('Erreur lecture fichier:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les logs système
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const type = searchParams.get('type'); // info, warning, error, success
        const category = searchParams.get('category'); // user, listing, payment, system, email, security
        const skip = (page - 1) * limit;

        const where: any = {};

        if (type) {
            where.type = type;
        }

        if (category) {
            where.category = category;
        }

        const [logs, total] = await Promise.all([
            prisma.systemLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.systemLog.count({ where }),
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Erreur récupération logs:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// POST - Créer un log manuel
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const log = await prisma.systemLog.create({
            data: {
                type: data.type,
                category: data.category,
                action: data.action,
                message: data.message,
                metadata: data.metadata,
                userId: session.user.id,
            },
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error('Erreur création log:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// DELETE - Nettoyer les anciens logs
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const result = await prisma.systemLog.deleteMany({
            where: {
                createdAt: {
                    lt: dateLimit,
                },
            },
        });

        // Log de l'action
        await prisma.systemLog.create({
            data: {
                type: 'info',
                category: 'system',
                action: 'clean_logs',
                message: `${result.count} logs supprimés (plus de ${days} jours)`,
                userId: session.user.id,
            },
        });

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
        });
    } catch (error) {
        console.error('Erreur nettoyage logs:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

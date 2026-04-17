import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const seoSchema = z.object({
    seoTitle: z.string().max(70, 'Le titre SEO ne doit pas dépasser 70 caractères').optional().nullable(),
    seoDescription: z.string().max(160, 'La description SEO ne doit pas dépasser 160 caractères').optional().nullable(),
    seoKeywords: z.string().max(200).optional().nullable(),
});

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                seoTitle: true,
                seoDescription: true,
                seoKeywords: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching SEO settings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const body = await request.json();
        const validated = seoSchema.parse(body);

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...validated
            }
        });

        return NextResponse.json({
            message: 'Réglages SEO enregistrés',
            data: {
                seoTitle: updatedUser.seoTitle,
                seoDescription: updatedUser.seoDescription,
                seoKeywords: updatedUser.seoKeywords,
            }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('Error saving SEO settings:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

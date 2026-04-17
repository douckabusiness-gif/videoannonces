import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                whatsappNumber: true,
                email: true,
                avatar: true,
                language: true,
                verified: true,
                premium: true,
                premiumTier: true,
                premiumUntil: true,
                subdomain: true,
                customDomain: true,
                bannerUrl: true,
                bio: true,
                shopTheme: true,
                socialLinks: true,
                rating: true,
                totalRatings: true,
                totalSales: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Erreur récupération profil:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Champs modifiables
        const allowedFields = [
            'name',
            'email',
            'avatar',
            'language',
            'bio',
            'shopTheme',
            'socialLinks',
            'bannerUrl',
            'whatsappNumber',
        ];

        const updateData: any = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                // If it's email and it's empty string, make it null to prevent DB unique constraint fail
                if (field === 'email' && body[field] === '') {
                    updateData[field] = null;
                } else if (field === 'whatsappNumber' && body[field] === '') {
                    updateData[field] = null;
                } else if (field === 'bio' && body[field] === '') {
                    updateData[field] = null;
                } else if (field === 'name' && body[field] === '') {
                    updateData[field] = null;
                } else {
                    updateData[field] = body[field];
                }
            }
        }
        
        console.log("PATCH /api/users/profile - user:", session.user.id, "body:", body, "updateData:", updateData);
        try {
            require('fs').appendFileSync('d:/videoannonces-ci/api_log.txt', new Date().toISOString() + " - PATCH payload: " + JSON.stringify(body) + "\nUpdateData: " + JSON.stringify(updateData) + "\n");
        } catch (e) {}

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                language: true,
                bio: true,
                shopTheme: true,
                socialLinks: true,
                bannerUrl: true,
                whatsappNumber: true,
            }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

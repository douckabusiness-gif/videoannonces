import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }

        const body = await request.json();
        const {
            shopTheme,
            bannerUrl,
            bio,
            socialLinks,
            videoUrl,
            whatsappNumber,
            galleryImages,
            testimonials,
            trustBadges,
            activePromotion,
            aboutSection,
            // Phase 1 - Personnalisation
            customColors,
            logoUrl,
            backgroundUrl,
            businessHours,
            shopLayout
        } = body;

        // Mettre à jour la boutique
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(shopTheme && { shopTheme }),
                ...(bannerUrl !== undefined && { bannerUrl }),
                ...(bio !== undefined && { bio }),
                ...(socialLinks && { socialLinks }),
                ...(videoUrl !== undefined && { videoUrl }),
                ...(whatsappNumber !== undefined && { whatsappNumber }),
                ...(galleryImages && { galleryImages }),
                ...(testimonials && { testimonials }),
                ...(trustBadges && { trustBadges }),
                ...(activePromotion && { activePromotion }),
                ...(aboutSection !== undefined && { aboutSection }),
                // Phase 1
                ...(customColors && { customColors }),
                ...(logoUrl !== undefined && { logoUrl }),
                ...(backgroundUrl !== undefined && { backgroundUrl }),
                ...(businessHours && { businessHours }),
                ...(shopLayout && { shopLayout }),
            },
        });

        return NextResponse.json({
            success: true,
            shop: {
                subdomain: updated.subdomain,
                shopTheme: updated.shopTheme,
                bannerUrl: updated.bannerUrl,
                bio: updated.bio,
                socialLinks: updated.socialLinks,
            },
        });
    } catch (error) {
        console.error('Erreur personnalisation boutique:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la personnalisation' },
            { status: 500 }
        );
    }
}

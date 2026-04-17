import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import WhatsAppButton from '@/components/shop/WhatsAppButton';
import MessengerButton from '@/components/shop/MessengerButton';
import ShopAnimations from '@/components/shop/ShopAnimations';
import FeaturedReviews from '@/components/shop/FeaturedReviews';
import MarketplaceLayout from '@/components/shop/MarketplaceLayout';
import MobileFirstLayout from '@/components/shop/MobileFirstLayout';

// Feature flag: Set to true to use new Marketplace layout
const USE_MARKETPLACE_LAYOUT = true;

interface ShopPageProps {
    params: Promise<{
        subdomain: string;
    }>;
}

async function getShopData(subdomain: string) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { subdomain: subdomain },
                { id: subdomain }
            ]
        },
        select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            rating: true,
            totalRatings: true,
            totalSales: true,
            shopTheme: true,
            bannerUrl: true,
            socialLinks: true,
            createdAt: true,
            verified: true,
            premium: true,
            videoUrl: true,
            whatsappNumber: true,
            trustBadges: true,
            aboutSection: true,
            // Phase 1
            customColors: true,
            logoUrl: true,
            backgroundUrl: true,
            businessHours: true,
            shopLayout: true,
        },
    });

    if (!user) {
        return null;
    }

    const listings = await prisma.listing.findMany({
        where: {
            userId: user.id,
            status: 'active',
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            id: true,
            title: true,
            price: true,
            thumbnailUrl: true,
            videoUrl: true,
            views: true,
            category: true,
            createdAt: true,
            isUrgent: true,
        },
    });

    const reviews = await prisma.review.findMany({
        where: {
            reviewedId: user.id,
            featured: true,
        },
        include: {
            reviewer: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 3,
    });

    return {
        shop: user,
        listings,
        reviews,
    };
}

export async function generateMetadata({ params }: ShopPageProps) {
    const { subdomain } = await params;
    const data = await getShopData(subdomain);

    if (!data) {
        return {
            title: 'Boutique non trouvée',
        };
    }

    return {
        title: `${data.shop.name} - VideoBoutique`,
        description: data.shop.bio || `Découvrez les annonces de ${data.shop.name}`,
        openGraph: {
            title: `${data.shop.name} - VideoBoutique`,
            description: data.shop.bio || `Découvrez les annonces de ${data.shop.name}`,
            images: data.shop.bannerUrl ? [data.shop.bannerUrl] : [],
        },
    };
}

export default async function ShopPage({ params }: ShopPageProps) {
    const { subdomain } = await params;
    const data = await getShopData(subdomain);

    if (!data) {
        notFound();
    }

    const { shop, listings, reviews } = data;

    // Use Layout based on shop preference
    if (shop.shopLayout === 'marketplace') {
        return <MarketplaceLayout shop={shop} listings={listings} />;
    }

    if (shop.shopLayout === 'mobile-first') {
        return <MobileFirstLayout shop={shop} listings={listings} reviews={reviews} />;
    }

    if (shop.shopLayout === 'ecommerce') {
        // Assuming EcommerceLayout is still imported or available, otherwise fallback
        // Note: If EcommerceLayout was removed, you might need to re-import it or use Marketplace as fallback
        // For now, let's assume Marketplace is the default if 'ecommerce' or other unknown value is set,
        // UNLESS EcommerceLayout is explicitly desired. 
        // Given the context, I will default to Marketplace if not specified, 
        // but if they explicitly chose 'mobile-first', it works.
        return <MarketplaceLayout shop={shop} listings={listings} />;
    }

    // Default Fallback
    return <MarketplaceLayout shop={shop} listings={listings} />;
}

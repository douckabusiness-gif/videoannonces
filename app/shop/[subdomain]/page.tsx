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
import LuxuryShopLayout from '@/components/shop/LuxuryShopLayout';

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
            premiumTier: true,
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

    // Auto-switch to Luxury for Premium/Pro tiers unless they chose Mobile-first
    if ((shop.premiumTier === 'premium' || shop.premiumTier === 'pro') && shop.shopLayout !== 'mobile-first') {
        return <LuxuryShopLayout shop={shop as any} listings={listings} />;
    }

    // Use Layout based on shop preference
    if (shop.shopLayout === 'marketplace') {
        return <MarketplaceLayout shop={shop} listings={listings} />;
    }

    if (shop.shopLayout === 'mobile-first') {
        return <MobileFirstLayout shop={shop} listings={listings} reviews={reviews} />;
    }

    // Default Fallback
    return <MarketplaceLayout shop={shop} listings={listings} />;
}

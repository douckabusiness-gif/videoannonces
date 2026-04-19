import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        phone: string;
        premium: boolean;
        subdomain?: string | null;
        role: string;
        isVendor: boolean;
        /** Mode vitrine solo : false si seuls certains comptes peuvent publier */
        canPublishListings?: boolean;
        premiumTier?: string | null;
        aiReplyEnabled?: boolean;
        avatar?: string | null;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            phone: string;
            premium: boolean;
            subdomain?: string | null;
            role: string;
            isVendor: boolean;
            canPublishListings?: boolean;
            // Shop Config
            shopLayout?: string | null;
            shopTheme?: string | null;
            bannerUrl?: string | null;
            videoUrl?: string | null;
            whatsappNumber?: string | null;
            bio?: string | null;
            aboutSection?: string | null;
            socialLinks?: any;
            trustBadges?: any;
            customColors?: any;
            logoUrl?: string | null;
            businessHours?: any;
            premiumTier?: string | null;
            aiReplyEnabled?: boolean;
            avatar?: string | null;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        phone: string;
        premium: boolean;
        subdomain?: string | null;
        role: string;
        isVendor: boolean;
        canPublishListings?: boolean;
        // Shop Config
        shopLayout?: string | null;
        shopTheme?: string | null;
        bannerUrl?: string | null;
        videoUrl?: string | null;
        whatsappNumber?: string | null;
        bio?: string | null;
        aboutSection?: string | null;
        socialLinks?: any;
        trustBadges?: any;
        customColors?: any;
        logoUrl?: string | null;
        businessHours?: any;
        premiumTier?: string | null;
        aiReplyEnabled?: boolean;
        avatar?: string | null;
    }
}

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { userCanPublishListings } from '@/lib/solo-business';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: 'Téléphone', type: 'text', placeholder: '0123456789' },
                password: { label: 'Mot de passe', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.phone || !credentials?.password) {
                        throw new Error('Téléphone et mot de passe requis');
                    }

                    const user = await prisma.user.findUnique({
                        where: { phone: credentials.phone }
                    });

                    if (!user) {
                        throw new Error('Utilisateur non trouvé');
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error('Mot de passe incorrect');
                    }

                    // 🔒 Vérifier si le compte est vérifié
                    if (!user.verified) {
                        throw new Error('Veuillez vérifier votre email avant de vous connecter');
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        phone: user.phone,
                        email: user.email,
                        avatar: user.avatar,
                        premium: user.premium,
                        subdomain: user.subdomain,
                        role: user.role,
                        isVendor: user.isVendor,
                        // Configuration boutique
                        videoUrl: user.videoUrl,
                        whatsappNumber: user.whatsappNumber,
                        socialLinks: user.socialLinks,
                        trustBadges: user.trustBadges,
                        aboutSection: user.aboutSection,
                        bio: user.bio,
                        bannerUrl: user.bannerUrl,
                        shopTheme: user.shopTheme,
                        // Phase 1
                        logoUrl: user.logoUrl,
                        businessHours: user.businessHours,
                        shopLayout: user.shopLayout,
                        aiReplyEnabled: user.aiReplyEnabled,
                        premiumTier: user.premiumTier,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.premium = user.premium;
                token.subdomain = user.subdomain;
                token.role = user.role;
                token.isVendor = user.isVendor;
                // Configuration boutique
                token.videoUrl = user.videoUrl;
                token.whatsappNumber = user.whatsappNumber;
                token.socialLinks = user.socialLinks;
                token.trustBadges = user.trustBadges;
                token.aboutSection = user.aboutSection;
                token.bio = user.bio;
                token.bannerUrl = user.bannerUrl;
                token.shopTheme = user.shopTheme;
                // Phase 1
                token.customColors = user.customColors;
                token.logoUrl = user.logoUrl;
                token.businessHours = user.businessHours;
                token.shopLayout = user.shopLayout;
                token.aiReplyEnabled = user.aiReplyEnabled;
                token.premiumTier = user.premiumTier;
            }

            // Handle session update
            if (trigger === "update") {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string }
                });
                if (dbUser) {
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.phone = dbUser.phone;
                    token.avatar = dbUser.avatar;
                    token.premium = dbUser.premium;
                    token.subdomain = dbUser.subdomain;
                    token.role = dbUser.role;
                    token.isVendor = dbUser.isVendor;
                    token.videoUrl = dbUser.videoUrl;
                    token.whatsappNumber = dbUser.whatsappNumber;
                    token.socialLinks = dbUser.socialLinks;
                    token.trustBadges = dbUser.trustBadges;
                    token.aboutSection = dbUser.aboutSection;
                    token.bio = dbUser.bio;
                    token.bannerUrl = dbUser.bannerUrl;
                    token.shopTheme = dbUser.shopTheme;
                    token.customColors = dbUser.customColors;
                    token.logoUrl = dbUser.logoUrl;
                    token.businessHours = dbUser.businessHours;
                    token.shopLayout = dbUser.shopLayout;
                    token.aiReplyEnabled = dbUser.aiReplyEnabled;
                    token.premiumTier = dbUser.premiumTier;
                }
            }

            if (token.id) {
                token.canPublishListings = await userCanPublishListings(
                    token.id as string,
                    token.role as string | undefined
                );
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.premium = token.premium as boolean;
                session.user.subdomain = token.subdomain as string | null;
                session.user.role = token.role as string;
                session.user.isVendor = token.isVendor as boolean;
                // Configuration boutique
                session.user.videoUrl = token.videoUrl as string | null;
                session.user.whatsappNumber = token.whatsappNumber as string | null;
                session.user.socialLinks = token.socialLinks as any;
                session.user.trustBadges = token.trustBadges as any;
                session.user.aboutSection = token.aboutSection as string | null;
                session.user.bio = token.bio as string | null;
                session.user.bannerUrl = token.bannerUrl as string | null;
                session.user.shopTheme = token.shopTheme as string | null;
                // Phase 1
                session.user.customColors = token.customColors as any;
                session.user.logoUrl = token.logoUrl as string | null;
                session.user.businessHours = token.businessHours as any;
                session.user.shopLayout = token.shopLayout as string | null;
                session.user.aiReplyEnabled = token.aiReplyEnabled as boolean;
                session.user.premiumTier = token.premiumTier as string | null;
                session.user.canPublishListings =
                    (token.canPublishListings as boolean | undefined) ??
                    (await userCanPublishListings(
                        session.user.id,
                        session.user.role
                    ));
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
};

'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getFacebookAppId() {
    try {
        const settings = await prisma.siteSettings.findFirst();
        
        const session = await getServerSession(authOptions);
        let linkedPage = null;
        if (session?.user?.id) {
            const userDb = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { fbPageName: true, fbPageId: true }
            });
            if (userDb?.fbPageName) {
                linkedPage = { id: userDb.fbPageId, name: userDb.fbPageName };
            }
        }
        
        return {
            appId: settings?.facebookAppId || null,
            linkedPage
        };
    } catch (error) {
        console.error('Erreur getFacebookAppId:', error);
        return { appId: null, linkedPage: null };
    }
}

export async function getFacebookPages(shortLivedToken: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('Non autorisé');
        }

        const settings = await prisma.siteSettings.findFirst();
        const appId = settings?.facebookAppId;
        const appSecret = settings?.facebookAppSecret;

        if (!appId || !appSecret) {
            throw new Error('Identifiants Facebook manquants dans la configuration');
        }

        // 1. Échanger le token court terme contre un token long terme
        const tokenExchangeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
        const tokenRes = await fetch(tokenExchangeUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error('FB Token Error:', tokenData.error);
            throw new Error(tokenData.error.message || 'Erreur lors de l\'échange de jeton');
        }

        const longLivedToken = tokenData.access_token;

        // 2. Récupérer les pages
        const pagesUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedToken}`;
        const pagesRes = await fetch(pagesUrl);
        const pagesData = await pagesRes.json();

        if (pagesData.error) {
            console.error('FB Pages Error:', pagesData.error);
            throw new Error(pagesData.error.message || 'Erreur lors de la récupération des pages');
        }

        return {
            success: true,
            pages: pagesData.data || [],
            userAccessToken: longLivedToken
        };
    } catch (error: any) {
        console.error('Erreur getFacebookPages:', error);
        return { success: false, error: error.message };
    }
}

export async function saveFacebookPage(data: {
    pageId: string;
    pageName: string;
    pageAccessToken: string;
    userAccessToken: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('Non autorisé');
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                fbAccessToken: data.userAccessToken,
                fbPageId: data.pageId,
                fbPageName: data.pageName,
                fbPageAccessToken: data.pageAccessToken,
                // On met aussi à jour socialLinks.facebook pour la cohérence
                socialLinks: {
                    ...(session.user.socialLinks as any || {}),
                    facebook: data.pageName,
                }
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error('Erreur saveFacebookPage:', error);
        return { success: false, error: error.message };
    }
}

export async function unlinkFacebookPage() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            throw new Error('Non autorisé');
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                fbUserId: null,
                fbAccessToken: null,
                fbPageId: null,
                fbPageName: null,
                fbPageAccessToken: null,
            }
        });

        return { success: true };
    } catch (error: any) {
        console.error('Erreur unlinkFacebookPage:', error);
        return { success: false, error: error.message };
    }
}

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getFacebookSettings() {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        let settings = await prisma.siteSettings.findFirst();
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {}
            });
        }

        return {
            facebookAppId: settings.facebookAppId || '',
            facebookAppSecret: settings.facebookAppSecret || '',
            facebookLoginEnabled: settings.facebookLoginEnabled || false,
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function saveFacebookSettings(data: {
    facebookAppId: string;
    facebookAppSecret: string;
    facebookLoginEnabled: boolean;
}) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        const settings = await prisma.siteSettings.findFirst();
        
        if (settings) {
            await prisma.siteSettings.update({
                where: { id: settings.id },
                data,
            });
        } else {
            await prisma.siteSettings.create({
                data,
            });
        }

        revalidatePath('/admin/settings/facebook');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Force reload

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { homeLayout, primaryColor, secondaryColor, accentColor, backgroundColor, pwaIcon, logo, favicon } = body;

        // Update or create settings
        const settings = await prisma.siteSettings.findFirst();

        const dataToUpdate: any = {};
        if (homeLayout) dataToUpdate.homeLayout = homeLayout;
        if (primaryColor) dataToUpdate.primaryColor = primaryColor;
        if (secondaryColor) dataToUpdate.secondaryColor = secondaryColor;
        if (accentColor) dataToUpdate.accentColor = accentColor;
        if (backgroundColor) dataToUpdate.backgroundColor = backgroundColor;
        if (pwaIcon !== undefined) dataToUpdate.pwaIcon = pwaIcon;
        if (logo !== undefined) dataToUpdate.logo = logo;
        if (favicon !== undefined) dataToUpdate.favicon = favicon;
        if (body.headerColor) dataToUpdate.headerColor = body.headerColor;
        if (body.footerColor) dataToUpdate.footerColor = body.footerColor;
        if (body.headerTextColor) dataToUpdate.headerTextColor = body.headerTextColor;
        if (body.footerTextColor) dataToUpdate.footerTextColor = body.footerTextColor;
        if (body.urgentBgColor) dataToUpdate.urgentBgColor = body.urgentBgColor;
        if (body.shopsBgColor) dataToUpdate.shopsBgColor = body.shopsBgColor;
        if (body.recentBgColor) dataToUpdate.recentBgColor = body.recentBgColor;
        if (body.urgentTextColor) dataToUpdate.urgentTextColor = body.urgentTextColor;
        if (body.shopsTextColor) dataToUpdate.shopsTextColor = body.shopsTextColor;
        if (body.recentTextColor) dataToUpdate.recentTextColor = body.recentTextColor;

        if (settings) {
            await prisma.siteSettings.update({
                where: { id: settings.id },
                data: dataToUpdate,
            });
        } else {
            await prisma.siteSettings.create({
                data: {
                    homeLayout: homeLayout || 'modern',
                    ...dataToUpdate
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating layout:', error);
        try {
            const fs = require('fs');
            fs.appendFileSync('server-error.log', `[${new Date().toISOString()}] ${error.message}\n${error.stack}\n---\n`);
        } catch (fsError) {
            console.error('Failed to write log:', fsError);
        }
        return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
    }
}

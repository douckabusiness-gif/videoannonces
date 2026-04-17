import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                customColors: true,
                shopTheme: true,
                fontFamily: true,
                shopLayout: true,
                logoUrl: true,
                bannerUrl: true,
                backgroundUrl: true
            }
        });

        return NextResponse.json({
            customColors: user?.customColors || {},
            shopTheme: user?.shopTheme || 'default',
            fontFamily: user?.fontFamily || 'inter',
            shopLayout: user?.shopLayout || 'mobile-first',
            logoUrl: user?.logoUrl,
            bannerUrl: user?.bannerUrl,
            backgroundUrl: user?.backgroundUrl
        });
    } catch (error) {
        console.error('Error fetching appearance settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { customColors, shopTheme, shopLayout } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                customColors: customColors !== undefined ? customColors : undefined,
                shopTheme: shopTheme !== undefined ? shopTheme : undefined,
                shopLayout: shopLayout !== undefined ? shopLayout : undefined
            }
        });

        return NextResponse.json({
            success: true,
            customColors: updatedUser.customColors,
            shopTheme: updatedUser.shopTheme,
            shopLayout: updatedUser.shopLayout
        });
    } catch (error) {
        console.error('Error updating appearance settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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
            select: { fontFamily: true }
        });

        return NextResponse.json({ fontFamily: user?.fontFamily || 'inter' });
    } catch (error) {
        console.error('Error fetching font settings:', error);
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
        const { fontFamily } = body;

        const allowedFonts = ['inter', 'roboto', 'opensans', 'lato', 'montserrat'];
        if (!allowedFonts.includes(fontFamily)) {
            return NextResponse.json({ error: 'Invalid font family' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { fontFamily }
        });

        return NextResponse.json({ success: true, fontFamily: updatedUser.fontFamily });
    } catch (error) {
        console.error('Error updating font settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

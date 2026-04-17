import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeSubcategories = searchParams.get('includeSubcategories') === 'true';
        const onlyActive = searchParams.get('onlyActive') !== 'false';
        const onlyMain = searchParams.get('onlyMain') === 'true';

        const where: any = {};
        if (onlyActive) {
            where.isActive = true;
        }
        if (onlyMain) {
            where.parentId = null;
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                subcategories: includeSubcategories ? {
                    where: onlyActive ? { isActive: true } : {},
                    orderBy: { order: 'asc' }
                } : false
            },
            orderBy: {
                order: 'asc'
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getLayoutSettings } from '@/lib/layout';

// GET - Récupérer les paramètres de layout (public)
export async function GET(request: NextRequest) {
    try {
        const settings = await getLayoutSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Erreur récupération layout:', error);
        return NextResponse.json(
            {
                homeLayout: 'modern',
                primaryColor: '#FF6B35',
                secondaryColor: '#F7931E',
                accentColor: '#FDC830',
            },
            { status: 200 }
        );
    }
}

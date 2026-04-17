import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiService } from '@/lib/ai-service';

async function checkAdminAccess() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Non authentifié', status: 401 };
    }
    return { adminId: session.user.id };
}

/**
 * GET - Vérifier la santé des providers IA
 */
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const health = await aiService.checkProviderHealth();

        return NextResponse.json({
            providers: health,
            summary: {
                total: Object.keys(health).length,
                available: Object.values(health).filter(Boolean).length,
                unavailable: Object.values(health).filter(v => !v).length,
            },
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Erreur health check:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

/**
 * POST - Tester un provider spécifique
 */
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { provider, prompt, systemPrompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt requis' },
                { status: 400 }
            );
        }

        const response = await aiService.generateContent(
            prompt,
            { provider },
            systemPrompt
        );

        return NextResponse.json({
            success: true,
            response,
        });

    } catch (error: any) {
        console.error('Erreur test provider:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

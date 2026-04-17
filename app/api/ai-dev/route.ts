import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        const { message, context } = await request.json();

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const systemPrompt = `Tu es un assistant de développement expert en Next.js, React, TypeScript et Prisma.
Tu aides à créer et modifier du code pour l'application VideoBoutique.

Structure du projet :
- Next.js 16 avec App Router
- TypeScript
- Prisma pour la base de données MySQL
- TailwindCSS pour le styling
- NextAuth pour l'authentification

Quand on te demande de créer ou modifier du code :
1. Génère du code propre et fonctionnel
2. Utilise les conventions Next.js 16
3. Respecte la structure existante du projet
4. Retourne UNIQUEMENT le code, sans explications supplémentaires
5. Indique le nom du fichier à créer/modifier

Format de réponse :
{
  "fileName": "chemin/du/fichier.tsx",
  "code": "le code complet ici",
  "response": "explication courte de ce qui a été fait"
}`;

        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022', // Version la plus récente et puissante
            max_tokens: 8192, // 🚀 Doublé pour générer du code plus complexe
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Contexte du projet (fichiers existants) :
${JSON.stringify(context, null, 2)}

Demande de l'utilisateur :
${message}

Génère le code nécessaire et retourne-le au format JSON.`,
                },
            ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
            throw new Error('Réponse inattendue de Claude');
        }

        let result;
        try {
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                result = {
                    response: content.text,
                    code: null,
                    fileName: null,
                };
            }
        } catch (e) {
            result = {
                response: content.text,
                code: null,
                fileName: null,
            };
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Erreur AI Dev:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}

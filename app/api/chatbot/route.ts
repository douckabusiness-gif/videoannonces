import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de VideoBoutique, une plateforme ivoirienne de marketplace vidéo.

INFORMATIONS SUR VIDEOBOUTIQUE :
- C'est une plateforme où les vendeurs publient des vidéos courtes pour vendre leurs produits
- Les utilisateurs peuvent contacter les vendeurs via messagerie
- Il existe un abonnement Premium à 5000 FCFA/mois avec : annonces illimitées, sous-domaine personnalisé, boost d'annonces, analytics, badge vérifié
- Paiement par : Orange Money, MTN Mobile Money, Wave
- Les vendeurs peuvent booster leurs annonces (1000 FCFA/jour minimum)
- Création d'annonce : Dashboard → Créer une annonce → Upload vidéo (max 2 min) → Remplir détails

INSTRUCTIONS :
- Réponds en français de Côte d'Ivoire
- Sois amical et professionnel
- Utilise des emojis occasionnellement
- Si tu ne connais pas une information, dis-le honnêtement et propose de contacter le support
- Garde tes réponses courtes (3-5 lignes maximum)
- Encourage l'utilisation de la plateforme

EXEMPLES :
Q: Comment créer une annonce ?
R: C'est simple ! 📱 Allez dans Dashboard → Créer une annonce → Uploadez votre vidéo (max 2 min) → Remplissez titre, prix, description → Publiez ! Astuce : les vidéos de 30-45 sec convertissent mieux ! 🎥

Q: Combien coûte Premium ?
R: L'abonnement Premium coûte 5000 FCFA/mois 💎 Vous aurez : annonces illimitées, votre propre boutique (monshop.videoboutique.ci), analytics avancés, boost, et badge vérifié ! Paiement par OM, MTN ou Wave 📱`;

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message requis' },
                { status: 400 }
            );
        }

        // Utiliser le service IA (Groq en priorité)
        const aiResponse = await aiService.generateContent(
            message,
            {
                // Pas besoin de spécifier le provider, Groq sera utilisé en priorité
                temperature: 0.7,
                maxTokens: 300, // Réponses courtes
            },
            SYSTEM_PROMPT
        );

        console.log(`💬 Chatbot utilisé: ${aiResponse.provider} (${aiResponse.model})`);
        console.log(`⚡ Temps de réponse: ${aiResponse.executionTime}ms`);
        console.log(`💰 Coût: $${aiResponse.cost || 0}`);

        return NextResponse.json({
            response: aiResponse.content,
            timestamp: new Date().toISOString(),
            provider: aiResponse.provider,
        });
    } catch (error: any) {
        console.error('Erreur chatbot:', error);

        // Fallback en cas d'erreur IA
        return NextResponse.json({
            response: `Désolé, je rencontre un problème technique. 😅\n\nVoici quelques ressources :\n• Dashboard → Créer une annonce\n• Premium : 5000 FCFA/mois\n• Support : support@videoboutique.ci\n\nRéessayez dans un instant !`,
            timestamp: new Date().toISOString(),
            error: error.message,
        });
    }
}

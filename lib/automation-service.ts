import { prisma } from './prisma';
import { aiService } from './ai-service';

export class AutomationService {
    /**
     * Traite un message entrant et génère éventuellement une réponse automatique
     */
    async processMessage(content: string, sellerId: string, buyerId: string, listingId?: string | null) {
        try {
            const messageLower = content.toLowerCase();

            // 1. Récupérer les templates actifs du vendeur
            const templates = await prisma.automationTemplate.findMany({
                where: {
                    userId: sellerId,
                    active: true
                }
            });

            // 2. Recherche de correspondance par mot-clé (Keyword Matching)
            for (const template of templates) {
                // Si le déclencheur est contenu dans le message
                if (template.trigger && messageLower.includes(template.trigger.toLowerCase())) {
                    const actions = template.actions as any;
                    if (actions && actions.response) {
                        return actions.response;
                    }
                }
            }

            // 3. Fallback IA si activé pour cet utilisateur (Mode Premium requis)
            const seller = await prisma.user.findUnique({
                where: { id: sellerId },
                select: { premium: true, name: true, subdomain: true, aiReplyEnabled: true }
            });

            // Pour l'instant, on active l'IA par défaut pour les Premium si aucune règle ne matche
            // et si on a un listingId pour donner du contexte et si activé par l'utilisateur
            if (seller?.premium && seller.aiReplyEnabled && listingId) {
                return await this.generateAIResponse(content, sellerId, listingId);
            }

            return null;
        } catch (error) {
            console.error('Erreur AutomationService:', error);
            return null;
        }
    }

    /**
     * Génère une réponse via l'IA en utilisant le contexte de l'annonce
     */
    private async generateAIResponse(message: string, sellerId: string, listingId: string) {
        try {
            // Récupérer les détails de l'annonce
            const listing = await prisma.listing.findUnique({
                where: { id: listingId },
                include: { user: true }
            });

            if (!listing) return null;

            const systemPrompt = `Tu es l'assistant de vente virtuel de ${listing.user.name}. 
Ton but est d'aider les clients intéressés par l'annonce : "${listing.title}".

DÉTAILS DU PRODUIT :
- Titre : ${listing.title}
- Prix : ${listing.price} FCFA
- Description : ${listing.description}
- Boutique : ${listing.user.name} (${listing.user.subdomain || 'vendeur'}.videoboutique.ci)

INSTRUCTIONS :
- Réponds de manière courte, amicale et professionnelle.
- Utilise le français de Côte d'Ivoire (nouchi léger accepté si approprié).
- Si on te demande le prix ou des détails, utilise les informations ci-dessus.
- Ne propose pas de RDV, encourage le client à continuer la discussion ici.
- Garde la réponse en dessous d'une ou deux phrases.`;

            const aiResponse = await aiService.generateContent(
                message,
                { temperature: 0.7, maxTokens: 150 },
                systemPrompt
            );

            return aiResponse.content;
        } catch (error) {
            console.error('Erreur génération IA automation:', error);
            return null;
        }
    }
}

export const automationService = new AutomationService();

import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

const SYSTEM_PROMPT = `Tu es un expert en rédaction de descriptions de produits pour e-commerce, spécialisé pour le marché ivoirien.

INSTRUCTIONS :
- Rédige en français de Côte d'Ivoire
- Crée une description attractive et professionnelle
- Structure : Introduction accrocheuse + Caractéristiques clés + Appel à l'action
- Utilise des emojis occasionnellement (max 3-4)
- Longueur : 150-200 mots
- Mets en valeur les avantages principaux
- Adapte le ton selon la catégorie (professionnel pour immobilier, dynamique pour électronique, etc.)
- Termine par un appel à l'action clair

EXEMPLES :

Catégorie: Électronique, Titre: iPhone 13 Pro Max 128GB
→ 📱 Découvrez l'iPhone 13 Pro Max 128GB, le smartphone haut de gamme qui redéfinit l'excellence ! 

Profitez d'un écran Super Retina XDR de 6.7 pouces pour une expérience visuelle exceptionnelle. Le système photo Pro triple objectif (12MP) capture vos moments avec une qualité professionnelle, de jour comme de nuit.

✨ Points forts :
• Puce A15 Bionic ultra-rapide
• Autonomie toute la journée
• 5G pour une connexion fulgurante
• Design premium en acier inoxydable
• État impeccable, comme neuf

Parfait pour le travail, les réseaux sociaux et le divertissement. Livraison possible à Abidjan et environs.

📞 Contactez-moi pour plus d'infos !

---

Catégorie: Immobilier, Titre: Villa 4 chambres Cocody
→ 🏡 Magnifique villa moderne de 4 chambres située dans le prestigieux quartier de Cocody, Riviera Golf.

Cette propriété d'exception offre 250m² d'espace de vie sur un terrain de 500m², alliant confort et élégance. Le salon spacieux baigne dans la lumière naturelle tandis que la cuisine équipée moderne ravira les amateurs de gastronomie.

🌟 Caractéristiques :
• 4 chambres climatisées avec placards intégrés
• 3 salles de bains modernes
• Grand jardin paysagé avec piscine
• Garage double couvert
• Quartier calme et sécurisé
• Proche écoles internationales et commodités

Idéale pour famille recherchant tranquillité et standing dans un cadre verdoyant.

🔑 Visite sur rendez-vous !`;

export async function POST(request: NextRequest) {
    try {
        const { title, category, price } = await request.json();

        if (!title || !category) {
            return NextResponse.json(
                { error: 'Titre et catégorie requis' },
                { status: 400 }
            );
        }

        const prompt = `Génère une description attractive pour cette annonce :

Titre : ${title}
Catégorie : ${category}
${price ? `Prix : ${price} FCFA` : 'Prix non spécifié'}

Crée une description professionnelle et engageante qui donnera envie d'acheter !`;

        // Utiliser Groq (gratuit et rapide)
        const aiResponse = await aiService.generateContent(
            prompt,
            {
                temperature: 0.8, // Plus créatif
                maxTokens: 500,
            },
            SYSTEM_PROMPT
        );

        console.log(`📝 Description générée avec: ${aiResponse.provider} (${aiResponse.model})`);
        console.log(`⚡ Temps: ${aiResponse.executionTime}ms`);
        console.log(`💰 Coût: $${aiResponse.cost || 0} (GRATUIT!)`);

        return NextResponse.json({
            description: aiResponse.content.trim(),
            provider: aiResponse.provider,
            executionTime: aiResponse.executionTime,
        });
    } catch (error: any) {
        console.error('Erreur génération description:', error);

        // Fallback en cas d'erreur
        return NextResponse.json(
            {
                error: 'Erreur lors de la génération',
                message: error.message
            },
            { status: 500 }
        );
    }
}

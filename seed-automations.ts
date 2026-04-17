import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAutomations() {
    console.log('🌱 Seeding automation configurations...');

    const automations = [
        {
            feature: 'content_moderation',
            name: 'Modération de Contenu IA',
            description: 'Analyse automatique des annonces et commentaires pour détecter le contenu inapproprié',
            category: 'moderation',
            enabled: true,
            apiProvider: 'openai',
            dailyQuota: 1000,
            monthlyQuota: 30000,
            costPerCall: 0.002,
            priority: 10,
            config: {
                model: 'gpt-4',
                temperature: 0.3,
                maxTokens: 500
            }
        },
        {
            feature: 'image_moderation',
            name: 'Modération d\'Images',
            description: 'Détection automatique de contenu visuel inapproprié dans les images uploadées',
            category: 'moderation',
            enabled: true,
            apiProvider: 'openai',
            dailyQuota: 500,
            monthlyQuota: 15000,
            costPerCall: 0.005,
            priority: 9,
            config: {
                model: 'gpt-4-vision',
                confidence: 0.8
            }
        },
        {
            feature: 'auto_title_generation',
            name: 'Génération de Titres',
            description: 'Génère automatiquement des titres optimisés pour les annonces',
            category: 'content',
            enabled: false,
            apiProvider: 'openai',
            dailyQuota: 200,
            monthlyQuota: 6000,
            costPerCall: 0.001,
            priority: 5,
            config: {
                model: 'gpt-3.5-turbo',
                maxLength: 60
            }
        },
        {
            feature: 'auto_description',
            name: 'Amélioration de Descriptions',
            description: 'Améliore automatiquement les descriptions des annonces pour plus d\'impact',
            category: 'content',
            enabled: false,
            apiProvider: 'openai',
            dailyQuota: 150,
            monthlyQuota: 4500,
            costPerCall: 0.003,
            priority: 4,
            config: {
                model: 'gpt-4',
                tone: 'professional'
            }
        },
        {
            feature: 'sentiment_analysis',
            name: 'Analyse de Sentiment',
            description: 'Analyse le sentiment des commentaires et messages pour détecter les problèmes',
            category: 'analytics',
            enabled: true,
            apiProvider: 'openai',
            dailyQuota: 500,
            monthlyQuota: 15000,
            costPerCall: 0.001,
            priority: 6,
            config: {
                model: 'gpt-3.5-turbo'
            }
        },
        {
            feature: 'auto_response',
            name: 'Réponses Automatiques',
            description: 'Génère des réponses automatiques aux questions fréquentes',
            category: 'engagement',
            enabled: false,
            apiProvider: 'openai',
            dailyQuota: 300,
            monthlyQuota: 9000,
            costPerCall: 0.002,
            priority: 3,
            config: {
                model: 'gpt-4',
                temperature: 0.7
            }
        },
        {
            feature: 'spam_detection',
            name: 'Détection de Spam',
            description: 'Détecte et bloque automatiquement les annonces et messages spam',
            category: 'moderation',
            enabled: true,
            apiProvider: 'openai',
            dailyQuota: 1000,
            monthlyQuota: 30000,
            costPerCall: 0.001,
            priority: 10,
            config: {
                model: 'gpt-3.5-turbo',
                threshold: 0.9
            }
        },
        {
            feature: 'trend_analysis',
            name: 'Analyse de Tendances',
            description: 'Analyse les tendances du marché et suggère des optimisations',
            category: 'analytics',
            enabled: false,
            apiProvider: 'openai',
            dailyQuota: 50,
            monthlyQuota: 1500,
            costPerCall: 0.01,
            priority: 2,
            config: {
                model: 'gpt-4',
                analysisDepth: 'deep'
            }
        }
    ];

    for (const auto of automations) {
        try {
            const existing = await prisma.automationConfig.findUnique({
                where: { feature: auto.feature }
            });

            if (existing) {
                console.log(`✓ ${auto.name} existe déjà`);
            } else {
                await prisma.automationConfig.create({
                    data: auto
                });
                console.log(`✓ ${auto.name} créé`);
            }
        } catch (error) {
            console.error(`✗ Erreur pour ${auto.name}:`, error);
        }
    }

    console.log('✅ Seeding terminé!');
    await prisma.$disconnect();
}

seedAutomations();

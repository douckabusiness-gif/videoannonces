import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const automations = [
    {
        feature: 'moderation_ai',
        name: 'Modération IA',
        description: 'Analyse automatique des vidéos et contenus pour détecter les contenus inappropriés, produits contrefaits et arnaques potentielles.',
        category: 'moderation',
        enabled: false,
        config: {
            autoApprove: true,
            autoReject: true,
            scoreThreshold: 70,
            checkVideo: true,
            checkText: true,
            checkImages: true,
            languages: ['fr', 'en', 'ar'],
            providers: {
                primary: 'openai',
                fallback: ['gemini', 'claude']
            },
            models: {
                openai: 'gpt-4-turbo',
                gemini: 'gemini-pro',
                claude: 'claude-3-sonnet-20240229'
            }
        },
        apiProvider: 'openai', // Provider par défaut
        dailyQuota: 1000,
        monthlyQuota: 30000,
        costPerCall: 0.02,
        priority: 10
    },
    {
        feature: 'chatbot_ai',
        name: 'Chatbot IA Avancé',
        description: 'Assistant intelligent 24/7 avec compréhension contextuelle, support multilingue et escalade automatique vers humain.',
        category: 'engagement',
        enabled: false,
        config: {
            temperature: 0.7,
            maxTokens: 500,
            contextWindow: 10,
            autoEscalate: true,
            escalateKeywords: ['urgent', 'problème', 'bug', 'arnaque'],
            languages: ['fr', 'en', 'ar'],
            providers: {
                primary: 'gemini', // Gemini est excellent pour le chat
                fallback: ['claude', 'openai']
            },
            models: {
                openai: 'gpt-4-turbo',
                gemini: 'gemini-pro',
                claude: 'claude-3-haiku-20240307' // Haiku est rapide et économique
            }
        },
        apiProvider: 'gemini',
        dailyQuota: 5000,
        monthlyQuota: 150000,
        costPerCall: 0.01,
        priority: 8
    },
    {
        feature: 'description_generator',
        name: 'Génération de Descriptions',
        description: 'Génère automatiquement des titres et descriptions optimisés à partir des vidéos d\'annonces avec traduction multilingue.',
        category: 'content',
        enabled: false,
        config: {
            generateTitle: true,
            generateDescription: true,
            suggestCategory: true,
            suggestPrice: true,
            autoTranslate: true,
            languages: ['fr', 'en', 'ar'],
            maxLength: 500,
            providers: {
                primary: 'claude', // Claude est excellent pour le contenu créatif
                fallback: ['gemini', 'openai']
            },
            models: {
                openai: 'gpt-4-vision-preview',
                gemini: 'gemini-pro-vision',
                claude: 'claude-3-sonnet-20240229'
            }
        },
        apiProvider: 'claude',
        dailyQuota: 500,
        monthlyQuota: 15000,
        costPerCall: 0.05,
        priority: 7
    },
    {
        feature: 'badge_auto_assign',
        name: 'Attribution Automatique de Badges',
        description: 'Système d\'attribution automatique de badges basé sur les performances et actions des utilisateurs.',
        category: 'engagement',
        enabled: true, // Déjà implémenté
        config: {
            checkFrequency: 'daily',
            notifyUser: true,
            badges: ['NEW_SELLER', 'PREMIUM', 'TOP_SELLER', 'FAST_RESPONDER', 'TRUSTED', 'EXPERT']
        },
        apiProvider: 'custom',
        dailyQuota: null,
        monthlyQuota: null,
        costPerCall: 0,
        priority: 5
    },
    {
        feature: 'recommendation_engine',
        name: 'Moteur de Recommandations',
        description: 'Recommandations personnalisées basées sur l\'historique, préférences et comportement des utilisateurs.',
        category: 'analytics',
        enabled: false,
        config: {
            algorithm: 'collaborative_filtering',
            minSimilarity: 0.6,
            maxRecommendations: 10,
            updateFrequency: 'hourly',
            factors: ['views', 'favorites', 'purchases', 'category', 'price_range']
        },
        apiProvider: 'custom',
        dailyQuota: 10000,
        monthlyQuota: 300000,
        costPerCall: 0.001,
        priority: 6
    },
    {
        feature: 'predictive_analytics',
        name: 'Analytics Prédictifs',
        description: 'Prévisions de ventes, détection de tendances et alertes de performance basées sur l\'IA.',
        category: 'analytics',
        enabled: false,
        config: {
            predictionWindow: 7, // jours
            minDataPoints: 30,
            confidenceThreshold: 0.75,
            metrics: ['sales', 'views', 'engagement', 'revenue'],
            alertThreshold: 0.2 // 20% variation
        },
        apiProvider: 'custom',
        dailyQuota: 100,
        monthlyQuota: 3000,
        costPerCall: 0.05,
        priority: 4
    },
    {
        feature: 'auto_boost',
        name: 'Auto-Boost Intelligent',
        description: 'Détection automatique des annonces peu performantes et proposition de boost au moment optimal.',
        category: 'engagement',
        enabled: false,
        config: {
            minViews: 10,
            minDays: 3,
            performanceThreshold: 0.3,
            suggestBoost: true,
            autoBoost: false,
            optimalTimes: ['09:00', '12:00', '18:00']
        },
        apiProvider: 'custom',
        dailyQuota: 200,
        monthlyQuota: 6000,
        costPerCall: 0,
        priority: 3
    },
    {
        feature: 'video_optimization',
        name: 'Optimisation Vidéo Auto',
        description: 'Compression intelligente, génération de miniatures IA, sous-titres automatiques et amélioration de qualité.',
        category: 'content',
        enabled: false,
        config: {
            autoCompress: true,
            targetQuality: 'high',
            generateThumbnail: true,
            thumbnailCount: 3,
            autoSubtitles: true,
            subtitleLanguages: ['fr', 'en', 'ar'],
            enhanceQuality: true
        },
        apiProvider: 'openai',
        dailyQuota: 300,
        monthlyQuota: 9000,
        costPerCall: 0.03,
        priority: 6
    },
    {
        feature: 'fraud_detection',
        name: 'Détection Anti-Fraude',
        description: 'Analyse comportementale en temps réel pour détecter les comptes suspects, patterns anormaux et activités frauduleuses.',
        category: 'moderation',
        enabled: false,
        config: {
            checkNewAccounts: true,
            checkBulkActions: true,
            checkSuspiciousPrices: true,
            riskScoreThreshold: 0.7,
            autoBlock: false,
            autoFlag: true,
            factors: ['account_age', 'activity_pattern', 'price_anomaly', 'ip_reputation']
        },
        apiProvider: 'custom',
        dailyQuota: 1000,
        monthlyQuota: 30000,
        costPerCall: 0.005,
        priority: 9
    },
    {
        feature: 'smart_notifications',
        name: 'Notifications Intelligentes',
        description: 'Notifications push personnalisées basées sur le comportement utilisateur et le meilleur moment d\'engagement.',
        category: 'engagement',
        enabled: false,
        config: {
            personalizeContent: true,
            optimizeTiming: true,
            segmentation: true,
            abTesting: true,
            maxPerDay: 3,
            quietHours: { start: '22:00', end: '08:00' }
        },
        apiProvider: 'custom',
        dailyQuota: 5000,
        monthlyQuota: 150000,
        costPerCall: 0.001,
        priority: 5
    }
];

async function main() {
    console.log('🤖 Initialisation des configurations d\'automatisation IA...\n');

    for (const automation of automations) {
        try {
            const existing = await prisma.automationConfig.findUnique({
                where: { feature: automation.feature }
            });

            if (existing) {
                // Mettre à jour
                await prisma.automationConfig.update({
                    where: { feature: automation.feature },
                    data: automation
                });
                console.log(`✅ ${automation.name} - Mis à jour`);
            } else {
                // Créer
                await prisma.automationConfig.create({
                    data: automation
                });
                console.log(`✨ ${automation.name} - Créé`);
            }
        } catch (error) {
            console.error(`❌ Erreur pour ${automation.name}:`, error);
        }
    }

    console.log(`\n🎉 ${automations.length} automatisations initialisées !`);

    // Statistiques
    const stats = await prisma.automationConfig.groupBy({
        by: ['category'],
        _count: true
    });

    console.log('\n📊 Répartition par catégorie:');
    stats.forEach(stat => {
        console.log(`   ${stat.category}: ${stat._count} automatisations`);
    });

    const enabled = await prisma.automationConfig.count({
        where: { enabled: true }
    });

    console.log(`\n✅ ${enabled} automatisation(s) activée(s)`);
    console.log(`⏸️  ${automations.length - enabled} automatisation(s) désactivée(s)`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

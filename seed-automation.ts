/**
 * Script de seed pour créer les configurations d'automatisation par défaut
 * Lance ce script avec: npx ts-node seed-automation.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultConfigs = [
    {
        feature: 'auto_moderation',
        name: 'Modération Automatique',
        description: 'Analyse et modère automatiquement les annonces suspectes',
        category: 'moderation',
        enabled: true,
        config: {
            autoReject: false,
            sensitivityLevel: 'medium',
            checkImages: true,
            checkText: true,
            badWords: ['spam', 'scam', 'arnaque']
        },
        apiProvider: 'openai',
        dailyQuota: 1000,
        monthlyQuota: 30000,
        costPerCall: 0.002,
        priority: 10
    },
    {
        feature: 'auto_categorization',
        name: 'Catégorisation Automatique',
        description: 'Catégorise automatiquement les annonces selon leur contenu',
        category: 'content',
        enabled: true,
        config: {
            confidence_threshold: 0.7,
            suggest_only: true,
            categories_whitelist: []
        },
        apiProvider: 'openai',
        dailyQuota: 500,
        monthlyQuota: 15000,
        costPerCall: 0.001,
        priority: 8
    },
    {
        feature: 'auto_description',
        name: 'Amélioration Descriptions',
        description: 'Améliore automatiquement les descriptions d\'annonces',
        category: 'content',
        enabled: false,
        config: {
            max_length: 500,
            tone: 'professional',
            add_emojis: true,
            improve_seo: true
        },
        apiProvider: 'openai',
        dailyQuota: 200,
        monthlyQuota: 6000,
        costPerCall: 0.003,
        priority: 5
    },
    {
        feature: 'auto_tags',
        name: 'Tags Automatiques',
        description: 'Génère automatiquement des tags pertinents pour les annonces',
        category: 'content',
        enabled: true,
        config: {
            max_tags: 10,
            language: 'fr',
            include_trending: true
        },
        apiProvider: 'openai',
        dailyQuota: 300,
        costPerCall: 0.0005,
        priority: 6
    },
    {
        feature: 'fraud_detection',
        name: 'Détection de Fraude',
        description: 'Détecte les tentatives de fraude et les comptes suspects',
        category: 'moderation',
        enabled: true,
        config: {
            check_phone: true,
            check_ip: true,
            check_payment: true,
            auto_block: false,
            alert_admin: true
        },
        apiProvider: null,
        dailyQuota: null,
        costPerCall: null,
        priority: 10
    },
    {
        feature: 'analytics_report',
        name: 'Rapports Analytics',
        description: 'Génère des rapports analytics hebdomadaires automatiquement',
        category: 'analytics',
        enabled: true,
        config: {
            frequency: 'weekly',
            recipients: ['admin@videoboutique.com'],
            include_charts: true,
            format: 'pdf'
        },
        apiProvider: null,
        dailyQuota: null,
        costPerCall: null,
        priority: 3
    },
    {
        feature: 'user_engagement',
        name: 'Engagement Utilisateurs',
        description: 'Envoie des notifications pour maintenir l\'engagement',
        category: 'engagement',
        enabled: false,
        config: {
            inactivity_days: 7,
            send_recommendations: true,
            send_new_listings: true,
            frequency: 'daily'
        },
        apiProvider: null,
        dailyQuota: null,
        costPerCall: null,
        priority: 4
    }
];

async function main() {
    console.log('🌱 Seed des Automatisations\n');
    console.log('='.repeat(50));

    // Vérifier configurations existantes
    const existingCount = await prisma.automationConfig.count();
    console.log(`📊 Configurations existantes: ${existingCount}`);

    if (existingCount > 0) {
        console.log('\n⚠️ Des configurations existent déjà.');
        console.log('Options:');
        console.log('  1. Annuler (ne rien faire)');
        console.log('  2. Supprimer et recréer');
        console.log('  3. Ajouter seulement les manquantes');
        console.log('\nModifiez le script pour choisir une option.');
        console.log('Par défaut, on ajoute seulement les manquantes...\n');
    }

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const configData of defaultConfigs) {
        try {
            // Vérifier si existe déjà
            const existing = await prisma.automationConfig.findUnique({
                where: { feature: configData.feature }
            });

            if (existing) {
                console.log(`⏭️ Ignoré: ${configData.name} (existe déjà)`);
                skipped++;
                continue;
            }

            // Créer la configuration
            await prisma.automationConfig.create({
                data: {
                    ...configData,
                    version: '1.0',
                    usageCount: 0,
                    totalCost: 0
                }
            });

            console.log(`✅ Créé: ${configData.name}`);
            created++;

        } catch (error) {
            console.error(`❌ Erreur pour ${configData.name}:`, error);
            errors++;
        }
    }

    // Résumé
    console.log('\n' + '='.repeat(50));
    console.log('📋 RÉSUMÉ:');
    console.log(`  ✅ Créées: ${created}`);
    console.log(`  ⏭️ Ignorées: ${skipped}`);
    console.log(`  ❌ Erreurs: ${errors}`);
    console.log('='.repeat(50));

    if (created > 0) {
        console.log('\n✨ Succès ! Les automatisations sont maintenant disponibles.');
        console.log('Vous pouvez les voir sur: /admin/automation');
    }
}

main()
    .catch((e) => {
        console.error('❌ Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

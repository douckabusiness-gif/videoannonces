/**
 * Script de diagnostic et initialisation des automatisations
 * Lance ce script avec: npx ts-node diagnostic-automation.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Diagnostic des Automatisations\n');
    console.log('='.repeat(50));

    // 1. Vérifier la connexion BDD
    console.log('\n[1/4] Vérification connexion base de données...');
    try {
        await prisma.$connect();
        console.log('✅ Connexion BDD réussie');
    } catch (error) {
        console.error('❌ Erreur connexion BDD:', error);
        process.exit(1);
    }

    // 2. Compter les configurations existantes
    console.log('\n[2/4] Comptage des configurations...');
    const count = await prisma.automationConfig.count();
    console.log(`📊 Configurations existantes: ${count}`);

    // 3. Lister les configurations si elles existent
    if (count > 0) {
        console.log('\n[3/4] Liste des configurations:');
        const configs = await prisma.automationConfig.findMany({
            select: {
                feature: true,
                name: true,
                enabled: true,
                category: true,
                usageCount: true
            }
        });

        configs.forEach((config, idx) => {
            const status = config.enabled ? '✅ ACTIF' : '⏸️ INACTIF';
            console.log(`  ${idx + 1}. [${status}] ${config.name} (${config.feature})`);
            console.log(`     Catégorie: ${config.category} | Utilisations: ${config.usageCount}`);
        });
    } else {
        console.log('\n⚠️ AUCUNE CONFIGURATION TROUVÉE !');
        console.log('Souhaitez-vous initialiser avec les configurations par défaut?');
        console.log('Lancez: npx ts-node seed-automation.ts');
    }

    // 4. Vérifier les logs
    console.log('\n[4/4] Vérification des logs récents...');
    const recentLogs = await prisma.automationLog.count({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24h
            }
        }
    });
    console.log(`📝 Logs des dernières 24h: ${recentLogs}`);

    // Résumé final
    console.log('\n' + '='.repeat(50));
    console.log('📋 RÉSUMÉ:');
    console.log(`  - Configurations: ${count}`);
    console.log(`  - Logs (24h): ${recentLogs}`);

    if (count === 0) {
        console.log('\n⚡ ACTION RECOMMANDÉE:');
        console.log('  Exécutez le script de seed pour créer les configurations:');
        console.log('  > npx ts-node seed-automation.ts');
    } else {
        console.log('\n✅ Tout semble en ordre côté base de données');
        console.log('Si vous ne voyez toujours pas les configurations:');
        console.log('  1. Videz le cache navigateur (CTRL + SHIFT + DELETE)');
        console.log('  2. Reconnectez-vous en tant qu\'admin');
        console.log('  3. Vérifiez la console (F12) pour des erreurs JavaScript');
    }

    console.log('\n' + '='.repeat(50));
}

main()
    .catch((e) => {
        console.error('❌ Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

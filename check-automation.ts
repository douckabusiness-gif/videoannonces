import { prisma } from './lib/prisma';

async function checkAutomationConfigs() {
    try {
        const configs = await prisma.automationConfig.findMany({
            include: {
                _count: {
                    select: { logs: true }
                }
            }
        });

        console.log(`📊 Configurations trouvées: ${configs.length}\n`);

        if (configs.length === 0) {
            console.log('❌ Aucune configuration trouvée !');
            console.log('💡 Exécutez: npx tsx seed-automations.ts\n');
        } else {
            console.log('✅ Configurations disponibles:\n');
            configs.forEach((config, index) => {
                console.log(`${index + 1}. ${config.name}`);
                console.log(`   Feature: ${config.feature}`);
                console.log(`   Category: ${config.category}`);
                console.log(`  Status: ${config.enabled ? '✅ Actif' : '⏸️ Inactif'}`);
                console.log(`   Executions: ${config._count.logs}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAutomationConfigs();

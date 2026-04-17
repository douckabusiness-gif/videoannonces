const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
    try {
        console.log('Checking SiteSettings table...');
        const settings = await prisma.siteSettings.findFirst();
        console.log('Current Settings:', settings);

        if (settings) {
            console.log('Updating settings...');
            const updated = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: { dashboardLayout: 'orbital' }
            });
            console.log('Updated Settings:', updated);
        } else {
            console.log('Creating settings...');
            const created = await prisma.siteSettings.create({
                data: { dashboardLayout: 'nebula' }
            });
            console.log('Created Settings:', created);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkSettings();

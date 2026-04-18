const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const dbRow = await prisma.setting.findUnique({ where: { key: 'platform.solo_mode_enabled' } });
    console.log('dbRow:', dbRow);
    
    console.log('process.env.SOLO_BUSINESS_MODE:', process.env.SOLO_BUSINESS_MODE);
    console.log('process.env.NEXT_PUBLIC_SOLO_BUSINESS_MODE:', process.env.NEXT_PUBLIC_SOLO_BUSINESS_MODE);
}
main().catch(console.error).finally(() => prisma.$disconnect());

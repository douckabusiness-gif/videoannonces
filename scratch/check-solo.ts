import { prisma } from '../lib/prisma';
import { getSoloModeEnabled } from '../lib/platform-flags';

async function main() {
    const dbValue = await getSoloModeEnabled();
    console.log('dbValue:', dbValue);
    console.log('process.env.SOLO_BUSINESS_MODE:', process.env.SOLO_BUSINESS_MODE);
    console.log('process.env.NEXT_PUBLIC_SOLO_BUSINESS_MODE:', process.env.NEXT_PUBLIC_SOLO_BUSINESS_MODE);
    
    const dbRow = await prisma.setting.findUnique({ where: { key: 'platform.solo_mode_enabled' } });
    console.log('dbRow:', dbRow);
}
main().catch(console.error).finally(() => prisma.$disconnect());

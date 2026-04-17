import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const logs = await prisma.systemLog.findMany({
            where: { type: 'error' },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        console.log('Last 5 Error Logs:');
        logs.forEach(log => {
            console.log(`[${log.createdAt.toISOString()}] ${log.category}.${log.action}: ${log.message}`);
            if (log.metadata) {
                console.log('Metadata:', JSON.stringify(log.metadata, null, 2));
            }
        });
    } catch (e) {
        console.error('Error checking logs:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();

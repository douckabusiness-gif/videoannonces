import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        const log = await prisma.systemLog.findFirst({
            where: { category: 'email', type: 'error' },
            orderBy: { createdAt: 'desc' },
        });

        if (log) {
            console.log('Last SMTP Error:');
            console.log('ID:', log.id);
            console.log('Time:', log.createdAt.toISOString());
            console.log('Action:', log.action);
            console.log('Message:', log.message);
            console.log('Metadata:', JSON.stringify(log.metadata, null, 2));
        } else {
            console.log('No SMTP error log found.');
        }
    } catch (e) {
        console.error('Error checking logs:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();

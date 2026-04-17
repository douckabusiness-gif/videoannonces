
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsersJson() {
    console.log('--- JSON Users List ---');
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            verified: true
            // Not selecting password hash for security/noise
        }
    });
    console.log(JSON.stringify(users, null, 2));
    await prisma.$disconnect();
}

listUsersJson().catch(console.error);

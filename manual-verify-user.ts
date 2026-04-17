import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyUser() {
    const email = '12345oumar12@gmail.com';

    try {
        const user = await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: { verified: true }
        });

        console.log(`Successfully verified user: ${user.name} (${user.email})`);

    } catch (e) {
        console.error('Error verifying user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyUser();

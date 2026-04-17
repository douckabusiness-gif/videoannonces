import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const email = '12345oumar12@gmail.com';

    try {
        const code = await prisma.verificationCode.findFirst({
            where: { email: email.toLowerCase() },
            orderBy: { createdAt: 'desc' }
        });

        if (code) {
            console.log('Verification code found:');
            console.log('- Code:', code.code);
            console.log('- Type:', code.type);
            console.log('- Created At:', code.createdAt.toISOString());
            console.log('- Expires At:', code.expiresAt.toISOString());
            console.log('- Used:', code.used);
        } else {
            console.log('No verification code found for this email.');
        }

        // Also check for the user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        console.log('User status:', user ? `FOUND (Verified: ${user.verified})` : 'NOT FOUND');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();

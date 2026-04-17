import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const phone = '0140484427';
    const email = '12345oumar12@gmail.com';

    try {
        const userByPhone = await prisma.user.findUnique({
            where: { phone }
        });
        console.log(`User by phone (${phone}):`, userByPhone ? 'EXISTS' : 'NOT FOUND');

        const userByEmail = await prisma.user.findUnique({
            where: { email }
        });
        console.log(`User by email (${email}):`, userByEmail ? 'EXISTS' : 'NOT FOUND');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();

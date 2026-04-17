const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSubdomain() {
    try {
        const user = await prisma.user.findUnique({
            where: { subdomain: 'oumar' },
            select: { id: true, name: true, email: true, phone: true }
        });
        console.log('User with subdomain "oumar":', user);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSubdomain();

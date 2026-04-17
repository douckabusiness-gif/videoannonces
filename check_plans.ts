import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Fetching plans...');
    const plans = await prisma.subscriptionPlan.findMany();
    console.log('Plans found:', plans);
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

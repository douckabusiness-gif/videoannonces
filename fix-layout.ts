
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



async function main() {

  const result = await prisma.siteSettings.updateMany({

    data: { homeLayout: 'modern' }

  });

  console.log('✅ Layout mis à jour:', result);

}



main()

  .then(() => prisma.$disconnect())

  .catch(e => { console.error(e); prisma.$disconnect(); });


import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function cleanup() {

  console.log('í ¾í·¹ Nettoyage...');

  try {

    // 1. Tout dÃ©sactiver

    await prisma.paymentMethod.updateMany({

      data: { active: false },

    });


    // 2. Activer seulement WAVE et ORANGE (avec majuscules car ce sont ceux avec les logos)

    await prisma.paymentMethod.updateMany({

      where: {

        name: { in: ['WAVE', 'ORANGE'] }

      },

      data: { active: true }

    });


    console.log('âœ… Fini ! Seuls WAVE et ORANGE sont actifs.');

  } catch (error) {

    console.error(error);

  } finally {

    await prisma.$disconnect();

  }

}


cleanup();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "mysql://root:videoboutique_root@localhost:3306/doucka2026_videoboutique"
        }
    }
});

async function main() {
    console.log('🚀 Tentative de promotion Admin (Docker Password)...');

    const result = await prisma.user.updateMany({
        where: {
            OR: [
                { isVendor: true },
                { phone: { contains: '05' } },
                { role: 'USER' } // On promeut tout le monde en Admin pour débloquer le client
            ]
        },
        data: {
            role: 'ADMIN',
            verified: true,
            isVendor: true
        }
    });

    console.log(`✅ Mise à jour réussie : ${result.count} utilisateur(s) promu(s) en ADMIN.`);

    // Vérification
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { phone: true, name: true, role: true }
    });

    console.log('Nouveaux Admins :', admins);
}

main()
    .catch((e) => {
        console.error('❌ Erreur critique :', e.message);
    })
    .finally(() => prisma.$disconnect());

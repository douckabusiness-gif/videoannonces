import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminDashboard from './dashboard';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    // Si pas connecté, rediriger vers la page de connexion admin
    if (!session?.user) {
        redirect('/admin/login');
    }

    // Vérifier le rôle admin
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        redirect('/admin/login');
    }

    // Si admin, afficher le dashboard
    return <AdminDashboard />;
}

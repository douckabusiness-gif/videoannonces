import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Extraire les informations utilisateur de la session
    const isVendor = session.user?.isVendor ?? false;
    const userName = session.user?.name ?? 'Utilisateur';
    const userAvatar = session.user?.avatar ?? null;

    return (
        <>
            {/* Global Cosmic Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 -z-10" />

            <DashboardShell
                isVendor={isVendor}
                userName={userName}
                userAvatar={userAvatar}
            >
                {children}
            </DashboardShell>
        </>
    );
}

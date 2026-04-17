import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { isSoloBusinessMode, userCanPublishListings } from '@/lib/solo-business';

export default async function PublicCreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login');
    }
    if (
        isSoloBusinessMode() &&
        !userCanPublishListings(session.user.id, session.user.role)
    ) {
        redirect('/');
    }
    return <>{children}</>;
}

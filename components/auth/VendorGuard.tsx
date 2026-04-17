'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface VendorGuardProps {
    children: React.ReactNode;
    isVendor: boolean;
}

export default function VendorGuard({ children, isVendor }: VendorGuardProps) {
    // REMOVED : Restriction supprimée
    // Tous les utilisateurs peuvent maintenant accéder au dashboard
    // Le dashboard affichera les fonctionnalités appropriées selon le rôle

    return <>{children}</>;
}

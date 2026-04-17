'use client';

import { SessionProvider } from 'next-auth/react';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';

import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SiteSettingsProvider>
                {children}
                <Toaster position="top-center" />
            </SiteSettingsProvider>
        </SessionProvider>
    );
}

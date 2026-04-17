'use client';

import { ReactNode } from 'react';

interface ShopThemeProps {
    theme: string;
    children: ReactNode;
}

const themes = {
    default: {
        bg: 'bg-gradient-to-br from-gray-50 to-orange-50',
        primary: 'text-orange-600',
        accent: 'bg-orange-500',
    },
    dark: {
        bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
        primary: 'text-orange-400',
        accent: 'bg-orange-600',
    },
    minimal: {
        bg: 'bg-white',
        primary: 'text-gray-900',
        accent: 'bg-gray-900',
    },
    vibrant: {
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        primary: 'text-purple-600',
        accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
};

export default function ShopTheme({ theme, children }: ShopThemeProps) {
    const currentTheme = themes[theme as keyof typeof themes] || themes.default;

    return (
        <div className={`min-h-screen ${currentTheme.bg}`}>
            <style jsx global>{`
        :root {
          --shop-primary: ${currentTheme.primary};
          --shop-accent: ${currentTheme.accent};
        }
      `}</style>
            {children}
        </div>
    );
}

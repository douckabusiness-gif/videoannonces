import { prisma } from '@/lib/prisma';

export type LayoutType = 'modern' | 'luxury';

export interface LayoutSettings {
    homeLayout: LayoutType;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
}

export async function getLayoutSettings(): Promise<LayoutSettings> {
    try {
        const settings = await prisma.siteSettings.findFirst({
            select: {
                homeLayout: true,
                primaryColor: true,
                secondaryColor: true,
                accentColor: true,
            },
        });

        return settings || {
            homeLayout: 'modern',
            primaryColor: '#FF6B35',
            secondaryColor: '#F7931E',
            accentColor: '#FDC830',
        };
    } catch (error) {
        console.error('Error fetching layout settings:', error);
        return {
            homeLayout: 'modern',
            primaryColor: '#FF6B35',
            secondaryColor: '#F7931E',
            accentColor: '#FDC830',
        };
    }
}

export function getLayoutColors(settings: LayoutSettings) {
    return {
        primary: settings.primaryColor,
        secondary: settings.secondaryColor,
        accent: settings.accentColor,
    };
}

export const layoutDescriptions = {
    modern: {
        name: 'Modern Grid',
        description: 'Design équilibré et moderne avec grille 6 colonnes',
        features: ['Cartes moyennes', 'Glassmorphism', 'Animations fluides'],
        bestFor: 'Tech, Mode, Général',
        columns: 6,
    },
    luxury: {
        name: 'Luxury Showcase',
        description: 'Design élégant et spacieux avec grandes images',
        features: ['Grandes cartes', 'Espaces généreux', 'Animations subtiles'],
        bestFor: 'Luxe, Immobilier, Art',
        columns: 3,
    },
};

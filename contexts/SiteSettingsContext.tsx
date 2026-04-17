'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
    siteName: string;
    siteSlogan: string | null;
    siteDescription: string | null;
    logo: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerColor: string;
    footerColor: string;
    headerTextColor: string;
    footerTextColor: string;
    urgentBgColor: string;
    shopsBgColor: string;
    recentBgColor: string;
    urgentTextColor: string;
    shopsTextColor: string;
    recentTextColor: string;
    soloMode?: boolean;
}

interface SiteSettingsContextType {
    siteSettings: SiteSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
    siteName: '', // Empty to prevent flash
    siteSlogan: null,
    siteDescription: null,
    logo: null,
    primaryColor: '#FF6B35',
    secondaryColor: '#F7931E',
    accentColor: '#FDC830',
    backgroundColor: '#FFF7ED',
    headerColor: '#FFFFFF',
    footerColor: '#FFFFFF',
    headerTextColor: '#000000',
    footerTextColor: '#000000',
    urgentBgColor: '#FFFFFF',
    shopsBgColor: '#FFFFFF',
    recentBgColor: '#FFFFFF',
    urgentTextColor: '#000000',
    shopsTextColor: '#000000',
    recentTextColor: '#000000',
    soloMode: false,
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    siteSettings: defaultSettings,
    loading: true,
    refreshSettings: async () => { },
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings/site');
            if (response.ok) {
                const data = await response.json();
                setSiteSettings({
                    siteName: data.siteName || 'VideoBoutique',
                    siteSlogan: data.siteSlogan,
                    siteDescription: data.siteDescription,
                    logo: data.logo,
                    primaryColor: data.primaryColor || '#FF6B35',
                    secondaryColor: data.secondaryColor || '#F7931E',
                    accentColor: data.accentColor || '#FDC830',
                    backgroundColor: data.backgroundColor || '#FFF7ED',
                    headerColor: data.headerColor || '#FFFFFF',
                    footerColor: data.footerColor || '#FFFFFF',
                    headerTextColor: data.headerTextColor || '#000000',
                    footerTextColor: data.footerTextColor || '#000000',
                    urgentBgColor: data.urgentBgColor || '#FFFFFF',
                    shopsBgColor: data.shopsBgColor || '#FFFFFF',
                    recentBgColor: data.recentBgColor || '#FFFFFF',
                    urgentTextColor: data.urgentTextColor || '#000000',
                    shopsTextColor: data.shopsTextColor || '#000000',
                    recentTextColor: data.recentTextColor || '#000000',
                    soloMode: data.soloMode || false,
                });
            }
        } catch (error) {
            console.error('Error loading site settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider
            value={{
                siteSettings,
                loading,
                refreshSettings: fetchSettings,
            }}
        >
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/contexts/I18nContext';

import MobileNavigation from '@/components/MobileNavigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MainHeader from '@/components/MainHeader';
import HomeLayoutModern from '@/components/layouts/HomeLayoutModern';
import HomeLayoutCosmicWave from '@/components/layouts/HomeLayoutCosmicWave';
import HomeLayoutLuxury from '@/components/layouts/HomeLayoutLuxury';
import HomeLayoutClassic from '@/components/layouts/HomeLayoutClassic';
import HomeLayoutNebulaGrid from '@/components/layouts/HomeLayoutNebulaGrid';
import HomeLayoutAlibabaMulti from '@/components/layouts/HomeLayoutAlibabaMulti';
import Footer from '@/components/Footer';

export default function Home() {
  // Revert verification trigger
  const { data: session } = useSession();

  const [siteSettings, setSiteSettings] = useState({
    siteName: '', // Empty defaults to prevent flash
    siteSlogan: '',
    siteDescription: '',
    logo: null as string | null,
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    backgroundColor: '',
    homeLayout: 'modern' as string, // Default layout
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/settings/site');
      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data);
      }
    } catch (error) {
      console.error('Erreur chargement paramètres site:', error);
    } finally {
      setLoading(false);
    }
  };

  // Derive colors from siteSettings if available, or use defaults
  const colors = {
    primary: siteSettings.primaryColor || '#FF6B00',
    secondary: siteSettings.secondaryColor || '#FF8C00',
    accent: siteSettings.accentColor || '#FFD700',
    background: siteSettings.backgroundColor || '#FFF7ED',
  };

  const renderLayout = () => {
    const layout = siteSettings.homeLayout || 'modern';
    
    switch (layout) {
      case 'cosmic':
      case 'cosmicwave':
        return <HomeLayoutCosmicWave siteSettings={siteSettings} />;
      case 'luxury':
        return <HomeLayoutLuxury siteSettings={siteSettings} />;
      case 'classic':
        return <HomeLayoutClassic siteSettings={siteSettings} />;
      case 'nebulagrid':
        return <HomeLayoutNebulaGrid siteSettings={siteSettings} />;
      case 'alibabamulti':
        return <HomeLayoutAlibabaMulti siteSettings={siteSettings} />;
      case 'modern':
      default:
        return <HomeLayoutModern colors={colors} siteSettings={siteSettings} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Rendu direct du layout Modern
  return (
    <>
      <MainHeader siteSettings={siteSettings} />
      {renderLayout()}
      <Footer />

      {/* Navigation Mobile Globale (affichée par dessus le layout) */}
      <MobileNavigation />

      {/* Switcher de langue flottant */}
      <div className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8">
        <LanguageSwitcher />
      </div>
    </>
  );
}

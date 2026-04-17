'use client';

import { useState, useEffect } from 'react';
import HomeLayoutModern from '@/components/layouts/HomeLayoutModern';
import HomeLayoutLuxury from '@/components/layouts/HomeLayoutLuxury';
import Link from 'next/link';

interface LayoutSettings {
  homeLayout: 'modern' | 'luxury';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export default function Home() {
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    homeLayout: 'modern',
    primaryColor: '#FF6B35',
    secondaryColor: '#F7931E',
    accentColor: '#FDC830',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLayoutSettings();
  }, []);

  const fetchLayoutSettings = async () => {
    try {
      const response = await fetch('/api/settings/layout');
      if (response.ok) {
        const data = await response.json();
        setLayoutSettings(data);
      }
    } catch (error) {
      console.error('Erreur chargement layout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const colors = {
    primary: layoutSettings.primaryColor,
    secondary: layoutSettings.secondaryColor,
    accent: layoutSettings.accentColor,
  };

  return (
    <>
      {/* Header avec glassmorphism */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              VideoBoutique
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-orange-600 hover:text-orange-700 transition font-medium hover:scale-105 transform duration-200"
            >
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transform duration-200 font-semibold"
            >
              Mon Espace
            </Link>
          </div>
        </div>
      </header>

      {/* Rendu dynamique du layout */}
      {layoutSettings.homeLayout === 'luxury' ? (
        <HomeLayoutLuxury colors={colors} />
      ) : (
        <HomeLayoutModern colors={colors} />
      )}
    </>
  );
}

'use client';

import { useTranslation, useLocale, useMultiLanguageEnabled } from '@/contexts/I18nContext';
import { useState } from 'react';

export default function LanguageSwitcher() {
    const { setLocale } = useTranslation();
    const locale = useLocale();
    const multiLanguageEnabled = useMultiLanguageEnabled();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'fr' as const, flag: '🇫🇷', name: 'Français' },
        { code: 'en' as const, flag: '🇬🇧', name: 'English' },
        { code: 'es' as const, flag: '🇪🇸', name: 'Español' },
    ];

    const currentLang = languages.find(lang => lang.code === locale) || languages[0];

    const switchLanguage = (newLocale: 'fr' | 'en' | 'es') => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    // Masquer complètement le sélecteur si multi-langues désactivé
    if (!multiLanguageEnabled) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                aria-label="Changer de langue"
            >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="font-medium text-gray-900">{currentLang.code.toUpperCase()}</span>
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[180px] overflow-hidden z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => switchLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${lang.code === locale ? 'bg-orange-50' : ''
                                    }`}
                            >
                                <span className="text-2xl">{lang.flag}</span>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">{lang.name}</div>
                                    <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                                </div>
                                {lang.code === locale && (
                                    <svg className="w-5 h-5 text-orange-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Overlay pour fermer */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                </>
            )}
        </div>
    );
}

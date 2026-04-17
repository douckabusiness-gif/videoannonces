'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type Locale = 'fr' | 'en' | 'es';
type Messages = Record<string, any>;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, any>) => string;
    messages: Messages;
    multiLanguageEnabled: boolean;
    availableLanguages: Locale[];
    defaultLocale: Locale;
}

// Context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('fr');
    const [messages, setMessages] = useState<Messages>({});
    const [multiLanguageEnabled, setMultiLanguageEnabled] = useState(true);

    const [availableLanguages, setAvailableLanguages] = useState<Locale[]>(['fr', 'en', 'es']);
    const [defaultLocale, setDefaultLocale] = useState<Locale>('fr');

    // Charger la configuration globale au démarrage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/admin/i18n-settings');
                if (response.ok) {
                    const data = await response.json();
                    setMultiLanguageEnabled(data.multiLanguageEnabled);
                    if (data.availableLanguages) setAvailableLanguages(data.availableLanguages);
                    if (data.defaultLanguage) setDefaultLocale(data.defaultLanguage);

                    // Si pas de locale sauvegardée, utiliser la default du serveur
                    if (typeof window !== 'undefined' && !localStorage.getItem('locale')) {
                        setLocaleState(data.defaultLanguage as Locale);
                    }
                }
            } catch (error) {
                console.log('Using default i18n settings');
            }
        };

        loadSettings();
    }, []);

    // Charger les messages de la langue
    useEffect(() => {
        loadMessages(locale);
    }, [locale]);

    // Sauvegarder la langue dans localStorage
    const setLocale = (newLocale: Locale) => {
        // Ne changer que si multi-langues activé
        if (!multiLanguageEnabled && newLocale !== 'fr') {
            console.log('Multi-language disabled');
            return;
        }

        setLocaleState(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
            document.documentElement.lang = newLocale;
        }
    };

    // Charger depuis localStorage au démarrage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLocale = localStorage.getItem('locale') as Locale;
            if (savedLocale && ['fr', 'en', 'es'].includes(savedLocale)) {
                setLocaleState(savedLocale);
            }
        }
    }, []);

    const loadMessages = async (loc: Locale) => {
        try {
            const msgs = await import(`@/messages/${loc}.json`);
            setMessages(msgs.default);
        } catch (error) {
            console.error(`Failed to load messages for ${loc}:`, error);
            // Fallback sur le français
            if (loc !== 'fr') {
                const fallback = await import('@/messages/fr.json');
                setMessages(fallback.default);
            }
        }
    };

    // Fonction de traduction
    const t = (key: string, params?: Record<string, any>): string => {
        // Supporter les clés imbriquées comme "shop.title"
        const keys = key.split('.');
        let value: any = messages;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Retourner la clé si non trouvée
            }
        }

        // Si c'est une string, remplacer les paramètres
        if (typeof value === 'string' && params) {
            return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
                return params[paramKey]?.toString() || `{${paramKey}}`;
            });
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <I18nContext.Provider value={{
            locale,
            setLocale,
            t,
            messages,
            multiLanguageEnabled,
            availableLanguages,
            defaultLocale
        }}>
            {children}
        </I18nContext.Provider>
    );
}

// Hook personnalisé
export function useTranslation(namespace?: string) {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }

    const { t: translate, locale, setLocale, multiLanguageEnabled } = context;

    // Si un namespace est fourni, préfixer automatiquement
    const t = (key: string, params?: Record<string, any>) => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        return translate(fullKey, params);
    };

    return { t, locale, setLocale, multiLanguageEnabled };
}

// Hook pour obtenir juste la locale
export function useLocale() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useLocale must be used within I18nProvider');
    }
    return context.locale;
}

// Hook pour vérifier si multi-langues est activé
export function useMultiLanguageEnabled() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useMultiLanguageEnabled must be used within I18nProvider');
    }
    return context.multiLanguageEnabled;
}

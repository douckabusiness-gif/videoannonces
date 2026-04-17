import { getRequestConfig } from 'next-intl/server';

// Langues disponibles
export const locales = ['fr', 'en', 'es'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
    // Valider que la locale est supportée (sans utiliser notFound())
    const validLocale = locales.includes(locale as Locale) ? locale : 'fr';

    return {
        messages: (await import(`./messages/${validLocale}.json`)).default,
        timeZone: 'Africa/Abidjan',
        now: new Date()
    };
});

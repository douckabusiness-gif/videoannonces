// Exemple d'utilisation de next-intl dans vos composants

// ============================================
// EXEMPLE 1 : Server Component
// ============================================
import { useTranslations } from 'next-intl';

export default function ShopPage() {
    const t = useTranslations('shop');
    const tCommon = useTranslations('common');

    return (
        <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>

            {/* Utiliser les traductions au lieu de textes hardcodés */}
            <label>{t('subdomain')}</label>
            <input placeholder={t('subdomainPlaceholder')} />

            <button>{tCommon('save')}</button>
        </div>
    );
}

// ============================================
// EXEMPLE 2 : Client Component
// ============================================
'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function MyButton() {
    const t = useTranslations('common');
    const locale = useLocale(); // 'fr', 'en', ou 'es'

    const handleClick = () => {
        alert(t('success'));
    };

    return (
        <button onClick={handleClick} className="px-4 py-2 bg-blue-500 text-white">
            {t('save')} ({locale.toUpperCase()})
        </button>
    );
}

// ============================================
// EXEMPLE 3 : Avec LanguageSwitcher
// ============================================
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
    const t = useTranslations('nav');

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow">
            <nav>
                <a href="/">{t('home')}</a>
                <a href="/dashboard">{t('dashboard')}</a>
                <a href="/dashboard/shop">{t('shop')}</a>
            </nav>

            <LanguageSwitcher />
        </header>
    );
}

// ============================================
// EXEMPLE 4 : Traductions avec variables
// ============================================
// Dans messages/fr.json:
// "welcome": "Bienvenue {name} !"

import { useTranslations } from 'next-intl';

export default function Welcome({ userName }: { userName: string }) {
    const t = useTranslations('dashboard');

    return <h1>{t('welcome', { name: userName })}</h1>;
    // FR: "Bienvenue Jean !"
    // EN: "Welcome Jean!"
}

// ============================================
// EXEMPLE 5 : Formatage dates et nombres
// ============================================
'use client';

import { useFormatter, useLocale } from 'next-intl';

export default function PriceDisplay({ amount }: { amount: number }) {
    const format = useFormatter();
    const locale = useLocale();

    return (
        <div>
            <p>Prix : {format.number(amount, {
                style: 'currency',
                currency: 'XOF'
            })}</p>
            {/* FR: "Prix : 1 999,99 FCFA" */}
            {/* EN: "Price: XOF 1,999.99" */}

            <p>Date : {format.dateTime(new Date(), {
                dateStyle: 'long'
            })}</p>
            {/* FR: "8 décembre 2024" */}
            {/* EN: "December 8, 2024" */}
        </div>
    );
}

// ============================================
// EXEMPLE 6 : Navigation entre langues
// ============================================
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageButton({ targetLocale }: { targetLocale: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const switchLanguage = () => {
        // Remplacer la locale dans l'URL
        const newPath = pathname.replace(`/${currentLocale}`, `/${targetLocale}`);
        router.push(newPath);
    };

    return (
        <button onClick={switchLanguage}>
            {targetLocale === 'fr' && '🇫🇷 Français'}
            {targetLocale === 'en' && '🇬🇧 English'}
            {targetLocale === 'es' && '🇪🇸 Español'}
        </button>
    );
}

// ============================================
// EXEMPLE 7 : Traductions conditionnelles
// ============================================
import { useTranslations } from 'next-intl';

export default function StatusBadge({ isOpen }: { isOpen: boolean }) {
    const t = useTranslations('shop');

    return (
        <span className={isOpen ? 'text-green-500' : 'text-red-500'}>
            {isOpen ? t('open') : t('closed')}
        </span>
    );
}

// ============================================
// EXEMPLE 8 : Liste avec traductions
// ============================================
import { useTranslations } from 'next-intl';

export default function DaysList() {
    const t = useTranslations('days');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <ul>
            {days.map(day => (
                <li key={day}>{t(day)}</li>
            ))}
        </ul>
    );
}

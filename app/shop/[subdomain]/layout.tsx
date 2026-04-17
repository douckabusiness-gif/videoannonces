import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import { Inter, Roboto, Open_Sans, Lato, Montserrat } from 'next/font/google';
import NativeChatWidget from '@/components/features/NativeChat/ChatWidget';

// Configuration des polices
const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

const fonts: Record<string, any> = {
    inter,
    roboto,
    opensans: openSans,
    lato,
    montserrat,
};

type Props = {
    children: React.ReactNode;
    params: Promise<{ subdomain: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { subdomain } = await params;
    const user = await prisma.user.findUnique({
        where: { subdomain },
        select: {
            name: true,
            subdomain: true,
            shopTheme: true
        }
    });

    if (!user) {
        return {
            title: 'Boutique introuvable - VideoBoutique',
        };
    }

    return {
        title: `${user.name} | VideoBoutique`,
        description: `Bienvenue sur la boutique officielle de ${user.name}. Découvrez nos produits et services.`,
    };
}

export default async function ShopLayout({ children, params }: Props) {
    const { subdomain } = await params;

    // Fetch user settings
    const user = await prisma.user.findUnique({
        where: { subdomain },
        select: {
            id: true,
            fontFamily: true
        }
    });

    const selectedFont = user?.fontFamily && fonts[user.fontFamily] ? fonts[user.fontFamily] : inter;

    return (
        <div className={`min-h-screen bg-gray-50/30 ${selectedFont.className}`}>
            {children}
        </div>
    );
}

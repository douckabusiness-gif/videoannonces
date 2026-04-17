import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google"; // Disabled due to connection errors
import "./globals.css";
import { Providers } from "./providers";
import ChatbotWidget from "@/components/ChatbotWidget";
import { I18nProvider } from "@/contexts/I18nContext";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import GeoRestrictionBanner from "@/components/GeoRestrictionBanner";

/*
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});
*/

export const metadata: Metadata = {
  title: "VideoAnnonces-CI - Petites Annonces Vidéo en Côte d'Ivoire",
  description: "La première plateforme de petites annonces 100% vidéo en Côte d'Ivoire. Vendez et achetez en vidéo facilement.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VideoAnnonces-CI",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased font-sans" suppressHydrationWarning={true}>
        <I18nProvider>
          <Providers>
            {children}
            <ChatbotWidget />
            <InstallPrompt />
            <GeoRestrictionBanner />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}

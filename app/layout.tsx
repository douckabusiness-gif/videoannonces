import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google"; // Disabled due to connection errors
import "./globals.css";
import { Providers } from "./providers";
import { prisma } from "@/lib/prisma";
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

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch {
    // Build Docker / CI sans DB : valeurs par défaut utilisées
  }

  const siteName = settings?.siteName || "AfriVideoAnnonce";
  const description = settings?.description || "Petites annonces vidéo en Côte d'Ivoire";
  const favicon = settings?.favicon || "/api/pwa-icon?size=32";

  return {
    title: `${siteName} - Petites Annonces Vidéo en Côte d'Ivoire`,
    description: description,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: favicon, type: "image/svg+xml" },
        { url: "/api/pwa-icon?size=16", sizes: "16x16", type: "image/svg+xml" },
        { url: "/api/pwa-icon?size=32", sizes: "32x32", type: "image/svg+xml" },
        { url: "/api/pwa-icon?size=96", sizes: "96x96", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/api/pwa-icon?size=120", sizes: "120x120" },
        { url: "/api/pwa-icon?size=152", sizes: "152x152" },
        { url: "/api/pwa-icon?size=180", sizes: "180x180" },
      ],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteName,
    },
  };
}

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

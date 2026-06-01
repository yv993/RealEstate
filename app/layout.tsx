import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ScrollProvider } from "@/components/motion/ScrollProvider";
import { CursorLoader } from "@/components/motion/CursorLoader";
import { CompareBar } from "@/components/CompareBar";
import { FloatingContact } from "@/components/FloatingContact";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FavoritesProvider } from "@/lib/favorites";
import { CompareProvider } from "@/lib/compare";
import { CurrencyProvider } from "@/lib/currency";
import { ToastProvider } from "@/lib/toast";
import { SITE_URL } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "EverGreen — Build Your Future, One Property at a Time",
  description:
    "A boutique real-estate agency in Armenia. Curated homes and investments in the places worth living.",
  openGraph: {
    type: "website",
    siteName: "EverGreen",
    locale: "en_US",
    url: SITE_URL,
    images: [{ url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80", width: 1200, height: 800, alt: "EverGreen — real estate in Armenia" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Runs before paint to set the theme class, preventing a flash of the wrong theme.
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgress />
        <FavoritesProvider>
          <CompareProvider>
            <CurrencyProvider>
              <ToastProvider>
                <ScrollProvider>{children}</ScrollProvider>
                <CompareBar />
                <FloatingContact />
                <CookieConsent />
                <CursorLoader />
              </ToastProvider>
            </CurrencyProvider>
          </CompareProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

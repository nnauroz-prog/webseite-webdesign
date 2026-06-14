import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";

import { CommandPalette } from "@/components/marketing/command-palette";
import { buildSearchIndex } from "@/lib/search-index";
import { CursorLabel } from "@/components/marketing/cursor-label";
import { KeyboardChords } from "@/components/marketing/keyboard-chords";
import { KonamiEgg } from "@/components/marketing/konami-egg";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { PageCursorGlow } from "@/components/marketing/page-cursor-glow";
import { PlausibleScript } from "@/components/marketing/plausible-script";
import { ScrollProgress } from "@/components/marketing/scroll-progress";
import { ShortcutHelp } from "@/components/marketing/shortcut-help";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Display: "swap" auf allen Fonts — der Browser nimmt sofort den
// Fallback und tauscht aus, sobald die Web-Font geladen ist. Vermeidet
// FOIT (Flash of Invisible Text), wo Text bis zu 3 s unsichtbar bleibt,
// und damit eine LCP-Verzögerung. Cormorant-Weight 600 raus — wir nutzen
// nur 400 (Headline-Serif) und 400-italic (Akzent-Italic).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description:
    "Websites für lokale Unternehmen. Persönlich gemacht, in Hamburg. Sie schicken uns Ihre Unterlagen, wir kümmern uns um den Rest.",
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Sitalo Webdesign",
  description:
    "Webdesign für lokale Unternehmen — Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien, Fitnessstudios. Persönlich gemacht, in Hamburg.",
  url: SITE_URL,
  telephone: "+4915224437370",
  email: "info@sitalo.de",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hamburg",
    addressCountry: "DE",
  },
  areaServed: { "@type": "Country", name: "Deutschland" },
  // Keine festen Bürozeiten — „jederzeit erreichbar" wird in
  // schema.org als 24/7 abgebildet. Google zeigt das im Knowledge
  // Panel als „Open 24 hours" → signalisiert hohe Verfügbarkeit
  // für lokale Suchen.
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "€€",
  knowsAbout: [
    "Webdesign",
    "Website-Entwicklung",
    "Lokale Suchmaschinenoptimierung",
    "Responsive Design",
    "Pflegedienst-Website",
    "Arztpraxis-Website",
    "Café-Website",
    "Handwerker-Website",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col pb-20 md:pb-0">
        <ScrollProgress />
        <a
          href="#main"
          className="bg-foreground text-background sr-only z-[100] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        >
          Direkt zum Inhalt
        </a>
        <PageCursorGlow />
        {children}
        <CursorLabel />
        <CommandPalette searchIndex={buildSearchIndex()} />
        <KeyboardChords />
        <ShortcutHelp />
        <KonamiEgg />
        <MobileCtaBar />
        <PlausibleScript />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_LD),
          }}
        />
      </body>
    </html>
  );
}

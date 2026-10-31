import type { Metadata } from "next";
import { Geist_Mono, Cormorant_Garamond, Schibsted_Grotesk } from "next/font/google";

import { CommandPalette } from "@/components/marketing/command-palette";
import { buildSearchIndex } from "@/lib/search-index";
import { KeyboardChords } from "@/components/marketing/keyboard-chords";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { PlausibleScript } from "@/components/marketing/plausible-script";
import { ShortcutHelp } from "@/components/marketing/shortcut-help";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Display: "swap" auf allen Fonts — der Browser nimmt sofort den
// Fallback und tauscht aus, sobald die Web-Font geladen ist. Vermeidet
// FOIT (Flash of Invisible Text), wo Text bis zu 3 s unsichtbar bleibt,
// und damit eine LCP-Verzögerung. Cormorant-Weight 600 raus — wir nutzen
// nur 400 (Headline-Serif) und 400-italic (Akzent-Italic).
// Grundschrift: Schibsted Grotesk — eine Zeitungs-Grotesk aus
// Skandinavien, sachlich mit eigener Handschrift. Bewusst nicht die
// Next.js-Standardschrift Geist, die man von unzähligen Vorlagen kennt.
const brandSans = Schibsted_Grotesk({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  display: "swap",
});

// Mono und Serife stehen nie im ersten Bildschirm — nicht vorladen,
// damit die Grundschrift (größter Text im Hero) zuerst kommt.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

// Alle Seiten stündlich neu rendern (ISR). Masthead, Footer-Jahr,
// Sprechstunden-Termine und freie Bauplätze hängen vom heutigen
// Datum ab — ohne Revalidate würde der Build-Tag eingefroren, bis
// zum nächsten Deploy. Gilt per niedrigstem Wert für jede Route.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description:
    "Websites für lokale Unternehmen. Persönlich gemacht in Hamburg, für Betriebe in ganz Deutschland. Sie schicken uns Ihre Unterlagen, wir kümmern uns um den Rest.",
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  // ProfessionalService: LocalBusiness-Untertyp für Dienstleister ohne
  // Ladengeschäft. Keine Öffnungszeiten — „24/7" stimmte nicht. Für
  // Google Maps zählt das Google-Unternehmensprofil; dessen URL gehört
  // später in sameAs.
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  logo: `${SITE_URL}/icon.png`,
  image: `${SITE_URL}/opengraph-image`,
  name: "Sitalo Webdesign",
  description:
    "Webdesign für lokale Unternehmen — Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien, Fitnessstudios. Persönlich gemacht, in Hamburg.",
  url: SITE_URL,
  telephone: "+491607621876",
  email: "info@sitalo.de",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hamburg",
    addressCountry: "DE",
  },
  areaServed: { "@type": "Country", name: "Deutschland" },
  priceRange: "€€",
  knowsAbout: [
    "Webdesign",
    "Website erstellen lassen",
    "Website-Entwicklung",
    "Lokale Suchmaschinenoptimierung",
    "Responsive Design",
    "Pflegedienst-Website",
    "Arztpraxis-Website",
    "Café-Website",
    "Handwerker-Website",
  ],
};

/**
 * WebSite-Schema mit potentialAction = SearchAction.
 *
 * Aktiviert das Sitelinks-Suchfeld in Google-SERPs für Brand-
 * Suchen nach "sitalo" — User können direkt aus dem Treffer
 * heraus die Site durchsuchen. Wir leiten die Suche auf die
 * Cmd+K-fähige Homepage, die `?q=`-Param liest und die Palette
 * mit vorbefülltem Query öffnet (siehe globale Listener-Logik
 * in der Command-Palette).
 *
 * Wenn `?q=` noch nicht clientseitig ausgewertet wird, schickt
 * Google die Suchanfrage trotzdem — Nutzer sehen die Startseite
 * und können dort manuell Cmd+K öffnen. Auch das ist Mehrwert
 * gegenüber gar keinem Sitelinks-Suchfeld.
 */
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Sitalo Webdesign",
  publisher: { "@id": `${SITE_URL}/#business` },
  inLanguage: "de-DE",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${brandSans.variable} ${geistMono.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col pb-20 md:pb-0">
        <a
          href="#main"
          className="bg-foreground text-background sr-only z-[100] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        >
          Direkt zum Inhalt
        </a>
        {children}
        <CommandPalette searchIndex={buildSearchIndex()} />
        <KeyboardChords />
        <ShortcutHelp />
        <MobileCtaBar />
        <PlausibleScript />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([LOCAL_BUSINESS_LD, WEBSITE_LD]),
          }}
        />
      </body>
    </html>
  );
}

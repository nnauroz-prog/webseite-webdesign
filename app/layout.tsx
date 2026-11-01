import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Doto, IBM_Plex_Mono, Mona_Sans } from "next/font/google";

import { GlobalExtras } from "@/components/marketing/global-extras";
import { buildSearchIndex } from "@/lib/search-index";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { PlausibleScript } from "@/components/marketing/plausible-script";
import "./globals.css";
import "./hafen.css";
import { PAKETE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

// Display: "swap" auf allen Fonts — der Browser nimmt sofort den
// Fallback und tauscht aus, sobald die Web-Font geladen ist. Vermeidet
// FOIT (Flash of Invisible Text) und damit eine LCP-Verzögerung.
//
// Grundschrift: Mona Sans, variabel in Breite und Stärke. Überschriften
// stehen breit und kräftig wie Beschriftungen im Hafen (Containerbrücken,
// Kaischilder), Fließtext in normaler Breite.
const brandSans = Mona_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// IBM Plex Mono für Beschriftungen: Containernummern, Uhrzeit,
// Bildunterschriften – und die H1-Kennzeile im ersten Bildschirm der
// Startseite. Deshalb vorladen: Lighthouse misst diese Zeile als größtes
// Element, ohne Vorladen wartete die Messung auf den späten Schrifttausch.
const brandMono = IBM_Plex_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Punktmatrix nur für die Abfahrtstafel mit den Preisen.
const dotMatrix = Doto({
  variable: "--font-dot",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  preload: false,
});

// Cormorant nur noch für die Wortmarke (SITAL + Doppelring), so wie
// im ursprünglichen Logo.
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  preload: false,
});

// Alle Seiten stündlich neu rendern (ISR). Masthead, Footer-Jahr,
// Sprechstunden-Termine und der nächste buchbare Gesprächstag hängen vom heutigen
// Datum ab — ohne Revalidate würde der Build-Tag eingefroren, bis
// zum nächsten Deploy. Gilt per niedrigstem Wert für jede Route.
export const revalidate = 3600;

/** Browserleiste am Handy (Safari, Chrome) im Elbnebel-Ton der Seite. */
export const viewport: Viewport = {
  themeColor: "#eeeeeb",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sitalo Webdesign",
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description:
    "Website erstellen lassen zum Festpreis ab 499 €: gestaltet und gebaut in Hamburg, für Betriebe in ganz Deutschland. Test-Link vor dem Start.",
  // Grundwerte fürs Teilen; Seiten mit eigenem openGraph ersetzen sie.
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Sitalo Webdesign",
  },
  // Bestätigung für Google Search Console und Bing Webmaster Tools:
  // Den Code aus dem jeweiligen „HTML-Tag“ in Vercel als
  // Umgebungsvariable eintragen, dann neu bereitstellen.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  // ProfessionalService: LocalBusiness-Untertyp für Dienstleister ohne
  // Ladengeschäft. Keine Öffnungszeiten — „24/7" stimmte nicht. Für
  // Google Maps zählt das Google-Unternehmensprofil; dessen URL gehört
  // später in sameAs.
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  logo: `${SITE_URL}/apple-icon`,
  image: `${SITE_URL}/opengraph-image`,
  name: "Sitalo Webdesign",
  slogan: "Wir bauen Websites für Betriebe.",
  description:
    "Webdesign-Büro in Hamburg: Websites zum Festpreis für Pflegedienste, Praxen, Handwerksbetriebe, Cafés, Friseure, Kanzleien, Reinigungsfirmen, Fitnessstudios und Hotels in ganz Deutschland.",
  url: SITE_URL,
  telephone: "+491607621876",
  email: "info@sitalo.de",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hamburg",
    addressCountry: "DE",
  },
  areaServed: [
    { "@type": "City", name: "Hamburg" },
    { "@type": "Country", name: "Deutschland" },
  ],
  priceRange: "ab 499 €",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+491607621876",
    email: "info@sitalo.de",
    contactType: "customer service",
    availableLanguage: "German",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Website-Pakete",
    itemListElement: PAKETE.map((p) => ({
      "@type": "Offer",
      url: `${SITE_URL}/pakete/${p.slug}`,
      priceCurrency: "EUR",
      price: p.setup.replace(/\D/g, ""),
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: Number(p.setup.replace(/\D/g, "")),
        priceCurrency: "EUR",
      },
      itemOffered: {
        "@type": "Service",
        name: `Website-Paket ${p.name}`,
        description: p.description,
      },
    })),
  },
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
 * WebSite-Schema: Name der Website für die Anzeige in Google (statt
 * der Domain). Ohne SearchAction – Google zeigt das Sitelinks-Suchfeld
 * seit Ende 2024 nicht mehr an.
 */
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Sitalo Webdesign",
  publisher: { "@id": `${SITE_URL}/#business` },
  alternateName: ["Sitalo", "sitalo.de"],
  inLanguage: "de-DE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${brandSans.variable} ${brandMono.variable} ${dotMatrix.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col pb-20 md:pb-0">
        <a
          href="#main"
          className="bg-foreground text-background sr-only z-[100] rounded-[2px] px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        >
          Direkt zum Inhalt
        </a>
        {children}
        <GlobalExtras searchIndex={buildSearchIndex()} />
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

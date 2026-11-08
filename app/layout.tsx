import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Doto, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

import { GlobalExtras } from "@/components/marketing/global-extras";
import { buildSearchIndex } from "@/lib/search-index";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { PlausibleScript } from "@/components/marketing/plausible-script";
import "./globals.css";
import "./hafen.css";
// Apple-Bausteine nach den Hafen-Regeln, damit sie diese überstimmen.
import "./apple.css";
import { PAKETE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

// Hausschriften des Ateliers, alle mit display: "swap" und angepasster
// Fallback-Metrik (adjustFontFallback, Standard bei next/font/google),
// damit der Schrifttausch nichts verschiebt (CLS 0).
//
// Mona Sans (SIL Open Font License 1.1), variabel in Breite und Stärke:
// Überschriften breit wie Beschriftungen im Hafen, Fließtext in normaler
// Breite. Selbst gehostet als zugeschnittene Datei (app/fonts): Breite
// 100–125 %, Stärke 400–800, deutsche Zeichen und Satzzeichen. Rund 50
// statt 96 KB. Der große Satz im Kopf der Startseite ist das LCP-Element,
// deshalb wird nur diese eine Datei vorgeladen.
const brandSans = localFont({
  variable: "--font-brand-sans",
  src: "./fonts/mona-sans-atelier.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  adjustFontFallback: "Arial",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

// IBM Plex Mono für Notizen, Kennzeilen, Containernummern und Uhrzeit.
// Nicht vorgeladen: Sie trägt nie das größte Element im ersten Bild.
const brandMono = IBM_Plex_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

// Punktmatrix nur für die Abfahrtstafel mit den Preisen, ohne Vorladen.
const dotMatrix = Doto({
  variable: "--font-dot",
  subsets: ["latin"],
  weight: ["700"],
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

/** Browserleiste am Handy (Safari, Chrome) im Papierton der Seite. */
export const viewport: Viewport = {
  themeColor: "#f3f2ee",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sitalo Webdesign",
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description:
    `Website erstellen lassen zum Festpreis ${PAKETE[0].setup}: gestaltet und gebaut in Hamburg, für Betriebe in ganz Deutschland. Test-Link vor dem Start.`,
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
  alternateName: "Sitalo",
  slogan: "Wir bauen Websites für Betriebe.",
  // Ein Satz, wie ihn KI-Assistenten und Suchmaschinen übernehmen sollen:
  // wer, wo, was, für wen, zu welchem Preis.
  description: `Webdesign-Büro in Hamburg: Wir erstellen Websites zum Festpreis ab ${PAKETE[0].setup.replace(/^ab\s*/, "")} inkl. MwSt. für Betriebe und Selbstständige in ganz Deutschland, etwa Pflegedienste, Praxen, Handwerksbetriebe, Cafés, Friseure, Kanzleien, Reinigungsfirmen, Fitnessstudios und Hotels. Texte, Gestaltung, Hosting und Pflege aus einer Hand.`,
  url: SITE_URL,
  // Verknüpfte Profile (Google-Unternehmensprofil usw.), per Vercel-
  // Umgebungsvariable, durch Komma getrennt. Leer = kein Eintrag.
  ...((process.env.BUSINESS_PROFILE_URLS ?? "").trim()
    ? {
        sameAs: (process.env.BUSINESS_PROFILE_URLS ?? "")
          .split(",")
          .map((u) => u.trim())
          .filter((u) => /^https:\/\//.test(u)),
      }
    : {}),
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
  knowsLanguage: "de",
  priceRange: PAKETE[0].setup,
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
        valueAddedTaxIncluded: true,
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
    "Webseite erstellen",
    "Homepage erstellen lassen",
    "Website-Kosten",
    "Website-Entwicklung",
    "Website-Wartung",
    "Lokale Suchmaschinenoptimierung",
    "Google-Unternehmensprofil",
    "Responsive Design",
    "Barrierefreiheit im Web",
    "DSGVO-konforme Websites",
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
      // Die Startseite setzt html.js per Inline-Script vor dem Hydrieren
      // (components/marketing/hafen/hafen-hero.tsx).
      suppressHydrationWarning
      className={`${brandSans.variable} ${brandMono.variable} ${dotMatrix.variable} ${cormorant.variable} h-full motion-safe:scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-foreground text-background sr-only z-[100] rounded-[2px] px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        >
          Direkt zum Inhalt
        </a>
        {children}
        <GlobalExtras searchIndex={buildSearchIndex()} />
        <MobileCtaBar festpreis={PAKETE[0].setup} />
        <PlausibleScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([LOCAL_BUSINESS_LD, WEBSITE_LD]),
          }}
        />
      </body>
    </html>
  );
}

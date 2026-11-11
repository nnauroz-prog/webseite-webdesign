import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";

import { Effekte } from "@/components/marketing/effekte";
import { Einblenden } from "@/components/marketing/einblenden";
import { Kurztext } from "@/components/marketing/kurztext";
import { SeitenWechsel } from "@/components/marketing/seiten-wechsel";
import { GlobalExtras } from "@/components/marketing/global-extras";
import { buildSearchIndex } from "@/lib/search-index";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { PlausibleScript } from "@/components/marketing/plausible-script";
import "./globals.css";
import "./hafen.css";
// Apple-Bausteine nach den Hafen-Regeln, damit sie diese überstimmen.
import "./apple.css";
import "./effekte-gross.css";
import "./effekte-band.css";
import { PAKETE } from "@/lib/pakete-data";
import { SITE_URL } from "@/lib/site";

// Grundschrift ist die Systemschrift (San Francisco auf iPhone und Mac,
// sonst Segoe UI/Roboto), siehe --font-sf in app/globals.css. Keine
// Web-Font im ersten Bildschirm: Text malt sofort, kein Schrifttausch.
// Nur eine Sonderschrift bleibt (Cormorant für die Wortmarke), ohne
// Vorladen (preload: false). Doto (Punktmatrix der Abfahrtstafel) ist
// entfallen; die Tafel nutzt bei Bedarf die Mono-Systemschrift.

// Cormorant nur noch für die Wortmarke (SITAL + Doppelring), so wie
// im ursprünglichen Logo.
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  preload: false,
});

// IBM Plex Mono nur für kleine Notizen, Labels und Bildunterschriften
// (font-mono, .notiz-mono, .kennzeile-mono). Ein Schnitt, nicht
// vorgeladen: Sie trägt nie das größte Element im ersten Bild.
const brandMono = IBM_Plex_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  // Vorladen: Die Kennzeile über der Botschaft steht in Mono. Ohne
  // Vorladen kommt die Schrift erst spät und verzögert den LCP.
  preload: true,
  adjustFontFallback: true,
});

// Alle Seiten stündlich neu rendern (ISR). Masthead, Footer-Jahr,
// Sprechstunden-Termine und der nächste buchbare Gesprächstag hängen vom heutigen
// Datum ab — ohne Revalidate würde der Build-Tag eingefroren, bis
// zum nächsten Deploy. Gilt per niedrigstem Wert für jede Route.
export const revalidate = 3600;

/** Browserleiste am Handy (Safari, Chrome) weiß wie die Seite. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sitalo Webdesign",
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description: `Website erstellen lassen zum Festpreis ${PAKETE[0].setup}: gestaltet und gebaut in Hamburg, für Betriebe in ganz Deutschland. Test-Link vor dem Start.`,
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
      className={`${cormorant.variable} ${brandMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-foreground text-background focus:ring-foreground/40 sr-only z-[100] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-2 focus:outline-none"
        >
          Direkt zum Inhalt
        </a>
        <SeitenWechsel>{children}</SeitenWechsel>
        <Kurztext />
        <Einblenden />
        <Effekte />
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

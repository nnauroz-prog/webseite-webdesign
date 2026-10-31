import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

import { AmbientTint } from "@/components/marketing/ambient-tint";
import { Beispiele } from "@/components/marketing/beispiele";
import {
  AblaufKompakt,
  SectionHead,
  Voranbringen,
  Vorteile,
} from "@/components/marketing/home-sections";
import { LivePreview } from "@/components/marketing/live-preview";
import { HamburgPanorama } from "@/components/marketing/hamburg-panorama";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
} from "@/components/marketing/ornaments";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { getPaketBySlug } from "@/lib/pakete-data";

export const metadata: Metadata = {
  // Absoluter Titel — sonst hängt das Layout-Template noch ein
  // „· Sitalo" an den ohnehin gebrandeten Home-Titel.
  title: { absolute: "Sitalo — Webdesign aus Hamburg" },
  description:
    "Websites für lokale Unternehmen in ganz Deutschland, gestaltet und gebaut in Hamburg. Persönlich betreut, zum Festpreis, kleine Seiten oft in 1–2 Werktagen.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Webdesign aus Hamburg",
    description:
      "Sie schicken uns Ihre Unterlagen, wir kümmern uns um den Rest. Aus Hamburg, persönlich gemacht.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    // Bild wird automatisch aus app/opengraph-image.tsx übernommen.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitalo — Webdesign aus Hamburg",
    description: "Sie schicken uns Ihre Unterlagen, wir kümmern uns um den Rest.",
    // Bild wird automatisch aus app/opengraph-image.tsx (twitter-image-Variante) übernommen.
  },
};

/**
 * Homepage-Pakete: bewusst KURATIERTE Variante (ohne Beschreibung,
 * 5-Bullet-Liste statt voller contents), aber Preis und Monatsbeitrag
 * werden aus der kanonischen Quelle (lib/pakete-data.ts) gezogen.
 * So gibt's nur eine Stelle, an der Preise geändert werden müssen.
 *
 * Sitalo Studio steht nur auf /pakete.
 */
const PACKAGES = (["starter", "business", "premium"] as const).map((slug) => {
  const p = getPaketBySlug(slug);
  if (!p) throw new Error(`Paket "${slug}" fehlt in lib/pakete-data.ts`);
  return {
    slug,
    name: p.name,
    setup: p.setup,
    monthly: p.monthly,
    badge: p.badge,
    highlight: p.highlight,
    bullets:
      slug === "starter"
        ? [
            "Onepage-Website",
            "Mobil optimiert",
            "Kontaktformular",
            "Google Maps & Direktwahl",
            "Hosting inklusive",
          ]
        : slug === "business"
          ? [
              "Mehrseitige Website",
              "Eigene Bereiche & Galerie",
              "SEO-Grundlagen",
              "Bilder­bearbeitung",
              "Laufende Betreuung",
            ]
          : [
              "Premium-Design",
              "Selbst pflegbare Inhalte",
              "Formularsystem",
              "Erweiterte SEO-Basis",
              "Bevorzugter Support",
            ],
  };
});

const FAQ = [
  {
    q: "Wie schnell ist meine Seite fertig?",
    a: "Wenn Sie uns alle Unterlagen geschickt haben, oft schon nach 1–2 Werktagen. Bei größeren Projekten vereinbaren wir vorab einen verbindlichen Termin.",
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Ihr Logo (falls vorhanden), ein paar Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sagen wir Bescheid und helfen bei Formulierungen.",
  },
  {
    q: "Gibt es laufende Kosten?",
    a: "Ja, für Hosting, Pflege und kleine Änderungen: je nach Paket ab 49 €, 79 € oder 179 € im Monat. Nach sechs Monaten Mindestlaufzeit ist der Vertrag zum Monatsende kündbar. Beim Ausstieg übergeben wir den kompletten Bestand.",
  },
  {
    q: "Kann ich später noch Sachen ändern lassen?",
    a: "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei. Sie schreiben uns kurz, wir setzen es um. Auf Wunsch bauen wir auch Bereiche ein, die Sie selbst pflegen.",
  },
];

// FAQPage-Strukturierte Daten für die fünf Homepage-FAQs.
// Schema.org-FAQPage qualifiziert für Rich-Snippets in Google
// Search Results (Frage + Antwort ausklappbar direkt im SERP).
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <AmbientTint />
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Eine Aufgabe pro Sektion, ein Weg zur Anfrage. Ausführliches
            (Haltung, Grenzen, Werkzeuge, Stadtteile, Atelier-Notizen)
            steht auf den Unterseiten /atelier, /erreichbarkeit,
            /standorte, /jetzt — die Startseite verlinkt dorthin. */}
        <Hero />
        <Vorteile />
        {/* Echte Ergebnisse (Branche + Stadtteil + Zahl) — der
            Vertrauensbeleg direkt nach den Arbeitsproben im Hero. */}
        <RevealOnScroll>
          <Beispiele />
        </RevealOnScroll>
        <RevealOnScroll>
          <Voranbringen />
        </RevealOnScroll>
        <RevealOnScroll>
          <AblaufKompakt />
        </RevealOnScroll>
        <RevealOnScroll>
          <Pricing />
        </RevealOnScroll>
        <RevealOnScroll>
          <Faq />
        </RevealOnScroll>
        <RevealOnScroll>
          <FinalCta />
        </RevealOnScroll>
      </main>
      <MarketingFooter />
    </div>
  );
}

/* ============================================================
 * Hero — editorial, oversized typography, image as canvas
 * ============================================================ */
function Hero() {
  return (
    <section
      id="start"
      className="hero-dolly relative overflow-hidden scroll-mt-20"
    >
      {/* Warmer Gradient-Backdrop für mehr Atmosphäre */}
      {/* Aurora: drei langsam treibende Farbflächen (globals.css) */}
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-dolly-inner mx-auto w-full max-w-6xl px-5 pt-8 pb-6 sm:px-6 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="text-muted-foreground text-[13px] font-medium tracking-wide sm:mt-6">
              Webdesign aus Hamburg
            </p>
            <h1 className="mt-4 text-balance text-[2.6rem] font-semibold leading-[1.0] tracking-[-0.04em] sm:text-[4rem] lg:text-[4.75rem]">
              Websites für Betriebe,{" "}
              <span className="text-muted-foreground">die ihr Handwerk ernst nehmen.</span>
            </h1>
            <p
              className="reveal text-muted-foreground mt-6 max-w-lg text-pretty text-base leading-relaxed sm:mt-9 sm:text-lg"
              style={{ "--reveal-delay": "900ms" } as React.CSSProperties}
            >
              Gestaltet und gebaut in Hamburg, für Unternehmen in ganz
              Deutschland. Sie schicken uns Logo, Bilder und ein paar
              Stichpunkte. Um alles Weitere kümmern wir uns.
            </p>
            <div
              className="reveal mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-9"
              style={{ "--reveal-delay": "1100ms" } as React.CSSProperties}
            >
              <Link
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Website anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pakete"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
              >
                Preise ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Rechte Spalte: Live-Vorschau — Besucher tippen ihren
              Betriebsnamen ein und sehen sofort eine Skizze ihrer Seite. */}
          <div
            className="reveal relative min-w-0"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            <LivePreview />
          </div>
        </div>
      </div>
      {/* Hamburg-Panorama, läuft im Hero-Hintergrund aus */}
      <HamburgPanorama />
    </section>
  );
}

/* ============================================================
 * Pricing — asymmetrischer Magazin-Spread. Business als „Centerfold",
 * Starter + Premium als kleinere flankierende Editorial-Mentions.
 * Bewusst kein gleichmäßiges 3-Karten-Grid (das ist genau das
 * AI-Template-Tell).
 * ============================================================ */
function Pricing() {
  const featured = PACKAGES.find((p) => p.highlight)!;
  const others = PACKAGES.filter((p) => !p.highlight);

  return (
    <section id="pakete" className="border-border/40 border-t scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHead
          label="Pakete & Preise"
          title={
            <>
              Klare Preise. <span className="text-muted-foreground">Keine Überraschungen.</span>
            </>
          }
          link={{ href: "/pakete", text: "Alle Pakete vergleichen" }}
        />

        {/* Magazin-Spread: featured (Business) groß und dunkel zentral,
            die zwei anderen flankieren als schlanke Editorial-Streifen.
            Kein 3-gleicher-Karten-Reflex. */}
        <div className="mt-12 grid grid-cols-2 gap-x-5 lg:mt-16 lg:grid-cols-[1fr_2fr_1fr] lg:gap-6">
          {/* Linker Streifen: Starter */}
          <div className="order-2 lg:order-1">
            <PricingFlanke paket={others[0]} side="left" />
          </div>

          {/* Centerfold: Business */}
          <div className="order-1 col-span-2 lg:order-2 lg:col-span-1">
            <div id={featured.slug} className="h-full">
              <PricingCenterfold paket={featured} />
            </div>
          </div>

          {/* Rechter Streifen: Premium */}
          <div className="order-3">
            <PricingFlanke paket={others[1]} side="right" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Sub-Komponenten für die asymmetrische Pricing-Sektion. */

/** Schmaler flankierender Streifen für Starter / Premium —
 *  bewusst nicht als „Karte" gestaltet, sondern als Editorial-
 *  Spalte mit Hairline-Trennung. */
function PricingFlanke({
  paket,
  side,
}: {
  paket: (typeof PACKAGES)[number];
  side: "left" | "right";
}) {
  return (
    <div
      id={paket.slug}
      className={
        side === "left"
          ? "border-border/60 lg:border-r flex h-full flex-col px-1 py-6 sm:p-8 lg:pr-10"
          : "border-border/60 lg:border-l flex h-full flex-col px-1 py-6 sm:p-8 lg:pl-10"
      }
    >
      <p className="text-muted-foreground text-[13px] font-medium">
        {paket.name}
      </p>
      <p className="serif text-foreground mt-3 text-[1.9rem] font-normal leading-none tracking-[-0.025em] sm:mt-4 sm:text-5xl">
        {paket.setup}
      </p>
      <p className="text-muted-foreground mt-2 text-[13px]">
        einmalig · zzgl. {paket.monthly}
      </p>
      <ul className="mt-5 space-y-2 text-[13.5px] sm:mt-7 sm:space-y-2.5">
        {paket.bullets.slice(0, 3).map((b) => (
          <li
            key={b}
            className="text-foreground/80 flex items-baseline gap-2.5"
          >
            <span className="bg-ink-olive mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6 sm:pt-8">
        <Link
          href={`/anfrage?paket=${paket.slug}`}
          className="text-foreground inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
        >
          {paket.name} anfragen
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/** Centerfold für die empfohlene Variante (Business) — dunkel,
 *  groß, magazin-aufmacher-style. Asymmetrisch gegen die zwei
 *  schlanken Flanken gesetzt. */
function PricingCenterfold({
  paket,
}: {
  paket: (typeof PACKAGES)[number];
}) {
  return (
    <div className="bg-foreground text-background relative flex h-full flex-col overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12">

      <div className="relative flex items-center gap-3">
        <span className="text-background/60 text-[13px] font-medium">
          {paket.badge ?? paket.name}
        </span>
      </div>

      <div className="relative mt-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <p className="serif text-background text-6xl font-normal leading-none tracking-[-0.03em] sm:text-7xl lg:text-[5.5rem]">
          {paket.setup}
        </p>
        <p className="text-background/60 text-base">
          einmalig
          <br className="hidden sm:block" />
          <span className="text-background/85"> + {paket.monthly}</span>
        </p>
      </div>


      <ul className="relative mt-8 grid gap-2.5 text-[14px] sm:grid-cols-2 sm:gap-x-6">
        {paket.bullets.map((b) => (
          <li
            key={b}
            className="text-background/90 flex items-baseline gap-2.5"
          >
            <span className="bg-gold/80 mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/anfrage?paket=${paket.slug}`}
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          {paket.name} anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link
          href={`/pakete/${paket.slug}`}
          data-cursor-label={`${paket.name} im Detail →`}
          className="text-background/85 hover:text-background inline-flex h-12 items-center text-[14px] font-medium underline-offset-4 hover:underline"
        >
          {paket.name} im Detail
        </Link>
      </div>
    </div>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <SectionHead label="Fragen" title="Häufige Fragen." link={{ href: "/faq", text: "Alle Fragen" }} />
        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-8">
          <dl className="divide-border/70 border-border/70 divide-y border-y lg:col-span-9 lg:col-start-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.01em] sm:text-xl">
                  {item.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="text-muted-foreground mt-4 max-w-2xl text-[15px] leading-relaxed text-pretty">
                  {item.a}
                </p>
              </details>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * FinalCta — quiet but confident closer
 * ============================================================ */
function FinalCta() {
  return (
    <section
      id="kontakt"
      className="bg-foreground text-background relative overflow-hidden scroll-mt-20"
    >
      {/* Cursor-aware Gold-Spotlight — bringt Bewegung in den
          ansonsten ruhigen Closer. Auf Touch unsichtbar. */}
      {/* Mehrere weiche Halos für editoriale Tiefe */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div>
          <div>
            <h2 className="serif text-balance text-4xl font-normal leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
              Schreiben Sie uns.{" "}
              <span className="serif-italic text-background/70">
                Wir melden uns persönlich.
              </span>
            </h2>
            <p className="text-background/70 mt-10 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
              Drei Felder, zwei Minuten. Kostenlos und unverbindlich.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/anfrage"
                className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Website anfragen
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:+491607621876"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-all"
              >
                Anrufen
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

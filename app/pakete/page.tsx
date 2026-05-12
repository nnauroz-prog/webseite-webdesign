import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Pakete & Preise | Sitalo Webdesign",
  description:
    "Drei Wege, Ihre Seite zu bekommen. Einmalige Erstellung plus fairer Monatsbeitrag — keine versteckten Kosten.",
  alternates: { canonical: "/pakete" },
};

type Package = {
  slug: "starter" | "business" | "premium";
  name: string;
  setup: string;
  monthly: string;
  description: string;
  highlight?: boolean;
  badge?: string;
  whoFor: string;
  contents: string[];
  examples: string[];
  limits: string[];
};

const PACKAGES: Package[] = [
  {
    slug: "starter",
    name: "Starter",
    setup: "ab 499 €",
    monthly: "ab 49 € / Monat",
    description:
      "Eine moderne Seite, alles Wichtige auf einen Blick. Perfekt für Einzelunternehmer und kleine Betriebe.",
    whoFor:
      "Für Selbstständige und kleine Betriebe, die schnell professionell auftreten wollen — ohne mehrseitige Struktur, ohne komplexe Funktionen.",
    contents: [
      "Moderne Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular mit Spam-Schutz",
      "WhatsApp-Button",
      "Google Maps & Öffnungszeiten",
      "Impressum & Datenschutz-Bereich",
      "Hosting in der EU",
      "Bis zu 1 kleine Änderung pro Monat",
    ],
    examples: [
      "Selbstständiger Handwerker mit Einsatzgebiet",
      "Kleines Café mit Öffnungszeiten",
      "Coach oder Berater mit Leistungen und Kontakt",
      "Friseur:in mit Galerie und Termin-Anfrage",
    ],
    limits: [
      "Keine mehrseitige Struktur",
      "Keine verwaltbaren Inhalte",
      "Maximal 1 Änderungsrunde pro Monat",
    ],
  },
  {
    slug: "business",
    name: "Business",
    badge: "Empfohlen",
    highlight: true,
    setup: "ab 899 €",
    monthly: "ab 79 € / Monat",
    description:
      "Mehrere Sektionen, Team, Leistungen, Galerie. Für lokale Unternehmen, die professionell auftreten wollen.",
    whoFor:
      "Für etablierte lokale Unternehmen mit mehreren Leistungen, einem Team und dem Bedarf, sich seriös zu präsentieren.",
    contents: [
      "Hochwertige Mehrseiten-Website",
      "Bis zu 5 Sektionen / Unterseiten",
      "Team-Bereich mit Fotos",
      "Leistungen mit detaillierter Beschreibung",
      "Galerie mit Lightbox",
      "SEO-Grundlagen + Sitemap",
      "Bilderaufbereitung inklusive",
      "Bis zu 3 kleine Änderungen pro Monat",
    ],
    examples: [
      "Pflegedienst mit Leistungen, Team und Bewerbungsformular",
      "Arztpraxis mit Sprechzeiten und Termin-Anfrage",
      "Handwerksbetrieb mit Referenz-Galerie",
      "Kanzlei mit Rechtsgebieten und Team",
    ],
    limits: [
      "Verwaltbare Inhalte gehören in Premium",
      "Online-Buchung gehört in Premium",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    description:
      "Individuelle Struktur mit Bereichen, die Sie selbst pflegen — Speisekarte, Wochenangebot, Termine.",
    whoFor:
      "Für Unternehmen mit häufig wechselnden Inhalten oder besonderen Anforderungen — Gastro, Studios, Beratungen mit Online-Buchung.",
    contents: [
      "Premium-Design",
      "Individuelle Website-Struktur",
      "Verwaltbare Inhalte auf Wunsch",
      "Speisekarte / Wochenangebot selbst änderbar",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Stärkere SEO-Basis",
      "Erweiterte Wartung",
      "Bis zu 6 kleine Änderungen pro Monat",
    ],
    examples: [
      "Café mit täglich wechselndem Mittagstisch",
      "Friseur mit Online-Termin-Buchung",
      "Pflegedienst mit Bewerbungsformular und News",
      "Restaurant mit Speisekarte und Wochenangebot",
    ],
    limits: [
      "Eigene Apps oder Shop-Systeme werden im Einzelfall besprochen",
    ],
  },
];

export default function PaketePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <Packages />
        <PricingDisclaimer />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
            Klare Pakete.
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Faire Einstiegspreise.
            </span>
          </h1>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
            Einmalige Erstellung, danach ein fairer Monatsbeitrag für
            Hosting, Pflege und kleine Änderungen. Keine versteckten Kosten.
          </p>
        </div>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <ol className="divide-border/60 divide-y">
          {PACKAGES.map((p) => (
            <li
              key={p.slug}
              className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.6fr] lg:gap-20"
            >
              <div>
                {p.badge ? (
                  <span className="bg-gold/90 text-foreground inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                    {p.badge}
                  </span>
                ) : null}
                <h2 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-[-0.035em] sm:text-6xl">
                  {p.name}
                </h2>
                <div className="mt-8">
                  <p className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                    {p.setup}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    einmalig · + {p.monthly}
                  </p>
                </div>
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className="bg-foreground text-background hover:bg-foreground/90 group mt-10 inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
                >
                  {p.name} anfragen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div>
                <p className="text-foreground/80 max-w-xl text-pretty text-lg leading-relaxed">
                  {p.description}
                </p>
                <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-[15px] leading-relaxed">
                  {p.whoFor}
                </p>

                <div className="mt-10 grid gap-12 sm:grid-cols-2">
                  <PackageColumn title="Was enthalten ist" items={p.contents} />
                  <PackageColumn
                    title="Typische Beispiele"
                    items={p.examples}
                  />
                </div>
                <div className="border-border/60 mt-12 border-t pt-8">
                  <PackageColumn
                    title="Was nicht in diesem Paket ist"
                    items={p.limits}
                    muted
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PackageColumn({
  title,
  items,
  muted,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div>
      <h3 className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]">
        {title}
      </h3>
      <ul className="divide-border/60 mt-4 divide-y">
        {items.map((item) => (
          <li
            key={item}
            className={
              muted
                ? "text-muted-foreground flex items-baseline gap-3 py-2 text-[14px] leading-relaxed"
                : "text-foreground/85 flex items-baseline gap-3 py-2 text-[15px] leading-relaxed"
            }
          >
            <span className="text-muted-foreground/60 font-mono text-xs">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingDisclaimer() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
          Hinweis
        </p>
        <h2 className="text-foreground/90 mt-6 max-w-3xl text-balance text-2xl font-semibold leading-[1.25] tracking-[-0.02em] sm:text-3xl lg:text-4xl">
          Die genannten Preise sind{" "}
          <span className="serif-italic text-muted-foreground font-normal">
            Einstiegspreise.
          </span>{" "}
          Der finale Preis hängt vom Umfang ab — Sie bekommen nach Ihrer
          Anfrage eine klare, verbindliche Einschätzung.
        </h2>
        <p className="text-muted-foreground mt-6 max-w-2xl text-[15px] leading-relaxed">
          Alle Preise zzgl. MwSt. · Monatliche Betreuung jederzeit zum
          Monatsende kündbar · Mindestlaufzeit 6 Monate.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute top-10 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
        <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Unsicher, welches Paket
          <br />
          <span className="serif-italic text-background/70 font-normal">
            zu Ihnen passt?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Wählen Sie im Formular „Ich bin unsicher" — ich melde mich
          persönlich und schlage Ihnen das passende Paket vor.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="serif-italic text-background/80 mt-12 text-xl">
          — Nadim Nauroz, Hamburg
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Pakete & Preise — Websites ab 499 € | Sitalo Hamburg",
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
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 text-center sm:pt-28 sm:pb-16 lg:pt-36">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Pakete & Preise
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">
          Drei Wege.
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            Ein Ergebnis.
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
          Einmalige Erstellung, dann ein fairer Monatsbeitrag. Was Sie
          nicht brauchen, zahlen Sie nicht.
        </p>
        {/* Anchor strip — quick jumps */}
        <nav className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {PACKAGES.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="border-border/70 text-foreground/70 hover:border-foreground hover:text-foreground inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
            >
              <span>{p.name}</span>
              <span className="text-muted-foreground/70">·</span>
              <span className="text-muted-foreground/70">{p.setup}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <>
      {PACKAGES.map((p, i) => {
        const dark = p.highlight;
        const tinted = i === 2; // Premium — cream-warm tint
        return (
          <section
            key={p.slug}
            id={p.slug}
            className={
              dark
                ? "bg-foreground text-background relative overflow-hidden scroll-mt-16"
                : tinted
                  ? "bg-accent/40 border-border/40 border-t scroll-mt-16"
                  : "border-border/40 border-t scroll-mt-16"
            }
          >
            {dark ? (
              <div
                aria-hidden="true"
                className="bg-gold/15 pointer-events-none absolute -top-20 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-3xl"
              />
            ) : null}
            <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
              <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span
                      className={
                        dark
                          ? "serif text-background/30 text-[5rem] font-normal leading-none tracking-[-0.04em]"
                          : "serif text-foreground/20 text-[5rem] font-normal leading-none tracking-[-0.04em]"
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.badge ? (
                      <span className="bg-gold/90 text-foreground inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
                        {p.badge}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-6 text-6xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                    {p.name}
                  </h2>
                  <p
                    className={
                      dark
                        ? "text-background/85 mt-8 max-w-xl text-pretty text-xl leading-relaxed"
                        : "text-foreground/80 mt-8 max-w-xl text-pretty text-xl leading-relaxed"
                    }
                  >
                    {p.description}
                  </p>

                  <div
                    className={
                      dark
                        ? "border-background/20 mt-12 border-t pt-8"
                        : "border-border/60 mt-12 border-t pt-8"
                    }
                  >
                    <p className="text-5xl font-semibold tracking-[-0.025em] sm:text-6xl">
                      {p.setup}
                    </p>
                    <p
                      className={
                        dark
                          ? "text-background/65 mt-2 text-base"
                          : "text-muted-foreground mt-2 text-base"
                      }
                    >
                      einmalig · + {p.monthly}
                    </p>
                    <div className="mt-8">
                      <Link
                        href={`/anfrage?paket=${p.slug}`}
                        className={
                          dark
                            ? "bg-background text-foreground hover:bg-background/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
                            : "bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
                        }
                      >
                        {p.name} anfragen
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="lg:pt-12">
                  <p
                    className={
                      dark
                        ? "text-background/65 text-[11px] font-medium uppercase tracking-[0.25em]"
                        : "text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]"
                    }
                  >
                    Für wen
                  </p>
                  <p
                    className={
                      dark
                        ? "text-background/90 mt-4 max-w-md text-[15px] leading-relaxed"
                        : "text-foreground/80 mt-4 max-w-md text-[15px] leading-relaxed"
                    }
                  >
                    {p.whoFor}
                  </p>

                  <div className="mt-12">
                    <PackageColumn
                      title="Was enthalten ist"
                      items={p.contents}
                      dark={dark}
                    />
                  </div>
                  <div className="mt-12">
                    <PackageColumn
                      title="Typische Beispiele"
                      items={p.examples}
                      dark={dark}
                    />
                  </div>
                  <div className="mt-12">
                    <PackageColumn
                      title="Nicht in diesem Paket"
                      items={p.limits}
                      dark={dark}
                      muted
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

function PackageColumn({
  title,
  items,
  muted,
  dark,
}: {
  title: string;
  items: string[];
  muted?: boolean;
  dark?: boolean;
}) {
  const labelClass = dark
    ? "text-background/55 text-[11px] font-medium uppercase tracking-[0.22em]"
    : "text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]";
  const itemClass = muted
    ? dark
      ? "text-background/55 flex items-baseline gap-3 py-2 text-[14px] leading-relaxed"
      : "text-muted-foreground flex items-baseline gap-3 py-2 text-[14px] leading-relaxed"
    : dark
      ? "text-background/90 flex items-baseline gap-3 py-2 text-[15px] leading-relaxed"
      : "text-foreground/85 flex items-baseline gap-3 py-2 text-[15px] leading-relaxed";
  const dividerClass = dark ? "divide-background/15" : "divide-border/60";
  return (
    <div>
      <h3 className={labelClass}>{title}</h3>
      <ul className={`mt-4 divide-y ${dividerClass}`}>
        {items.map((item) => (
          <li key={item} className={itemClass}>
            <span
              className={
                dark
                  ? "text-background/50 font-mono text-xs"
                  : "text-muted-foreground/60 font-mono text-xs"
              }
            >
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
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <p className="text-foreground/75 text-pretty text-base leading-relaxed sm:text-lg">
          Die genannten Preise sind{" "}
          <span className="serif-italic text-foreground font-medium">
            Einstiegspreise
          </span>
          . Der finale Preis hängt vom Umfang ab — Sie bekommen nach Ihrer
          Anfrage eine klare, verbindliche Einschätzung.
        </p>
        <p className="text-muted-foreground mt-4 text-sm">
          Alle Preise zzgl. MwSt. · Monatliche Betreuung jederzeit zum
          Monatsende kündbar · Mindestlaufzeit 6 Monate.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Unsicher?
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Ich empfehle Ihnen
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                das passende Paket.
              </span>
            </h2>
          </div>
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 shrink-0 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

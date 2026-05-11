import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Pakete & Preise | Sitalo Webdesign",
  description:
    "Transparente Einstiegspreise für professionelle Websites — Starter, Business und Premium-System.",
  alternates: { canonical: "/pakete" },
};

type Package = {
  slug: "starter" | "business" | "premium";
  name: string;
  badge: string;
  setup: string;
  monthly: string;
  description: string;
  highlight?: boolean;
  whoFor: string;
  contents: string[];
  examples: string[];
  limits: string[];
};

const PACKAGES: Package[] = [
  {
    slug: "starter",
    name: "Starter-Projekt",
    badge: "Schnell online",
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
      "Impressum & Datenschutz-Bereich (Texte vom Kunden)",
      "Hosting in der EU",
      "Bis zu 1 kleine Änderung pro Monat",
    ],
    examples: [
      "Selbstständiger Handwerker mit Einsatzgebiet",
      "Kleines Café mit Öffnungszeiten und Speisekarten-PDF",
      "Coach oder Berater mit Leistungen und Kontakt",
      "Friseur:in mit Galerie und Termin-Anfrage",
    ],
    limits: [
      "Keine mehrseitige Struktur",
      "Keine verwaltbaren Inhalte (Speisekarte etc. erfordert das Premium-System)",
      "Maximal 1 monatliche Änderungsrunde inkl.",
    ],
  },
  {
    slug: "business",
    name: "Business-Auftritt",
    badge: "Beliebteste Wahl",
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
      "Kontaktformular & WhatsApp",
      "Bis zu 3 kleine Änderungen pro Monat",
      "Persönlicher Ansprechpartner",
    ],
    examples: [
      "Pflegedienst mit Leistungen, Team und Bewerbungsformular",
      "Arztpraxis mit Sprechzeiten, Behandlungen und Termin-Anfrage",
      "Handwerksbetrieb mit Referenz-Galerie und Anfragen",
      "Kanzlei mit Rechtsgebieten und Team",
    ],
    limits: [
      "Verwaltbare Inhalte sind nicht enthalten — kommt im Premium-System",
      "Online-Buchung / Reservierung erfordert das Premium-System",
    ],
  },
  {
    slug: "premium",
    name: "Premium-System",
    badge: "Mit verwaltbaren Inhalten",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    description:
      "Individuelle Website-Struktur mit verwaltbaren Inhalten direkt auf Ihrer Seite. Speisekarte, Wochenangebot, Termine — Sie pflegen, was Sie pflegen wollen.",
    whoFor:
      "Für Unternehmen mit häufig wechselnden Inhalten oder besonderen Anforderungen — Gastro, Studios, Beratungen mit Online-Buchung.",
    contents: [
      "Premium-Design",
      "Individuelle Website-Struktur",
      "Verwaltbare Inhalte auf Wunsch",
      "Speisekarte / Wochenangebot / Leistungen selbst änderbar",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Stärkere SEO-Basis",
      "Erweiterte Wartung",
      "Bis zu 6 kleine Änderungen pro Monat",
      "Prioritäts-Support",
    ],
    examples: [
      "Café mit täglich wechselndem Mittagstisch",
      "Friseur mit Online-Termin-Buchung",
      "Pflegedienst mit Bewerbungsformular und News-Bereich",
      "Restaurant mit Speisekarte und Wochenangebot",
    ],
    limits: [
      "Spezielle Funktionen wie eigene Apps oder Shop-Systeme werden im Einzelfall besprochen",
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
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
          Pakete & Preise
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
          Klare Pakete. Faire Einstiegspreise.
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
          Einmalige Erstellung + monatliche Betreuung. Hosting, Updates und
          kleinere Änderungen sind enthalten — keine versteckten Kosten.
        </p>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <section className="border-border/40 border-b py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <ul className="space-y-10 sm:space-y-14">
          {PACKAGES.map((p) => (
            <li
              key={p.slug}
              className={`relative rounded-3xl border-2 p-6 shadow-sm sm:p-9 ${
                p.highlight
                  ? "border-foreground bg-foreground/[0.02] shadow-xl ring-2 ring-foreground/15"
                  : "border-border/60 bg-card"
              }`}
            >
              {p.highlight ? (
                <span className="bg-primary text-primary-foreground absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-md">
                  {p.badge}
                </span>
              ) : (
                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                  {p.badge}
                </p>
              )}

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                  {p.name}
                </h2>
                <div>
                  <p className="text-2xl font-semibold tracking-tight sm:text-right">
                    {p.setup}
                  </p>
                  <p className="text-muted-foreground sm:text-right">
                    einmalig · + {p.monthly}
                  </p>
                </div>
              </div>

              <p className="text-foreground/85 mt-4 text-[15px] leading-relaxed">
                {p.description}
              </p>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                <div>
                  <h3 className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                    Für wen
                  </h3>
                  <p className="text-foreground/85 mt-2 text-sm leading-relaxed">
                    {p.whoFor}
                  </p>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                    Was enthalten ist
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.contents.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="text-emerald-600 mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="text-foreground/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                    Typische Beispiele
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.examples.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="bg-primary mt-2 inline-block h-1 w-1 shrink-0 rounded-full" />
                        <span className="text-foreground/85">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                    Grenzen des Pakets
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {p.limits.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Minus className="text-muted-foreground/60 mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="text-foreground/75">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
                >
                  {p.name} anfragen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PricingDisclaimer() {
  return (
    <section className="bg-secondary/30 border-border/40 border-b py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <p className="text-foreground/85 text-pretty text-base leading-relaxed sm:text-lg">
          Die genannten Preise sind <strong>Einstiegspreise</strong>. Der finale
          Preis hängt vom Umfang, vorhandenen Inhalten und gewünschten
          Funktionen ab. Nach Ihrer Anfrage erhalten Sie eine klare Einschätzung.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Alle Preise zzgl. MwSt. · Monatliche Betreuung jederzeit zum
          Monatsende kündbar · Mindestlaufzeit 6 Monate.
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          Unsicher, welches Paket passt?
        </h2>
        <p className="text-background/70 mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg">
          Wählen Sie im Anfrage-Formular „Ich bin unsicher" — wir empfehlen
          Ihnen das passende Paket nach Ihrer Anfrage.
        </p>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
        >
          Anfrage starten
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

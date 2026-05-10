import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Preise — Sitalo Webdesign",
  description:
    "Klare Pakete für lokale Unternehmen. Einmalige Erstellung + monatliche Betreuung. Sie liefern die Daten, wir bauen Ihre Website.",
  alternates: { canonical: "/pricing" },
};

const PACKAGES = [
  {
    slug: "starter",
    name: "Starter-Projekt",
    badge: "Für kleine Betriebe",
    setup: "499 €",
    monthly: "49 €",
    cta: "Starter anfragen",
    description:
      "Eine moderne Seite, alles Wichtige auf einen Blick. Perfekt, um schnell professionell auftreten zu können.",
    bullets: [
      "Moderne Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular",
      "WhatsApp-Button",
      "Google Maps-Einbettung",
      "Öffnungszeiten",
      "Impressum & Datenschutz",
      "Hosting inklusive",
      "Bis zu 1 kleine Änderung pro Monat",
    ],
  },
  {
    slug: "business",
    name: "Business-Auftritt",
    badge: "Beliebteste Wahl",
    highlight: true,
    setup: "899 €",
    monthly: "79 €",
    cta: "Business anfragen",
    description:
      "Mehrere professionelle Sektionen. Für Unternehmen, die mehr brauchen als einen Onepager.",
    bullets: [
      "Hochwertige Mehrseiten-Website",
      "Bis zu 5 Sektionen / Unterseiten",
      "Team-Bereich mit Fotos",
      "Leistungen mit Beschreibung",
      "Galerie mit Lightbox",
      "SEO-Grundlagen + Sitemap",
      "Bilderaufbereitung inklusive",
      "Kontaktformular & WhatsApp",
      "Bis zu 3 kleine Änderungen pro Monat",
      "Persönlicher Ansprechpartner",
    ],
  },
  {
    slug: "premium",
    name: "Premium-System",
    badge: "Mit Kundenbereich",
    setup: "1.499 €",
    monthly: "129 €",
    cta: "Premium anfragen",
    description:
      "Premium-Design mit Kundenbereich. Sie pflegen Speisekarte, Wochenangebot oder Termine selbst.",
    bullets: [
      "Premium-Design",
      "Individuelle Anpassung",
      "Kundenbereich (Login)",
      "Selbst pflegbare Inhalte",
      "Speisekarte / Wochenangebot",
      "Online-Buchung mit Bestätigung",
      "Bewerbungsformular",
      "Stärkere SEO-Basis",
      "Erweiterte Wartung",
      "Bis zu 6 kleine Änderungen pro Monat",
      "Prioritäts-Support",
    ],
  },
];

const COMPARISON_ROWS: Array<{
  feature: string;
  values: [string | boolean, string | boolean, string | boolean];
}> = [
  { feature: "Onepage-Website", values: [true, true, true] },
  { feature: "Mehrseiten-Website", values: [false, true, true] },
  { feature: "Team-Bereich", values: [false, true, true] },
  { feature: "Leistungen mit Beschreibung", values: [false, true, true] },
  { feature: "Galerie mit Lightbox", values: [false, true, true] },
  { feature: "Kontaktformular", values: [true, true, true] },
  { feature: "WhatsApp-Button", values: [true, true, true] },
  { feature: "Google Maps", values: [true, true, true] },
  { feature: "SEO-Grundlagen", values: ["—", true, "Stark"] },
  { feature: "Bilderaufbereitung", values: [false, true, true] },
  { feature: "Kundenbereich (Login)", values: [false, false, true] },
  { feature: "Speisekarte / Wochenangebot", values: [false, false, true] },
  { feature: "Online-Buchung", values: [false, false, true] },
  { feature: "Bewerbungsformular", values: [false, true, true] },
  {
    feature: "Änderungen pro Monat (inkl.)",
    values: ["1", "3", "6"],
  },
  { feature: "Hosting & Wartung", values: [true, true, true] },
  { feature: "Persönlicher Ansprechpartner", values: [false, true, true] },
  { feature: "Prioritäts-Support", values: [false, false, true] },
];

const FAQ = [
  {
    question: "Sind die Preise verbindlich?",
    answer:
      "Die hier genannten Preise sind unsere Standardpakete. Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und gewünschten Sonderfunktionen ab. Sie erhalten vor Auftragserteilung immer ein verbindliches Angebot.",
  },
  {
    question: "Was passiert, wenn ich die Website kündige?",
    answer:
      "Die monatliche Betreuung ist immer zum Monatsende kündbar. Die einmalige Erstellung wird nicht erstattet, da die Arbeit bereits geleistet wurde. Auf Wunsch übergeben wir Ihnen die Inhalte in einem üblichen Format.",
  },
  {
    question: "Brauche ich ein eigenes Hosting?",
    answer:
      "Nein. Hosting ist im monatlichen Beitrag enthalten. Sie brauchen sich um nichts zu kümmern.",
  },
  {
    question: "Was ist mit der Domain?",
    answer:
      "Eine .de-Domain pro Website ist im Preis enthalten. Falls Sie eine spezielle Domain (z.B. .com, .eu) wünschen, klären wir die Mehrkosten vorab.",
  },
  {
    question: "Kann ich später wechseln?",
    answer:
      "Ja. Ein Upgrade vom Starter ins Business- oder Premium-Paket ist jederzeit möglich. Wir verrechnen nur den Aufpreis.",
  },
  {
    question: "Was kosten zusätzliche Änderungen?",
    answer:
      "Innerhalb der monatlichen Inklusiv-Änderungen: kostenfrei. Darüber hinaus rechnen wir nach Aufwand (typisch 60–90 € pro Stunde) — Sie erhalten vorher immer eine Schätzung.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <Hero />
        <Packages />
        <ComparisonTable />
        <FaqSection />
        <FinalCta />
      </main>

      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]">
          Preise
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Klare Pakete. Faire Preise.
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
    <section className="border-border/40 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <ul className="grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li
              key={p.name}
              className={`flex flex-col rounded-2xl border p-7 shadow-sm sm:p-8 ${
                p.highlight
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card"
              }`}
            >
              <div>
                <p
                  className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                    p.highlight ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  {p.badge}
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {p.name}
                </h2>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-semibold tracking-tight">
                  ab {p.setup}
                </p>
                <p
                  className={`text-sm ${
                    p.highlight ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  einmalig
                </p>
                <p className="mt-3 text-base font-medium">
                  + ab {p.monthly}
                  <span
                    className={`ml-1 text-sm font-normal ${
                      p.highlight ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    / Monat
                  </span>
                </p>
              </div>
              <p
                className={`mt-5 text-sm leading-relaxed ${
                  p.highlight ? "text-background/85" : "text-muted-foreground"
                }`}
              >
                {p.description}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        p.highlight ? "text-background" : "text-emerald-600"
                      }`}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className={`inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight transition-colors ${
                    p.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm">
          Preise zzgl. MwSt. · Monatliche Betreuung jederzeit zum Monatsende
          kündbar · Mindestlaufzeit 6 Monate
        </p>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="bg-secondary/20 border-border/40 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Im Detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Was ist in welchem Paket dabei?
          </h2>
        </header>

        <div className="bg-card mt-12 overflow-hidden rounded-2xl border shadow-sm">
          <div className="bg-muted/40 grid grid-cols-[1.4fr_repeat(3,1fr)] border-b">
            <div className="p-4 text-sm font-medium">Funktion</div>
            <ColHeader label="Starter" />
            <ColHeader label="Business" highlight />
            <ColHeader label="Premium" />
          </div>
          <div className="divide-y">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1.4fr_repeat(3,1fr)] text-sm"
              >
                <div className="text-foreground/85 p-4 font-medium">
                  {row.feature}
                </div>
                <Cell value={row.values[0]} />
                <Cell value={row.values[1]} highlight />
                <Cell value={row.values[2]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ColHeader({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border-l p-4 text-center ${
        highlight ? "bg-foreground/[0.02]" : ""
      }`}
    >
      <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.18em]">
        {label}
      </span>
    </div>
  );
}

function Cell({
  value,
  highlight,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border-l p-4 text-center text-sm ${
        highlight ? "bg-foreground/[0.02] font-medium" : ""
      }`}
    >
      {value === true ? (
        <Check className="text-emerald-600 mx-auto h-4 w-4" />
      ) : value === false ? (
        <Minus className="text-muted-foreground/40 mx-auto h-4 w-4" />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section className="border-border/40 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-6">
        <header className="text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Fragen zu den Paketen
          </h2>
        </header>
        <dl className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="bg-card border-border/60 group rounded-xl border p-5 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {item.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed text-pretty">
                {item.answer}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background py-20 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
          Welches Paket passt zu Ihnen?
        </h2>
        <p className="text-background/70 mx-auto mt-5 max-w-xl text-pretty text-lg">
          Schicken Sie uns eine kurze Anfrage — wir empfehlen das passende Paket
          und nennen Ihnen einen verbindlichen Preis.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="text-background/80 hover:text-background inline-flex h-12 items-center justify-center px-4 text-sm"
          >
            Bestehender Kunde? Einloggen
          </Link>
        </div>
      </div>
    </section>
  );
}

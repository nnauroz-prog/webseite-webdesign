import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { HeroMockups } from "@/components/marketing/hero-mockups";
import { IndustryPicker } from "@/components/marketing/industry-picker";
import { VerwaltbareInhalteSection } from "@/components/marketing/verwaltbare-inhalte-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { BaukastenComparison } from "@/components/marketing/baukasten-comparison";

export const metadata: Metadata = {
  title: "Sitalo — Ihre professionelle Website. Fertig in 48 Stunden.",
  description:
    "Sitalo erstellt Websites für lokale Unternehmen — schnell, persönlich, ohne Baukasten-Stress. Sie liefern Logo, Bilder und Texte. Wir übernehmen den Rest.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Ihre professionelle Website. Fertig in 48 Stunden.",
    description:
      "Wir bauen Ihre Website fertig — keine Technik, kein Stress. In 1–2 Werktagen online.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
  },
};

const TRUST_LINE = [
  "Keine Registrierung nötig",
  "Persönliche Umsetzung",
  "Mobil optimiert",
  "Für lokale Unternehmen",
];

const TRUST_BAR = [
  { label: "48h Umsetzung möglich", icon: "clock" as const },
  { label: "Persönlicher Ansprechpartner", icon: "user" as const },
  { label: "Keine Registrierung nötig", icon: "check" as const },
  { label: "Mobil optimiert", icon: "device" as const },
];

const PROBLEMS = [
  "Veraltete Website, die niemand mehr besucht",
  "Mobil sieht alles kaputt aus",
  "Keine Zeit, sich mit Baukästen zu beschäftigen",
  "Kontakt-Formular geht ins Nichts oder existiert gar nicht",
  "Bei Google nicht zu finden",
  "Baukasten angefangen, Projekt liegt seit Monaten halb fertig",
];

const SOLUTIONS = [
  {
    icon: ImageIcon,
    title: "Onepager & Mehrseitige Sites",
    body: "Vom kompakten Onepager bis zur vollständigen Unternehmens-Website mit Team, Leistungen und Galerie.",
  },
  {
    icon: MessageCircle,
    title: "Kontakt, WhatsApp, Maps",
    body: "Anfragen kommen direkt aufs Handy. WhatsApp-Knopf, Google-Maps-Einbettung, Öffnungszeiten — alles drin.",
  },
  {
    icon: Sparkles,
    title: "SEO & Hosting inklusive",
    body: "Saubere SEO-Basis, schnelles Hosting, mobile Optimierung und Wartung. Sie müssen nichts selbst einrichten.",
  },
  {
    icon: Wrench,
    title: "Verwaltbare Inhalte (optional)",
    body: "Auf Wunsch bauen wir verwaltbare Bereiche direkt in Ihre Website ein — Speisekarte, Öffnungszeiten, Wochenangebote oder Bilder.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Anfrage senden",
    body: "Kurz das Formular ausfüllen oder eine WhatsApp schicken — wir melden uns innerhalb von 24 Stunden.",
  },
  {
    number: "02",
    title: "Daten liefern",
    body: "Logo, Bilder, Texte, Öffnungszeiten, Leistungen, Kontaktdaten. Was Sie nicht haben, finden wir gemeinsam.",
  },
  {
    number: "03",
    title: "Website geht online",
    body: "Wir bauen, Sie geben frei, wir veröffentlichen. In den meisten Fällen 1–2 Werktage nach Datenlieferung.",
  },
];


const PACKAGES = [
  {
    slug: "starter",
    name: "Starter-Projekt",
    badge: "Schnell online",
    setup: "ab 499 €",
    monthly: "ab 49 € / Monat",
    cta: "Starter anfragen",
    description:
      "Eine moderne Seite, alles Wichtige auf einen Blick. Perfekt für Einzelunternehmer und kleine Betriebe.",
    bullets: [
      "Moderne Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular",
      "WhatsApp-Button",
      "Google Maps & Öffnungszeiten",
      "Impressum & Datenschutz",
      "Hosting inklusive",
      "Kleine monatliche Änderungen",
    ],
  },
  {
    slug: "business",
    name: "Business-Auftritt",
    badge: "Beliebteste Wahl",
    highlight: true,
    setup: "ab 899 €",
    monthly: "ab 79 € / Monat",
    cta: "Business anfragen",
    description:
      "Mehrere Sektionen, Team, Leistungen, Galerie. Für lokale Unternehmen, die professionell auftreten wollen.",
    bullets: [
      "Hochwertige Mehrseiten-Website",
      "Mehrere professionelle Sektionen",
      "SEO-Grundlagen",
      "Bilder- & Bildbearbeitung",
      "Kontaktformular & WhatsApp",
      "Google Maps",
      "Texte gemeinsam erarbeitet",
      "Laufende Betreuung",
    ],
  },
  {
    slug: "premium",
    name: "Premium-System",
    badge: "Mit verwaltbaren Inhalten",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    cta: "Premium anfragen",
    description:
      "Individuelle Website-Struktur mit verwaltbaren Inhalten direkt auf Ihrer Seite. Speisekarte, Wochenangebot, Termine — Sie pflegen, was Sie pflegen wollen.",
    bullets: [
      "Premium-Design",
      "Individuelle Website-Struktur",
      "Verwaltbare Inhalte auf Wunsch",
      "Speisekarte / Wochenangebot / Leistungen",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Stärkere SEO-Basis",
      "Laufender Support",
      "Erweiterte Wartung",
    ],
  },
];


const FAQ = [
  {
    question: "Muss ich mich registrieren?",
    answer:
      "Nein. Für eine Anfrage reicht das Formular oder eine E-Mail. Sie müssen keinen Account erstellen.",
  },
  {
    question: "Wie schnell ist meine Website fertig?",
    answer:
      "In den meisten Fällen innerhalb von 1–2 Werktagen nach vollständiger Datenlieferung. Für größere Projekte besprechen wir den Zeitplan vorab.",
  },
  {
    question: "Was muss ich liefern?",
    answer:
      "Logo, Bilder, Texte, Leistungen, Öffnungszeiten, Kontaktdaten — und falls vorhanden Ihre aktuelle Website. Was fehlt, klären wir gemeinsam.",
  },
  {
    question: "Kann ich später Inhalte ändern?",
    answer:
      "Ja. Änderungen können wir im Rahmen der Betreuung übernehmen. Auf Wunsch können bestimmte Inhalte auch direkt auf Ihrer Website verwaltbar gemacht werden — z. B. Öffnungszeiten, Speisekarte, Wochenangebot oder Leistungen.",
  },
  {
    question: "Was ist besser: Baukasten oder Sitalo?",
    answer:
      "Website-Baukästen sind gut, wenn Sie selbst bauen möchten. Sitalo ist besser, wenn Sie eine fertige professionelle Website möchten und keine Zeit für Technik, Design, Texte und Einrichtung haben. Wir liefern das fertige Ergebnis — Sie liefern nur die Daten.",
  },
  {
    question: "Gibt es monatliche Kosten?",
    answer:
      "Ja, wenn Hosting, Wartung, Änderungen und Support über uns laufen sollen. Die monatlichen Kosten hängen vom Paket ab (49 €, 79 € oder 129 €) und sind jederzeit zum Monatsende kündbar.",
  },
  {
    question: "Warum gibt es Einstiegspreise und keine festen Endpreise?",
    answer:
      "Die Pakete geben eine klare Orientierung. Der finale Preis hängt davon ab, welche Inhalte vorhanden sind, welche Funktionen gewünscht werden und wie umfangreich die Website wird. Nach Ihrer Anfrage erhalten Sie eine klare Einschätzung.",
  },
  {
    question: "Was soll ich auswählen, wenn ich unsicher bin?",
    answer:
      'Wählen Sie im Anfrageformular einfach „Ich bin unsicher". Wir prüfen Ihr Vorhaben und empfehlen Ihnen das passende Paket — kostenlos und unverbindlich.',
  },
  {
    question: "Sind Impressum und Datenschutz dabei?",
    answer:
      "Wir integrieren die entsprechenden Seiten und Bereiche technisch. Rechtssichere Inhalte (Impressums-Text, Datenschutzerklärung) sollten Sie selbst oder von einem geeigneten Anbieter beziehen — wir können bei Bedarf Empfehlungen aussprechen.",
  },
  {
    question: "Was passiert nach dem Launch?",
    answer:
      "Sie erhalten laufende Betreuung im monatlichen Paket: kleine Änderungen, Updates, Sicherheits-Patches, Backups. Größere Erweiterungen besprechen wir im Einzelfall.",
  },
];

/**
 * Industry value props — replaces the chip list with per-trade
 * "what you get" cards. Same trades, just communicated as outcomes.
 */

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <IndustryPicker />
        <Problems />
        <Solutions />
        <Steps />
        <BaukastenComparison />
        <VerwaltbareInhalteSection />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  return (
    <section
      id="start"
      className="border-border/40 relative overflow-hidden border-b scroll-mt-20"
    >
      <div
        className="from-secondary/50 absolute inset-0 -z-10 bg-gradient-to-b to-transparent"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="bg-primary/10 absolute -right-32 top-12 -z-10 h-96 w-96 rounded-full blur-3xl"
      />
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]">
              Webdesign-Service · Lokale Unternehmen
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Website erstellen lassen —
              <br className="hidden sm:inline" />{" "}
              <span className="text-primary">ohne Baukasten-Stress.</span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-lg leading-relaxed">
              Sie senden uns Logo, Bilder, Texte und Kontaktdaten. Wir
              übernehmen Design, Technik, Mobiloptimierung und Veröffentlichung
              — meist innerhalb von 48 Stunden.
            </p>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
              >
                Website anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#branchen"
                className="border-border bg-background hover:bg-secondary inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-colors"
              >
                Beispiele ansehen
              </Link>
            </div>

            <ul className="text-muted-foreground mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {TRUST_LINE.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-first lg:order-last">
            <HeroMockups />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="border-border/40 bg-background border-b">
      <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-sm">
        {TRUST_BAR.map((item) => (
          <li
            key={item.label}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="text-emerald-600 h-3.5 w-3.5" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Problems() {
  return (
    <section className="bg-secondary/30 border-border/40 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Kennen Sie das?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Eine eigene Website ist überfällig — aber irgendwas hält Sie auf.
          </h2>
        </header>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {PROBLEMS.map((problem) => (
            <li
              key={problem}
              className="bg-card border-border/60 flex items-start gap-3 rounded-xl border p-5 shadow-sm"
            >
              <span className="text-destructive/80 mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
                <X className="h-4 w-4" />
              </span>
              <span className="text-foreground/85 text-[15px] leading-relaxed">
                {problem}
              </span>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-foreground text-lg font-medium">
            Wir übernehmen das für Sie.
          </p>
          <Link
            href="/anfrage"
            className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Jetzt anfragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="leistungen"
      className="border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Was Sitalo macht
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Webdesign-Service mit eigenem System.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Wir erstellen moderne Websites für lokale Unternehmen — schnell,
            persönlich, professionell. Ohne Baukasten-Stress.
          </p>
        </header>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border/60 sm:grid-cols-2">
          {SOLUTIONS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="bg-card flex flex-col gap-3 p-7 sm:p-8"
            >
              <span className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section
      id="ablauf"
      className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            So einfach geht es
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            In 3 Schritten zur fertigen Website.
          </h2>
        </header>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="bg-card border-border/60 flex flex-col rounded-2xl border p-7 shadow-sm"
            >
              <span className="text-primary text-sm font-mono font-medium tracking-widest">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Jetzt Anfrage senden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}


function Pricing() {
  return (
    <section
      id="pakete"
      className="bg-secondary/30 border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Preise
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Klare Pakete. Faire Preise.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Einmalige Erstellung + monatliche Betreuung. Sie zahlen nur für das,
            was Sie wirklich brauchen.
          </p>
        </header>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li
              key={p.name}
              className={`flex flex-col rounded-2xl border p-7 shadow-sm sm:p-8 ${
                p.highlight
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                      p.highlight ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {p.badge}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-semibold tracking-tight">
                  {p.setup}
                </p>
                <p
                  className={`text-sm ${
                    p.highlight ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  einmalig · zzgl. {p.monthly}
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
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm">
          Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und
          gewünschten Funktionen ab. Mehr Details auf der{" "}
          <Link
            href="/pricing"
            className="hover:text-foreground underline"
          >
            Preise-Seite
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-3xl px-6">
        <header className="text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Häufige Fragen
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
    <section
      id="kontakt"
      className="bg-foreground text-background py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          Bereit für eine Website,
          <br />
          die professionell wirkt und Kunden bringt?
        </h2>
        <p className="text-background/70 mx-auto mt-5 max-w-xl text-pretty text-lg">
          Schicken Sie uns Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden
          mit einem klaren Vorschlag — persönlich, nicht von einer Hotline.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Jetzt Website anfragen
            <Send className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <p className="text-background/60 mt-6 inline-flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
      </div>
    </section>
  );
}

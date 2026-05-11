import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Send } from "lucide-react";

import { HeroMockups } from "@/components/marketing/hero-mockups";
import { IndustryPicker } from "@/components/marketing/industry-picker";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Sitalo — Ihre Website, persönlich gemacht. Aus Hamburg.",
  description:
    "Hallo, ich bin Nadim. Ich baue Websites für lokale Unternehmen — Sie schicken mir Ihre Unterlagen, ich melde mich persönlich und liefere die fertige Seite. Aus Hamburg, deutschlandweit.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Ihre Website, persönlich gemacht. Aus Hamburg.",
    description:
      "Sie schicken mir Ihre Unterlagen, ich kümmere mich um den Rest. Meist in 1–2 Werktagen online.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    images: [
      {
        url: "/images/sitalo-laptop-hero.png",
        width: 1536,
        height: 1024,
        alt: "Sitalo Webdesign — Laptop mit einer fertigen Kunden-Website auf einem warmen Holzschreibtisch.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitalo — Ihre Website, persönlich gemacht. Aus Hamburg.",
    description:
      "Sie schicken mir Ihre Unterlagen, ich kümmere mich um den Rest.",
    images: ["/images/sitalo-laptop-hero.png"],
  },
};

const TRUST_LINE = [
  "Aus Hamburg, deutschlandweit",
  "Persönlich von mir gemacht",
  "Auch am Telefon erreichbar",
  "Keine Registrierung nötig",
];

const STEPS = [
  {
    number: "01",
    title: "Sie melden sich",
    body: "Formular ausfüllen oder kurz auf WhatsApp schreiben. Ich antworte persönlich innerhalb von 24 Stunden.",
  },
  {
    number: "02",
    title: "Wir sprechen",
    body: "Kurzes Gespräch — am Telefon oder bei einem Kaffee in Hamburg. Sie schicken mir Logo, Bilder und Texte. Was fehlt, klären wir gemeinsam.",
  },
  {
    number: "03",
    title: "Ihre Seite geht online",
    body: "Ich baue, Sie schauen drüber, wir gehen live. Meist in 1–2 Werktagen — und danach bin ich weiter Ihr Ansprechpartner.",
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
    question: "Wie schnell ist meine Seite fertig?",
    answer:
      "Wenn Sie mir alle Unterlagen geschickt haben, oft schon nach 1–2 Werktagen. Bei größeren Projekten besprechen wir vorab einen verbindlichen Termin — ich verspreche nichts, was ich nicht halten kann.",
  },
  {
    question: "Was brauchen Sie von mir?",
    answer:
      "Ihr Logo (falls vorhanden), ein paar Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sage ich Bescheid und helfe bei Formulierungen.",
  },
  {
    question: "Gibt es laufende Kosten?",
    answer:
      "Ja — für Hosting, Pflege und kleine Änderungen. Je nach Paket 49 €, 79 € oder 129 € im Monat. Jederzeit zum Monatsende kündbar, kein Kleingedrucktes.",
  },
  {
    question: "Kann ich später noch Sachen ändern lassen?",
    answer:
      "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei. Sie schreiben mir kurz, ich mache es. Auf Wunsch kann ich auch Bereiche einbauen, die Sie selbst pflegen.",
  },
  {
    question: "Was passiert nach dem Launch?",
    answer:
      "Sie bekommen einen Ansprechpartner — mich. Hosting, Updates, Backups, Sicherheit laufen im Hintergrund. Wenn Sie etwas geändert haben wollen, schreiben Sie mir, ich kümmere mich.",
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
        <PersonalNote />
        <IndustryPicker />
        <Steps />
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
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-14 sm:pt-20 sm:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
              Hallo aus Hamburg · Webdesign für lokale Unternehmen
            </p>
            <h1 className="mt-4 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:mt-5 sm:text-5xl lg:text-6xl">
              Ihre Website.{" "}
              <span className="text-primary">Ich kümmere mich darum.</span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:mt-6 sm:text-lg">
              Ich bin Nadim. Sie schicken mir Logo, Bilder und ein paar Zeilen
              zu Ihrem Betrieb — ich melde mich bei Ihnen, baue Ihre Seite und
              bringe sie online. Meist in 1–2 Werktagen.
            </p>
            <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center">
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

            <ul className="text-muted-foreground mt-7 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] sm:mt-9 sm:gap-x-5 sm:text-sm">
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

          <div className="order-first -mx-2 lg:order-last lg:mx-0">
            <HeroMockups />
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalNote() {
  return (
    <section className="border-border/40 border-b py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        <div className="bg-card border-border/60 relative rounded-2xl border p-8 shadow-sm sm:p-12">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
            Persönlich · Aus Hamburg
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.01em] sm:text-3xl">
            Warum ich das mache.
          </h2>
          <div className="text-foreground/85 mt-6 space-y-4 text-[16px] leading-relaxed sm:text-[17px]">
            <p>
              Ich weiß, wie wichtig es ist, dass man heute eine gute
              Onlinepräsenz hat. Wer Sie online nicht findet, kommt auch nicht
              durch die Tür — egal wie gut Sie Ihre Arbeit machen.
            </p>
            <p>
              Vielen Inhabern fehlt schlicht die Zeit (oder die Lust), sich
              durch Baukästen zu klicken, Texte zu schreiben und am Ende doch
              eine Seite zu haben, die wie tausend andere aussieht. Genau da
              springe ich ein.
            </p>
            <p>
              Sie schicken mir ein paar Unterlagen — Logo, Bilder, ein paar
              Sätze zu Ihrem Betrieb. Ich melde mich, baue Ihre Seite, und
              danach bleibe ich Ihr Ansprechpartner. Keine Hotline, kein
              Ticket. Sie schreiben mir, ich antworte.
            </p>
          </div>
          <p
            className="text-foreground mt-8 text-lg"
            style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontStyle: "italic" }}
          >
            — Nadim Nauroz
          </p>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section
      id="ablauf"
      className="bg-secondary/20 border-border/40 border-b py-14 sm:py-24 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            So läuft es bei mir ab
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Drei Schritte. Kein Papierkram dazwischen.
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
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Jetzt Anfrage senden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/ablauf"
            className="text-muted-foreground hover:text-foreground inline-flex h-11 items-center justify-center px-4 text-sm font-medium underline-offset-4 hover:underline"
          >
            Ablauf im Detail
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
      className="bg-secondary/30 border-border/40 border-b py-14 sm:py-24 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Preise
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Drei Wege, Ihre Seite zu bekommen.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Eine einmalige Einrichtung, danach ein fairer Monatsbeitrag für
            Hosting, Pflege und kleine Änderungen. Was Sie nicht brauchen,
            zahlen Sie nicht.
          </p>
        </header>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-stretch sm:mt-12 sm:gap-6">
          {PACKAGES.map((p) => (
            <li
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow sm:p-7 ${
                p.highlight
                  ? "bg-foreground text-background border-foreground shadow-xl ring-2 ring-foreground/20 lg:-mt-3 lg:mb-0"
                  : "bg-card"
              }`}
            >
              {p.highlight ? (
                <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-md">
                  {p.badge}
                </span>
              ) : (
                <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                  {p.badge}
                </p>
              )}
              <h3 className={`text-xl font-semibold tracking-tight ${p.highlight ? "mt-2" : "mt-1"}`}>
                {p.name}
              </h3>
              <div className="mt-5">
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
                className={`mt-4 text-[14px] leading-relaxed ${
                  p.highlight ? "text-background/85" : "text-muted-foreground"
                }`}
              >
                {p.description}
              </p>
              <ul className="mt-5 space-y-2 text-[13px] sm:text-sm">
                {p.bullets.slice(0, 5).map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        p.highlight ? "text-background" : "text-emerald-600"
                      }`}
                    />
                    <span>{b}</span>
                  </li>
                ))}
                {p.bullets.length > 5 ? (
                  <li
                    className={`pt-1 text-[12px] ${
                      p.highlight ? "text-background/60" : "text-muted-foreground"
                    }`}
                  >
                    + {p.bullets.length - 5} weitere Funktionen
                  </li>
                ) : null}
              </ul>
              <div className="mt-auto pt-6">
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className={`group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight shadow-sm transition-all hover:shadow-md ${
                    p.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm">
          Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und
          gewünschten Funktionen ab. Volle Details auf der{" "}
          <Link
            href="/pakete"
            className="hover:text-foreground underline"
          >
            Pakete-Seite
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
      className="bg-secondary/20 border-border/40 border-b py-14 sm:py-24 scroll-mt-20"
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
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Alle Fragen ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const whatsappHref = buildWhatsappHref();
  return (
    <section
      id="kontakt"
      className="bg-foreground text-background relative overflow-hidden py-14 sm:py-24 scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="bg-primary/25 absolute -top-32 right-1/2 h-96 w-96 translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
          Lust auf eine Seite,
          <br className="hidden sm:inline" />{" "}
          <span className="text-background/70">die wirklich zu Ihnen passt?</span>
        </h2>
        <p className="text-background/70 mx-auto mt-5 max-w-xl text-pretty text-base sm:text-lg">
          Schreiben Sie mir kurz, was Sie vorhaben. Ich melde mich
          persönlich — meist noch am selben Tag.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Website anfragen
            <Send className="ml-2 h-4 w-4" />
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border-background/30 bg-background/10 text-background hover:bg-background/15 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-7 text-[15px] font-medium tracking-tight backdrop-blur-sm transition-colors"
            >
              <WhatsappGlyph className="h-4 w-4" />
              WhatsApp schreiben
            </a>
          ) : null}
        </div>
        <p className="text-background/55 mt-6 inline-flex items-center gap-2 text-xs sm:text-sm">
          <Clock className="h-3.5 w-3.5" />
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
        <p
          className="text-background/70 mt-6 text-base"
          style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontStyle: "italic" }}
        >
          — Nadim Nauroz, Hamburg
        </p>
      </div>
    </section>
  );
}

function buildWhatsappHref(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    process.env.NEXT_PUBLIC_SITALO_WHATSAPP_MESSAGE?.trim() ||
    "Hallo Nadim, ich habe Ihre Seite gesehen und überlege, eine eigene Website für mein Unternehmen machen zu lassen. Können wir kurz dazu schreiben?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.001 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.241.586 4.434 1.7 6.366L3.2 28.8l6.601-1.728a12.79 12.79 0 0 0 6.198 1.577h.002c7.067 0 12.799-5.732 12.799-12.799 0-3.422-1.332-6.638-3.752-9.057a12.726 12.726 0 0 0-9.047-3.593zm0 23.342h-.002a10.591 10.591 0 0 1-5.4-1.479l-.387-.229-4.014 1.051 1.07-3.915-.252-.4a10.587 10.587 0 0 1-1.624-5.668c0-5.866 4.775-10.641 10.641-10.641 2.842 0 5.514 1.108 7.525 3.12a10.557 10.557 0 0 1 3.116 7.527c0 5.866-4.774 10.634-10.673 10.634zm5.834-7.967c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16s-.827 1.04-1.014 1.254c-.187.214-.374.241-.694.08-.32-.16-1.353-.499-2.578-1.591-.953-.85-1.597-1.9-1.784-2.22-.187-.32-.02-.493.14-.652.143-.143.32-.374.48-.561.16-.187.213-.32.32-.534.107-.214.054-.4-.026-.561-.08-.16-.72-1.733-.987-2.373-.26-.622-.524-.538-.72-.548-.187-.01-.4-.012-.614-.012a1.18 1.18 0 0 0-.854.4c-.293.32-1.12 1.094-1.12 2.667 0 1.574 1.147 3.094 1.307 3.307.16.213 2.254 3.44 5.466 4.825.764.329 1.36.526 1.826.674.766.244 1.464.21 2.014.127.615-.092 1.893-.774 2.16-1.521.267-.748.267-1.387.187-1.521-.08-.134-.293-.213-.614-.374z" />
    </svg>
  );
}

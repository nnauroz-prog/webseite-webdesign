import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

import { HeroMockups } from "@/components/marketing/hero-mockups";
import { IndustryPicker } from "@/components/marketing/industry-picker";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Sitalo — Webdesign aus Hamburg",
  description:
    "Hallo, ich bin Nadim. Ich baue Websites für lokale Unternehmen — Sie schicken mir Ihre Unterlagen, ich melde mich persönlich und liefere die fertige Seite.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Webdesign aus Hamburg",
    description:
      "Sie schicken mir Ihre Unterlagen, ich kümmere mich um den Rest. Aus Hamburg, persönlich gemacht.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
    images: [
      {
        url: "/images/sitalo-laptop-hero.png",
        width: 1536,
        height: 1024,
        alt: "Sitalo Webdesign — Laptop mit einer fertigen Kunden-Website.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitalo — Webdesign aus Hamburg",
    description: "Sie schicken mir Ihre Unterlagen, ich kümmere mich um den Rest.",
    images: ["/images/sitalo-laptop-hero.png"],
  },
};

const STEPS = [
  {
    n: "01",
    title: "Sie schreiben mir.",
    body: "Ein paar Sätze zum Vorhaben — per Formular oder WhatsApp. Ich melde mich innerhalb von 24 Stunden persönlich.",
  },
  {
    n: "02",
    title: "Wir sprechen kurz.",
    body: "Telefon oder Kaffee in Hamburg. Sie schicken mir Logo, Bilder und ein paar Zeilen. Was fehlt, klären wir.",
  },
  {
    n: "03",
    title: "Ihre Seite geht online.",
    body: "Ich baue, Sie schauen drüber, wir gehen live — meist in 1–2 Werktagen. Danach bleibe ich Ihr Ansprechpartner.",
  },
];

const PACKAGES = [
  {
    slug: "starter",
    name: "Starter",
    setup: "ab 499 €",
    monthly: "ab 49 € / Monat",
    description:
      "Eine Seite. Alles Wichtige auf einen Blick. Für Einzelunternehmer und kleine Betriebe.",
    bullets: [
      "Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular",
      "WhatsApp & Google Maps",
      "Hosting inklusive",
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
    bullets: [
      "Mehrseitige Website",
      "Eigene Bereiche & Galerie",
      "SEO-Grundlagen",
      "Bilder­bearbeitung",
      "Laufende Betreuung",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    description:
      "Individuelle Struktur mit Bereichen, die Sie selbst pflegen können. Speisekarte, Angebote, Termine.",
    bullets: [
      "Premium-Design",
      "Selbst pflegbare Inhalte",
      "Formularsystem",
      "Erweiterte SEO-Basis",
      "Bevorzugter Support",
    ],
  },
];

const FAQ = [
  {
    q: "Wie schnell ist meine Seite fertig?",
    a: "Wenn Sie mir alle Unterlagen geschickt haben, oft schon nach 1–2 Werktagen. Bei größeren Projekten besprechen wir vorab einen verbindlichen Termin — ich verspreche nichts, was ich nicht halten kann.",
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Ihr Logo (falls vorhanden), ein paar Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sage ich Bescheid und helfe bei Formulierungen.",
  },
  {
    q: "Gibt es laufende Kosten?",
    a: "Ja — für Hosting, Pflege und kleine Änderungen. Je nach Paket 49 €, 79 € oder 129 € im Monat. Jederzeit zum Monatsende kündbar, kein Kleingedrucktes.",
  },
  {
    q: "Kann ich später noch Sachen ändern lassen?",
    a: "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei. Sie schreiben mir kurz, ich mache es. Auf Wunsch kann ich auch Bereiche einbauen, die Sie selbst pflegen.",
  },
  {
    q: "Was passiert nach dem Launch?",
    a: "Sie bekommen einen Ansprechpartner — mich. Hosting, Updates, Backups, Sicherheit laufen im Hintergrund. Wenn Sie etwas geändert haben wollen, schreiben Sie mir, ich kümmere mich.",
  },
];

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

/* ============================================================
 * Hero — editorial, oversized typography, image as canvas
 * ============================================================ */
function Hero() {
  return (
    <section id="start" className="relative overflow-hidden scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-6 pt-14 pb-20 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="reveal">
            <h1 className="text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
              Ihre Website.
              <br />
              <span className="serif-italic text-foreground/85 font-normal">
                Persönlich gemacht.
              </span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-lg leading-relaxed sm:text-xl">
              Sie schicken mir Ihre Unterlagen — ich melde mich persönlich
              und baue Ihre Seite. Aus Hamburg, in 1–2 Werktagen.
            </p>
            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
              >
                Website anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/branchen"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium tracking-tight underline-offset-[6px] hover:underline"
              >
                Beispiele ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div
            className="reveal -mx-2 lg:mx-0"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <HeroMockups />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * PersonalNote — full-bleed editorial pull-quote, dark backdrop
 * ============================================================ */
function PersonalNote() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute -top-32 right-[8%] h-96 w-96 rounded-full blur-3xl"
      />
      <div className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
          Aus Hamburg
        </p>
        <blockquote className="mt-8 max-w-4xl">
          <p className="serif text-[1.6rem] font-normal leading-[1.25] tracking-[-0.015em] sm:text-4xl lg:text-[3rem] lg:leading-[1.15]">
            Ich weiß, wie wichtig eine gute Onlinepräsenz heute ist. Wer
            Sie online nicht findet, kommt auch nicht durch die Tür —{" "}
            <span className="serif-italic text-background/75">
              egal wie gut Sie Ihre Arbeit machen.
            </span>
          </p>
        </blockquote>
        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2">
          <p className="text-background/75 text-[15px] leading-relaxed sm:text-base">
            Vielen Inhabern fehlt schlicht die Zeit, sich durch
            Baukästen zu klicken — und am Ende doch eine Seite zu haben,
            die wie tausend andere aussieht. Genau da springe ich ein.
          </p>
          <p className="text-background/75 text-[15px] leading-relaxed sm:text-base">
            Sie schicken mir ein paar Unterlagen — Logo, Bilder, ein paar
            Sätze. Ich melde mich, baue Ihre Seite, und bleibe danach Ihr
            Ansprechpartner. Keine Hotline, kein Ticket.
          </p>
        </div>
        <p className="serif-italic text-background mt-12 text-2xl">
          — Nadim Nauroz
        </p>
      </div>
    </section>
  );
}

/* ============================================================
 * Steps — three editorial cells, oversized numerals
 * ============================================================ */
function Steps() {
  return (
    <section
      id="ablauf"
      className="border-border/40 border-t border-b scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Drei Schritte.
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Kein Papierkram dazwischen.
            </span>
          </h2>
        </div>
        <ol className="mt-16 grid gap-x-10 gap-y-14 sm:mt-24 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="flex flex-col">
              <span className="serif text-foreground/15 text-[8rem] font-normal leading-none tracking-[-0.04em] sm:text-[10rem]">
                {step.n}
              </span>
              <h3 className="text-foreground mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Jetzt Anfrage senden
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/ablauf"
            className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-4 hover:underline"
          >
            Ablauf im Detail
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Pricing — refined, less visual noise
 * ============================================================ */
function Pricing() {
  return (
    <section id="pakete" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Drei Wege,
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Ihre Seite zu bekommen.
            </span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed">
            Eine einmalige Einrichtung, danach ein fairer Monatsbeitrag für
            Hosting, Pflege und kleine Änderungen.
          </p>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li
              key={p.slug}
              className={
                p.highlight
                  ? "bg-foreground text-background relative flex flex-col p-8 sm:p-10"
                  : "bg-background relative flex flex-col p-8 sm:p-10"
              }
            >
              {p.badge ? (
                <span className="bg-gold/90 text-foreground absolute top-6 right-6 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
                  {p.badge}
                </span>
              ) : null}
              <p
                className={
                  p.highlight
                    ? "text-background/55 text-[11px] font-medium uppercase tracking-[0.25em]"
                    : "text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]"
                }
              >
                {p.name}
              </p>
              <p className="mt-6 text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">
                {p.setup}
              </p>
              <p
                className={
                  p.highlight
                    ? "text-background/65 mt-2 text-sm"
                    : "text-muted-foreground mt-2 text-sm"
                }
              >
                einmalig · zzgl. {p.monthly}
              </p>
              <p
                className={
                  p.highlight
                    ? "text-background/85 mt-6 max-w-sm text-[15px] leading-relaxed"
                    : "text-foreground/75 mt-6 max-w-sm text-[15px] leading-relaxed"
                }
              >
                {p.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className={
                      p.highlight
                        ? "text-background/90 flex items-baseline gap-3"
                        : "text-foreground/85 flex items-baseline gap-3"
                    }
                  >
                    <span
                      className={
                        p.highlight
                          ? "bg-background/40 mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                          : "bg-foreground/40 mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                      }
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 pt-2">
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className={
                    p.highlight
                      ? "bg-background text-foreground hover:bg-background/90 group inline-flex h-11 items-center justify-center rounded-full px-6 text-[14px] font-medium tracking-tight"
                      : "border-foreground text-foreground hover:bg-foreground hover:text-background group inline-flex h-11 items-center justify-center rounded-full border px-6 text-[14px] font-medium tracking-tight transition-colors"
                  }
                >
                  {p.name} anfragen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mt-12 max-w-2xl text-sm">
          Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und
          gewünschten Funktionen ab. Volle Details auf der{" "}
          <Link href="/pakete" className="text-foreground underline underline-offset-4">
            Pakete-Seite
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

/* ============================================================
 * FAQ — quiet accordion, hairlines instead of cards
 * ============================================================ */
function Faq() {
  return (
    <section
      id="faq"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-24">
          <div>
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
              Häufige Fragen.
            </h2>
            <p className="text-muted-foreground mt-6 max-w-sm text-pretty text-lg leading-relaxed">
              Was Kunden mich am häufigsten fragen. Ihre Frage ist nicht
              dabei?{" "}
              <Link href="/kontakt" className="text-foreground underline underline-offset-4">
                Schreiben Sie mir.
              </Link>
            </p>
          </div>
          <dl className="divide-border/70 -mt-4 divide-y">
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
        <div className="mt-16 text-left">
          <Link
            href="/faq"
            className="text-foreground inline-flex items-center gap-2 text-[15px] font-medium underline-offset-4 hover:underline"
          >
            Alle Fragen ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * FinalCta — quiet but confident closer
 * ============================================================ */
function FinalCta() {
  const whatsappHref = buildWhatsappHref();
  return (
    <section
      id="kontakt"
      className="bg-foreground text-background relative overflow-hidden scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute top-10 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-28 text-center sm:py-40">
        <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          Lust auf eine Seite,
          <br />
          <span className="serif-italic text-background/70 font-normal">
            die wirklich zu Ihnen passt?
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Schreiben Sie mir kurz, was Sie vorhaben. Ich melde mich
          persönlich — meist noch am selben Tag.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Website anfragen
            <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border-background/30 text-background hover:bg-background/10 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-7 text-[15px] font-medium tracking-tight transition-colors"
            >
              <WhatsappGlyph className="h-4 w-4" />
              WhatsApp
            </a>
          ) : null}
        </div>
        <p className="serif-italic text-background/80 mt-12 text-xl">
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

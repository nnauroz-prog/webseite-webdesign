import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare, Coffee, Rocket, Send } from "lucide-react";

import { ExamplesGallery } from "@/components/marketing/examples-gallery";
import { HeroRotatingMockups } from "@/components/marketing/hero-rotating-mockups";
import { IndustryPicker } from "@/components/marketing/industry-picker";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Promises } from "@/components/marketing/promises";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { StackBlock } from "@/components/marketing/stack-block";

export const metadata: Metadata = {
  title: "Sitalo — Webdesign aus Hamburg",
  description:
    "Websites für lokale Unternehmen aus Hamburg. Sie schicken uns Ihre Unterlagen, wir melden uns persönlich und liefern die fertige Seite — meist in 1–2 Werktagen.",
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
    icon: MessageSquare,
    title: "Sie schreiben uns.",
    body: "Drei Felder im Formular, fertig. Wir melden uns innerhalb von 24 Stunden — persönlich, kostenlos, ohne Verkaufsdruck.",
  },
  {
    n: "02",
    icon: Coffee,
    title: "Kurzer Austausch.",
    body: "15 Minuten am Telefon oder bei einem Kaffee in Hamburg. Sie erzählen, was Sie brauchen — wir hören zu und schlagen vor.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "48 Stunden später live.",
    body: "Wir bauen, Sie schauen drüber, wir gehen online. Danach bleiben wir Ihr Ansprechpartner — kein Ticket, keine Hotline.",
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
      "Google Maps & Direktwahl",
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
      <main id="main" className="flex-1">
        <Hero />
        <RevealOnScroll>
          <PersonalNote />
        </RevealOnScroll>
        <RevealOnScroll>
          <IndustryPicker />
        </RevealOnScroll>
        <RevealOnScroll>
          <ExamplesGallery />
        </RevealOnScroll>
        <RevealOnScroll>
          <Steps />
        </RevealOnScroll>
        <RevealOnScroll>
          <Promises />
        </RevealOnScroll>
        <RevealOnScroll>
          <StackBlock />
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
      className="relative overflow-hidden scroll-mt-20"
    >
      {/* Warmer Gradient-Backdrop für mehr Atmosphäre */}
      <div
        aria-hidden="true"
        className="from-accent/30 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
      />
      {/* Dezentes Gold-Halo links oben */}
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-40 -left-20 -z-10 h-[36rem] w-[36rem] rounded-full blur-[120px]"
      />
      {/* Subtile Linien-Andeutung als Brand-Ornament */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="text-foreground/[0.03] absolute right-8 top-32 -z-10 hidden h-32 w-32 lg:block"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
      >
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="32" />
        <circle cx="50" cy="50" r="16" />
      </svg>
      <div className="mx-auto w-full max-w-7xl px-5 pt-10 pb-16 sm:px-6 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="reveal">
            <h1 className="text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-6xl sm:leading-[0.98] sm:tracking-[-0.04em] lg:text-[5.5rem]">
              Während andere
              <br />
              noch Vorlagen
              <br />
              <span className="serif-italic text-foreground/85 font-normal">
                klicken — sind Sie online.
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 max-w-lg text-pretty text-base leading-relaxed sm:mt-8 sm:text-xl">
              Hand-gebaute Websites für lokale Unternehmen aus Hamburg.
              Sie schicken uns drei Sachen, wir liefern den Rest —
              meistens schon übermorgen.
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
                href="#beispiele"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
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
            <HeroRotatingMockups />
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
      {/* Mehrere Halos für mehr atmosphärische Tiefe */}
      <div
        aria-hidden="true"
        className="bg-gold/20 pointer-events-none absolute -top-32 right-[8%] h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute bottom-0 left-[-10%] h-[24rem] w-[24rem] rounded-full blur-[120px]"
      />
      {/* Dezente vertikale Linien als Editorial-Marker */}
      <div
        aria-hidden="true"
        className="bg-background/10 pointer-events-none absolute left-6 top-0 hidden h-full w-px sm:block"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span className="bg-gold/60 inline-block h-1 w-8" aria-hidden="true" />
          <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
            Aus Hamburg
          </p>
        </div>
        <blockquote className="mt-10 max-w-4xl">
          <span
            aria-hidden="true"
            className="serif text-gold/40 absolute -mt-12 -ml-6 text-[10rem] leading-none"
          >
            „
          </span>
          <p className="serif text-[1.7rem] font-normal leading-[1.25] tracking-[-0.015em] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.12]">
            Jeden Tag verlieren Sie Kunden an die Konkurrenz —{" "}
            <span className="serif-italic text-background/75">
              nicht weil die besser ist, sondern weil sie online besser
              gefunden wird.
            </span>
          </p>
        </blockquote>
        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-6">
            <p className="text-background/75 text-[15px] leading-relaxed sm:text-base">
              Eine Website zu bauen ist viele Wochen Arbeit. Vorlagen
              durchsuchen, Texte schreiben, Bilder zuschneiden, Hosting
              klären, am Ende sieht's trotzdem aus wie tausend andere.
              Wir nehmen Ihnen das ab.
            </p>
            <p className="text-background/75 text-[15px] leading-relaxed sm:text-base">
              Sie schicken uns drei Sachen — Logo, Bilder, ein paar
              Sätze zu Ihrem Betrieb. Wir bauen daraus eine Seite, die
              sich anfühlt wie Ihre, nicht wie eine Vorlage. Übermorgen
              ist sie online.
            </p>
            <p className="serif-italic text-background pt-4 text-2xl">
              — Sitalo, aus Hamburg
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src="/images/workspace-macbook.png"
              alt="Arbeitsplatz mit MacBook, Notizbuch und Espresso — warmes Schreibtischlicht."
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
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
            Vom „Hallo"
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              zur Live-Seite — in 48 Stunden.
            </span>
          </h2>
        </div>
        <ol className="relative mt-16 grid gap-x-10 gap-y-14 sm:mt-24 sm:grid-cols-3">
          {/* Verbindungslinie zwischen den Schritten auf Desktop */}
          <div
            aria-hidden="true"
            className="border-border/60 absolute left-0 right-0 top-12 hidden border-t border-dashed sm:block"
            style={{ marginLeft: "12%", marginRight: "12%" }}
          />
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <li key={n} className="relative flex flex-col">
              <div className="flex items-start justify-between">
                <span className="serif text-foreground/15 text-[8rem] font-normal leading-none tracking-[-0.04em] sm:text-[10rem]">
                  {n}
                </span>
                <span className="bg-foreground text-background ring-background relative z-10 mt-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-[0_8px_20px_-6px_rgb(0_0_0/0.3)] ring-4 sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
              </div>
              <h3 className="text-foreground mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                {title}
              </h3>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed sm:text-base">
                {body}
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
            Klare Preise.
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Keine Überraschungen.
            </span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed">
            Einmal zahlen, dann ein fairer Monatsbeitrag für Hosting und
            Pflege. Was eine Hamburger Agentur für 5.000 € macht, gibt's
            bei uns ab 499 € — weil wir keine Hochhaus-Miete bezahlen.
          </p>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li
              key={p.slug}
              className={
                p.highlight
                  ? "bg-foreground text-background relative flex flex-col overflow-hidden p-8 sm:p-10"
                  : "bg-background relative flex flex-col p-8 sm:p-10"
              }
            >
              {p.highlight ? (
                <>
                  <div
                    aria-hidden="true"
                    className="bg-gold/15 pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full blur-[80px]"
                  />
                  <div
                    aria-hidden="true"
                    className="bg-gold/8 pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full blur-[80px]"
                  />
                </>
              ) : null}
              {p.badge ? (
                <span className="bg-gold text-foreground relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.4)]">
                  <span className="bg-foreground inline-block h-1 w-1 rounded-full" />
                  {p.badge}
                </span>
              ) : null}
              <p
                className={
                  p.highlight
                    ? "text-background/55 relative z-10 mt-4 text-[11px] font-medium uppercase tracking-[0.25em]"
                    : "text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]"
                }
              >
                {p.name}
              </p>
              <p className="relative z-10 mt-6 text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">
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
          Jeden Tag, den Sie warten,
          <br />
          <span className="serif-italic text-background/70 font-normal">
            findet Sie ein Kunde weniger.
          </span>
        </h2>
        <p className="text-background/65 mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed">
          Schreiben Sie uns kurz — drei Felder, zwei Minuten. Wir melden
          uns innerhalb von 24 Stunden mit einem konkreten Vorschlag.
        </p>
        <div className="mt-12 flex justify-center">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Website anfragen
            <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <p className="serif-italic text-background/80 mt-12 text-xl">
          — Sitalo, Hamburg
        </p>
      </div>
    </section>
  );
}

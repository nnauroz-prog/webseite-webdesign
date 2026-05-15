import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquare, Coffee, Rocket, Send } from "lucide-react";

import { BranchenMarquee } from "@/components/marketing/branchen-marquee";
import { CursorSpotlight } from "@/components/marketing/cursor-spotlight";
import { DreiSachen } from "@/components/marketing/drei-sachen";
import { ExamplesGallery } from "@/components/marketing/examples-gallery";
import { MagneticButton } from "@/components/marketing/magnetic-button";
import { ParallaxImage } from "@/components/marketing/parallax-image";
import { WordReveal } from "@/components/marketing/word-reveal";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  DoubleWave,
  HandUnderline,
  EditorialStar,
} from "@/components/marketing/ornaments";
import { Promises } from "@/components/marketing/promises";
import { RevealOnScroll } from "@/components/marketing/reveal-on-scroll";
import { WhyWebsite } from "@/components/marketing/why-website";

export const metadata: Metadata = {
  title: "Sitalo — Webdesign aus Hamburg",
  description:
    "Websites für lokale Unternehmen aus Hamburg. Sie schicken uns Ihre Unterlagen, wir melden uns persönlich und liefern die fertige Seite — meist in 1–2 Werktagen.",
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
    a: "Wenn Sie uns alle Unterlagen geschickt haben, oft schon nach 1–2 Werktagen. Bei größeren Projekten besprechen wir vorab einen verbindlichen Termin — wir versprechen nichts, was wir nicht halten können.",
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Ihr Logo (falls vorhanden), ein paar Bilder, eine kurze Beschreibung Ihrer Leistungen, Öffnungszeiten und Kontaktdaten. Wenn etwas fehlt, sagen wir Bescheid und helfen bei Formulierungen.",
  },
  {
    q: "Gibt es laufende Kosten?",
    a: "Ja — für Hosting, Pflege und kleine Änderungen. Je nach Paket 49 €, 79 € oder 129 € im Monat. Jederzeit zum Monatsende kündbar, kein Kleingedrucktes.",
  },
  {
    q: "Kann ich später noch Sachen ändern lassen?",
    a: "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei. Sie schreiben uns kurz, wir setzen es um. Auf Wunsch bauen wir auch Bereiche ein, die Sie selbst pflegen.",
  },
  {
    q: "Was passiert nach dem Launch?",
    a: "Sie bekommen einen festen Ansprechpartner bei uns. Hosting, Updates, Backups, Sicherheit laufen im Hintergrund. Wenn Sie etwas geändert haben wollen, schreiben Sie uns — wir kümmern uns.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main id="main" className="flex-1">
        <Hero />
        {/* WhyWebsite trägt den ganzen WARUM-Block — FactsStrip ist
            redundant, deshalb raus. Weniger Karten-Grid-Rhythmus. */}
        <RevealOnScroll>
          <WhyWebsite />
        </RevealOnScroll>
        <RevealOnScroll>
          <PersonalNote />
        </RevealOnScroll>
        <BranchenMarquee />
        {/* IndustryPicker raus — die ExamplesGallery zeigt jetzt
            in asymmetrischer Magazin-Form alle 10 Branchen mit Bild
            und Caption. Tab-Picker mit State wäre redundant und
            wirkt wie eine Standard-„Select your industry"-Komponente
            aus dem AI-Template-Baukasten. */}
        <RevealOnScroll>
          <ExamplesGallery />
        </RevealOnScroll>
        {/* Konkretisiert das „Sie schicken drei Sachen"-Versprechen
            visuell — Eingaben links, Ergebnis rechts. */}
        <RevealOnScroll>
          <DreiSachen />
        </RevealOnScroll>
        <RevealOnScroll>
          <Steps />
        </RevealOnScroll>
        <RevealOnScroll>
          <Promises />
        </RevealOnScroll>
        {/* StackBlock raus — 4 tech-stack-Karten interessieren
            keinen Kunden. Erwähnung der wichtigsten Bausteine
            steht im Footer („Hosting in Deutschland" etc.). */}
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
  // Editorial-Eyebrow mit aktuellem Monat ("MAI 2026 · HAMBURG").
  // Wird zur Render-Zeit (Server) berechnet — kein Hydration-Mismatch.
  const monthLabels = [
    "JANUAR",
    "FEBRUAR",
    "MÄRZ",
    "APRIL",
    "MAI",
    "JUNI",
    "JULI",
    "AUGUST",
    "SEPTEMBER",
    "OKTOBER",
    "NOVEMBER",
    "DEZEMBER",
  ];
  const now = new Date();
  const issueDate = `${monthLabels[now.getMonth()]} ${now.getFullYear()}`;

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
        className="bg-gold/10 pointer-events-none absolute -top-40 -left-20 -z-10 h-[36rem] w-[36rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <CursorSpotlight />

      <div className="mx-auto w-full max-w-7xl px-5 pt-8 pb-16 sm:px-6 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        {/* Editorial-Kopfzeile: dünne Linie + Sperrsatz wie eine
            Zeitschriften-Mastline. Setzt einen anderen Ton als ein
            klassischer SaaS-Hero. */}
        <div className="reveal flex items-center justify-between gap-4 border-b border-border/40 pb-5 sm:pb-6">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
            Sitalo · Webdesign
          </p>
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
            {issueDate} · Hamburg
          </p>
        </div>

        <div className="mt-10 grid items-end gap-10 sm:mt-14 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            {/* Staggered Reveal: jede Zeile fadet leicht versetzt rein —
                wirkt wie ein bewusst gesetztes Layout, nicht wie ein
                pop-in. Delays kumulieren über die CSS-Variable. */}
            <p className="reveal text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Ein kleines Atelier in Hamburg
            </p>
            <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:mt-8 sm:text-[4.25rem] sm:leading-[0.96] lg:text-[5.75rem] lg:tracking-[-0.04em]">
              <WordReveal step={75} delay={120}>
                {"Wir bauen "}
                <span className="serif-italic text-muted-foreground font-normal">
                  Websites
                </span>
                <br />
                {"für Hamburger "}
                <span className="serif-italic text-muted-foreground font-normal">
                  Unternehmen.
                </span>
              </WordReveal>
            </h1>
            <p
              className="reveal text-muted-foreground mt-7 max-w-lg text-pretty text-base leading-relaxed sm:mt-9 sm:text-lg"
              style={{ "--reveal-delay": "900ms" } as React.CSSProperties}
            >
              Die meisten Cafés in Eppendorf haben eine Speisekarte als
              PDF von 2021. Pflegedienste in Altona stehen nicht mal bei
              Google Maps. Wir bauen die Seiten der anderen.
            </p>
            <div
              className="reveal mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
              style={{ "--reveal-delay": "1100ms" } as React.CSSProperties}
            >
              <MagneticButton
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Website anfragen
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
              <Link
                href="#beispiele"
                className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
              >
                Beispiele ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            {/* Quiet Trust-Hint unter den CTAs — reduziert die
                Hürde, ohne das Hero zu beladen. */}
            <p
              className="reveal text-muted-foreground/85 mt-5 inline-flex items-center gap-2 text-[13px]"
              style={{ "--reveal-delay": "1300ms" } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="bg-ink-olive inline-block h-1 w-1 rounded-full"
              />
              Antwort meist noch am selben Tag — kostenlos, persönlich.
            </p>
          </div>

          {/* Rechte Spalte: Workspace-Foto mit Parallax und schwebendem
              Magazin-Zitat — direkt von uns, nicht aus Kundensicht. */}
          <div
            className="reveal relative"
            style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          >
            <div className="ring-foreground/5 relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 sm:aspect-[5/6]">
              <ParallaxImage
                src="/images/workspace-macbook.webp"
                alt="Arbeitsplatz in Hamburg — MacBook, Notizbuch, Espresso. Hier entstehen die Sitalo-Websites."
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
                intensityPx={28}
              />
              {/* Vignette für Kontrast unter dem Zitat */}
              <div
                aria-hidden="true"
                className="from-foreground/60 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
              />
              {/* Schwebendes Zitat — Stimme des Ateliers, nicht aus Kundenmund. */}
              <figure className="absolute right-5 bottom-5 left-5 sm:right-7 sm:bottom-7 sm:left-7">
                <blockquote className="serif-italic text-background text-lg leading-snug tracking-[-0.005em] sm:text-xl">
                  „Wir bauen jede Seite, als wäre es unsere eigene."
                </blockquote>
                <figcaption className="text-background/70 mt-3 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em]">
                  <span
                    aria-hidden="true"
                    className="bg-gold gold-pulse inline-block h-1 w-5"
                  />
                  Sitalo Atelier · Hamburg
                </figcaption>
              </figure>
            </div>
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
      {/* Subtile Espresso-Textur als Background-Overlay — minimal
          opacity, mixed mit Soft-Light. Lässt den dunklen Block
          nicht mehr wie eine Tailwind-Solid-Fläche aussehen,
          sondern wie bedrucktes Papier. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage: "url(/images/texture-espresso.webp)",
          backgroundSize: "640px auto",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Mehrere Halos für mehr atmosphärische Tiefe */}
      <div
        aria-hidden="true"
        className="bg-gold/20 pointer-events-none absolute -top-32 right-[8%] h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute bottom-0 left-[-10%] h-[24rem] w-[24rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      {/* Cursor-aware Gold-Halo — folgt der Maus über dem dunklen
          Block. Setzt die Brand-Atmosphäre fort und gibt der
          ansonsten ruhigen Quote-Sektion Leben auf Desktop. */}
      <CursorSpotlight />
      {/* Dezente vertikale Linien als Editorial-Marker */}
      <div
        aria-hidden="true"
        className="bg-background/10 pointer-events-none absolute left-6 top-0 hidden h-full w-px sm:block"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span
            className="bg-gold/60 gold-pulse inline-block h-1 w-8"
            aria-hidden="true"
          />
          <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
            Aus Hamburg
          </p>
        </div>
        <blockquote className="relative mt-10 max-w-4xl">
          <span
            aria-hidden="true"
            className="serif text-gold/40 absolute -top-12 -left-6 text-[10rem] leading-none"
          >
            „
          </span>
          <p className="serif text-[1.7rem] font-normal leading-[1.25] tracking-[-0.015em] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.12]">
            Wir gehen viel zu Fuß durch Hamburg.{" "}
            <span className="serif-italic text-background/75">
              Was wir dabei sehen:
            </span>{" "}
            jedes zweite Café hat keine ordentliche Website —{" "}
            <span className="serif-italic text-background/75">
              und es ist nie das beste.
            </span>
          </p>
        </blockquote>
        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-6">
            <p className="text-background/85 text-[15px] leading-relaxed sm:text-[17px]">
              Eppendorf, ein Mittwochmittag. Drei Cafés in zwei Straßen.
              Das mit dem besten Espresso hat eine Speisekarte als PDF
              von Februar 2021. Das daneben hat keine Öffnungszeiten bei
              Google Maps. Das dritte, das wir auch nicht empfehlen
              würden, hat als einziges eine moderne Website. Dreimal
              raten, welches voll war.
            </p>
            <p className="text-background/85 text-[15px] leading-relaxed sm:text-[17px]">
              Sieht man überall. Der Friseur in Eimsbüttel, dessen
              Telefonnummer auf der Seite drei Jahre alt ist. Die Bar
              in St.&nbsp;Pauli, deren Instagram-Link auf einen
              Lieferdienst-Account zeigt, den's nicht mehr gibt.
              Online-Sichtbarkeit ist kein Talent-Beweis. Aber wenn Sie
              talentiert sind und nicht sichtbar, gewinnt jemand
              anders. Auch wenn der schlechter ist.
            </p>
            <p className="text-background/85 text-[15px] leading-relaxed sm:text-[17px]">
              Wir bauen Seiten für die anderen. Für die, die wissen,
              dass gute Arbeit erst zählt, wenn jemand davon weiß. Wir
              brauchen Ihr Logo, ein paar Bilder, was zu sagen. Den
              Rest machen wir.
            </p>
            <p className="serif-italic text-background pt-4 text-2xl">
              — Sitalo, aus Hamburg
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src="/images/workspace-macbook.webp"
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
 * Steps — Editorial-Spread mit übergroßen Numeralen, jede Stufe
 * als eigene Zeile mit alternierender Ausrichtung. Statt 3-Col-
 * Timeline ein vertikaler Lesefluss, der Print-DNA hat.
 * ============================================================ */
function Steps() {
  return (
    <section
      id="ablauf"
      className="border-border/40 relative overflow-hidden border-t border-b scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Bewusst keine Eyebrow-Zeile — Steps soll ohne den gleichen
            Auftakt-Beat starten, den jede andere Sektion hat. */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Vom „Hallo"
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                zur Live-Seite — in 48 Stunden.
              </span>
            </h2>
          </div>
          <p className="text-foreground/75 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
            Nach jedem Schritt haben Sie was in der Hand. Kein
            PowerPoint-Status, kein Project-Tool-Ticket, das irgendwo
            im System steht. Sie sehen's einfach.
          </p>
        </div>

        {/* Drei Stufen als alternierende Magazin-Zeilen.
            Bewusst kein 3-Spalten-Grid mit Timeline-Linie — das ist
            die typische Standard-„Process"-Sektion auf AI-Templates.
            Stattdessen vertikaler Lesefluss mit übergroßen Numeralen. */}
        <ol className="mt-20 space-y-16 sm:mt-24 sm:space-y-20 lg:space-y-24">
          {STEPS.map(({ n, icon: Icon, title, body }, i) => {
            const flip = i === 1; // mittlere Stufe gespiegelt
            return (
              <li
                key={n}
                className="relative grid items-start gap-6 sm:grid-cols-[auto_1fr] sm:gap-10 lg:gap-14"
              >
                {/* Numeral-Spalte links — riesiges Serif, dezent */}
                <div className={flip ? "sm:order-2 sm:text-right" : ""}>
                  <span className="serif text-ink-petrol/35 block text-[6rem] font-normal leading-[0.85] tracking-[-0.05em] sm:text-[8rem] lg:text-[10rem]">
                    {n}
                  </span>
                </div>
                {/* Text + Icon */}
                <div
                  className={
                    flip
                      ? "sm:order-1 sm:pr-6 sm:text-right"
                      : "sm:pl-2"
                  }
                >
                  <div
                    className={
                      flip
                        ? "flex items-center gap-3 sm:justify-end"
                        : "flex items-center gap-3"
                    }
                  >
                    <span className="bg-foreground/[0.04] text-foreground/80 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.3em]">
                      Etappe · {n}
                    </span>
                  </div>
                  <h3 className="serif text-foreground mt-5 text-balance text-3xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
                    {title}
                  </h3>
                  <p className="text-foreground/80 mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                    {body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-20 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
 * Pricing — asymmetrischer Magazin-Spread. Business als „Centerfold",
 * Starter + Premium als kleinere flankierende Editorial-Mentions.
 * Bewusst kein gleichmäßiges 3-Karten-Grid (das ist genau das
 * AI-Template-Tell).
 * ============================================================ */
function Pricing() {
  const featured = PACKAGES.find((p) => p.highlight)!;
  const others = PACKAGES.filter((p) => !p.highlight);

  // Aktueller Monat als kleiner Kapazitäts-Anker — Server-rendered,
  // damit der Hinweis sich automatisch jeden Monat aktualisiert ohne
  // Pflegeaufwand.
  const monthLabels = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  const currentMonth = monthLabels[new Date().getMonth()];

  return (
    <section id="pakete" className="border-border/40 border-t scroll-mt-20">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        {/* Header mit Hand-Underline auf der Italic-Akzentzeile */}
        <div className="max-w-2xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Pakete & Preise
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Klare Preise.
            <br />
            <span className="serif-italic text-muted-foreground relative font-normal">
              Keine Überraschungen.
              <HandUnderline className="text-gold/60 absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed">
            Einmal zahlen, dann ein fairer Monatsbeitrag für Hosting und
            Pflege. Was eine Hamburger Agentur für 5.000 € macht, gibt's
            bei uns ab 499 € — weil wir kein Hochhaus mieten.
          </p>
          {/* Kapazitäts-Anker — kleiner Hanseatischer Scarcity-Hinweis
              ohne erfundene Zahlen. „Ein paar" statt „X Slots" lässt
              die Sache wahr, ohne falsche Präzision vorzutäuschen. */}
          <p className="text-foreground/75 mt-6 inline-flex flex-wrap items-center gap-2 text-[13.5px]">
            <span
              aria-hidden="true"
              className="bg-gold/80 inline-block h-1.5 w-1.5 rounded-full"
            />
            <span className="font-medium">{currentMonth}:</span>
            <span>
              noch ein paar Slots offen. Wer früh schreibt, sucht sich
              den Termin aus.
            </span>
          </p>
        </div>

        {/* Magazin-Spread: featured (Business) groß und dunkel zentral,
            die zwei anderen flankieren als schlanke Editorial-Streifen.
            Kein 3-gleicher-Karten-Reflex. */}
        <div className="mt-16 grid gap-px sm:mt-20 lg:grid-cols-[1fr_2fr_1fr] lg:gap-6">
          {/* Linker Streifen: Starter */}
          <div className="order-2 lg:order-1">
            <PricingFlanke paket={others[0]} side="left" />
          </div>

          {/* Centerfold: Business */}
          <div
            className="order-1 lg:order-2"
            id={featured.slug}
          >
            <PricingCenterfold paket={featured} />
          </div>

          {/* Rechter Streifen: Premium */}
          <div className="order-3">
            <PricingFlanke paket={others[1]} side="right" />
          </div>
        </div>

        {/* Hand-gezeichneter Trenner statt CSS-Border vor dem Disclaimer */}
        <div className="text-muted-foreground/40 mt-20 mx-auto max-w-md">
          <DoubleWave className="w-full" />
        </div>

        <p className="text-muted-foreground mt-10 mx-auto max-w-2xl text-center text-sm text-pretty">
          Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und
          gewünschten Funktionen ab. Volle Details auf der{" "}
          <Link
            href="/pakete"
            className="text-foreground underline underline-offset-4"
          >
            Pakete-Seite
          </Link>
          .
        </p>
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
          ? "border-border/60 lg:border-r flex h-full flex-col p-6 sm:p-8 lg:pr-10"
          : "border-border/60 lg:border-l flex h-full flex-col p-6 sm:p-8 lg:pl-10"
      }
    >
      <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.3em]">
        {paket.name}
      </p>
      <p className="serif text-foreground mt-4 text-4xl font-normal leading-none tracking-[-0.025em] sm:text-5xl">
        {paket.setup}
      </p>
      <p className="text-muted-foreground mt-2 text-[13px]">
        einmalig · zzgl. {paket.monthly}
      </p>
      <p className="text-foreground/75 mt-6 max-w-xs text-pretty text-[14px] leading-relaxed">
        {paket.description}
      </p>
      <ul className="mt-7 space-y-2.5 text-[13.5px]">
        {paket.bullets.slice(0, 4).map((b) => (
          <li
            key={b}
            className="text-foreground/80 flex items-baseline gap-2.5"
          >
            <span className="bg-ink-olive mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
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
    <div className="bg-foreground text-background relative flex h-full flex-col overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full blur-[80px]"
      />

      <div className="relative flex items-center gap-3">
        <EditorialStar className="text-gold h-4 w-4" />
        <span className="text-background/55 text-[10px] font-medium uppercase tracking-[0.3em]">
          {paket.badge ?? paket.name} · Aufmacher
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

      <p className="relative text-background/85 mt-8 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
        {paket.description}
      </p>

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
          className="text-background/85 hover:text-background inline-flex h-12 items-center text-[14px] font-medium underline-offset-4 hover:underline"
        >
          {paket.name} im Detail
        </Link>
      </div>
    </div>
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
              Was Kunden uns am häufigsten fragen. Ihre Frage ist nicht
              dabei?{" "}
              <Link href="/kontakt" className="text-foreground underline underline-offset-4">
                Schreiben Sie uns.
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
      {/* Espresso-Textur als bedruckt-Papier-Optik */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage: "url(/images/texture-espresso.webp)",
          backgroundSize: "640px auto",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Cursor-aware Gold-Spotlight — bringt Bewegung in den
          ansonsten ruhigen Closer. Auf Touch unsichtbar. */}
      <CursorSpotlight />
      {/* Mehrere weiche Halos für editoriale Tiefe */}
      <div
        aria-hidden="true"
        className="bg-gold/18 pointer-events-none absolute top-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[70px] sm:blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute bottom-0 right-[-8%] h-[24rem] w-[24rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      {/* Editorial-Mast oben — wie eine Magazin-Rückseite */}
      <div className="border-background/10 relative mx-auto flex w-full max-w-5xl items-center justify-between gap-4 border-b px-6 py-5">
        <p className="text-background/55 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Schluss-Statement
        </p>
        <p className="text-background/55 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
          Sitalo · Hamburg
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="grid items-end gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <h2 className="serif text-balance text-4xl font-normal leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
              <span className="serif-italic text-gold/70 absolute -mt-12 -ml-4 text-[8rem] leading-none">
                „
              </span>
              Jeden Tag, den{" "}
              <span className="serif-italic text-background/70">
                Sie warten,
              </span>{" "}
              findet Sie{" "}
              <span className="serif-italic text-background/70">
                ein Kunde weniger.
              </span>
            </h2>
            <p className="text-background/70 mt-10 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
              Drei Felder, zwei Minuten. Wir melden uns innerhalb von
              24 Stunden — persönlich, mit einem konkreten Vorschlag.
              Kein Vertrag, keine Kosten, kein Druck.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <MagneticButton
                href="/anfrage"
                className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight"
              >
                Website anfragen
                <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </MagneticButton>
              <a
                href="tel:+4915224437370"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-all"
              >
                Anrufen
              </a>
            </div>
          </div>

          {/* Editorial-Schluss rechts: Signature + Adresse als
              kleine Visitenkarte. */}
          <div className="lg:pl-10">
            <p className="text-background/45 text-[10px] font-medium uppercase tracking-[0.3em]">
              Aus dem Atelier
            </p>
            <p className="serif-italic text-background mt-4 text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
              — Sitalo,
              <br />
              Hamburg.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <a
                href="tel:+4915224437370"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
              >
                Anrufen
              </a>
              <a
                href="mailto:info@sitalo.de"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
              >
                Schreiben
              </a>
              <a
                href="/sitalo-kontakt.vcf"
                download="Sitalo-Webdesign.vcf"
                className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
              >
                Speichern
              </a>
            </div>
            <dl className="text-background/65 mt-8 space-y-2 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-background/45 uppercase tracking-[0.2em]">
                  Antwort
                </dt>
                <dd>innerhalb 24 h</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

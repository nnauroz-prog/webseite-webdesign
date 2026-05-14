import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MagneticButton } from "@/components/marketing/magnetic-button";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Das Sitalo Atelier — Wer wir sind und warum wir das machen",
  description:
    "Eine kleine Hamburger Werkstatt für Websites. Was wir glauben, wie wir arbeiten, warum „drei Sachen reichen\" mehr ist als ein Slogan.",
  alternates: { canonical: "/atelier" },
};

/* ============================================================
 * Editorial Manifesto-/About-Seite. Bewusst keine Team-Fotos,
 * keine erfundenen Awards, keine Bio. Stattdessen: was wir glauben,
 * wie wir arbeiten, warum. Persönlich als Werkstatt-Stimme, nicht
 * als Einzelperson. Bringt das Vertrauen, das Besucher brauchen
 * bevor sie eine Anfrage abschicken.
 * ============================================================ */
export default function AtelierPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Das Atelier" />
      <main className="flex-1">
        <Hero />
        <Glaubenssaetze />
        <WieWirArbeiten />
        <WarumHamburg />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Wer wir sind
        </p>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div>
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]">
              Sitalo ist
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                eine kleine Werkstatt.
              </span>
            </h1>
            <p className="text-foreground/80 mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
              Kein Konzern, kein Callcenter, kein Verkaufsteam. Ein
              Atelier in Hamburg, das Websites baut für Leute, die ihr
              Handwerk gut können — und denen Online-Sichtbarkeit
              bisher zu kompliziert oder zu beliebig war.
            </p>
            <p className="serif-italic text-foreground/85 mt-8 text-2xl leading-snug sm:text-3xl">
              — Drei Sachen reichen.
              <br />
              Den Rest bauen wir.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 ring-foreground/5 sm:aspect-[5/6]">
            <Image
              src="/images/workspace-prints.png"
              alt="Sitalo-Atelier in Hamburg — Schreibtisch mit gerahmten Design-Drucken und MacBook."
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="from-foreground/55 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
            />
            <figure className="absolute right-5 bottom-5 left-5 sm:right-7 sm:bottom-7 sm:left-7">
              <blockquote className="serif-italic text-background text-lg leading-snug tracking-[-0.005em] sm:text-xl">
                „Eine Seite zu bauen ist Handwerk, nicht Software-Klick."
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
    </section>
  );
}

const GLAUBENSSATZE = [
  {
    n: "01",
    title: "Eine Website ist Handwerk.",
    body: "Vorlagen-Baukästen sind Möbel aus dem Möbelhaus — funktional, aber austauschbar. Wir bauen wie ein Schreiner: aus Rohmaterial, Stück für Stück, mit Rücksicht auf das Holz vor uns. Keine zwei Sitalo-Seiten sehen gleich aus.",
  },
  {
    n: "02",
    title: "Geschwindigkeit schlägt Perfektion.",
    body: "Es ist besser, übermorgen eine ordentliche Seite zu haben als in drei Monaten eine perfekte. Wir liefern in 1–2 Werktagen ein Ergebnis, das funktioniert. Nachschärfen kann man jederzeit — eine Anfrage, die nie kommt, ist verloren.",
  },
  {
    n: "03",
    title: "Lokal schlägt generisch.",
    body: `„Webdesign Hamburg" ist nicht Ihr Markt. Ihr Markt heißt „Friseur Eimsbüttel", „Pflegedienst Wandsbek", „Café Ottensen". Wir bauen für diese Suche — nicht für die abstrakte.`,
  },
  {
    n: "04",
    title: "Persönlich schlägt Skalierung.",
    body: "Wir nehmen wenige Kunden gleichzeitig an. Jede Anfrage geht an uns persönlich, nicht an einen Ticket-Stapel. Wenn Sie anrufen, sind wir am Apparat — kein Servicebot, keine Hotline.",
  },
  {
    n: "05",
    title: "Ehrlich schlägt erfolgreich.",
    body: "Wir versprechen keinen Platz 1 bei Google, keine 10.000 Klicks pro Monat, keine Conversion-Wunder. Wir versprechen eine ordentlich gebaute Seite, die für die richtigen Suchen sichtbar ist. Den Rest entscheidet Ihr Handwerk.",
  },
];

function Glaubenssaetze() {
  return (
    <section className="bg-secondary/40 border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Was wir glauben
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Fünf Sätze,
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              die alles erklären.
            </span>
          </h2>
        </div>
        <ol className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {GLAUBENSSATZE.map((s, i) => (
            <li
              key={s.n}
              className={
                i === 0
                  ? "border-foreground/15 bg-foreground text-background ring-foreground/10 relative overflow-hidden rounded-3xl border p-7 ring-1 sm:p-9 lg:col-span-2 lg:p-10"
                  : "border-border/60 bg-card/70 ring-foreground/5 group relative flex flex-col overflow-hidden rounded-3xl border p-7 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-8"
              }
            >
              {i === 0 ? (
                <>
                  <div
                    aria-hidden="true"
                    className="bg-gold/15 pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full blur-[80px]"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="serif text-background/30 text-[1.4rem] font-normal leading-none tracking-[-0.04em]">
                        {s.n}
                      </span>
                      <span
                        aria-hidden="true"
                        className="bg-background/20 inline-block h-px w-8"
                      />
                      <span className="text-background/55 text-[10px] font-medium uppercase tracking-[0.25em]">
                        Glaubenssatz · 01
                      </span>
                    </div>
                    <h3 className="serif mt-4 text-3xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-4xl">
                      {s.title}
                    </h3>
                    <p className="text-background/75 mt-4 max-w-xl text-pretty text-[15px] leading-relaxed sm:text-base">
                      {s.body}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className="serif text-ink-petrol/60 text-[2.5rem] font-normal leading-none tracking-[-0.04em] sm:text-[3rem]">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="text-foreground mt-6 text-xl font-medium leading-snug tracking-[-0.015em] sm:text-[1.35rem]">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-pretty text-[15px] leading-relaxed">
                    {s.body}
                  </p>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WieWirArbeiten() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Wie wir arbeiten
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
            Klein. Persönlich.{" "}
            <span className="serif-italic text-muted-foreground font-normal">
              Übermorgen online.
            </span>
          </h2>
        </div>

        <p className="text-foreground/85 mt-14 max-w-3xl text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="serif text-ink-petrol float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            W
          </span>
          ir nehmen wenige Projekte gleichzeitig an. Genug, um mit
          jedem Kunden persönlich zu reden, zu hören, was er wirklich
          braucht. Nicht genug, um zu skalieren.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Eine Sitalo-Seite entsteht in einem Stück. Wenn Sie uns
              Logo, Bilder und ein paar Sätze schicken, hat sie nach
              1–2 Werktagen Form. Wir melden uns währenddessen nur,
              wenn etwas wirklich fehlt — sonst arbeiten wir, Sie
              führen Ihren Betrieb.
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Nach Live-Schaltung bleiben wir Ihr Ansprechpartner.
              Eine kleine Änderung pro Monat ist im Starter dabei,
              drei im Business, sechs im Premium. Sie schreiben uns,
              wir setzen es um. Kein Ticket-System, keine
              Bearbeitungs-Hotline.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Was wir nicht machen: Werbe-Kampagnen, SEO-Tracking-
              Dashboards, Newsletter-Funnel, Conversion-Funnel-
              Optimierungen. Das sind eigene Berufe. Wir bauen die
              Seite — wenn Sie das andere brauchen, empfehlen wir
              gerne spezialisierte Hamburger Kolleg:innen.
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Was wir machen: zuhören, ordnen, gestalten, technisch
              sauber bauen, betreuen. Das ist das ganze Angebot. Klein,
              klar, persönlich. So wie ein Schneider eine Hose macht
              und keine Lederjacken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WarumHamburg() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute -top-32 right-[8%] h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="bg-gold/60 gold-pulse inline-block h-1 w-8"
          />
          <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">
            Warum Hamburg
          </p>
        </div>
        <blockquote className="relative mt-10 max-w-4xl">
          <span
            aria-hidden="true"
            className="serif text-gold/40 absolute -top-12 -left-6 text-[10rem] leading-none"
          >
            „
          </span>
          <p className="serif text-balance text-[1.7rem] font-normal leading-[1.25] tracking-[-0.015em] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.12]">
            Hamburg hat Tausende kleine Betriebe.{" "}
            <span className="serif-italic text-background/75">
              Die meisten verdienen eine bessere Website
            </span>{" "}
            als die, die sie haben.
          </p>
        </blockquote>
        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-6">
            <p className="text-background/85 text-[15px] leading-relaxed sm:text-[17px]">
              Wir sind in Hamburg. Wir kennen Eimsbüttel, Altona,
              Eppendorf, St. Pauli, Winterhude — die Cafés, die Praxen,
              die Friseure, die Werkstätten. Wir gehen durch die
              Straßen und sehen, wo eine gute Seite den Unterschied
              machen würde.
            </p>
            <p className="text-background/85 text-[15px] leading-relaxed sm:text-[17px]">
              Hamburg ist groß genug, dass jede Branche dichte
              Konkurrenz hat. Und klein genug, dass eine ordentliche
              Online-Sichtbarkeit Sie binnen Wochen sichtbar nach
              vorne bringt. Das ist der ideale Markt für gutes lokales
              Webdesign — und wir haben uns entschieden, genau hier
              zu bleiben.
            </p>
            <p className="serif-italic text-background pt-4 text-2xl">
              — Sitalo Atelier, Hamburg
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <Image
              src="/images/hamburg-speicherstadt.png"
              alt="Hamburg Speicherstadt zur goldenen Stunde — historische Backsteinspeicher entlang der Kanäle."
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="from-foreground/30 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section>
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="serif text-foreground max-w-2xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Sie haben ein Bild,{" "}
            <span className="serif-italic text-muted-foreground">
              wer wir sind?
            </span>{" "}
            Schreiben Sie uns kurz.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Anfrage starten
              <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
            <Link
              href="/kontakt"
              className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
            >
              Kontakt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

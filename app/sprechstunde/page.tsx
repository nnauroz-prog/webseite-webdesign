import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  nextSprechstunden,
  SPRECHSTUNDE_BEGINN_HHMM,
  SPRECHSTUNDE_ENDE_HHMM,
  SPRECHSTUNDE_RUFNUMMER,
  TYPISCHE_THEMEN,
} from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Sprechstunde — jeden ersten Donnerstag",
  description:
    "Anderthalb Stunden Telefonzeit im Monat, jeden ersten Donnerstag von 17 bis 18:30 Uhr. Auch für Nicht-Kunden, ohne Verkauf, ohne Anmeldung.",
  alternates: { canonical: "/sprechstunde" },
};

/**
 * `/sprechstunde` — feste monatliche Telefon-Sprechstunde.
 *
 * Konkrete Premium-Geste durch geschenkte Zeit. Erster Donnerstag
 * im Monat, 17:00–18:30 Uhr, Telefonnummer offen, ohne Verkauf.
 * Auch für Leute, die nie Kunde werden.
 *
 * Datum wird zur Build-Zeit aus Europe/Berlin-Logik berechnet —
 * die Seite kennt also die nächsten drei Termine ohne Pflege.
 */
export default function SprechstundePage() {
  const termine = nextSprechstunden(3);
  const next = termine[0];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Sprechstunde" />
      <main id="main" className="flex-1">
        <Hero next={next} />
        <WieAblauft />
        <TypischeThemen />
        <NaechsteTermine termine={termine} />
        <ClosingNote />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero({
  next,
}: {
  next: { iso: string; longLabel: string };
}) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Jeden ersten Donnerstag · ohne Anmeldung
        </p>
        <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Sprechstunde.
        </h1>
        <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
          Anderthalb Stunden, geschenkt.
        </p>
        <div className="border-foreground/15 mt-12 border-l-2 pl-6">
          <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
            Jeden ersten Donnerstag im Monat sind wir von{" "}
            {SPRECHSTUNDE_BEGINN_HHMM} bis {SPRECHSTUNDE_ENDE_HHMM} Uhr
            am Telefon — für alle, die eine Frage rund um die eigene
            Website haben. Auch wenn Sie nie Kunde werden. Keine
            Anmeldung, kein Verkaufsgespräch, keine Folgeangebote.
            Sie rufen an, wir hören zu, beantworten so präzise wie
            möglich.
          </p>
          <p className="text-foreground/85 mt-5 text-pretty text-[17px] leading-[1.7]">
            Das ist die einzige Werbung, die wir uns leisten — geschenkte
            Stunden statt bezahlte Klicks. Wir glauben, das ist auf
            lange Sicht der ehrlichere Tausch.
          </p>
        </div>

        {/* Nächster Termin als prominente Plakette */}
        <aside
          aria-label="Nächste Sprechstunde"
          className="border-foreground/15 bg-card/60 ring-foreground/5 mt-14 rounded-2xl border p-6 ring-1 sm:p-8"
        >
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
            Nächste Sprechstunde
          </p>
          <p className="serif text-foreground mt-3 text-balance text-3xl font-normal leading-snug tracking-[-0.01em] sm:text-4xl">
            {next.longLabel}
          </p>
          <p className="text-foreground/80 mt-3 text-[15.5px]">
            {SPRECHSTUNDE_BEGINN_HHMM}–{SPRECHSTUNDE_ENDE_HHMM} Uhr ·{" "}
            <span className="font-mono tabular-nums">
              {SPRECHSTUNDE_RUFNUMMER}
            </span>
          </p>
          <a
            href="tel:+4915224437370"
            className="bg-foreground text-background hover:bg-foreground/90 group mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium tracking-tight"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Anrufen am Termin
          </a>
        </aside>
      </div>
    </section>
  );
}

function WieAblauft() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Wie es abläuft
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          Vier Sätze,{" "}
          <span className="serif-italic text-muted-foreground">
            mehr braucht es nicht.
          </span>
        </h2>
        <ol className="divide-border/40 mt-10 divide-y">
          {[
            "Sie wählen die Nummer am Termin. Wenn besetzt: kurz warten, wir rufen zurück.",
            "Sie sagen in zwei, drei Sätzen, was Sie wissen wollen.",
            "Wir antworten so konkret wie möglich. Wenn wir nicht weiterkönnen, sagen wir auch das.",
            "Sie legen auf. Es gibt kein Follow-up, keine Mail, keinen Newsletter.",
          ].map((line, i) => (
            <li
              key={i}
              className="grid items-baseline gap-5 py-6 sm:grid-cols-[3rem_1fr] sm:gap-8 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="serif-italic text-gold text-2xl font-normal leading-none tabular-nums sm:text-3xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-foreground/85 text-pretty text-[16px] leading-[1.65]">
                {line}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function TypischeThemen() {
  return (
    <section className="bg-foreground text-background border-foreground/10 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:py-28">
        <p className="text-background/65 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Damit niemand denkt, seine Frage sei zu klein
        </p>
        <h2 className="serif mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Sechs Fragen,{" "}
          <span className="serif-italic text-background/65">
            die hier oft gestellt werden.
          </span>
        </h2>
        <ol className="border-background/15 mt-12 divide-y divide-background/15 border-t border-b">
          {TYPISCHE_THEMEN.map((thema, i) => (
            <li
              key={i}
              className="flex items-baseline gap-6 py-6 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="serif-italic text-background/45 text-xl font-normal leading-none tabular-nums w-8"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-background/90 text-pretty text-[16px] leading-[1.65]">
                {thema}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-background/65 mt-10 max-w-lg text-pretty text-[14.5px] leading-relaxed">
          Wenn Ihre Frage nicht in dieser Liste steht: gerade dann
          rufen Sie an. Wir nehmen die Liste hier rein, damit niemand
          denkt, seine Frage sei zu trivial oder zu speziell. Sie
          ist es selten.
        </p>
      </div>
    </section>
  );
}

function NaechsteTermine({
  termine,
}: {
  termine: { iso: string; longLabel: string }[];
}) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Auch im Kalender vormerken
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          Drei nächste Termine,{" "}
          <span className="serif-italic text-muted-foreground">
            zur Hand.
          </span>
        </h2>
        <ol className="divide-border/40 mt-10 divide-y">
          {termine.map((t) => (
            <li
              key={t.iso}
              className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7"
            >
              <span className="text-foreground text-xl font-medium tracking-[-0.01em] sm:text-2xl">
                {t.longLabel}
              </span>
              <span className="text-muted-foreground font-mono text-[13px] tabular-nums">
                {SPRECHSTUNDE_BEGINN_HHMM}–{SPRECHSTUNDE_ENDE_HHMM} Uhr
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingNote() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
          Wenn der erste Donnerstag zu weit weg ist,{" "}
          <span className="serif-italic text-muted-foreground">
            buchen Sie einen eigenen 30-Minuten-Termin.
          </span>
        </p>
        <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
          Die Sprechstunde ist die offene, ungeplante Variante. Wenn
          Sie ein konkretes Vorhaben besprechen wollen und die nächste
          Sprechstunde nicht reicht, holen Sie sich einen eigenen
          Termin — gleicher Mensch, mehr Zeit, planbar.
        </p>
        <div className="border-border/40 mt-12 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <Link
            href="/journal"
            className="text-foreground inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
          >
            Lieber lesen: Journal
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/termin"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
          >
            30-Minuten-Termin buchen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

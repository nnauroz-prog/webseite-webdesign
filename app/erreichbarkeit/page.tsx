import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ERREICHBARKEIT } from "@/lib/erreichbarkeit";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Erreichbarkeit — wann wir antworten",
  description:
    "Antwortzeit-Versprechen ohne Marketing-Geschwurbel. Was wir wann zusagen, was bewusst nicht, und was passiert, wenn wir im Urlaub sind.",
  alternates: { canonical: "/erreichbarkeit" },
  openGraph: {
    type: "website",
    title: "Erreichbarkeit — wann wir antworten",
    description:
      "Antwortzeit-Versprechen ohne Marketing-Geschwurbel.",
    url: `${SITE_URL}/erreichbarkeit`,
  },
};

/**
 * /erreichbarkeit — die unsichtbaren Verträge offen hinlegen.
 *
 * Aus der L7-Analyse: die größte Brand-Falle ist das implizite
 * „wir-gehen-immer-ans-Telefon", das nirgends einklagbar ist und
 * trotzdem als Versprechen wirkt. Diese Seite macht's einklagbar —
 * mit drei konkreten Zahlen (Antwortzeit-Fenster, Urlaubswochen,
 * Vertretungs-Scope) und einem ehrlichen Schlusssatz: was wir nicht
 * versprechen.
 *
 * Stilistisch geleant an /promises: editorial Long-Form-Prosa, keine
 * Feature-Karten-Reflex. Eyebrow oben, Headline, dann ein Fließtext
 * mit Drop-Cap, dann Marginalia. Numerische Werte aus
 * lib/erreichbarkeit.ts; alles dazwischen ist Hand-gepflegte Voice.
 */

export default function ErreichbarkeitPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Erreichbarkeit" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Article />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Article() {
  const f = ERREICHBARKEIT.fenster;
  const u = ERREICHBARKEIT.urlaub;
  const v = ERREICHBARKEIT.vertretung;

  return (
    <article className="relative">
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      {/* Marginalia rechts — wie ein Kapitel-Marker am Buchrand. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[40%] right-6 hidden -translate-y-1/2 lg:block"
      >
        <p
          className="text-muted-foreground/45 font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          § 07 · Antwort-Versprechen
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Headline — bewusst keine Eyebrow, bricht das Schema der
            anderen Seiten und signalisiert: das hier ist ein
            Versprechen, kein Service. */}
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.02]">
          Wir gehen ans Telefon.
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            So oft wir können.
          </span>
        </h1>

        {/* Lead mit Drop-Cap — gleiches Pattern wie auf /promises,
            damit die beiden Seiten als Schwester-Texte erkennbar
            sind: Promises = was wir liefern, Erreichbarkeit = wann
            wir antworten. */}
        <p className="text-foreground/85 mt-12 text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="drop-cap-3d serif text-ink-petrol float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            S
          </span>
          italo ist ein kleines Atelier, kein Konzern mit
          Schichtbetrieb. Wer in Hamburg arbeitet, hat einen Tag —
          nicht zwei, nicht drei in Schichten. Das heißt: wir
          antworten in Fenstern, nicht rund um die Uhr. Und damit
          das Versprechen „wir gehen ans Telefon" nicht zur leeren
          Marketing-Zeile wird, schreiben wir hier auf, was Sie wann
          erwarten dürfen.
        </p>

        {/* § I — Antwortzeit-Fenster */}
        <Roman num="I" title="Vier Fenster, sonst nichts" />

        <p className="text-foreground/80 mt-6 text-pretty text-[16.5px] leading-[1.7]">
          Im Werktagsfenster zwischen neun und achtzehn Uhr sind wir
          an der Mail — die meiste Antwort kommt {f[0].zeit.toLowerCase()}.
          Anrufe gehen oft direkt durch; wenn nicht, rufen wir noch
          am selben Tag zurück. Wir versprechen nicht „sofort". Aber
          „bis zum Abend".
        </p>

        <p className="text-foreground/80 mt-5 text-pretty text-[16.5px] leading-[1.7]">
          Nach achtzehn Uhr machen wir bewusst zu. Das ist nicht
          Faulheit, das ist Selbstschutz: wer nachts arbeitet, baut
          am Tag schlechter. Was abends reinkommt, beantworten wir{" "}
          {f[1].zeit.toLowerCase()}. Anrufe nachts gehen auf die
          Mailbox, mit klarer Ansage.
        </p>

        <p className="text-foreground/80 mt-5 text-pretty text-[16.5px] leading-[1.7]">
          Samstag und Sonntag bleibt die Mail liegen, ehrlich gesagt.
          Reguläre Anfragen vom Wochenende lesen wir{" "}
          {f[2].zeit.toLowerCase()}. Die einzige Ausnahme: Ihre Seite
          ist live runter. Dafür gibt es eine Notfall-Nummer, die
          auch am Samstag klingelt — niemand sagt freitags um drei,
          dass das Kontaktformular jetzt bis Montag streiken darf.
        </p>

        {/* § II — Urlaub */}
        <Roman num="II" title={`${u.wochenProJahr} Wochen im Jahr`} />

        <p className="text-foreground/80 mt-6 text-pretty text-[16.5px] leading-[1.7]">
          Wir sind {u.wochenProJahr} Wochen im Jahr komplett weg, in
          maximal {u.maxAmStueck}-Wochen-Blöcken am Stück. Im
          Auto-Reply steht das konkrete Rückkehr-Datum, nicht der
          übliche „bald wieder da"-Satz, der für den Lesenden nichts
          bedeutet. Wenn Sie wissen, wann wir antworten, können Sie
          planen — das ist der ganze Unterschied.
        </p>

        <p className="text-foreground/80 mt-5 text-pretty text-[16.5px] leading-[1.7]">
          Im Akutfall — Live-Seite kippt, Domain reagiert nicht,
          Mailserver schweigt — liest in dieser Zeit{" "}
          {v.rolle.toLowerCase()} mit. Sie kann technisch handeln,
          wenn etwas wirklich brennt. Sie schreibt nicht im
          Sitalo-Ton, sie führt keine Strategie-Gespräche, und sie
          baut keine neuen Layouts. Aber Ihre Seite ist wieder oben,
          bevor jemand auffällt.
        </p>

        {/* Pull-Quote als visueller Bruch */}
        <div className="border-ink-petrol/60 mt-16 border-l-2 pl-6 sm:pl-10">
          <p className="serif text-foreground text-balance text-2xl leading-[1.25] tracking-[-0.015em] sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
            Lieber weniger versprechen
            <br />
            <span className="serif-italic text-muted-foreground">
              und das halten.
            </span>
          </p>
        </div>

        {/* § III — Was wir nicht versprechen */}
        <Roman num="III" title="Was wir bewusst nicht zusagen" />

        <p className="text-foreground/80 mt-6 text-pretty text-[16.5px] leading-[1.7]">
          Wir versprechen keine Antwort in Minuten. Wir versprechen
          keine 24/7-Erreichbarkeit. Wir versprechen keine Hotline
          mit mehreren Personen, die Sie abwechselnd betreuen. Und
          wir versprechen keine garantierte Reaktion am Wochenende
          auf eine reguläre Anfrage.
        </p>

        <p className="text-foreground/80 mt-5 text-pretty text-[16.5px] leading-[1.7]">
          Andere Anbieter versprechen das alles in den Verkaufstexten
          — und brechen es lautlos in der Realität. Wir machen's
          umgekehrt. Weniger im Marketing-Text, mehr im Alltag. Die
          Rechnung geht für beide Seiten besser auf.
        </p>

        {/* § IV — Fallback */}
        <Roman num="IV" title="Wenn doch mal nichts kommt" />

        <p className="text-foreground/80 mt-6 text-pretty text-[16.5px] leading-[1.7]">
          Falls die Antwort innerhalb des oben genannten Fensters
          ausbleibt, ist das nie Absicht. Wir sind kein Konzern, der
          Tickets im System untergehen lässt — wir sind ein
          Atelier, in dem entweder Krankheit oder ein technisches
          Problem auf unserer Seite zugeschlagen hat. Beides
          passiert; bei einem von zehntausend Tagen ist die
          ehrliche Quote.
        </p>

        <p className="text-foreground/80 mt-5 text-pretty text-[16.5px] leading-[1.7]">
          Schreiben Sie in dem Fall eine zweite Mail mit dem Wort
          „dringend" im Betreff — das filtern wir prioritär raus.
          Wenn auch das nach einem Tag nichts ergibt, rufen Sie auf
          der Notfall-Nummer an, auch wenn Sie sonst nur per Mail
          schreiben würden. Wenn niemand abnimmt: eine SMS mit
          Ihrem Namen und einer Rückrufnummer auf dieselbe Nummer.
          Bei jedem dieser Schritte hat sich noch jemand gemeldet.
        </p>

        {/* Schluss */}
        <div className="mt-20 sm:mt-24">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl">
            Wir können nicht überall sein.
            <br />
            <span className="serif-italic text-muted-foreground">
              Aber Sie wissen, wo Sie uns kriegen.
            </span>
          </p>

          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/kontakt"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
            >
              Zum Kontakt
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sprechstunde"
              className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
            >
              Lieber zur Sprechstunde
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Numerierte H2 mit Roman-Ziffer im Italic-Serif — gleiches Pattern
 * wie auf den /journal-Essays. Visueller Beat zwischen Prosa-Blöcken,
 * ohne dass es sich wie ein Feature-Grid anfühlt.
 */
function Roman({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="mt-16 flex items-baseline gap-5 text-balance text-2xl font-semibold leading-snug tracking-[-0.02em] sm:mt-20 sm:text-3xl">
      <span
        aria-hidden="true"
        className="serif-italic text-muted-foreground/70 shrink-0 text-2xl font-normal tracking-tight sm:text-3xl"
      >
        {num}.
      </span>
      <span className="text-foreground">{title}</span>
    </h2>
  );
}

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
    "Unsere Antwortzeiten: was wir wann zusagen, was bewusst nicht, und was gilt, wenn wir im Urlaub sind.",
  alternates: { canonical: "/erreichbarkeit" },
  openGraph: {
    type: "website",
    title: "Erreichbarkeit — wann wir antworten",
    description:
      "Unsere Antwortzeiten, und was im Urlaub gilt.",
    url: `${SITE_URL}/erreichbarkeit`,
  },
};

const CONTACT_EMAIL = "info@sitalo.de";

/** Nur den ersten Buchstaben klein, damit „Eine Hamburger
 *  Webentwicklerin …“ mitten im Satz richtig geschrieben bleibt. */
function klein(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** Erster Buchstabe groß, für Tabellenzellen („Meist in vier Stunden“). */
function gross(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * /erreichbarkeit — wann wir antworten, schriftlich.
 *
 * Oben die Antwortzeiten als Fahrplan-Tabelle (Werte aus
 * lib/erreichbarkeit.ts), darunter Fließtext zu Feierabend, Urlaub
 * und Vertretung, dann die Schritte, wenn keine Antwort kommt (echte
 * Reihenfolge, deshalb nummeriert). Am Schluss die Telefonnummer.
 */
export default function ErreichbarkeitPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Erreichbarkeit" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Kopf />
        <Text />
        <WennNichtsKommt />
        <Kontakt />
      </main>
      <MarketingFooter />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kopf: Überschrift links, Antwortzeiten als Fahrplan rechts.
 * ---------------------------------------------------------------- */
function Kopf() {
  const fenster = ERREICHBARKEIT.fenster;
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="label-mono text-muted-foreground">Erreichbarkeit</p>
          <h1 className="mt-6 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[3.6rem]">
            Werktags antworten wir meist am selben Tag
          </h1>
          <p className="text-muted-foreground mt-6 max-w-md text-pretty text-[16.5px] leading-relaxed sm:text-lg">
            Wir sind ein kleines Büro in Hamburg und antworten in festen Zeitfenstern, nicht rund um die Uhr. Hier steht,
            was Sie wann erwarten können.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7 lg:pt-2">
          <table className="w-full border-collapse text-left">
            <caption className="label-mono text-muted-foreground pb-3 text-left">Antwortzeiten</caption>
            <thead>
              <tr className="border-foreground border-b-2">
                <th scope="col" className="label-mono text-muted-foreground w-[48%] py-2 pr-4 text-[11px] font-medium">
                  Sie melden sich
                </th>
                <th scope="col" className="label-mono text-muted-foreground py-2 text-[11px] font-medium">
                  Wir antworten
                </th>
              </tr>
            </thead>
            <tbody>
              {fenster.map((f) => (
                <tr key={f.label} className="border-border border-b align-baseline">
                  <th scope="row" className="py-4 pr-4 text-[15px] font-normal leading-snug sm:text-[16px]">
                    {f.label}
                  </th>
                  <td
                    className="py-4 text-[1.05rem] leading-snug tracking-[-0.01em] sm:text-[1.2rem]"
                    style={{ fontStretch: "108%", fontWeight: 680 }}
                  >
                    {gross(f.zeit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Fließtext: Feierabend, Wochenende, Urlaub, was wir nicht zusagen.
 * ---------------------------------------------------------------- */
function Text() {
  const f = ERREICHBARKEIT.fenster;
  const u = ERREICHBARKEIT.urlaub;
  const v = ERREICHBARKEIT.vertretung;

  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          <Absatz titel="Feierabend und Wochenende">
            <p>
              Werktags zwischen 9 und 18 Uhr lesen wir laufend Mails und antworten {f[0].zeit}. Anrufe nehmen wir oft
              direkt an. Wenn nicht, rufen wir am selben Tag zurück.
            </p>
            <p>
              Um 18 Uhr machen wir Feierabend, denn wer nachts arbeitet, baut am nächsten Tag schlechtere Seiten. Was abends
              ankommt, beantworten wir {f[1].zeit}. Nachts geht das Telefon auf die Mailbox.
            </p>
            <p>
              Am Wochenende bleibt die Mail liegen. Reguläre Anfragen vom Samstag oder Sonntag beantworten wir{" "}
              {f[2].zeit}. Ausnahme: Ihre Seite ist nicht mehr erreichbar. Dafür gibt es eine Notfall-Nummer, die
              auch am Samstag klingelt.
            </p>
          </Absatz>

          <Absatz titel={`Urlaub: ${u.wochenProJahr} Wochen im Jahr`}>
            <p>
              Wir sind {u.wochenProJahr} Wochen im Jahr nicht da, höchstens {u.maxAmStueck} Wochen am Stück. In der
              automatischen Antwort steht dann das Datum, an dem wir zurück sind, damit Sie planen können.
            </p>
            <p>
              Fällt in dieser Zeit Ihre Seite aus oder reagiert die Domain nicht, liest {klein(v.rolle)} mit. Sie kann
              technisch eingreifen und bringt die Seite wieder ans Laufen. Texte, Beratung und neue Seiten warten, bis wir
              zurück sind.
            </p>
          </Absatz>
        </div>

        <div className="border-border mt-14 grid gap-6 border-t pt-10 lg:grid-cols-12 lg:gap-8">
          <h2 className="text-balance text-[1.6rem] leading-[1.1] tracking-[-0.025em] sm:text-[2rem] lg:col-span-5">
            Wir sagen nur zu, was in der Tabelle oben steht.
          </h2>
          <div className="text-foreground/85 space-y-4 text-[16.5px] leading-[1.7] lg:col-span-6 lg:col-start-7">
            <p>
              Eine Antwort innerhalb von Minuten zum Beispiel wäre ein Versprechen, das ein kleines Büro nicht halten
              kann. Wir nennen lieber eine Frist, die wir auch an einem vollen Tag einhalten.
            </p>
            <p>Dafür sprechen Sie jedes Mal mit denselben Leuten, und die kennen Ihre Seite.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Absatz({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="lg:col-span-6">
      <h2 className="text-balance text-[1.6rem] leading-[1.1] tracking-[-0.025em] sm:text-[2rem]">{titel}</h2>
      <div className="text-foreground/85 mt-5 space-y-4 text-[16.5px] leading-[1.7]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Wenn keine Antwort kommt: drei Schritte in fester Reihenfolge.
 * ---------------------------------------------------------------- */
const SCHRITTE: { titel: string; text: string }[] = [
  {
    titel: "Zweite Mail mit „dringend“ im Betreff",
    text: "Solche Mails sortieren wir nach oben.",
  },
  {
    titel: "Nach einem Tag: die Notfall-Nummer anrufen",
    text: "Auch wenn Sie sonst lieber schreiben.",
  },
  {
    titel: "Niemand nimmt ab: eine SMS schicken",
    text: "An dieselbe Nummer, mit Ihrem Namen und einer Rückrufnummer.",
  },
];

function WennNichtsKommt() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
            Wenn keine Antwort kommt
          </h2>
          <p className="text-muted-foreground mt-5 text-[16px] leading-relaxed">
            Bleibt die Antwort im genannten Zeitfenster aus, ist meist jemand krank oder bei uns streikt die Technik.
            Dann hilft diese Reihenfolge.
          </p>
        </div>
        <ol className="border-foreground border-t lg:col-span-7 lg:col-start-6">
          {SCHRITTE.map((s, i) => (
            <li key={s.titel} className="border-border grid grid-cols-[2.5rem_1fr] gap-x-4 border-b py-6 sm:grid-cols-[3.5rem_1fr]">
              <span className="text-gold font-mono text-[13px] font-medium tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[1.15rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.25rem]">{s.titel}</p>
                <p className="text-muted-foreground mt-1.5 text-[15.5px] leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Kontakt: die Nummer groß.
 * ---------------------------------------------------------------- */
function Kontakt() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <p className="label-mono text-stahl-hell">{ERREICHBARKEIT.fenster[0].label}</p>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4rem] lg:text-[4.4rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160 7621876
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16px] leading-relaxed">
            Wer lieber schreibt, schickt eine Mail. Für ein längeres Gespräch gibt es die Sprechstunde.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/kontakt" className="btn-signal">
              Zum Kontakt <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sprechstunde"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              Zur Sprechstunde
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

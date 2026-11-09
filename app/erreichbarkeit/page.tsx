import type { Metadata } from "next";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  ERREICHBARKEIT,
  TELEFON_ANZEIGE,
  TELEFON_HREF,
} from "@/lib/erreichbarkeit";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Erreichbarkeit · wann wir antworten",
  description:
    "Unsere Antwortzeiten: was wir wann zusagen, was bewusst nicht, und was gilt, wenn wir im Urlaub sind.",
  alternates: { canonical: "/erreichbarkeit" },
  openGraph: {
    type: "website",
    title: "Erreichbarkeit · wann wir antworten",
    description: "Unsere Antwortzeiten, und was im Urlaub gilt.",
    url: `${SITE_URL}/erreichbarkeit`,
  },
};

/** Erster Buchstabe groß, für Tabellenzellen („Meist am selben Werktag“). */
function gross(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * /erreichbarkeit — wann wir antworten, schriftlich.
 *
 * Oben die Antwortzeiten als Fahrplan-Tabelle (Werte aus
 * lib/erreichbarkeit.ts), darunter Fließtext zu Feierabend, Wochenende
 * und Urlaub, dann die Schritte, wenn keine Antwort kommt (echte
 * Reihenfolge, deshalb nummeriert). Am Schluss die Telefonnummer.
 */
export default function ErreichbarkeitPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Erreichbarkeit"
          eyebrow="Erreichbarkeit · Hamburg"
          titel="Werktags antworten wir meist am selben Tag"
          unter="Wir sind ein kleines Büro in Hamburg und antworten in festen Zeitfenstern, nicht rund um die Uhr. Hier steht, was Sie wann erwarten können."
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-typing.webp"
              alt="Hände auf einer Laptop-Tastatur an einem hellen Schreibtisch"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 50%"
            />
          }
          unterschrift="Werktags 9 bis 18 Uhr am Schreibtisch"
        />
        <Antwortzeiten />
        <Text />
        <WennNichtsKommt />
        <KontaktKarte
          id="abschluss"
          titel="Werktags von 9 bis 18 Uhr erreichen Sie uns direkt am Telefon."
          zeile="Wer lieber schreibt, nutzt das Anfrageformular. Für ein längeres Gespräch gibt es die Sprechstunde."
          pille={{ href: "/kontakt", label: "Zum Kontakt" }}
          link={{ href: "/sprechstunde", label: "Zur Sprechstunde" }}
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Erreichbarkeit" />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Antwortzeiten als Fahrplan-Tabelle auf weißer Karte.
 * ---------------------------------------------------------------- */
function Antwortzeiten() {
  const fenster = ERREICHBARKEIT.fenster;
  return (
    <Abschnitt
      id="antwortzeiten"
      fett="Antwortzeiten."
      grau="Was Sie wann erwarten können."
    >
      <div className={u.blatt}>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Antwortzeiten</caption>
          <thead>
            <tr className="border-b border-black/15">
              <th
                scope="col"
                className="notiz-mono w-[48%] pr-4 pb-3 font-normal"
              >
                Sie melden sich
              </th>
              <th scope="col" className="notiz-mono pb-3 font-normal">
                Wir antworten
              </th>
            </tr>
          </thead>
          <tbody>
            {fenster.map((f) => (
              <tr
                key={f.label}
                className="border-b border-black/10 align-baseline last:border-b-0"
              >
                <th
                  scope="row"
                  className="py-4 pr-4 text-[15px] leading-snug font-normal text-[#424245] sm:text-[17px]"
                >
                  {f.label}
                </th>
                <td className="py-4 text-[17px] leading-snug font-semibold tracking-[-0.016em] sm:text-[21px]">
                  {gross(f.zeit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Fließtext: Feierabend, Wochenende, Urlaub, was wir nicht zusagen.
 * ---------------------------------------------------------------- */
function Text() {
  const f = ERREICHBARKEIT.fenster;

  return (
    <section
      aria-label="Feierabend, Wochenende und Urlaub"
      className={u.abschnitt}
    >
      <div className="inhalt">
        <div className="grid gap-3 sm:gap-5 lg:grid-cols-12">
          <Absatz titel="Feierabend und Wochenende">
            <p>
              Werktags zwischen 9 und 18 Uhr lesen wir regelmäßig Mails und
              antworten {f[0].zeit}. Anrufe nehmen wir oft direkt an. Wenn
              nicht, rufen wir meist am selben Tag zurück.
            </p>
            <p>
              Nach 18 Uhr lesen wir keine Mails mehr. Einzige Ausnahme ist die
              Sprechstunde am ersten Donnerstag im Monat bis 18:30 Uhr. Was
              abends ankommt, beantworten wir {f[1].zeit}. Nachts geht das
              Telefon auf die Mailbox.
            </p>
            <p>
              Am Wochenende bleibt die Mail liegen. Anfragen vom Samstag oder
              Sonntag beantworten wir {f[2].zeit}. Ausnahme: Ihre Seite ist
              nicht mehr erreichbar. Dann rufen Sie auch am Wochenende unter{" "}
              <a
                href={TELEFON_HREF}
                className="text-gold-ink font-semibold whitespace-nowrap underline-offset-4 hover:underline"
              >
                {TELEFON_ANZEIGE}
              </a>{" "}
              an oder schicken eine SMS.
            </p>
          </Absatz>

          <Absatz titel="Urlaub">
            <p>
              Urlaub kündigen wir rechtzeitig vorher an, und in der
              automatischen Antwort steht, wann wir zurück sind. So können Sie
              planen.
            </p>
            <p>
              Ihre Seite läuft in dieser Zeit weiter, denn Hosting und Backups
              laufen automatisch. Änderungen und neue Wünsche erledigen wir,
              sobald wir zurück sind.
            </p>
          </Absatz>
        </div>

        <div
          className={`${u.blatt} mt-3 grid gap-6 sm:mt-5 lg:grid-cols-12 lg:gap-8`}
        >
          <h2 className="text-[24px] leading-[1.17] font-semibold tracking-[-0.02em] text-balance sm:text-[28px] lg:col-span-5">
            Wir sagen nur zu, was in der Tabelle oben steht.
          </h2>
          <div className="space-y-4 text-[17px] leading-[1.5] tracking-[-0.022em] text-[#424245] lg:col-span-7">
            <p>
              Eine Antwort innerhalb von Minuten zum Beispiel wäre ein
              Versprechen, das ein kleines Büro nicht halten kann. Wir nennen
              lieber eine Frist, die wir auch an einem vollen Tag einhalten.
            </p>
            <p>
              Dafür sprechen Sie jedes Mal mit uns selbst, und wir kennen Ihre
              Seite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Absatz({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${u.blatt} lg:col-span-6`}>
      <h2 className="text-[24px] leading-[1.17] font-semibold tracking-[-0.02em] text-balance sm:text-[28px]">
        {titel}
      </h2>
      <div className="mt-4 space-y-4 text-[17px] leading-[1.5] tracking-[-0.022em] text-[#424245]">
        {children}
      </div>
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
    titel: `Nach einem Werktag: unter ${TELEFON_ANZEIGE} anrufen`,
    text: "Auch wenn Sie sonst lieber schreiben.",
  },
  {
    titel: "Niemand nimmt ab: eine SMS schicken",
    text: "An dieselbe Nummer, mit Ihrem Namen und einer Rückrufnummer.",
  },
];

function WennNichtsKommt() {
  return (
    <Abschnitt
      id="keine-antwort"
      fett="Wenn keine Antwort kommt."
      grau="Dann hilft diese Reihenfolge."
      unter="Bleibt die Antwort länger aus als angekündigt, ist etwas dazwischengekommen."
    >
      <ol className="divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10">
        {SCHRITTE.map((s, i) => (
          <li
            key={s.titel}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-6 sm:grid-cols-[3.5rem_1fr]"
          >
            <span className="notiz-mono text-gold-ink pt-1 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-[19px] leading-snug font-semibold tracking-[-0.016em] sm:text-[21px]">
                {s.titel}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
                {s.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Abschnitt>
  );
}

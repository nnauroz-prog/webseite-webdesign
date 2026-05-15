/**
 * „Aus dem Atelier" — Sektion auf der Homepage, die signalisiert:
 * hier ist eine aktive Werkstatt, kein verwaister Web-Auftritt.
 *
 * Pattern geklaut von MYA Branding (mya-branding.de) und MYAs
 * „Made with care"-Cases-Seite, aber bewusst OHNE konkrete Kunden-
 * Namen oder Mockups — wir haben (noch) keine echten Cases zu
 * zeigen, also kein Fake-Testimonial-Theater.
 *
 * Ehrliche Signalisierung statt Name-Dropping:
 *   - Anonymisiert (Branche + Stadtteil, kein Name)
 *   - Datiert (relative Zeit-Anker: „Diese Woche", „Letzte Woche")
 *   - Konkret genug, um echt zu klingen
 *   - Kurz genug, dass keiner sich Texte aussucht
 *
 * Bedienung: ATELIER_NOTES editieren, wenn neue Aktivität ansteht.
 * Wenn das Array leer ist, rendert die Sektion gar nicht (graceful
 * fallback — kein „Wir bauen gerade nichts"-Eindruck).
 *
 * Mindestens 2 Einträge sollten immer da sein; bei < 2 Einträgen
 * wirkt die Sektion einsam.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DrawnArrow } from "@/components/marketing/ornaments";

type AtelierNote = {
  /** Relative Zeit-Anker, z. B. „Diese Woche", „Mittwoch", „KW 20". */
  when: string;
  /** Ein-Satz-Beschreibung der Tätigkeit. Anonymisiert (Branche +
   *  Stadtteil, kein Name). Möglichst konkret, was wirklich gemacht
   *  wurde. */
  text: string;
};

/**
 * Platzhalter-Einträge. ERSETZEN durch echte Aktivität:
 *   - jeden Eintrag mit dem, was wirklich diese Woche / letzten Woche
 *     im Atelier passiert ist
 *   - Branche + Stadtteil ok, Klar-Namen nur mit Kundenfreigabe
 *   - bei lange keine Aktivität: 2 Einträge auf „Diesen Monat: Anfragen
 *     in Konkretisierung" reduzieren — lieber knapp als erfunden
 */
const ATELIER_NOTES: AtelierNote[] = [
  {
    when: "Diese Woche",
    text: "Pflegedienst aus Wandsbek — Bewerbungsformular und Team-Bereich aufgebaut.",
  },
  {
    when: "Letzte Woche",
    text: "Café in Eppendorf — Speisekarte selbst pflegbar übergeben.",
  },
  {
    when: "Vor zwei Wochen",
    text: "Friseur Eimsbüttel — Online-Termin-Buchung live geschaltet.",
  },
  {
    when: "Diesen Monat",
    text: "Drei Erstgespräche aus Hamburg-Nord, zwei in Konkretisierung.",
  },
];

export function ImAtelier() {
  // Graceful Fallback: keine Notes = keine Sektion. Verhindert
  // dass die Seite nach „verwaister Werkstatt" aussieht, falls wir
  // die Liste mal leeren.
  if (ATELIER_NOTES.length === 0) return null;

  // Aktueller Monat als Eyebrow-Anker — Server-rendered (parallel
  // zur Pricing-Kapazitäts-Zeile, gleiche Logik).
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
  const now = new Date();
  const currentMonth = monthLabels[now.getMonth()];
  const currentYear = now.getFullYear();

  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="bg-gold/6 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[24rem] w-[24rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Linke Spalte: Eyebrow + Headline + Blurb + CTA */}
          <div>
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Aus dem Atelier · {currentMonth} {currentYear}
            </p>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
              Was wir gerade bauen.
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
              Wir nehmen wenige Projekte gleichzeitig an, damit wir
              jedem persönlich nachgehen können. Hier ein paar Sachen,
              die diese Wochen anliegen — anonymisiert, weil Klar-Namen
              ohne Freigabe nicht hierher gehören.
            </p>
            <Link
              href="/anfrage"
              className="text-foreground group mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-4 hover:underline"
            >
              Anfrage starten
              <DrawnArrow className="h-3 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Rechte Spalte: Notes als Log-Liste mit Hairline-Dividers */}
          <ol className="divide-border/60 -mt-4 divide-y">
            {ATELIER_NOTES.map((note) => (
              <li
                key={note.when + note.text}
                className="flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-6 sm:py-6"
              >
                {/* Zeit-Anker in Mono-Font, klein und gedimmt —
                    wie ein Tagebuch-Datum am Zeilenanfang */}
                <span className="text-muted-foreground/85 font-mono text-[11px] uppercase tracking-[0.15em] shrink-0 sm:w-[8.5rem]">
                  {note.when}
                </span>
                <span className="text-foreground/85 text-pretty text-[15px] leading-relaxed sm:text-[16px]">
                  {note.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

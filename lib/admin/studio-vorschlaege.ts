/**
 * Vorschläge für die Redaktion im Story-Studio: zwei bis vier Aufträge
 * zum Antippen, gebaut aus dem, was wirklich ansteht (Anlass-Kalender in
 * lib/anlaesse.ts) und dem Spruch des Tages. Der letzte Vorschlag ist
 * immer der leere Auftrag „Mach was zu heute“.
 *
 * Nur auf dem Server gebraucht (die Seite baut die Vorschläge); reine
 * Funktion, damit die Tests sie laden können.
 */
import { formatShortDay } from "@/lib/admin/berlin-time";
import {
  anlaesseFuer,
  naechsteAnlaesse,
  TERMINE_HAMBURG,
} from "@/lib/anlaesse";
import { AUFTRAG_MAX } from "@/lib/redaktion/vertrag";

export type Vorschlag = {
  /** Steht auf dem Knopf: „Black Friday in Sicht“. */
  label: string;
  /** Geht als Auftrag an die Redaktion; leer heißt „Mach was zu heute“. */
  auftrag: string;
};

/** So viele Vorschläge höchstens, der leere Auftrag mitgezählt. */
export const VORSCHLAEGE_MAX = 4;
/** So weit schaut „in Sicht“ voraus, der Tag selbst mitgezählt. */
const VORAUS_TAGE = 14;
/** Stille Tage: kein Vorschlag auf einen Tipp (von Hand geht es trotzdem). */
const STILL = new Set(["Totensonntag", "Karfreitag"]);

/** „Weihnachtsmarkt eröffnet“ → „Weihnachtsmarkt“ (für „… in Sicht“). */
function ohneBeginn(name: string): string {
  return name.replace(/\s+(beginnt|eröffnet|startet)$/, "");
}

/**
 * Vorschläge für einen Kalendertag (yyyy-mm-dd):
 * - was an dem Tag ansteht („Winterdom läuft“), höchstens zwei,
 * - was in den nächsten zwei Wochen kommt („Black Friday in Sicht“),
 *   ohne laufende Termine und letzte Tage,
 * - gibt es weniger als zwei Anlässe: der Spruch des Tages,
 * - zuletzt immer der leere Auftrag.
 */
export function studioVorschlaege(
  tag: string,
  heute: string,
  spruch?: string | null,
): Vorschlag[] {
  const liste: Vorschlag[] = [];
  const platz = VORSCHLAEGE_MAX - 1;
  const gesehen = new Set<string>();
  const dazu = (label: string, auftrag: string) => {
    if (liste.length >= platz || gesehen.has(label)) return;
    gesehen.add(label);
    liste.push({ label, auftrag: auftrag.slice(0, AUFTRAG_MAX) });
  };

  const amTag = anlaesseFuer(tag).filter((a) => !STILL.has(a.name));
  for (const a of amTag.slice(0, 2))
    dazu(a.name, `Story-Serie zum Anlass „${a.name}“.`);

  // Was schon läuft oder gerade endet, ist kein Ausblick.
  const zustand = new Set(
    TERMINE_HAMBURG.flatMap((t) => [t.laeuft, t.schluss]).filter(
      (n): n is string => !!n,
    ),
  );
  for (const a of naechsteAnlaesse(tag, VORAUS_TAGE)) {
    if (a.datum <= tag || STILL.has(a.name) || zustand.has(a.name)) continue;
    dazu(
      `${ohneBeginn(a.name)} in Sicht`,
      `Story-Serie zum Anlass „${a.name}“ am ${formatShortDay(a.datum)}`,
    );
  }

  if (liste.length < 2 && spruch)
    dazu(
      "Zum Spruch des Tages",
      `Story-Serie zum Spruch des Tages: „${spruch}“`,
    );

  liste.push({
    label: tag === heute ? "Mach was zu heute" : "Mach was zu diesem Tag",
    auftrag: "",
  });
  return liste;
}

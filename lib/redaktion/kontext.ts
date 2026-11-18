/**
 * Die Unterlagen für die Redaktion: was am Tag der Serie ansteht, was
 * an diesem Tag schon erscheint und was zuletzt geschrieben wurde. Aus
 * ihnen entstehen die Prompts (lib/redaktion/prompts.ts) und die Liste
 * der Sätze, die nicht noch einmal vorkommen sollen.
 *
 * Rein: Die Karten und Serien kommen als Argument (auf dem Server aus
 * lib/posts-aktuell.ts, lib/serien-aktuell.ts und der Datenbank, siehe
 * lib/redaktion/redaktion.ts), damit Tests eigene einsetzen können.
 */
import type { BekannterSatz } from "@/lib/redaktion/pruefung";
import type { AktuelleKarte, Spruch } from "@/lib/sprueche-data";
import type { StorySerie } from "@/lib/story-serie";

import {
  addDays,
  berlinDateIso,
  daysBetween,
  formatLongDay,
  formatShortDay,
} from "@/lib/admin/berlin-time";
import { anlaesseFuer, naechsteAnlaesse, type Anlass } from "@/lib/anlaesse";

/** Wie weit der Blick nach vorn reicht (Tage nach dem Tag der Serie). */
export const VORSCHAU_TAGE = 14;
/** So viele frühere Serien sieht der Themen-Scout. */
export const SERIEN_IM_BLICK = 8;
/** So viele Karten aus dem Vorrat zeigen der Texterin den Ton. */
export const TONBEISPIELE = 4;

export type KontextQuellen = {
  /** Karten zum Tag je Kalendertag (lib/posts-aktuell.ts). */
  karten: Readonly<Record<string, readonly AktuelleKarte[]>>;
  /** Serien des Tages aus dem Morgenlauf (lib/serien-aktuell.ts). */
  serienAktuell: Readonly<Record<string, StorySerie>>;
  /** Gespeicherte Serien aus Aufträgen, neueste zuerst. */
  gespeichert: readonly { datum: string; serie: StorySerie }[];
  /** Vorrat: Sprüche des Tages und Zusatz-Posts. */
  vorrat: readonly Spruch[];
};

export type KontextKarte = {
  kicker: string;
  text: string;
  zusatz: string;
  anlass: string;
};

export type KontextSerie = { titel: string; datum: string; saetze: string[] };

export type RedaktionKontext = {
  /** Tag der Serie (yyyy-mm-dd). */
  datum: string;
  /** „Freitag, 27. November 2026“ */
  datumLang: string;
  /** Der heutige Tag in Hamburg, in derselben Form. */
  heuteLang: string;
  /** Tage von heute bis zum Tag der Serie (−1 gestern, 0 heute, 1 morgen …). */
  abstand: number;
  /** Was am Tag der Serie ansteht. */
  anlaesse: Anlass[];
  /** Was in den Tagen danach ansteht. */
  kommend: Anlass[];
  /** Karten, die an diesem Tag schon erscheinen. */
  karten: KontextKarte[];
  /** Die letzten Serien, neueste zuerst. */
  serien: KontextSerie[];
  /** Karten aus dem Vorrat, die den Ton zeigen (je Tag andere). */
  tonbeispiele: Spruch[];
  /** Alle Sätze, die schon erschienen sind (für die Prüfung auf Doppelungen). */
  bekannt: BekannterSatz[];
};

/** Ein paar Karten aus dem Vorrat, je Tag andere, ohne Doppelte. */
function waehleBeispiele(datum: string, vorrat: readonly Spruch[]): Spruch[] {
  if (vorrat.length === 0) return [];
  const tag = daysBetween("2026-01-01", datum);
  const wahl = new Set<number>();
  for (let i = 0; wahl.size < Math.min(TONBEISPIELE, vorrat.length); i++) {
    const n = vorrat.length;
    wahl.add((((tag * 7 + i * 13) % n) + n) % n);
    // Sicherheitsnetz, falls die Schritte im Kreis laufen.
    if (i > n * 2) break;
  }
  return [...wahl].map((i) => vorrat[i]);
}

export function baueKontext(
  datum: string,
  jetzt: Date,
  quellen: KontextQuellen,
): RedaktionKontext {
  const karten = (quellen.karten[datum] ?? []).map((k) => ({
    kicker: k.kicker,
    text: k.text,
    zusatz: k.zusatz,
    anlass: k.anlass,
  }));

  const alleSerien = [
    ...quellen.gespeichert.map((z) => ({ datum: z.datum, serie: z.serie })),
    ...Object.entries(quellen.serienAktuell).map(([tag, serie]) => ({
      datum: tag,
      serie,
    })),
  ];
  const serien = alleSerien
    .map((s, i) => ({ s, i }))
    // Neuester Tag zuerst; am selben Tag bleibt die Reihenfolge von oben.
    .sort((a, b) => b.s.datum.localeCompare(a.s.datum) || a.i - b.i)
    .slice(0, SERIEN_IM_BLICK)
    .map(({ s }) => ({
      titel: s.serie.titel,
      datum: s.datum,
      saetze: s.serie.folien.map((f) => f.text),
    }));

  const bekannt: BekannterSatz[] = [
    ...quellen.vorrat.map((v) => ({ text: v.text, woher: "Vorrat" })),
    ...Object.entries(quellen.karten).flatMap(([tag, liste]) =>
      liste.map((k) => ({
        text: k.text,
        woher: `Karte vom ${formatShortDay(tag)}`,
      })),
    ),
    ...alleSerien.flatMap(({ serie }) =>
      serie.folien.map((f) => ({
        text: f.text,
        woher: `Serie „${serie.titel}“`,
      })),
    ),
  ];

  const anlaesse = anlaesseFuer(datum);
  // Was am Tag selbst schon läuft (Winterdom, Weihnachtsmarkt), steht
  // nicht noch einmal in der Vorschau.
  const amTag = new Set(anlaesse.map((a) => a.name));
  const kommend = naechsteAnlaesse(addDays(datum, 1), VORSCHAU_TAGE).filter(
    (a) => !amTag.has(a.name),
  );

  const heute = berlinDateIso(jetzt);
  return {
    datum,
    datumLang: formatLongDay(datum, true),
    heuteLang: formatLongDay(heute, true),
    abstand: daysBetween(heute, datum),
    anlaesse,
    kommend,
    karten,
    serien,
    tonbeispiele: waehleBeispiele(datum, quellen.vorrat),
    bekannt,
  };
}

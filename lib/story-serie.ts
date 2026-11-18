/**
 * Story-Serie: drei bis fünf Story-Bilder hintereinander, die zusammen
 * eine kleine Geschichte erzählen (Aufhänger, Problem, Lösung, Einladung
 * zur Anfrage). Jedes Bild ist eine Karte wie ein Spruch; die Serie teilt
 * sich Titel, Farbwelt und Gestaltung, damit sie wie aus einem Guss wirkt.
 *
 * Serien entstehen an zwei Stellen:
 * - jeden Morgen zum Tag (lib/serien-aktuell.ts, Morgenlauf),
 * - auf Zuruf im Story-Studio (Redaktion, app/admin/story).
 * Für beide gelten dieselben Regeln (pruefeSerie).
 */
import { pruefeAnlass, pruefeKarte } from "@/lib/karten-regeln";
import { tagKarte, type Spruch, type SpruchTag } from "@/lib/sprueche-data";

/** Aufgabe eines Bildes in der Serie, in dieser Reihenfolge. */
export const SERIE_ROLLEN = [
  "aufhaenger",
  "problem",
  "loesung",
  "einladung",
] as const;
export type SerieRolle = (typeof SERIE_ROLLEN)[number];

export const ROLLE_LABEL: Record<SerieRolle, string> = {
  aufhaenger: "Aufhänger",
  problem: "Problem",
  loesung: "Lösung",
  einladung: "Einladung",
};

export const SERIE_MIN = 3;
export const SERIE_MAX = 5;

/** Ein Bild der Serie: eine Karte mit ihrer Aufgabe. */
export type SerieFolie = Spruch & { rolle: SerieRolle };

export type StorySerie = {
  /** Steht auf jedem Bild (wie der Anlass): kurz, ohne Ziffern, „Black Friday“. */
  titel: string;
  /** Drei bis fünf Bilder: zuerst der Aufhänger, zuletzt die Einladung. */
  folien: SerieFolie[];
  /** Worauf sich die Serie stützt (Adresse), nur im Mitgliederbereich. */
  quelle?: string;
};

/** Ein Bild der Serie, fertig für den Zeichner (lib/story-bild.ts). */
export type SerieKarte = SpruchTag & {
  rolle: SerieRolle;
  /** Stelle in der Serie: nr ab 1, von = Anzahl der Bilder. */
  folge: { nr: number; von: number };
};

/**
 * Prüft eine Serie gegen alle Regeln. Gibt die Verstöße als kurze
 * deutsche Sätze zurück (leer = in Ordnung). Nimmt beliebige Werte
 * entgegen, damit auch ungeprüfte Vorschläge sicher geprüft werden.
 */
export function pruefeSerie(serie: unknown): string[] {
  if (!serie || typeof serie !== "object") return ["Serie fehlt."];
  const s = serie as Partial<Record<keyof StorySerie, unknown>>;
  const fehler = pruefeAnlass(s.titel).map((f) =>
    f.replace(/^(Im )?Anlass/, (_, im) => (im ? "Im Titel" : "Titel")),
  );
  if (s.quelle !== undefined) {
    if (typeof s.quelle !== "string" || !/^https:\/\/\S+$/.test(s.quelle))
      fehler.push("Quelle muss eine Adresse mit https:// sein.");
  }
  if (!Array.isArray(s.folien)) return [...fehler, "Bilder fehlen."];
  const folien = s.folien as unknown[];
  if (folien.length < SERIE_MIN || folien.length > SERIE_MAX)
    fehler.push(
      `Serie hat ${folien.length} Bilder (erlaubt ${SERIE_MIN} bis ${SERIE_MAX}).`,
    );
  const rollen: string[] = [];
  const texte = new Set<string>();
  folien.forEach((f, i) => {
    const nr = i + 1;
    for (const e of pruefeKarte(f)) fehler.push(`Bild ${nr}: ${e}`);
    const folie = (f ?? {}) as Partial<SerieFolie>;
    const rolle = String(folie.rolle);
    if (!(SERIE_ROLLEN as readonly string[]).includes(rolle))
      fehler.push(`Bild ${nr}: Aufgabe unbekannt (${rolle}).`);
    rollen.push(rolle);
    if (typeof folie.text === "string") {
      const t = folie.text.toLowerCase();
      if (texte.has(t)) fehler.push(`Bild ${nr}: Satz steht doppelt.`);
      texte.add(t);
    }
  });
  if (rollen.length > 0) {
    if (rollen[0] !== "aufhaenger")
      fehler.push("Das erste Bild muss der Aufhänger sein.");
    if (rollen[rollen.length - 1] !== "einladung")
      fehler.push("Das letzte Bild muss die Einladung sein.");
    const rang = rollen.map((r) =>
      (SERIE_ROLLEN as readonly string[]).indexOf(r),
    );
    if (rang.some((r, i) => i > 0 && r >= 0 && rang[i - 1] > r))
      fehler.push(
        "Reihenfolge: Aufhänger, dann Problem, dann Lösung, dann Einladung.",
      );
    if (rollen.filter((r) => r === "aufhaenger").length > 1)
      fehler.push("Nur ein Aufhänger je Serie.");
    if (rollen.filter((r) => r === "einladung").length > 1)
      fehler.push("Nur eine Einladung je Serie.");
    if (!rollen.includes("loesung"))
      fehler.push("Mindestens ein Bild muss die Lösung zeigen.");
  }
  return fehler;
}

/** Platz, den Serien im täglichen Wechsel der Gestaltung belegen. */
export const SERIE_PLATZ = 0;

/**
 * Die Bilder einer Serie für einen Kalendertag (yyyy-mm-dd), fertig zum
 * Zeichnen. Alle Bilder teilen Tagesnummer und Platz und damit Farbwelt,
 * Motiv und Gestaltung; der Titel steht als Anlass auf jedem Bild.
 */
export function serieAlsKarten(serie: StorySerie, datum: string): SerieKarte[] {
  const von = serie.folien.length;
  return serie.folien.map((f, i) => ({
    ...tagKarte(datum, f, SERIE_PLATZ, serie.titel),
    rolle: f.rolle,
    folge: { nr: i + 1, von },
  }));
}

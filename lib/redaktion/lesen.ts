/**
 * Antworten der Redaktion lesen: aus dem Text des Modells wird eine Idee
 * oder ein Serien-Entwurf in fester Form. Hier wird nur aufgeräumt
 * (unbekannte Felder weg, Leerzeichen am Rand weg, Schreibweise der
 * Auswahlfelder angeglichen); ob der Entwurf die Regeln einhält, prüft
 * danach lib/redaktion/pruefung.ts. Rein (ohne Server-Importe).
 */
import {
  pruefeSerie,
  SERIE_MAX,
  SERIE_ROLLEN,
  type StorySerie,
} from "@/lib/story-serie";
import { KICKER, THEMA_LABEL } from "@/lib/sprueche-data";

/** Ein Bild, wie das Modell es geliefert hat (noch ungeprüft). */
export type EntwurfFolie = {
  rolle: string;
  kicker: string;
  text: string;
  betont: string;
  zusatz: string;
  thema: string;
};

/** Eine Serie, wie das Modell sie geliefert hat (noch ungeprüft). */
export type SerienEntwurf = { titel: string; folien: EntwurfFolie[] };

/** Der Blickwinkel des Themen-Scouts. */
export type Idee = {
  /** Vorschlag für den Titel der Serie. */
  titel: string;
  /** Die eine Behauptung der Serie, in einem Satz. */
  winkel: string;
  /** Die Szene aus dem Alltag der Leser, in einem Satz. */
  szene: string;
  /** Je Bild eine Zeile, in der Reihenfolge der Bilder. */
  bogen: { rolle: string; inhalt: string }[];
};

export const THEMEN = Object.keys(THEMA_LABEL) as (keyof typeof THEMA_LABEL)[];

const IDEE_FELD_MAX = 400;
const KARTEN_FELD_MAX = 400;

function istObjekt(wert: unknown): wert is Record<string, unknown> {
  return !!wert && typeof wert === "object" && !Array.isArray(wert);
}

/** Text ohne Steuerzeichen, mit einfachen Leerzeichen, ohne Rand. */
function glatt(wert: unknown, max: number): string | null {
  if (typeof wert !== "string") return null;
  return wert
    .replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Auswahlfeld auf die Schreibweise der Liste bringen. Das Modell hält
 * sich an die Liste, kann aber Groß- und Kleinschreibung verändern
 * („Kleiner reminder“). Unbekanntes bleibt stehen und fällt in der
 * Prüfung auf.
 */
function ausListe(liste: readonly string[], wert: string): string {
  const klein = wert.toLowerCase();
  return liste.find((eintrag) => eintrag.toLowerCase() === klein) ?? wert;
}

/**
 * JSON aus dem Antworttext. undefined, wenn nichts Lesbares dabei ist.
 * Steht doch einmal Text um das JSON, zählt der Teil von der ersten bis
 * zur letzten Klammer.
 */
export function leseJson(text: string): unknown {
  const roh = text.trim();
  try {
    return JSON.parse(roh) as unknown;
  } catch {
    const von = roh.indexOf("{");
    const bis = roh.lastIndexOf("}");
    if (von < 0 || bis <= von) return undefined;
    try {
      return JSON.parse(roh.slice(von, bis + 1)) as unknown;
    } catch {
      return undefined;
    }
  }
}

/** Die Idee des Themen-Scouts oder null, wenn die Form nicht stimmt. */
export function leseIdee(wert: unknown): Idee | null {
  if (!istObjekt(wert)) return null;
  const titel = glatt(wert.titel, 80);
  const winkel = glatt(wert.winkel, IDEE_FELD_MAX);
  const szene = glatt(wert.szene, IDEE_FELD_MAX);
  if (!titel || !winkel || szene === null || !Array.isArray(wert.bogen))
    return null;
  const bogen: Idee["bogen"] = [];
  for (const eintrag of wert.bogen.slice(0, SERIE_MAX)) {
    if (!istObjekt(eintrag)) return null;
    const rolle = glatt(eintrag.rolle, 40);
    const inhalt = glatt(eintrag.inhalt, IDEE_FELD_MAX);
    if (!rolle || !inhalt) return null;
    bogen.push({ rolle: ausListe(SERIE_ROLLEN, rolle), inhalt });
  }
  if (bogen.length === 0) return null;
  return { titel, winkel, szene, bogen };
}

/**
 * Ein Serien-Entwurf oder null, wenn die Form nicht stimmt (kein Titel,
 * keine Bilder, Felder fehlen). Mehr als SERIE_MAX Bilder bleiben
 * stehen, damit die Prüfung sie meldet.
 */
export function leseSerie(wert: unknown): SerienEntwurf | null {
  if (!istObjekt(wert)) return null;
  const titel = glatt(wert.titel, 80);
  if (titel === null || !Array.isArray(wert.folien)) return null;
  if (wert.folien.length === 0 || wert.folien.length > 12) return null;
  const folien: EntwurfFolie[] = [];
  for (const f of wert.folien) {
    if (!istObjekt(f)) return null;
    const rolle = glatt(f.rolle, 40);
    const kicker = glatt(f.kicker, 40);
    const text = glatt(f.text, KARTEN_FELD_MAX);
    const betont = glatt(f.betont, KARTEN_FELD_MAX);
    const zusatz = glatt(f.zusatz, KARTEN_FELD_MAX);
    const thema = glatt(f.thema, 40);
    if (
      rolle === null ||
      kicker === null ||
      text === null ||
      betont === null ||
      zusatz === null ||
      thema === null
    )
      return null;
    folien.push({
      rolle: ausListe(SERIE_ROLLEN, rolle),
      kicker: ausListe(KICKER, kicker),
      text,
      betont,
      zusatz,
      thema: ausListe(THEMEN, thema),
    });
  }
  return { titel, folien };
}

/**
 * Eine Serie, die alle Regeln einhält, oder null. Für alles, was von
 * außen kommt (Modell, Datenbank): Zurück kommt nur, was pruefeSerie
 * ohne Beanstandung durchlässt, und nur mit den bekannten Feldern.
 */
export function gueltigeSerie(wert: unknown): StorySerie | null {
  const entwurf = leseSerie(wert);
  if (!entwurf || pruefeSerie(entwurf).length > 0) return null;
  return entwurf as StorySerie;
}

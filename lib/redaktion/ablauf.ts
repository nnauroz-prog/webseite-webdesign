/**
 * Der Ablauf in der Redaktion: Aus einem Auftrag wird in vier Schritten
 * eine Story-Serie. Drei Rollen arbeiten nacheinander, jede mit einem
 * eigenen Aufruf des Modells und eigener Vorgabe (lib/redaktion/prompts.ts):
 *
 *   idee        Themen-Scout: Blickwinkel, Titel, Ablauf der Bilder
 *   text        Texterin: schreibt die Serie
 *   lektorat    erst der Code (Regeln, Doppelungen), dann der Lektor;
 *               höchstens LEKTORAT_RUNDEN Runden
 *   gestaltung  ohne Modell: Farbwelt und Layout folgen aus dem Tag
 *               (lib/story-serie.ts), hier wird nur gespeichert
 *
 * Jeder Schritt meldet sich über sende (Zeilen nach
 * lib/redaktion/vertrag.ts). Die letzte Zeile ist immer die Serie oder
 * ein Fehler. Ins Studio kommt nur eine Serie, die pruefeSerie ohne
 * Beanstandung durchlässt.
 *
 * Rein: Modell, Speichern und Uhr kommen als Argument, damit Tests den
 * Ablauf mit einer Attrappe durchspielen können.
 */
import type { RedaktionKontext } from "@/lib/redaktion/kontext";
import type { SerienEntwurf } from "@/lib/redaktion/lesen";
import type {
  ModellAnfrage,
  ModellFehlerArt,
  RedaktionModell,
} from "@/lib/redaktion/modell";
import type {
  RedaktionAuftrag,
  RedaktionEreignis,
  RedaktionFehlerCode,
} from "@/lib/redaktion/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import { pruefeAnlass } from "@/lib/karten-regeln";
import { leseIdee, leseJson, leseSerie } from "@/lib/redaktion/lesen";
import { fristAbgelaufen, ModellFehler } from "@/lib/redaktion/modell";
import {
  nutzerLektor,
  nutzerScout,
  nutzerTexterin,
  SCHEMA_IDEE,
  SCHEMA_SERIE,
  SYSTEM_LEKTOR,
  SYSTEM_SCOUT,
  SYSTEM_TEXTERIN,
} from "@/lib/redaktion/prompts";
import { pruefeEntwurf } from "@/lib/redaktion/pruefung";

/** So oft darf der Lektor nachbessern. */
export const LEKTORAT_RUNDEN = 2;

/**
 * Obergrenzen je Aufruf, für Nachdenken und Antwort zusammen. Die
 * Antworten sind kurz (höchstens fünf Bilder); der Rest ist Luft zum
 * Nachdenken, damit keine Antwort mittendrin abbricht.
 */
export const MAX_TOKENS = { idee: 8000, text: 16000, lektorat: 16000 } as const;

export type AblaufEingabe = {
  /** Geprüfter Auftrag (lib/redaktion/eingabe.ts). */
  auftrag: RedaktionAuftrag;
  kontext: RedaktionKontext;
  modell: RedaktionModell;
  /**
   * Kennung des Modells und des Ersatzmodells. Das Ersatzmodell springt
   * ein, wenn es das erste für diesen Schlüssel nicht gibt oder wenn es
   * den Auftrag ablehnt (null: kein Ersatz).
   */
  modelle: { haupt: string; ersatz: string | null };
  sende: (ereignis: RedaktionEreignis) => void;
  /** Speichert die fertige Serie; Kennung oder null, wenn nicht gespeichert. */
  speichere: (serie: StorySerie) => Promise<string | null>;
  /** Bricht den Ablauf ab (Frist, Studio geschlossen). */
  signal?: AbortSignal;
};

export type AblaufErgebnis =
  | {
      ok: true;
      /** Kennung in der Datenbank oder null. */
      id: string | null;
      /** Modell, das zuletzt geantwortet hat. */
      modell: string;
      /** Runden im Lektorat. */
      runden: number;
    }
  | {
      ok: false;
      code: RedaktionFehlerCode;
      /** Genauer Grund fürs Protokoll (nie der Auftrag selbst). */
      art: ModellFehlerArt | "regeln" | "unbekannt";
      status?: number;
    };

/** Fehler des Modells als Zeile fürs Studio (Du-Form, kurz, mit nächstem Schritt). */
export function fehlerZeile(
  art: ModellFehlerArt,
): Extract<RedaktionEreignis, { typ: "fehler" }> {
  const modell = (text: string) =>
    ({ typ: "fehler", code: "modell", text }) as const;
  switch (art) {
    case "schluessel":
      return modell(
        "Der API-Schlüssel wird abgelehnt. Prüf ANTHROPIC_API_KEY in Vercel und deploye neu.",
      );
    case "rechte":
      return modell(
        "Der API-Schlüssel darf das Modell nicht nutzen. Prüf die Rechte des Schlüssels in der Anthropic Console.",
      );
    case "guthaben":
      return modell(
        "Das Guthaben im Anthropic-Konto reicht nicht. Lade es in der Console auf, dann geht es weiter.",
      );
    case "modell_fehlt":
      return modell(
        "Das Modell gibt es für diesen Schlüssel nicht. Prüf STUDIO_MODELL in Vercel oder lass die Variable leer.",
      );
    case "limit":
      return modell(
        "Gerade sind es zu viele Anfragen: Die Redaktion ist überlastet oder das Limit im Anthropic-Konto ist erreicht. Versuch es in ein paar Minuten noch einmal.",
      );
    case "ueberlastet":
      return modell(
        "Die Redaktion ist gerade überlastet. Versuch es in ein paar Minuten noch einmal.",
      );
    case "zeit":
      return modell(
        "Das hat zu lange gedauert. Versuch es gleich noch einmal.",
      );
    case "verbindung":
      return modell(
        "Die Redaktion ist gerade nicht erreichbar. Versuch es gleich noch einmal.",
      );
    case "anfrage":
      return modell(
        "Die Redaktion hat die Anfrage nicht angenommen. Prüf STUDIO_MODELL in Vercel oder lass die Variable leer.",
      );
    case "abgelehnt":
      return modell(
        "Diesen Auftrag hat die Redaktion abgelehnt. Formulier ihn anders.",
      );
    case "abgeschnitten":
    case "format":
      return modell(
        "Die Antwort der Redaktion war unvollständig. Versuch es noch einmal.",
      );
    case "abbruch":
    case "sonst":
      return {
        typ: "fehler",
        code: "unbekannt",
        text: "Da ist etwas schiefgelaufen. Versuch es gleich noch einmal.",
      };
  }
}

const REGELN_FEHLER: Extract<RedaktionEreignis, { typ: "fehler" }> = {
  typ: "fehler",
  code: "regeln",
  text: "Die Serie hält die Regeln für Karten noch nicht ein. Versuch es noch einmal oder formulier den Auftrag etwas anders.",
};

function alsModellFehler(err: unknown): ModellFehler {
  return err instanceof ModellFehler ? err : new ModellFehler("sonst");
}

/** Wie viele Bilder sich zwischen zwei Fassungen unterscheiden. */
function geaenderteBilder(a: SerienEntwurf, b: SerienEntwurf): number {
  const n = Math.max(a.folien.length, b.folien.length);
  let anders = 0;
  for (let i = 0; i < n; i++)
    if (JSON.stringify(a.folien[i]) !== JSON.stringify(b.folien[i])) anders++;
  return anders + (a.titel !== b.titel ? 1 : 0);
}

export async function redaktionAblauf(
  e: AblaufEingabe,
): Promise<AblaufErgebnis> {
  const { auftrag, kontext, sende, signal } = e;
  let modellName = e.modelle.haupt;
  const ersatz =
    e.modelle.ersatz && e.modelle.ersatz !== e.modelle.haupt
      ? e.modelle.ersatz
      : null;

  /** Ein Aufruf des Modells; gibt das gelesene JSON zurück. */
  async function frage(
    aufruf: Pick<
      ModellAnfrage,
      "system" | "nutzer" | "schema" | "maxTokens" | "aufwand"
    >,
  ): Promise<unknown> {
    for (;;) {
      if (signal?.aborted)
        throw new ModellFehler(fristAbgelaufen(signal) ? "zeit" : "abbruch");
      let antwort;
      try {
        antwort = await e.modell.frage({
          ...aufruf,
          modell: modellName,
          signal,
        });
      } catch (err) {
        const fehler = alsModellFehler(err);
        // Das Modell gibt es für diesen Schlüssel nicht: einmal mit dem
        // Ersatzmodell weiter, auch für die folgenden Schritte.
        if (fehler.art === "modell_fehlt" && ersatz && modellName !== ersatz) {
          modellName = ersatz;
          continue;
        }
        throw fehler;
      }
      if (antwort.stopp === "refusal") {
        // Abgelehnt: einmal das Ersatzmodell fragen, sonst aufgeben.
        if (ersatz && modellName !== ersatz) {
          modellName = ersatz;
          continue;
        }
        throw new ModellFehler("abgelehnt");
      }
      if (antwort.stopp === "max_tokens")
        throw new ModellFehler("abgeschnitten");
      const wert = leseJson(antwort.text);
      if (wert === undefined) throw new ModellFehler("format");
      return wert;
    }
  }

  try {
    // 1) Idee ---------------------------------------------------------
    sende({
      typ: "schritt",
      schritt: "idee",
      stand: "laeuft",
      hinweis: "Der Themen-Scout sucht den Blickwinkel.",
    });
    const idee = leseIdee(
      await frage({
        system: SYSTEM_SCOUT,
        nutzer: nutzerScout(kontext, auftrag.auftrag),
        schema: SCHEMA_IDEE,
        maxTokens: MAX_TOKENS.idee,
        aufwand: "low",
      }),
    );
    if (!idee) throw new ModellFehler("format");
    const titelBefunde = pruefeAnlass(idee.titel);
    sende({
      typ: "schritt",
      schritt: "idee",
      stand: "fertig",
      hinweis:
        titelBefunde.length === 0
          ? `Thema: ${idee.titel}`
          : "Der Blickwinkel steht.",
    });

    // 2) Text ---------------------------------------------------------
    sende({
      typ: "schritt",
      schritt: "text",
      stand: "laeuft",
      hinweis: "Die Texterin schreibt die Bilder.",
    });
    const entwurf = leseSerie(
      await frage({
        system: SYSTEM_TEXTERIN,
        nutzer: nutzerTexterin(kontext, auftrag.auftrag, idee, titelBefunde),
        schema: SCHEMA_SERIE,
        maxTokens: MAX_TOKENS.text,
        aufwand: "medium",
      }),
    );
    if (!entwurf) throw new ModellFehler("format");
    sende({
      typ: "schritt",
      schritt: "text",
      stand: "fertig",
      hinweis: `${entwurf.folien.length} Bilder im Entwurf.`,
    });

    // 3) Lektorat -----------------------------------------------------
    sende({
      typ: "schritt",
      schritt: "lektorat",
      stand: "laeuft",
      hinweis: "Der Lektor prüft Regeln und Pointen.",
    });
    let fassung = entwurf;
    /** Ob fassung schon vom Lektor stammt (sonst von der Texterin). */
    let vomLektor = false;
    let befund = pruefeEntwurf(fassung, kontext.bekannt);
    /** Letzte Fassung ohne harten Befund. */
    let gueltig: SerienEntwurf | null =
      befund.hart.length === 0 ? fassung : null;
    let runden = 0;
    let lektorAusgefallen = false;
    while (runden < LEKTORAT_RUNDEN) {
      runden++;
      if (runden > 1)
        sende({
          typ: "schritt",
          schritt: "lektorat",
          stand: "laeuft",
          hinweis: "Zweite Runde: Der Lektor bessert nach.",
        });
      let antwort: SerienEntwurf | null;
      try {
        antwort = leseSerie(
          await frage({
            system: SYSTEM_LEKTOR,
            nutzer: nutzerLektor(
              kontext,
              auftrag.auftrag,
              idee,
              fassung,
              befund,
              vomLektor,
            ),
            schema: SCHEMA_SERIE,
            maxTokens: MAX_TOKENS.lektorat,
            aufwand: runden === 1 ? "medium" : "low",
          }),
        );
      } catch (err) {
        const fehler = alsModellFehler(err);
        // Fällt der Lektor aus, nachdem schon eine Fassung alle Regeln
        // einhält, geht diese Fassung raus statt einer Fehlermeldung.
        if (gueltig && fehler.art !== "abbruch") {
          lektorAusgefallen = true;
          break;
        }
        throw fehler;
      }
      if (!antwort) {
        // Antwort ohne lesbare Serie: wie ein Ausfall behandeln.
        if (gueltig) {
          lektorAusgefallen = true;
          break;
        }
        continue;
      }
      fassung = antwort;
      vomLektor = true;
      befund = pruefeEntwurf(fassung, kontext.bekannt);
      if (befund.hart.length === 0) {
        gueltig = fassung;
        break;
      }
    }
    if (!gueltig) {
      // Nie eine lesbare Fassung vom Lektor bekommen: Das Modell hakt,
      // nicht die Regeln.
      if (!vomLektor) throw new ModellFehler("format");
      sende(REGELN_FEHLER);
      return { ok: false, code: "regeln", art: "regeln" };
    }
    const serie = gueltig as StorySerie;
    sende({
      typ: "schritt",
      schritt: "lektorat",
      stand: "fertig",
      hinweis: lektorAusgefallen
        ? "Der Lektor war nicht erreichbar. Die Fassung der Texterin hält alle Regeln ein."
        : gueltig === entwurf && vomLektor
          ? "Die Fassung der Texterin bleibt: Sie hält alle Regeln ein."
          : geaenderteBilder(entwurf, gueltig) === 0
            ? "Nichts zu ändern: Der Entwurf sitzt."
            : "Der Lektor hat nachgeschärft.",
    });

    // 4) Gestaltung ---------------------------------------------------
    sende({
      typ: "schritt",
      schritt: "gestaltung",
      stand: "laeuft",
      hinweis: "Farbwelt und Layout richten sich nach dem Tag.",
    });
    let id: string | null = null;
    try {
      id = await e.speichere(serie);
    } catch {
      // Speichern ist Zugabe: Die Serie geht trotzdem ins Studio.
      id = null;
    }
    sende({
      typ: "schritt",
      schritt: "gestaltung",
      stand: "fertig",
      hinweis: `${serie.folien.length} Bilder sind fertig.`,
    });
    sende({ typ: "serie", serie, id });
    return { ok: true, id, modell: modellName, runden };
  } catch (err) {
    const fehler = alsModellFehler(err);
    const zeile = fehlerZeile(fehler.art);
    sende(zeile);
    return {
      ok: false,
      code: zeile.code,
      art: err instanceof ModellFehler ? fehler.art : "unbekannt",
      ...(fehler.status ? { status: fehler.status } : {}),
    };
  }
}

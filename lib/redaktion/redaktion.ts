import "server-only";

import type { RedaktionModell } from "@/lib/redaktion/modell";
import type { RedaktionEreignis } from "@/lib/redaktion/vertrag";
import type { SerieZeile } from "@/lib/serien-store";

import { berlinDateIso } from "@/lib/admin/berlin-time";
import { POSTS_AKTUELL } from "@/lib/posts-aktuell";
import { redaktionAblauf } from "@/lib/redaktion/ablauf";
import { anthropicModell } from "@/lib/redaktion/anthropic";
import { pruefeEingabe } from "@/lib/redaktion/eingabe";
import {
  redaktionBereit,
  studioModelle,
  studioTageslimit,
} from "@/lib/redaktion/konfig";
import { baueKontext } from "@/lib/redaktion/kontext";
import { limitErreicht, merkeAuftrag } from "@/lib/redaktion/limit";
import { SERIEN_AKTUELL } from "@/lib/serien-aktuell";
import { countSerienAm, listSerien, saveSerie } from "@/lib/serien-store";
import { SPRUECHE, SPRUECHE_EXTRA } from "@/lib/sprueche-data";

/*
 * Ein Auftrag an die Redaktion, von der Eingabe bis zur gespeicherten
 * Serie. Nur auf dem Server und erst nach requireAdmin() aufrufen
 * (app/admin/story/redaktion/route.ts).
 *
 * Reihenfolge, damit nichts unnötig Geld kostet:
 *   1. Schlüssel da?                     sonst kein_schluessel
 *   2. Eingabe gültig?                   sonst eingabe
 *   3. Tageslimit frei?                  sonst zu_viele
 *   4. Unterlagen sammeln, dann der Ablauf (lib/redaktion/ablauf.ts)
 *
 * Geloggt werden nur Codes und Kennungen, nie der Auftrag, die Serie
 * oder der Schlüssel.
 */

/** Nach dieser Zeit bricht die Redaktion ab (die Route erlaubt etwas mehr). */
export const FRIST_MS = 100_000;

/** So viele gespeicherte Serien zählen als „schon erschienen“. */
const SERIEN_GEDAECHTNIS = 60;

export type RedaktionOptionen = {
  /** Abbruch von außen (Studio hat die Verbindung geschlossen). */
  signal?: AbortSignal;
  /** Nur für Tests: Uhr, Modell und Frist. */
  jetzt?: Date;
  modell?: RedaktionModell;
  fristMs?: number;
};

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

export async function bearbeiteAuftrag(
  roh: unknown,
  sende: (ereignis: RedaktionEreignis) => void,
  optionen: RedaktionOptionen = {},
): Promise<void> {
  if (!redaktionBereit()) {
    sende({
      typ: "fehler",
      code: "kein_schluessel",
      text: "Die Redaktion ist noch nicht eingerichtet: In Vercel fehlt ANTHROPIC_API_KEY. Die Anleitung steht in docs/vercel-einrichtung.md.",
    });
    return;
  }

  const jetzt = optionen.jetzt ?? new Date();
  const eingabe = pruefeEingabe(roh, jetzt);
  if (!eingabe.ok) {
    sende({ typ: "fehler", code: "eingabe", text: eingabe.text });
    return;
  }
  const { auftrag } = eingabe;

  // Tageslimit und Unterlagen aus der Datenbank; beides darf ausfallen.
  const heute = berlinDateIso(jetzt);
  const [inDb, gespeichert] = await Promise.all([
    countSerienAm(heute).catch((err: unknown) => {
      console.error("[redaktion] Zählen fehlgeschlagen", { code: codeOf(err) });
      return null;
    }),
    listSerien(SERIEN_GEDAECHTNIS).catch((err: unknown): SerieZeile[] => {
      console.error("[redaktion] Laden fehlgeschlagen", { code: codeOf(err) });
      return [];
    }),
  ]);
  const limit = studioTageslimit();
  if (limitErreicht(heute, inDb, limit)) {
    sende({
      typ: "fehler",
      code: "zu_viele",
      text: `Für heute ist das Tageslimit erreicht (${limit} Aufträge). Morgen geht es weiter.`,
    });
    return;
  }
  merkeAuftrag(heute);

  const kontext = baueKontext(auftrag.datum, jetzt, {
    karten: POSTS_AKTUELL,
    serienAktuell: SERIEN_AKTUELL,
    gespeichert: gespeichert ?? [],
    vorrat: [...SPRUECHE, ...SPRUECHE_EXTRA],
  });

  const frist = AbortSignal.timeout(optionen.fristMs ?? FRIST_MS);
  const signal = optionen.signal
    ? AbortSignal.any([frist, optionen.signal])
    : frist;

  const ergebnis = await redaktionAblauf({
    auftrag,
    kontext,
    modell: optionen.modell ?? anthropicModell(),
    modelle: studioModelle(),
    sende,
    signal,
    speichere: async (serie) => {
      try {
        return await saveSerie({
          datum: auftrag.datum,
          auftrag: auftrag.auftrag,
          serie,
        });
      } catch (err) {
        console.error("[redaktion] Speichern fehlgeschlagen", {
          code: codeOf(err),
        });
        return null;
      }
    },
  });

  if (!ergebnis.ok && ergebnis.art !== "abbruch")
    console.error("[redaktion] Auftrag fehlgeschlagen", {
      code: ergebnis.code,
      art: ergebnis.art,
      status: ergebnis.status ?? null,
    });
}

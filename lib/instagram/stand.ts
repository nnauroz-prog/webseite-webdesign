import "server-only";

import { cache } from "react";

import type { InstagramStand } from "@/lib/instagram/vertrag";

import { bucketDa, speicherBereit } from "@/lib/instagram/bilder";
import {
  graph,
  InstagramFehler,
  kontingentLesen,
  kontoFinden,
  type Konto,
  type Kontingent,
} from "@/lib/instagram/graph";
import { instagramKonfig } from "@/lib/instagram/konfig";

/*
 * Stand der Verbindung zu Instagram für das Story-Studio und die Seite
 * /admin/instagram: Schlüssel da, Speicher da, Konto und Kontingent der
 * letzten 24 Stunden. Liest nur, postet nie. Nur auf dem Server und erst
 * nach requireAdmin() aufrufen. Geloggt werden nur Codes.
 */

/** So lange darf die Prüfung höchstens dauern (die Seite soll nicht hängen). */
const PRUEFUNG_MS = 8_000;

const TEXT_ZU_LANGSAM =
  "Instagram hat nicht rechtzeitig geantwortet. Lade die Seite gleich noch einmal.";

export type StandOptionen = {
  /** Nur für Tests: anderes fetch für die Graph API. */
  fetch?: typeof fetch;
  /** Nur für Tests: andere Höchstdauer. */
  zeitMs?: number;
};

function problemText(err: unknown): string {
  if (err instanceof InstagramFehler) return err.text;
  return TEXT_ZU_LANGSAM;
}

function logFehler(err: unknown) {
  if (err instanceof InstagramFehler)
    console.error("[instagram] Prüfung fehlgeschlagen", {
      code: err.code,
      graph: err.graphCode,
      subcode: err.subcode,
      fbtrace: err.fbtrace,
    });
  else console.error("[instagram] Prüfung abgebrochen");
}

/** Liest den Stand (ohne Zwischenspeicher). */
export async function leseStand(
  optionen: StandOptionen = {},
): Promise<InstagramStand> {
  const konfig = instagramKonfig();
  if (!konfig) return { verbunden: false, grund: "kein_token" };
  if (!speicherBereit() || (await bucketDa()) === false)
    return { verbunden: false, grund: "kein_speicher" };

  const g = graph(konfig, {
    fetch: optionen.fetch,
    signal: AbortSignal.timeout(optionen.zeitMs ?? PRUEFUNG_MS),
    zeitMs: optionen.zeitMs ?? PRUEFUNG_MS,
    wiederholMs: 500,
  });
  let konto: Konto | null = null;
  let kontingent: Kontingent | null = null;
  let problem: string | null = null;
  try {
    konto = await kontoFinden(g, konfig.kontoId);
    kontingent = await kontingentLesen(g, konto.id);
  } catch (err) {
    logFehler(err);
    problem = problemText(err);
  }
  return {
    verbunden: true,
    konto: konto ? { id: konto.id, name: konto.name } : null,
    kontingent,
    problem,
  };
}

/** Je Request einmal (React cache). Nur nach requireAdmin() aufrufen. */
export const instagramStand = cache(() => leseStand());

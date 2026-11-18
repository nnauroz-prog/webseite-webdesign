"use server";

import type { InstagramStand, UploadAntwort } from "@/lib/instagram/vertrag";

import { requireAdmin } from "@/lib/admin/auth";
import {
  erzeugePlaetze,
  speicherBereit,
  SpeicherFehler,
  TEXT_KEIN_BUCKET,
  TEXT_KEIN_SPEICHER,
} from "@/lib/instagram/bilder";
import { bilderMax, parseArt, TEXT_ANZAHL } from "@/lib/instagram/eingabe";
import { FEHLER_TEXT } from "@/lib/instagram/graph";
import { instagramBereit } from "@/lib/instagram/konfig";
import { instagramStand } from "@/lib/instagram/stand";

/*
 * Server Actions fürs Posten auf Instagram (Story-Studio). Regeln wie in
 * actions.ts (geprüft in tests/actions-guard.test.ts): Jede Action
 * beginnt mit `await requireAdmin()`, Eingaben werden geprüft, Logs
 * enthalten nur Codes. Das Posten selbst läuft über die Route
 * app/admin/instagram/posten/route.ts (Strom statt einer Antwort).
 */

/**
 * Upload-Plätze für anzahl Bilder eines Posts (art: story oder beitrag).
 * Der Browser lädt jedes Bild mit dem Token direkt in den Speicher und
 * schickt danach die Pfade an INSTAGRAM_POSTEN_PFAD.
 */
export async function instagramUploadAction(
  anzahl: unknown,
  art: unknown,
): Promise<UploadAntwort> {
  await requireAdmin();
  const artOk = parseArt(art);
  if (
    !artOk ||
    typeof anzahl !== "number" ||
    !Number.isInteger(anzahl) ||
    anzahl < 1 ||
    anzahl > bilderMax(artOk)
  )
    return { ok: false, code: "eingabe", text: TEXT_ANZAHL };
  if (!instagramBereit())
    return {
      ok: false,
      code: "nicht_verbunden",
      text: FEHLER_TEXT.nicht_verbunden,
    };
  if (!speicherBereit())
    return { ok: false, code: "unbekannt", text: TEXT_KEIN_SPEICHER };
  try {
    return { ok: true, plaetze: await erzeugePlaetze(anzahl, new Date()) };
  } catch (err) {
    const code = err instanceof SpeicherFehler ? err.art : "unbekannt";
    console.error("[instagram] Upload-Plätze fehlgeschlagen", { code });
    return {
      ok: false,
      code: "unbekannt",
      text: code === "kein_bucket" ? TEXT_KEIN_BUCKET : FEHLER_TEXT.unbekannt,
    };
  }
}

/** Stand der Verbindung (Konto, Kontingent); liest nur, postet nie. */
export async function instagramStandAction(): Promise<InstagramStand> {
  await requireAdmin();
  return instagramStand();
}

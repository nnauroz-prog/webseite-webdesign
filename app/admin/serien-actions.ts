"use server";

import { revalidatePath } from "next/cache";

import type { SchemaStatus } from "@/lib/admin/schema";

import { requireAdmin } from "@/lib/admin/auth";
import { explainDbError } from "@/lib/admin/db-errors";
import { checkSchema } from "@/lib/admin/schema";
import { parseId } from "@/lib/admin/validate";
import { deleteSerie, setSerieGepostet } from "@/lib/serien-store";

/*
 * Server Actions für die Serien aus Aufträgen an die Redaktion
 * (Story-Studio). Regeln wie in actions.ts (geprüft in
 * tests/actions-guard.test.ts): Jede Action beginnt mit
 * `await requireAdmin()`, Kennungen laufen über parseId, ohne
 * Datenbank-Update kommt ein Hinweis statt eines Fehlers, und Logs
 * enthalten nur Kennung und Fehlercode.
 */

export type SerienActionResult = { ok: true } | { ok: false; error: string };

const INVALID = "Ungültige Eingabe.";
const GONE = "Diese Serie gibt es nicht mehr. Lade die Seite neu.";
const NEEDS_UPDATE =
  "Serien merken geht erst nach dem Datenbank-Update (siehe Hinweis im Mitgliederbereich).";

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

function serienProblem(schema: SchemaStatus): string | null {
  if (schema.serien === "ok") return null;
  if (schema.serien === "fehlt") return NEEDS_UPDATE;
  const e = explainDbError(schema.error ?? "unbekannt");
  return `${e.title} ${e.hint}`;
}

/** Verständliche Meldung statt Rohtext; geloggt werden nur ID und Code. */
function dbFailure(where: string, err: unknown, id: string): string {
  console.error(`[admin] ${where} fehlgeschlagen`, { id, code: codeOf(err) });
  const e = explainDbError(err);
  return `${e.title} ${e.hint}`;
}

function aufgefrischt(): SerienActionResult {
  revalidatePath("/admin/story");
  revalidatePath("/admin/posts");
  return { ok: true };
}

/** Hakt eine Serie als gepostet ab oder nimmt den Haken zurück. */
export async function serieGepostetAction(
  id: string,
  gepostet: boolean,
): Promise<SerienActionResult> {
  await requireAdmin();
  const serieId = parseId(id);
  if (!serieId || typeof gepostet !== "boolean")
    return { ok: false, error: INVALID };
  try {
    const problem = serienProblem(await checkSchema());
    if (problem) return { ok: false, error: problem };
    if (!(await setSerieGepostet(serieId, gepostet)))
      return { ok: false, error: GONE };
    return aufgefrischt();
  } catch (err) {
    return { ok: false, error: dbFailure("Serie abhaken", err, serieId) };
  }
}

/** Löscht eine Serie aus den Aufträgen. */
export async function serieLoeschenAction(
  id: string,
): Promise<SerienActionResult> {
  await requireAdmin();
  const serieId = parseId(id);
  if (!serieId) return { ok: false, error: INVALID };
  try {
    const problem = serienProblem(await checkSchema());
    if (problem) return { ok: false, error: problem };
    // Schon weg (zweites Gerät, doppelt getippt): gilt als gelöscht.
    await deleteSerie(serieId);
    return aufgefrischt();
  } catch (err) {
    return { ok: false, error: dbFailure("Serie löschen", err, serieId) };
  }
}

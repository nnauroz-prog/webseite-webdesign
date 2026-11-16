"use server";

import { revalidatePath } from "next/cache";

import type { SchemaStatus } from "@/lib/admin/schema";

import { requireAdmin } from "@/lib/admin/auth";
import { explainDbError } from "@/lib/admin/db-errors";
import {
  parsePlatz,
  parsePostDatum,
  parsePostFormat,
} from "@/lib/admin/post-planer";
import { checkSchema } from "@/lib/admin/schema";
import { setzePostStatus } from "@/lib/post-status-store";
import { postsFuer } from "@/lib/sprueche-data";

/*
 * Server Actions für den Post-Planer und das Story-Studio. Regeln wie
 * in actions.ts (geprüft in tests/actions-guard.test.ts): Jede Action
 * beginnt mit `await requireAdmin()`, Eingaben werden geprüft, Logs
 * enthalten nur Datum, Platz und Fehlercode.
 */

export type PostResult = { ok: true } | { ok: false; error: string };

const INVALID = "Ungültige Eingabe.";
const NEEDS_UPDATE =
  "Abhaken geht erst nach dem Datenbank-Update (siehe Hinweis oben).";

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

function postStatusProblem(schema: SchemaStatus): string | null {
  if (schema.postStatus === "ok") return null;
  if (schema.postStatus === "fehlt") return NEEDS_UPDATE;
  const e = explainDbError(schema.error ?? "unbekannt");
  return `${e.title} ${e.hint}`;
}

/**
 * Post eines Tages als Story bzw. Beitrag gepostet (true) oder nicht
 * gepostet (false). Den Satz, der online ging, nimmt der Server selbst
 * aus den Posts des Tages (nichts vom Gerät).
 */
export async function setPostGepostetAction(
  rawDatum: unknown,
  rawPlatz: unknown,
  rawFormat: unknown,
  rawGepostet: unknown,
): Promise<PostResult> {
  await requireAdmin();
  const datum = parsePostDatum(rawDatum, new Date());
  const platz = parsePlatz(rawPlatz);
  const format = parsePostFormat(rawFormat);
  if (!datum || platz === null || !format || typeof rawGepostet !== "boolean")
    return { ok: false, error: INVALID };
  const post = postsFuer(datum).find((p) => p.platz === platz);
  if (!post) return { ok: false, error: INVALID };

  try {
    const problem = postStatusProblem(await checkSchema());
    if (problem) return { ok: false, error: problem };
    await setzePostStatus(
      { datum, platz, format, text: post.text },
      rawGepostet,
    );
    revalidatePath("/admin/posts");
    revalidatePath("/admin/story");
    return { ok: true };
  } catch (err) {
    console.error("[admin] Post-Status fehlgeschlagen", {
      datum,
      platz,
      code: codeOf(err),
    });
    const e = explainDbError(err);
    return { ok: false, error: `${e.title} ${e.hint}` };
  }
}

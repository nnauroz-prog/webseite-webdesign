"use server";

import { revalidatePath } from "next/cache";

import type { ProjektAngebot } from "@/lib/admin/projekte";
import type { SchemaStatus } from "@/lib/admin/schema";

import { requireAdmin } from "@/lib/admin/auth";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { explainDbError } from "@/lib/admin/db-errors";
import {
  monatlichBrutto,
  parsePflegeBis,
  parsePflegeSeit,
  parseProjektNotiz,
  parseSchritt,
  parseSchrittDatum,
  pflegeSeit,
} from "@/lib/admin/projekte";
import { checkSchema } from "@/lib/admin/schema";
import { parseId } from "@/lib/admin/validate";
import {
  aendereProjekt,
  getProjektAngebot,
  getProjektByAngebot,
  setzeSchritt,
} from "@/lib/projekte-store";

/*
 * Server Actions für Kunden & Projekte. Regeln wie in actions.ts
 * (geprüft in tests/actions-guard.test.ts):
 * - Jede Action beginnt mit `await requireAdmin()`.
 * - IDs über parseId, alles andere über die parse…-Funktionen aus
 *   lib/admin/projekte.ts; ungültig ergibt „Ungültige Eingabe.“, nie
 *   einen rohen Datenbank-Fehler.
 * - Ohne Datenbank-Update (Tabelle projekte) kommt ein Hinweis statt
 *   eines Fehlers.
 * - Logs enthalten nur IDs und Fehlercodes.
 */

export type ProjektResult = { ok: true } | { ok: false; error: string };

const INVALID = "Ungültige Eingabe.";
const GONE = "Dieses Angebot gibt es nicht mehr.";
const NICHT_ANGENOMMEN =
  "Das Angebot ist nicht (mehr) angenommen. Lade die Seite neu.";
const NEEDS_UPDATE =
  "Projekte gehen erst nach dem Datenbank-Update (siehe Hinweis oben).";

// --- Hilfen (nicht exportiert, also keine Actions) ---

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

/** Verständliche Meldung statt Rohtext; geloggt werden nur ID und Code. */
function dbFailure(where: string, err: unknown, id: string): string {
  console.error(`[admin] ${where} fehlgeschlagen`, { id, code: codeOf(err) });
  const e = explainDbError(err);
  return `${e.title} ${e.hint}`;
}

function projekteProblem(schema: SchemaStatus): string | null {
  if (schema.projekte === "ok") return null;
  if (schema.projekte === "fehlt") return NEEDS_UPDATE;
  const e = explainDbError(schema.error ?? "unbekannt");
  return `${e.title} ${e.hint}`;
}

/** Angenommenes Angebot zum Projekt oder eine Meldung (du-Form). */
async function projektAngebot(
  id: string,
): Promise<{ angebot: ProjektAngebot } | { error: string }> {
  const [schema, angebot] = await Promise.all([
    checkSchema(),
    getProjektAngebot(id),
  ]);
  const problem = projekteProblem(schema);
  if (problem) return { error: problem };
  if (!angebot) return { error: GONE };
  if (angebot.status !== "angenommen") return { error: NICHT_ANGENOMMEN };
  return { angebot };
}

function revalidateProjekt(angebotId: string): void {
  revalidatePath("/admin/kunden");
  revalidatePath(`/admin/kunden/${angebotId}`);
}

// --- Schritte ---

/**
 * Schritt abhaken (rawDatum: Tag, an dem er erledigt war, nicht in der
 * Zukunft) oder wieder öffnen (rawDatum null). Der Livegang setzt
 * zugleich das Datum, an dem die Seite online ging.
 */
export async function setProjektSchrittAction(
  rawAngebotId: unknown,
  rawSchritt: unknown,
  rawDatum: unknown,
): Promise<ProjektResult> {
  await requireAdmin();
  const id = parseId(rawAngebotId);
  const schritt = parseSchritt(rawSchritt);
  const datum =
    rawDatum === null ? null : parseSchrittDatum(rawDatum, new Date());
  if (!id || !schritt || (rawDatum !== null && !datum))
    return { ok: false, error: INVALID };

  try {
    const res = await projektAngebot(id);
    if ("error" in res) return { ok: false, error: res.error };
    await setzeSchritt(res.angebot, schritt, datum);
    revalidateProjekt(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Projekt-Schritt", err, id) };
  }
}

// --- Notiz ---

/** Kurze interne Notiz zum Projekt; leer löscht sie. */
export async function setProjektNotizAction(
  rawAngebotId: unknown,
  rawNotiz: unknown,
): Promise<ProjektResult> {
  await requireAdmin();
  const id = parseId(rawAngebotId);
  const parsed = parseProjektNotiz(rawNotiz);
  if (!id || !parsed) return { ok: false, error: INVALID };

  try {
    const res = await projektAngebot(id);
    if ("error" in res) return { ok: false, error: res.error };
    await aendereProjekt(res.angebot, () => ({ notiz: parsed.notiz }));
    revalidateProjekt(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Projekt-Notiz", err, id) };
  }
}

// --- Pflege ---

const OHNE_BEITRAG = "Dieses Angebot hat keinen Monatsbeitrag.";

/** Beginn der monatlichen Pflege (nicht nach einem gesetzten Ende). */
export async function setPflegeSeitAction(
  rawAngebotId: unknown,
  rawDatum: unknown,
): Promise<ProjektResult> {
  await requireAdmin();
  const id = parseId(rawAngebotId);
  if (!id) return { ok: false, error: INVALID };

  try {
    const res = await projektAngebot(id);
    if ("error" in res) return { ok: false, error: res.error };
    if (monatlichBrutto(res.angebot) <= 0)
      return { ok: false, error: OHNE_BEITRAG };
    const projekt = await getProjektByAngebot(id);
    const seit = parsePflegeSeit(
      rawDatum,
      projekt?.pflege_bis ?? null,
      new Date(),
    );
    if (!seit)
      return {
        ok: false,
        error: projekt?.pflege_bis
          ? "Der Beginn darf nicht nach dem Ende der Pflege liegen."
          : INVALID,
      };
    await aendereProjekt(res.angebot, () => ({ pflege_seit: seit }));
    revalidateProjekt(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Pflege-Beginn", err, id) };
  }
}

/**
 * „Pflege beendet“: letzter Tag der Pflege (rawDatum), oder null, um
 * sie wieder aufzunehmen. Das Ende liegt nicht vor dem Beginn.
 */
export async function setPflegeBisAction(
  rawAngebotId: unknown,
  rawDatum: unknown,
): Promise<ProjektResult> {
  await requireAdmin();
  const id = parseId(rawAngebotId);
  if (!id) return { ok: false, error: INVALID };

  try {
    const res = await projektAngebot(id);
    if ("error" in res) return { ok: false, error: res.error };
    if (monatlichBrutto(res.angebot) <= 0)
      return { ok: false, error: OHNE_BEITRAG };
    const projekt = await getProjektByAngebot(id);
    const angenommenAm = res.angebot.accepted_at
      ? berlinDateIso(new Date(res.angebot.accepted_at))
      : null;
    const seit = pflegeSeit(projekt, angenommenAm);
    let bis: string | null = null;
    if (rawDatum !== null) {
      bis = parsePflegeBis(rawDatum, seit, new Date());
      if (!bis)
        return {
          ok: false,
          error:
            seit && typeof rawDatum === "string" && rawDatum < seit
              ? "Das Ende darf nicht vor dem Beginn der Pflege liegen."
              : INVALID,
        };
    }
    // Nur das Ende: Ein abgeleiteter Beginn (Livegang, Annahme) bleibt
    // abgeleitet und folgt etwa einem späteren Livegang.
    await aendereProjekt(res.angebot, () => ({ pflege_bis: bis }));
    revalidateProjekt(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Pflege-Ende", err, id) };
  }
}

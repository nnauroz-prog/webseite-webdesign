"use server";

import { revalidatePath } from "next/cache";

import type { Angebot, FeldFehler } from "@/lib/admin/angebote";
import type { SchemaStatus } from "@/lib/admin/schema";
import type { AngebotErgebnis } from "@/lib/angebote-store";

import {
  ANGEBOT_STATUS_LABELS,
  editorPfad,
  hinweisKontext,
  istBearbeitbar,
  parseAblehnGrund,
  parseAngebotInhalt,
  parseZeitstempel,
  syncHinweise,
  ustSatzAusUmgebung,
} from "@/lib/admin/angebote";
import { requireAdmin } from "@/lib/admin/auth";
import { explainDbError } from "@/lib/admin/db-errors";
import { statusPatch } from "@/lib/admin/patches";
import { checkSchema } from "@/lib/admin/schema";
import { parseId } from "@/lib/admin/validate";
import {
  createAngebot,
  getAngebotById,
  markAngebotDeclined,
  markAngebotSent,
  removeAngebotEntwurf,
  updateAngebot,
  withdrawAngebot,
} from "@/lib/angebote-store";
import { addEvent, getLead, updateLead } from "@/lib/leads-store";

/*
 * Server Actions für Angebote (Admin). Regeln wie in actions.ts
 * (geprüft in tests/actions-guard.test.ts):
 * - Jede Action beginnt mit `await requireAdmin()`.
 * - IDs über parseId, Inhalte über parseAngebotInhalt; ungültig ergibt
 *   eine verständliche Meldung, nie einen rohen Datenbank-Fehler.
 * - Logs enthalten nur IDs und Fehlercodes, nie Inhalte oder den Token.
 */

export type AngebotResult = { ok: true } | { ok: false; error: string };

export type CreateAngebotResult =
  | { ok: true; href: string }
  | { ok: false; error: string };

export type SaveAngebotResult =
  | { ok: true; angebot: Angebot }
  | {
      ok: false;
      error: string;
      /** Feldpfad → Meldung (z. B. "positionen.2.preis_cent"). */
      fehler?: FeldFehler;
      /** Inzwischen woanders gespeichert (updated_at weicht ab). */
      konflikt?: boolean;
      /** Angenommen, abgelehnt oder zurückgezogen: nicht mehr änderbar. */
      gesperrt?: boolean;
      /** Angebot gibt es nicht mehr. */
      gone?: boolean;
    };

export type SendAngebotResult =
  | {
      ok: true;
      /** Die Anfrage stand auf „Neu“ und steht jetzt auf „In Arbeit“. */
      anfrageInArbeit: boolean;
    }
  | { ok: false; error: string; probleme?: string[] };

const INVALID = "Ungültige Eingabe.";
const GONE_LEAD = "Diese Anfrage gibt es nicht mehr.";
const GONE = "Dieses Angebot gibt es nicht mehr.";
const NEEDS_UPDATE =
  "Angebote gehen erst nach dem Datenbank-Update (siehe Hinweis oben).";

// --- Hilfen (nicht exportiert, also keine Actions) ---

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

/** Verständliche Meldung statt Rohtext; geloggt werden nur IDs und Code. */
function dbFailure(where: string, err: unknown, id?: string): string {
  console.error(`[admin] ${where} fehlgeschlagen`, {
    id: id ?? null,
    code: codeOf(err),
  });
  const e = explainDbError(err);
  return `${e.title} ${e.hint}`;
}

function angeboteProblem(schema: SchemaStatus): string | null {
  if (schema.angebote === "ok") return null;
  if (schema.angebote === "fehlt") return NEEDS_UPDATE;
  const e = explainDbError(schema.error ?? "unbekannt");
  return `${e.title} ${e.hint}`;
}

function revalidateAngebot(a: Pick<Angebot, "id" | "lead_id">): void {
  revalidatePath("/admin");
  revalidatePath(`/admin/anfragen/${a.lead_id}`);
  revalidatePath(editorPfad(a.lead_id, a.id));
}

/** Meldung zu einem abgelehnten Statuswechsel (du-Form). */
function grundText(res: Extract<AngebotErgebnis, { ok: false }>): string {
  switch (res.grund) {
    case "nicht_gefunden":
      return GONE;
    case "gesperrt":
      return res.angebot
        ? `Das geht nicht mehr: Das Angebot steht inzwischen auf „${ANGEBOT_STATUS_LABELS[res.angebot.status]}“. Lade die Seite neu.`
        : "Das geht in diesem Status nicht. Lade die Seite neu.";
    case "unvollstaendig":
      return "Vor dem Senden fehlt noch etwas.";
    case "konflikt":
      return "Das Angebot wurde inzwischen an anderer Stelle geändert.";
    case "abgelaufen":
      return "Das Angebot ist abgelaufen.";
    case "geaendert":
      return "Das Angebot wurde inzwischen geändert. Lade die Seite neu.";
    case "ungueltig":
      return INVALID;
  }
}

/**
 * Anfrage „Neu“ → „In Arbeit“ nach dem Senden. Scheitert das, bleibt
 * das Angebot trotzdem gesendet (nur loggen). true bei Wechsel.
 */
async function anfrageBeantwortet(
  leadId: string,
  actor: string,
): Promise<boolean> {
  try {
    const [schema, lead] = await Promise.all([checkSchema(), getLead(leadId)]);
    if (!lead || lead.status !== "neu") return false;
    const { found } = await updateLead(
      leadId,
      statusPatch("in_arbeit", schema.leadsV2 === "ok"),
    );
    if (!found) return false;
    await addEvent(leadId, actor, "status", { from: "neu", to: "in_arbeit" });
    return true;
  } catch (err) {
    console.error("[admin] Status nach dem Senden nicht gesetzt", {
      id: leadId,
      code: codeOf(err),
    });
    return false;
  }
}

// --- Anlegen ---

/**
 * „Angebot erstellen“: Entwurf aus der Anfrage (Paket, Preise,
 * Standardtexte) anlegen. Gibt den Editor-Pfad zurück; die Oberfläche
 * navigiert selbst dorthin.
 */
export async function createAngebotAction(
  rawLeadId: unknown,
): Promise<CreateAngebotResult> {
  const actor = await requireAdmin();
  const leadId = parseId(rawLeadId);
  if (!leadId) return { ok: false, error: INVALID };

  try {
    const [schema, lead] = await Promise.all([checkSchema(), getLead(leadId)]);
    if (!lead) return { ok: false, error: GONE_LEAD };
    const problem = angeboteProblem(schema);
    if (problem) return { ok: false, error: problem };

    const angebot = await createAngebot(lead, actor);
    revalidateAngebot(angebot);
    return { ok: true, href: editorPfad(lead.id, angebot.id) };
  } catch (err) {
    return { ok: false, error: dbFailure("Angebot erstellen", err, leadId) };
  }
}

// --- Bearbeiten ---

/**
 * Speichert den Inhalt aus dem Editor. rawUpdatedAt ist der Stand beim
 * Öffnen bzw. letzten Speichern; weicht der gespeicherte Stand ab,
 * kommt `konflikt` zurück (nichts wird überschrieben). Ohne
 * rawUpdatedAt („Meine Fassung speichern“) wird ohne diese Prüfung
 * gespeichert.
 */
export async function saveAngebotAction(
  rawId: unknown,
  rawInhalt: unknown,
  rawUpdatedAt: unknown,
): Promise<SaveAngebotResult> {
  await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };
  let expected: string | null = null;
  if (rawUpdatedAt != null && rawUpdatedAt !== "") {
    expected = parseZeitstempel(rawUpdatedAt);
    if (!expected) return { ok: false, error: INVALID };
  }
  const parsed = parseAngebotInhalt(rawInhalt);
  if (!parsed.ok) {
    return {
      ok: false,
      error: "Bitte prüf die markierten Felder.",
      fehler: parsed.fehler,
    };
  }

  try {
    const current = await getAngebotById(id);
    if (!current) return { ok: false, error: GONE, gone: true };
    if (!istBearbeitbar(current.status)) {
      return {
        ok: false,
        error: `Nicht gespeichert: Das Angebot steht inzwischen auf „${ANGEBOT_STATUS_LABELS[current.status]}“ und lässt sich nicht mehr ändern.`,
        gesperrt: true,
      };
    }
    // Der Steuersatz ist keine Frage pro Angebot (Kleinunternehmer oder
    // nicht): Er kommt immer aus ANGEBOT_UST_SATZ, nie aus dem Browser.
    const neu = {
      ...parsed.inhalt,
      ust_satz: ustSatzAusUmgebung(process.env.ANGEBOT_UST_SATZ),
    };
    // Standardsätze (Paket-Dauer, Monatsbeitrag, USt, Gültig bis) noch
    // einmal gegen den gespeicherten Stand abgleichen. Hat der Editor
    // sie schon angepasst, ändert sich hier nichts.
    const inhalt = {
      ...neu,
      hinweise: syncHinweise(
        neu.hinweise,
        hinweisKontext(current),
        hinweisKontext(neu),
      ),
    };
    const res = await updateAngebot(id, inhalt, {
      expectedUpdatedAt: expected,
    });
    if (!res.ok) {
      if (res.grund === "nicht_gefunden") {
        return { ok: false, error: GONE, gone: true };
      }
      if (res.grund === "konflikt") {
        return {
          ok: false,
          error:
            "Nicht gespeichert: Das Angebot wurde inzwischen an anderer Stelle geändert.",
          konflikt: true,
        };
      }
      return { ok: false, error: grundText(res), gesperrt: true };
    }
    revalidateAngebot(res.angebot);
    return { ok: true, angebot: res.angebot };
  } catch (err) {
    return { ok: false, error: dbFailure("Angebot speichern", err, id) };
  }
}

// --- Status ---

/**
 * Nach „Gesendet?“ → Ja: Status „gesendet“ (auch erneut), Verlauf.
 * Prüft vorher, ob etwas fehlt (Name, Titel, Positionen, Gültig bis).
 * Ein gesendetes Angebot ist eine Antwort: Steht die Anfrage noch auf
 * „Neu“, kommt sie auf „In Arbeit“ (wie nach „Mail gesendet?“ → Ja).
 */
export async function markAngebotSentAction(
  rawId: unknown,
): Promise<SendAngebotResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };
  try {
    const res = await markAngebotSent(id, actor);
    if (!res.ok) {
      return {
        ok: false,
        error: grundText(res),
        ...(res.probleme ? { probleme: res.probleme } : {}),
      };
    }
    const anfrageInArbeit = await anfrageBeantwortet(
      res.angebot.lead_id,
      actor,
    );
    revalidateAngebot(res.angebot);
    return { ok: true, anfrageInArbeit };
  } catch (err) {
    return {
      ok: false,
      error: dbFailure("Angebot als gesendet markieren", err, id),
    };
  }
}

/** Gesendet → zurückgezogen (Kundenseite: „nicht mehr gültig“). */
export async function withdrawAngebotAction(
  rawId: unknown,
): Promise<AngebotResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };
  try {
    const res = await withdrawAngebot(id, actor);
    if (!res.ok) return { ok: false, error: grundText(res) };
    revalidateAngebot(res.angebot);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Angebot zurückziehen", err, id) };
  }
}

/** „Als abgelehnt markieren“ (z. B. nach einem Anruf), Grund optional. */
export async function declineAngebotAction(
  rawId: unknown,
  rawGrund: unknown,
): Promise<AngebotResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  const grund = parseAblehnGrund(rawGrund === "" ? null : rawGrund);
  if (!id || !grund) return { ok: false, error: INVALID };
  try {
    const res = await markAngebotDeclined(id, actor, grund.grund);
    if (!res.ok) return { ok: false, error: grundText(res) };
    revalidateAngebot(res.angebot);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: dbFailure("Angebot als abgelehnt markieren", err, id),
    };
  }
}

/** Entwurf verwerfen (nur Status „entwurf“; Gesendetes bleibt als Beleg). */
export async function discardAngebotAction(
  rawId: unknown,
): Promise<AngebotResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };
  try {
    const current = await getAngebotById(id);
    if (!current) return { ok: false, error: GONE };
    if (current.status !== "entwurf") {
      return {
        ok: false,
        error:
          "Nur Entwürfe lassen sich verwerfen. Gesendete Angebote kannst du zurückziehen.",
      };
    }
    const { removed } = await removeAngebotEntwurf(id, actor);
    if (!removed) {
      return {
        ok: false,
        error:
          "Nicht verworfen: Das Angebot ist kein Entwurf mehr. Lade die Seite neu.",
      };
    }
    revalidateAngebot(current);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Entwurf verwerfen", err, id) };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { SchemaStatus } from "@/lib/admin/schema";
import type {
  LeadOutcome,
  LeadRow,
  LeadSnapshot,
  LeadStatus,
} from "@/lib/leads-meta";

import { requireAdmin } from "@/lib/admin/auth";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { explainDbError } from "@/lib/admin/db-errors";
import { isPastDate, PAST_DATE_ERROR } from "@/lib/admin/follow-up";
import { notesFingerprint, prependNoteLine } from "@/lib/admin/notes";
import { contactPatch, restorePatch, statusPatch } from "@/lib/admin/patches";
import { checkSchema } from "@/lib/admin/schema";
import { matchLead, relatedLeads } from "@/lib/admin/search";
import {
  parseConfirm,
  parseContact,
  parseDeleteReason,
  parseFingerprint,
  parseId,
  parseIsoDate,
  parseLostReason,
  parseNext,
  parseNote,
  parseNotes,
  parseOutcome,
  parseQuery,
  parseSnapshot,
  parseStatus,
  parseTemplateId,
} from "@/lib/admin/validate";
import { deliverLead, explainDeliveryError, mailSetup } from "@/lib/lead-mail";
import { CONTACT_RESULT_LABELS } from "@/lib/leads-meta";
import {
  addEvent,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
  type LeadPatch,
} from "@/lib/leads-store";
import { adminConfigured, adminEmails } from "@/lib/supabase/env";
import { sessionClient } from "@/lib/supabase/server";

/*
 * Server Actions für den Admin-Bereich.
 *
 * Regeln (geprüft in tests/actions-guard.test.ts):
 * - Jede Action außer login und logout beginnt mit
 *   `const actor = await requireAdmin();`.
 * - Eingaben laufen über lib/admin/validate.ts; ungültig ergibt
 *   „Ungültige Eingabe.“, nie einen rohen Datenbank-Fehler.
 * - follow_up_on, outcome und lost_reason werden nur gesendet, wenn
 *   checkSchema().leadsV2 === 'ok' ist.
 * - Logs enthalten nur IDs und Fehlercodes, keine Kundendaten.
 */

export type ActionState = {
  error?: string;
  saved?: boolean;
  info?: string;
  /** Login: eingegebene E-Mail, damit sie nach einem Fehler stehen bleibt. */
  email?: string;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

export type StatusResult =
  | {
      ok: true;
      /** Zustand vorher, für „Rückgängig“ (restoreLeadAction). */
      undo: LeadSnapshot;
      /** Schritt 2 „Wie ist es ausgegangen?“ anbieten. */
      askOutcome: boolean;
    }
  | { ok: false; error: string };

export type ContactActionResult =
  | {
      ok: true;
      /** Status wurde geändert (neu → in_arbeit bzw. Absage → erledigt). */
      statusChanged: boolean;
      /** Status nach dem Speichern (für die Rückmeldung). */
      newStatus: LeadStatus;
      /** Zustand vorher, wenn sich der Status geändert hat. */
      undo?: LeadSnapshot;
      /** Nach einer gesendeten Absage: Grund-Chips zeigen. */
      askReason: boolean;
      /** Kein Verlauf vorhanden, Kontakt steht stattdessen in den Notizen. */
      asNote: boolean;
    }
  | { ok: false; error: string };

export type NotesState = {
  saved?: boolean;
  error?: string;
  conflict?: boolean;
  gone?: boolean;
  /** Eigener Text, damit nach einem Fehler nichts verloren geht. */
  draft?: string;
  /** Fingerabdruck der gespeicherten Notizen. */
  fingerprint?: string;
};

export type SearchHit = Omit<LeadRow, "notes">;

export type SearchState = {
  q: string;
  hits: SearchHit[];
  /** Mehr Treffer als angezeigt. */
  more: boolean;
  /** Die 500er-Grenze wurde erreicht: nur die neuesten 500 durchsucht. */
  truncated: boolean;
  error?: string;
};

const INVALID = "Ungültige Eingabe.";
const GONE = "Diese Anfrage gibt es nicht mehr.";
const NEEDS_UPDATE =
  "Das geht erst nach dem Datenbank-Update (siehe Hinweis oben).";
const SEARCH_LIMIT = 30;

// --- Hilfen (nicht exportiert, also keine Actions) ---

function codeOf(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return err instanceof Error ? err.name : "unbekannt";
}

/** Verständliche Meldung statt Rohtext; geloggt werden nur ID und Code. */
function dbFailure(where: string, err: unknown, leadId?: string): string {
  console.error(`[admin] ${where} fehlgeschlagen`, {
    leadId: leadId ?? null,
    code: codeOf(err),
  });
  const e = explainDbError(err);
  return `${e.title} ${e.hint}`;
}

/** Hinweis, wenn die neuen Spalten nicht sicher vorhanden sind. */
function v2Problem(schema: SchemaStatus): string | null {
  if (schema.leadsV2 === "ok") return null;
  if (schema.leadsV2 === "fehlt") return NEEDS_UPDATE;
  const e = explainDbError(schema.error ?? "unbekannt");
  return `${e.title} ${e.hint}`;
}

function snapshotOf(lead: LeadRow): LeadSnapshot {
  return {
    status: lead.status,
    follow_up_on: lead.follow_up_on ?? null,
    outcome: lead.outcome ?? null,
    lost_reason: lead.lost_reason ?? null,
  };
}

/** Treffer ohne Notizen an den Client (kleiner, keine internen Texte). */
function withoutNotes(lead: LeadRow): SearchHit {
  const hit: Partial<LeadRow> = { ...lead };
  delete hit.notes;
  return hit as SearchHit;
}

function revalidateLead(id: string): void {
  revalidatePath("/admin");
  revalidatePath(`/admin/anfragen/${id}`);
}

// --- Anmeldung ---

export async function login(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await signIn(prev, formData);
  // E-Mail zurückgeben: Das Formular wird nach dem Absenden geleert.
  return { ...result, email: String(formData.get("email") ?? "").trim().slice(0, 254) };
}

async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!adminConfigured()) {
    return {
      error:
        "Der Admin-Bereich ist noch nicht eingerichtet (Supabase-Variablen fehlen).",
    };
  }
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password)
    return { error: "Bitte E-Mail und Passwort eingeben." };
  // Nur /admin oder /admin/anfragen/<uuid>, sonst /admin: keine
  // offene Weiterleitung über die Login-Seite.
  const next = parseNext(formData.get("next")) ?? "/admin";

  const supabase = await sessionClient();
  if (!supabase) return { error: "Supabase ist nicht konfiguriert." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Grund im Vercel-Log festhalten (ohne E-Mail) und verständlich
    // anzeigen: „falsches Passwort“ und „falscher Schlüssel“ sehen
    // sonst gleich aus.
    console.error(
      `[admin] Login fehlgeschlagen: ${error.status ?? "?"} ${error.code ?? ""} ${error.message}`,
    );
    const msg = `${error.code ?? ""} ${error.message}`.toLowerCase();
    if (msg.includes("api key") || error.status === 401) {
      return {
        error:
          "Supabase lehnt den Schlüssel ab. NEXT_PUBLIC_SUPABASE_ANON_KEY passt nicht zur Project URL. Trag beide aus demselben Supabase-Projekt in Vercel ein und deploye neu.",
      };
    }
    if (msg.includes("not_confirmed") || msg.includes("not confirmed")) {
      return {
        error:
          "Dieses Konto ist in Supabase noch nicht bestätigt (Authentication → Users → Confirm).",
      };
    }
    if (msg.includes("invalid_credentials") || msg.includes("invalid login")) {
      return { error: "E-Mail oder Passwort stimmt nicht." };
    }
    if (/fetch failed|network|timeout|50[234]/.test(msg)) {
      return {
        error:
          "Supabase ist nicht erreichbar. Kostenlose Projekte pausieren nach einer Woche ohne Nutzung: im Supabase-Dashboard auf ‚Restore project‘ tippen.",
      };
    }
    return {
      error:
        "Anmeldung gerade nicht möglich. Versuch es bitte gleich noch einmal.",
    };
  }

  if (!adminEmails().includes(email)) {
    await supabase.auth.signOut();
    return { error: "Dieses Konto hat keinen Zugang zum Admin-Bereich." };
  }
  redirect(next);
}

/**
 * Nur abmelden, ohne Weiterleitung: Die Oberfläche (logout-button.tsx)
 * lädt danach die Login-Seite als neues Dokument, damit keine
 * Seitendaten im Speicher des Browsers bleiben.
 */
export async function logout(): Promise<void> {
  const supabase = await sessionClient();
  await supabase?.auth.signOut();
}

// --- Status, Rückgängig, Ergebnis ---

/**
 * Status mit einem Tipp setzen. Gibt den Zustand vorher zurück, damit
 * „Rückgängig“ ihn wiederherstellen kann.
 */
export async function setStatusAction(
  rawId: unknown,
  rawStatus: unknown,
): Promise<StatusResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  const status = parseStatus(rawStatus);
  if (!id || !status) return { ok: false, error: INVALID };

  try {
    const [schema, lead] = await Promise.all([checkSchema(), getLead(id)]);
    if (!lead) return { ok: false, error: GONE };
    const v2 = schema.leadsV2 === "ok";
    const undo = snapshotOf(lead);

    const { found } = await updateLead(id, statusPatch(status, v2));
    if (!found) return { ok: false, error: GONE };
    if (lead.status !== status) {
      await addEvent(id, actor, "status", { from: lead.status, to: status });
    }
    revalidateLead(id);
    return { ok: true, undo, askOutcome: status === "erledigt" && v2 };
  } catch (err) {
    return { ok: false, error: dbFailure("Status setzen", err, id) };
  }
}

/** „Rückgängig“: Schnappschuss aus setStatusAction wiederherstellen. */
export async function restoreLeadAction(
  rawId: unknown,
  rawSnapshot: unknown,
): Promise<ActionResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  // parseSnapshot prüft Daten ohne Zeitfenster (parseStoredDate), damit
  // auch eine überfällige Wiedervorlage zurückkommt.
  const snapshot = parseSnapshot(rawSnapshot);
  if (!id || !snapshot) return { ok: false, error: INVALID };

  try {
    const [schema, lead] = await Promise.all([checkSchema(), getLead(id)]);
    if (!lead) return { ok: false, error: GONE };

    // Ohne die neuen Spalten kann der Schnappschuss sie nicht enthalten.
    const patch = restorePatch(snapshot, schema.leadsV2 === "ok");
    if (!patch) return { ok: false, error: INVALID };

    const { found } = await updateLead(id, patch);
    if (!found) return { ok: false, error: GONE };
    if (lead.status !== snapshot.status) {
      await addEvent(id, actor, "status", {
        from: lead.status,
        to: snapshot.status,
        rueckgaengig: true,
      });
    }
    revalidateLead(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Rückgängig", err, id) };
  }
}

/**
 * Ergebnis einer Anfrage: 'gewonnen', 'verloren' (mit optionalem Grund)
 * oder null („Ohne Angabe“, wird trotzdem im Verlauf vermerkt).
 */
export async function setOutcomeAction(
  rawId: unknown,
  rawOutcome: unknown,
  rawReason?: unknown,
): Promise<ActionResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };

  let outcome: LeadOutcome | null = null;
  if (rawOutcome != null) {
    outcome = parseOutcome(rawOutcome);
    if (!outcome) return { ok: false, error: INVALID };
  }
  let lostReason: string | null = null;
  if (rawReason != null && rawReason !== "") {
    if (outcome !== "verloren") return { ok: false, error: INVALID };
    lostReason = parseLostReason(rawReason);
    if (!lostReason) return { ok: false, error: INVALID };
  }

  try {
    const schema = await checkSchema();
    const problem = v2Problem(schema);
    if (problem) return { ok: false, error: problem };

    const { found } = await updateLead(id, {
      outcome,
      lost_reason: lostReason,
    });
    if (!found) return { ok: false, error: GONE };
    await addEvent(id, actor, "ergebnis", { outcome, lost_reason: lostReason });
    revalidateLead(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Ergebnis speichern", err, id) };
  }
}

// --- Wiedervorlage ---

/** Wiedervorlage setzen (yyyy-mm-dd, gestern bis +400 Tage) oder entfernen (null). */
export async function setFollowUpAction(
  rawId: unknown,
  rawDate: unknown,
): Promise<ActionResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  if (!id) return { ok: false, error: INVALID };
  let date: string | null = null;
  if (rawDate != null && rawDate !== "") {
    const now = new Date();
    date = parseIsoDate(rawDate, now);
    if (!date) {
      // Gestern ist noch erlaubt (Zeitzonen-Puffer), davor ein klarer Hinweis.
      const past = isPastDate(rawDate, berlinDateIso(now));
      return { ok: false, error: past ? PAST_DATE_ERROR : INVALID };
    }
  }

  try {
    const schema = await checkSchema();
    const problem = v2Problem(schema);
    if (problem) return { ok: false, error: problem };

    const { found } = await updateLead(id, { follow_up_on: date });
    if (!found) return { ok: false, error: GONE };
    await addEvent(id, actor, "wiedervorlage", { am: date });
    revalidateLead(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Wiedervorlage speichern", err, id) };
  }
}

// --- Kontakt-Rückfrage ---

/**
 * Antwort auf „Erreicht?“ bzw. „Mail gesendet?“.
 *
 * - Erreicht oder Mail gesendet: Status neu wird In Arbeit (die
 *   Antwortfrist endet). Mailbox und Nicht erreicht ändern nichts.
 * - Mail gesendet mit Vorlage „absage“: Erledigt + Kein Auftrag; die
 *   Oberfläche fragt danach den Grund ab (askReason).
 * - Ohne Verlaufstabelle wird der Kontakt als Notizzeile gespeichert.
 */
export async function logContactAction(
  rawId: unknown,
  rawKanal: unknown,
  rawErgebnis: unknown,
  rawVorlage?: unknown,
): Promise<ContactActionResult> {
  const actor = await requireAdmin();
  const id = parseId(rawId);
  const contact = parseContact(rawKanal, rawErgebnis);
  const vorlage =
    rawVorlage == null || rawVorlage === ""
      ? null
      : parseTemplateId(rawVorlage);
  if (
    !id ||
    !contact ||
    (rawVorlage != null && rawVorlage !== "" && !vorlage)
  ) {
    return { ok: false, error: INVALID };
  }

  try {
    const [schema, lead] = await Promise.all([checkSchema(), getLead(id)]);
    if (!lead) return { ok: false, error: GONE };
    const v2 = schema.leadsV2 === "ok";

    const plan = contactPatch(lead, contact, vorlage, v2);
    const { isAbsage, askReason } = plan;
    const patch: LeadPatch = { ...plan.patch };

    // Kontakt in den Verlauf; fehlt die Tabelle, als Notizzeile.
    const detail = {
      kanal: contact.kanal,
      ergebnis: contact.ergebnis,
      ...(vorlage ? { vorlage } : {}),
    };
    const logged =
      schema.events !== "fehlt" &&
      (await addEvent(id, actor, "kontakt", detail));
    const asNote = !logged;
    if (asNote) {
      const label =
        contact.kanal === "anruf"
          ? `Anruf: ${CONTACT_RESULT_LABELS[contact.ergebnis]}`
          : vorlage === "absage"
            ? "Mail gesendet (Absage)"
            : "Mail gesendet";
      patch.notes = prependNoteLine(lead.notes ?? "", label, new Date());
    }

    if (Object.keys(patch).length > 0) {
      const { found } = await updateLead(id, patch);
      if (!found) return { ok: false, error: GONE };
    }
    const statusChanged =
      patch.status !== undefined && patch.status !== lead.status;
    if (statusChanged) {
      await addEvent(id, actor, "status", {
        from: lead.status,
        to: patch.status,
      });
    }
    if (isAbsage && v2) {
      await addEvent(id, actor, "ergebnis", {
        outcome: "verloren",
        lost_reason: null,
      });
    }
    revalidateLead(id);
    return {
      ok: true,
      statusChanged,
      newStatus: patch.status ?? lead.status,
      ...(statusChanged || isAbsage ? { undo: snapshotOf(lead) } : {}),
      askReason,
      asNote,
    };
  } catch (err) {
    return { ok: false, error: dbFailure("Kontakt speichern", err, id) };
  }
}

// --- Notizen ---

/** Schnellnotiz: „31.10. 14:12 · text“ oben anfügen. */
export async function appendNoteAction(
  rawId: unknown,
  rawText: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const id = parseId(rawId);
  const text = parseNote(rawText);
  if (!id || !text) return { ok: false, error: INVALID };

  try {
    const lead = await getLead(id);
    if (!lead) return { ok: false, error: GONE };
    const notes = prependNoteLine(lead.notes ?? "", text, new Date());
    const { found } = await updateLead(id, { notes });
    if (!found) return { ok: false, error: GONE };
    // Bewusst kein Verlaufseintrag: Der Notizblock hat eigene Zeitstempel.
    revalidateLead(id);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: dbFailure("Notiz speichern", err, id) };
  }
}

/**
 * „Alle Notizen bearbeiten“ speichern. fingerprint ist der Stand beim
 * Öffnen des Editors; weicht der gespeicherte Stand ab, wird nicht
 * überschrieben (conflict), und der Entwurf kommt zurück.
 */
export async function updateNotesAction(
  _prev: NotesState,
  formData: FormData,
): Promise<NotesState> {
  const actor = await requireAdmin();
  const rawDraft = formData.get("notes");
  const draft = typeof rawDraft === "string" ? rawDraft : "";
  const id = parseId(formData.get("id"));
  const notes = parseNotes(rawDraft);
  const fingerprint = parseFingerprint(formData.get("fingerprint"));
  if (!id || notes === null || !fingerprint) {
    return { error: INVALID, draft };
  }

  try {
    const lead = await getLead(id);
    if (!lead) return { gone: true, draft };
    if (notesFingerprint(lead.notes ?? "") !== fingerprint) {
      return { conflict: true, draft };
    }
    const { found } = await updateLead(id, { notes });
    if (!found) return { gone: true, draft };
    // Nur die Länge, nie der Inhalt.
    await addEvent(id, actor, "notizen", { zeichen: notes.length });
    revalidateLead(id);
    return { saved: true, fingerprint: notesFingerprint(notes) };
  } catch (err) {
    return { error: dbFailure("Notizen speichern", err, id), draft };
  }
}

// --- Suche ---

/**
 * Suche über alle Anfragen (auch Archiv). Per POST, damit E-Mail-
 * Adressen und Nummern nicht in URL, Verlauf oder Logs landen.
 */
export async function searchLeadsAction(
  _prev: SearchState,
  formData: FormData,
): Promise<SearchState> {
  await requireAdmin();
  const q = parseQuery(formData.get("q"));
  if (q === null) {
    return { q: "", hits: [], more: false, truncated: false, error: INVALID };
  }
  if (!q) return { q: "", hits: [], more: false, truncated: false };

  try {
    const all = await listLeads();
    const matches = all.filter((lead) => matchLead(lead, q));
    const hits = matches.slice(0, SEARCH_LIMIT).map(withoutNotes);
    return {
      q,
      hits,
      more: matches.length > SEARCH_LIMIT,
      truncated: all.length >= 500,
    };
  } catch (err) {
    return {
      q,
      hits: [],
      more: false,
      truncated: false,
      error: dbFailure("Suche", err),
    };
  }
}

// --- Endgültig löschen (Art. 17) ---

/**
 * Löscht eine archivierte Anfrage endgültig. Grund und Bestätigung
 * sind Pflicht. Bei Erfolg Weiterleitung auf /admin?geloescht=1
 * (Protokoll geschrieben) bzw. =2 (ohne Protokolltabelle), bei einer
 * Löschanfrage der Person mit &weitere=n für verbleibende Einträge.
 */
export async function deleteLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return { error: INVALID };
  const reason = parseDeleteReason(formData.get("reason"));
  if (!reason) return { error: "Bitte wähle einen Grund." };
  if (!parseConfirm(formData.get("confirm"))) {
    return {
      error:
        "Bitte bestätige, dass sich das Löschen nicht rückgängig machen lässt.",
    };
  }

  let target: string;
  try {
    const lead = await getLead(id);
    if (!lead) return { error: GONE };
    if (lead.status !== "archiviert") {
      return { error: "Nur archivierte Anfragen lassen sich löschen." };
    }
    // Weitere Einträge derselben Person (E-Mail ohne Groß-/Klein-
    // schreibung, Telefon 0176 = +49 176) für den Hinweis danach.
    const others =
      reason === "anfrage_person"
        ? relatedLeads(lead, await listLeads()).length
        : 0;

    const { deleted, logged } = await deleteLead(id, actor, reason);
    if (!deleted)
      return { error: "Nur archivierte Anfragen lassen sich löschen." };

    target = `/admin?geloescht=${logged ? 1 : 2}${others > 0 ? `&weitere=${others}` : ""}`;
  } catch (err) {
    return { error: dbFailure("Löschen", err, id) };
  }

  // Erst den Router-Cache leeren (sonst zeigt die Zurück-Geste die
  // gelöschte Detailseite), dann weiterleiten. redirect() wirft.
  revalidatePath("/admin", "layout");
  redirect(target);
}

// --- Test-Mail ---

/** Schickt eine Test-Mail über denselben Weg wie echte Anfragen. */
export async function sendTestMail(): Promise<ActionState> {
  const actor = await requireAdmin();
  const { to } = mailSetup();
  try {
    const via = await deliverLead({
      kind: "anfrage",
      subject: "Test-Mail von sitalo.de/admin",
      fields: [
        [
          "Hinweis",
          "Wenn diese Mail ankommt, erreichen dich alle Anfragen von der Website.",
        ],
        ["Ausgelöst von", actor],
      ],
      replyTo: actor,
    });
    return {
      saved: true,
      info: `Gesendet über ${via === "resend" ? "Resend" : "Formspree"} an ${to}. Schau bitte auch im Spam-Ordner nach.`,
    };
  } catch (err) {
    return {
      error: explainDeliveryError(
        err instanceof Error ? err.message : String(err),
      ),
    };
  }
}

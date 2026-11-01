import "server-only";

import type {
  Angebot,
  AngebotEventDetail,
  AngebotInhalt,
  AngebotKurz,
  AngebotOeffentlich,
} from "@/lib/admin/angebote";
import type { LeadRow } from "@/lib/leads-meta";

import {
  ANGEBOT_COLUMNS,
  ANGEBOT_KURZ_COLUMNS,
  ANGEBOT_PUBLIC_COLUMNS,
  angebotAusZeile,
  angebotAusAnfrage,
  BEARBEITBAR,
  darfWechseln,
  erzeugeToken,
  istAbgelaufen,
  istBearbeitbar,
  nurInhalt,
  oeffentlicheSicht,
  parseAblehnGrund,
  parseAnnahmeName,
  parseToken,
  parseZeitstempel,
  sendeProbleme,
  ustSatzAusUmgebung,
} from "@/lib/admin/angebote";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import { addEvent } from "@/lib/leads-store";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Speicher für Angebote (Tabelle public.angebote, Migration
 * 20261102000000_angebote.sql). Nur auf dem Server.
 *
 * - Admin-Funktionen (…ById, create, update, markSent, withdraw …)
 *   erst nach requireAdmin() aufrufen.
 * - Kunden-Funktionen (…ByToken, markViewed, accept, decline) prüfen
 *   den Token selbst und liefern der Seite nur Angebotsfelder.
 * - Fehler: DbError mit PostgREST-Code (explainDbError, isMissingTable).
 *   Fehlt die Tabelle, liefern die Listen null statt zu werfen.
 * - Statuswechsel laufen als bedingtes Update (WHERE status = …),
 *   damit zwei gleichzeitige Klicks nichts doppelt setzen.
 * - Verlauf (lead_events, action 'angebot'): nur Art und Nummer, keine
 *   Inhalte. Logs: nur IDs und Fehlercodes, nie der Token.
 */

type PgError = { message: string; code?: string };

const COLS = ANGEBOT_COLUMNS.join(",");
const KUNDE = "kunde";

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

function needDb() {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  return db;
}

function rows(data: unknown): Angebot[] {
  return Array.isArray(data) ? data.map((r) => angebotAusZeile(r)) : [];
}

async function event(
  a: Pick<Angebot, "lead_id" | "nummer">,
  actor: string,
  was: AngebotEventDetail["was"],
  extra: Partial<AngebotEventDetail> = {},
): Promise<void> {
  const detail: AngebotEventDetail = { was, nummer: a.nummer, ...extra };
  await addEvent(a.lead_id, actor, "angebot", detail);
}

/** Ergebnis einer Änderung. Bei ok: false steht der aktuelle Stand in angebot (falls es ihn gibt). */
export type AngebotErgebnis =
  | { ok: true; angebot: Angebot }
  | {
      ok: false;
      grund:
        | "nicht_gefunden"
        | "gesperrt"
        | "abgelaufen"
        | "konflikt"
        | "unvollstaendig"
        | "ungueltig"
        /** Kunde: Angebot nach dem Laden der Seite geändert. */
        | "geaendert";
      angebot?: Angebot;
      /** Bei 'unvollstaendig': was vor dem Senden fehlt (du-Form). */
      probleme?: string[];
    };

// --- Lesen (Admin) -----------------------------------------------------

/**
 * Alle Angebote einer Anfrage, neueste zuerst. null, wenn die Tabelle
 * fehlt (Migration noch nicht ausgeführt) oder Supabase nicht
 * konfiguriert ist.
 */
export async function getAngeboteByLead(
  leadId: string,
): Promise<Angebot[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("angebote")
    .select(COLS)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Angebote konnten nicht geladen werden", error);
  }
  return rows(data);
}

/** Ein Angebot nach ID, null wenn es fehlt. Wirft DbError (auch ohne Tabelle). */
export async function getAngebotById(id: string): Promise<Angebot | null> {
  const db = needDb();
  const { data, error } = await db
    .from("angebote")
    .select(COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw dbError("Angebot konnte nicht geladen werden", error);
  return data ? angebotAusZeile(data) : null;
}

/**
 * Kurzzeilen aller Angebote (neueste 500 zuerst), für Hinweise auf
 * den Karten der Übersicht (angebotHinweis, angeboteNachAnfrage).
 * null, wenn die Tabelle fehlt.
 */
export async function listAngeboteKurz(): Promise<AngebotKurz[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("angebote")
    .select(ANGEBOT_KURZ_COLUMNS.join(","))
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Angebote konnten nicht geladen werden", error);
  }
  return (data ?? []) as unknown as AngebotKurz[];
}

// --- Lesen (Kundenseite) -----------------------------------------------

/**
 * Angebot zum öffentlichen Link, nur Angebotsfelder (ohne Anfrage-ID,
 * Token, E-Mail-Adresse). null bei ungültigem oder unbekanntem Token,
 * ohne Tabelle oder ohne Konfiguration. Liefert jeden Status, auch
 * Entwürfe: Die Seite entscheidet (Entwurf nur für den Admin).
 */
export async function getAngebotByToken(
  token: string,
): Promise<AngebotOeffentlich | null> {
  const t = parseToken(token);
  if (!t) return null;
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("angebote")
    .select(ANGEBOT_PUBLIC_COLUMNS.join(","))
    .eq("token", t)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Angebot konnte nicht geladen werden", error);
  }
  if (!data) return null;
  // angebotAusZeile prüft Positionen und Steuersatz; oeffentlicheSicht
  // lässt nur die öffentlichen Felder durch.
  return oeffentlicheSicht(angebotAusZeile(data));
}

/** Volles Angebot zum Token (nur intern, für Annahme/Ablehnung). */
async function getFullByToken(token: string): Promise<Angebot | null> {
  const db = needDb();
  const { data, error } = await db
    .from("angebote")
    .select(COLS)
    .eq("token", token)
    .maybeSingle();
  if (error) throw dbError("Angebot konnte nicht geladen werden", error);
  return data ? angebotAusZeile(data) : null;
}

// --- Schreiben (Admin) -------------------------------------------------

/**
 * Legt einen Entwurf an: Inhalt aus der Anfrage (angebotAusAnfrage,
 * USt aus ANGEBOT_UST_SATZ) oder opts.inhalt (schon geprüft). Nummer
 * vergibt die Datenbank, den Token die App. Verlauf: „erstellt“.
 */
export async function createAngebot(
  lead: Pick<LeadRow, "id" | "fields" | "reply_to">,
  actor: string,
  opts: { now?: Date; inhalt?: AngebotInhalt } = {},
): Promise<Angebot> {
  const db = needDb();
  const inhalt =
    opts.inhalt ??
    angebotAusAnfrage(lead, {
      now: opts.now ?? new Date(),
      ustSatz: ustSatzAusUmgebung(process.env.ANGEBOT_UST_SATZ),
    });
  for (let attempt = 0; ; attempt++) {
    const { data, error } = await db
      .from("angebote")
      .insert({ lead_id: lead.id, token: erzeugeToken(), ...nurInhalt(inhalt) })
      .select(COLS)
      .single();
    if (!error) {
      const angebot = angebotAusZeile(data);
      await event(angebot, actor, "erstellt");
      return angebot;
    }
    // 23505: Token oder Nummer schon vergeben (praktisch nie) → neu versuchen.
    if (error.code === "23505" && attempt < 2) continue;
    throw dbError("Angebot konnte nicht angelegt werden", error);
  }
}

/** Nach einem bedingten Update ohne Treffer: warum? */
async function whyNot(
  id: string,
  fallback: "gesperrt" | "konflikt",
): Promise<AngebotErgebnis> {
  const current = await getAngebotById(id);
  if (!current) return { ok: false, grund: "nicht_gefunden" };
  if (!istBearbeitbar(current.status))
    return { ok: false, grund: "gesperrt", angebot: current };
  return { ok: false, grund: fallback, angebot: current };
}

/**
 * Speichert den Inhalt (vorher mit parseAngebotInhalt prüfen). Nur im
 * Entwurf und nach dem Senden; danach 'gesperrt'. Mit
 * expectedUpdatedAt (updated_at beim Öffnen des Editors) gibt es
 * 'konflikt', wenn das Angebot inzwischen woanders geändert wurde.
 */
export async function updateAngebot(
  id: string,
  inhalt: AngebotInhalt,
  opts: { expectedUpdatedAt?: string | null } = {},
): Promise<AngebotErgebnis> {
  const db = needDb();
  let query = db
    .from("angebote")
    .update(nurInhalt(inhalt))
    .eq("id", id)
    .in("status", [...BEARBEITBAR]);
  if (opts.expectedUpdatedAt)
    query = query.eq("updated_at", opts.expectedUpdatedAt);
  const { data, error } = await query.select(COLS);
  if (error) throw dbError("Angebot konnte nicht gespeichert werden", error);
  const [angebot] = rows(data);
  if (angebot) return { ok: true, angebot };
  return whyNot(id, "konflikt");
}

/**
 * Nach „Gesendet?“ → Ja: Status 'gesendet', sent_at = jetzt (auch
 * beim erneuten Senden). Prüft vorher sendeProbleme (Name, Titel,
 * Positionen, Gültig bis). Verlauf: „gesendet“ bzw. „erneut gesendet“.
 */
export async function markAngebotSent(
  id: string,
  actor: string,
  now: Date = new Date(),
): Promise<AngebotErgebnis> {
  const current = await getAngebotById(id);
  if (!current) return { ok: false, grund: "nicht_gefunden" };
  if (!darfWechseln(current.status, "gesendet"))
    return { ok: false, grund: "gesperrt", angebot: current };
  const probleme = sendeProbleme(current, now);
  if (probleme.length)
    return { ok: false, grund: "unvollstaendig", angebot: current, probleme };

  const { data, error } = await needDb()
    .from("angebote")
    .update({ status: "gesendet", sent_at: now.toISOString() })
    .eq("id", id)
    .in("status", ["entwurf", "gesendet"])
    .select(COLS);
  if (error)
    throw dbError("Angebot konnte nicht als gesendet markiert werden", error);
  const [angebot] = rows(data);
  if (!angebot) return whyNot(id, "gesperrt");
  await event(
    angebot,
    actor,
    "gesendet",
    current.status === "gesendet" ? { erneut: true } : {},
  );
  return { ok: true, angebot };
}

/** Gesendet → zurückgezogen (Kundenseite: „nicht mehr gültig“). */
export async function withdrawAngebot(
  id: string,
  actor: string,
): Promise<AngebotErgebnis> {
  const { data, error } = await needDb()
    .from("angebote")
    .update({ status: "zurueckgezogen" })
    .eq("id", id)
    .eq("status", "gesendet")
    .select(COLS);
  if (error) throw dbError("Angebot konnte nicht zurückgezogen werden", error);
  const [angebot] = rows(data);
  if (!angebot) return whyNot(id, "gesperrt");
  await event(angebot, actor, "zurueckgezogen");
  return { ok: true, angebot };
}

/**
 * „Als abgelehnt markieren“ durch den Inhaber (z. B. nach einem
 * Anruf): gesendet → abgelehnt, optional mit kurzem Grund.
 */
export async function markAngebotDeclined(
  id: string,
  actor: string,
  grund: string | null = null,
  now: Date = new Date(),
): Promise<AngebotErgebnis> {
  const g = parseAblehnGrund(grund);
  if (!g) return { ok: false, grund: "ungueltig" };
  const { data, error } = await needDb()
    .from("angebote")
    .update({
      status: "abgelehnt",
      declined_at: now.toISOString(),
      abgelehnt_grund: g.grund,
    })
    .eq("id", id)
    .eq("status", "gesendet")
    .select(COLS);
  if (error) throw dbError("Angebot konnte nicht gespeichert werden", error);
  const [angebot] = rows(data);
  if (!angebot) return whyNot(id, "gesperrt");
  await event(angebot, actor, "abgelehnt");
  return { ok: true, angebot };
}

/**
 * Löscht einen Entwurf (nur Status 'entwurf'; Gesendetes bleibt als
 * Beleg). Verlauf: „Entwurf verworfen“.
 */
export async function removeAngebotEntwurf(
  id: string,
  actor: string,
): Promise<{ removed: boolean }> {
  const { data, error } = await needDb()
    .from("angebote")
    .delete()
    .eq("id", id)
    .eq("status", "entwurf")
    .select("lead_id,nummer");
  if (error) throw dbError("Entwurf konnte nicht verworfen werden", error);
  const row = (data ?? [])[0] as
    | { lead_id: string; nummer: string }
    | undefined;
  if (!row) return { removed: false };
  await event(row, actor, "verworfen");
  return { removed: true };
}

// --- Schreiben (Kundenseite) -------------------------------------------

/**
 * Erster Aufruf durch den Kunden (nicht den eingeloggten Admin):
 * setzt first_viewed_at einmalig, nur bei Status 'gesendet'. Speichert
 * keine IP- oder Gerätedaten. Wirft nie (die Seite soll trotzdem
 * laden); true, wenn es der erste Aufruf war.
 */
export async function markAngebotViewed(
  token: string,
  now: Date = new Date(),
): Promise<boolean> {
  const t = parseToken(token);
  if (!t) return false;
  try {
    const db = serviceClient();
    if (!db) return false;
    const { data, error } = await db
      .from("angebote")
      .update({ first_viewed_at: now.toISOString() })
      .eq("token", t)
      .eq("status", "gesendet")
      .is("first_viewed_at", null)
      .select("lead_id,nummer");
    if (error) {
      if (!isMissingTable(error))
        console.error("[angebot] Öffnen nicht gespeichert", {
          code: error.code ?? "?",
        });
      return false;
    }
    const row = (data ?? [])[0] as
      | { lead_id: string; nummer: string }
      | undefined;
    if (!row) return false;
    await event(row, KUNDE, "angesehen");
    return true;
  } catch (err) {
    console.error("[angebot] Öffnen nicht gespeichert", {
      code: err instanceof DbError ? err.code : "exception",
    });
    return false;
  }
}

/** Nach einem Kunden-Update ohne Treffer: warum? */
async function whyNotKunde(
  token: string,
  now: Date,
  stand?: string,
): Promise<AngebotErgebnis> {
  const current = await getFullByToken(token);
  if (!current) return { ok: false, grund: "nicht_gefunden" };
  if (current.status === "gesendet" && istAbgelaufen(current.gueltig_bis, now))
    return { ok: false, grund: "abgelaufen", angebot: current };
  // Noch offen und gültig, aber inzwischen inhaltlich geändert.
  if (current.status === "gesendet" && stand !== undefined)
    return { ok: false, grund: "geaendert", angebot: current };
  return { ok: false, grund: "gesperrt", angebot: current };
}

/**
 * Kunde nimmt an: nur aus 'gesendet', solange gueltig_bis nicht vorbei
 * ist (Hamburger Kalendertag), und nur die Fassung, die er gesehen hat:
 * stand ist updated_at beim Laden der Seite. Hat der Inhaber das
 * Angebot inzwischen geändert, gibt es 'geaendert' und nichts wird
 * gespeichert; so gilt eine Annahme nie für Beträge, die der Kunde
 * nicht gesehen hat. Da ein angenommenes Angebot nicht mehr änderbar
 * ist, ist der gespeicherte Inhalt danach genau die angenommene
 * Fassung.
 *
 * Setzt accepted_at und angenommen_von (2–120 Zeichen). Doppelter
 * Klick: 'gesperrt' mit angebot.status 'angenommen'. Verlauf:
 * „angenommen“.
 *
 * Das Ergebnis enthält lead_id und Token: nur auf dem Server nutzen
 * (Benachrichtigung), der Seite oeffentlicheSicht(angebot) geben.
 */
export async function acceptAngebot(
  token: string,
  name: string,
  stand: string,
  now: Date = new Date(),
): Promise<AngebotErgebnis> {
  const t = parseToken(token);
  if (!t) return { ok: false, grund: "nicht_gefunden" };
  const n = parseAnnahmeName(name);
  if (!n) return { ok: false, grund: "ungueltig" };
  const s = parseZeitstempel(stand);
  if (!s) return { ok: false, grund: "ungueltig" };
  const { data, error } = await needDb()
    .from("angebote")
    .update({
      status: "angenommen",
      accepted_at: now.toISOString(),
      angenommen_von: n,
    })
    .eq("token", t)
    .eq("status", "gesendet")
    .eq("updated_at", s)
    .gte("gueltig_bis", berlinDateIso(now))
    .select(COLS);
  if (error) throw dbError("Annahme konnte nicht gespeichert werden", error);
  const [angebot] = rows(data);
  if (!angebot) return whyNotKunde(t, now, s);
  await event(angebot, KUNDE, "angenommen");
  return { ok: true, angebot };
}

/**
 * Kunde lehnt ab (optional mit kurzem Grund, bis 500 Zeichen): nur
 * aus 'gesendet'. Verlauf: „abgelehnt“ (ohne den Grund).
 */
export async function declineAngebot(
  token: string,
  grund: string | null = null,
  now: Date = new Date(),
): Promise<AngebotErgebnis> {
  const t = parseToken(token);
  if (!t) return { ok: false, grund: "nicht_gefunden" };
  const g = parseAblehnGrund(grund);
  if (!g) return { ok: false, grund: "ungueltig" };
  const { data, error } = await needDb()
    .from("angebote")
    .update({
      status: "abgelehnt",
      declined_at: now.toISOString(),
      abgelehnt_grund: g.grund,
    })
    .eq("token", t)
    .eq("status", "gesendet")
    .select(COLS);
  if (error) throw dbError("Ablehnung konnte nicht gespeichert werden", error);
  const [angebot] = rows(data);
  if (!angebot) return whyNotKunde(t, now);
  await event(angebot, KUNDE, "abgelehnt");
  return { ok: true, angebot };
}

/**
 * Verlaufseintrag, wenn die Benachrichtigung an den Inhaber nach einer
 * Annahme/Ablehnung scheitert. Wirft nie.
 */
export async function logAngebotMailFehler(
  a: Pick<Angebot, "lead_id" | "nummer">,
): Promise<void> {
  await event(a, "system", "mail_fehler");
}

/**
 * Verlaufseintrag zur Bestätigung an den Kunden nach der Annahme:
 * geschickt oder fehlgeschlagen (dann weiß der Inhaber, dass er sie
 * selbst nachreichen sollte). Wirft nie.
 */
export async function logAngebotBestaetigung(
  a: Pick<Angebot, "lead_id" | "nummer">,
  geschickt: boolean,
): Promise<void> {
  await event(a, "system", geschickt ? "bestaetigt" : "bestaetigung_fehler");
}

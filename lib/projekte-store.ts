import "server-only";

import type {
  ProjektAngebot,
  ProjektRow,
  ProjektSchritt,
} from "@/lib/admin/projekte";

import { angebotAusZeile } from "@/lib/admin/angebote";
import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import {
  mitSchritt,
  PROJEKT_ANGEBOT_COLUMNS,
  PROJEKT_COLUMNS,
  projektAusZeile,
} from "@/lib/admin/projekte";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Speicher für Kunden & Projekte (Tabelle public.projekte, Migration
 * 20261116000000_ausbau.sql) und die angenommenen Angebote dazu. Nur
 * auf dem Server und erst nach requireAdmin() aufrufen.
 *
 * - Ein Projekt gehört zu genau einem angenommenen Angebot (angebot_id
 *   ist eindeutig). Die Zeile entsteht bei der ersten Änderung: erst
 *   nachsehen, dann anlegen (die Test-Attrappe kennt kein Upsert).
 *   Legt jemand gleichzeitig an (23505), wird die vorhandene Zeile
 *   geändert.
 * - Fehler: DbError mit PostgREST-Code (explainDbError, isMissingTable).
 *   Fehlt die Tabelle, liefern die Listen null statt zu werfen.
 * - Keine Kundendaten in Logs (hier wird gar nicht geloggt).
 */

type PgError = { message: string; code?: string };

const COLS = PROJEKT_COLUMNS.join(",");
const ANGEBOT_COLS = PROJEKT_ANGEBOT_COLUMNS.join(",");
/** So viele angenommene Angebote zeigt „Kunden & Projekte“ höchstens. */
export const PROJEKTE_LIMIT = 500;

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

function needDb() {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  return db;
}

function alsProjektAngebot(data: unknown): ProjektAngebot {
  // angebotAusZeile prüft Status, Positionen und Steuersatz.
  const a = angebotAusZeile(data);
  return {
    id: a.id,
    lead_id: a.lead_id,
    nummer: a.nummer,
    status: a.status,
    titel: a.titel,
    kunde_name: a.kunde_name,
    kunde_firma: a.kunde_firma,
    accepted_at: a.accepted_at,
    positionen: a.positionen,
    ust_satz: a.ust_satz,
  };
}

// --- Lesen ---------------------------------------------------------------

/**
 * Alle angenommenen Angebote (zuletzt angenommene zuerst), nur die
 * Felder, die ein Projekt braucht. null, wenn die Tabelle angebote
 * fehlt oder Supabase nicht konfiguriert ist.
 */
export async function listAngenommeneAngebote(): Promise<
  ProjektAngebot[] | null
> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("angebote")
    .select(ANGEBOT_COLS)
    .eq("status", "angenommen")
    .order("accepted_at", { ascending: false })
    .limit(PROJEKTE_LIMIT);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Angebote konnten nicht geladen werden", error);
  }
  return Array.isArray(data) ? data.map(alsProjektAngebot) : [];
}

/** Ein Angebot (beliebiger Status) mit den Projekt-Feldern, null wenn es fehlt. */
export async function getProjektAngebot(
  id: string,
): Promise<ProjektAngebot | null> {
  const db = needDb();
  const { data, error } = await db
    .from("angebote")
    .select(ANGEBOT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw dbError("Angebot konnte nicht geladen werden", error);
  return data ? alsProjektAngebot(data) : null;
}

/** Alle Projekte. null, wenn die Tabelle fehlt (Migration noch nicht ausgeführt). */
export async function listProjekte(): Promise<ProjektRow[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("projekte")
    .select(COLS)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Projekte konnten nicht geladen werden", error);
  }
  return Array.isArray(data) ? data.map(projektAusZeile) : [];
}

/** Projekt zu einem Angebot oder null (noch nichts abgehakt). Wirft DbError. */
export async function getProjektByAngebot(
  angebotId: string,
): Promise<ProjektRow | null> {
  const db = needDb();
  const { data, error } = await db
    .from("projekte")
    .select(COLS)
    .eq("angebot_id", angebotId)
    .maybeSingle();
  if (error) throw dbError("Projekt konnte nicht geladen werden", error);
  return data ? projektAusZeile(data) : null;
}

// --- Schreiben -------------------------------------------------------------

/** Was sich an einem Projekt ändern lässt. */
export type ProjektPatch = Partial<
  Pick<
    ProjektRow,
    "schritte" | "livegang_am" | "pflege_seit" | "pflege_bis" | "notiz"
  >
>;

/**
 * Ändert das Projekt eines Angebots. Gibt es noch keins, wird es mit
 * dem Patch angelegt. bauen bekommt den aktuellen Stand (oder null)
 * und liefert den Patch, so beruhen etwa die Schritte immer auf dem
 * gespeicherten Stand.
 */
export async function aendereProjekt(
  angebot: Pick<ProjektAngebot, "id" | "lead_id">,
  bauen: (aktuell: ProjektRow | null) => ProjektPatch,
): Promise<ProjektRow> {
  const db = needDb();
  const aktuell = await getProjektByAngebot(angebot.id);
  if (aktuell) return patchProjekt(aktuell.id, bauen(aktuell));

  const { data, error } = await db
    .from("projekte")
    .insert({
      angebot_id: angebot.id,
      lead_id: angebot.lead_id,
      ...bauen(null),
    })
    .select(COLS)
    .single();
  if (!error) return projektAusZeile(data);
  if (error.code !== "23505")
    throw dbError("Projekt konnte nicht angelegt werden", error);
  // Gleichzeitig angelegt: auf dem dann vorhandenen Stand ändern.
  const neu = await getProjektByAngebot(angebot.id);
  if (!neu) throw dbError("Projekt konnte nicht angelegt werden", error);
  return patchProjekt(neu.id, bauen(neu));
}

async function patchProjekt(
  id: string,
  patch: ProjektPatch,
): Promise<ProjektRow> {
  const db = needDb();
  const { data, error } = await db
    .from("projekte")
    .update(patch)
    .eq("id", id)
    .select(COLS)
    .single();
  if (error) throw dbError("Projekt konnte nicht gespeichert werden", error);
  return projektAusZeile(data);
}

/**
 * Schritt abhaken (datum, yyyy-mm-dd) oder wieder öffnen (null). Der
 * Livegang setzt zugleich livegang_am.
 */
export async function setzeSchritt(
  angebot: Pick<ProjektAngebot, "id" | "lead_id">,
  schritt: ProjektSchritt,
  datum: string | null,
): Promise<ProjektRow> {
  return aendereProjekt(angebot, (aktuell) =>
    mitSchritt(aktuell?.schritte ?? {}, schritt, datum),
  );
}

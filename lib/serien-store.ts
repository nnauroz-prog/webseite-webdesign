import "server-only";

import type { StorySerie } from "@/lib/story-serie";

import { addDays, berlinWallToUtc } from "@/lib/admin/berlin-time";
import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import { parseId, parseStoredDate } from "@/lib/admin/validate";
import { gueltigeSerie } from "@/lib/redaktion/lesen";
import { AUFTRAG_MAX } from "@/lib/redaktion/vertrag";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Speicher für Serien aus Aufträgen an die Redaktion (Tabelle
 * public.serien, Migration 20261117000000_serien.sql). Nur auf dem
 * Server und erst nach requireAdmin() aufrufen.
 *
 * - Gespeichert und gelesen wird nur, was alle Regeln einhält
 *   (pruefeSerie): Zeilen, die dagegen verstoßen, werden beim Lesen
 *   übersprungen.
 * - Fehler: DbError mit PostgREST-Code. Fehlt die Tabelle, liefern
 *   Liste, Zähler und Speichern null statt zu werfen.
 */

/** Eine gespeicherte Serie aus einem Auftrag an die Redaktion. */
export type SerieZeile = {
  id: string;
  /** Zeitpunkt des Auftrags (ISO). */
  created_at: string;
  /** Kalendertag in Hamburg (yyyy-mm-dd), für den die Serie gedacht ist. */
  datum: string;
  /** Der Auftrag im Wortlaut (leer: „Mach was zu heute“). */
  auftrag: string;
  serie: StorySerie;
  /** Zeitpunkt, an dem die Serie als gepostet abgehakt wurde, sonst null. */
  gepostet_at: string | null;
};

/** Alle Spalten (select und Schema-Prüfung). */
export const SERIEN_COLUMNS = [
  "id",
  "created_at",
  "datum",
  "auftrag",
  "serie",
  "gepostet_at",
] as const satisfies readonly (keyof SerieZeile)[];

type PgError = { message: string; code?: string };

const COLS = SERIEN_COLUMNS.join(",");

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

function needDb() {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  return db;
}

function zeitpunkt(v: unknown): string | null {
  return typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : null;
}

/** Zeile aus der Datenbank, geprüft; null, wenn etwas nicht stimmt. */
export function serieAusZeile(data: unknown): SerieZeile | null {
  if (!data || typeof data !== "object") return null;
  const z = data as Record<string, unknown>;
  const id = parseId(z.id);
  const created_at = zeitpunkt(z.created_at);
  const datum = parseStoredDate(z.datum);
  const serie = gueltigeSerie(z.serie);
  if (!id || !created_at || !datum || !serie || typeof z.auftrag !== "string")
    return null;
  const gepostet_at = z.gepostet_at == null ? null : zeitpunkt(z.gepostet_at);
  if (z.gepostet_at != null && !gepostet_at) return null;
  return { id, created_at, datum, auftrag: z.auftrag, serie, gepostet_at };
}

/**
 * Die neuesten Serien aus Aufträgen, neueste zuerst. null, wenn die
 * Tabelle noch fehlt (Datenbank-Update ausstehend) oder Supabase nicht
 * konfiguriert ist.
 */
export async function listSerien(limit = 20): Promise<SerieZeile[] | null> {
  const db = serviceClient();
  if (!db) return null;
  const anzahl = Math.min(200, Math.max(1, Math.floor(limit) || 1));
  const { data, error } = await db
    .from("serien")
    .select(COLS)
    .order("created_at", { ascending: false })
    .limit(anzahl);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Serien konnten nicht geladen werden", error);
  }
  return (Array.isArray(data) ? data : [])
    .map(serieAusZeile)
    .filter((z): z is SerieZeile => z !== null);
}

/**
 * Speichert eine Serie und gibt ihre Kennung zurück. null, wenn die
 * Tabelle noch fehlt oder Supabase nicht konfiguriert ist (die Serie
 * gibt es dann nur im Studio). Wirft DbError bei allem anderen, auch
 * wenn die Serie die Regeln nicht einhält.
 */
export async function saveSerie(eintrag: {
  datum: string;
  auftrag: string;
  serie: StorySerie;
}): Promise<string | null> {
  const serie = gueltigeSerie(eintrag.serie);
  const datum = parseStoredDate(eintrag.datum);
  if (!serie || !datum || eintrag.auftrag.length > AUFTRAG_MAX)
    throw new DbError("Serie konnte nicht gespeichert werden: ungültig.");
  const db = serviceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("serien")
    .insert({ datum, auftrag: eintrag.auftrag, serie })
    .select("id")
    .single();
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Serie konnte nicht gespeichert werden", error);
  }
  const id = (data as { id?: unknown } | null)?.id;
  return typeof id === "string" ? id : null;
}

/**
 * Hakt eine Serie als gepostet ab oder nimmt den Haken zurück. false,
 * wenn es die Serie nicht (mehr) gibt. Wirft DbError.
 */
export async function setSerieGepostet(
  id: string,
  gepostet: boolean,
): Promise<boolean> {
  const { data, error } = await needDb()
    .from("serien")
    .update({ gepostet_at: gepostet ? new Date().toISOString() : null })
    .eq("id", id)
    .select("id");
  if (error) throw dbError("Serie konnte nicht geändert werden", error);
  return Array.isArray(data) && data.length > 0;
}

/** Löscht eine Serie. false, wenn es sie nicht (mehr) gibt. Wirft DbError. */
export async function deleteSerie(id: string): Promise<boolean> {
  const { data, error } = await needDb()
    .from("serien")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw dbError("Serie konnte nicht gelöscht werden", error);
  return Array.isArray(data) && data.length > 0;
}

/**
 * Wie viele Serien an einem Kalendertag in Hamburg (yyyy-mm-dd)
 * gespeichert wurden, für das Tageslimit der Redaktion. null, wenn die
 * Tabelle noch fehlt oder Supabase nicht konfiguriert ist.
 */
export async function countSerienAm(tag: string): Promise<number | null> {
  const db = serviceClient();
  if (!db || !parseStoredDate(tag)) return null;
  const von = berlinWallToUtc(tag, "00:00").toISOString();
  const bis = berlinWallToUtc(addDays(tag, 1), "00:00").toISOString();
  const { data, error } = await db
    .from("serien")
    .select("id")
    .gte("created_at", von)
    .lt("created_at", bis)
    .limit(1001);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Serien konnten nicht gezählt werden", error);
  }
  return Array.isArray(data) ? data.length : 0;
}

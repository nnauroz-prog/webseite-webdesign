import "server-only";

import { cache } from "react";

import { ANGEBOT_COLUMNS } from "@/lib/admin/angebote";
import { isMissingSchema } from "@/lib/admin/db-errors";
import { serviceClient } from "@/lib/supabase/service";

/**
 * Sind die Migrationen 20261101000000_admin_ausbau.sql (leadsV2,
 * events, deletions) und 20261102000000_angebote.sql (angebote)
 * ausgeführt?
 *
 * Je Teil drei Zustände:
 *   'ok'        vorhanden
 *   'fehlt'     sicher nicht vorhanden (42703, PGRST204, PGRST205, 42P01)
 *   'unbekannt' Prüfung gescheitert (Netz, Schlüssel …), Grund in error
 *
 * Das Banner „Datenbank-Update ausstehend“ erscheint nur bei 'fehlt'
 * und bietet nur die fehlende Migration an (missingMigrations in
 * lib/admin/migration-sql.ts). Felder der neuen Spalten werden nur bei
 * 'ok' gesendet; der Angebots-Bereich zeigt bei angebote !== 'ok'
 * einen Hinweis statt eines Fehlers.
 */
export type SchemaPart = "ok" | "fehlt" | "unbekannt";

export type SchemaStatus = {
  leadsV2: SchemaPart;
  events: SchemaPart;
  deletions: SchemaPart;
  /** Tabelle angebote (20261102000000_angebote.sql). */
  angebote: SchemaPart;
  /** Erste Fehlermeldung bei 'unbekannt' (für explainDbError). */
  error?: { message: string; code?: string };
};

type Probe = PromiseLike<{ error: { message: string; code?: string } | null }>;

async function probe(
  query: Probe,
): Promise<{ part: SchemaPart; error?: { message: string; code?: string } }> {
  try {
    const { error } = await query;
    if (!error) return { part: "ok" };
    if (isMissingSchema(error)) return { part: "fehlt" };
    return {
      part: "unbekannt",
      error: { message: error.message, code: error.code || undefined },
    };
  } catch (err) {
    return {
      part: "unbekannt",
      error: { message: err instanceof Error ? err.message : String(err) },
    };
  }
}

export async function readSchemaStatus(): Promise<SchemaStatus> {
  const db = serviceClient();
  if (!db) {
    const error = { message: "Supabase ist nicht konfiguriert." };
    return {
      leadsV2: "unbekannt",
      events: "unbekannt",
      deletions: "unbekannt",
      angebote: "unbekannt",
      error,
    };
  }
  const [leadsV2, events, deletions, angebote] = await Promise.all([
    probe(db.from("leads").select("follow_up_on,outcome,lost_reason").limit(1)),
    probe(db.from("lead_events").select("id").limit(1)),
    probe(db.from("lead_deletions").select("id").limit(1)),
    // Alle Spalten: Fehlt eine (z. B. nach einer halb ausgeführten
    // Migration), gilt der Teil als 'fehlt' statt später zu scheitern.
    probe(db.from("angebote").select(ANGEBOT_COLUMNS.join(",")).limit(1)),
  ]);
  const error =
    leadsV2.error ?? events.error ?? deletions.error ?? angebote.error;
  return {
    leadsV2: leadsV2.part,
    events: events.part,
    deletions: deletions.part,
    angebote: angebote.part,
    ...(error ? { error } : {}),
  };
}

/** Je Request einmal (React cache). Nur nach requireAdmin() aufrufen. */
export const checkSchema = cache(readSchemaStatus);

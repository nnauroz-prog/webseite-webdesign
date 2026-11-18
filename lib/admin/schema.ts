import "server-only";

import { cache } from "react";

import { ANGEBOT_COLUMNS } from "@/lib/admin/angebote";
import { isMissingGrant, isMissingSchema } from "@/lib/admin/db-errors";
import { POST_STATUS_COLUMNS } from "@/lib/admin/post-planer";
import { PROJEKT_COLUMNS } from "@/lib/admin/projekte";
import { SERIEN_COLUMNS } from "@/lib/serien-store";
import { serviceClient } from "@/lib/supabase/service";

/**
 * Sind die Migrationen 20261101000000_admin_ausbau.sql (leadsV2,
 * events, deletions), 20261102000000_angebote.sql (angebote),
 * 20261116000000_ausbau.sql (projekte, postStatus) und
 * 20261117000000_serien.sql (serien) ausgeführt?
 *
 * Je Teil drei Zustände:
 *   'ok'        vorhanden
 *   'fehlt'     sicher nicht vorhanden (42703, PGRST204, PGRST205, 42P01)
 *               oder vorhanden, aber ohne Rechte für den Server (42501,
 *               während „leads“ lesbar ist): Dann hilft dieselbe
 *               Migration noch einmal, sie vergibt die Rechte.
 *   'unbekannt' Prüfung gescheitert (Netz, Schlüssel …), Grund in error
 *
 * Das Banner „Datenbank-Update ausstehend“ erscheint nur bei 'fehlt'
 * und bietet nur die fehlende Migration an (missingMigrations in
 * lib/admin/migration-sql.ts). Felder der neuen Spalten werden nur bei
 * 'ok' gesendet; der Angebots-Bereich zeigt bei angebote !== 'ok'
 * einen Hinweis statt eines Fehlers, ebenso Kunden & Projekte und der
 * Post-Planer bei projekte bzw. postStatus !== 'ok'. Ohne serien
 * arbeitet die Redaktion im Story-Studio weiter, merkt sich die Serien
 * aber nicht.
 */
export type SchemaPart = "ok" | "fehlt" | "unbekannt";

export type SchemaStatus = {
  leadsV2: SchemaPart;
  events: SchemaPart;
  deletions: SchemaPart;
  /** Tabelle angebote (20261102000000_angebote.sql). */
  angebote: SchemaPart;
  /** Tabelle projekte (20261116000000_ausbau.sql). */
  projekte: SchemaPart;
  /** Tabelle post_status (20261116000000_ausbau.sql). */
  postStatus: SchemaPart;
  /** Tabelle serien (20261117000000_serien.sql). */
  serien: SchemaPart;
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
      projekte: "unbekannt",
      postStatus: "unbekannt",
      serien: "unbekannt",
      error,
    };
  }
  const [leadsV2, events, deletions, angebote, projekte, postStatus, serien] =
    await Promise.all([
      probe(
        db.from("leads").select("follow_up_on,outcome,lost_reason").limit(1),
      ),
      probe(db.from("lead_events").select("id").limit(1)),
      probe(db.from("lead_deletions").select("id").limit(1)),
      // Alle Spalten: Fehlt eine (z. B. nach einer halb ausgeführten
      // Migration), gilt der Teil als 'fehlt' statt später zu scheitern.
      probe(db.from("angebote").select(ANGEBOT_COLUMNS.join(",")).limit(1)),
      probe(db.from("projekte").select(PROJEKT_COLUMNS.join(",")).limit(1)),
      probe(
        db.from("post_status").select(POST_STATUS_COLUMNS.join(",")).limit(1),
      ),
      probe(db.from("serien").select(SERIEN_COLUMNS.join(",")).limit(1)),
    ]);
  // Rechte fehlen an einer neueren Tabelle, der Schlüssel stimmt aber
  // (leads ist lesbar): Das ist kein Schlüsselproblem, sondern die
  // Migration muss noch einmal laufen. Scheitert schon leads mit 42501,
  // bleibt alles 'unbekannt' (falscher Schlüssel).
  if (!isMissingGrant(leadsV2.error)) {
    for (const teil of [
      events,
      deletions,
      angebote,
      projekte,
      postStatus,
      serien,
    ])
      if (teil.part === "unbekannt" && isMissingGrant(teil.error)) {
        teil.part = "fehlt";
        delete teil.error;
      }
  }
  const error =
    leadsV2.error ??
    events.error ??
    deletions.error ??
    angebote.error ??
    projekte.error ??
    postStatus.error ??
    serien.error;
  return {
    leadsV2: leadsV2.part,
    events: events.part,
    deletions: deletions.part,
    angebote: angebote.part,
    projekte: projekte.part,
    postStatus: postStatus.part,
    serien: serien.part,
    ...(error ? { error } : {}),
  };
}

/** Je Request einmal (React cache). Nur nach requireAdmin() aufrufen. */
export const checkSchema = cache(readSchemaStatus);

import "server-only";

import type { ProjektAngebot, ProjektRow } from "@/lib/admin/projekte";
import type { ZahlenAngebot, ZahlenEvent } from "@/lib/admin/zahlen";
import type { LeadKind, LeadOutcome, LeadStatus } from "@/lib/leads-meta";

import { ANGEBOT_STATUSES, positionenAusDb } from "@/lib/admin/angebote";
import { DbError, isMissingTable } from "@/lib/admin/db-errors";
import { REAKTION_AKTIONEN } from "@/lib/admin/zahlen";
import {
  listAngenommeneAngebote,
  listProjekte,
  PROJEKT_ZEILEN_LIMIT,
  PROJEKTE_LIMIT,
} from "@/lib/projekte-store";
import { serviceClient } from "@/lib/supabase/service";

/*
 * Lesen für /admin/zahlen. Nur auf dem Server und erst nach
 * requireAdmin() aufrufen (service_role umgeht RLS).
 *
 * - Nur die Spalten, die gezählt werden, keine Namen oder Inhalte.
 * - Obergrenzen wie bei den anderen Listen (Supabase liefert höchstens
 *   1000 Zeilen je Abfrage); gekappt sagt, ob sie erreicht wurde.
 * - Fehlt eine Tabelle (Migration noch nicht ausgeführt), gibt es null
 *   statt eines Fehlers; andere Fehler werfen DbError.
 */

export const LEADS_GRENZE = 1000;
export const ANGEBOTE_GRENZE = 500;
export const EVENTS_GRENZE = 1000;
/** IDs je .in()-Abfrage: hält die URL kurz (36 Zeichen je ID). */
const IDS_JE_ABFRAGE = 100;

type PgError = { message: string; code?: string };

function dbError(prefix: string, error: PgError): DbError {
  return new DbError(`${prefix}: ${error.message}`, error.code);
}

function needDb() {
  const db = serviceClient();
  if (!db) throw new DbError("Supabase ist nicht konfiguriert.");
  return db;
}

export type Gelesen<T> = { rows: T[]; gekappt: boolean };

export type ZahlenLead = {
  id: string;
  created_at: string;
  kind: LeadKind;
  status: LeadStatus;
  /** Nur mit dem Datenbank-Update (leadsV2), sonst undefined. */
  outcome?: LeadOutcome | null;
};

/**
 * Anfragen seit `ab`, neueste zuerst, höchstens LEADS_GRENZE. Mit
 * `v2` auch das Ergebnis (outcome).
 */
export async function leadsFuerZahlen(
  ab: Date,
  v2: boolean,
): Promise<Gelesen<ZahlenLead>> {
  const db = needDb();
  const { data, error } = await db
    .from("leads")
    .select(
      v2 ? "id,created_at,kind,status,outcome" : "id,created_at,kind,status",
    )
    .gte("created_at", ab.toISOString())
    .order("created_at", { ascending: false })
    .limit(LEADS_GRENZE);
  if (error) throw dbError("Anfragen konnten nicht gezählt werden", error);
  const rows = (data ?? []) as unknown as ZahlenLead[];
  return { rows, gekappt: rows.length >= LEADS_GRENZE };
}

/**
 * Verlaufseinträge, die eine erste Reaktion sein können (Status,
 * Kontakt, Angebot), zu den gegebenen Anfragen, älteste zuerst. In
 * Blöcken zu IDS_JE_ABFRAGE IDs gelesen. null, wenn die Tabelle fehlt.
 */
export async function reaktionenFuerZahlen(
  leadIds: readonly string[],
): Promise<Gelesen<ZahlenEvent> | null> {
  if (leadIds.length === 0) return { rows: [], gekappt: false };
  const db = needDb();
  const bloecke: string[][] = [];
  for (let i = 0; i < leadIds.length; i += IDS_JE_ABFRAGE) {
    bloecke.push(leadIds.slice(i, i + IDS_JE_ABFRAGE));
  }
  const antworten = await Promise.all(
    bloecke.map((ids) =>
      db
        .from("lead_events")
        .select("lead_id,created_at,action,detail")
        .in("lead_id", ids)
        .in("action", [...REAKTION_AKTIONEN])
        .order("created_at", { ascending: true })
        .limit(EVENTS_GRENZE),
    ),
  );
  const rows: ZahlenEvent[] = [];
  let gekappt = false;
  for (const { data, error } of antworten) {
    if (error) {
      if (isMissingTable(error)) return null;
      throw dbError("Verlauf konnte nicht gelesen werden", error);
    }
    const list = (data ?? []) as unknown as ZahlenEvent[];
    if (list.length >= EVENTS_GRENZE) gekappt = true;
    for (const e of list) {
      rows.push({
        lead_id: String(e.lead_id),
        created_at: String(e.created_at),
        action: e.action,
        detail:
          e.detail && typeof e.detail === "object" && !Array.isArray(e.detail)
            ? e.detail
            : {},
      });
    }
  }
  return { rows, gekappt };
}

/**
 * Angebote mit Status, Gültigkeit, Annahme-Zeitpunkt, Positionen und
 * Steuersatz (geprüft mit positionenAusDb), neueste ANGEBOTE_GRENZE
 * zuerst. Ohne Kundendaten. null, wenn die Tabelle fehlt.
 */
export async function angeboteFuerZahlen(): Promise<Gelesen<ZahlenAngebot> | null> {
  const db = needDb();
  const { data, error } = await db
    .from("angebote")
    .select("id,status,created_at,accepted_at,gueltig_bis,positionen,ust_satz")
    .order("created_at", { ascending: false })
    .limit(ANGEBOTE_GRENZE);
  if (error) {
    if (isMissingTable(error)) return null;
    throw dbError("Angebote konnten nicht gezählt werden", error);
  }
  const list = (data ?? []) as unknown as Record<string, unknown>[];
  const rows: ZahlenAngebot[] = [];
  for (const r of list) {
    const status = ANGEBOT_STATUSES.find((s) => s === r.status);
    if (!status) continue;
    rows.push({
      status,
      gueltig_bis: typeof r.gueltig_bis === "string" ? r.gueltig_bis : "",
      accepted_at: typeof r.accepted_at === "string" ? r.accepted_at : null,
      positionen: positionenAusDb(r.positionen),
      ust_satz: Number(r.ust_satz) === 0 ? 0 : 19,
    });
  }
  return { rows, gekappt: list.length >= ANGEBOTE_GRENZE };
}

export type PflegeDaten = {
  angebote: ProjektAngebot[];
  projekte: ProjektRow[];
  /** Eine der Listen hat ihre Obergrenze erreicht. */
  gekappt: boolean;
};

/**
 * Für „Laufende Pflege“: angenommene Angebote und Projekte, gelesen wie
 * auf /admin/kunden (lib/projekte-store.ts), damit beide Seiten
 * dieselbe Summe zeigen. null, wenn eine der Tabellen fehlt.
 */
export async function pflegeFuerZahlen(): Promise<PflegeDaten | null> {
  const [angebote, projekte] = await Promise.all([
    listAngenommeneAngebote(),
    listProjekte(),
  ]);
  if (angebote === null || projekte === null) return null;
  return {
    angebote,
    projekte,
    gekappt:
      angebote.length >= PROJEKTE_LIMIT ||
      projekte.length >= PROJEKT_ZEILEN_LIMIT,
  };
}

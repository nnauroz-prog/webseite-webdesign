/**
 * Datenbank-Fehler mit Code und verständliche Erklärung dafür.
 * Rein (ohne Server- oder Next-Importe), unter node --test testbar.
 */

export const MIGRATION_LEADS_FILE =
  "supabase/migrations/20261030000000_leads.sql";
export const MIGRATION_ADMIN_FILE =
  "supabase/migrations/20261101000000_admin_ausbau.sql";

/** Fehler aus lib/leads-store.ts; `code` ist der PostgREST/Postgres-Code. */
export class DbError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "DbError";
    this.code = code || undefined;
  }
}

/** Spalte fehlt (select/filter bzw. Body). */
const MISSING_COLUMN = new Set(["42703", "PGRST204"]);
/** Tabelle fehlt (PostgREST-Schema-Cache bzw. Postgres). */
const MISSING_TABLE = new Set(["PGRST205", "42P01"]);

function codeOf(err: unknown): string | undefined {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string" && code) return code;
  }
  return undefined;
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return String(err);
}

/** Fehlt eine Spalte oder Tabelle? (Migration noch nicht ausgeführt) */
export function isMissingSchema(err: unknown): boolean {
  const code = codeOf(err);
  return (
    code !== undefined && (MISSING_COLUMN.has(code) || MISSING_TABLE.has(code))
  );
}

/** Fehlt eine ganze Tabelle? */
export function isMissingTable(err: unknown): boolean {
  const code = codeOf(err);
  return code !== undefined && MISSING_TABLE.has(code);
}

export type DbProblemKind =
  | "missing_table_leads"
  | "missing_schema_v2"
  | "auth"
  | "network"
  | "other";

export type DbExplanation = {
  kind: DbProblemKind;
  title: string;
  hint: string;
  /** Rohmeldung, nur klein in Monospace anzeigen. */
  raw: string;
};

const NEW_TABLES = /lead_events|lead_deletions/i;

export function explainDbError(err: unknown): DbExplanation {
  const code = codeOf(err);
  const raw = [code, messageOf(err)].filter(Boolean).join(" ");
  const m = raw.toLowerCase();

  if (code && MISSING_TABLE.has(code) && !NEW_TABLES.test(m)) {
    return {
      kind: "missing_table_leads",
      title: "Die Tabelle „leads“ fehlt in Supabase.",
      hint: `Öffne in Supabase den SQL Editor, füge den Inhalt von ${MIGRATION_LEADS_FILE} ein und tippe auf Run. Danach diese Seite neu laden.`,
      raw,
    };
  }

  if (code && (MISSING_COLUMN.has(code) || MISSING_TABLE.has(code))) {
    return {
      kind: "missing_schema_v2",
      title: "Datenbank-Update ausstehend.",
      hint: `Führe in Supabase einmal ${MIGRATION_ADMIN_FILE} aus (SQL Editor, New query, Inhalt einfügen, Run). Danach diese Seite neu laden.`,
      raw,
    };
  }

  if (
    code === "PGRST301" ||
    code === "PGRST302" ||
    code === "42501" ||
    /api key|jwt|\b401\b|unauthorized|permission denied/.test(m)
  ) {
    return {
      kind: "auth",
      title: "Supabase lehnt den geheimen Schlüssel ab.",
      hint: "SUPABASE_SERVICE_ROLE_KEY in Vercel muss der service_role-Schlüssel aus demselben Projekt sein wie die Project URL. Danach neu deployen.",
      raw,
    };
  }

  if (
    /fetch failed|failed to fetch|fetcherror|econnrefused|econnreset|enotfound|etimedout|network|socket hang up|\b50[234]\b|\b540\b/.test(
      m,
    )
  ) {
    return {
      kind: "network",
      title: "Supabase ist nicht erreichbar.",
      hint: "Kostenlose Projekte pausieren nach einer Woche ohne Nutzung: im Supabase-Dashboard auf ‚Restore project‘ tippen. Danach diese Seite neu laden.",
      raw,
    };
  }

  return {
    kind: "other",
    title: "Die Daten lassen sich gerade nicht laden.",
    hint: "Prüfe die Supabase-Einstellungen in Vercel und deploye neu. Hilft das nicht, steht der genaue Grund unten.",
    raw,
  };
}

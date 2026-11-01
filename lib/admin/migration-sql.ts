/**
 * Inhalt der Migrationen, die das Banner „Datenbank-Update ausstehend“
 * per „SQL kopieren“ anbietet. tests/migration-sql.test.ts prüft, dass
 * jede Konstante byte-gleich mit ihrer Datei ist: Bei Änderungen immer
 * beide anpassen.
 *
 * Rein (ohne Server-Importe): Das Banner ist eine Client-Komponente.
 */

import type { SchemaStatus } from "@/lib/admin/schema";

export type MigrationId = "admin" | "angebote";

export type Migration = {
  id: MigrationId;
  /** Pfad im Repository. */
  file: string;
  sql: string;
  /** Was ohne diese Migration aus ist (für das Banner). */
  features: string;
};

export const MIGRATION_ADMIN_SQL_FILE =
  "supabase/migrations/20261101000000_admin_ausbau.sql";

export const MIGRATION_ADMIN_SQL = `-- Admin-Ausbau: Wiedervorlage, Ergebnis, Verlauf, Löschprotokoll.
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run. Mehrfaches Ausführen schadet nicht.
--
-- Rein additiv: Es wird nichts gelöscht oder umbenannt. Die neuen
-- Spalten an "leads" sind optional (null erlaubt, kein Default nötig).
-- Das Website-Formular (/api/anfrage) speichert Anfragen also vor und
-- nach diesem Update genau gleich. Status-Werte und vorhandene Daten
-- bleiben unangetastet.
--
-- Zugriff: RLS ist auf allen Tabellen aktiv und es gibt bewusst KEINE
-- Policies. Nur der Server mit dem service_role-Schlüssel kommt an die
-- Daten, und der prüft vorher requireAdmin().

-- 1) Neue Spalten an leads -------------------------------------------

-- Wiedervorlage: an diesem Tag (Hamburger Zeit) wieder anzeigen.
alter table public.leads add column if not exists follow_up_on date;

-- Ergebnis einer abgeschlossenen Anfrage: 'gewonnen' | 'verloren' | null.
alter table public.leads add column if not exists outcome text;

-- Grund bei 'verloren' (z. B. 'preis'); die App prüft die erlaubten Werte.
alter table public.leads add column if not exists lost_reason text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_outcome_check'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_outcome_check
      check (outcome is null or outcome in ('gewonnen', 'verloren'));
  end if;
end
$$;

create index if not exists leads_follow_up_on_idx
  on public.leads (follow_up_on)
  where follow_up_on is not null;

-- 2) Verlauf je Anfrage ----------------------------------------------
-- Hält fest, WAS wann geändert wurde (Status, Kontakt, Wiedervorlage,
-- Ergebnis, Notiz ergänzt), aber keine Notiz-Inhalte.
-- Wird eine Anfrage gelöscht, verschwindet ihr Verlauf mit.

create table if not exists public.lead_events (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  actor      text not null,
  action     text not null,
  detail     jsonb not null default '{}'::jsonb
);

create index if not exists lead_events_lead_id_created_at_idx
  on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;

-- 3) Löschprotokoll ---------------------------------------------------
-- Belegt, dass und wann eine Anfrage gelöscht wurde, ohne Namen,
-- E-Mail oder Inhalte. Bewusst ohne Fremdschlüssel: Die Anfrage
-- existiert danach ja nicht mehr.

create table if not exists public.lead_deletions (
  id              uuid primary key default gen_random_uuid(),
  deleted_at      timestamptz not null default now(),
  deleted_by      text not null,
  lead_id         uuid not null,
  lead_kind       text,
  lead_created_at timestamptz,
  reason          text not null
);

create index if not exists lead_deletions_deleted_at_idx
  on public.lead_deletions (deleted_at desc);

alter table public.lead_deletions enable row level security;

-- 4) Supabase-API sofort über die neuen Spalten/Tabellen informieren.
notify pgrst, 'reload schema';
`;

export const MIGRATION_ANGEBOTE_SQL_FILE =
  "supabase/migrations/20261102000000_angebote.sql";

export const MIGRATION_ANGEBOTE_SQL = `-- Angebote: im Admin erstellen, bearbeiten, senden; Kunden nehmen sie
-- auf einer eigenen Seite (/angebot/<token>) an oder lehnen sie ab.
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run. Mehrfaches Ausführen schadet nicht.
--
-- Rein additiv: Es wird nichts gelöscht oder umbenannt. Neu sind nur
-- die Tabelle "angebote", ihre Nummernfolge und zwei kleine
-- Funktionen. "leads", "lead_events" und das Website-Formular bleiben,
-- wie sie sind. Wird eine Anfrage gelöscht, verschwinden ihre
-- Angebote mit.
--
-- Zugriff: RLS ist aktiv und es gibt bewusst KEINE Policies. Nur der
-- Server mit dem service_role-Schlüssel kommt an die Daten. Der Admin
-- prüft vorher requireAdmin(); die öffentliche Angebotsseite liest nur
-- das eine Angebot, dessen Token in ihrer Adresse steht.

-- 1) Fortlaufende Nummer ---------------------------------------------
-- 'A-2026-0001': Jahr in Hamburger Zeit, der Zähler läuft über die
-- Jahre weiter (ab 10000 wird die Nummer einfach eine Stelle länger).

create sequence if not exists public.angebote_nummer_seq;

create or replace function public.angebote_naechste_nummer()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  n bigint := nextval('public.angebote_nummer_seq');
begin
  return 'A-'
    || to_char(now() at time zone 'Europe/Berlin', 'YYYY')
    || '-'
    || lpad(n::text, greatest(4, length(n::text)), '0');
end;
$$;

-- Nicht über die öffentliche API aufrufbar (sonst ließen sich Nummern
-- verbrauchen); nur der Server legt Angebote an.
revoke execute on function public.angebote_naechste_nummer()
  from public, anon, authenticated;
grant execute on function public.angebote_naechste_nummer()
  to service_role;
revoke all on sequence public.angebote_nummer_seq from anon, authenticated;
grant usage, select on sequence public.angebote_nummer_seq to service_role;

-- 2) Tabelle ---------------------------------------------------------
-- Beträge in Cent, netto. positionen ist eine Liste von
-- { id, titel, beschreibung, menge, preis_cent, art }, art ist
-- 'einmalig' oder 'monatlich'; die App prüft jede Position.
-- ust_satz 0 = Kleinunternehmer nach § 19 UStG.

create table if not exists public.angebote (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads (id) on delete cascade,
  nummer          text not null unique default public.angebote_naechste_nummer(),
  -- Öffentlicher Link /angebot/<token>; erzeugt die App (zufällig, base64url).
  token           text not null unique check (char_length(token) >= 32),
  status          text not null default 'entwurf'
                  check (status in ('entwurf', 'gesendet', 'angenommen',
                                    'abgelehnt', 'zurueckgezogen')),
  created_at      timestamptz not null default now(),
  -- Letzte inhaltliche Änderung (siehe Trigger unten).
  updated_at      timestamptz not null default now(),
  sent_at         timestamptz,
  first_viewed_at timestamptz,
  accepted_at     timestamptz,
  declined_at     timestamptz,
  gueltig_bis     date not null,
  kunde_name      text not null,
  kunde_firma     text,
  kunde_email     text,
  titel           text not null,
  einleitung      text not null,
  hinweise        text not null,
  positionen      jsonb not null default '[]'::jsonb
                  check (jsonb_typeof(positionen) = 'array'),
  ust_satz        smallint not null default 19 check (ust_satz in (0, 19)),
  -- Name, den der Kunde beim Annehmen eingibt.
  angenommen_von  text,
  -- Optionaler kurzer Grund beim Ablehnen.
  abgelehnt_grund text
);

create index if not exists angebote_lead_id_created_at_idx
  on public.angebote (lead_id, created_at desc);

alter table public.angebote enable row level security;

-- Zweite Absicherung neben RLS: Die öffentlichen Rollen bekommen gar
-- keine Rechte an der Tabelle (Supabase vergibt sie sonst für neue
-- Tabellen automatisch).
revoke all on table public.angebote from anon, authenticated;

-- 3) updated_at ------------------------------------------------------
-- Nur inhaltliche Änderungen (Kunde, Texte, Positionen, Steuer,
-- Gültigkeit) zählen. Senden, Öffnen, Annehmen und Ablehnen haben
-- eigene Zeitstempel und lassen updated_at stehen.

create or replace function public.angebote_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.kunde_name, new.kunde_firma, new.kunde_email, new.titel,
      new.einleitung, new.hinweise, new.positionen, new.ust_satz,
      new.gueltig_bis)
     is distinct from
     (old.kunde_name, old.kunde_firma, old.kunde_email, old.titel,
      old.einleitung, old.hinweise, old.positionen, old.ust_satz,
      old.gueltig_bis) then
    new.updated_at := now();
  end if;
  return new;
end;
$$;

revoke execute on function public.angebote_touch_updated_at()
  from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'angebote_touch_updated_at'
      and tgrelid = 'public.angebote'::regclass
  ) then
    create trigger angebote_touch_updated_at
      before update on public.angebote
      for each row execute function public.angebote_touch_updated_at();
  end if;
end
$$;

-- 4) Supabase-API sofort über die neue Tabelle informieren.
notify pgrst, 'reload schema';
`;

/** In der Reihenfolge, in der sie ausgeführt werden. */
export const MIGRATIONS: readonly Migration[] = [
  {
    id: "admin",
    file: MIGRATION_ADMIN_SQL_FILE,
    sql: MIGRATION_ADMIN_SQL,
    features: "Wiedervorlage, Ergebnis, Verlauf, Löschprotokoll",
  },
  {
    id: "angebote",
    file: MIGRATION_ANGEBOTE_SQL_FILE,
    sql: MIGRATION_ANGEBOTE_SQL,
    features: "Angebote",
  },
];

/**
 * Welche Migrationen sicher fehlen (Teil 'fehlt'), in Ausführungs-
 * Reihenfolge. 'unbekannt' zählt nicht: Dann ist nur die Prüfung
 * gescheitert, und das Banner soll nicht zum Ausführen auffordern.
 */
export function missingMigrations(
  schema: Pick<SchemaStatus, "leadsV2" | "events" | "deletions" | "angebote">,
): Migration[] {
  const missing = new Set<MigrationId>();
  if ([schema.leadsV2, schema.events, schema.deletions].includes("fehlt"))
    missing.add("admin");
  if (schema.angebote === "fehlt") missing.add("angebote");
  return MIGRATIONS.filter((m) => missing.has(m.id));
}

/**
 * SQL zum Kopieren: nur die fehlenden Migrationen, hintereinander. Im
 * Supabase-SQL-Editor reicht dann ein einziges „Run“.
 */
export function migrationSqlFor(migrations: readonly Migration[]): string {
  return migrations.map((m) => m.sql).join("\n");
}

/**
 * Inhalt von supabase/migrations/20261101000000_admin_ausbau.sql, damit
 * das Banner „Datenbank-Update ausstehend“ ihn per „SQL kopieren“
 * anbieten kann. tests/migration-sql.test.ts prüft, dass beide
 * byte-gleich sind: Bei Änderungen immer beide Dateien anpassen.
 */

export const MIGRATION_SQL_FILE =
  "supabase/migrations/20261101000000_admin_ausbau.sql";

export const MIGRATION_SQL = `-- Admin-Ausbau: Wiedervorlage, Ergebnis, Verlauf, Löschprotokoll.
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

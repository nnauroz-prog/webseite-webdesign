-- Anfragen aus den Website-Formularen (Anfrage, Audit, Termin).
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run.
--
-- Zugriff: RLS ist aktiv und es gibt bewusst KEINE Policies. Damit
-- kann weder der öffentliche (anon/publishable) Schlüssel noch ein
-- eingeloggter Nutzer direkt lesen oder schreiben. Nur der Server mit
-- dem service_role-Schlüssel kommt an die Tabelle — und der prüft vor
-- jedem Zugriff im Admin-Bereich, ob die angemeldete Person auf
-- ADMIN_EMAILS steht.

create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  kind           text not null check (kind in ('anfrage', 'audit', 'termin')),
  subject        text not null,
  reply_to       text not null,
  -- Formularfelder in Anzeige-Reihenfolge: [["Name","Max"], ...]
  fields         jsonb not null,
  status         text not null default 'neu'
                 check (status in ('neu', 'in_arbeit', 'erledigt', 'archiviert')),
  notes          text not null default '',
  -- Wie die Benachrichtigungs-Mail rausging: 'resend' | 'formspree' |
  -- null (Mail fehlgeschlagen oder nicht konfiguriert — Anfrage ist
  -- trotzdem hier gespeichert).
  delivered_via  text,
  delivery_error text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

create or replace function public.leads_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row execute function public.leads_touch_updated_at();

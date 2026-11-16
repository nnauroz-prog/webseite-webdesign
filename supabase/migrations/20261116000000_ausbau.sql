-- Ausbau des Mitgliederbereichs: Kunden & Projekte, Post-Planer.
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run. Mehrfaches Ausführen schadet nicht.
--
-- Rein additiv: Es wird nichts gelöscht oder umbenannt. Neu sind nur
-- die Tabellen "projekte" und "post_status". "leads", "angebote" und
-- das Website-Formular bleiben, wie sie sind. Wird ein Angebot oder
-- seine Anfrage gelöscht, verschwindet das Projekt mit.
--
-- Zugriff: RLS ist auf beiden Tabellen aktiv und es gibt bewusst KEINE
-- Policies. Nur der Server mit dem service_role-Schlüssel kommt an die
-- Daten, und der prüft vorher requireAdmin().

-- 1) Projekte --------------------------------------------------------
-- Jedes angenommene Angebot ist ein Projekt. Die Zeile entsteht erst
-- beim ersten Abhaken (je Angebot höchstens eine). schritte hält fest,
-- welcher Schritt an welchem Tag erledigt war (Hamburger Kalendertag),
-- z. B. {"anzahlung": "2026-11-16", "inhalte": "2026-11-20"}. Die App
-- prüft die erlaubten Schritte.

create table if not exists public.projekte (
  id          uuid primary key default gen_random_uuid(),
  angebot_id  uuid not null unique
              references public.angebote (id) on delete cascade,
  lead_id     uuid not null references public.leads (id) on delete cascade,
  created_at  timestamptz not null default now(),
  -- Letzte Änderung (siehe Trigger unten).
  updated_at  timestamptz not null default now(),
  schritte    jsonb not null default '{}'::jsonb
              check (jsonb_typeof(schritte) = 'object'),
  -- Tag, an dem die Website online ging.
  livegang_am date,
  -- Monatliche Pflege: Beginn und (falls beendet) letzter Tag.
  pflege_seit date,
  pflege_bis  date,
  -- Kurze interne Notiz zum Projekt.
  notiz       text check (notiz is null or char_length(notiz) <= 2000),
  constraint projekte_pflege_check
    check (pflege_bis is null or pflege_seit is null
           or pflege_bis >= pflege_seit)
);

create index if not exists projekte_lead_id_idx
  on public.projekte (lead_id);

alter table public.projekte enable row level security;

-- Zweite Absicherung neben RLS: Die öffentlichen Rollen bekommen gar
-- keine Rechte an der Tabelle.
revoke all on table public.projekte from anon, authenticated;

-- updated_at bei jeder Änderung.
create or replace function public.projekte_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.projekte_touch_updated_at()
  from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'projekte_touch_updated_at'
      and tgrelid = 'public.projekte'::regclass
  ) then
    create trigger projekte_touch_updated_at
      before update on public.projekte
      for each row execute function public.projekte_touch_updated_at();
  end if;
end
$$;

-- 2) Post-Status -----------------------------------------------------
-- Welcher Post eines Tages schon gepostet ist, je Format (Story oder
-- Beitrag), geräteübergreifend. platz 0 ist der Spruch des Tages, 1
-- und 2 die Zusatz-Posts. text ist der Satz, der gepostet wurde
-- (Schnappschuss): Wird der Post später ersetzt, bleibt erkennbar, was
-- wirklich online ging.

create table if not exists public.post_status (
  datum       date not null,
  platz       smallint not null check (platz between 0 and 2),
  format      text not null check (format in ('story', 'beitrag')),
  text        text not null check (char_length(text) <= 500),
  gepostet_at timestamptz not null default now(),
  primary key (datum, platz, format)
);

alter table public.post_status enable row level security;

revoke all on table public.post_status from anon, authenticated;

-- 3) Supabase-API sofort über die neuen Tabellen informieren.
notify pgrst, 'reload schema';

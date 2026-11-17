-- Story-Serien aus Aufträgen an die Redaktion (Story-Studio).
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run. Mehrfaches Ausführen schadet nicht.
--
-- Rein additiv: Es wird nichts gelöscht oder umbenannt. Neu ist nur die
-- Tabelle "serien". Alle anderen Tabellen und das Website-Formular
-- bleiben, wie sie sind.
--
-- Zugriff: RLS ist aktiv und es gibt bewusst KEINE Policies. Nur der
-- Server mit dem service_role-Schlüssel kommt an die Daten, und der
-- prüft vorher requireAdmin().

-- 1) Serien ----------------------------------------------------------
-- Jede Zeile ist eine Story-Serie, die die Redaktion im Story-Studio
-- auf Zuruf geschrieben hat: der Auftrag im Wortlaut, der Kalendertag
-- in Hamburg, für den sie gedacht ist, und die Serie selbst (Titel und
-- drei bis fünf Bilder). Die App prüft die Regeln für Karten vor dem
-- Speichern und noch einmal beim Lesen. created_at zählt außerdem für
-- das Tageslimit der Aufträge. gepostet_at: wann die Serie als gepostet
-- abgehakt wurde (leer: noch nicht).

create table if not exists public.serien (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  datum       date not null,
  auftrag     text not null default ''
              check (char_length(auftrag) <= 500),
  serie       jsonb not null
              check (jsonb_typeof(serie) = 'object'),
  gepostet_at timestamptz
);

-- Neueste zuerst (Liste im Studio, Tageslimit).
create index if not exists serien_created_at_idx
  on public.serien (created_at desc);

alter table public.serien enable row level security;

-- Zweite Absicherung neben RLS: Die öffentlichen Rollen bekommen gar
-- keine Rechte an der Tabelle.
revoke all on table public.serien from anon, authenticated;

-- 2) Supabase-API sofort über die neue Tabelle informieren.
notify pgrst, 'reload schema';

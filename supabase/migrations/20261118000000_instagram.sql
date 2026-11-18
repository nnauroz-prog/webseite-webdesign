-- Posten auf Instagram aus dem Story-Studio.
--
-- Einmal im Supabase-Dashboard ausführen: SQL Editor → New query →
-- diesen Inhalt einfügen → Run. Mehrfaches Ausführen schadet nicht.
--
-- Rein additiv: Es wird nichts gelöscht oder umbenannt. Neu sind nur die
-- Tabelle "instagram_posts" und der private Speicher "instagram" für die
-- Bilder auf dem Weg zu Instagram. Alle anderen Tabellen und das
-- Website-Formular bleiben, wie sie sind.
--
-- Zugriff: RLS ist aktiv und es gibt bewusst KEINE Policies. Nur der
-- Server mit dem service_role-Schlüssel kommt an die Daten, und der
-- prüft vorher requireAdmin().

-- 1) Posts auf Instagram ----------------------------------------------
-- Jede Zeile ist ein Post, den das Story-Studio auf Instagram
-- veröffentlicht hat: als Stories oder als Beitrag (art), woher die
-- Bilder stammen (quelle: Story-Serie oder Post des Tages), wie viele
-- Bilder es waren, die Kennungen bei Instagram und die Links. Daraus
-- zeigt das Studio „schon gepostet“.

create table if not exists public.instagram_posts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  art         text not null
              check (art in ('story', 'beitrag')),
  quelle      jsonb not null
              check (jsonb_typeof(quelle) = 'object'),
  bilder      int not null
              check (bilder between 1 and 10),
  media_ids   text[] not null default '{}',
  links       text[] not null default '{}'
);

-- Neueste zuerst (Verlauf im Studio).
create index if not exists instagram_posts_created_at_idx
  on public.instagram_posts (created_at desc);

alter table public.instagram_posts enable row level security;

-- Zweite Absicherung neben RLS: Die öffentlichen Rollen bekommen gar
-- keine Rechte an der Tabelle.
revoke all on table public.instagram_posts from anon, authenticated;

-- Der Server (service_role) braucht die Rechte ausdrücklich: Supabase
-- vergibt sie für neue Tabellen nicht mehr von selbst.
grant select, insert, update, delete on table public.instagram_posts to service_role;

-- 2) Speicher für die Bilder ------------------------------------------
-- Privat: Nur der Server vergibt Plätze zum Hochladen und kurzlebige
-- Adressen, über die Instagram die Bilder lädt. Höchstens 8 MB je Bild,
-- nur JPEG (wie Instagram es verlangt). Nach jedem Post löscht der
-- Server die Bilder wieder. Ist der Speicher schon da, bleibt er, wie er
-- ist.
insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values
  ('instagram', 'instagram', false, 8388608, array['image/jpeg'])
on conflict (id) do nothing;

-- 3) Supabase-API sofort über die neue Tabelle informieren.
notify pgrst, 'reload schema';

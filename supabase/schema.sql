-- ============================================================================
--  Sitalo — schema.sql
--  Run this once in the Supabase SQL editor of a fresh project.
--  Re-running is safe: every statement uses IF [NOT] EXISTS / OR REPLACE /
--  ON CONFLICT and policies are dropped before being recreated.
-- ============================================================================

-- ----------------------------------------------------------------------------
--  0. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ----------------------------------------------------------------------------
--  1. Helper: updated_at trigger function
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
--  2. profiles  (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text,
  role        text        not null default 'customer'
                          check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
--  3. admin_roles  (authoritative source for admin gating)
--     profiles.role is informational; RLS uses is_admin() based on this table.
-- ----------------------------------------------------------------------------
create table if not exists public.admin_roles (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null unique references auth.users(id) on delete cascade,
  granted_by uuid        references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists admin_roles_user_id_idx on public.admin_roles (user_id);

-- is_admin() — used by RLS across all tables.
-- SECURITY DEFINER + STABLE so callers don't need select on admin_roles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- ----------------------------------------------------------------------------
--  4. templates  (global, admin-managed)
-- ----------------------------------------------------------------------------
create table if not exists public.templates (
  id                 uuid        primary key default gen_random_uuid(),
  name               text        not null unique,
  industry           text        not null,
  preview_image_url  text,
  is_active          boolean     not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists templates_active_industry_idx
  on public.templates (industry) where is_active = true;

drop trigger if exists templates_set_updated_at on public.templates;
create trigger templates_set_updated_at
  before update on public.templates
  for each row execute function public.set_updated_at();

-- Seed MVP templates (id is deterministic-ish via name uniqueness).
insert into public.templates (name, industry) values
  ('Pflegedienst Klassisch',  'pflegedienst'),
  ('Arztpraxis Modern',       'arztpraxis'),
  ('Friseur Premium',         'friseur'),
  ('Physiotherapie Aktiv',    'physio'),
  ('Zahnarztpraxis Sanft',    'zahnarzt'),
  ('Reinigung Frisch',        'reinigung'),
  ('Schreinerei Manufaktur',  'schreiner'),
  ('Kosmetikstudio Eleganz',  'kosmetik'),
  ('Anwaltskanzlei Klassisch','anwalt'),
  ('Restaurant Warm',         'restaurant')
on conflict (name) do nothing;

-- ----------------------------------------------------------------------------
--  5. websites
-- ----------------------------------------------------------------------------
create table if not exists public.websites (
  id                          uuid        primary key default gen_random_uuid(),
  user_id                     uuid        not null references auth.users(id) on delete cascade,
  template_id                 uuid        references public.templates(id) on delete set null,
  slug                        text        not null unique
                                          check (
                                            slug ~ '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
                                            and char_length(slug) between 3 and 63
                                          ),
  business_name               text        not null,
  industry                    text,
  phone                       text,
  email                       text,
  address                     text,
  opening_hours               jsonb,
  logo_url                    text,
  hero_title                  text,
  hero_subtitle               text,
  about_text                  text,
  seo_title                   text,
  seo_description             text,
  imprint_text                text,
  privacy_text                text,
  is_active                   boolean     not null default false,
  contact_form_enabled        boolean     not null default true,
  application_form_enabled    boolean     not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists websites_user_id_idx       on public.websites (user_id);
create index if not exists websites_template_id_idx   on public.websites (template_id);
create index if not exists websites_active_slug_idx   on public.websites (slug) where is_active = true;

-- Per-site SEO + analytics integrations. Idempotent ALTERs so existing
-- deploys can pick these up without a destructive migration.
alter table public.websites
  add column if not exists seo_google_site_verification text;
alter table public.websites
  add column if not exists seo_bing_site_verification text;
alter table public.websites
  add column if not exists analytics_ga4_id text;

-- Per-site visual customization beyond logo: hero background + an
-- about-section photograph. Both are uploaded into the existing
-- `site-assets` bucket under <user_id>/<website_id>/... so the
-- existing storage policies cover them.
alter table public.websites
  add column if not exists hero_image_url text;
alter table public.websites
  add column if not exists about_image_url text;

-- Per-site brand color override. Lets a customer keep their template
-- but tweak the primary accent (e.g. a Pflegedienst that wants a
-- particular shade of green). Validated to hex format at write time.
alter table public.websites
  add column if not exists brand_primary_color text
    check (brand_primary_color is null or
           brand_primary_color ~* '^#[0-9a-f]{6}$');

-- Online booking flag. Mirrors contact_form_enabled / application_form_enabled
-- so the public site only renders the section when the customer flips it on.
alter table public.websites
  add column if not exists booking_form_enabled boolean not null default false;

-- Custom-domain support. Customers can attach their own .de/.com/etc.
-- domain to point at their site. The verification timestamp is set
-- once we've confirmed DNS resolves to Vercel and the domain has been
-- attached to the project. Stored lowercase to make the middleware
-- lookup deterministic; the unique constraint prevents two sites from
-- claiming the same host.
alter table public.websites
  add column if not exists custom_domain text unique;
alter table public.websites
  add column if not exists custom_domain_verified_at timestamptz;

create index if not exists websites_custom_domain_idx
  on public.websites (custom_domain) where custom_domain is not null;

drop trigger if exists websites_set_updated_at on public.websites;
create trigger websites_set_updated_at
  before update on public.websites
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
--  6. services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id          uuid        primary key default gen_random_uuid(),
  website_id  uuid        not null references public.websites(id) on delete cascade,
  title       text        not null,
  description text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists services_website_id_idx on public.services (website_id, sort_order);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
--  7. team_members
-- ----------------------------------------------------------------------------
create table if not exists public.team_members (
  id         uuid        primary key default gen_random_uuid(),
  website_id uuid        not null references public.websites(id) on delete cascade,
  name       text        not null,
  role       text,
  bio        text,
  image_url  text,
  sort_order int         not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_members_website_id_idx on public.team_members (website_id, sort_order);

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
--  8. gallery_images
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id         uuid        primary key default gen_random_uuid(),
  website_id uuid        not null references public.websites(id) on delete cascade,
  image_url  text        not null,
  alt_text   text,
  sort_order int         not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_images_website_id_idx on public.gallery_images (website_id, sort_order);

drop trigger if exists gallery_images_set_updated_at on public.gallery_images;
create trigger gallery_images_set_updated_at
  before update on public.gallery_images
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
--  9. leads
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id         uuid        primary key default gen_random_uuid(),
  website_id uuid        not null references public.websites(id) on delete cascade,
  name       text        not null,
  email      text        not null,
  phone      text,
  message    text        not null,
  status     text        not null default 'new'
                         check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_website_id_status_idx on public.leads (website_id, status, created_at desc);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 10. applications
-- ----------------------------------------------------------------------------
create table if not exists public.applications (
  id                uuid        primary key default gen_random_uuid(),
  website_id        uuid        not null references public.websites(id) on delete cascade,
  name              text        not null,
  email             text        not null,
  phone             text,
  desired_position  text,
  message           text        not null,
  status            text        not null default 'new'
                                check (status in ('new', 'reviewed', 'accepted', 'rejected')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists applications_website_id_status_idx
  on public.applications (website_id, status, created_at desc);

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 10a. pages  (custom sub-pages beyond the home/landing)
-- ----------------------------------------------------------------------------
-- Each website can have arbitrarily many sub-pages. The "home" page is
-- implicit (the existing /site/<slug> route). Custom pages render at
-- /site/<slug>/<page-slug>. Reserved slugs ('imprint', 'privacy', '')
-- are blocked by a CHECK so they can't collide with built-in routes.
create table if not exists public.pages (
  id           uuid        primary key default gen_random_uuid(),
  website_id   uuid        not null references public.websites(id) on delete cascade,
  slug         text        not null
                           check (
                             slug ~ '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
                             and char_length(slug) between 1 and 63
                             and slug not in ('imprint', 'privacy', 'site', 'admin', 'api', 'dashboard')
                           ),
  title        text        not null
                           check (char_length(title) between 1 and 120),
  body         text        not null default '',
  sort_order   int         not null default 0,
  is_published boolean     not null default true,
  show_in_nav  boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  unique (website_id, slug)
);

create index if not exists pages_website_id_idx
  on public.pages (website_id, sort_order, created_at);

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 10a-2. page_blocks  (polymorphic content blocks per page)
-- ----------------------------------------------------------------------------
-- Each page can carry an ordered list of typed content blocks (FAQ
-- accordion, testimonials grid, opening-hours table, CTA banner, …).
-- The `data` jsonb holds type-specific fields validated server-side
-- via Zod before write.
create table if not exists public.page_blocks (
  id           uuid        primary key default gen_random_uuid(),
  website_id   uuid        not null references public.websites(id) on delete cascade,
  -- page_id NULL = block lives on the home/landing page (currently
  -- unused — home renders fixed sections — kept nullable so we can
  -- add home-page blocks later without a migration).
  page_id      uuid        references public.pages(id) on delete cascade,
  type         text        not null
                           check (type in (
                             'faq',
                             'testimonials',
                             'opening_hours',
                             'cta_banner',
                             'map',
                             'video',
                             'stats',
                             'rich_text'
                           )),
  data         jsonb       not null default '{}'::jsonb,
  sort_order   int         not null default 0,
  is_published boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists page_blocks_page_idx
  on public.page_blocks (page_id, sort_order, created_at);

create index if not exists page_blocks_website_idx
  on public.page_blocks (website_id);

drop trigger if exists page_blocks_set_updated_at on public.page_blocks;
create trigger page_blocks_set_updated_at
  before update on public.page_blocks
  for each row execute function public.set_updated_at();

-- Idempotent migration for existing deployments — replace the original
-- type CHECK with the expanded list (map / video / stats / rich_text).
do $$
begin
  alter table public.page_blocks
    drop constraint if exists page_blocks_type_check;
  alter table public.page_blocks
    add constraint page_blocks_type_check
    check (type in (
      'faq',
      'testimonials',
      'opening_hours',
      'cta_banner',
      'map',
      'video',
      'stats',
      'rich_text'
    ));
end $$;

-- ----------------------------------------------------------------------------
-- 10b. bookings  (online appointment requests)
-- ----------------------------------------------------------------------------
create table if not exists public.bookings (
  id              uuid        primary key default gen_random_uuid(),
  website_id      uuid        not null references public.websites(id) on delete cascade,
  -- Optional service link — when present we surface it in the dashboard list.
  service_id      uuid        references public.services(id) on delete set null,
  service_title   text,                  -- snapshot at booking time
  customer_name   text        not null,
  customer_email  text        not null,
  customer_phone  text,
  preferred_date  date        not null,
  preferred_time  time,                  -- nullable: customer may leave time open
  message         text,
  status          text        not null default 'new'
                              check (status in ('new', 'confirmed', 'declined', 'cancelled', 'completed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists bookings_website_id_status_idx
  on public.bookings (website_id, status, preferred_date desc, created_at desc);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 11. Profile auto-create on auth.users insert
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
--  ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles       enable row level security;
alter table public.admin_roles    enable row level security;
alter table public.templates      enable row level security;
alter table public.websites       enable row level security;
alter table public.services       enable row level security;
alter table public.team_members   enable row level security;
alter table public.gallery_images enable row level security;
alter table public.leads          enable row level security;
alter table public.applications   enable row level security;
alter table public.bookings       enable row level security;
alter table public.pages          enable row level security;
alter table public.page_blocks    enable row level security;

alter table public.profiles       force row level security;
alter table public.admin_roles    force row level security;
alter table public.websites       force row level security;
alter table public.services       force row level security;
alter table public.team_members   force row level security;
alter table public.gallery_images force row level security;
alter table public.leads          force row level security;
alter table public.applications   force row level security;
alter table public.bookings       force row level security;
alter table public.pages          force row level security;
alter table public.page_blocks    force row level security;

-- ----------------------------------------------------------------------------
--  profiles policies
-- ----------------------------------------------------------------------------
drop policy if exists "profiles: self or admin can read"   on public.profiles;
drop policy if exists "profiles: self can update"          on public.profiles;
drop policy if exists "profiles: admin can update any"     on public.profiles;
drop policy if exists "profiles: admin can delete"         on public.profiles;

create policy "profiles: self or admin can read"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles: self can update"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "profiles: admin can update any"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "profiles: admin can delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- Insert is performed by the on_auth_user_created trigger (SECURITY DEFINER),
-- so we don't expose an INSERT policy to clients.

-- ----------------------------------------------------------------------------
--  admin_roles policies — only admins, no self-promotion.
-- ----------------------------------------------------------------------------
drop policy if exists "admin_roles: admin can read"   on public.admin_roles;
drop policy if exists "admin_roles: admin can insert" on public.admin_roles;
drop policy if exists "admin_roles: admin can delete" on public.admin_roles;

create policy "admin_roles: admin can read"
  on public.admin_roles for select
  to authenticated
  using (public.is_admin());

create policy "admin_roles: admin can insert"
  on public.admin_roles for insert
  to authenticated
  with check (public.is_admin() and granted_by = auth.uid());

create policy "admin_roles: admin can delete"
  on public.admin_roles for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
--  templates policies — public read, admin write.
-- ----------------------------------------------------------------------------
drop policy if exists "templates: public read active"    on public.templates;
drop policy if exists "templates: admin read all"        on public.templates;
drop policy if exists "templates: admin can write"       on public.templates;

create policy "templates: public read active"
  on public.templates for select
  to anon, authenticated
  using (is_active = true);

create policy "templates: admin read all"
  on public.templates for select
  to authenticated
  using (public.is_admin());

create policy "templates: admin can write"
  on public.templates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
--  websites policies
-- ----------------------------------------------------------------------------
drop policy if exists "websites: public read active"        on public.websites;
drop policy if exists "websites: owner or admin read"       on public.websites;
drop policy if exists "websites: owner can insert"          on public.websites;
drop policy if exists "websites: admin can insert"          on public.websites;
drop policy if exists "websites: owner can update"          on public.websites;
drop policy if exists "websites: admin can update"          on public.websites;
drop policy if exists "websites: owner or admin can delete" on public.websites;

create policy "websites: public read active"
  on public.websites for select
  to anon, authenticated
  using (is_active = true);

create policy "websites: owner or admin read"
  on public.websites for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "websites: owner can insert"
  on public.websites for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "websites: admin can insert"
  on public.websites for insert
  to authenticated
  with check (public.is_admin());

create policy "websites: owner can update"
  on public.websites for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "websites: admin can update"
  on public.websites for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "websites: owner or admin can delete"
  on public.websites for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
--  Helper: child-of-website read/write rules
--  (factored as inline EXISTS predicates per child table)
-- ----------------------------------------------------------------------------

-- ----- services -----
drop policy if exists "services: public read on active sites" on public.services;
drop policy if exists "services: owner or admin read"         on public.services;
drop policy if exists "services: owner or admin write"        on public.services;

create policy "services: public read on active sites"
  on public.services for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and w.is_active = true
    )
  );

create policy "services: owner or admin read"
  on public.services for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "services: owner or admin write"
  on public.services for all
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

-- ----- team_members -----
drop policy if exists "team_members: public read on active sites" on public.team_members;
drop policy if exists "team_members: owner or admin read"         on public.team_members;
drop policy if exists "team_members: owner or admin write"        on public.team_members;

create policy "team_members: public read on active sites"
  on public.team_members for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and w.is_active = true
    )
  );

create policy "team_members: owner or admin read"
  on public.team_members for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "team_members: owner or admin write"
  on public.team_members for all
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

-- ----- gallery_images -----
drop policy if exists "gallery_images: public read on active sites" on public.gallery_images;
drop policy if exists "gallery_images: owner or admin read"         on public.gallery_images;
drop policy if exists "gallery_images: owner or admin write"        on public.gallery_images;

create policy "gallery_images: public read on active sites"
  on public.gallery_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and w.is_active = true
    )
  );

create policy "gallery_images: owner or admin read"
  on public.gallery_images for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "gallery_images: owner or admin write"
  on public.gallery_images for all
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

-- ----- leads -----
drop policy if exists "leads: public can submit"      on public.leads;
drop policy if exists "leads: owner or admin read"    on public.leads;
drop policy if exists "leads: owner or admin update"  on public.leads;
drop policy if exists "leads: admin can delete"       on public.leads;

-- Anyone (anon or authed) can submit a lead, BUT only if the website is
-- active AND the contact form is enabled. This blocks form-spamming on
-- disabled sites at the database layer.
create policy "leads: public can submit"
  on public.leads for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id
        and w.is_active = true
        and w.contact_form_enabled = true
    )
  );

create policy "leads: owner or admin read"
  on public.leads for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "leads: owner or admin update"
  on public.leads for update
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "leads: admin can delete"
  on public.leads for delete
  to authenticated
  using (public.is_admin());

-- ----- applications -----
drop policy if exists "applications: public can submit"      on public.applications;
drop policy if exists "applications: owner or admin read"    on public.applications;
drop policy if exists "applications: owner or admin update"  on public.applications;
drop policy if exists "applications: admin can delete"       on public.applications;

create policy "applications: public can submit"
  on public.applications for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id
        and w.is_active = true
        and w.application_form_enabled = true
    )
  );

create policy "applications: owner or admin read"
  on public.applications for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "applications: owner or admin update"
  on public.applications for update
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "applications: admin can delete"
  on public.applications for delete
  to authenticated
  using (public.is_admin());

-- ----- bookings -----
drop policy if exists "bookings: public can submit"      on public.bookings;
drop policy if exists "bookings: owner or admin read"    on public.bookings;
drop policy if exists "bookings: owner or admin update"  on public.bookings;
drop policy if exists "bookings: admin can delete"       on public.bookings;

create policy "bookings: public can submit"
  on public.bookings for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id
        and w.is_active = true
        and w.booking_form_enabled = true
    )
  );

create policy "bookings: owner or admin read"
  on public.bookings for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "bookings: owner or admin update"
  on public.bookings for update
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "bookings: admin can delete"
  on public.bookings for delete
  to authenticated
  using (public.is_admin());

-- ----- pages -----
drop policy if exists "pages: public read"             on public.pages;
drop policy if exists "pages: owner or admin read"     on public.pages;
drop policy if exists "pages: owner or admin write"    on public.pages;
drop policy if exists "pages: owner or admin update"   on public.pages;
drop policy if exists "pages: owner or admin delete"   on public.pages;

-- Anyone can read PUBLISHED pages of an active website. The published
-- check is at the page level so unpublished drafts never leak.
create policy "pages: public read"
  on public.pages for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.websites w
      where w.id = website_id and w.is_active = true
    )
  );

-- Owners + admins also see drafts on their own sites.
create policy "pages: owner or admin read"
  on public.pages for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "pages: owner or admin write"
  on public.pages for insert
  to authenticated
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "pages: owner or admin update"
  on public.pages for update
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "pages: owner or admin delete"
  on public.pages for delete
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

-- ----- page_blocks -----
drop policy if exists "page_blocks: public read"            on public.page_blocks;
drop policy if exists "page_blocks: owner or admin read"    on public.page_blocks;
drop policy if exists "page_blocks: owner or admin write"   on public.page_blocks;
drop policy if exists "page_blocks: owner or admin update"  on public.page_blocks;
drop policy if exists "page_blocks: owner or admin delete"  on public.page_blocks;

-- Public can read PUBLISHED blocks of PUBLISHED pages on ACTIVE
-- websites. Three checks because a draft page with published blocks
-- still shouldn't render.
create policy "page_blocks: public read"
  on public.page_blocks for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.websites w
      where w.id = website_id and w.is_active = true
    )
    and (
      page_id is null
      or exists (
        select 1 from public.pages p
        where p.id = page_id and p.is_published = true
      )
    )
  );

create policy "page_blocks: owner or admin read"
  on public.page_blocks for select
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "page_blocks: owner or admin write"
  on public.page_blocks for insert
  to authenticated
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "page_blocks: owner or admin update"
  on public.page_blocks for update
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "page_blocks: owner or admin delete"
  on public.page_blocks for delete
  to authenticated
  using (
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.user_id = auth.uid() or public.is_admin())
    )
  );

-- ============================================================================
--  STORAGE BUCKETS + POLICIES
--  Public-read buckets for website assets. Path convention:
--      <bucket>/<auth.uid()>/<filename>
--  RLS enforces that users can only write inside their own user-id folder.
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('logos',       'logos',       true),
  ('gallery',     'gallery',     true),
  ('team-images', 'team-images', true)
on conflict (id) do update set public = excluded.public;

-- Public read for all three buckets
drop policy if exists "site assets: public read" on storage.objects;
create policy "site assets: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('logos', 'gallery', 'team-images'));

-- Owners can upload only into their own user-id folder
drop policy if exists "site assets: owner can insert" on storage.objects;
create policy "site assets: owner can insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('logos', 'gallery', 'team-images')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Owners can update their own files; admins can update any.
drop policy if exists "site assets: owner or admin can update" on storage.objects;
create policy "site assets: owner or admin can update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('logos', 'gallery', 'team-images')
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  )
  with check (
    bucket_id in ('logos', 'gallery', 'team-images')
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- Owners can delete their own files; admins can delete any.
drop policy if exists "site assets: owner or admin can delete" on storage.objects;
create policy "site assets: owner or admin can delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('logos', 'gallery', 'team-images')
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ============================================================================
-- 12. subscriptions  (Stripe-backed, one row per user)
--     Phase 9 — recurring billing. Source of truth for whether a customer
--     may keep their public website online.
-- ============================================================================
create table if not exists public.subscriptions (
  user_id                uuid        primary key references auth.users(id) on delete cascade,
  stripe_customer_id     text        unique,
  stripe_subscription_id text        unique,
  stripe_price_id        text,
  plan                   text        check (plan in ('basic', 'pro', 'premium')),
  status                 text,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);
create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);

-- Lemon Squeezy support runs alongside Stripe. `provider` records which
-- backend issued the subscription so the webhook handlers + cancel flows
-- know which API to call. Existing Stripe rows default to 'stripe'.
alter table public.subscriptions
  add column if not exists provider text not null default 'stripe'
    check (provider in ('stripe', 'lemon'));
alter table public.subscriptions
  add column if not exists lemon_customer_id text unique;
alter table public.subscriptions
  add column if not exists lemon_subscription_id text unique;
alter table public.subscriptions
  add column if not exists lemon_variant_id text;

create index if not exists subscriptions_lemon_customer_idx
  on public.subscriptions (lemon_customer_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- has_active_subscription(uid) — true iff the given user has a subscription
-- row in an access-granting status AND (for trialing rows) the trial hasn't
-- run out yet. Used by both server actions and the automatic
-- websites.is_active gating below.
create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = uid
      and status in ('active', 'trialing')
      and (
        -- "active" rows from Stripe always have a current_period_end; we
        -- treat NULL as "still entitled" so legacy rows never auto-expire.
        current_period_end is null
        or current_period_end > now()
      )
  );
$$;

revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to authenticated, anon;

-- When a subscription's status leaves the access-granting set, take the
-- user's websites offline. Going back active does NOT auto-republish — the
-- customer must explicitly hit the publish toggle again.
create or replace function public.subscriptions_sync_websites()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.status is distinct from old.status)
     and old.status in ('active', 'trialing')
     and (new.status is null or new.status not in ('active', 'trialing'))
  then
    update public.websites
       set is_active = false
     where user_id = new.user_id
       and is_active = true;
  end if;
  return new;
end;
$$;

drop trigger if exists subscriptions_sync_websites on public.subscriptions;
create trigger subscriptions_sync_websites
  after update of status on public.subscriptions
  for each row execute function public.subscriptions_sync_websites();

alter table public.subscriptions enable row level security;
alter table public.subscriptions force row level security;

drop policy if exists "subscriptions: self or admin can read" on public.subscriptions;

-- Read-only for the owner and admins. All writes go through the service-role
-- client in the Stripe webhook; no INSERT/UPDATE/DELETE policy is exposed.
create policy "subscriptions: self or admin can read"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ============================================================================
--  Done.
--  Bootstrap your first admin (replace the email):
--    insert into public.admin_roles (user_id, granted_by)
--    select id, id from auth.users where email = 'you@example.com'
--    on conflict (user_id) do nothing;
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================================

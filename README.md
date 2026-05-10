# Sitalo

Eine White-Label-Plattform für professionelle Unternehmenswebseiten mit
Kunden-Dashboard. Fokus: Pflegedienste, Arztpraxen, Friseure, Handwerker und
andere lokale Dienstleister.

## Tech-Stack

- Next.js 16 (App Router, React 19, Turbopack)
- TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui (New York, neutral)
- Supabase (Auth, PostgreSQL, Storage, RLS)
- Zod + React Hook Form
- ESLint (Flat Config) + Prettier

> Hinweis: `create-next-app@latest` installiert aktuell Next 16. Da Next 16
> eine Obermenge der App-Router-Features aus Next 15 ist, nutzen wir die
> aktuelle stabile Version. Die Datei `proxy.ts` (Root) ersetzt in Next 16
> die klassische `middleware.ts`.

## Voraussetzungen

- Node.js ≥ 20.9
- npm 10+
- Supabase-Projekt (kostenlos auf supabase.com)

## Setup (Click-by-Click)

### 1. Repository klonen + Dependencies installieren

```bash
git clone <repo-url> sitalo
cd sitalo
npm install
```

### 2. Supabase-Projekt anlegen

1. Auf [supabase.com](https://supabase.com) einloggen → **New project**.
2. Organisation wählen, Projekt benennen (z. B. `sitalo-dev`), starkes
   Datenbank-Passwort vergeben, Region in der EU wählen (DSGVO).
3. Auf „Create new project" klicken und ~1 Minute warten, bis die DB läuft.

### 3. Schema in Supabase ausführen

1. Im Supabase-Projekt auf **SQL Editor** (linke Sidebar) → **New query**.
2. Inhalt von [`supabase/schema.sql`](./supabase/schema.sql) **vollständig**
   einfügen.
3. **Run** (oder Cmd/Ctrl+Enter). Du solltest „Success. No rows returned"
   sehen. Die Datei ist idempotent und kann beliebig oft erneut ausgeführt
   werden.
4. Im Bereich **Table Editor** prüfen, dass diese Tabellen existieren:
   `profiles`, `websites`, `services`, `team_members`, `gallery_images`,
   `leads`, `applications`, `templates`, `admin_roles`.
5. Unter **Storage** prüfen, dass die Buckets `logos`, `gallery`,
   `team-images` existieren (alle public).

### 4. Auth-Settings konfigurieren

Im Supabase-Dashboard:

1. **Authentication → Providers → Email**: aktivieren. „Confirm email"
   anlassen.
2. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs** (additional): `http://localhost:3000/auth/callback`
   - Für Production später: `https://deine-domain.de` + zugehöriger
     Callback eintragen.
3. **Authentication → Email Templates**: Standard-Templates funktionieren,
   können später lokalisiert werden.

### 5. Environment Variables

```bash
cp .env.example .env.local
```

Werte aus dem Supabase-Dashboard eintragen:

- **NEXT_PUBLIC_SUPABASE_URL** und **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
  Project Settings → **API** → „Project URL" und „Project API keys → anon
  public".
- **SUPABASE_SERVICE_ROLE_KEY**: gleiche Stelle, „service_role". **Niemals
  in Client-Code referenzieren.** Aktuell nur für spätere Admin-Scripts /
  Seeding.
- **NEXT_PUBLIC_APP_URL**: für lokal `http://localhost:3000`, in Production
  die echte Domain.

### 6. Dev-Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

### 7. Auth-Flow testen

1. **/register** → Konto anlegen mit echter E-Mail.
2. Bestätigungs-Mail aus dem Postfach öffnen → Link führt nach
   `/auth/callback?code=...&next=/dashboard`.
3. Bei Erfolg landest du im **/dashboard**.
4. **Abmelden** rechts oben → Redirect auf `/login`.
5. **/forgot-password** → Mail anfordern → Link öffnen → neues Passwort
   setzen → wirst eingeloggt.

### 8. Ersten Admin anlegen (optional, für Phase 7)

Im Supabase **SQL Editor** ausführen (E-Mail anpassen):

```sql
insert into public.admin_roles (user_id, granted_by)
select id, id from auth.users where email = 'du@example.com'
on conflict (user_id) do nothing;

update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'du@example.com');
```

Danach: einloggen → **/admin** ist erreichbar.

### 9. (Optional) Echte Datenbank-Typen generieren

Statt der aktuell permissiven Platzhalter-Typen:

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-ref> > types/database.ts
```

Project-ref findest du in der Supabase-URL: `https://<ref>.supabase.co`.

## Scripts

| Script                  | Zweck                              |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Dev-Server (Turbopack, .next/dev)  |
| `npm run build`         | Production Build                   |
| `npm run start`         | Production-Server (lokal)          |
| `npm run lint`          | ESLint                             |
| `npm run typecheck`     | `tsc --noEmit`                     |
| `npm run format`        | Prettier write                     |
| `npm run format:check`  | Prettier check                     |

## Projektstruktur

```
app/
  (auth)/
    layout.tsx
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
    update-password/page.tsx
  auth/
    callback/route.ts        # OAuth/recovery code exchange
  dashboard/
    layout.tsx               # requireUser() guard
    page.tsx
  admin/
    layout.tsx               # requireAdmin() guard
    page.tsx
  site/[slug]/               # Phase 4
  layout.tsx
  page.tsx                   # Marketing-Landing
components/
  auth/                      # Login/Register/ForgotPassword/UpdatePassword forms
  dashboard/                 # Sidebar, sign-out button
  ui/                        # shadcn primitives (Button, Input, Card, …)
  templates/                 # Phase 5
  site/                      # Phase 4
lib/
  supabase/
    client.ts                # Browser client
    server.ts                # Server Components / actions (async cookies)
    proxy.ts                 # Session refresh + UX redirects
    auth.ts                  # requireUser / requireAdmin helpers
  validations/               # Zod schemas
  actions/                   # Server actions (auth, …)
  utils.ts                   # cn()
  site-url.ts                # getSiteUrl()
types/
  database.ts                # Supabase generated types (placeholder)
supabase/
  schema.sql                 # Tables, RLS, triggers, storage buckets+policies
proxy.ts                     # Root proxy (Next 16) → calls lib/supabase/proxy
```

## Sicherheitsmodell

- **RLS überall an.** Jede Tabelle hat explizite Policies für
  `select / insert / update / delete`.
- **`profiles.role` ist informativ.** Authoritative Admin-Quelle ist die
  `admin_roles`-Tabelle. RLS-Policies fragen `is_admin()` (SECURITY DEFINER)
  ab, das einen Lookup auf `admin_roles` macht.
- **Public reads** sind an `websites.is_active = true` gekoppelt. Inaktive
  Websites sind für `anon` und andere Kunden unsichtbar.
- **Lead-/Application-Inserts** sind anonym erlaubt, aber RLS verlangt, dass
  die parent website aktiv UND das jeweilige Formular aktiviert ist.
- **Storage-Pfade** folgen `<bucket>/<auth.uid()>/<filename>`. Schreiben
  nur in den eigenen Ordner möglich (per Storage RLS).
- **Service Role Key** wird ausschließlich serverseitig in zukünftigen
  Admin-Scripts verwendet, niemals im Browser-Bundle.

## Status

Alle 8 MVP-Phasen erledigt:

1. ✅ Foundation (Next 16, Tailwind v4, shadcn, Supabase Clients)
2. ✅ Schema, Auth, RLS (9 Tabellen, Storage, Policies, Auth-Flow)
3. ✅ Kunden-Dashboard mit Website-Editor (Stammdaten, Hero, About, SEO, Logo, Services, Team, Galerie)
4. ✅ Öffentliches Website-Rendering `/site/[slug]` (+ Imprint, Datenschutz, 404, Owner-Preview)
5. ✅ 3 Branchen-Templates (Pflegedienst / Arztpraxis / Friseur) mit Theme-Override + Hero-Variante
6. ✅ Kontakt- & Bewerbungsformulare mit Honeypot, Status-Workflow im Dashboard
7. ✅ Admin-Bereich mit System-Übersicht, Websites, Templates, Leads/Bewerbungen-Inboxes
8. ✅ Robots, Sitemap, globale Loading/Error/404, Vercel-Deployment

## Production-Deployment auf Vercel

### A) Supabase-Production vorbereiten

1. **Eigenes Production-Projekt anlegen** (`supabase.com → New project`). Region in der EU (DSGVO).
2. **Schema ausführen**: `supabase/schema.sql` im SQL-Editor einmal komplett laufen lassen (idempotent).
3. **Auth → URL Configuration**:
   - **Site URL**: `https://deine-domain.de`
   - **Redirect URLs**: `https://deine-domain.de/auth/callback`
4. **Auth → Email Templates**: deutsche Texte hinterlegen, Absender-Adresse prüfen (oder Custom-SMTP einrichten — Free-Tier hat 3-Mails-pro-Stunde-Limit).
5. **Auth → Rate Limits**: für Production die Sign-Up- und Password-Reset-Limits dem erwarteten Traffic anpassen.
6. **Storage**: Buckets sind durch `schema.sql` schon angelegt, prüfe nur, dass `logos`, `gallery`, `team-images` als public markiert sind.
7. **API → Project URL + anon + service_role keys** notieren.
8. **Ersten Admin per SQL-Editor anlegen**:
   ```sql
   insert into public.admin_roles (user_id, granted_by)
   select id, id from auth.users where email = 'du@deine-domain.de'
   on conflict (user_id) do nothing;
   ```

### B) Vercel-Projekt verbinden

1. **vercel.com → Add New Project → GitHub-Repo importieren**.
2. **Framework Preset**: Next.js (auto-detected). Build Command `next build`, Output `.next` — Defaults sind korrekt.
3. **Environment Variables** setzen (für `Production`, `Preview`, `Development`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>          ← nur Server-side
   NEXT_PUBLIC_APP_URL=https://deine-domain.de           ← finale Domain
   ```
   > **Wichtig**: `NEXT_PUBLIC_APP_URL` setzt den Reset-Mail-Callback und die Sitemap-Basis. Ohne gesetztes Feld fällt der Code auf `VERCEL_PROJECT_PRODUCTION_URL` zurück (Vercel setzt das automatisch in Prod) oder im schlimmsten Fall `localhost:3000`. Daher explizit setzen.
4. **Custom Domain** in Vercel verbinden → DNS umstellen.
5. **Deploy**. Erste Builds dauern ~1 Minute.
6. **In Supabase Auth → URL Configuration nochmal prüfen**: Site URL und Redirect URL müssen exakt der finalen Domain entsprechen, sonst funktionieren Reset-Mails nicht.

### C) Smoke-Test-Checkliste (Production)

Direkt nach Deploy in einem Inkognito-Fenster durchgehen:

- [ ] `https://deine-domain.de/` → Sitalo-Marketing-Page lädt.
- [ ] `https://deine-domain.de/robots.txt` → enthält Sitemap-Verweis.
- [ ] `https://deine-domain.de/sitemap.xml` → enthält Marketing-Root + alle aktiven Public-Sites.
- [ ] `/register` → Konto anlegen, Bestätigungs-Mail kommt von Production-Domain, Link führt korrekt zum Dashboard.
- [ ] `/login` → Login funktioniert. `/forgot-password` → Reset-Mail kommt, neues Passwort setzen funktioniert.
- [ ] `/dashboard` → Onboarding zeigt sich, Website anlegen mit Slug, Inhalte pflegen.
- [ ] Logo, Team-Foto, Galerie-Bild hochladen → unter `https://<ref>.supabase.co/storage/v1/object/public/...` erreichbar.
- [ ] Website auf öffentlich → Inkognito → `/site/<slug>` zeigt vollständig gerenderte Public-Page.
- [ ] Public-Site: Industry-Pill in Theme-Farbe, Telefon-Button öffnet `tel:`-Dialog.
- [ ] Kontaktformular ausfüllen → Erfolgsmeldung, Lead taucht im `/dashboard/leads` auf.
- [ ] Admin-Account: `/admin` lädt, alle 5 Sektionen erreichbar. Status-Toggle, Slug-Change, Template-Wechsel testen.
- [ ] Nicht-Admin-Account: `/admin` redirected nach `/dashboard`.
- [ ] Lighthouse-Run auf einer Public-Site: Performance > 90, SEO > 90, Accessibility > 90.

### D) Optional: Strict-typed DB-Client

Sobald Production läuft, kannst du den Database-Stub durch echte Typen ersetzen — alles wird dann strikt typisiert:

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-ref> > types/database.ts
```

Danach in `lib/supabase/{client,server,proxy}.ts` das Generic re-aktivieren:
```ts
import type { Database } from "@/types/database";
return createServerClient<Database>(...);
```
Die in `types/website.ts` definierten Domain-Typen werden dann redundant und können gelöscht werden.

## Troubleshooting

| Symptom | Wahrscheinliche Ursache | Fix |
|---|---|---|
| `supabaseUrl is required` | ENV nicht gesetzt | Vercel → Settings → Environment Variables prüfen; nach Änderung **Re-Deploy** auslösen |
| Bestätigungs-Mail kommt nicht | Free-Tier Limit oder falsche Site URL | Custom-SMTP in Supabase einrichten; Site URL = exakt Production-Domain |
| Reset-Link → `/login?error=...` | Redirect URL fehlt in Supabase | Auth → URL Configuration → `https://deine-domain.de/auth/callback` ergänzen |
| `/sitemap.xml` ist leer | Keine Site auf öffentlich oder Supabase nicht erreichbar | Im Dashboard mindestens eine Website veröffentlichen |
| Bilder laden nicht über `next/image` | `remotePatterns` matcht den Hostnamen nicht | `NEXT_PUBLIC_SUPABASE_URL` muss zur Build-Zeit gesetzt sein |
| `permission denied for table …` | RLS aktiv (gewollt) | Wenn unerwartet: relevante Policy in `schema.sql` prüfen |
| Trigger `on_auth_user_created` läuft nicht | Schema unvollständig | `schema.sql` komplett nochmal ausführen |
| Login-Loop | Cookies blockiert / Site URL falsch | Browser-Cookies löschen, Domain-Setup prüfen |
| `/admin` zeigt sich nicht trotz `admin_roles`-Eintrag | JWT-Cache mit altem Status | Logout + Login → neue Session |

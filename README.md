# SitePilot

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
git clone <repo-url> sitepilot
cd sitepilot
npm install
```

### 2. Supabase-Projekt anlegen

1. Auf [supabase.com](https://supabase.com) einloggen → **New project**.
2. Organisation wählen, Projekt benennen (z. B. `sitepilot-dev`), starkes
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

## Aktueller Stand

**Phase 1 — Foundation (✅)**
**Phase 2 — Schema, Auth, RLS (✅)**
**Phase 3 — Dashboard mit Website-Editor (next up)**

## Roadmap

1. ✅ Foundation
2. ✅ Schema, Auth, RLS
3. Kunden-Dashboard (Inhalte editieren)
4. Öffentliches Website-Rendering `/site/[slug]`
5. Templates (Pflege, Arzt, Friseur)
6. Leads & Bewerbungen
7. Admin-Bereich
8. Tests, Bugfixing, Vercel-Deployment

## Troubleshooting

| Symptom | Wahrscheinliche Ursache | Fix |
|---|---|---|
| `supabaseUrl is required` | `.env.local` fehlt oder leer | Schritt 5 prüfen, dev-Server neu starten |
| Mail kommt nicht an | Supabase Free-Tier rate-limit | bis zu 60 s warten; Rate-Limits siehe Auth → Rate Limits |
| Reset-Link führt auf `/login?error=...` | Redirect-URL nicht eingetragen | Schritt 4 → Redirect URLs ergänzen |
| `permission denied for table …` | RLS blockiert anonymen oder fremden Zugriff | korrekt — bedeutet, RLS funktioniert. Falls falsche Policy, schema.sql neu ausführen |
| Trigger `on_auth_user_created` läuft nicht | Schema noch nicht / nicht vollständig ausgeführt | schema.sql nochmal komplett im SQL-Editor ausführen |
| Login redirected im Loop | Cookies blockiert / `Site URL` falsch | Browser-Cookies löschen + Site URL = `http://localhost:3000` |

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
> aktuelle stabile Version. Falls du explizit auf 15 willst, pinne `next` in
> `package.json` auf `^15`.

## Voraussetzungen

- Node.js ≥ 20.9 (Next 16 minimum)
- npm 10+
- Supabase-Projekt (kostenlos auf supabase.com anlegen)

## Setup

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Environment-Variablen anlegen
cp .env.example .env.local
# danach Werte aus deinem Supabase-Projekt eintragen

# 3. Datenbank initialisieren (kommt in Phase 2)
# In Supabase SQL Editor: supabase/schema.sql ausführen.

# 4. Dev-Server starten
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000).

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
  (auth)/          # Login, Register, Forgot Password (Phase 2)
  dashboard/       # Kunden-Dashboard (Phase 3)
  admin/           # Admin-Bereich (Phase 7)
  site/[slug]/     # Öffentliche Kunden-Websites (Phase 4)
  layout.tsx
  page.tsx         # Marketing-Landing
components/
  ui/              # shadcn/ui Primitives
  dashboard/       # Dashboard-Bausteine
  templates/       # Branchen-Templates (Phase 5)
  site/            # Bausteine für öffentliche Websites
lib/
  supabase/        # client.ts, server.ts, proxy.ts
  validations/     # Zod-Schemas
  actions/         # Server Actions
types/
  database.ts      # generierte Supabase-Typen
supabase/
  schema.sql       # Schema + RLS (Phase 2)
  seed.sql         # Demo-Daten (Phase 8)
proxy.ts           # Next 16 proxy (ehemals middleware.ts)
```

## Aktueller Stand

**Phase 1 — Foundation (✅ erledigt)**

- Projekt initialisiert, Dependencies installiert
- shadcn/ui konfiguriert (manuell, ohne Registry-Zugriff)
- Supabase-Clients vorbereitet (browser, server, proxy)
- Ordnerstruktur, Prettier, ENV, README

**Phase 2 — Schema, Auth, RLS (next up)**

## Roadmap

1. Foundation
2. Schema, Auth, RLS
3. Kunden-Dashboard
4. Öffentliches Website-Rendering `/site/[slug]`
5. Templates (Pflege, Arzt, Friseur)
6. Leads & Bewerbungen
7. Admin-Bereich
8. Tests, Bugfixing, Vercel-Deployment

## Deployment

Folgt in Phase 8 (Vercel + Supabase Production).

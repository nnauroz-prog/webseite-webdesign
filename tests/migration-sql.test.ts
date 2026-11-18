import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import type { SchemaStatus } from "@/lib/admin/schema";

import {
  MIGRATION_ADMIN_SQL,
  MIGRATION_ADMIN_SQL_FILE,
  MIGRATION_ANGEBOTE_SQL,
  MIGRATION_ANGEBOTE_SQL_FILE,
  MIGRATION_AUSBAU_SQL,
  MIGRATION_AUSBAU_SQL_FILE,
  MIGRATION_INSTAGRAM_SQL,
  MIGRATION_INSTAGRAM_SQL_FILE,
  MIGRATION_SERIEN_SQL,
  MIGRATION_SERIEN_SQL_FILE,
  MIGRATIONS,
  migrationSqlFor,
  missingMigrations,
} from "@/lib/admin/migration-sql";

const read = (file: string) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

/** Ohne Kommentare und ohne „on delete cascade“ (das ist kein Löschen). */
const code = (sql: string) =>
  sql
    .replace(/--.*$/gm, "")
    .replace(/on delete cascade/gi, "")
    // Das Recht zu löschen für den Server ist kein Löschen.
    .replace(SERVER_RECHTE, "");

/** Ausdrückliche Rechte für den Server an einer Tabelle. */
const SERVER_RECHTE =
  /grant select, insert, update, delete on table public\.[a-z_]+ to service_role;/g;

const ADDITIV_VERBOTEN = /\bdrop\b|\brename\b|\btruncate\b|\bdelete\b/i;

describe("lib/admin/migration-sql.ts", () => {
  it("jede Konstante ist byte-gleich mit ihrer Migrationsdatei", () => {
    assert.equal(MIGRATION_ADMIN_SQL, read(MIGRATION_ADMIN_SQL_FILE));
    assert.equal(MIGRATION_ANGEBOTE_SQL, read(MIGRATION_ANGEBOTE_SQL_FILE));
    assert.equal(MIGRATION_AUSBAU_SQL, read(MIGRATION_AUSBAU_SQL_FILE));
    assert.equal(MIGRATION_SERIEN_SQL, read(MIGRATION_SERIEN_SQL_FILE));
    assert.equal(MIGRATION_INSTAGRAM_SQL, read(MIGRATION_INSTAGRAM_SQL_FILE));
    assert.deepEqual(
      MIGRATIONS.map((m) => [m.id, m.file]),
      [
        ["admin", MIGRATION_ADMIN_SQL_FILE],
        ["angebote", MIGRATION_ANGEBOTE_SQL_FILE],
        ["ausbau", MIGRATION_AUSBAU_SQL_FILE],
        ["serien", MIGRATION_SERIEN_SQL_FILE],
        ["instagram", MIGRATION_INSTAGRAM_SQL_FILE],
      ],
    );
    for (const m of MIGRATIONS) assert.equal(m.sql, read(m.file));
  });

  it("jede Tabelle gibt dem Server die Rechte ausdrücklich (Supabase vergibt sie nicht mehr von selbst)", () => {
    const tabellen: [string, string[]][] = [
      ["supabase/migrations/20261030000000_leads.sql", ["leads"]],
      [MIGRATION_ADMIN_SQL_FILE, ["lead_events", "lead_deletions"]],
      [MIGRATION_ANGEBOTE_SQL_FILE, ["angebote"]],
      [MIGRATION_AUSBAU_SQL_FILE, ["projekte", "post_status"]],
      [MIGRATION_SERIEN_SQL_FILE, ["serien"]],
    ];
    for (const [datei, namen] of tabellen) {
      const sql = read(datei).replace(/--.*$/gm, "");
      for (const t of namen)
        assert.ok(
          sql.includes(
            `grant select, insert, update, delete on table public.${t} to service_role;`,
          ),
          `${datei}: ${t}`,
        );
      // Nie Rechte für die öffentlichen Rollen.
      assert.doesNotMatch(
        sql,
        /grant[^;]*\bto\s+(anon|authenticated|public)\b/i,
      );
    }
  });

  it("Admin-Ausbau: additiv und ohne reply_to-Index (keine Personendaten im Filter)", () => {
    const file = read(MIGRATION_ADMIN_SQL_FILE);
    assert.ok(!ADDITIV_VERBOTEN.test(code(file)));
    assert.ok(!file.includes("leads_reply_to_idx"));
    assert.ok(file.includes("add column if not exists follow_up_on date"));
    assert.ok(file.includes("create table if not exists public.lead_events"));
    assert.ok(
      file.includes("create table if not exists public.lead_deletions"),
    );
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });

  it("Angebote: additiv, mehrfach ausführbar, RLS an, keine Policies", () => {
    const file = read(MIGRATION_ANGEBOTE_SQL_FILE);
    const sql = code(file);
    assert.ok(!ADDITIV_VERBOTEN.test(sql));
    assert.ok(!/\bcreate policy\b/i.test(sql));
    assert.ok(
      sql.includes("create sequence if not exists public.angebote_nummer_seq"),
    );
    assert.ok(sql.includes("create table if not exists public.angebote"));
    assert.ok(file.includes("references public.leads (id) on delete cascade"));
    assert.ok(
      sql.includes("alter table public.angebote enable row level security"),
    );
    assert.ok(
      sql.includes(
        "create index if not exists angebote_lead_id_created_at_idx",
      ),
    );
    // Jede create-Anweisung ist wiederholbar.
    for (const m of sql.matchAll(
      /\bcreate\s+(?!or replace|table if not exists|sequence if not exists|index if not exists|trigger)(\w+)/gi,
    )) {
      assert.fail(`nicht wiederholbar: create ${m[1]}`);
    }
    // Der Trigger nur innerhalb des „if not exists“-Blocks.
    assert.match(
      sql,
      /if not exists \(\s*select 1\s*from pg_trigger[\s\S]*create trigger angebote_touch_updated_at/,
    );
    // Nummer nicht über die öffentliche API verbrauchbar.
    assert.match(
      sql,
      /revoke execute on function public\.angebote_naechste_nummer\(\)\s*from public, anon, authenticated;/,
    );
    // Alle Status und Spalten der App sind da.
    for (const s of [
      "entwurf",
      "gesendet",
      "angenommen",
      "abgelehnt",
      "zurueckgezogen",
    ])
      assert.ok(sql.includes(`'${s}'`), s);
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });

  it("Ausbau: additiv, mehrfach ausführbar, RLS an, keine Policies, keine Rechte für anon", () => {
    const file = read(MIGRATION_AUSBAU_SQL_FILE);
    const sql = code(file);
    assert.ok(!ADDITIV_VERBOTEN.test(sql));
    assert.ok(!/\bcreate policy\b/i.test(sql));
    for (const t of ["projekte", "post_status"]) {
      assert.ok(sql.includes(`create table if not exists public.${t} (`), t);
      assert.ok(
        sql.includes(`alter table public.${t} enable row level security;`),
        t,
      );
      assert.ok(
        sql.includes(
          `revoke all on table public.${t} from anon, authenticated;`,
        ),
        t,
      );
    }
    // Je Angebot höchstens ein Projekt; es verschwindet mit Angebot und Anfrage.
    assert.match(
      file,
      /angebot_id\s+uuid not null unique\s+references public\.angebote \(id\) on delete cascade/,
    );
    assert.ok(file.includes("references public.leads (id) on delete cascade"));
    assert.ok(sql.includes("schritte    jsonb not null default '{}'::jsonb"));
    assert.match(
      sql,
      /notiz\s+text check \(notiz is null or char_length\(notiz\) <= 2000\)/,
    );
    assert.ok(sql.includes("check (platz between 0 and 2)"));
    assert.ok(sql.includes("check (format in ('story', 'beitrag'))"));
    assert.ok(sql.includes("primary key (datum, platz, format)"));
    // Jede create-Anweisung ist wiederholbar.
    for (const m of sql.matchAll(
      /\bcreate\s+(?!or replace|table if not exists|index if not exists|trigger)(\w+)/gi,
    )) {
      assert.fail(`nicht wiederholbar: create ${m[1]}`);
    }
    assert.match(
      sql,
      /if not exists \(\s*select 1\s*from pg_trigger[\s\S]*create trigger projekte_touch_updated_at/,
    );
    assert.match(
      sql,
      /revoke execute on function public\.projekte_touch_updated_at\(\)\s*from public, anon, authenticated;/,
    );
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });

  it("Serien: additiv, mehrfach ausführbar, RLS an, keine Policies, keine Rechte für anon", () => {
    const file = read(MIGRATION_SERIEN_SQL_FILE);
    const sql = code(file);
    assert.ok(!ADDITIV_VERBOTEN.test(sql));
    assert.ok(!/\bcreate policy\b/i.test(sql));
    assert.ok(sql.includes("create table if not exists public.serien ("));
    assert.ok(
      sql.includes("alter table public.serien enable row level security;"),
    );
    assert.ok(
      sql.includes(
        "revoke all on table public.serien from anon, authenticated;",
      ),
    );
    // Spalten wie in lib/serien-store.ts (SERIEN_COLUMNS).
    assert.match(sql, /id\s+uuid primary key default gen_random_uuid\(\)/);
    assert.match(sql, /created_at\s+timestamptz not null default now\(\)/);
    assert.match(sql, /datum\s+date not null/);
    assert.match(
      sql,
      /auftrag\s+text not null default ''\s+check \(char_length\(auftrag\) <= 500\)/,
    );
    assert.match(sql, /serie\s+jsonb not null/);
    assert.match(sql, /gepostet_at timestamptz\s*\n\);/);
    assert.match(
      sql,
      /create index if not exists serien_created_at_idx\s+on public\.serien \(created_at desc\);/,
    );
    // Jede create-Anweisung ist wiederholbar.
    for (const m of sql.matchAll(
      /\bcreate\s+(?!table if not exists|index if not exists)(\w+)/gi,
    )) {
      assert.fail(`nicht wiederholbar: create ${m[1]}`);
    }
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });

  it("Instagram: additiv, mehrfach ausführbar, RLS an, keine Policies, privater Speicher", () => {
    const file = read(MIGRATION_INSTAGRAM_SQL_FILE);
    const sql = code(file);
    assert.ok(!ADDITIV_VERBOTEN.test(sql));
    assert.ok(!/\bcreate policy\b/i.test(sql));
    assert.ok(
      sql.includes("create table if not exists public.instagram_posts ("),
    );
    assert.ok(
      sql.includes(
        "alter table public.instagram_posts enable row level security;",
      ),
    );
    assert.ok(
      sql.includes(
        "revoke all on table public.instagram_posts from anon, authenticated;",
      ),
    );
    assert.ok(
      file.includes(
        "grant select, insert, update, delete on table public.instagram_posts to service_role;",
      ),
    );
    // Spalten wie in lib/instagram/posts-store.ts (INSTAGRAM_POSTS_COLUMNS).
    assert.match(sql, /id\s+uuid primary key default gen_random_uuid\(\)/);
    assert.match(sql, /created_at\s+timestamptz not null default now\(\)/);
    assert.match(
      sql,
      /art\s+text not null\s+check \(art in \('story', 'beitrag'\)\)/,
    );
    assert.match(
      sql,
      /quelle\s+jsonb not null\s+check \(jsonb_typeof\(quelle\) = 'object'\)/,
    );
    assert.match(
      sql,
      /bilder\s+int not null\s+check \(bilder between 1 and 10\)/,
    );
    assert.match(sql, /media_ids\s+text\[\] not null default '\{\}'/);
    assert.match(sql, /links\s+text\[\] not null default '\{\}'\s*\n\);/);
    // Privater Bucket: 8 MB, nur JPEG, ein vorhandener bleibt.
    assert.match(
      sql,
      /insert into storage\.buckets\s+\(id, name, public, file_size_limit, allowed_mime_types\)\s+values\s+\('instagram', 'instagram', false, 8388608, array\['image\/jpeg'\]\)\s+on conflict \(id\) do nothing;/,
    );
    assert.doesNotMatch(sql, /public\s*[:=]?\s*true/i);
    // Jede create-Anweisung ist wiederholbar.
    for (const m of sql.matchAll(
      /\bcreate\s+(?!table if not exists|index if not exists)(\w+)/gi,
    )) {
      assert.fail(`nicht wiederholbar: create ${m[1]}`);
    }
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });

  it("missingMigrations: nur was sicher fehlt, in Ausführungs-Reihenfolge", () => {
    const st = (p: Partial<SchemaStatus>): SchemaStatus => ({
      leadsV2: "ok",
      events: "ok",
      deletions: "ok",
      angebote: "ok",
      projekte: "ok",
      postStatus: "ok",
      serien: "ok",
      instagramPosts: "ok",
      ...p,
    });
    assert.deepEqual(missingMigrations(st({})), []);
    assert.deepEqual(
      missingMigrations(st({ angebote: "fehlt" })).map((m) => m.id),
      ["angebote"],
    );
    assert.deepEqual(
      missingMigrations(st({ events: "fehlt", angebote: "fehlt" })).map(
        (m) => m.id,
      ),
      ["admin", "angebote"],
    );
    assert.deepEqual(
      missingMigrations(st({ leadsV2: "fehlt" })).map((m) => m.id),
      ["admin"],
    );
    // Stand beim Inhaber vor dem Ausbau: nur die neuen Tabellen fehlen.
    for (const p of [
      { projekte: "fehlt" },
      { postStatus: "fehlt" },
      { projekte: "fehlt", postStatus: "fehlt" },
    ] as const) {
      assert.deepEqual(
        missingMigrations(st(p)).map((m) => m.id),
        ["ausbau"],
      );
    }
    // Ohne Angebote fehlt auch der Ausbau; das Angebote-SQL kommt zuerst
    // (projekte verweist auf angebote).
    assert.deepEqual(
      missingMigrations(
        st({ angebote: "fehlt", projekte: "fehlt", postStatus: "fehlt" }),
      ).map((m) => m.id),
      ["angebote", "ausbau"],
    );
    // Stand beim Inhaber vor den Serien: nur die Tabelle serien fehlt.
    assert.deepEqual(
      missingMigrations(st({ serien: "fehlt" })).map((m) => m.id),
      ["serien"],
    );
    assert.deepEqual(
      missingMigrations(
        st({ projekte: "fehlt", postStatus: "fehlt", serien: "fehlt" }),
      ).map((m) => m.id),
      ["ausbau", "serien"],
    );
    // Stand beim Inhaber vor Instagram: nur die Tabelle instagram_posts fehlt.
    assert.deepEqual(
      missingMigrations(st({ instagramPosts: "fehlt" })).map((m) => m.id),
      ["instagram"],
    );
    assert.deepEqual(
      missingMigrations(st({ serien: "fehlt", instagramPosts: "fehlt" })).map(
        (m) => m.id,
      ),
      ["serien", "instagram"],
    );
    // 'unbekannt' fordert nicht zum Ausführen auf.
    assert.deepEqual(
      missingMigrations(
        st({
          leadsV2: "unbekannt",
          angebote: "unbekannt",
          projekte: "unbekannt",
          postStatus: "unbekannt",
          serien: "unbekannt",
          instagramPosts: "unbekannt",
        }),
      ),
      [],
    );
  });

  it("migrationSqlFor: nur die fehlenden, hintereinander", () => {
    const [admin, angebote, ausbau, serien, instagram] = MIGRATIONS;
    assert.equal(migrationSqlFor([angebote]), MIGRATION_ANGEBOTE_SQL);
    assert.equal(
      migrationSqlFor([admin, angebote]),
      `${MIGRATION_ADMIN_SQL}\n${MIGRATION_ANGEBOTE_SQL}`,
    );
    assert.equal(migrationSqlFor([ausbau]), MIGRATION_AUSBAU_SQL);
    assert.equal(
      migrationSqlFor([angebote, ausbau]),
      `${MIGRATION_ANGEBOTE_SQL}\n${MIGRATION_AUSBAU_SQL}`,
    );
    assert.equal(migrationSqlFor([serien]), MIGRATION_SERIEN_SQL);
    assert.equal(
      migrationSqlFor([ausbau, serien]),
      `${MIGRATION_AUSBAU_SQL}\n${MIGRATION_SERIEN_SQL}`,
    );
    assert.equal(
      migrationSqlFor([serien, instagram]),
      `${MIGRATION_SERIEN_SQL}\n${MIGRATION_INSTAGRAM_SQL}`,
    );
    assert.equal(migrationSqlFor([]), "");
  });
});

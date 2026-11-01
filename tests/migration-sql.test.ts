import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import type { SchemaStatus } from "@/lib/admin/schema";

import {
  MIGRATION_ADMIN_SQL,
  MIGRATION_ADMIN_SQL_FILE,
  MIGRATION_ANGEBOTE_SQL,
  MIGRATION_ANGEBOTE_SQL_FILE,
  MIGRATIONS,
  migrationSqlFor,
  missingMigrations,
} from "@/lib/admin/migration-sql";

const read = (file: string) =>
  readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

/** Ohne Kommentare und ohne „on delete cascade“ (das ist kein Löschen). */
const code = (sql: string) =>
  sql.replace(/--.*$/gm, "").replace(/on delete cascade/gi, "");

const ADDITIV_VERBOTEN = /\bdrop\b|\brename\b|\btruncate\b|\bdelete\b/i;

describe("lib/admin/migration-sql.ts", () => {
  it("jede Konstante ist byte-gleich mit ihrer Migrationsdatei", () => {
    assert.equal(MIGRATION_ADMIN_SQL, read(MIGRATION_ADMIN_SQL_FILE));
    assert.equal(MIGRATION_ANGEBOTE_SQL, read(MIGRATION_ANGEBOTE_SQL_FILE));
    assert.deepEqual(
      MIGRATIONS.map((m) => [m.id, m.file]),
      [
        ["admin", MIGRATION_ADMIN_SQL_FILE],
        ["angebote", MIGRATION_ANGEBOTE_SQL_FILE],
      ],
    );
    for (const m of MIGRATIONS) assert.equal(m.sql, read(m.file));
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

  it("missingMigrations: nur was sicher fehlt, in Ausführungs-Reihenfolge", () => {
    const st = (p: Partial<SchemaStatus>): SchemaStatus => ({
      leadsV2: "ok",
      events: "ok",
      deletions: "ok",
      angebote: "ok",
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
    // 'unbekannt' fordert nicht zum Ausführen auf.
    assert.deepEqual(
      missingMigrations(st({ leadsV2: "unbekannt", angebote: "unbekannt" })),
      [],
    );
  });

  it("migrationSqlFor: nur die fehlenden, hintereinander", () => {
    const [admin, angebote] = MIGRATIONS;
    assert.equal(migrationSqlFor([angebote]), MIGRATION_ANGEBOTE_SQL);
    assert.equal(
      migrationSqlFor([admin, angebote]),
      `${MIGRATION_ADMIN_SQL}\n${MIGRATION_ANGEBOTE_SQL}`,
    );
    assert.equal(migrationSqlFor([]), "");
  });
});

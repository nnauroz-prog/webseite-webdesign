import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { MIGRATION_SQL, MIGRATION_SQL_FILE } from "@/lib/admin/migration-sql";

describe("lib/admin/migration-sql.ts", () => {
  const file = readFileSync(
    new URL(`../${MIGRATION_SQL_FILE}`, import.meta.url),
    "utf8",
  );

  it("ist byte-gleich mit der Migrationsdatei", () => {
    assert.equal(MIGRATION_SQL, file);
  });

  it("ist additiv und ohne reply_to-Index (keine Personendaten im Filter)", () => {
    assert.ok(
      !/\bdrop\b|\brename\b|\btruncate\b|\bdelete\b/i.test(
        file.replace(/--.*$/gm, "").replace(/on delete cascade/gi, ""),
      ),
    );
    assert.ok(!file.includes("leads_reply_to_idx"));
    assert.ok(file.includes("add column if not exists follow_up_on date"));
    assert.ok(file.includes("create table if not exists public.lead_events"));
    assert.ok(
      file.includes("create table if not exists public.lead_deletions"),
    );
    assert.ok(file.trimEnd().endsWith("notify pgrst, 'reload schema';"));
  });
});

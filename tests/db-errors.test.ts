import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DbError,
  explainDbError,
  isMissingSchema,
} from "@/lib/admin/db-errors";

describe("DbError", () => {
  it("behält Meldung und Code", () => {
    const err = new DbError("Speichern fehlgeschlagen: x", "PGRST204");
    assert.ok(err instanceof Error);
    assert.equal(err.code, "PGRST204");
    assert.equal(err.message, "Speichern fehlgeschlagen: x");
    assert.equal(new DbError("x", "").code, undefined);
  });
});

describe("explainDbError", () => {
  it("fehlende Spalten → missing_schema_v2 mit Dateinamen", () => {
    for (const code of ["42703", "PGRST204"]) {
      const e = explainDbError(
        new DbError("column leads.follow_up_on does not exist", code),
      );
      assert.equal(e.kind, "missing_schema_v2");
      assert.ok(e.hint.includes("20261101000000_admin_ausbau.sql"));
    }
  });

  it("fehlende neue Tabellen → missing_schema_v2", () => {
    const e = explainDbError(
      new DbError(
        "Could not find the table 'public.lead_events' in the schema cache",
        "PGRST205",
      ),
    );
    assert.equal(e.kind, "missing_schema_v2");
  });

  it("fehlende Tabelle oder Spalte angebote → missing_schema_angebote mit eigener Datei", () => {
    for (const [code, msg] of [
      [
        "PGRST205",
        "Could not find the table 'public.angebote' in the schema cache",
      ],
      ["42P01", 'relation "public.angebote" does not exist'],
      ["42703", "column angebote.abgelehnt_grund does not exist"],
      [
        "PGRST204",
        "Could not find the 'abgelehnt_grund' column of 'angebote' in the schema cache",
      ],
    ]) {
      const e = explainDbError(new DbError(msg, code));
      assert.equal(e.kind, "missing_schema_angebote", msg);
      assert.ok(e.hint.includes("20261102000000_angebote.sql"));
    }
    // lead_events bleibt beim Admin-Ausbau.
    assert.equal(
      explainDbError(
        new DbError(
          "Could not find the table 'public.lead_events' in the schema cache",
          "PGRST205",
        ),
      ).kind,
      "missing_schema_v2",
    );
  });

  it("fehlende Tabelle leads → missing_table_leads", () => {
    for (const code of ["PGRST205", "42P01"]) {
      const e = explainDbError(
        new DbError(
          "Could not find the table 'public.leads' in the schema cache",
          code,
        ),
      );
      assert.equal(e.kind, "missing_table_leads");
      assert.ok(e.hint.includes("20261030000000_leads.sql"));
    }
  });

  it("Schlüssel falsch → auth", () => {
    assert.equal(explainDbError(new DbError("Invalid API key")).kind, "auth");
    assert.equal(
      explainDbError(new DbError("JWSError JWSInvalidSignature", "PGRST301"))
        .kind,
      "auth",
    );
    assert.equal(explainDbError({ message: "Unauthorized 401" }).kind, "auth");
  });

  it("nicht erreichbar → network mit Restore-Hinweis", () => {
    const e = explainDbError(new DbError("TypeError: fetch failed"));
    assert.equal(e.kind, "network");
    assert.ok(e.hint.includes("Restore project"));
    assert.equal(
      explainDbError(new Error("connect ECONNREFUSED 127.0.0.1:1")).kind,
      "network",
    );
  });

  it("Unbekanntes → other mit Rohmeldung", () => {
    const e = explainDbError(new DbError("duplicate key value", "23505"));
    assert.equal(e.kind, "other");
    assert.equal(e.raw, "23505 duplicate key value");
    assert.equal(explainDbError("kaputt").raw, "kaputt");
  });
});

describe("isMissingSchema", () => {
  it("nur bei den vier Codes", () => {
    for (const code of ["42703", "PGRST204", "PGRST205", "42P01"]) {
      assert.equal(isMissingSchema({ code, message: "" }), true);
    }
    assert.equal(isMissingSchema({ code: "PGRST301", message: "" }), false);
    assert.equal(isMissingSchema(new Error("fetch failed")), false);
  });
});

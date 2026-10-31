import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { explainDbError } from "@/lib/admin/db-errors";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;

let mock: Mock;
let schema: typeof import("@/lib/admin/schema");

before(async () => {
  mock = await startMock({ mode: "v1" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  schema = await import("@/lib/admin/schema");
});

after(async () => {
  await mock.close();
});

describe("checkSchema / readSchemaStatus", () => {
  it("v1: alle drei Teile fehlen", async () => {
    mock.reset("v1");
    assert.deepEqual(await schema.readSchemaStatus(), {
      leadsV2: "fehlt",
      events: "fehlt",
      deletions: "fehlt",
    });
  });

  it("v2: alles ok", async () => {
    mock.reset("v2");
    assert.deepEqual(await schema.readSchemaStatus(), {
      leadsV2: "ok",
      events: "ok",
      deletions: "ok",
    });
    // gekapselt in React cache(); außerhalb von React einfach durchgereicht
    assert.equal((await schema.checkSchema()).leadsV2, "ok");
  });

  it("Schlüssel falsch: 'unbekannt' statt „Update ausstehend“, mit erklärbarem Fehler", async () => {
    mock.reset("v2");
    process.env.SUPABASE_SERVICE_ROLE_KEY = "falsch";
    try {
      const s = await schema.readSchemaStatus();
      assert.equal(s.leadsV2, "unbekannt");
      assert.equal(s.events, "unbekannt");
      assert.equal(s.deletions, "unbekannt");
      assert.ok(s.error);
      assert.equal(explainDbError(s.error).kind, "auth");
    } finally {
      process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    }
  });

  it("ohne Konfiguration: 'unbekannt'", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      const s = await schema.readSchemaStatus();
      assert.equal(s.leadsV2, "unbekannt");
      assert.equal(s.error?.message, "Supabase ist nicht konfiguriert.");
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
  });

  it("fragt die drei Teile mit den geplanten Spalten ab", async () => {
    mock.reset("v2");
    await schema.readSchemaStatus();
    const urls = mock.requests.map((r) => r.url).sort();
    assert.deepEqual(urls, [
      "/rest/v1/lead_deletions?select=id&limit=1",
      "/rest/v1/lead_events?select=id&limit=1",
      "/rest/v1/leads?select=follow_up_on%2Coutcome%2Clost_reason&limit=1",
    ]);
  });
});

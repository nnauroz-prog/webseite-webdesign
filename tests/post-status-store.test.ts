import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { DbError } from "@/lib/admin/db-errors";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/post-status-store");

let mock: Mock;
let store: Store;

before(async () => {
  mock = await startMock({ mode: "v4" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  store = await import("@/lib/post-status-store");
});

after(async () => {
  await mock.close();
});

beforeEach(() => {
  mock.reset("v4");
});

const POST = {
  datum: "2026-11-16",
  platz: 0,
  format: "story" as const,
  text: "Heutiger Satz.",
};

describe("post_status", () => {
  it("abhaken legt eine Zeile an, zurücknehmen löscht sie", async () => {
    await store.setzePostStatus(POST, true);
    assert.equal(mock.tables.post_status.length, 1);
    assert.equal(mock.tables.post_status[0].text, "Heutiger Satz.");
    assert.ok(mock.tables.post_status[0].gepostet_at);

    // Beitrag desselben Posts ist ein eigener Eintrag.
    await store.setzePostStatus({ ...POST, format: "beitrag" }, true);
    assert.equal(mock.tables.post_status.length, 2);

    await store.setzePostStatus(POST, false);
    assert.deepEqual(
      mock.tables.post_status.map((r) => r.format),
      ["beitrag"],
    );
    // Zurücknehmen, was nicht da ist: kein Fehler.
    await store.setzePostStatus(POST, false);
    assert.equal(mock.tables.post_status.length, 1);
  });

  it("doppelt abhaken bleibt eine Zeile und frischt den Satz auf", async () => {
    await store.setzePostStatus({ ...POST, text: "Reserve-Satz." }, true);
    await store.setzePostStatus(POST, true);
    assert.equal(mock.tables.post_status.length, 1);
    assert.equal(mock.tables.post_status[0].text, "Heutiger Satz.");
  });

  it("listPostStatus: nur der Zeitraum, älteste zuerst, geprüft", async () => {
    mock.seedPostStatus({ ...POST, datum: "2026-11-01" });
    mock.seedPostStatus({ ...POST, datum: "2026-11-16", platz: 2 });
    mock.seedPostStatus({ ...POST, datum: "2026-11-10", format: "beitrag" });
    mock.seedPostStatus({ ...POST, datum: "2026-11-17" });
    const rows = await store.listPostStatus("2026-11-10", "2026-11-16");
    assert.deepEqual(
      rows?.map((r) => [r.datum, r.platz, r.format]),
      [
        ["2026-11-10", 0, "beitrag"],
        ["2026-11-16", 2, "story"],
      ],
    );
  });

  it("Tabelle prüft Platz und Format", async () => {
    await assert.rejects(
      store.setzePostStatus({ ...POST, platz: 3 }, true),
      (err: unknown) => err instanceof DbError && err.code === "23514",
    );
    await assert.rejects(
      store.setzePostStatus(
        { ...POST, format: "karte" as unknown as "story" },
        true,
      ),
      (err: unknown) => err instanceof DbError && err.code === "23514",
    );
  });

  it("ohne Tabelle (v3): Liste null, Abhaken wirft DbError mit Code", async () => {
    mock.reset("v3");
    assert.equal(await store.listPostStatus("2026-11-10", "2026-11-16"), null);
    await assert.rejects(
      store.setzePostStatus(POST, true),
      (err: unknown) => err instanceof DbError && err.code === "PGRST205",
    );
  });
});

import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { DbError } from "@/lib/admin/db-errors";
import { PROJEKT_ANGEBOT_COLUMNS } from "@/lib/admin/projekte";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/projekte-store");

let mock: Mock;
let store: Store;

before(async () => {
  mock = await startMock({ mode: "v4" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  store = await import("@/lib/projekte-store");
});

after(async () => {
  await mock.close();
});

beforeEach(() => {
  mock.reset("v4");
});

const angenommen = (partial: Record<string, unknown> = {}) =>
  mock.seedAngebot({
    status: "angenommen",
    accepted_at: "2026-11-10T09:00:00Z",
    angenommen_von: "Kunde",
    ...partial,
  }) as { id: string; lead_id: string };

describe("listAngenommeneAngebote", () => {
  it("nur angenommene, zuletzt angenommene zuerst, ohne Token und Texte", async () => {
    const alt = angenommen({ accepted_at: "2026-11-01T09:00:00Z" });
    const neu = angenommen({ accepted_at: "2026-11-12T09:00:00Z" });
    mock.seedAngebot({ status: "gesendet" });
    mock.seedAngebot({ status: "entwurf" });
    const list = await store.listAngenommeneAngebote();
    assert.deepEqual(
      list?.map((a) => a.id),
      [neu.id, alt.id],
    );
    const get = mock.requests.find((r) => r.method === "GET");
    assert.ok(get?.url.includes("status=eq.angenommen"));
    assert.ok(
      get?.url.includes(`select=${PROJEKT_ANGEBOT_COLUMNS.join("%2C")}`),
    );
    assert.ok(!get?.url.includes("token"));
  });

  it("ohne Tabelle angebote: null", async () => {
    mock.reset("v2");
    assert.equal(await store.listAngenommeneAngebote(), null);
  });
});

describe("Projekte (Modus v4)", () => {
  it("ohne Tabelle projekte (v3): Liste null, Schreiben wirft DbError mit Code", async () => {
    mock.reset("v3");
    assert.equal(await store.listProjekte(), null);
    const a = angenommen();
    await assert.rejects(
      store.setzeSchritt(a, "anzahlung", "2026-11-12"),
      (err: unknown) => err instanceof DbError && err.code === "PGRST205",
    );
  });

  it("die Zeile entsteht bei der ersten Änderung, danach wird dieselbe geändert", async () => {
    const a = angenommen();
    assert.equal(await store.getProjektByAngebot(a.id), null);

    const p1 = await store.setzeSchritt(a, "anzahlung", "2026-11-12");
    assert.equal(mock.tables.projekte.length, 1);
    assert.equal(p1.angebot_id, a.id);
    assert.equal(p1.lead_id, a.lead_id);
    assert.deepEqual(p1.schritte, { anzahlung: "2026-11-12" });
    assert.equal(p1.livegang_am, null);

    const p2 = await store.setzeSchritt(a, "inhalte", "2026-11-14");
    assert.equal(mock.tables.projekte.length, 1);
    assert.equal(p2.id, p1.id);
    assert.deepEqual(p2.schritte, {
      anzahlung: "2026-11-12",
      inhalte: "2026-11-14",
    });
    // updated_at wie der Trigger bei jeder Änderung
    assert.ok(p2.updated_at > p1.updated_at);

    // Erste Änderung: nachsehen, dann anlegen (kein Upsert).
    const methods = mock.requests
      .filter((r) => r.url.startsWith("/rest/v1/projekte"))
      .map((r) => r.method);
    assert.deepEqual(methods, ["GET", "GET", "POST", "GET", "PATCH"]);
  });

  it("Livegang setzt livegang_am, Öffnen leert es wieder", async () => {
    const a = angenommen();
    const p = await store.setzeSchritt(a, "livegang", "2026-11-16");
    assert.equal(p.livegang_am, "2026-11-16");
    assert.deepEqual(p.schritte, { livegang: "2026-11-16" });
    const q = await store.setzeSchritt(a, "livegang", null);
    assert.equal(q.livegang_am, null);
    assert.deepEqual(q.schritte, {});
  });

  it("aendereProjekt: Notiz und Pflege, ohne die Schritte zu verlieren", async () => {
    const a = angenommen();
    await store.setzeSchritt(a, "anzahlung", "2026-11-12");
    await store.aendereProjekt(a, () => ({ notiz: "Fotos kommen Freitag" }));
    const p = await store.aendereProjekt(a, () => ({
      pflege_seit: "2026-11-16",
      pflege_bis: "2027-05-31",
    }));
    assert.equal(p.notiz, "Fotos kommen Freitag");
    assert.equal(p.pflege_seit, "2026-11-16");
    assert.equal(p.pflege_bis, "2027-05-31");
    assert.deepEqual(p.schritte, { anzahlung: "2026-11-12" });
  });

  it("je Angebot höchstens ein Projekt (angebot_id eindeutig)", async () => {
    const a = angenommen();
    await store.setzeSchritt(a, "anzahlung", "2026-11-12");
    const res = await fetch(`${mock.url}/rest/v1/projekte`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        angebot_id: a.id,
        lead_id: a.lead_id,
        schritte: {},
      }),
    });
    assert.equal(res.status, 409);
    assert.equal(((await res.json()) as { code: string }).code, "23505");
    assert.equal(mock.tables.projekte.length, 1);
  });

  it("gleichzeitig angelegt (23505): ändert die vorhandene Zeile", async () => {
    const a = angenommen();
    // Ein anderer Tab legt die Zeile an, nachdem dieser nachgesehen hat:
    // nachgestellt, indem die Zeile direkt vor dem Einfügen entsteht.
    const original = globalThis.fetch;
    let eingeschoben = false;
    globalThis.fetch = (async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      if (
        !eingeschoben &&
        init?.method === "POST" &&
        String(input).includes("/rest/v1/projekte")
      ) {
        eingeschoben = true;
        mock.seedProjekt({
          angebot_id: a.id,
          schritte: { anzahlung: "2026-11-11" },
        });
      }
      return original(input, init);
    }) as typeof fetch;
    try {
      const p = await store.setzeSchritt(a, "inhalte", "2026-11-14");
      assert.equal(mock.tables.projekte.length, 1);
      assert.deepEqual(p.schritte, {
        anzahlung: "2026-11-11",
        inhalte: "2026-11-14",
      });
    } finally {
      globalThis.fetch = original;
    }
  });

  it("Prüfungen der Tabelle: Pflege-Ende nicht vor dem Beginn, Notiz begrenzt", async () => {
    const a = angenommen();
    await assert.rejects(
      store.aendereProjekt(a, () => ({
        pflege_seit: "2026-11-16",
        pflege_bis: "2026-11-01",
      })),
      (err: unknown) => err instanceof DbError && err.code === "23514",
    );
    await assert.rejects(
      store.aendereProjekt(a, () => ({ notiz: "x".repeat(2001) })),
      (err: unknown) => err instanceof DbError && err.code === "23514",
    );
  });

  it("verschwindet mit dem Angebot und mit der Anfrage (on delete cascade)", async () => {
    const a = angenommen();
    const b = angenommen();
    await store.setzeSchritt(a, "anzahlung", "2026-11-12");
    await store.setzeSchritt(b, "anzahlung", "2026-11-12");
    assert.equal(mock.tables.projekte.length, 2);

    await fetch(`${mock.url}/rest/v1/angebote?id=eq.${a.id}`, {
      method: "DELETE",
      headers: { apikey: SERVICE_KEY },
    });
    assert.deepEqual(
      mock.tables.projekte.map((p) => p.angebot_id),
      [b.id],
    );
    await fetch(`${mock.url}/rest/v1/leads?id=eq.${b.lead_id}`, {
      method: "DELETE",
      headers: { apikey: SERVICE_KEY },
    });
    assert.equal(mock.tables.projekte.length, 0);
    assert.equal(mock.tables.angebote.length, 0);
  });

  it("listProjekte liefert alle Projekte, geprüft", async () => {
    const a = angenommen();
    mock.seedProjekt({
      angebot_id: a.id,
      schritte: { anzahlung: "2026-11-12", unbekannt: "2026-11-12" },
    });
    const list = await store.listProjekte();
    assert.equal(list?.length, 1);
    assert.deepEqual(list?.[0].schritte, { anzahlung: "2026-11-12" });
  });

  it("getProjektAngebot: Angebot mit Projekt-Feldern oder null", async () => {
    const a = angenommen();
    const got = await store.getProjektAngebot(a.id);
    assert.equal(got?.status, "angenommen");
    assert.equal(got?.positionen.length, 1);
    assert.equal(
      await store.getProjektAngebot("00000000-0000-4000-8000-000000000000"),
      null,
    );
  });
});

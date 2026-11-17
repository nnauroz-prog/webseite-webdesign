import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import type { StorySerie } from "@/lib/story-serie";

import { DbError } from "@/lib/admin/db-errors";
import {
  ANDERE_SERIE,
  GUTE_SERIE,
  SCHLECHTE_SERIE,
} from "@/tests/redaktion-attrappe";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/serien-store");

let mock: Mock;
let store: Store;

before(async () => {
  mock = await startMock({ mode: "v5" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  store = await import("@/lib/serien-store");
});

after(async () => {
  await mock.close();
});

beforeEach(() => {
  mock.reset("v5");
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("serien: speichern und lesen", () => {
  it("saveSerie legt eine Zeile an und gibt die Kennung zurück", async () => {
    const id = await store.saveSerie({
      datum: "2026-11-27",
      auftrag: "Story-Serie zu Black Friday",
      serie: GUTE_SERIE,
    });
    assert.match(id ?? "", UUID);
    assert.equal(mock.tables.serien.length, 1);
    const zeile = mock.tables.serien[0];
    assert.equal(zeile.id, id);
    assert.equal(zeile.datum, "2026-11-27");
    assert.equal(zeile.auftrag, "Story-Serie zu Black Friday");
    assert.deepEqual(zeile.serie, GUTE_SERIE);
    assert.equal(zeile.gepostet_at, null);
    assert.ok(zeile.created_at);
    // Gesendet werden nur diese drei Spalten; den Rest setzt die Datenbank.
    const post = mock.requests.find((r) => r.method === "POST");
    assert.deepEqual(
      Object.keys(post?.body as Record<string, unknown>).sort(),
      ["auftrag", "datum", "serie"],
    );
  });

  it("saveSerie speichert nur die bekannten Felder der Serie", async () => {
    const mitMehr = {
      ...GUTE_SERIE,
      quelle: "https://example.org/x",
      geheim: "weg",
    } as StorySerie;
    await store.saveSerie({ datum: "2026-11-27", auftrag: "", serie: mitMehr });
    assert.deepEqual(mock.tables.serien[0].serie, GUTE_SERIE);
    assert.equal(mock.tables.serien[0].auftrag, "");
  });

  it("saveSerie weist ab, was die Regeln verletzt, bevor etwas gesendet wird", async () => {
    for (const eintrag of [
      {
        datum: "2026-11-27",
        auftrag: "",
        serie: SCHLECHTE_SERIE as unknown as StorySerie,
      },
      { datum: "2026-02-30", auftrag: "", serie: GUTE_SERIE },
      { datum: "27.11.2026", auftrag: "", serie: GUTE_SERIE },
      { datum: "2026-11-27", auftrag: "x".repeat(501), serie: GUTE_SERIE },
    ]) {
      await assert.rejects(
        store.saveSerie(eintrag),
        (err: unknown) =>
          err instanceof DbError && /ungültig/.test(err.message),
      );
    }
    assert.equal(mock.requests.length, 0);
    assert.equal(mock.tables.serien.length, 0);
  });

  it("listSerien: neueste zuerst, begrenzt, mit allen Feldern", async () => {
    const a = await store.saveSerie({
      datum: "2026-11-27",
      auftrag: "erste",
      serie: GUTE_SERIE,
    });
    const b = await store.saveSerie({
      datum: "2026-11-18",
      auftrag: "zweite",
      serie: ANDERE_SERIE,
    });
    const alle = await store.listSerien();
    assert.deepEqual(
      alle?.map((z) => [z.id, z.auftrag, z.datum]),
      [
        [b, "zweite", "2026-11-18"],
        [a, "erste", "2026-11-27"],
      ],
    );
    assert.deepEqual(alle?.[0].serie, ANDERE_SERIE);
    assert.equal(alle?.[0].gepostet_at, null);
    assert.ok(!Number.isNaN(Date.parse(alle?.[0].created_at ?? "")));
    assert.deepEqual(
      (await store.listSerien(1))?.map((z) => z.id),
      [b],
    );
    const get = mock.requests.filter((r) => r.method === "GET").at(-1);
    assert.equal(
      get?.url,
      `/rest/v1/serien?select=${store.SERIEN_COLUMNS.join("%2C")}&order=created_at.desc&limit=1`,
    );
    // Unsinnige Grenzen werden eingefangen.
    assert.equal((await store.listSerien(0))?.length, 1);
    assert.equal((await store.listSerien(-5))?.length, 1);
    assert.equal((await store.listSerien(100000))?.length, 2);
  });

  it("listSerien überspringt Zeilen, die die Regeln verletzen oder kaputt sind", async () => {
    const gut = mock.seedSerie({ datum: "2026-11-27", serie: GUTE_SERIE });
    mock.seedSerie({ datum: "2026-11-27", serie: SCHLECHTE_SERIE });
    mock.seedSerie({ datum: "2026-11-27", serie: { titel: "Ohne Bilder" } });
    mock.seedSerie({ datum: "kein Tag", serie: ANDERE_SERIE });
    mock.seedSerie({
      id: "keine-uuid",
      datum: "2026-11-27",
      serie: ANDERE_SERIE,
    });
    mock.seedSerie({
      datum: "2026-11-27",
      serie: ANDERE_SERIE,
      gepostet_at: "irgendwann",
    });
    mock.seedSerie({ datum: "2026-11-27", serie: ANDERE_SERIE, auftrag: null });
    const alle = await store.listSerien();
    assert.deepEqual(
      alle?.map((z) => z.id),
      [gut.id],
    );
  });

  it("serieAusZeile: prüft jedes Feld", () => {
    const zeile = {
      id: "11111111-1111-4111-8111-111111111111",
      created_at: "2026-11-17T09:00:00.123456+00:00",
      datum: "2026-11-27",
      auftrag: "Black Friday",
      serie: GUTE_SERIE,
      gepostet_at: null,
    };
    assert.deepEqual(store.serieAusZeile(zeile), zeile);
    assert.deepEqual(
      store.serieAusZeile({
        ...zeile,
        gepostet_at: "2026-11-27T08:00:00+00:00",
        fremd: 1,
      }),
      { ...zeile, gepostet_at: "2026-11-27T08:00:00+00:00" },
    );
    for (const kaputt of [
      null,
      "zeile",
      { ...zeile, id: 5 },
      { ...zeile, created_at: "gestern" },
      { ...zeile, datum: "2026-13-01" },
      { ...zeile, auftrag: undefined },
      { ...zeile, serie: null },
      { ...zeile, gepostet_at: 5 },
    ])
      assert.equal(store.serieAusZeile(kaputt), null);
  });
});

describe("serien: abhaken und löschen", () => {
  it("setSerieGepostet setzt und löscht den Zeitpunkt", async () => {
    const id = await store.saveSerie({
      datum: "2026-11-27",
      auftrag: "",
      serie: GUTE_SERIE,
    });
    assert.ok(id);
    assert.equal(await store.setSerieGepostet(id, true), true);
    const gepostet = mock.tables.serien[0].gepostet_at;
    assert.ok(!Number.isNaN(Date.parse(gepostet)));
    assert.equal((await store.listSerien())?.[0].gepostet_at, gepostet);
    // Noch einmal abhaken bleibt abgehakt.
    assert.equal(await store.setSerieGepostet(id, true), true);
    assert.equal(await store.setSerieGepostet(id, false), true);
    assert.equal(mock.tables.serien[0].gepostet_at, null);
    // Die Serie selbst bleibt unberührt.
    assert.deepEqual(mock.tables.serien[0].serie, GUTE_SERIE);
    const patch = mock.requests.filter((r) => r.method === "PATCH").at(-1);
    assert.deepEqual(Object.keys(patch?.body as object), ["gepostet_at"]);
  });

  it("setSerieGepostet und deleteSerie: false, wenn es die Serie nicht gibt", async () => {
    const fremd = "22222222-2222-4222-8222-222222222222";
    assert.equal(await store.setSerieGepostet(fremd, true), false);
    assert.equal(await store.deleteSerie(fremd), false);
  });

  it("deleteSerie löscht genau eine Serie", async () => {
    const a = await store.saveSerie({
      datum: "2026-11-27",
      auftrag: "a",
      serie: GUTE_SERIE,
    });
    const b = await store.saveSerie({
      datum: "2026-11-27",
      auftrag: "b",
      serie: ANDERE_SERIE,
    });
    assert.ok(a && b);
    assert.equal(await store.deleteSerie(a), true);
    assert.deepEqual(
      mock.tables.serien.map((z) => z.id),
      [b],
    );
    assert.equal(await store.deleteSerie(a), false);
    const del = mock.requests.filter((r) => r.method === "DELETE").at(-1);
    assert.equal(del?.url, `/rest/v1/serien?id=eq.${a}&select=id`);
  });
});

describe("serien: zählen für das Tageslimit", () => {
  it("countSerienAm zählt nach Kalendertag in Hamburg, nicht nach UTC", async () => {
    const serie = GUTE_SERIE;
    // 16.11., 23:59:59 Uhr in Hamburg (Winterzeit: UTC+1).
    mock.seedSerie({
      datum: "2026-11-16",
      serie,
      created_at: "2026-11-16T22:59:59.000Z",
    });
    // 17.11., 00:00:00 Uhr und 23:59:59 Uhr in Hamburg.
    mock.seedSerie({
      datum: "2026-11-17",
      serie,
      created_at: "2026-11-16T23:00:00.000Z",
    });
    mock.seedSerie({
      datum: "2026-11-27",
      serie,
      created_at: "2026-11-17T12:00:00.000Z",
    });
    mock.seedSerie({
      datum: "2026-11-17",
      serie,
      created_at: "2026-11-17T22:59:59.999Z",
    });
    // 18.11., 00:00:00 Uhr in Hamburg.
    mock.seedSerie({
      datum: "2026-11-18",
      serie,
      created_at: "2026-11-17T23:00:00.000Z",
    });
    assert.equal(await store.countSerienAm("2026-11-16"), 1);
    assert.equal(await store.countSerienAm("2026-11-17"), 3);
    assert.equal(await store.countSerienAm("2026-11-18"), 1);
    assert.equal(await store.countSerienAm("2026-11-19"), 0);
    const get = mock.requests.filter((r) => r.method === "GET").at(-3);
    assert.equal(
      get?.url,
      "/rest/v1/serien?select=id&created_at=gte.2026-11-16T23%3A00%3A00.000Z&created_at=lt.2026-11-17T23%3A00%3A00.000Z&limit=1001",
    );
  });

  it("countSerienAm im Sommer: Mitternacht in Hamburg ist 22 Uhr UTC", async () => {
    const serie = GUTE_SERIE;
    mock.seedSerie({
      datum: "2026-07-01",
      serie,
      created_at: "2026-06-30T21:59:59.000Z",
    });
    mock.seedSerie({
      datum: "2026-07-01",
      serie,
      created_at: "2026-06-30T22:00:00.000Z",
    });
    assert.equal(await store.countSerienAm("2026-06-30"), 1);
    assert.equal(await store.countSerienAm("2026-07-01"), 1);
  });

  it("countSerienAm zählt auch Zeilen, die beim Lesen übersprungen würden", async () => {
    mock.seedSerie({
      datum: "2026-11-17",
      serie: SCHLECHTE_SERIE,
      created_at: "2026-11-17T12:00:00.000Z",
    });
    assert.equal(await store.countSerienAm("2026-11-17"), 1);
    assert.deepEqual(await store.listSerien(), []);
  });

  it("countSerienAm: null bei unsinnigem Tag, ohne Anfrage", async () => {
    assert.equal(await store.countSerienAm("heute"), null);
    assert.equal(await store.countSerienAm("2026-02-30"), null);
    assert.equal(mock.requests.length, 0);
  });
});

describe("serien: ohne Tabelle, ohne Datenbank, mit Fehlern", () => {
  it("ohne Tabelle (v4, Stand vor dem Datenbank-Update): null statt Fehler", async () => {
    mock.reset("v4");
    assert.equal(await store.listSerien(), null);
    assert.equal(await store.countSerienAm("2026-11-17"), null);
    assert.equal(
      await store.saveSerie({
        datum: "2026-11-27",
        auftrag: "",
        serie: GUTE_SERIE,
      }),
      null,
    );
    const id = "11111111-1111-4111-8111-111111111111";
    await assert.rejects(
      store.setSerieGepostet(id, true),
      (err: unknown) => err instanceof DbError && err.code === "PGRST205",
    );
    await assert.rejects(
      store.deleteSerie(id),
      (err: unknown) => err instanceof DbError && err.code === "PGRST205",
    );
  });

  it("Schlüssel falsch: DbError statt null (kein stilles Verschlucken)", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "falsch";
    try {
      await assert.rejects(store.listSerien(), DbError);
      await assert.rejects(store.countSerienAm("2026-11-17"), DbError);
      await assert.rejects(
        store.saveSerie({
          datum: "2026-11-27",
          auftrag: "",
          serie: GUTE_SERIE,
        }),
        DbError,
      );
    } finally {
      process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    }
  });

  it("Tabelle prüft Auftragslänge und Form der Serie", async () => {
    // An saveSerie vorbei (direkt über die API der Attrappe) greifen die
    // Checks der Tabelle.
    const antwort = await fetch(`${mock.url}/rest/v1/serien`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        datum: "2026-11-27",
        auftrag: "x".repeat(501),
        serie: GUTE_SERIE,
      }),
    });
    assert.equal(antwort.status, 400);
    assert.match(await antwort.text(), /serien_auftrag_check/);
    const liste = await fetch(`${mock.url}/rest/v1/serien`, {
      method: "POST",
      headers: { apikey: SERVICE_KEY, "content-type": "application/json" },
      body: JSON.stringify({ datum: "2026-11-27", serie: [1, 2] }),
    });
    assert.match(await liste.text(), /serien_serie_check/);
  });

  it("ohne Konfiguration: lesen, zählen und speichern geben null, ändern wirft", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      assert.equal(await store.listSerien(), null);
      assert.equal(await store.countSerienAm("2026-11-17"), null);
      assert.equal(
        await store.saveSerie({
          datum: "2026-11-27",
          auftrag: "",
          serie: GUTE_SERIE,
        }),
        null,
      );
      await assert.rejects(
        store.deleteSerie("11111111-1111-4111-8111-111111111111"),
        DbError,
      );
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
  });
});

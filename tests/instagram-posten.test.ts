/**
 * Posten auf Instagram von Anfang bis Ende (lib/instagram/posten.ts): mit
 * der Supabase-Attrappe (Speicher, Tabellen) und der Attrappe der Graph
 * API (tests/instagram-attrappe.ts). Die Bilder gehen wie im Browser mit
 * dem Token des Upload-Platzes in den Speicher; die Graph-Attrappe lädt
 * sie über die signierten Adressen, wie Instagram es tut.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import ts from "typescript";

import type { PostAuftrag, PostEreignis } from "@/lib/instagram/vertrag";

import { ndjsonAntwortAus } from "@/lib/ndjson-strom";
import {
  INSTAGRAM_BUCKET,
  INSTAGRAM_INHALTSTYP,
  INSTAGRAM_POSTEN_PFAD,
  POST_SCHRITTE,
} from "@/lib/instagram/vertrag";
import { postsFuer } from "@/lib/sprueche-aktuell";
import {
  graphFehler,
  type GraphAttrappe,
  JPEG,
  KONTO_ID,
  NUTZERNAME,
  sammler,
  startGraph,
  TOKEN,
} from "@/tests/instagram-attrappe";
import { GUTE_SERIE } from "@/tests/redaktion-attrappe";
import { ANON_KEY, SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Posten = typeof import("@/lib/instagram/posten");
type Bilder = typeof import("@/lib/instagram/bilder");

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

// Mittwoch, 18. November 2026, 11:00 Uhr in Hamburg.
const JETZT = new Date("2026-11-18T10:00:00Z");
const HEUTE = "2026-11-18";
const SERIE_HEUTE = { typ: "serie", datum: HEUTE, id: null } as const;

let mock: Mock;
let g: GraphAttrappe;
let posten: Posten;
let bilder: Bilder;
let logs: unknown[][] = [];
const echtesLog = console.error;

before(async () => {
  mock = await startMock({ mode: "v6" });
  g = await startGraph();
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  posten = await import("@/lib/instagram/posten");
  bilder = await import("@/lib/instagram/bilder");
});

after(async () => {
  await mock.close();
  await g.close();
});

beforeEach(() => {
  mock.reset("v6");
  g.reset();
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  // Kein echter Schlüssel: nur ein Wert, den die Attrappe erwartet.
  process.env.INSTAGRAM_TOKEN = TOKEN;
  process.env.INSTAGRAM_GRAPH_URL = g.url;
  process.env.INSTAGRAM_KONTO_ID = KONTO_ID;
  delete process.env.INSTAGRAM_API_VERSION;
  logs = [];
  console.error = (...args: unknown[]) => {
    logs.push(args);
  };
});

afterEach(() => {
  console.error = echtesLog;
});

/** Lädt n Bilder wie der Browser hoch (anon-Schlüssel, Token je Platz). */
async function hochladen(n: number): Promise<string[]> {
  const plaetze = await bilder.erzeugePlaetze(n, JETZT);
  const browser = createClient(mock.url, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  for (const p of plaetze) {
    const { error } = await browser.storage
      .from(INSTAGRAM_BUCKET)
      .uploadToSignedUrl(p.pfad, p.token, JPEG, { contentType: "image/jpeg" });
    assert.equal(error, null);
  }
  return plaetze.map((p) => p.pfad);
}

async function poste(
  roh: unknown,
  mehr: Parameters<Posten["posteAuftrag"]>[2] = {},
) {
  const s = sammler();
  await posten.posteAuftrag(roh, s.sende, {
    jetzt: JETZT,
    pollMs: 1,
    wiederholMs: 1,
    ...mehr,
  });
  return s;
}

const SCHRITTE_VOR = [
  "pruefen:laeuft",
  "pruefen:fertig",
  "vorbereiten:laeuft",
  "vorbereiten:fertig",
];

function storyFolge(von: number): string[] {
  const out = [...SCHRITTE_VOR];
  for (let nr = 1; nr <= von; nr++)
    out.push(
      `veroeffentlichen:laeuft:${nr}/${von}`,
      `veroeffentlichen:fertig:${nr}/${von}`,
    );
  return [...out, "fertig"];
}

const BEITRAG_FOLGE = [
  ...SCHRITTE_VOR,
  "veroeffentlichen:laeuft",
  "veroeffentlichen:fertig",
  "fertig",
];

/** Der Schlüssel steht nur im Authorization-Header, nie in Adresse oder Körper. */
function schluesselNurImHeader() {
  assert.ok(g.anfragen.length > 0);
  for (const a of g.anfragen) {
    assert.equal(a.auth, `Bearer ${TOKEN}`);
    assert.ok(!a.url.includes(TOKEN), a.url);
    assert.ok(!JSON.stringify(a.body ?? {}).includes(TOKEN));
    if (a.methode === "POST") assert.equal(a.inhaltstyp, "application/json");
  }
}

/** Nichts in den Logs nennt Schlüssel, Adressen oder Bildpfade. */
function logsSauber() {
  const text = JSON.stringify(logs);
  assert.ok(!text.includes(TOKEN));
  assert.ok(!/https?:\/\//.test(text), text);
  assert.ok(!text.includes("token="), text);
  assert.ok(!text.includes(HEUTE), text);
}

const letzte = (s: ReturnType<typeof sammler>) => {
  const e = s.letzte;
  assert.ok(e);
  return e;
};

describe("Story-Serie als Stories", () => {
  it("vier Stories: Schritte in Reihenfolge, je Story ein Container und eine Veröffentlichung, Links, Bilder gelöscht", async () => {
    const pfade = await hochladen(4);
    assert.equal(mock.objects.size, 4);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "Wird bei Stories nicht gesendet #story",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), storyFolge(4));
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.equal(fertig.konto, NUTZERNAME);
    assert.equal(fertig.hinweis, undefined);
    assert.equal(fertig.links.length, 4);
    for (const link of fertig.links)
      assert.match(link, /^https:\/\/www\.instagram\.com\/stories\//);

    // Container in der Reihenfolge der Bilder, ohne Bildunterschrift.
    const container = g.an(`${KONTO_ID}/media`, "POST");
    assert.equal(container.length, 4);
    container.forEach((a, i) => {
      assert.deepEqual(Object.keys(a.body ?? {}).sort(), [
        "image_url",
        "media_type",
      ]);
      assert.equal(a.body?.media_type, "STORIES");
      assert.ok(String(a.body?.image_url).includes(pfade[i]));
    });
    // Je Story eine Veröffentlichung, in derselben Reihenfolge.
    const ids = [...g.container.keys()];
    assert.deepEqual(
      g.an(`${KONTO_ID}/media_publish`, "POST").map((a) => a.body),
      ids.map((id) => ({ creation_id: id })),
    );
    // Alle Container waren fertig, bevor die erste Story online ging.
    const erstePub = g.anfragen.findIndex((a) =>
      a.pfad.endsWith("media_publish"),
    );
    const letzterContainer = g.anfragen.findLastIndex(
      (a) => a.pfad === `${KONTO_ID}/media`,
    );
    assert.ok(letzterContainer < erstePub);

    // Bilder sind wieder aus dem Speicher; der Verlauf hält den Post fest.
    assert.equal(mock.objects.size, 0);
    assert.equal(mock.tables.instagram_posts.length, 1);
    const zeile = mock.tables.instagram_posts[0];
    assert.equal(zeile.art, "story");
    assert.equal(zeile.bilder, 4);
    assert.deepEqual(zeile.quelle, SERIE_HEUTE);
    assert.equal(zeile.media_ids.length, 4);
    assert.deepEqual(zeile.links, fertig.links);
    schluesselNurImHeader();
    assert.deepEqual(logs, []);
  });

  it("Stories ohne Link bei Instagram: fertig mit leerer Liste", async () => {
    g.stelle({ storyLinks: false });
    const pfade = await hochladen(3);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), storyFolge(3));
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.deepEqual(fertig.links, []);
  });

  it("eine einzelne Story meldet die Schritte ohne nr/von", async () => {
    const pfade = await hochladen(1);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: { typ: "post", datum: HEUTE, platz: 0 },
    });
    assert.deepEqual(s.folge(), BEITRAG_FOLGE);
    for (const e of s.ereignisse)
      if (e.typ === "schritt") assert.equal(e.nr, undefined);
  });
});

describe("Beitrag", () => {
  it("ein Bild: einzelner Beitrag mit Bildunterschrift und Link", async () => {
    const pfade = await hochladen(1);
    const caption = "Ein Satz für den Feed.\n\n#webdesign #hamburg";
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption,
      quelle: { typ: "post", datum: HEUTE, platz: 1 },
    });
    assert.deepEqual(s.folge(), BEITRAG_FOLGE);
    const container = g.an(`${KONTO_ID}/media`, "POST");
    assert.equal(container.length, 1);
    assert.deepEqual(Object.keys(container[0].body ?? {}).sort(), [
      "caption",
      "image_url",
    ]);
    assert.equal(container[0].body?.caption, caption);
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.equal(fertig.links.length, 1);
    assert.match(fertig.links[0], /^https:\/\/www\.instagram\.com\/p\//);
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 1);
    schluesselNurImHeader();
  });

  it("drei Bilder: Karussell aus drei Bildern und einem Rahmen mit Bildunterschrift", async () => {
    const pfade = await hochladen(3);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "Drei Bilder, eine Geschichte.",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), BEITRAG_FOLGE);
    const container = g.an(`${KONTO_ID}/media`, "POST");
    assert.equal(container.length, 4);
    const kinder = container.slice(0, 3);
    kinder.forEach((a, i) => {
      assert.deepEqual(a.body, {
        image_url: a.body?.image_url,
        is_carousel_item: true,
      });
      assert.ok(String(a.body?.image_url).includes(pfade[i]));
    });
    const ids = [...g.container.keys()];
    assert.deepEqual(container[3].body, {
      media_type: "CAROUSEL",
      children: ids.slice(0, 3).join(","),
      caption: "Drei Bilder, eine Geschichte.",
    });
    // Nur der Rahmen wird veröffentlicht.
    assert.deepEqual(
      g.an(`${KONTO_ID}/media_publish`).map((a) => a.body),
      [{ creation_id: ids[3] }],
    );
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.equal(fertig.links.length, 1);
    assert.equal(mock.tables.instagram_posts[0].bilder, 3);
    assert.equal(mock.tables.instagram_posts[0].media_ids.length, 1);
  });

  it("lässt Instagram die Bildunterschrift weg (config_issue), steht es im Hinweis", async () => {
    g.stelle({ configIssue: "CAPTION_NOT_ATTACHED" });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "Text",
      quelle: SERIE_HEUTE,
    });
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.match(fertig.hinweis ?? "", /ohne Bildunterschrift/);
    assert.doesNotMatch(fertig.hinweis ?? "", /\b(Sie|Ihre?n?)\b/);
  });
});

describe("Warten auf die Container", () => {
  it("IN_PROGRESS, dann FINISHED: fragt nach, bis der Container fertig ist", async () => {
    g.stelle({ folge: () => ["IN_PROGRESS", "IN_PROGRESS", "FINISHED"] });
    const pfade = await hochladen(2);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), storyFolge(2));
    for (const id of g.container.keys()) {
      const fragen = g.an(id, "GET");
      assert.equal(fragen.length, 3, id);
      assert.equal(fragen[0].query.fields, "status_code,status");
    }
  });

  it("bleibt ein Container in Arbeit, gibt der Server nach der Wartezeit auf (nichts veröffentlicht)", async () => {
    g.stelle({ folge: () => ["IN_PROGRESS"] });
    const pfade = await hochladen(2);
    const s = await poste(
      { art: "story", bilder: pfade, caption: "", quelle: SERIE_HEUTE },
      { pollMs: 1, pollMaxMs: 3 },
    );
    assert.deepEqual(s.folge(), [
      "pruefen:laeuft",
      "pruefen:fertig",
      "vorbereiten:laeuft",
      "fehler:instagram",
    ]);
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.teil, undefined);
    assert.match(fehler.text, /zu lange/);
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 0);
    assert.equal(mock.objects.size, 0);
  });

  it("ERROR: Fehler „bild“, nichts veröffentlicht, Bilder gelöscht", async () => {
    g.stelle({
      folge: (p) =>
        String(p.image_url).includes("-2.jpg") ? ["ERROR"] : ["FINISHED"],
    });
    const pfade = await hochladen(3);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fehler:bild");
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 0);
    // Nach dem kaputten zweiten Bild kommt kein drittes Container mehr.
    assert.equal(g.an(`${KONTO_ID}/media`).length, 2);
    assert.equal(mock.objects.size, 0);
    assert.equal(mock.tables.instagram_posts.length, 0);
    logsSauber();
  });

  it("EXPIRED: Fehler „instagram“ mit eigenem Satz", async () => {
    g.stelle({ folge: () => ["EXPIRED"] });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "instagram");
    assert.match(fehler.text, /verworfen/);
  });
});

describe("Fehler von Instagram im Ablauf", () => {
  it("Code 190: Zugang, genau ein Aufruf (nie wiederholt, auch nicht als „transient“)", async () => {
    g.regel({
      wenn: () => true,
      antwort: graphFehler(190, 463, { is_transient: true }, 401),
    });
    const pfade = await hochladen(2);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), ["pruefen:laeuft", "fehler:zugang"]);
    assert.equal(g.anfragen.length, 1);
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.match(fehler.text, /Zugangsschlüssel/);
    assert.equal(mock.objects.size, 0);
    // Geloggt: nur Codes und fbtrace.
    assert.equal(logs.length, 1);
    assert.deepEqual(logs[0][1], {
      wo: "posten",
      code: "zugang",
      graph: 190,
      subcode: 463,
      fbtrace: "TRACE190",
      schritt: "pruefen",
    });
    logsSauber();
  });

  it("kurzfristiger Fehler (2207001) beim Anlegen: einmal wiederholt, dann geht es weiter", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media`,
      antwort: graphFehler(-1, 2207001),
      mal: 1,
    });
    const pfade = await hochladen(2);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), storyFolge(2));
    assert.equal(g.an(`${KONTO_ID}/media`).length, 3);
  });

  it("zweimal kurzfristig (is_transient): nach einer Wiederholung ist Schluss", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media`,
      antwort: graphFehler(2, undefined, { is_transient: true }, 500),
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fehler:instagram");
    assert.equal(g.an(`${KONTO_ID}/media`).length, 2);
  });

  it("abgerissenes Netz beim Lesen des Kontos: einmal wiederholt", async () => {
    g.regel({ wenn: (a) => a.pfad === KONTO_ID, antwort: "netz", mal: 1 });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fertig");
    assert.equal(g.an(KONTO_ID).length, 2);
  });

  it("Tageslimit beim Anlegen (9/2207042): „limit“ mit eigenem Satz, nicht wiederholt", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media`,
      antwort: graphFehler(9, 2207042),
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "limit");
    assert.match(fehler.text, /Morgen geht es weiter/);
    assert.equal(g.an(`${KONTO_ID}/media`).length, 1);
  });

  it("Bild nicht ladbar: „bild“, und die Meldung von Instagram samt Adresse kommt nirgends an", async () => {
    const pfade = await hochladen(2);
    // Das zweite Bild verschwindet vor dem Posten: Instagram kann es nicht laden.
    g.beiJederAnfrage((a) => {
      if (
        a.pfad === `${KONTO_ID}/media` &&
        g.an(`${KONTO_ID}/media`).length === 2
      )
        mock.objects.delete(`${INSTAGRAM_BUCKET}/${pfade[1]}`);
    });
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "bild");
    assert.ok(!JSON.stringify(s.ereignisse).includes("http"));
    assert.ok(!JSON.stringify(s.ereignisse).includes("token"));
    assert.deepEqual(logs[0][1], {
      wo: "posten",
      code: "bild",
      graph: 9004,
      subcode: 2207052,
      fbtrace: "TRACE9004",
      schritt: "vorbereiten",
    });
    logsSauber();
  });

  it("Veröffentlichen meldet einen Fehler, ist aber online: Erfolg mit Hinweis, kein zweites Mal", async () => {
    g.regel({
      wenn: (a) => {
        if (a.pfad !== `${KONTO_ID}/media_publish`) return false;
        const c = g.container.get(String(a.body?.creation_id));
        if (c) {
          c.veroeffentlicht = true;
          c.folge = ["PUBLISHED"];
        }
        return true;
      },
      antwort: graphFehler(4, 2207051),
      mal: 1,
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: { typ: "post", datum: HEUTE, platz: 2 },
    });
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.match(fertig.hinweis ?? "", /aber online/);
    assert.deepEqual(fertig.links, []);
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 1);
    // Trotzdem abgehakt.
    assert.equal(mock.tables.post_status.length, 1);
  });

  it("Veröffentlichen kurzfristig gescheitert, Container noch nicht online: einmal wiederholt", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media_publish`,
      antwort: graphFehler(-1, 2207001),
      mal: 1,
    });
    const pfade = await hochladen(2);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), storyFolge(2));
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 3);
    assert.equal(g.medien.size, 2);
  });

  it("Netz reißt beim Veröffentlichen: erst nachsehen, dann einmal wiederholen", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media_publish`,
      antwort: "netz",
      mal: 1,
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fertig");
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 2);
    assert.equal(g.medien.size, 1);
  });

  it("Konto eingeschränkt beim Veröffentlichen (25/2207050): „konto“, nicht wiederholt", async () => {
    g.regel({
      wenn: (a) => a.pfad === `${KONTO_ID}/media_publish`,
      antwort: graphFehler(25, 2207050),
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fehler:konto");
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 1);
    assert.equal(mock.tables.instagram_posts.length, 0);
  });

  it("Fehler nach zwei veröffentlichten Stories: Fehlerzeile nennt sie in teil", async () => {
    g.regel({
      wenn: (a) =>
        a.pfad === `${KONTO_ID}/media_publish` &&
        g.an(`${KONTO_ID}/media_publish`).length === 3,
      antwort: graphFehler(9, 2207042),
    });
    const pfade = await hochladen(4);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: { typ: "serie", datum: HEUTE, id: null },
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "limit");
    assert.equal(fehler.teil?.veroeffentlicht, 2);
    assert.equal(fehler.teil?.von, 4);
    assert.equal(fehler.teil?.links.length, 2);
    assert.match(fehler.text, /2 Stories von 4 sind schon online/);
    // Was online ist, steht im Verlauf.
    assert.equal(mock.tables.instagram_posts[0].media_ids.length, 2);
  });
});

describe("Abbruch und Frist", () => {
  it("Studio bricht nach der zweiten Story ab: keine weitere Story, teil nennt die zwei", async () => {
    const abbruch = new AbortController();
    g.beiJederAnfrage((a) => {
      if (
        a.pfad === `${KONTO_ID}/media_publish` &&
        g.an(`${KONTO_ID}/media_publish`).length === 2
      )
        abbruch.abort();
    });
    const pfade = await hochladen(4);
    const s = await poste(
      { art: "story", bilder: pfade, caption: "", quelle: SERIE_HEUTE },
      { signal: abbruch.signal },
    );
    // Die laufende Veröffentlichung wird nicht abgeschnitten.
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 2);
    assert.equal(g.medien.size, 2);
    assert.deepEqual(s.folge().slice(-3), [
      "veroeffentlichen:laeuft:2/4",
      "veroeffentlichen:fertig:2/4",
      "fehler:unbekannt",
    ]);
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.deepEqual(fehler.teil?.veroeffentlicht, 2);
    assert.equal(fehler.teil?.links.length, 2);
    assert.equal(mock.objects.size, 0);
    // Im Verlauf, aber nicht abgehakt (nur ein Teil ist online).
    assert.equal(mock.tables.instagram_posts.length, 1);
    assert.equal(mock.tables.instagram_posts[0].media_ids.length, 2);
    // Ein Abbruch durch das Studio ist kein Fehler fürs Log.
    assert.deepEqual(logs, []);
  });

  it("Frist abgelaufen während der ersten Story: sie bleibt online, keine weitere", async () => {
    const fristMs = 1500;
    const start = Date.now();
    g.beiJederAnfrage(async (a) => {
      if (a.pfad === `${KONTO_ID}/media_publish`) {
        const rest = start + fristMs + 100 - Date.now();
        if (rest > 0) await new Promise((r) => setTimeout(r, rest));
      }
    });
    const pfade = await hochladen(3);
    const s = await poste(
      { art: "story", bilder: pfade, caption: "", quelle: SERIE_HEUTE },
      { fristMs },
    );
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 1);
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "instagram");
    assert.match(fehler.text, /zu lange/);
    assert.equal(fehler.teil?.veroeffentlicht, 1);
    assert.equal(fehler.teil?.von, 3);
  });

  it("Frist abgelaufen beim Warten auf Container: Fehler ohne teil", async () => {
    g.stelle({ folge: () => ["IN_PROGRESS"] });
    const pfade = await hochladen(1);
    const s = await poste(
      { art: "beitrag", bilder: pfade, caption: "", quelle: SERIE_HEUTE },
      { pollMs: 20, pollMaxMs: 60_000, fristMs: 300 },
    );
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "instagram");
    assert.equal(fehler.teil, undefined);
    assert.equal(g.an(`${KONTO_ID}/media_publish`).length, 0);
  });
});

describe("Konto und Kontingent im Ablauf", () => {
  it("falsche INSTAGRAM_KONTO_ID (100/33): „konto“ mit Hinweis auf die Kennung", async () => {
    process.env.INSTAGRAM_KONTO_ID = "17841499999999999";
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), ["pruefen:laeuft", "fehler:konto"]);
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.match(fehler.text, /INSTAGRAM_KONTO_ID/);
    assert.equal(g.anfragen.length, 1);
  });

  it("Kontingent aufgebraucht: „limit“, bevor ein Container angelegt wird", async () => {
    g.stelle({
      kontingent: {
        quota_usage: 100,
        config: { quota_total: 100, quota_duration: 86400 },
      },
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), ["pruefen:laeuft", "fehler:limit"]);
    assert.equal(g.an(`${KONTO_ID}/media`).length, 0);
    assert.equal(mock.objects.size, 0);
  });

  it("Kontingent reicht nicht für alle Stories: sagt, wie viele noch gehen", async () => {
    g.stelle({
      kontingent: {
        quota_usage: 48,
        config: { quota_total: 50, quota_duration: 86400 },
      },
    });
    const pfade = await hochladen(4);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "limit");
    assert.match(fehler.text, /noch für 2 Posts/);
  });

  it("Kontingent nicht lesbar: es geht trotzdem weiter", async () => {
    g.regel({
      wenn: (a) => a.pfad.endsWith("content_publishing_limit"),
      antwort: graphFehler(100, 33),
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fertig");
  });

  it("ohne INSTAGRAM_KONTO_ID: Konto über me/accounts (erste Seite mit Business-Konto)", async () => {
    delete process.env.INSTAGRAM_KONTO_ID;
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.equal(s.folge().at(-1), "fertig");
    const seiten = g.an("me/accounts", "GET");
    assert.equal(seiten.length, 1);
    assert.equal(
      seiten[0].query.fields,
      "name,instagram_business_account{id,username}",
    );
    // Der Name kam schon mit; keine zweite Abfrage.
    assert.equal(g.an(KONTO_ID, "GET").length, 0);
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.equal(fertig.konto, NUTZERNAME);
  });

  it("ohne Business-Konto an den Seiten: „konto“ mit Hinweis auf INSTAGRAM_KONTO_ID", async () => {
    delete process.env.INSTAGRAM_KONTO_ID;
    g.stelle({ seiten: [{ id: "1", name: "Nur eine Seite" }] });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "konto");
    assert.match(fehler.text, /INSTAGRAM_KONTO_ID/);
    assert.equal(g.an(`${KONTO_ID}/media`).length, 0);
  });
});

describe("Eingabe und Einrichtung", () => {
  it("ohne Schlüssel: genau eine Zeile „nicht_verbunden“, kein Aufruf, kein Speicher", async () => {
    for (const wert of [
      undefined,
      "",
      "zu kurz",
      "mit leerzeichen 0123456789abcdef",
    ]) {
      if (wert === undefined) delete process.env.INSTAGRAM_TOKEN;
      else process.env.INSTAGRAM_TOKEN = wert;
      const s = await poste({
        art: "story",
        bilder: [],
        caption: "",
        quelle: SERIE_HEUTE,
      });
      assert.deepEqual(s.folge(), ["fehler:nicht_verbunden"]);
      const e = letzte(s);
      assert.ok(e.typ === "fehler");
      assert.match(e.text, /INSTAGRAM_TOKEN/);
    }
    assert.equal(g.anfragen.length, 0);
    assert.equal(mock.requests.length, 0);
  });

  it("gefälschte oder kaputte Aufträge: genau eine Zeile „eingabe“, nichts geht raus", async () => {
    const pfade = await hochladen(2);
    mock.requests.length = 0;
    const uuid = pfade[0].split("/")[1].slice(0, 36);
    const gut: PostAuftrag = {
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    };
    const faelle: unknown[] = [
      null,
      "Text",
      [],
      { ...gut, art: "reel" },
      { ...gut, bilder: "a.jpg" },
      { ...gut, bilder: [] },
      {
        ...gut,
        bilder: Array.from(
          { length: 11 },
          (_, i) => `${HEUTE}/${uuid}-${i + 1}.jpg`,
        ),
      },
      { ...gut, bilder: [`${HEUTE}/../geheim.jpg`] },
      { ...gut, bilder: [`${HEUTE}/${uuid}-1.jpg/../../x.jpg`] },
      { ...gut, bilder: [`instagram/${HEUTE}/${uuid}-1.jpg`] },
      { ...gut, bilder: [`/${HEUTE}/${uuid}-1.jpg`] },
      { ...gut, bilder: [`2026-11-10/${uuid}-1.jpg`] },
      { ...gut, bilder: [`2026-11-19/${uuid}-1.jpg`] },
      { ...gut, bilder: [`${HEUTE}/${uuid}-1.png`] },
      { ...gut, bilder: [`${HEUTE}/${uuid}-11.jpg`] },
      { ...gut, bilder: [`${HEUTE}/${uuid.toUpperCase()}-1.jpg`] },
      { ...gut, bilder: [pfade[0], pfade[0]] },
      {
        ...gut,
        bilder: [
          pfade[0],
          `${HEUTE}/00000000-0000-4000-8000-000000000000-2.jpg`,
        ],
      },
      { ...gut, caption: 5 },
      { ...gut, art: "beitrag", caption: "x".repeat(2201) },
      { ...gut, art: "beitrag", caption: "#a #b #c #d #e #f" },
      { ...gut, quelle: undefined },
      { ...gut, quelle: { typ: "karte", datum: HEUTE } },
      { ...gut, quelle: { typ: "serie", datum: HEUTE, id: "123" } },
      { ...gut, quelle: { typ: "serie", datum: HEUTE } },
      { ...gut, quelle: { typ: "post", datum: HEUTE, platz: 3 } },
      { ...gut, quelle: { typ: "post", datum: "2026-02-30", platz: 0 } },
      { ...gut, quelle: { typ: "post", datum: "2026-12-31", platz: 0 } },
      { ...gut, quelle: { typ: "serie", datum: "2026-09-01", id: null } },
    ];
    for (const roh of faelle) {
      const s = await poste(roh);
      assert.deepEqual(s.folge(), ["fehler:eingabe"], JSON.stringify(roh));
      const e = letzte(s);
      assert.ok(e.typ === "fehler");
      assert.doesNotMatch(e.text, /\b(Sie|Ihre?n?)\b/);
    }
    assert.equal(g.anfragen.length, 0);
    assert.equal(mock.requests.length, 0);
    // Die hochgeladenen Bilder hat kein gefälschter Auftrag angerührt.
    assert.equal(mock.objects.size, 2);
  });

  it("Bild nie hochgeladen: „bild“, bevor ein Container angelegt wird", async () => {
    const [pfad] = (await bilder.erzeugePlaetze(1, JETZT)).map((p) => p.pfad);
    const s = await poste({
      art: "beitrag",
      bilder: [pfad],
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(s.folge(), ["pruefen:laeuft", "fehler:bild"]);
    assert.equal(g.an(`${KONTO_ID}/media`).length, 0);
  });

  it("ohne Speicher (Datenbank-Update fehlt): Hinweis auf das Update", async () => {
    mock.reset("v5");
    const pfad = `${HEUTE}/00000000-0000-4000-8000-000000000000-1.jpg`;
    const s = await poste({
      art: "beitrag",
      bilder: [pfad],
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fehler = letzte(s);
    assert.ok(fehler.typ === "fehler");
    assert.equal(fehler.code, "unbekannt");
    assert.match(fehler.text, /Datenbank-Update/);
  });
});

describe("Abhaken und Verlauf", () => {
  it("Serie aus einem Auftrag: nach dem Posten als gepostet abgehakt", async () => {
    const zeile = mock.seedSerie({ datum: HEUTE, serie: GUTE_SERIE });
    const pfade = await hochladen(4);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: { typ: "serie", datum: HEUTE, id: zeile.id },
    });
    assert.equal(s.folge().at(-1), "fertig");
    assert.ok(mock.tables.serien[0].gepostet_at);
    assert.deepEqual(mock.tables.instagram_posts[0].quelle, {
      typ: "serie",
      datum: HEUTE,
      id: zeile.id,
    });
  });

  it("Post des Tages: Story und Beitrag landen im Post-Planer mit dem Satz des Tages", async () => {
    const text = postsFuer(HEUTE).find((p) => p.platz === 1)?.text;
    assert.ok(text);
    for (const art of ["story", "beitrag"] as const) {
      const pfade = await hochladen(1);
      const s = await poste({
        art,
        bilder: pfade,
        caption: "",
        quelle: { typ: "post", datum: HEUTE, platz: 1 },
      });
      assert.equal(s.folge().at(-1), "fertig");
    }
    assert.deepEqual(
      mock.tables.post_status
        .map((r) => [r.datum, r.platz, r.format, r.text])
        .sort(),
      [
        [HEUTE, 1, "beitrag", text],
        [HEUTE, 1, "story", text],
      ],
    );
  });

  it("scheitert das Abhaken, bleibt der Post ein Erfolg (nur ein Hinweis)", async () => {
    const zeile = mock.seedSerie({ datum: HEUTE, serie: GUTE_SERIE });
    mock.deny(["serien"]);
    const pfade = await hochladen(3);
    const s = await poste({
      art: "story",
      bilder: pfade,
      caption: "",
      quelle: { typ: "serie", datum: HEUTE, id: zeile.id },
    });
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.match(fertig.hinweis ?? "", /Hak ihn bitte selbst ab/);
    assert.equal(fertig.links.length, 3);
    assert.equal(mock.tables.instagram_posts.length, 1);
  });

  it("scheitern Verlauf und Abhaken (Datenbank weg), bleibt es ein Erfolg mit beiden Hinweisen", async () => {
    g.beiJederAnfrage((a) => {
      if (a.pfad === `${KONTO_ID}/media_publish`)
        process.env.SUPABASE_SERVICE_ROLE_KEY = "falsch";
    });
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: { typ: "post", datum: HEUTE, platz: 0 },
    });
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.match(fertig.hinweis ?? "", /Verlauf/);
    assert.match(fertig.hinweis ?? "", /Abhaken/);
    assert.equal(mock.tables.instagram_posts.length, 0);
    logsSauber();
  });

  it("ohne Tabelle für den Verlauf (Rechte fehlen): Erfolg ohne Hinweis", async () => {
    mock.deny(["instagram_posts"]);
    const pfade = await hochladen(1);
    const s = await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    const fertig = letzte(s);
    assert.ok(fertig.typ === "fertig");
    assert.equal(fertig.hinweis, undefined);
  });
});

describe("Speicher während des Laufs", () => {
  it("räumt zu Beginn Ordner auf, die älter als gestern sind", async () => {
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-15/alt-1.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-16/alt-2.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-17/gestern-1.jpg");
    const pfade = await hochladen(1);
    await poste({
      art: "beitrag",
      bilder: pfade,
      caption: "",
      quelle: SERIE_HEUTE,
    });
    assert.deepEqual(
      [...mock.objects.keys()],
      [`${INSTAGRAM_BUCKET}/2026-11-17/gestern-1.jpg`],
    );
  });
});

describe("Route und Strom", () => {
  it("von der Eingabe bis zur letzten Zeile, wie das Studio es liest", async () => {
    const pfade = await hochladen(2);
    const res = ndjsonAntwortAus<PostEreignis>(
      (sende, signal) =>
        posten.posteAuftrag(
          { art: "story", bilder: pfade, caption: "", quelle: SERIE_HEUTE },
          sende,
          { signal, jetzt: JETZT, pollMs: 1 },
        ),
      { typ: "fehler", code: "unbekannt", text: "x" },
      INSTAGRAM_INHALTSTYP,
    );
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), INSTAGRAM_INHALTSTYP);
    assert.match(res.headers.get("cache-control") ?? "", /no-store/);
    const text = await res.text();
    assert.ok(text.endsWith("\n"));
    const zeilen = text
      .trimEnd()
      .split("\n")
      .map((z) => JSON.parse(z) as PostEreignis);
    assert.equal(zeilen.length, storyFolge(2).length);
    assert.equal(zeilen.at(-1)?.typ, "fertig");
    for (const z of zeilen.slice(0, -1)) {
      assert.equal(z.typ, "schritt");
      if (z.typ === "schritt")
        assert.ok((POST_SCHRITTE as readonly string[]).includes(z.schritt));
    }
  });

  it("die Route: nur POST, Node-Laufzeit, 120 Sekunden, Adresse wie im Vertrag, requireAdmin zuerst", () => {
    assert.equal(INSTAGRAM_POSTEN_PFAD, "/admin/instagram/posten");
    const datei = path.join(ROOT, "app/admin/instagram/posten/route.ts");
    const sf = ts.createSourceFile(
      datei,
      readFileSync(datei, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );
    const exporte: string[] = [];
    for (const s of sf.statements) {
      const exportiert =
        ts.canHaveModifiers(s) &&
        ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exportiert) continue;
      if (ts.isFunctionDeclaration(s) && s.name) exporte.push(s.name.text);
      if (ts.isVariableStatement(s))
        for (const d of s.declarationList.declarations)
          exporte.push(d.name.getText(sf));
    }
    assert.deepEqual(exporte.sort(), ["POST", "maxDuration", "runtime"]);
    assert.match(sf.text, /export const runtime = "nodejs";/);
    assert.match(sf.text, /export const maxDuration = 120;/);
    assert.match(sf.text, /await requireAdmin\(\);\s*\n\s*let roh/);
    assert.match(sf.text, /INSTAGRAM_INHALTSTYP/);
  });
});

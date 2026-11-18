/**
 * Die Teile fürs Posten auf Instagram einzeln: Einstellungen
 * (lib/instagram/konfig.ts), Fehler der Graph API (graph.ts), Prüfung des
 * Auftrags (eingabe.ts), Speicher (bilder.ts), Stand der Verbindung
 * (stand.ts), Verlauf (posts-store.ts) und feste Zusagen im Code.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";
import ts from "typescript";

import type { PostFehlerCode } from "@/lib/instagram/vertrag";

import { DbError } from "@/lib/admin/db-errors";
import {
  bildPfad,
  pruefeAuftrag,
  pruefeQuelle,
  TEXT_HASHTAGS,
  TEXT_QUELLE,
  TEXT_ZU_ALT,
  TEXT_ZU_WEIT,
  zaehleHashtags,
  zeitraumProblem,
} from "@/lib/instagram/eingabe";
import {
  FEHLER_TEXT,
  fehlerAusAntwort,
  graph,
  InstagramAbbruch,
  InstagramFehler,
  instagramLink,
  istVoruebergehend,
  ordneEin,
} from "@/lib/instagram/graph";
import { INSTAGRAM_BUCKET } from "@/lib/instagram/vertrag";
import {
  graphFehler,
  type GraphAttrappe,
  JPEG,
  KONTO_ID,
  NUTZERNAME,
  startGraph,
  TOKEN,
} from "@/tests/instagram-attrappe";
import { ANON_KEY, SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

// Mittwoch, 18. November 2026, 11:00 Uhr in Hamburg.
const JETZT = new Date("2026-11-18T10:00:00Z");
const HEUTE = "2026-11-18";
const LAUF = "0f8e3c2a-1b2c-4d3e-8f90-a1b2c3d4e5f6";

let mock: Mock;
let g: GraphAttrappe;
let konfig: typeof import("@/lib/instagram/konfig");
let bilder: typeof import("@/lib/instagram/bilder");
let stand: typeof import("@/lib/instagram/stand");
let store: typeof import("@/lib/instagram/posts-store");
let logs: unknown[][] = [];
const echtesLog = console.error;

before(async () => {
  mock = await startMock({ mode: "v6" });
  g = await startGraph();
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  konfig = await import("@/lib/instagram/konfig");
  bilder = await import("@/lib/instagram/bilder");
  stand = await import("@/lib/instagram/stand");
  store = await import("@/lib/instagram/posts-store");
});

after(async () => {
  await mock.close();
  await g.close();
});

beforeEach(() => {
  mock.reset("v6");
  g.reset();
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
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

describe("Einstellungen (konfig.ts)", () => {
  it("bereit nur mit brauchbarem Schlüssel", () => {
    assert.equal(konfig.instagramBereit(), true);
    for (const wert of ["", "   ", "kurz", "zwei teile 0123456789abcdefghij"]) {
      process.env.INSTAGRAM_TOKEN = wert;
      assert.equal(konfig.instagramBereit(), false, wert);
      assert.equal(konfig.instagramKonfig(), null);
    }
    process.env.INSTAGRAM_TOKEN = `  ${TOKEN}\n`;
    assert.equal(konfig.instagramKonfig()?.token, TOKEN);
    delete process.env.INSTAGRAM_TOKEN;
    assert.equal(konfig.instagramBereit(), false);
  });

  it("Version: Standard v26.0, eigene nur in der Form vNN.N", () => {
    assert.equal(konfig.instagramVersion(), "v26.0");
    process.env.INSTAGRAM_API_VERSION = "v27.0";
    assert.equal(konfig.instagramVersion(), "v27.0");
    for (const wert of ["27.0", "latest", "v27", "v27.0/../me"]) {
      process.env.INSTAGRAM_API_VERSION = wert;
      assert.equal(konfig.instagramVersion(), "v26.0", wert);
    }
  });

  it("Konto-Kennung nur aus Ziffern", () => {
    assert.equal(konfig.instagramKontoId(), KONTO_ID);
    for (const wert of ["", "abc", "1784/../me", "12"]) {
      process.env.INSTAGRAM_KONTO_ID = wert;
      assert.equal(konfig.instagramKontoId(), null, wert);
    }
  });

  it("INSTAGRAM_GRAPH_URL gilt nur außerhalb des Produktivbetriebs", () => {
    assert.equal(konfig.graphBasis(), g.url);
    const env = process.env as Record<string, string | undefined>;
    const vorher = env.NODE_ENV;
    try {
      env.NODE_ENV = "production";
      assert.equal(konfig.graphBasis(), "https://graph.facebook.com");
    } finally {
      if (vorher === undefined) delete env.NODE_ENV;
      else env.NODE_ENV = vorher;
    }
    for (const wert of ["kein url", "ftp://example.org", ""]) {
      process.env.INSTAGRAM_GRAPH_URL = wert;
      assert.equal(konfig.graphBasis(), "https://graph.facebook.com", wert);
    }
    delete process.env.INSTAGRAM_GRAPH_URL;
    assert.equal(konfig.graphBasis(), konfig.GRAPH_STANDARD);
  });
});

describe("Fehler der Graph API (graph.ts)", () => {
  it("ordnet jeden bekannten Code dem Vertrag zu", () => {
    const faelle: [
      number | undefined,
      number | undefined,
      string,
      PostFehlerCode,
    ][] = [
      [190, undefined, "", "zugang"],
      [190, 460, "", "zugang"],
      [102, undefined, "", "zugang"],
      [10, undefined, "(#10) Application does not have permission", "zugang"],
      [200, undefined, "", "zugang"],
      [299, undefined, "", "zugang"],
      [9, 2207042, "", "limit"],
      [4, undefined, "", "limit"],
      [17, undefined, "", "limit"],
      [32, undefined, "", "limit"],
      [613, undefined, "", "limit"],
      [80002, undefined, "", "limit"],
      [9004, 2207052, "", "bild"],
      [-2, 2207003, "", "bild"],
      [36000, 2207004, "", "bild"],
      [36001, 2207005, "", "bild"],
      [36003, 2207009, "", "bild"],
      [36004, 2207010, "", "bild"],
      [36002, undefined, "", "bild"],
      [25, 2207050, "", "konto"],
      [4, 2207051, "", "konto"],
      [10, undefined, "(#10) The user is not an Instagram Business", "konto"],
      [100, undefined, "Must be a business account", "konto"],
      [-1, 2207001, "", "instagram"],
      [100, 2207028, "", "instagram"],
      [1, undefined, "", "instagram"],
      [undefined, undefined, "", "instagram"],
    ];
    for (const [code, subcode, meldung, erwartet] of faelle)
      assert.equal(
        ordneEin({ code, subcode, meldung }),
        erwartet,
        `${code}/${subcode} ${meldung}`,
      );
    // 190 bleibt Zugang, auch wenn die Meldung „business account“ nennt.
    assert.equal(
      ordneEin({ code: 190, meldung: "business account token expired" }),
      "zugang",
    );
  });

  it("kurzfristig: is_transient, 2207001, 2207032, 24/2207008; nie 190 und nie ein Limit", () => {
    assert.equal(istVoruebergehend({ transient: true, code: 2 }), true);
    assert.equal(istVoruebergehend({ code: -1, subcode: 2207001 }), true);
    assert.equal(istVoruebergehend({ code: -1, subcode: 2207032 }), true);
    assert.equal(istVoruebergehend({ code: 24, subcode: 2207008 }), true);
    assert.equal(istVoruebergehend({ code: 24, subcode: 2207006 }), false);
    assert.equal(istVoruebergehend({ code: 190, transient: true }), false);
    assert.equal(istVoruebergehend({ code: 4, transient: true }), false);
    assert.equal(istVoruebergehend({ code: 100 }), false);
  });

  it("fehlerAusAntwort: Satz für den Inhaber, nie die Rohmeldung; fbtrace nur, wenn harmlos", () => {
    const e = fehlerAusAntwort(400, {
      error: {
        message:
          "The media could not be fetched from this uri: https://x.supabase.co/o?token=geheim",
        code: 9004,
        error_subcode: 2207052,
        fbtrace_id: "AbC-12_x",
      },
    });
    assert.ok(e);
    assert.equal(e.code, "bild");
    assert.equal(e.text, FEHLER_TEXT.bild);
    assert.equal(e.fbtrace, "AbC-12_x");
    assert.ok(!e.message.includes("http"));
    assert.ok(!e.message.includes("geheim"));
    assert.equal(
      fehlerAusAntwort(400, {
        error: { code: 1, fbtrace_id: "<script>" },
      })?.fbtrace,
      null,
    );
    assert.equal(fehlerAusAntwort(200, { id: "1" }), null);
    assert.equal(fehlerAusAntwort(500, "kaputt"), null);
    assert.match(
      fehlerAusAntwort(400, { error: { code: 9, error_subcode: 2207042 } })
        ?.text ?? "",
      /Morgen/,
    );
  });

  it("jeder Satz in Du-Form, ohne Sie", () => {
    for (const text of Object.values(FEHLER_TEXT)) {
      assert.doesNotMatch(text, /\b(Sie|Ihre?[nms]?)\b/, text);
      assert.ok(text.length > 20);
    }
  });

  it("der Anschluss: Bearer-Header, JSON-Körper, Query nur bei GET, keine fremden Pfade", async () => {
    const z = { token: TOKEN, version: "v26.0", basis: g.url };
    const c = graph(z);
    const konto = await c.get<{ username: string }>(KONTO_ID, {
      fields: "username",
    });
    assert.equal(konto.username, NUTZERNAME);
    const [a] = g.anfragen;
    assert.equal(a.url, `/v26.0/${KONTO_ID}?fields=username`);
    assert.equal(a.auth, `Bearer ${TOKEN}`);
    await assert.rejects(
      c.get("../../etc/passwd"),
      (e: unknown) => e instanceof InstagramFehler && e.code === "unbekannt",
    );
    await assert.rejects(
      c.get("me?x=1"),
      (e: unknown) => e instanceof InstagramFehler,
    );
    assert.equal(g.anfragen.length, 1);
  });

  it("Antwort ohne JSON oder 5xx ohne Fehlerobjekt: „instagram“ (5xx einmal wiederholt)", async () => {
    g.regel({
      wenn: () => true,
      antwort: { status: 502, body: "<html>" },
      mal: 2,
    });
    const c = graph(
      { token: TOKEN, version: "v26.0", basis: g.url },
      { wiederholMs: 1 },
    );
    await assert.rejects(
      c.get(KONTO_ID),
      (e: unknown) =>
        e instanceof InstagramFehler &&
        e.code === "instagram" &&
        e.status === 502,
    );
    assert.equal(g.anfragen.length, 2);
  });

  it("Abbruch von außen: InstagramAbbruch, keine Wiederholung", async () => {
    const abbruch = new AbortController();
    abbruch.abort();
    const c = graph(
      { token: TOKEN, version: "v26.0", basis: g.url },
      { signal: abbruch.signal },
    );
    await assert.rejects(
      c.get(KONTO_ID),
      (e: unknown) => e instanceof InstagramAbbruch,
    );
    assert.equal(g.anfragen.length, 0);
  });

  it("Links nur zu instagram.com über https", () => {
    assert.equal(
      instagramLink("https://www.instagram.com/p/abc/"),
      "https://www.instagram.com/p/abc/",
    );
    for (const v of [
      "http://www.instagram.com/p/abc/",
      "https://instagram.com.evil.example/p",
      "javascript:alert(1)",
      42,
      null,
    ])
      assert.equal(instagramLink(v), null, String(v));
  });
});

describe("Auftrag prüfen (eingabe.ts)", () => {
  const pfad = (tag: string, nr: number) => `${tag}/${LAUF}-${nr}.jpg`;

  it("Bildpfade: nur heute und gestern, nur unsere Form", () => {
    assert.deepEqual(bildPfad(pfad(HEUTE, 3), JETZT), {
      pfad: pfad(HEUTE, 3),
      tag: HEUTE,
      lauf: LAUF,
      nr: 3,
    });
    assert.ok(bildPfad(pfad("2026-11-17", 1), JETZT));
    for (const v of [
      pfad("2026-11-16", 1),
      pfad("2026-11-19", 1),
      pfad(HEUTE, 0),
      pfad(HEUTE, 11),
      `${HEUTE}/${LAUF}-1.jpeg`,
      `${HEUTE}/${LAUF}-1.jpg?x`,
      `${HEUTE}/../${LAUF}-1.jpg`,
      `../${HEUTE}/${LAUF}-1.jpg`,
      `${HEUTE}\\${LAUF}-1.jpg`,
      `2026-02-30/${LAUF}-1.jpg`,
      42,
    ])
      assert.equal(bildPfad(v, JETZT), null, String(v));
    // Kurz nach Mitternacht in Hamburg ist „gestern“ der Vortag.
    const nachMitternacht = new Date("2026-11-18T23:30:00Z"); // 00:30 am 19.
    assert.ok(bildPfad(pfad("2026-11-18", 1), nachMitternacht));
    assert.equal(bildPfad(pfad("2026-11-17", 1), nachMitternacht), null);
  });

  it("Story: Bildunterschrift wird nicht gesendet (auch mit vielen Hashtags)", () => {
    const r = pruefeAuftrag(
      {
        art: "story",
        bilder: [pfad(HEUTE, 1), pfad(HEUTE, 2)],
        caption: "#a #b #c #d #e #f #g",
        quelle: { typ: "serie", datum: HEUTE, id: null },
      },
      JETZT,
    );
    assert.ok(r.ok);
    assert.equal(r.auftrag.caption, "");
  });

  it("Beitrag: Umbrüche vereinheitlicht, Steuerzeichen raus, Grenzen genau", () => {
    const r = pruefeAuftrag(
      {
        art: "beitrag",
        bilder: [pfad(HEUTE, 1)],
        caption: "Zeile 1\r\nZeile 2\u0007 #eins #zwei",
        quelle: { typ: "post", datum: HEUTE, platz: 2 },
      },
      JETZT,
    );
    assert.ok(r.ok);
    assert.equal(r.auftrag.caption, "Zeile 1\nZeile 2 #eins #zwei");
    const genau = pruefeAuftrag(
      {
        art: "beitrag",
        bilder: Array.from({ length: 10 }, (_, i) => pfad(HEUTE, i + 1)),
        caption: `${"x".repeat(2200 - 15)} #a #b #c #d #e`.slice(0, 2200),
        quelle: { typ: "post", datum: HEUTE, platz: 0 },
      },
      JETZT,
    );
    assert.ok(genau.ok, genau.ok ? "" : genau.text);
    const sechs = pruefeAuftrag(
      {
        art: "beitrag",
        bilder: [pfad(HEUTE, 1)],
        caption: "#a #b #c #d #e #f",
        quelle: { typ: "post", datum: HEUTE, platz: 0 },
      },
      JETZT,
    );
    assert.deepEqual(sechs, { ok: false, text: TEXT_HASHTAGS });
  });

  it("Hashtags zählen wie Instagram: Wort nach #, kein Anker, keine HTML-Entität", () => {
    assert.equal(zaehleHashtags("#a #b"), 2);
    assert.equal(zaehleHashtags("Text#keiner"), 0);
    assert.equal(zaehleHashtags("&#123; und #ja"), 1);
    assert.equal(zaehleHashtags("#Möwe #hamburg_2026"), 2);
    assert.equal(zaehleHashtags("# leer"), 0);
  });

  it("Quelle: Tag höchstens 30 zurück und 14 voraus, Kennung als UUID", () => {
    assert.deepEqual(
      pruefeQuelle({ typ: "serie", datum: "2026-12-02", id: null }, JETZT),
      { typ: "serie", datum: "2026-12-02", id: null },
    );
    assert.equal(
      pruefeQuelle({ typ: "serie", datum: "2026-12-03", id: null }, JETZT),
      null,
    );
    assert.ok(
      pruefeQuelle({ typ: "post", datum: "2026-10-19", platz: 0 }, JETZT),
    );
    assert.equal(
      pruefeQuelle({ typ: "post", datum: "2026-10-18", platz: 0 }, JETZT),
      null,
    );
    assert.deepEqual(
      pruefeQuelle(
        { typ: "serie", datum: HEUTE, id: LAUF.toUpperCase(), extra: 1 },
        JETZT,
      ),
      { typ: "serie", datum: HEUTE, id: LAUF },
    );
  });

  it("Tag außerhalb des Zeitraums: eigener Satz statt „Seite neu laden“ (auch fürs Studio)", () => {
    const auftrag = (datum: string) =>
      pruefeAuftrag(
        {
          art: "story",
          bilder: [pfad(HEUTE, 1), pfad(HEUTE, 2)],
          caption: "",
          quelle: { typ: "serie", datum, id: LAUF },
        },
        JETZT,
      );
    // Eine gespeicherte Serie vom 10.10. (mehr als 30 Tage zurück).
    assert.deepEqual(auftrag("2026-10-10"), { ok: false, text: TEXT_ZU_ALT });
    assert.deepEqual(auftrag("2026-12-03"), { ok: false, text: TEXT_ZU_WEIT });
    assert.ok(auftrag("2026-10-19").ok);
    assert.ok(auftrag("2026-12-02").ok);
    // Unlesbar bleibt unlesbar.
    assert.deepEqual(
      pruefeAuftrag(
        {
          art: "story",
          bilder: [pfad(HEUTE, 1)],
          caption: "",
          quelle: { typ: "serie", datum: "2026-13-01", id: LAUF },
        },
        JETZT,
      ),
      { ok: false, text: TEXT_QUELLE },
    );
    // Dieselbe Prüfung nutzt das Studio, bevor es etwas zeichnet.
    assert.equal(zeitraumProblem("2026-10-10", JETZT), TEXT_ZU_ALT);
    assert.equal(zeitraumProblem("2026-12-03", JETZT), TEXT_ZU_WEIT);
    assert.equal(zeitraumProblem(HEUTE, JETZT), null);
    for (const text of [TEXT_ZU_ALT, TEXT_ZU_WEIT]) {
      assert.doesNotMatch(text, /neu laden|lade die Seite/i);
      assert.doesNotMatch(text, /\b(Sie|Ihre?n?)\b/);
    }
  });

  it("Quelle lokal (Serie nur auf einem Gerät): nur ohne Kennung, getrennt von der Serie des Tages", () => {
    assert.deepEqual(
      pruefeQuelle(
        { typ: "serie", datum: HEUTE, id: null, lokal: true },
        JETZT,
      ),
      { typ: "serie", datum: HEUTE, id: null, lokal: true },
    );
    // Ohne lokal: die Serie des Tages.
    assert.deepEqual(
      pruefeQuelle({ typ: "serie", datum: HEUTE, id: null, lokal: 1 }, JETZT),
      { typ: "serie", datum: HEUTE, id: null },
    );
    // lokal und Kennung zugleich gibt es nicht.
    assert.equal(
      pruefeQuelle(
        { typ: "serie", datum: HEUTE, id: LAUF, lokal: true },
        JETZT,
      ),
      null,
    );
  });
});

describe("Speicher (bilder.ts)", () => {
  it("Upload-Plätze: Pfade unter dem Tag in Hamburg, ein Lauf, nummeriert", async () => {
    const plaetze = await bilder.erzeugePlaetze(3, JETZT);
    assert.equal(plaetze.length, 3);
    const lauf = plaetze[0].pfad.split("/")[1].slice(0, 36);
    plaetze.forEach((p, i) => {
      assert.equal(p.pfad, `${HEUTE}/${lauf}-${i + 1}.jpg`);
      assert.ok(p.token.length > 10);
      assert.ok(bildPfad(p.pfad, JETZT));
    });
    await assert.rejects(bilder.erzeugePlaetze(0, JETZT));
    await assert.rejects(bilder.erzeugePlaetze(11, JETZT));
  });

  it("der Browser lädt mit dem Token hoch (auch als Blob), nur JPEG, nur an genau diesen Pfad", async () => {
    const [a, b] = await bilder.erzeugePlaetze(2, JETZT);
    const browser = createClient(mock.url, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    }).storage.from(INSTAGRAM_BUCKET);
    // Falscher Pfad mit gültigem Token: abgelehnt.
    const falsch = await browser.uploadToSignedUrl(b.pfad, a.token, JPEG, {
      contentType: "image/jpeg",
    });
    assert.ok(falsch.error);
    // PNG: lehnt der Bucket ab.
    const png = await browser.uploadToSignedUrl(a.pfad, a.token, JPEG, {
      contentType: "image/png",
    });
    assert.ok(png.error);
    // Blob wie im Browser (multipart).
    const blob = await browser.uploadToSignedUrl(
      a.pfad,
      a.token,
      new Blob([JPEG], { type: "image/jpeg" }),
      { contentType: "image/jpeg" },
    );
    assert.equal(blob.error, null);
    assert.equal(
      mock.objects.get(`${INSTAGRAM_BUCKET}/${a.pfad}`)?.contentType,
      "image/jpeg",
    );
  });

  it("signierte Adressen (2 Stunden) sind ohne Schlüssel ladbar; fehlendes Bild: SpeicherFehler „fehlt“", async () => {
    const [p] = await bilder.erzeugePlaetze(1, JETZT);
    mock.seedObject(INSTAGRAM_BUCKET, p.pfad, JPEG);
    const [adresse] = await bilder.leseAdressen([p.pfad]);
    const res = await fetch(adresse);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("content-type"), "image/jpeg");
    const sign = mock.requests.find((r) =>
      r.url.startsWith("/storage/v1/object/sign/"),
    );
    assert.deepEqual(sign?.body, { expiresIn: 7200 });
    await assert.rejects(
      bilder.leseAdressen([`${HEUTE}/${LAUF}-1.jpg`]),
      (e: unknown) => e instanceof bilder.SpeicherFehler && e.art === "fehlt",
    );
    await assert.rejects(
      bilder.leseAdressen(["andere/datei.jpg"]),
      (e: unknown) => e instanceof bilder.SpeicherFehler,
    );
  });

  it("löscht nur Pfade in unserer Form", async () => {
    mock.seedObject(INSTAGRAM_BUCKET, `${HEUTE}/${LAUF}-1.jpg`);
    mock.seedObject(INSTAGRAM_BUCKET, "andere/geheim.jpg");
    assert.equal(
      await bilder.loescheDateien([
        `${HEUTE}/${LAUF}-1.jpg`,
        "andere/geheim.jpg",
      ]),
      true,
    );
    assert.deepEqual(
      [...mock.objects.keys()],
      [`${INSTAGRAM_BUCKET}/andere/geheim.jpg`],
    );
    mock.setStorageDown(true);
    assert.equal(
      await bilder.loescheDateien([`${HEUTE}/${LAUF}-2.jpg`]),
      false,
    );
  });

  it("räumt Ordner älter als gestern auf, wirft nie", async () => {
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-01/a-1.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-16/b-1.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-16/b-2.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, "2026-11-17/c-1.jpg");
    mock.seedObject(INSTAGRAM_BUCKET, `${HEUTE}/d-1.jpg`);
    assert.equal(await bilder.raeumeAuf(JETZT), 3);
    assert.deepEqual([...mock.objects.keys()].sort(), [
      `${INSTAGRAM_BUCKET}/2026-11-17/c-1.jpg`,
      `${INSTAGRAM_BUCKET}/${HEUTE}/d-1.jpg`,
    ]);
    mock.setStorageDown(true);
    assert.equal(await bilder.raeumeAuf(JETZT), 0);
    mock.reset("v5");
    assert.equal(await bilder.raeumeAuf(JETZT), 0);
  });

  it("Bucket da? true mit dem Update, false ohne, null wenn die Prüfung scheitert", async () => {
    assert.equal(await bilder.bucketDa(), true);
    mock.reset("v5");
    assert.equal(await bilder.bucketDa(), false);
    await assert.rejects(
      bilder.erzeugePlaetze(1, JETZT),
      (e: unknown) =>
        e instanceof bilder.SpeicherFehler && e.art === "kein_bucket",
    );
    mock.setStorageDown(true);
    assert.equal(await bilder.bucketDa(), null);
  });
});

describe("Stand der Verbindung (stand.ts)", () => {
  it("ohne Schlüssel: kein_token (ohne Aufruf)", async () => {
    delete process.env.INSTAGRAM_TOKEN;
    assert.deepEqual(await stand.leseStand(), {
      verbunden: false,
      grund: "kein_token",
    });
    assert.equal(g.anfragen.length, 0);
  });

  it("ohne Speicher: kein_speicher", async () => {
    mock.reset("v5");
    assert.deepEqual(await stand.leseStand(), {
      verbunden: false,
      grund: "kein_speicher",
    });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      assert.deepEqual(await stand.leseStand(), {
        verbunden: false,
        grund: "kein_speicher",
      });
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
    assert.equal(g.anfragen.length, 0);
  });

  it("verbunden: Konto und Kontingent der letzten 24 Stunden (Grenze zur Laufzeit gelesen)", async () => {
    g.stelle({
      kontingent: {
        quota_usage: 7,
        config: { quota_total: 50, quota_duration: 86400 },
      },
    });
    assert.deepEqual(await stand.leseStand(), {
      verbunden: true,
      konto: { id: KONTO_ID, name: NUTZERNAME },
      kontingent: { genutzt: 7, gesamt: 50 },
      problem: null,
    });
    assert.deepEqual(g.an(`${KONTO_ID}/content_publishing_limit`)[0].query, {
      fields: "quota_usage,config",
    });
    // Liest nur, postet nie.
    assert.ok(g.anfragen.every((a) => a.methode === "GET"));
  });

  it("Konto über me/accounts, Kontingent unlesbar: Konto da, Kontingent null", async () => {
    delete process.env.INSTAGRAM_KONTO_ID;
    g.stelle({ kontingent: null });
    assert.deepEqual(await stand.leseStand(), {
      verbunden: true,
      konto: { id: KONTO_ID, name: NUTZERNAME },
      kontingent: null,
      problem: null,
    });
  });

  it("Zugang abgelaufen: verbunden, aber mit Problem in Du-Form; geloggt nur Codes", async () => {
    g.regel({ wenn: () => true, antwort: graphFehler(190, 463, {}, 401) });
    const s = await stand.leseStand();
    assert.ok(s.verbunden);
    assert.equal(s.konto, null);
    assert.equal(s.kontingent, null);
    assert.equal(s.problem, FEHLER_TEXT.zugang);
    assert.deepEqual(logs, [
      [
        "[instagram] Prüfung fehlgeschlagen",
        { code: "zugang", graph: 190, subcode: 463, fbtrace: "TRACE190" },
      ],
    ]);
  });

  it("Instagram antwortet nicht rechtzeitig: Problem statt Hängen", async () => {
    g.beiJederAnfrage(() => new Promise((r) => setTimeout(r, 300)));
    const s = await stand.leseStand({ zeitMs: 50 });
    assert.ok(s.verbunden);
    assert.ok(s.problem);
  });
});

describe("Verlauf der Posts (posts-store.ts)", () => {
  const serie = { typ: "serie", datum: HEUTE, id: null } as const;
  const post = { typ: "post", datum: HEUTE, platz: 1 } as const;

  it("speichern, auflisten (neueste zuerst) und den letzten zu einer Quelle finden", async () => {
    const a = await store.savePost({
      art: "story",
      quelle: serie,
      bilder: 4,
      media_ids: ["1", "2", "3", "4"],
      links: ["https://www.instagram.com/stories/x/1/"],
    });
    const b = await store.savePost({
      art: "beitrag",
      quelle: post,
      bilder: 1,
      media_ids: ["9"],
      links: ["https://www.instagram.com/p/abc/"],
    });
    assert.ok(a && b);
    const insert = mock.requests.find((r) => r.method === "POST");
    assert.deepEqual(Object.keys(insert?.body as object).sort(), [
      "art",
      "bilder",
      "links",
      "media_ids",
      "quelle",
    ]);
    const liste = await store.listPosts(10);
    assert.deepEqual(
      liste?.map((z) => z.id),
      [b, a],
    );
    assert.equal((await store.lastPostFor(serie))?.id, a);
    assert.equal((await store.lastPostFor(post, "beitrag"))?.id, b);
    assert.equal(await store.lastPostFor(post, "story"), null);
    assert.equal(
      await store.lastPostFor({ typ: "post", datum: HEUTE, platz: 2 }),
      null,
    );
    assert.equal(
      await store.lastPostFor({ typ: "serie", datum: HEUTE, id: LAUF }),
      null,
    );
  });

  it("Serie des Tages und Serien nur auf einem Gerät zählen getrennt", async () => {
    const lokal = {
      typ: "serie",
      datum: HEUTE,
      id: null,
      lokal: true,
    } as const;
    const tag = await store.savePost({
      art: "story",
      quelle: serie,
      bilder: 3,
      media_ids: ["1", "2", "3"],
      links: [],
    });
    // Danach eine Serie nur auf einem Gerät, gleicher Tag, gleiche Art.
    const geraet = await store.savePost({
      art: "story",
      quelle: lokal,
      bilder: 3,
      media_ids: ["4", "5", "6"],
      links: [],
    });
    assert.ok(tag && geraet);
    assert.deepEqual(
      mock.tables.instagram_posts.find((z) => z.id === geraet)?.quelle,
      lokal,
    );
    assert.equal((await store.lastPostFor(serie, "story"))?.id, tag);
    assert.equal((await store.lastPostFor(lokal, "story"))?.id, geraet);
    assert.equal(await store.lastPostFor(serie, "beitrag"), null);
    // Nur eine lokale Serie gepostet: die Serie des Tages bleibt offen.
    mock.tables.instagram_posts.splice(
      mock.tables.instagram_posts.findIndex((z) => z.id === tag),
      1,
    );
    assert.equal(await store.lastPostFor(serie, "story"), null);
  });

  it("ungültige Werte: DbError, bevor etwas gesendet wird", async () => {
    for (const eintrag of [
      { art: "reel", quelle: serie, bilder: 1, media_ids: [], links: [] },
      {
        art: "story",
        quelle: { typ: "x" },
        bilder: 1,
        media_ids: [],
        links: [],
      },
      { art: "story", quelle: serie, bilder: 11, media_ids: [], links: [] },
      { art: "story", quelle: serie, bilder: 1, media_ids: ["abc"], links: [] },
      {
        art: "story",
        quelle: serie,
        bilder: 1,
        media_ids: [],
        links: ["http://x"],
      },
    ])
      await assert.rejects(
        store.savePost(eintrag as Parameters<typeof store.savePost>[0]),
        DbError,
      );
    assert.equal(mock.requests.length, 0);
  });

  it("ohne Tabelle oder ohne Rechte: null statt Fehler", async () => {
    for (const vorbereiten of [
      () => mock.reset("v5"),
      () => {
        mock.reset("v6");
        mock.deny(["instagram_posts"]);
      },
    ]) {
      vorbereiten();
      assert.equal(
        await store.savePost({
          art: "story",
          quelle: serie,
          bilder: 1,
          media_ids: [],
          links: [],
        }),
        null,
      );
      assert.equal(await store.listPosts(), null);
      assert.equal(await store.lastPostFor(serie), null);
    }
  });

  it("kaputte Zeilen werden beim Lesen übersprungen", async () => {
    mock.tables.instagram_posts.push(
      {
        id: "11111111-1111-4111-8111-111111111111",
        created_at: "2026-11-18T09:00:00.000Z",
        art: "story",
        quelle: serie,
        bilder: 2,
        media_ids: ["1"],
        links: [],
      },
      {
        id: "22222222-2222-4222-8222-222222222222",
        created_at: "2026-11-18T09:01:00.000Z",
        art: "story",
        quelle: { typ: "serie" },
        bilder: 2,
        media_ids: [],
        links: [],
      },
    );
    const liste = await store.listPosts();
    assert.deepEqual(
      liste?.map((z) => z.id),
      ["11111111-1111-4111-8111-111111111111"],
    );
  });
});

describe("Instagram: feste Zusagen im Code", () => {
  const parse = (datei: string) =>
    ts.createSourceFile(
      datei,
      readFileSync(path.join(ROOT, datei), "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );

  const INSTAGRAM = readdirSync(path.join(ROOT, "lib/instagram"))
    .filter((n) => n.endsWith(".ts"))
    .map((n) => `lib/instagram/${n}`);
  const SERVER_DATEIEN = [
    ...INSTAGRAM,
    "lib/ndjson-strom.ts",
    "app/admin/instagram-actions.ts",
    "app/admin/instagram/posten/route.ts",
  ];

  /** Laufzeit-Importe einer Datei (reine Typ-Importe zählen nicht). */
  function importe(datei: string): string[] {
    const ziele: string[] = [];
    for (const s of parse(datei).statements) {
      if (!ts.isImportDeclaration(s) || !ts.isStringLiteral(s.moduleSpecifier))
        continue;
      const k = s.importClause;
      const nurTypen =
        k?.isTypeOnly ||
        (k &&
          !k.name &&
          k.namedBindings &&
          ts.isNamedImports(k.namedBindings) &&
          k.namedBindings.elements.length > 0 &&
          k.namedBindings.elements.every((e) => e.isTypeOnly));
      if (!nurTypen) ziele.push(s.moduleSpecifier.text);
    }
    return ziele;
  }

  it("der Vertrag bleibt rein, Prüfung und Graph-Anschluss laden keinen Server-Code", () => {
    assert.deepEqual(importe("lib/instagram/vertrag.ts"), []);
    for (const datei of [
      "lib/instagram/eingabe.ts",
      "lib/instagram/graph.ts",
      "lib/ndjson-strom.ts",
    ])
      for (const ziel of importe(datei))
        assert.doesNotMatch(
          ziel,
          /server-only|supabase|konfig|posts-store|bilder|serien-store|post-status-store|sprueche-aktuell/,
          `${datei} lädt ${ziel}`,
        );
    for (const datei of [
      "lib/instagram/konfig.ts",
      "lib/instagram/bilder.ts",
      "lib/instagram/posten.ts",
      "lib/instagram/posts-store.ts",
      "lib/instagram/stand.ts",
    ])
      assert.ok(importe(datei).includes("server-only"), datei);
  });

  it("INSTAGRAM_TOKEN wird nur in konfig.ts gelesen; nichts im Code sieht wie ein Schlüssel aus", () => {
    const dateien = [
      ...SERVER_DATEIEN,
      ...readdirSync(path.join(ROOT, "app/admin/story"))
        .filter((n) => /\.tsx?$/.test(n))
        .map((n) => `app/admin/story/${n}`),
    ];
    for (const datei of dateien) {
      const text = readFileSync(path.join(ROOT, datei), "utf8");
      if (datei !== "lib/instagram/konfig.ts")
        assert.doesNotMatch(
          text,
          /process\.env\.INSTAGRAM_TOKEN|env\[["']INSTAGRAM_TOKEN/,
          datei,
        );
      assert.doesNotMatch(
        text,
        /EAA[A-Za-z0-9]{20,}|sk_live|eyJ[A-Za-z0-9_-]{10,}/,
        datei,
      );
    }
  });

  it("console.* gibt nur feste Texte und Codes aus, nie Schlüssel, Adressen oder Texte", () => {
    const ERLAUBT = new Set([
      "wo",
      "code",
      "graph",
      "subcode",
      "fbtrace",
      "schritt",
    ]);
    let gefunden = 0;
    for (const datei of SERVER_DATEIEN) {
      const sf = parse(datei);
      const besuche = (knoten: ts.Node) => {
        if (
          ts.isCallExpression(knoten) &&
          ts.isPropertyAccessExpression(knoten.expression) &&
          ts.isIdentifier(knoten.expression.expression) &&
          knoten.expression.expression.text === "console"
        ) {
          gefunden++;
          const [meldung, ...rest] = knoten.arguments;
          assert.ok(
            ts.isStringLiteral(meldung) ||
              ts.isNoSubstitutionTemplateLiteral(meldung),
            `${datei}: Meldung muss ein fester Text sein`,
          );
          assert.ok(rest.length <= 1, datei);
          for (const arg of rest) {
            assert.ok(ts.isObjectLiteralExpression(arg), datei);
            for (const p of arg.properties) {
              assert.ok(
                ts.isPropertyAssignment(p) ||
                  ts.isShorthandPropertyAssignment(p),
                datei,
              );
              const name = p.name.getText(sf);
              assert.ok(ERLAUBT.has(name), `${datei}: loggt „${name}“`);
            }
          }
        }
        ts.forEachChild(knoten, besuche);
      };
      besuche(sf);
    }
    assert.ok(gefunden >= 4);
  });

  it(".env.example: jeder INSTAGRAM_*-Schlüssel genau einmal, Rechte wie in der Anleitung", () => {
    const env = readFileSync(path.join(ROOT, ".env.example"), "utf8");
    const schluessel = [...env.matchAll(/^#?\s*(INSTAGRAM_[A-Z_]+)=/gm)].map(
      (m) => m[1],
    );
    assert.deepEqual(schluessel.sort(), [
      "INSTAGRAM_API_VERSION",
      "INSTAGRAM_GRAPH_URL",
      "INSTAGRAM_KONTO_ID",
      "INSTAGRAM_TOKEN",
    ]);
    const RECHT =
      /\b(?:instagram_[a-z_]+|pages_[a-z_]+|business_[a-z_]+|ads_[a-z_]+)\b/g;
    const rechte = (text: string) => new Set(text.match(RECHT) ?? []);
    // Die Liste zum Anhaken in docs/instagram-einrichtung.md (Teil 5).
    const doku = readFileSync(
      path.join(ROOT, "docs/instagram-einrichtung.md"),
      "utf8",
    );
    const teil5 = doku.slice(doku.indexOf("## Teil 5"));
    const liste = [
      ...teil5
        .slice(0, teil5.indexOf("\n## ", 5))
        .matchAll(/^\s*- `([a-z_]+)`\s*$/gm),
    ].map((m) => m[1]);
    assert.deepEqual(liste, [
      "instagram_basic",
      "instagram_content_publish",
      "pages_show_list",
      "pages_read_engagement",
      "business_management",
    ]);
    // ads_read nur als Zusatz, ads_management gar nicht (Kommentar zum
    // Schlüssel, ab „Rechte“).
    const zumSchluessel = env.slice(0, env.indexOf("\nINSTAGRAM_TOKEN="));
    assert.deepEqual(
      [
        ...rechte(zumSchluessel.slice(zumSchluessel.lastIndexOf("Rechte"))),
      ].sort(),
      [...liste, "ads_read"].sort(),
    );
    assert.doesNotMatch(env, /ads_management/);
    const seite = readFileSync(
      path.join(ROOT, "app/admin/instagram/page.tsx"),
      "utf8",
    );
    for (const recht of liste) assert.ok(seite.includes(recht), recht);
  });

  it("die Actions: requireAdmin zuerst, Upload-Plätze nur mit gültiger Anzahl und Art", () => {
    const text = readFileSync(
      path.join(ROOT, "app/admin/instagram-actions.ts"),
      "utf8",
    );
    assert.match(text, /^"use server";/);
    for (const name of ["instagramUploadAction", "instagramStandAction"])
      assert.match(
        text,
        new RegExp(
          `export async function ${name}\\([^)]*\\)[^{]*\\{\\s*await requireAdmin\\(\\);`,
        ),
        name,
      );
  });
});

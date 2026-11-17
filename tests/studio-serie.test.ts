import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { SchrittEreignis } from "@/lib/admin/studio-serie";
import type { RedaktionEreignis } from "@/lib/redaktion/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import { formatShortDay } from "@/lib/admin/berlin-time";
import {
  bilderText,
  ereignisAusZeile,
  FEHLER_OHNE_TEXT,
  fortschrittMit,
  fortschrittNeu,
  GERAET_ID,
  istLokal,
  KEINE_VERBINDUNG,
  LOKAL_MAX,
  lokaleSerienAus,
  lokaleSerienMit,
  lokaleZeile,
  NEU_ANMELDEN,
  parseSerieZiel,
  redaktionBeauftragen,
  serieAlsText,
  serieAusWert,
  serieDateiname,
  tagKurz,
  zeilenLeser,
} from "@/lib/admin/studio-serie";
import {
  studioVorschlaege,
  VORSCHLAEGE_MAX,
} from "@/lib/admin/studio-vorschlaege";
import { AUFTRAG_MAX, REDAKTION_PFAD } from "@/lib/redaktion/vertrag";
import { pruefeSerie, serieAlsKarten } from "@/lib/story-serie";

const SERIE: StorySerie = {
  titel: "Black Friday",
  folien: [
    {
      rolle: "aufhaenger",
      kicker: "Mal ehrlich",
      text: "Rabatte schreien heute überall.",
      betont: "schreien",
      zusatz: "Wer leise bleibt, fällt gerade deshalb auf.",
      thema: "eindruck",
    },
    {
      rolle: "problem",
      kicker: "Red Flag",
      text: "Die Website klingt wie ein Prospekt.",
      betont: "Prospekt",
      zusatz: "Viele Prozente, aber kein Wort dazu, was Sie eigentlich tun.",
      thema: "texte",
    },
    {
      rolle: "loesung",
      kicker: "Green Flag",
      text: "Ein klarer Satz schlägt jeden Countdown.",
      betont: "klarer Satz",
      zusatz: "Sagen Sie oben, was Sie machen und für wen.",
      thema: "texte",
    },
    {
      rolle: "einladung",
      kicker: "Kurz gesagt",
      text: "Klarheit hat das ganze Jahr Saison.",
      betont: "das ganze Jahr",
      zusatz: "Schreiben Sie uns, wir schauen gemeinsam auf Ihre Startseite.",
      thema: "anfrage",
    },
  ],
};

const zeile = (e: RedaktionEreignis | Record<string, unknown>) =>
  `${JSON.stringify(e)}\n`;
const bytes = (text: string) => new TextEncoder().encode(text);

/**
 * Antwort wie von fetch, deren Strom die Stücke nacheinander liefert
 * (eins je Lesen). Ein Error als Stück lässt den Strom dort reißen.
 */
function antwort(
  stuecke: (string | Uint8Array | Error)[],
  init: ResponseInit = {},
): Response {
  let i = 0;
  const strom = new ReadableStream<Uint8Array>({
    pull(steuerung) {
      const s = stuecke[i++];
      if (s === undefined) return steuerung.close();
      if (s instanceof Error) return steuerung.error(s);
      steuerung.enqueue(typeof s === "string" ? bytes(s) : s);
    },
  });
  return new Response(strom, init);
}

describe("Beispielserie", () => {
  it("hält alle Regeln ein (sonst taugt sie nicht als Probe)", () => {
    assert.deepEqual(pruefeSerie(SERIE), []);
    assert.equal(serieAlsKarten(SERIE, "2026-11-27").length, 4);
  });
});

describe("ereignisAusZeile", () => {
  it("liest einen Arbeitsschritt, mit und ohne Hinweis", () => {
    assert.deepEqual(
      ereignisAusZeile(
        '{"typ":"schritt","schritt":"text","stand":"laeuft","hinweis":" Vier Bilder entstehen. "}',
      ),
      {
        typ: "schritt",
        schritt: "text",
        stand: "laeuft",
        hinweis: "Vier Bilder entstehen.",
      },
    );
    assert.deepEqual(
      ereignisAusZeile('{"typ":"schritt","schritt":"idee","stand":"fertig"}'),
      { typ: "schritt", schritt: "idee", stand: "fertig" },
    );
  });

  it("verwirft, was kein Ereignis ist", () => {
    for (const kaputt of [
      "",
      "   ",
      "kein json",
      "<!DOCTYPE html><html>",
      "[1,2]",
      "null",
      '"text"',
      '{"typ":"schritt","schritt":"druck","stand":"laeuft"}',
      '{"typ":"schritt","schritt":"idee","stand":"halb"}',
      '{"typ":"serie","serie":{"titel":"X","folien":[]},"id":null}',
      '{"typ":"etwas"}',
      '{"typ":"schritt"',
    ])
      assert.equal(ereignisAusZeile(kaputt), null, kaputt);
  });

  it("liest die Serie und ihre Kennung", () => {
    assert.deepEqual(
      ereignisAusZeile(
        JSON.stringify({ typ: "serie", serie: SERIE, id: "a1" }),
      ),
      { typ: "serie", serie: SERIE, id: "a1" },
    );
    const ohne = ereignisAusZeile(
      JSON.stringify({ typ: "serie", serie: SERIE, id: 7 }),
    );
    assert.equal(ohne?.typ === "serie" ? ohne.id : "?", null);
  });

  it("gibt Fehlern immer einen Satz und einen bekannten Code", () => {
    assert.deepEqual(
      ereignisAusZeile(
        '{"typ":"fehler","code":"zu_viele","text":"Zu viele Aufträge. Warte kurz."}',
      ),
      {
        typ: "fehler",
        code: "zu_viele",
        text: "Zu viele Aufträge. Warte kurz.",
      },
    );
    assert.deepEqual(ereignisAusZeile('{"typ":"fehler","code":"neu"}'), {
      typ: "fehler",
      code: "unbekannt",
      text: FEHLER_OHNE_TEXT,
    });
  });
});

describe("zeilenLeser", () => {
  const schritt = (
    s: SchrittEreignis["schritt"],
    stand: SchrittEreignis["stand"],
  ): SchrittEreignis => ({ typ: "schritt", schritt: s, stand });

  it("setzt Zeilen zusammen, die mitten im Text geteilt ankommen", () => {
    const leser = zeilenLeser();
    const ganz =
      zeile(schritt("idee", "laeuft")) + zeile(schritt("idee", "fertig"));
    const aus: RedaktionEreignis[] = [];
    // Zeichen für Zeichen: Jedes Stück endet mitten in einer Zeile.
    for (const z of ganz) aus.push(...leser.lies(z));
    assert.deepEqual(aus, [
      schritt("idee", "laeuft"),
      schritt("idee", "fertig"),
    ]);
    assert.deepEqual(leser.ende(), []);
  });

  it("verträgt Bytes, die mitten in einem Umlaut geteilt sind", () => {
    const leser = zeilenLeser();
    const roh = bytes(
      zeile({
        typ: "schritt",
        schritt: "lektorat",
        stand: "laeuft",
        hinweis: "Jeder Satz wird geprüft, auch die Größe.",
      }),
    );
    const aus: RedaktionEreignis[] = [];
    for (let i = 0; i < roh.length; i += 3)
      aus.push(...leser.lies(roh.subarray(i, i + 3)));
    assert.deepEqual(aus, [
      {
        typ: "schritt",
        schritt: "lektorat",
        stand: "laeuft",
        hinweis: "Jeder Satz wird geprüft, auch die Größe.",
      },
    ]);
  });

  it("überspringt leere und kaputte Zeilen, auch mit Windows-Zeilenenden", () => {
    const leser = zeilenLeser();
    const aus = leser.lies(
      `\r\n${JSON.stringify(schritt("idee", "laeuft"))}\r\nkaputt\r\n\r\n{"typ":"unbekannt"}\n${JSON.stringify(schritt("text", "laeuft"))}\n`,
    );
    assert.deepEqual(aus, [
      schritt("idee", "laeuft"),
      schritt("text", "laeuft"),
    ]);
  });

  it("liefert die letzte Zeile ohne Zeilenumbruch erst mit ende()", () => {
    const leser = zeilenLeser();
    assert.deepEqual(
      leser.lies(JSON.stringify({ typ: "serie", serie: SERIE, id: null })),
      [],
    );
    assert.deepEqual(leser.ende(), [{ typ: "serie", serie: SERIE, id: null }]);
    assert.deepEqual(leser.ende(), []);
  });

  it("überspringt eine überlange Zeile und liest danach weiter", () => {
    const leser = zeilenLeser();
    const lang = "x".repeat(120_000);
    assert.deepEqual(leser.lies(lang), []);
    assert.deepEqual(leser.lies(lang), []);
    // Der Rest der überlangen Zeile sieht aus wie ein Ereignis, zählt aber nicht.
    assert.deepEqual(
      leser.lies(
        `${JSON.stringify(schritt("idee", "fertig"))}\n${zeile(schritt("text", "laeuft"))}`,
      ),
      [schritt("text", "laeuft")],
    );
  });
});

describe("redaktionBeauftragen", () => {
  const auftrag = {
    auftrag: "Story-Serie zu Black Friday",
    datum: "2026-11-27",
  };

  it("meldet jeden Schritt und endet mit der Serie", async () => {
    const schritte: string[] = [];
    let gesendet: { adresse: string; init: RequestInit } | null = null;
    const aus = await redaktionBeauftragen(auftrag, {
      aufSchritt: (e) => schritte.push(`${e.schritt}:${e.stand}`),
      holen: async (adresse, init) => {
        gesendet = { adresse, init };
        return antwort([
          zeile({ typ: "schritt", schritt: "idee", stand: "laeuft" }),
          zeile({ typ: "schritt", schritt: "idee", stand: "fertig" }) +
            zeile({ typ: "schritt", schritt: "text", stand: "laeuft" }).slice(
              0,
              20,
            ),
          zeile({ typ: "schritt", schritt: "text", stand: "laeuft" }).slice(20),
          zeile({ typ: "schritt", schritt: "gestaltung", stand: "fertig" }),
          zeile({ typ: "serie", serie: SERIE, id: "s-1" }),
          // Nach der Serie zählt nichts mehr.
          zeile({ typ: "fehler", code: "modell", text: "Zu spät." }),
        ]);
      },
    });
    assert.deepEqual(aus, { art: "serie", serie: SERIE, id: "s-1" });
    assert.deepEqual(schritte, [
      "idee:laeuft",
      "idee:fertig",
      "text:laeuft",
      "gestaltung:fertig",
    ]);
    const anfrage = gesendet as { adresse: string; init: RequestInit } | null;
    assert.equal(anfrage?.adresse, REDAKTION_PFAD);
    assert.equal(anfrage?.init.method, "POST");
    assert.deepEqual(JSON.parse(String(anfrage?.init.body)), auftrag);
  });

  it("kürzt einen zu langen Auftrag auf die erlaubte Länge", async () => {
    let koerper = "";
    await redaktionBeauftragen(
      { auftrag: "a".repeat(AUFTRAG_MAX + 50), datum: "2026-11-27" },
      {
        holen: async (_adresse, init) => {
          koerper = String(init.body);
          return antwort([]);
        },
      },
    );
    assert.equal(JSON.parse(koerper).auftrag.length, AUFTRAG_MAX);
  });

  it("gibt den Fehler der Redaktion weiter, auch bei einem Fehlerstatus", async () => {
    for (const [code, text] of [
      ["kein_schluessel", "Die Agenten brauchen erst den Schlüssel."],
      ["zu_viele", "Zu viele Aufträge heute. Morgen geht es weiter."],
      ["regeln", "Die Texte haben das Lektorat nicht bestanden."],
    ] as const) {
      const aus = await redaktionBeauftragen(auftrag, {
        holen: async () =>
          antwort(
            [
              zeile({ typ: "schritt", schritt: "idee", stand: "laeuft" }),
              zeile({ typ: "fehler", code, text }),
            ],
            { status: code === "zu_viele" ? 429 : 200 },
          ),
      });
      assert.deepEqual(aus, { art: "fehler", code, text });
    }
  });

  it("meldet „Keine Verbindung“, wenn nichts Brauchbares kommt", async () => {
    const ohneAntwort = {
      art: "fehler",
      code: "verbindung",
      text: KEINE_VERBINDUNG,
    };
    // kein Netz
    assert.deepEqual(
      await redaktionBeauftragen(auftrag, {
        holen: async () => {
          throw new TypeError("Failed to fetch");
        },
      }),
      ohneAntwort,
    );
    // Fehlerstatus ohne Inhalt
    assert.deepEqual(
      await redaktionBeauftragen(auftrag, {
        holen: async () => new Response(null, { status: 502 }),
      }),
      ohneAntwort,
    );
    // Fehlerseite statt Zeilen
    assert.deepEqual(
      await redaktionBeauftragen(auftrag, {
        holen: async () =>
          antwort(["<html><body>Bad Gateway</body></html>"], { status: 502 }),
      }),
      ohneAntwort,
    );
    // Strom reißt mitten im Auftrag ab
    const schritte: string[] = [];
    assert.deepEqual(
      await redaktionBeauftragen(auftrag, {
        aufSchritt: (e) => schritte.push(e.schritt),
        holen: async () =>
          antwort([
            zeile({ typ: "schritt", schritt: "idee", stand: "laeuft" }),
            new Error("network lost"),
          ]),
      }),
      ohneAntwort,
    );
    assert.deepEqual(schritte, ["idee"]);
    // Strom endet ordentlich, aber ohne Serie
    assert.deepEqual(
      await redaktionBeauftragen(auftrag, {
        holen: async () =>
          antwort([
            zeile({ typ: "schritt", schritt: "text", stand: "fertig" }),
          ]),
      }),
      ohneAntwort,
    );
  });

  it("liest die Antwort auch ohne Strom und ohne letzten Zeilenumbruch", async () => {
    const aus = await redaktionBeauftragen(auftrag, {
      holen: async () => ({
        body: null,
        redirected: false,
        url: "",
        text: async () =>
          zeile({ typ: "schritt", schritt: "idee", stand: "fertig" }) +
          JSON.stringify({ typ: "serie", serie: SERIE, id: null }),
      }),
    });
    assert.deepEqual(aus, { art: "serie", serie: SERIE, id: null });
  });

  it("erkennt die abgelaufene Anmeldung an der Umleitung zum Login", async () => {
    const aus = await redaktionBeauftragen(auftrag, {
      holen: async () => ({
        body: null,
        redirected: true,
        url: "https://sitalo.de/admin/login",
        text: async () => "<html>",
      }),
    });
    assert.deepEqual(aus, {
      art: "fehler",
      code: "sitzung",
      text: NEU_ANMELDEN,
    });
  });

  it("endet nach dem Abbrechen still, ohne Fehler", async () => {
    // Abbruch, während auf die Antwort gewartet wird
    const stopp = new AbortController();
    const wartet = redaktionBeauftragen(auftrag, {
      signal: stopp.signal,
      holen: (_adresse, init) =>
        new Promise((_ok, nein) => {
          init.signal?.addEventListener("abort", () =>
            nein(new DOMException("Aborted", "AbortError")),
          );
        }),
    });
    stopp.abort();
    assert.deepEqual(await wartet, { art: "abbruch" });

    // Abbruch mitten im Strom
    const stopp2 = new AbortController();
    const schritte: string[] = [];
    const aus = await redaktionBeauftragen(auftrag, {
      signal: stopp2.signal,
      aufSchritt: (e) => {
        schritte.push(e.schritt);
        stopp2.abort();
      },
      holen: async (_adresse, init) => {
        let steuerung!: ReadableStreamDefaultController<Uint8Array>;
        const strom = new ReadableStream<Uint8Array>({
          start(s) {
            steuerung = s;
            s.enqueue(
              bytes(
                zeile({ typ: "schritt", schritt: "idee", stand: "laeuft" }),
              ),
            );
          },
        });
        init.signal?.addEventListener("abort", () =>
          steuerung.error(new DOMException("Aborted", "AbortError")),
        );
        return new Response(strom);
      },
    });
    assert.deepEqual(aus, { art: "abbruch" });
    assert.deepEqual(schritte, ["idee"]);
  });
});

describe("fortschrittMit", () => {
  const e = (
    schritt: SchrittEreignis["schritt"],
    stand: SchrittEreignis["stand"],
    hinweis?: string,
  ): SchrittEreignis => ({
    typ: "schritt",
    schritt,
    stand,
    ...(hinweis ? { hinweis } : {}),
  });

  it("beginnt mit vier wartenden Schritten", () => {
    assert.deepEqual(fortschrittNeu(), {
      staende: {
        idee: "wartet",
        text: "wartet",
        lektorat: "wartet",
        gestaltung: "wartet",
      },
      aktiv: null,
      hinweis: null,
    });
  });

  it("führt die Schritte der Reihe nach", () => {
    let f = fortschrittMit(fortschrittNeu(), e("idee", "laeuft", "Ich suche."));
    assert.equal(f.staende.idee, "laeuft");
    assert.equal(f.hinweis, "Ich suche.");
    // „fertig“ ohne Satz behält den Satz des Schritts.
    f = fortschrittMit(f, e("idee", "fertig"));
    assert.equal(f.staende.idee, "fertig");
    assert.equal(f.hinweis, "Ich suche.");
    f = fortschrittMit(f, e("text", "laeuft"));
    assert.deepEqual(f.staende, {
      idee: "fertig",
      text: "laeuft",
      lektorat: "wartet",
      gestaltung: "wartet",
    });
    assert.equal(f.aktiv, "text");
    assert.equal(f.hinweis, null);
  });

  it("holt fehlende „fertig“-Zeilen nach und nimmt Rückgaben zurück", () => {
    let f = fortschrittMit(fortschrittNeu(), e("lektorat", "laeuft"));
    assert.deepEqual(f.staende, {
      idee: "fertig",
      text: "fertig",
      lektorat: "laeuft",
      gestaltung: "wartet",
    });
    // Das Lektorat gibt den Text zurück.
    f = fortschrittMit(f, e("text", "laeuft", "Zweiter Anlauf."));
    assert.deepEqual(f.staende, {
      idee: "fertig",
      text: "laeuft",
      lektorat: "wartet",
      gestaltung: "wartet",
    });
    assert.equal(f.hinweis, "Zweiter Anlauf.");
  });
});

describe("serieAusWert", () => {
  it("übernimmt nur die bekannten Felder", () => {
    const roh = {
      ...SERIE,
      quelle: "https://www.hamburg.de/dom",
      fremd: 1,
      folien: SERIE.folien.map((f) => ({ ...f, extra: "x" })),
    };
    assert.deepEqual(serieAusWert(roh), {
      ...SERIE,
      quelle: "https://www.hamburg.de/dom",
    });
    // Eine Quelle ohne https fällt weg, die Serie bleibt.
    assert.deepEqual(serieAusWert({ ...SERIE, quelle: "javascript:x" }), SERIE);
  });

  it("verwirft, was der Zeichner nicht zeichnen kann", () => {
    const mit = (i: number, teil: Record<string, unknown>) => ({
      ...SERIE,
      folien: SERIE.folien.map((f, j) => (j === i ? { ...f, ...teil } : f)),
    });
    for (const kaputt of [
      null,
      "serie",
      [],
      { ...SERIE, titel: " " },
      { ...SERIE, folien: SERIE.folien.slice(0, 2) },
      { ...SERIE, folien: [...SERIE.folien, ...SERIE.folien] },
      { ...SERIE, folien: "viele" },
      mit(0, { kicker: "Neu" }),
      mit(1, { thema: "wetter" }),
      mit(1, { thema: "toString" }),
      mit(2, { rolle: "pause" }),
      mit(3, { text: "" }),
      mit(3, { zusatz: 5 }),
      mit(0, { betont: null }),
    ])
      assert.equal(serieAusWert(kaputt), null, JSON.stringify(kaputt));
  });
});

describe("Texte und Namen", () => {
  it("zählt Bilder", () => {
    assert.equal(bilderText(1), "1 Bild");
    assert.equal(bilderText(4), "4 Bilder");
  });

  it("schreibt alle Bilder der Serie untereinander", () => {
    const text = serieAlsText(SERIE);
    assert.ok(text.startsWith("Black Friday\n\nBild 1 · Aufhänger\n"));
    assert.ok(
      text.includes(
        "Bild 3 · Lösung\nEin klarer Satz schlägt jeden Countdown.\nSagen Sie oben, was Sie machen und für wen.",
      ),
    );
    assert.ok(text.endsWith("gemeinsam auf Ihre Startseite."));
    assert.equal(text.split("\n\n").length, 5);
  });

  it("schreibt den Tag kurz, wie der Post-Planer", () => {
    assert.equal(tagKurz("2026-11-27"), "Fr 27.11.");
    assert.equal(tagKurz("2027-01-03"), "So 3.1.");
    assert.equal(tagKurz("2026-11-27"), formatShortDay("2026-11-27"));
    assert.equal(tagKurz("irgendwann"), "irgendwann");
  });

  it("benennt die Bilddateien in der Reihenfolge der Serie", () => {
    assert.equal(
      serieDateiname("2026-11-27", 2, 4),
      "sitalo-2026-11-27-serie-bild-2-von-4",
    );
  });
});

describe("parseSerieZiel", () => {
  it("liest Tag, Kalendertag und Kennung", () => {
    assert.deepEqual(parseSerieZiel("tag"), { art: "tag", tag: null });
    assert.deepEqual(parseSerieZiel("heute"), { art: "tag", tag: null });
    assert.deepEqual(parseSerieZiel("2026-11-27"), {
      art: "tag",
      tag: "2026-11-27",
    });
    assert.deepEqual(parseSerieZiel("0b1c2d3e-aaaa-4bbb-8ccc-123456789abc"), {
      art: "id",
      id: "0b1c2d3e-aaaa-4bbb-8ccc-123456789abc",
    });
    assert.deepEqual(parseSerieZiel(`${GERAET_ID}abc`), {
      art: "id",
      id: `${GERAET_ID}abc`,
    });
  });

  it("verwirft alles andere", () => {
    for (const kaputt of [
      undefined,
      ["tag"],
      "",
      "2026-02-30",
      "../x",
      "a b",
      "<script>",
      "x".repeat(65),
    ])
      assert.equal(parseSerieZiel(kaputt), null, String(kaputt));
  });
});

describe("Serien auf diesem Gerät", () => {
  const JETZT = new Date("2026-11-17T09:00:00Z");

  it("legt einen Eintrag an und erkennt ihn wieder", () => {
    const z = lokaleZeile(
      SERIE,
      "x".repeat(AUFTRAG_MAX + 9),
      "2026-11-17",
      JETZT,
    );
    assert.ok(istLokal(z.id));
    assert.equal(z.auftrag.length, AUFTRAG_MAX);
    assert.equal(z.created_at, "2026-11-17T09:00:00.000Z");
    assert.equal(z.gepostet_at, null);
    assert.deepEqual(lokaleSerienAus(JSON.stringify([z])), [z]);
    assert.equal(istLokal("0b1c2d3e-aaaa-4bbb-8ccc-123456789abc"), false);
  });

  it("liest nur heile Einträge", () => {
    const gut = lokaleZeile(SERIE, "", "2026-11-17", JETZT);
    const roh = JSON.stringify([
      gut,
      { ...gut },
      { ...gut, id: "fremd-1" },
      { ...gut, id: `${GERAET_ID}b`, datum: "morgen" },
      { ...gut, id: `${GERAET_ID}c`, serie: { titel: "X", folien: [] } },
      { ...gut, id: `${GERAET_ID}d`, created_at: "irgendwann" },
      "text",
      null,
    ]);
    assert.deepEqual(lokaleSerienAus(roh), [gut]);
    assert.deepEqual(lokaleSerienAus("{kaputt"), []);
    assert.deepEqual(lokaleSerienAus('{"a":1}'), []);
    assert.deepEqual(lokaleSerienAus(null), []);
  });

  it("merkt sich die neuesten zuerst und höchstens zehn", () => {
    let liste = lokaleSerienAus(null);
    for (let i = 0; i < LOKAL_MAX + 3; i++)
      liste = lokaleSerienMit(
        liste,
        lokaleZeile(
          SERIE,
          `Auftrag ${i}`,
          "2026-11-17",
          new Date(JETZT.getTime() + i * 1000),
        ),
      );
    assert.equal(liste.length, LOKAL_MAX);
    assert.equal(liste[0].auftrag, `Auftrag ${LOKAL_MAX + 2}`);
    // Gleiche Kennung: ersetzt statt verdoppelt (etwa nach „gepostet“).
    const geaendert = { ...liste[3], gepostet_at: JETZT.toISOString() };
    const danach = lokaleSerienMit(liste, geaendert);
    assert.equal(danach.length, LOKAL_MAX);
    assert.equal(danach[0].gepostet_at, JETZT.toISOString());
  });
});

describe("studioVorschlaege", () => {
  const labels = (tag: string, heute = tag, spruch?: string) =>
    studioVorschlaege(tag, heute, spruch).map((v) => v.label);

  it("nennt, was heute läuft und was in Sicht ist, zuletzt den leeren Auftrag", () => {
    const liste = studioVorschlaege("2026-11-17", "2026-11-17", "Satz.");
    assert.deepEqual(
      liste.map((v) => v.label),
      [
        "Winterdom läuft",
        "Weihnachtsmarkt in Sicht",
        "Black Friday in Sicht",
        "Mach was zu heute",
      ],
    );
    assert.equal(liste[0].auftrag, "Story-Serie zum Anlass „Winterdom läuft“.");
    assert.equal(
      liste[2].auftrag,
      "Story-Serie zum Anlass „Black Friday“ am Fr 27.11.",
    );
    assert.equal(liste.at(-1)?.auftrag, "");
  });

  it("lässt stille Tage, laufende Termine und letzte Tage als Ausblick weg", () => {
    // 17.11.: Totensonntag (22.11.) und „Weihnachtsmarktzeit“ (ab 24.11.) kämen vor Black Friday.
    const alle = labels("2026-11-17").join("|");
    assert.ok(!alle.includes("Totensonntag"));
    assert.ok(!alle.includes("Weihnachtsmarktzeit"));
    // 27.11.: „Letzter Tag Winterdom“ (6.12.) ist kein Ausblick.
    assert.ok(!labels("2026-11-27").join("|").includes("Letzter Tag"));
    assert.deepEqual(labels("2026-11-27").slice(0, 2), [
      "Black Friday",
      "Winterdom läuft",
    ]);
  });

  it("nimmt den Spruch des Tages dazu, wenn wenig ansteht", () => {
    assert.deepEqual(labels("2027-02-10", "2027-02-10", "Ein Satz."), [
      "Valentinstag in Sicht",
      "Zum Spruch des Tages",
      "Mach was zu heute",
    ]);
    const ruhig = studioVorschlaege("2027-01-10", "2027-01-10", "Ein Satz.");
    assert.deepEqual(
      ruhig.map((v) => v.label),
      ["Zum Spruch des Tages", "Mach was zu heute"],
    );
    assert.equal(
      ruhig[0].auftrag,
      "Story-Serie zum Spruch des Tages: „Ein Satz.“",
    );
    // Ohne Spruch bleibt nur der leere Auftrag.
    assert.deepEqual(labels("2027-01-10"), ["Mach was zu heute"]);
  });

  it("spricht an anderen Tagen von „diesem Tag“", () => {
    assert.equal(
      labels("2026-11-20", "2026-11-17").at(-1),
      "Mach was zu diesem Tag",
    );
  });

  it("bleibt an jedem Tag des Jahres in den Grenzen", () => {
    for (let i = 0; i < 366; i++) {
      const tag = new Date(Date.UTC(2026, 10, 1) + i * 86_400_000)
        .toISOString()
        .slice(0, 10);
      const liste = studioVorschlaege(tag, tag, "Ein Satz, der passt.");
      assert.ok(liste.length >= 2 && liste.length <= VORSCHLAEGE_MAX, tag);
      assert.equal(new Set(liste.map((v) => v.label)).size, liste.length, tag);
      assert.equal(liste.at(-1)?.auftrag, "", tag);
      for (const v of liste) {
        assert.ok(v.label.length <= 34, `${tag}: ${v.label}`);
        assert.ok(v.auftrag.length <= AUFTRAG_MAX, tag);
      }
    }
  });
});

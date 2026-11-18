import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PostSpur, SchrittEreignis } from "@/lib/admin/instagram-strom";
import type { PostAuftrag, PostEreignis } from "@/lib/instagram/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import {
  artText,
  auftragProblem,
  captionKappen,
  captionProblem,
  ereignisAusZeile,
  FEHLER_TEXT,
  fortschrittMit,
  fortschrittNeu,
  hashtagsIn,
  instagramLink,
  kontingentFrei,
  kontoName,
  linkText,
  NEU_ANMELDEN,
  postAuftrag,
  postSenden,
  quelleSchluessel,
  schrittSatz,
  schrittZaehler,
  serieAlsCaption,
  SPUREN_MAX,
  spurenAus,
  spurenMit,
  spurSatz,
  STUDIO_SCHRITTE,
  UNKLAR,
  wannText,
  WEITER,
  zeilenLeser,
} from "@/lib/admin/instagram-strom";
import {
  CAPTION_MAX,
  HASHTAGS_MAX,
  INSTAGRAM_POSTEN_PFAD,
} from "@/lib/instagram/vertrag";
import { storyBeschriftung } from "@/lib/sprueche-data";
import { pruefeSerie } from "@/lib/story-serie";

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

const AUFTRAG: PostAuftrag = {
  art: "story",
  bilder: ["2026-11-19/a-1.jpg", "2026-11-19/a-2.jpg"],
  caption: "",
  quelle: { typ: "serie", datum: "2026-11-19", id: null },
};

const zeile = (e: PostEreignis | Record<string, unknown>) =>
  `${JSON.stringify(e)}\n`;
const bytes = (text: string) => new TextEncoder().encode(text);
const NDJSON = { "content-type": "application/x-ndjson; charset=utf-8" };

/**
 * Antwort wie von fetch, deren Strom die Stücke nacheinander liefert
 * (eins je Lesen). Ein Error als Stück lässt den Strom dort reißen.
 */
function antwort(
  stuecke: (string | Uint8Array | Error)[],
  init: ResponseInit = { headers: NDJSON },
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

const story = (stand: "laeuft" | "fertig", nr: number, von: number) =>
  zeile({ typ: "schritt", schritt: "veroeffentlichen", stand, nr, von });

describe("ereignisAusZeile", () => {
  it("liest Schritte, mit Zähler nur wenn nr und von stimmen", () => {
    assert.deepEqual(
      ereignisAusZeile(
        '{"typ":"schritt","schritt":"pruefen","stand":"laeuft"}',
      ),
      { typ: "schritt", schritt: "pruefen", stand: "laeuft" },
    );
    assert.deepEqual(
      ereignisAusZeile(
        '{"typ":"schritt","schritt":"veroeffentlichen","stand":"fertig","nr":2,"von":4}',
      ),
      {
        typ: "schritt",
        schritt: "veroeffentlichen",
        stand: "fertig",
        nr: 2,
        von: 4,
      },
    );
    // nr über von, fehlendes von, keine ganze Zahl: Schritt ohne Zähler.
    for (const extra of [
      '"nr":5,"von":4',
      '"nr":2',
      '"nr":1.5,"von":4',
      '"nr":0,"von":4',
    ])
      assert.deepEqual(
        ereignisAusZeile(
          `{"typ":"schritt","schritt":"vorbereiten","stand":"laeuft",${extra}}`,
        ),
        { typ: "schritt", schritt: "vorbereiten", stand: "laeuft" },
      );
  });

  it("verwirft unbekannte Schritte, Stände, Typen und kein JSON", () => {
    for (const z of [
      '{"typ":"schritt","schritt":"idee","stand":"laeuft"}',
      '{"typ":"schritt","schritt":"pruefen","stand":"halb"}',
      '{"typ":"serie"}',
      "[1,2]",
      "Hallo",
      "<!doctype html>",
      "",
      '{"typ":"fertig"',
    ])
      assert.equal(ereignisAusZeile(z), null, z);
  });

  it("„fertig“: nur Links zu Instagram, Konto ohne @, Hinweis gekürzt", () => {
    const e = ereignisAusZeile(
      JSON.stringify({
        typ: "fertig",
        links: [
          "https://www.instagram.com/p/ABC123/",
          "https://www.instagram.com/p/ABC123/",
          "javascript:alert(1)",
          "http://www.instagram.com/p/unsicher/",
          "https://instagram.com.boese.example/p/x/",
          "https://instagr.am/p/kurz/",
          42,
        ],
        konto: " @sitalo.hamburg ",
        hinweis: "  Die Bildunterschrift   fehlt. ",
      }),
    );
    assert.deepEqual(e, {
      typ: "fertig",
      links: [
        "https://www.instagram.com/p/ABC123/",
        "https://instagr.am/p/kurz/",
      ],
      konto: "sitalo.hamburg",
      hinweis: "Die Bildunterschrift fehlt.",
    });
    assert.deepEqual(ereignisAusZeile('{"typ":"fertig","konto":"a b"}'), {
      typ: "fertig",
      links: [],
      konto: "",
    });
  });

  it("„fehler“: unbekannter Code wird „unbekannt“, fehlender Satz bekommt einen", () => {
    assert.deepEqual(ereignisAusZeile('{"typ":"fehler","code":"limit"}'), {
      typ: "fehler",
      code: "limit",
      text: FEHLER_TEXT.limit,
    });
    assert.deepEqual(
      ereignisAusZeile('{"typ":"fehler","code":"weltuntergang","text":"Oh."}'),
      { typ: "fehler", code: "unbekannt", text: "Oh." },
    );
  });

  it("„fehler“: teil nur, wenn er stimmt und etwas live ist", () => {
    const mit = (teil: unknown) =>
      ereignisAusZeile(
        JSON.stringify({ typ: "fehler", code: "instagram", text: "x", teil }),
      );
    assert.deepEqual(
      mit({
        veroeffentlicht: 2,
        von: 4,
        links: ["https://www.instagram.com/stories/sitalo/1/", "ftp://x"],
      }),
      {
        typ: "fehler",
        code: "instagram",
        text: "x",
        teil: {
          veroeffentlicht: 2,
          von: 4,
          links: ["https://www.instagram.com/stories/sitalo/1/"],
        },
      },
    );
    for (const teil of [
      { veroeffentlicht: 0, von: 4 },
      { veroeffentlicht: 5, von: 4 },
      { veroeffentlicht: "2", von: 4 },
      null,
      [2, 4],
    ])
      assert.deepEqual(mit(teil), {
        typ: "fehler",
        code: "instagram",
        text: "x",
      });
  });
});

describe("instagramLink und kontoName", () => {
  it("prüfen streng", () => {
    assert.equal(
      instagramLink(" https://www.instagram.com/p/X/ "),
      "https://www.instagram.com/p/X/",
    );
    assert.equal(instagramLink("https://user:pw@www.instagram.com/p/X/"), null);
    assert.equal(instagramLink("https://evilinstagram.com/p/X/"), null);
    assert.equal(instagramLink("nichts"), null);
    assert.equal(kontoName("@sitalo_hh"), "sitalo_hh");
    assert.equal(kontoName("x".repeat(31)), "");
    assert.equal(kontoName("<script>"), "");
    assert.equal(kontoName(null), "");
  });
});

describe("zeilenLeser", () => {
  it("setzt Zeilen und Umlaute zusammen, die mitten durch geteilt sind", () => {
    const leser = zeilenLeser();
    const ganz = bytes(
      zeile({ typ: "fehler", code: "bild", text: "Größe passt nicht." }),
    );
    // Mitten im „ö“ (zwei Bytes) teilen.
    const mitte = ganz.indexOf(0xc3) + 1;
    assert.deepEqual(leser.lies(ganz.subarray(0, mitte)), []);
    assert.deepEqual(leser.lies(ganz.subarray(mitte)), [
      { typ: "fehler", code: "bild", text: "Größe passt nicht." },
    ]);
    assert.deepEqual(leser.ende(), []);
  });

  it("liefert die letzte Zeile ohne Umbruch erst bei ende()", () => {
    const leser = zeilenLeser();
    const z = zeile({ typ: "fertig", links: [], konto: "sitalo" }).trim();
    assert.deepEqual(leser.lies(`kein json\n${z}`), []);
    assert.deepEqual(leser.ende(), [
      { typ: "fertig", links: [], konto: "sitalo" },
    ]);
  });

  it("überspringt eine überlange Zeile bis zu ihrem Umbruch", () => {
    const leser = zeilenLeser();
    assert.deepEqual(
      leser.lies(`{"typ":"fertig","x":"${"a".repeat(30_000)}`),
      [],
    );
    assert.deepEqual(
      leser.lies(
        `"}\n${zeile({ typ: "schritt", schritt: "pruefen", stand: "laeuft" })}`,
      ),
      [{ typ: "schritt", schritt: "pruefen", stand: "laeuft" }],
    );
  });
});

describe("postSenden", () => {
  it("schickt den Auftrag, meldet jeden Schritt und endet mit „fertig“", async () => {
    const schritte: string[] = [];
    let gesendet: { adresse: string; init: RequestInit } | null = null;
    const aus = await postSenden(AUFTRAG, {
      aufSchritt: (e: SchrittEreignis) =>
        schritte.push(
          `${e.schritt}:${e.stand}${e.nr ? `:${e.nr}/${e.von}` : ""}`,
        ),
      holen: async (adresse, init) => {
        gesendet = { adresse, init };
        return antwort([
          zeile({ typ: "schritt", schritt: "pruefen", stand: "laeuft" }),
          zeile({ typ: "schritt", schritt: "pruefen", stand: "fertig" }) +
            story("laeuft", 1, 2).slice(0, 15),
          story("laeuft", 1, 2).slice(15),
          story("fertig", 1, 2),
          zeile({
            typ: "fertig",
            links: ["https://www.instagram.com/stories/sitalo/1/"],
            konto: "sitalo",
          }),
          // Nach „fertig“ zählt nichts mehr.
          zeile({ typ: "fehler", code: "unbekannt", text: "Zu spät." }),
        ]);
      },
    });
    assert.deepEqual(aus, {
      art: "fertig",
      links: ["https://www.instagram.com/stories/sitalo/1/"],
      konto: "sitalo",
      hinweis: null,
    });
    assert.deepEqual(schritte, [
      "pruefen:laeuft",
      "pruefen:fertig",
      "veroeffentlichen:laeuft:1/2",
      "veroeffentlichen:fertig:1/2",
    ]);
    assert.ok(gesendet);
    const g = gesendet as { adresse: string; init: RequestInit };
    assert.equal(g.adresse, INSTAGRAM_POSTEN_PFAD);
    assert.equal(g.init.method, "POST");
    assert.deepEqual(JSON.parse(g.init.body as string), AUFTRAG);
    assert.equal(
      (g.init.headers as Record<string, string>)["content-type"],
      "application/json",
    );
  });

  it("gibt den Fehler mit dem Teil weiter, der schon live ist", async () => {
    const aus = await postSenden(AUFTRAG, {
      holen: async () =>
        antwort([
          story("fertig", 2, 4),
          zeile({
            typ: "fehler",
            code: "limit",
            text: "Tageslimit erreicht.",
            teil: { veroeffentlicht: 2, von: 4, links: [] },
          }),
        ]),
    });
    assert.deepEqual(aus, {
      art: "fehler",
      code: "limit",
      text: "Tageslimit erreicht.",
      teil: { veroeffentlicht: 2, von: 4, links: [] },
      unklar: false,
      sitzung: false,
    });
  });

  it("ohne 2xx oder mit anderem Inhaltstyp: „unbekannt“ (Vertrag)", async () => {
    for (const init of [
      { status: 500, headers: NDJSON },
      { status: 200, headers: { "content-type": "text/html" } },
      { status: 200 },
    ]) {
      const aus = await postSenden(AUFTRAG, {
        holen: async () => antwort(["<!doctype html><p>Login</p>"], init),
      });
      assert.equal(aus.art, "fehler");
      if (aus.art !== "fehler") continue;
      assert.equal(aus.code, "unbekannt");
      assert.equal(aus.unklar, false);
      assert.equal(aus.sitzung, false);
    }
  });

  it("nach abgelaufener Anmeldung: neu anmelden", async () => {
    const aus = await postSenden(AUFTRAG, {
      holen: async () => {
        const a = antwort(["<html></html>"], {
          headers: { "content-type": "text/html" },
        });
        Object.defineProperty(a, "redirected", { value: true });
        Object.defineProperty(a, "url", {
          value: "https://sitalo.de/admin/login?next=%2Fadmin%2Fstory",
        });
        return a;
      },
    });
    assert.deepEqual(aus, {
      art: "fehler",
      code: "unbekannt",
      text: NEU_ANMELDEN,
      teil: null,
      unklar: false,
      sitzung: true,
    });
  });

  it("Strom endet ohne letzte Zeile: unklar, mit dem, was sicher live ist", async () => {
    const aus = await postSenden(AUFTRAG, {
      holen: async () =>
        antwort([
          story("laeuft", 1, 4),
          story("fertig", 1, 4),
          story("laeuft", 2, 4),
          story("fertig", 2, 4),
          story("laeuft", 3, 4),
        ]),
    });
    assert.deepEqual(aus, {
      art: "fehler",
      code: "unbekannt",
      text: UNKLAR,
      teil: { veroeffentlicht: 2, von: 4, links: [] },
      unklar: true,
      sitzung: false,
    });
  });

  it("Strom reißt oder der Abruf scheitert: unklar", async () => {
    const gerissen = await postSenden(AUFTRAG, {
      holen: async () =>
        antwort([
          zeile({ typ: "schritt", schritt: "pruefen", stand: "laeuft" }),
          new Error("weg"),
        ]),
    });
    assert.equal(gerissen.art === "fehler" && gerissen.unklar, true);
    assert.equal(gerissen.art === "fehler" && gerissen.teil, null);
    const ohneNetz = await postSenden(AUFTRAG, {
      holen: async () => {
        throw new TypeError("Failed to fetch");
      },
    });
    assert.equal(ohneNetz.art === "fehler" && ohneNetz.unklar, true);
  });

  it("die letzte Zeile zählt auch, wenn der Strom danach reißt", async () => {
    const aus = await postSenden(AUFTRAG, {
      holen: async () =>
        antwort([
          zeile({ typ: "fertig", links: [], konto: "sitalo", hinweis: "x" }),
          new Error("weg"),
        ]),
    });
    assert.deepEqual(aus, {
      art: "fertig",
      links: [],
      konto: "sitalo",
      hinweis: "x",
    });
  });
});

describe("postAuftrag", () => {
  it("lässt bei Stories die Bildunterschrift weg", () => {
    const q = { typ: "post" as const, datum: "2026-11-19", platz: 1 };
    assert.equal(postAuftrag("story", ["a"], "Text #x", q).caption, "");
    assert.deepEqual(postAuftrag("beitrag", ["a"], " Text #x ", q), {
      art: "beitrag",
      bilder: ["a"],
      caption: "Text #x",
      quelle: q,
    });
  });
});

describe("Fortschritt", () => {
  it("führt die Schritte vom Zeichnen bis zum Veröffentlichen", () => {
    let f = fortschrittNeu();
    assert.deepEqual(STUDIO_SCHRITTE, [
      "bilder",
      "hochladen",
      "pruefen",
      "vorbereiten",
      "veroeffentlichen",
    ]);
    f = fortschrittMit(f, {
      schritt: "bilder",
      stand: "laeuft",
      nr: 2,
      von: 4,
    });
    assert.equal(schrittZaehler(f, "bilder"), "2 von 4");
    assert.equal(schrittSatz(f, "story"), "Bild 2 von 4 entsteht.");
    // „fertig“ ohne Zähler behält den Zähler desselben Schritts.
    f = fortschrittMit(f, { schritt: "bilder", stand: "fertig" });
    assert.equal(f.nr, 2);
    // Ein neuer Schritt ohne Zähler hat keinen.
    f = fortschrittMit(f, { schritt: "pruefen", stand: "laeuft" });
    assert.equal(f.nr, null);
    assert.equal(schrittZaehler(f, "bilder"), null);
    // Fehlende Zeilen: Alles davor gilt als fertig.
    f = fortschrittMit(f, {
      schritt: "veroeffentlichen",
      stand: "laeuft",
      nr: 3,
      von: 4,
    });
    assert.deepEqual(f.staende, {
      bilder: "fertig",
      hochladen: "fertig",
      pruefen: "fertig",
      vorbereiten: "fertig",
      veroeffentlichen: "laeuft",
    });
    assert.equal(schrittSatz(f, "story"), "Story 3 von 4 wird veröffentlicht.");
    assert.equal(schrittSatz(f, "beitrag"), "Wird veröffentlicht.");
  });

  it("zeigt bei einem einzelnen Bild keinen Zähler", () => {
    const f = fortschrittMit(fortschrittNeu(), {
      schritt: "hochladen",
      stand: "laeuft",
      nr: 1,
      von: 1,
    });
    assert.equal(schrittZaehler(f, "hochladen"), null);
    assert.equal(schrittSatz(f, "story"), "Bild wird hochgeladen.");
  });
});

describe("Texte", () => {
  it("artText und linkText", () => {
    assert.equal(artText("story", 1), "1 Story");
    assert.equal(artText("story", 4), "4 Stories");
    assert.equal(artText("beitrag", 1), "1 Beitrag");
    assert.equal(artText("beitrag", 4), "Karussell mit 4 Bildern");
    assert.equal(linkText(0, 1, "beitrag"), "Auf Instagram ansehen");
    assert.equal(linkText(1, 3, "story"), "Story 2 ansehen");
  });

  it("jeder Fehlercode hat einen Satz und einen nächsten Schritt", () => {
    for (const code of Object.keys(FEHLER_TEXT) as (keyof typeof WEITER)[]) {
      assert.ok(FEHLER_TEXT[code].length > 10);
      assert.ok(WEITER[code].satz.length > 10);
    }
    assert.equal(WEITER.zugang.schritt, "verbinden");
    assert.equal(WEITER.nicht_verbunden.schritt, "verbinden");
    assert.equal(WEITER.limit.schritt, "spaeter");
    assert.equal(WEITER.bild.schritt, "design");
  });

  it("auftragProblem und kontingentFrei", () => {
    assert.equal(auftragProblem("story", 4), null);
    assert.ok(auftragProblem("story", 0));
    assert.ok(auftragProblem("beitrag", 11));
    assert.equal(kontingentFrei(null), null);
    assert.equal(
      kontingentFrei({ verbunden: false, grund: "kein_token" }),
      null,
    );
    const verbunden = {
      verbunden: true as const,
      konto: { id: "1", name: "sitalo" },
      problem: null,
    };
    assert.equal(
      kontingentFrei({
        ...verbunden,
        kontingent: { genutzt: 97, gesamt: 100 },
      }),
      3,
    );
    assert.equal(
      kontingentFrei({
        ...verbunden,
        kontingent: { genutzt: 120, gesamt: 100 },
      }),
      0,
    );
    assert.equal(kontingentFrei({ ...verbunden, kontingent: null }), null);
  });
});

describe("Bildunterschrift", () => {
  it("zählt Hashtags, nicht mitten im Wort", () => {
    assert.deepEqual(hashtagsIn("#webdesign Text #hamburg\n#größe C#sharp"), [
      "#webdesign",
      "#hamburg",
      "#größe",
    ]);
    assert.deepEqual(hashtagsIn("&#123; # allein ##doppelt"), []);
  });

  it("kappt den Beitragstext des Tages auf höchstens fünf Hashtags", () => {
    // Fester Teil (3) + Thema (2) + Anlass (1) = 6 Hashtags.
    const roh = storyBeschriftung({
      text: "Rabatte schreien heute überall.",
      zusatz: "Wer leise bleibt, fällt auf.",
      thema: "eindruck",
      anlass: "Black Friday",
    });
    assert.equal(hashtagsIn(roh).length, 6);
    assert.ok(captionProblem(roh));
    const gekappt = captionKappen(roh);
    assert.equal(hashtagsIn(gekappt).length, HASHTAGS_MAX);
    assert.deepEqual(hashtagsIn(gekappt), hashtagsIn(roh).slice(0, 5));
    assert.equal(captionProblem(gekappt), null);
    assert.ok(gekappt.startsWith("Rabatte schreien heute überall.\n"));
    assert.ok(!/ $/m.test(gekappt));
  });

  it("kürzt auf CAPTION_MAX, ohne ein Emoji zu teilen", () => {
    const lang = `${"a".repeat(CAPTION_MAX - 1)}😀 Ende`;
    const kurz = captionKappen(lang);
    assert.ok(kurz.length <= CAPTION_MAX);
    assert.equal(kurz, "a".repeat(CAPTION_MAX - 1));
    assert.match(captionProblem("a".repeat(CAPTION_MAX + 1)) ?? "", /2200/);
  });

  it("Serie als Karussell: Titel und Sätze, ohne die Aufgaben der Bilder", () => {
    assert.deepEqual(pruefeSerie(SERIE), []);
    const text = serieAlsCaption(SERIE);
    assert.ok(
      text.startsWith("Black Friday\n\nRabatte schreien heute überall.\n"),
    );
    assert.ok(text.includes("Klarheit hat das ganze Jahr Saison."));
    assert.ok(!/Aufhänger|Bild 1/.test(text));
    const tags = hashtagsIn(text);
    assert.ok(tags.length > 0 && tags.length <= HASHTAGS_MAX);
    assert.equal(captionProblem(text), null);
  });
});

describe("Spuren auf diesem Gerät", () => {
  const spur = (extra: Partial<PostSpur> = {}): PostSpur => ({
    schluessel: "serie:2026-11-19:tag",
    art: "story",
    anzahl: 4,
    wann: "2026-11-19T09:42:00.000Z",
    ergebnis: "gepostet",
    live: 4,
    links: [],
    ...extra,
  });

  it("quelleSchluessel", () => {
    assert.equal(
      quelleSchluessel({ typ: "serie", datum: "2026-11-19", id: null }),
      "serie:2026-11-19:tag",
    );
    assert.equal(
      quelleSchluessel({ typ: "serie", datum: "2026-11-19", id: "abc" }),
      "serie:2026-11-19:abc",
    );
    assert.equal(
      quelleSchluessel({ typ: "post", datum: "2026-11-19", platz: 2 }),
      "post:2026-11-19:2",
    );
  });

  it("liest großzügig und wirft Kaputtes weg", () => {
    assert.deepEqual(spurenAus(null), []);
    assert.deepEqual(spurenAus("kaputt"), []);
    assert.deepEqual(spurenAus('{"a":1}'), []);
    const roh = JSON.stringify([
      spur({ live: 9, links: ["https://www.instagram.com/p/1/", "x"] }),
      spur(), // doppelt: fällt weg
      spur({ art: "beitrag", ergebnis: "teil" as const }),
      { ...spur(), schluessel: "fremd:1" },
      { ...spur(), wann: "gestern" },
      { ...spur(), ergebnis: "vielleicht" },
      { ...spur(), anzahl: 0 },
    ]);
    const gelesen = spurenAus(roh);
    assert.equal(gelesen.length, 2);
    assert.equal(gelesen[0].live, 4);
    assert.deepEqual(gelesen[0].links, ["https://www.instagram.com/p/1/"]);
  });

  it("neueste zuerst, gleiche Quelle und Art ersetzt, höchstens SPUREN_MAX", () => {
    let liste: PostSpur[] = [];
    for (let i = 0; i < SPUREN_MAX + 5; i++)
      liste = spurenMit(liste, spur({ schluessel: `post:2026-11-19:${i}` }));
    assert.equal(liste.length, SPUREN_MAX);
    assert.equal(liste[0].schluessel, `post:2026-11-19:${SPUREN_MAX + 4}`);
    const neu = spurenMit(
      liste,
      spur({
        schluessel: `post:2026-11-19:${SPUREN_MAX + 2}`,
        ergebnis: "teil",
        live: 2,
      }),
    );
    assert.equal(neu.length, SPUREN_MAX);
    assert.equal(neu[0].ergebnis, "teil");
    assert.equal(
      neu.filter((s) => s.schluessel === `post:2026-11-19:${SPUREN_MAX + 2}`)
        .length,
      1,
    );
  });

  it("sagt in Hamburger Zeit, was schon live ist", () => {
    assert.equal(wannText("2026-11-19T09:42:00.000Z"), "am 19.11. um 10:42");
    assert.equal(wannText("kaputt"), "");
    assert.equal(
      spurSatz(spur()),
      "Schon auf Instagram: 4 Stories, am 19.11. um 10:42.",
    );
    assert.equal(
      spurSatz(spur({ ergebnis: "teil", live: 2 })),
      "Zum Teil auf Instagram: 2 von 4 Stories, am 19.11. um 10:42.",
    );
    assert.match(spurSatz(spur({ ergebnis: "unklar", live: 0 })), /Unklar/);
  });
});

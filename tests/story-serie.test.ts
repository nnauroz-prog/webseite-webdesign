import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { anlaesseImJahr, naechsteAnlaesse } from "@/lib/anlaesse";
import { POSTS_AKTUELL } from "@/lib/posts-aktuell";
import { SERIEN_AKTUELL, serieFuer } from "@/lib/serien-aktuell";
import {
  SPRUECHE,
  SPRUECHE_EXTRA,
  spruchTag,
  tagVersetzt,
} from "@/lib/sprueche-data";
import {
  ROLLE_LABEL,
  SERIE_MAX,
  SERIE_MIN,
  SERIE_PLATZ,
  SERIE_ROLLEN,
  pruefeSerie,
  serieAlsKarten,
  type SerieFolie,
  type StorySerie,
} from "@/lib/story-serie";
import {
  SERIE_LAYOUTS,
  filmFuerFolge,
  gestaltungFuer,
  varianteFuer,
} from "@/lib/story-variante";
import { ohneAnlass, woerter, zuAehnlich } from "@/tests/karten-vergleich";

/** Eine Serie, die alle Regeln einhält: Grundlage für die Gegenproben. */
const SAUBER: StorySerie = {
  titel: "Winterdom läuft",
  quelle: "https://www.hamburg.de/freizeit/dom/termine-337422",
  folien: [
    {
      rolle: "aufhaenger",
      kicker: "POV",
      text: "Nach dem Riesenrad knurrt der Magen.",
      betont: "knurrt der Magen",
      zusatz: "Gesucht wird jetzt mit kalten Fingern am Handy.",
      thema: "handy",
    },
    {
      rolle: "problem",
      kicker: "Red Flag",
      text: "Die Speisekarte ist ein winziges Foto.",
      betont: "winziges Foto",
      zusatz: "Wer zoomen muss, läuft lieber eine Tür weiter.",
      thema: "handy",
    },
    {
      rolle: "loesung",
      kicker: "Green Flag",
      text: "Zeiten, Karte und Weg stehen ganz vorn.",
      betont: "ganz vorn",
      zusatz: "Ein Blick genügt, und der Tisch ist gefunden.",
      thema: "google",
    },
    {
      rolle: "einladung",
      kicker: "Kurz gesagt",
      text: "Sagen Sie uns, was bei Ihnen vorn stehen soll.",
      betont: "vorn stehen soll",
      zusatz: "Ein paar Zeilen genügen. Wir melden uns.",
      thema: "anfrage",
    },
  ],
};

/** Die Serie mit geänderten Bildern (ändern bekommt eine Kopie der Bilder). */
function mitBildern(
  aendern: (folien: Record<string, unknown>[]) => unknown[],
): unknown {
  return {
    ...SAUBER,
    folien: aendern(SAUBER.folien.map((f) => ({ ...f }))),
  };
}
/** Ein Bild der Serie mit geänderten Feldern. */
const mitBild = (nr: number, aenderung: Record<string, unknown>) =>
  mitBildern((folien) => {
    folien[nr - 1] = { ...folien[nr - 1], ...aenderung };
    return folien;
  });
const bild = (rolle: string, nr: number): Record<string, unknown> => ({
  ...SAUBER.folien[1],
  rolle,
  text: `Noch ein eigener Satz mit Nummer ${["null", "eins", "zwei", "drei", "vier", "fünf", "sechs"][nr]}.`,
  betont: "eigener Satz",
});

function meldet(serie: unknown, muster: RegExp, name: string) {
  const fehler = pruefeSerie(serie);
  assert.ok(
    fehler.some((f) => muster.test(f)),
    `${name}: ${JSON.stringify(fehler)}`,
  );
}

describe("Regeln für eine Story-Serie", () => {
  it("lässt eine saubere Serie durch, mit drei bis fünf Bildern", () => {
    assert.deepEqual(pruefeSerie(SAUBER), []);
    // Ohne Quelle, ohne Problem (drei Bilder), mit zwei Problemen (fünf).
    assert.deepEqual(
      pruefeSerie({ titel: SAUBER.titel, folien: SAUBER.folien }),
      [],
    );
    assert.deepEqual(pruefeSerie(mitBildern((f) => [f[0], f[2], f[3]])), []);
    assert.deepEqual(
      pruefeSerie(
        mitBildern((f) => [f[0], f[1], bild("problem", 2), f[2], f[3]]),
      ),
      [],
    );
    assert.equal(SERIE_MIN, 3);
    assert.equal(SERIE_MAX, 5);
    assert.deepEqual(
      [...SERIE_ROLLEN],
      ["aufhaenger", "problem", "loesung", "einladung"],
    );
    for (const rolle of SERIE_ROLLEN) assert.ok(ROLLE_LABEL[rolle]);
  });

  it("meldet, was keine Serie ist", () => {
    for (const nichts of [null, undefined, "Serie", 4])
      assert.deepEqual(pruefeSerie(nichts), ["Serie fehlt."]);
    meldet({ titel: SAUBER.titel }, /^Bilder fehlen/, "ohne Bilder");
    meldet({ ...SAUBER, folien: "vier" }, /^Bilder fehlen/, "Bilder kein Feld");
    meldet(
      mitBildern((f) => [f[0], null, f[2], f[3]]),
      /^Bild 2: Karte fehlt/,
      "leeres Bild",
    );
  });

  it("lässt im Titel keine Du-Form durch (er steht auf jedem Bild)", () => {
    for (const titel of ["Dein Advent", "Für euren Laden", "Was du brauchst"])
      assert.ok(
        pruefeSerie({ ...SAUBER, titel }).some((f) => /Du-Form/.test(f)),
        titel,
      );
    assert.deepEqual(pruefeSerie({ ...SAUBER, titel: "Advent in Sicht" }), []);
  });

  it("erkennt verbotene Wörter auch klein geschrieben und gebeugt", () => {
    const mit = (text: string, betont: string) =>
      pruefeSerie({
        ...SAUBER,
        folien: SAUBER.folien.map((f, i) =>
          i === 1 ? { ...f, text, betont } : f,
        ),
      });
    for (const [text, betont] of [
      ["Die Seite verspricht garantierte Anfragen.", "Anfragen"],
      ["Überall stehen Garantien und Siegel.", "Siegel"],
      ["Wir garantieren eine Antwort am selben Tag.", "selben Tag"],
      ["Dazu gibt es eine Zufriedenheitsgarantie.", "gibt es"],
      ["Die ausgezeichnete Agentur von nebenan.", "nebenan"],
      ["Ohne seo geht hier angeblich nichts.", "nichts"],
      ["Den Text schrieb eine künstlicher Intelligenz.", "Text"],
      ["Auf deines Nachbarn Seite steht mehr.", "mehr"],
      ["Auf eurer Seite fehlt die Adresse.", "Adresse"],
    ])
      assert.ok(
        mit(text, betont).some((f) =>
          /^Bild 2: (Nicht erlaubt|Du-Form)/.test(f),
        ),
        text,
      );
    // Wörter, die nur so ähnlich aussehen, bleiben erlaubt.
    for (const [text, betont] of [
      ["Im Mai wird die Karte neu gemacht.", "neu gemacht"],
      ["In Kiel sucht man genauso am Handy.", "am Handy"],
      ["Das Taxi wartet nicht auf die Website.", "wartet nicht"],
    ])
      assert.deepEqual(mit(text, betont), [], text);
  });

  it("meldet jeden Verstoß im Titel und in der Quelle", () => {
    const faelle: [string, unknown, RegExp][] = [
      ["Titel fehlt", { ...SAUBER, titel: undefined }, /^Titel fehlt/],
      ["Titel zu kurz", { ...SAUBER, titel: "Zu" }, /^Titel hat 2 Zeichen/],
      [
        "Titel zu lang",
        { ...SAUBER, titel: "Weihnachtsmarkt am Rathausmarkt" },
        /^Titel hat 31 Zeichen/,
      ],
      [
        "Titel mit Leerzeichen am Rand",
        { ...SAUBER, titel: "Winterdom läuft " },
        /^Titel hat Leerzeichen am Rand/,
      ],
      [
        "Ziffer im Titel",
        { ...SAUBER, titel: "Advent Nummer 1" },
        /^Im Titel nicht erlaubt: „1“/,
      ],
      [
        "Marke im Titel",
        { ...SAUBER, titel: "Neues auf Instagram" },
        /^Im Titel nicht erlaubt: „Instagram“/,
      ],
      [
        "Emoji im Titel",
        { ...SAUBER, titel: "Winterdom läuft \u{1F3A1}" },
        /^Im Titel sind Emojis nicht erlaubt/,
      ],
      [
        "Satzzeichen am Ende",
        { ...SAUBER, titel: "Winterdom läuft!" },
        /^Titel endet mit einem Satzzeichen/,
      ],
      [
        "Quelle ohne https",
        { ...SAUBER, quelle: "http://www.hamburg.de/dom" },
        /^Quelle muss eine Adresse mit https/,
      ],
      [
        "Quelle mit Leerzeichen",
        { ...SAUBER, quelle: "https://www.hamburg.de/ dom" },
        /^Quelle muss eine Adresse mit https/,
      ],
      ["Quelle keine Adresse", { ...SAUBER, quelle: 7 }, /^Quelle muss/],
    ];
    for (const [name, serie, muster] of faelle) meldet(serie, muster, name);
  });

  it("meldet jeden Verstoß in Anzahl, Aufgaben und Reihenfolge der Bilder", () => {
    const [a, p, l, e] = [0, 1, 2, 3];
    const faelle: [string, unknown, RegExp][] = [
      [
        "zwei Bilder",
        mitBildern((f) => [f[a], f[e]]),
        /^Serie hat 2 Bilder \(erlaubt 3 bis 5\)/,
      ],
      [
        "sechs Bilder",
        mitBildern((f) => [
          f[a],
          f[p],
          bild("problem", 2),
          bild("problem", 3),
          f[l],
          f[e],
        ]),
        /^Serie hat 6 Bilder/,
      ],
      [
        "Aufgabe unbekannt",
        mitBild(2, { rolle: "beweis" }),
        /^Bild 2: Aufgabe unbekannt \(beweis\)/,
      ],
      [
        "Aufgabe fehlt",
        mitBild(3, { rolle: undefined }),
        /^Bild 3: Aufgabe unbekannt/,
      ],
      [
        "beginnt nicht mit dem Aufhänger",
        mitBildern((f) => [f[p], f[l], f[e]]),
        /^Das erste Bild muss der Aufhänger sein/,
      ],
      [
        "endet nicht mit der Einladung",
        mitBildern((f) => [f[a], f[p], f[l]]),
        /^Das letzte Bild muss die Einladung sein/,
      ],
      [
        "Lösung vor dem Problem",
        mitBildern((f) => [f[a], f[l], f[p], f[e]]),
        /^Reihenfolge: Aufhänger, dann Problem, dann Lösung, dann Einladung/,
      ],
      [
        "zwei Aufhänger",
        mitBildern((f) => [f[a], bild("aufhaenger", 1), f[l], f[e]]),
        /^Nur ein Aufhänger je Serie/,
      ],
      [
        "zwei Einladungen",
        mitBildern((f) => [f[a], f[l], bild("einladung", 1), f[e]]),
        /^Nur eine Einladung je Serie/,
      ],
      [
        "keine Lösung",
        mitBildern((f) => [f[a], f[p], f[e]]),
        /^Mindestens ein Bild muss die Lösung zeigen/,
      ],
      [
        "Satz doppelt",
        mitBild(3, { text: SAUBER.folien[1].text.toUpperCase() }),
        /^Bild 3: Satz steht doppelt/,
      ],
    ];
    for (const [name, serie, muster] of faelle) meldet(serie, muster, name);
  });

  it("prüft jedes Bild mit den Regeln einer Karte und nennt seine Nummer", () => {
    const faelle: [string, number, Record<string, unknown>, RegExp][] = [
      ["Kicker", 1, { kicker: "Achtung" }, /^Bild 1: Kicker unbekannt/],
      ["Thema", 2, { thema: "wetter" }, /^Bild 2: Thema unbekannt/],
      [
        "Satz zu lang",
        3,
        { text: `${"Sehr lang ".repeat(8)}ist das.`, betont: "ist das" },
        /^Bild 3: Satz hat 88 Zeichen/,
      ],
      [
        "Satz ohne Satzende",
        4,
        { text: "Sagen Sie uns, was bei Ihnen vorn stehen soll" },
        /^Bild 4: Satz endet nicht/,
      ],
      ["Zusatz zu kurz", 1, { zusatz: "Na ja." }, /^Bild 1: Zusatz hat 6/],
      [
        "Ziffer",
        2,
        { zusatz: "Wer zoomen muss, ist nach 3 Sekunden weg." },
        /^Bild 2: Nicht erlaubt: „3“/,
      ],
      [
        "Marke",
        3,
        { zusatz: "So steht es auch bei WhatsApp im Status." },
        /^Bild 3: Nicht erlaubt: „WhatsApp“/,
      ],
      [
        "Du-Form",
        4,
        { zusatz: "Ein paar Zeilen genügen. Wir melden uns bei dir." },
        /^Bild 4: Du-Form: „dir“/,
      ],
      [
        "Emoji",
        1,
        { zusatz: "Gesucht wird jetzt mit kalten Fingern \u{1F9E4}." },
        /^Bild 1: Emojis sind nicht erlaubt/,
      ],
      [
        "zwei Ausrufezeichen",
        2,
        { zusatz: "Wer zoomen muss, läuft weiter! Und zwar sofort!" },
        /^Bild 2: Höchstens ein Ausrufezeichen/,
      ],
      [
        "Pointe nicht im Satz",
        3,
        { betont: "ganz hinten" },
        /^Bild 3: Pointe „ganz hinten“ steht nicht wörtlich im Satz/,
      ],
      [
        "Pointe mitten im Wort",
        4,
        { betont: "orn stehen soll" },
        /^Bild 4: Pointe „orn stehen soll“ beginnt oder endet mitten im Wort/,
      ],
    ];
    for (const [name, nr, aenderung, muster] of faelle)
      meldet(mitBild(nr, aenderung), muster, name);
  });
});

describe("Bilder einer Serie für den Zeichner", () => {
  const karten = serieAlsKarten(SAUBER, "2026-11-20");

  it("gibt jedem Bild seine Stelle, seine Aufgabe und den Titel als Anlass", () => {
    assert.equal(karten.length, SAUBER.folien.length);
    karten.forEach((k, i) => {
      const f = SAUBER.folien[i];
      assert.deepEqual(k.folge, { nr: i + 1, von: 4 });
      assert.equal(k.rolle, f.rolle);
      assert.equal(k.anlass, SAUBER.titel);
      assert.deepEqual(
        [k.kicker, k.text, k.betont, k.zusatz, k.thema],
        [f.kicker, f.text, f.betont, f.zusatz, f.thema],
      );
      assert.equal(k.herkunft, "aktuell");
      // Die Quelle bleibt im Mitgliederbereich, sie steht nicht auf dem Bild.
      assert.ok(!("quelle" in k));
    });
    // Auch drei und fünf Bilder zählen richtig durch.
    for (const von of [3, 5]) {
      const serie = {
        ...SAUBER,
        folien:
          von === 3
            ? [SAUBER.folien[0], SAUBER.folien[2], SAUBER.folien[3]]
            : [
                ...SAUBER.folien.slice(0, 2),
                bild("problem", 2) as SerieFolie,
                ...SAUBER.folien.slice(2),
              ],
      };
      assert.deepEqual(
        serieAlsKarten(serie, "2026-11-20").map((k) => k.folge),
        Array.from({ length: von }, (_, i) => ({ nr: i + 1, von })),
      );
    }
  });

  it("gibt allen Bildern denselben Tag, dieselbe Tagesnummer und denselben Platz", () => {
    const tag = spruchTag("2026-11-20", {});
    for (const k of karten) {
      assert.equal(k.datum, "2026-11-20");
      assert.equal(k.nummer, tag.nummer);
      assert.equal(k.platz, SERIE_PLATZ);
      assert.equal(k.datumKurz, tag.datumKurz);
      assert.equal(k.datumText, tag.datumText);
    }
    // Ein Tag später: eine andere Tagesnummer, also ein anderes Bild.
    assert.equal(
      serieAlsKarten(SAUBER, "2026-11-21")[0].nummer,
      karten[0].nummer + 1,
    );
  });

  it("zeichnet damit alle Bilder aus einem Guss, auch mit anderem Design", () => {
    for (const versatz of [0, 1, 2, 3]) {
      const varianten = karten.map((k) =>
        varianteFuer(k.nummer, k.platz, versatz),
      );
      // Farbwelt, Motiv und alle übrigen Stellen: dieselbe Zusammenstellung.
      assert.equal(new Set(varianten.map((v) => v.schluessel)).size, 1);
      assert.equal(new Set(varianten.map((v) => v.look.name)).size, 1);
      assert.equal(new Set(varianten.map((v) => v.motiv.name)).size, 1);
      // Dieselbe Gestaltung, eine, die Serien trägt.
      const gestaltungen = new Set(
        karten.map((k) => gestaltungFuer(k, versatz)),
      );
      assert.equal(gestaltungen.size, 1, `Design ${versatz}`);
      assert.ok(SERIE_LAYOUTS.includes([...gestaltungen][0]));
      // Der Film läuft in jedem Bild anders ab.
      const filme = karten.map((k) => filmFuerFolge(k, versatz));
      assert.equal(new Set(filme.map((f) => f.auftritt)).size, karten.length);
      assert.equal(new Set(filme.map((f) => f.kamera)).size, karten.length);
    }
    // „Anderes Design“ ändert das Aussehen der ganzen Serie.
    assert.notEqual(
      varianteFuer(karten[0].nummer, karten[0].platz, 1).schluessel,
      varianteFuer(karten[0].nummer, karten[0].platz, 0).schluessel,
    );
  });
});

describe("Story-Serien des Tages", () => {
  const SERIEN = Object.entries(SERIEN_AKTUELL);
  const RESERVE = [...SPRUECHE, ...SPRUECHE_EXTRA];
  const AKTUELL = Object.entries(POSTS_AKTUELL).flatMap(([datum, karten]) =>
    karten.map((k) => ({ ...k, datum })),
  );
  /** Alle Bilder aller Serien mit ihrem Tag und dem Titel ihrer Serie. */
  const BILDER = SERIEN.flatMap(([datum, serie]) =>
    serie.folien.map((f, i) => ({
      ...f,
      datum,
      titel: serie.titel,
      nr: i + 1,
    })),
  );

  it("hat für heute und morgen eine Serie und findet sie über den Tag", () => {
    assert.ok(SERIEN.length >= 2);
    for (const tag of ["2026-11-17", "2026-11-18"]) {
      assert.ok(SERIEN_AKTUELL[tag], tag);
      assert.equal(serieFuer(tag), SERIEN_AKTUELL[tag]);
    }
    // Ohne Eintrag gibt es keine Serie.
    assert.equal(serieFuer("2020-01-01"), null);
    assert.equal(serieFuer("2026-11-17", {}), null);
  });

  it("ordnet die Tage als echte Kalendertage, aufsteigend", () => {
    const tage = Object.keys(SERIEN_AKTUELL);
    for (const tag of tage) {
      assert.match(tag, /^\d{4}-\d{2}-\d{2}$/, tag);
      assert.equal(tagVersetzt(tag, 0), tag, `kein Kalendertag: ${tag}`);
    }
    for (let i = 1; i < tage.length; i++)
      assert.ok(
        tage[i - 1] < tage[i],
        `Reihenfolge: ${tage[i - 1]} / ${tage[i]}`,
      );
  });

  it("hält in jeder Serie alle Regeln ein", () => {
    for (const [datum, serie] of SERIEN)
      assert.deepEqual(pruefeSerie(serie), [], `${datum}: ${serie.titel}`);
  });

  it("hebt höchstens drei Wörter hervor, in jedem Bild andere", () => {
    for (const [datum, serie] of SERIEN) {
      const pointen = serie.folien.map((f) => f.betont.toLowerCase());
      for (const p of pointen)
        assert.ok(p.split(" ").length <= 3, `${datum}: zu lang: ${p}`);
      assert.equal(
        new Set(pointen).size,
        pointen.length,
        `${datum}: ${pointen}`,
      );
    }
  });

  it("nennt im Titel nur einen Anlass, der an dem Tag ansteht", () => {
    // Steht im Titel ein Anlass aus lib/anlaesse.ts („Black Friday in
    // Sicht“, „Winterdom läuft“), muss er an dem Tag oder in den zwei
    // Wochen danach liegen.
    for (const [datum, serie] of SERIEN) {
      const titel = serie.titel.toLowerCase();
      const jahr = Number(datum.slice(0, 4));
      const namen = new Set(
        [jahr, jahr + 1].flatMap((j) => anlaesseImJahr(j).map((a) => a.name)),
      );
      const genannt = [...namen].filter((n) => titel.includes(n.toLowerCase()));
      const bald = new Set(naechsteAnlaesse(datum, 15).map((a) => a.name));
      for (const name of genannt)
        assert.ok(bald.has(name), `${datum}: „${serie.titel}“ nennt ${name}`);
    }
    // Gegenprobe: Black Friday ist Ende November, nicht im Mai.
    assert.ok(
      !naechsteAnlaesse("2026-05-04", 15).some(
        (a) => a.name === "Black Friday",
      ),
    );
    assert.ok(
      naechsteAnlaesse("2026-11-18", 15).some((a) => a.name === "Black Friday"),
    );
  });

  it("wiederholt keinen Satz aus der Reserve, von den Tageskarten oder aus einer anderen Serie", () => {
    const reserve = new Set(RESERVE.map((s) => s.text.toLowerCase()));
    const tageskarten = new Map(
      AKTUELL.map((k) => [k.text.toLowerCase(), k.datum]),
    );
    const gesehen = new Map<string, string>();
    for (const b of BILDER) {
      const text = b.text.toLowerCase();
      const wo = `${b.datum}, Bild ${b.nr}`;
      assert.ok(!reserve.has(text), `steht schon in der Reserve: ${b.text}`);
      assert.ok(
        !tageskarten.has(text),
        `steht schon bei den Tageskarten vom ${tageskarten.get(text)}: ${b.text}`,
      );
      assert.ok(
        !gesehen.has(text),
        `steht schon in ${gesehen.get(text)}: ${b.text} (${wo})`,
      );
      gesehen.set(text, wo);
    }
  });

  /**
   * Beinahe-Doppelungen der Bilder: mit der Reserve, mit den Tageskarten
   * und mit jedem anderen Bild (auch derselben Serie). Wörter der Titel
   * und Anlässe zählen nicht. Derselbe Vergleich wie bei den Tageskarten
   * (tests/karten-vergleich.ts).
   */
  function beinaheDoppelungen(
    bilder: readonly { text: string; titel: string; datum: string }[],
    reserve: readonly { text: string }[],
    tageskarten: readonly { text: string; anlass: string; datum: string }[],
  ): string[] {
    const funde: string[] = [];
    for (const b of bilder) {
      const eigen = ohneAnlass(b.titel);
      const satz = woerter(b.text, eigen);
      for (const s of reserve)
        if (zuAehnlich(satz, woerter(s.text, eigen)))
          funde.push(`zu ähnlich: „${b.text}“ (${b.datum}) / „${s.text}“`);
      for (const k of tageskarten) {
        const beide = ohneAnlass(b.titel, k.anlass);
        if (zuAehnlich(woerter(b.text, beide), woerter(k.text, beide)))
          funde.push(
            `zu ähnlich: „${b.text}“ (${b.datum}) / „${k.text}“ (${k.datum})`,
          );
      }
      for (const anderes of bilder) {
        if (anderes === b) continue;
        const beide = ohneAnlass(b.titel, anderes.titel);
        if (zuAehnlich(woerter(b.text, beide), woerter(anderes.text, beide)))
          funde.push(
            `zu ähnlich: „${b.text}“ (${b.datum}) / „${anderes.text}“ (${anderes.datum})`,
          );
      }
    }
    return funde;
  }

  it("sagt nichts fast wörtlich, was schon in der Reserve, bei den Tageskarten oder in einem anderen Bild steht", () => {
    assert.deepEqual(beinaheDoppelungen(BILDER, RESERVE, AKTUELL), []);
  });

  it("findet Beinahe-Doppelungen, wenn sich eine einschleicht", () => {
    const bild = {
      text: "Die Startseite ist voller als der Rathausmarkt am Samstag?",
      titel: "Advent in Sicht",
      datum: "2026-11-19",
    };
    // Fast wörtlich eine Tageskarte (andere Satzzeichen).
    const tageskarte = {
      text: "Die Startseite ist voller als der Rathausmarkt am Samstag.",
      anlass: "Weihnachtsmarkt ab Montag",
      datum: "2026-11-17",
    };
    const funde = beinaheDoppelungen([bild], RESERVE, [tageskarte]);
    assert.ok(
      funde.some((f) => f.includes("(2026-11-17)")),
      JSON.stringify(funde),
    );
    // Auch eine Karte der Reserve darf kein Bild fast wörtlich wiederholen.
    const reserve = {
      text: "Unter jeder Bewertung steht eine freundliche Antwort.",
    };
    const ausReserve = {
      ...bild,
      text: "Steht unter jeder Bewertung eine freundliche Antwort?",
    };
    assert.equal(beinaheDoppelungen([ausReserve], [reserve], []).length, 1);
    // Zwei Bilder derselben Serie mit denselben Wörtern fallen auch auf.
    const zwilling = {
      ...bild,
      text: "Voller als der Rathausmarkt am Samstag ist die Startseite.",
    };
    assert.equal(beinaheDoppelungen([bild, zwilling], [], []).length, 2);
    // Mit sich selbst verglichen wird kein Bild.
    assert.deepEqual(beinaheDoppelungen([bild], [], []), []);
  });

  it("gibt die Bilder des Tages fertig zum Zeichnen aus", () => {
    for (const [datum, serie] of SERIEN) {
      const karten = serieAlsKarten(serie, datum);
      assert.equal(karten.length, serie.folien.length);
      assert.equal(karten[0].rolle, "aufhaenger");
      assert.equal(karten.at(-1)?.rolle, "einladung");
      for (const k of karten) {
        assert.equal(k.datum, datum);
        assert.equal(k.anlass, serie.titel);
        assert.equal(k.folge.von, karten.length);
      }
    }
  });
});

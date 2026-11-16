import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PostStatusRow } from "@/lib/admin/post-planer";

import {
  gepostetNach,
  morgenlaufStand,
  morgenlaufText,
  NACHTRAGEN_TAGE,
  parsePlatz,
  parsePostDatum,
  parsePostFormat,
  parsePostText,
  platzName,
  postStand,
  postStandIn,
  postStatusAusZeile,
  postStatusMap,
  postStatusVon,
  SERIE_GENAU_TAGE,
  serieTage,
  serieText,
  wochenStand,
  wochenStart,
} from "@/lib/admin/post-planer";
import { addDays } from "@/lib/admin/berlin-time";
import { POSTS_AKTUELL } from "@/lib/posts-aktuell";
import { postsFuer } from "@/lib/sprueche-data";

// Mo, 16.11.2026, 11:00 in Hamburg
const NOW = new Date("2026-11-16T10:00:00Z");
const HEUTE = "2026-11-16";

const row = (
  datum: string,
  platz = 0,
  format: PostStatusRow["format"] = "story",
  text = "Satz",
): PostStatusRow => ({
  datum,
  platz,
  format,
  text,
  gepostet_at: `${datum}T08:00:00Z`,
});

describe("Eingaben", () => {
  it("Format, Platz, Text", () => {
    assert.equal(parsePostFormat("story"), "story");
    assert.equal(parsePostFormat("beitrag"), "beitrag");
    assert.equal(parsePostFormat("karte"), null);
    assert.equal(parsePlatz(0), 0);
    assert.equal(parsePlatz(2), 2);
    assert.equal(parsePlatz(3), null);
    assert.equal(parsePlatz("1"), null);
    assert.equal(parsePlatz(1.5), null);
    assert.equal(parsePostText("  Satz. "), "Satz.");
    assert.equal(parsePostText(" "), null);
    assert.equal(parsePostText("x".repeat(501)), null);
  });

  it("Tag zum Abhaken: nicht in der Zukunft, höchstens NACHTRAGEN_TAGE zurück", () => {
    assert.equal(parsePostDatum(HEUTE, NOW), HEUTE);
    assert.equal(parsePostDatum("2026-11-17", NOW), null);
    const grenze = addDays(HEUTE, -NACHTRAGEN_TAGE);
    assert.equal(parsePostDatum(grenze, NOW), grenze);
    assert.equal(parsePostDatum(addDays(grenze, -1), NOW), null);
    assert.equal(parsePostDatum("2026-11-31", NOW), null);
    assert.equal(parsePostDatum(20261116, NOW), null);
  });

  it("Platz-Namen", () => {
    assert.equal(platzName(0), "Spruch des Tages");
    assert.equal(platzName(2), "Zusatz-Post 2");
    assert.equal(platzName(5), "Post 6");
  });
});

describe("Zeilen und Stand", () => {
  it("postStatusAusZeile: kaputte Zeilen ergeben null", () => {
    assert.deepEqual(
      postStatusAusZeile({
        datum: "2026-11-16",
        platz: 1,
        format: "beitrag",
        text: "Satz",
        gepostet_at: "2026-11-16T08:00:00Z",
      }),
      row("2026-11-16", 1, "beitrag"),
    );
    assert.equal(
      postStatusAusZeile({ datum: "x", platz: 1, format: "story" }),
      null,
    );
    assert.equal(
      postStatusAusZeile({ datum: "2026-11-16", platz: 4, format: "story" }),
      null,
    );
    assert.equal(postStatusAusZeile(null), null);
  });

  it("postStand: offen, gepostet oder eine andere (frühere) Karte gepostet", () => {
    const post = { datum: HEUTE, platz: 0, text: "Heutiger Satz." };
    const map = postStatusMap([
      row(HEUTE, 0, "story", "Heutiger Satz."),
      row(HEUTE, 0, "beitrag", "Reserve-Satz von vorhin."),
    ]);
    assert.equal(postStand(map, post, "story"), "gepostet");
    assert.equal(postStand(map, post, "beitrag"), "andere");
    assert.equal(postStand(map, { ...post, platz: 1 }, "story"), "offen");
  });

  it("postStandIn: Stand aus den Einträgen eines Tages, mit Textvergleich (Story-Studio)", () => {
    const post = { platz: 0, text: "Heutiger Satz." };
    const eintraege = [
      { platz: 0, format: "story" as const, text: "Heutiger Satz." },
      {
        platz: 0,
        format: "beitrag" as const,
        text: "Reserve-Satz von vorhin.",
      },
    ];
    assert.equal(postStandIn(eintraege, post, "story"), "gepostet");
    // Vorher eine andere Karte gepostet: nicht „gepostet“.
    assert.equal(postStandIn(eintraege, post, "beitrag"), "andere");
    assert.equal(
      postStandIn(eintraege, { ...post, platz: 1 }, "story"),
      "offen",
    );
    assert.equal(postStandIn([], post, "story"), "offen");
  });

  it("ein Tipp auf den Schalter: offen und andere Karte werden abgehakt, nur Gepostetes wird wieder offen", () => {
    assert.equal(gepostetNach("offen"), true);
    // Nach einem Kartenwechsel trägt der erste Tipp die neue Karte ein,
    // statt den Eintrag der geposteten Reserve-Karte zu löschen.
    assert.equal(gepostetNach("andere"), true);
    assert.equal(gepostetNach("gepostet"), false);
  });
});

describe("Serie und Woche", () => {
  it("Serie zählt Tage in Folge bis heute, ohne Post heute bis gestern", () => {
    assert.equal(serieTage([], HEUTE), 0);
    const bisGestern = [
      row("2026-11-15"),
      row("2026-11-14", 1),
      row("2026-11-14", 2, "beitrag"),
      row("2026-11-13"),
      // Lücke am 12.11.
      row("2026-11-11"),
    ];
    assert.equal(serieTage(bisGestern, HEUTE), 3);
    assert.equal(serieTage([...bisGestern, row(HEUTE)], HEUTE), 4);
    // Gestern nichts: Serie 0, auch wenn vorher viel war.
    assert.equal(serieTage([row("2026-11-14")], HEUTE), 0);
  });

  it("Serie länger als das geladene Fenster: „über 60 Tage“ statt einer falschen Zahl", () => {
    // /admin/posts lädt den Post-Status erst ab postStatusVon(heute).
    const von = postStatusVon(HEUTE);
    const anzeige = (rows: PostStatusRow[]) =>
      serieText(
        serieTage(
          rows.filter((r) => r.datum >= von && r.datum <= HEUTE),
          HEUTE,
        ),
      );
    /** n Tage am Stück, der jüngste ist bis. */
    const amStueck = (n: number, bis: string) =>
      Array.from({ length: n }, (_, i) => row(addDays(bis, -i)));
    const gestern = addDays(HEUTE, -1);
    assert.equal(SERIE_GENAU_TAGE, 60);
    assert.equal(anzeige(amStueck(90, HEUTE)), "über 60 Tage");
    // Heute noch nichts gepostet, bis gestern 90 Tage am Stück.
    assert.equal(anzeige(amStueck(90, gestern)), "über 60 Tage");
    // Bis 60 Tage stimmt die Zahl genau, mit und ohne Post heute.
    assert.equal(anzeige(amStueck(60, gestern)), "60 Tage");
    assert.equal(anzeige(amStueck(60, HEUTE)), "60 Tage");
    assert.equal(anzeige(amStueck(1, HEUTE)), "1 Tag");
    assert.equal(anzeige([]), "0 Tage");
  });

  it("Woche beginnt am Montag", () => {
    assert.equal(wochenStart("2026-11-16"), "2026-11-16"); // Montag
    assert.equal(wochenStart("2026-11-22"), "2026-11-16"); // Sonntag
    assert.equal(wochenStart("2026-11-18"), "2026-11-16");
  });

  it("Stand der Woche: Posts und Tage seit Montag, Vorwoche zählt nicht", () => {
    const rows = [
      row("2026-11-15"), // Sonntag davor
      row("2026-11-16"),
      row("2026-11-16", 0, "beitrag"),
      row("2026-11-18", 2),
    ];
    assert.deepEqual(wochenStand(rows, "2026-11-16"), {
      gepostet: 2,
      tageMitPost: 1,
      tageBisher: 1,
    });
    assert.deepEqual(wochenStand(rows, "2026-11-19"), {
      gepostet: 3,
      tageMitPost: 2,
      tageBisher: 4,
    });
    assert.equal(wochenStand([], "2026-11-22").tageBisher, 7);
  });
});

describe("Morgenlauf", () => {
  it("ohne Karten zum Tag: Reserve", () => {
    const stand = morgenlaufStand(postsFuer("2026-11-17", {}));
    assert.equal(stand.geliefert, false);
    assert.equal(stand.aktuell, 0);
    assert.equal(stand.reserve, 3);
    assert.deepEqual(stand.anlaesse, []);
  });

  it("mit Karten zum Tag: Anzahl und Anlässe ohne Doppelte", () => {
    const karte = {
      kicker: "Real Talk" as const,
      text: "Am Black Friday sucht Hamburg nach Angeboten in der Nähe.",
      betont: "in der Nähe",
      zusatz: "Wer dann gefunden wird, hat einen Vorteil.",
      thema: "google" as const,
      anlass: "Black Friday",
    };
    const stand = morgenlaufStand(
      postsFuer("2026-11-27", {
        "2026-11-27": [
          karte,
          {
            ...karte,
            kicker: "Merken",
            text: "Ein Rabatt hilft nur, wenn man ihn auf der Seite findet.",
            betont: "auf der Seite",
          },
        ],
      }),
    );
    assert.equal(stand.geliefert, true);
    assert.equal(stand.aktuell, 2);
    assert.equal(stand.reserve, 1);
    assert.deepEqual(stand.anlaesse, ["Black Friday"]);
  });

  it("Text im Story-Studio: Karten für einen kommenden Tag werden genannt, nicht die Reserve", () => {
    const morgen = "2026-11-17";
    const karte = {
      kicker: "Real Talk" as const,
      text: "Am Black Friday sucht Hamburg nach Angeboten in der Nähe.",
      betont: "in der Nähe",
      zusatz: "Wer dann gefunden wird, hat einen Vorteil.",
      thema: "google" as const,
      anlass: "Black Friday",
    };
    const mit = morgenlaufText(
      morgen,
      HEUTE,
      postsFuer(morgen, { [morgen]: [karte] }),
    );
    assert.doesNotMatch(mit, /steht hier die Reserve/);
    assert.equal(
      mit,
      "Schon zum Tag geschrieben: 1 von 3 Posts (Black Friday). Der Rest kommt aus der Reserve.",
    );
    // Die echten Karten vom 17.11.2026, am 16.11. angesehen.
    assert.equal(
      morgenlaufText(morgen, HEUTE, postsFuer(morgen, POSTS_AKTUELL)),
      "Schon zum Tag geschrieben: 3 von 3 Posts (Black Friday in Sicht · Weihnachtsmarkt ab Montag · Winterdom läuft).",
    );
    // Ohne Karten zum Tag bleibt es bei der Reserve.
    assert.equal(
      morgenlaufText(morgen, HEUTE, postsFuer(morgen, {})),
      "Die Posts für diesen Tag schreibt der Morgenlauf am Morgen selbst, passend zum Tag. Bis dahin steht hier die Reserve.",
    );
    assert.equal(
      morgenlaufText(HEUTE, HEUTE, postsFuer(HEUTE, {})),
      "Der Morgenlauf hat heute noch nichts geliefert, es läuft die Reserve.",
    );
    assert.equal(
      morgenlaufText("2026-11-15", HEUTE, postsFuer("2026-11-15", {})),
      "An diesem Tag lief die Reserve.",
    );
    assert.equal(
      morgenlaufText(HEUTE, HEUTE, postsFuer(HEUTE, { [HEUTE]: [karte] })),
      "Heute zum Tag geschrieben: 1 von 3 Posts (Black Friday). Der Rest kommt aus der Reserve.",
    );
  });
});

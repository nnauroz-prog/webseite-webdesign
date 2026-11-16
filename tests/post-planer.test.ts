import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PostStatusRow } from "@/lib/admin/post-planer";

import {
  morgenlaufStand,
  NACHTRAGEN_TAGE,
  parsePlatz,
  parsePostDatum,
  parsePostFormat,
  parsePostText,
  platzName,
  postStand,
  postStatusAusZeile,
  postStatusMap,
  serieTage,
  wochenStand,
  wochenStart,
} from "@/lib/admin/post-planer";
import { addDays } from "@/lib/admin/berlin-time";
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
});

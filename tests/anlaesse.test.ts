import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  TERMINE_HAMBURG,
  anlaesseFuer,
  anlaesseImJahr,
  jahreszeitBeginn,
  naechsteAnlaesse,
  ostersonntag,
} from "@/lib/anlaesse";

/** Namen der Anlässe an einem Tag. */
const namen = (datum: string) => anlaesseFuer(datum).map((a) => a.name);

/** Der Tag, an dem ein Anlass im Jahr liegt (genau einer erwartet). */
function tagVon(jahr: number, name: string): string {
  const treffer = anlaesseImJahr(jahr).filter((a) => a.name === name);
  assert.equal(treffer.length, 1, `${name} ${jahr}: ${treffer.length}`);
  return treffer[0].datum;
}

describe("Anlässe", () => {
  it("rechnet Ostern richtig", () => {
    assert.equal(ostersonntag(2024), "2024-03-31");
    assert.equal(ostersonntag(2025), "2025-04-20");
    assert.equal(ostersonntag(2026), "2026-04-05");
    assert.equal(ostersonntag(2027), "2027-03-28");
    assert.equal(ostersonntag(2028), "2028-04-16");
    assert.equal(ostersonntag(2038), "2038-04-25");
    assert.ok(namen("2026-04-05").includes("Ostersonntag"));
  });

  it("leitet die beweglichen Feiertage von Ostern ab", () => {
    assert.equal(tagVon(2026, "Karfreitag"), "2026-04-03");
    assert.equal(tagVon(2026, "Ostermontag"), "2026-04-06");
    assert.equal(tagVon(2026, "Christi Himmelfahrt"), "2026-05-14");
    assert.equal(tagVon(2026, "Vatertag"), "2026-05-14");
    assert.equal(tagVon(2026, "Pfingstsonntag"), "2026-05-24");
    assert.equal(tagVon(2026, "Pfingstmontag"), "2026-05-25");
    assert.equal(tagVon(2027, "Karfreitag"), "2027-03-26");
  });

  it("kennt die festen Feiertage in Hamburg, auch den Reformationstag", () => {
    assert.ok(namen("2026-01-01").includes("Neujahr"));
    assert.ok(namen("2026-05-01").includes("Tag der Arbeit"));
    assert.ok(namen("2026-10-03").includes("Tag der Deutschen Einheit"));
    assert.ok(namen("2026-10-31").includes("Reformationstag"));
    assert.ok(namen("2027-10-31").includes("Reformationstag"));
    assert.ok(namen("2026-12-24").includes("Heiligabend"));
    assert.ok(namen("2026-12-25").includes("Erster Weihnachtstag"));
    assert.ok(namen("2026-12-26").includes("Zweiter Weihnachtstag"));
    assert.ok(namen("2026-12-31").includes("Silvester"));
    const reformation = anlaesseFuer("2026-10-31").find(
      (a) => a.name === "Reformationstag",
    );
    assert.equal(reformation?.art, "feiertag");
  });

  it("findet Muttertag, Advent, Totensonntag, Black Friday und Cyber Monday", () => {
    assert.equal(tagVon(2026, "Muttertag"), "2026-05-10");
    assert.equal(tagVon(2027, "Muttertag"), "2027-05-09");
    assert.equal(tagVon(2026, "Totensonntag"), "2026-11-22");
    assert.equal(tagVon(2026, "Black Friday"), "2026-11-27");
    assert.equal(tagVon(2026, "Cyber Monday"), "2026-11-30");
    assert.equal(tagVon(2026, "Erster Advent"), "2026-11-29");
    assert.equal(tagVon(2026, "Zweiter Advent"), "2026-12-06");
    assert.equal(tagVon(2026, "Dritter Advent"), "2026-12-13");
    assert.equal(tagVon(2026, "Vierter Advent"), "2026-12-20");
    assert.equal(tagVon(2026, "Nikolaus"), "2026-12-06");
    // Fällt Weihnachten auf einen Sonntag, ist der vierte Advent eine Woche davor.
    assert.equal(tagVon(2022, "Vierter Advent"), "2022-12-18");
    assert.equal(tagVon(2022, "Erster Advent"), "2022-11-27");
    // Thanksgiving am 22.11.2029 ist der früheste mögliche Termin.
    assert.equal(tagVon(2029, "Black Friday"), "2029-11-23");
    assert.equal(tagVon(2025, "Black Friday"), "2025-11-28");
  });

  it("stellt die Uhren am letzten Sonntag im März und Oktober um", () => {
    const umstellung = anlaesseImJahr(2026)
      .filter((a) => a.name === "Zeitumstellung")
      .map((a) => a.datum);
    assert.deepEqual(umstellung, ["2026-03-29", "2026-10-25"]);
    const naechstes = anlaesseImJahr(2027)
      .filter((a) => a.name === "Zeitumstellung")
      .map((a) => a.datum);
    assert.deepEqual(naechstes, ["2027-03-28", "2027-10-31"]);
  });

  it("legt die Jahreszeiten auf den Tag der Sonnenwende oder Tagundnachtgleiche", () => {
    // Hamburger Zeit; der Tag wandert von Jahr zu Jahr.
    assert.equal(jahreszeitBeginn(2026, 0), "2026-03-20");
    assert.equal(jahreszeitBeginn(2026, 1), "2026-06-21");
    assert.equal(jahreszeitBeginn(2026, 2), "2026-09-23");
    assert.equal(jahreszeitBeginn(2026, 3), "2026-12-21");
    assert.equal(jahreszeitBeginn(2024, 1), "2024-06-20");
    assert.equal(jahreszeitBeginn(2027, 3), "2027-12-22");
    assert.equal(tagVon(2026, "Herbstanfang"), "2026-09-23");
    assert.equal(tagVon(2026, "Winteranfang"), "2026-12-21");
  });

  it("hält Namen kurz, ohne Ziffern, und Hinweise als einen ganzen Satz", () => {
    const arten = [
      "feiertag",
      "handel",
      "jahreszeit",
      "hamburg",
      "aktion",
      "frist",
    ];
    for (const jahr of [2026, 2027]) {
      for (const a of anlaesseImJahr(jahr)) {
        assert.ok(
          a.name.length >= 3 && a.name.length <= 28,
          `${a.name.length}: ${a.name}`,
        );
        assert.doesNotMatch(a.name, /\d|#/, a.name);
        assert.equal(a.name.trim(), a.name);
        assert.ok(arten.includes(a.art), a.art);
        assert.match(a.datum, /^\d{4}-\d{2}-\d{2}$/);
        if (a.hinweis !== undefined) {
          assert.ok(
            a.hinweis.length <= 100,
            `${a.hinweis.length}: ${a.hinweis}`,
          );
          assert.match(a.hinweis, /^[A-ZÄÖÜ].*\.$/, a.hinweis);
          assert.doesNotMatch(a.hinweis, /\d/, a.hinweis);
          assert.doesNotMatch(
            a.hinweis,
            /\b(du|dich|dir|dein|deine|euch|euer|eure)\b/i,
            a.hinweis,
          );
        }
      }
    }
  });

  it("listet die nächsten Anlässe sortiert ab heute, jeden Termin einmal", () => {
    const liste = naechsteAnlaesse("2026-11-16");
    const tage = liste.map((a) => a.datum);
    assert.deepEqual(tage, [...tage].sort());
    assert.equal(tage[0], "2026-11-16");
    assert.ok(tage.every((t) => t >= "2026-11-16" && t <= "2026-11-29"));
    const n = liste.map((a) => a.name);
    assert.ok(n.includes("Winterdom läuft"));
    assert.ok(n.includes("Totensonntag"));
    assert.ok(n.includes("Black Friday"));
    assert.ok(n.includes("Erster Advent"));
    // Laufende Termine stehen nur einmal da.
    assert.equal(n.filter((x) => x === "Winterdom läuft").length, 1);
    // Über den Jahreswechsel.
    const wechsel = naechsteAnlaesse("2026-12-30", 3).map((a) => a.name);
    assert.deepEqual(wechsel, ["Silvester", "Neujahr"]);
    // Ein Tag heißt: nur heute.
    assert.deepEqual(
      naechsteAnlaesse("2026-10-31", 1).map((a) => a.name),
      ["Reformationstag", "Halloween"],
    );
    // Am Black Friday laufen Winterdom und Weihnachtsmarkt mit.
    assert.deepEqual(
      naechsteAnlaesse("2026-11-27", 1).map((a) => a.name),
      ["Black Friday", "Winterdom läuft", "Weihnachtsmarktzeit"],
    );
  });

  it("weist ein falsches Datum ab", () => {
    assert.throws(() => anlaesseFuer("2026-02-30"), RangeError);
    assert.throws(() => anlaesseFuer("16.11.2026"), RangeError);
  });

  it("belegt jeden Hamburger Termin mit einer Quelle", () => {
    assert.ok(TERMINE_HAMBURG.length > 0);
    for (const t of TERMINE_HAMBURG) {
      assert.match(t.quelle, /^https:\/\/[^\s]+$/, t.name);
      assert.match(t.start, /^\d{4}-\d{2}-\d{2}$/, t.name);
      if (t.ende) assert.ok(t.ende >= t.start, `${t.name}: ${t.ende}`);
      for (const name of [t.name, t.laeuft, t.schluss]) {
        if (name === undefined) continue;
        assert.ok(name.length >= 3 && name.length <= 28, name);
        assert.doesNotMatch(name, /\d|#/, name);
      }
      // Am ersten Tag steht der Termin im Kalender.
      assert.ok(namen(t.start).includes(t.name), `${t.start} ${t.name}`);
    }
  });

  it("zeigt den Winterdom und den Weihnachtsmarkt am Rathausmarkt 2026", () => {
    assert.ok(namen("2026-11-06").includes("Winterdom beginnt"));
    assert.ok(namen("2026-11-16").includes("Winterdom läuft"));
    assert.ok(namen("2026-12-06").includes("Letzter Tag Winterdom"));
    assert.ok(namen("2026-11-23").includes("Weihnachtsmarkt eröffnet"));
    assert.ok(namen("2026-12-07").includes("Weihnachtsmarktzeit"));
    assert.deepEqual(namen("2026-11-05"), []);
  });
});

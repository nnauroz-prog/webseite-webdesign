import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filmTon, TON_RATE, type FilmTon } from "@/lib/story-ton";
import { AUFTRITTE } from "@/lib/story-variante";

const DAUER = 8.4;
const basis: FilmTon = {
  auftritt: "kran",
  masse: 0.6,
  streifen: 2,
  schlag: 3.63,
  anlegen: 7.4,
  schiff: true,
  druck: null,
  striche: [],
  blatt: false,
  saat: 7,
};

/** Lautstärke (quadratisches Mittel) eines Ausschnitts in Sekunden. */
function laut(ton: Float32Array, von: number, bis: number): number {
  let summe = 0;
  const [a, b] = [Math.round(von * TON_RATE), Math.round(bis * TON_RATE)];
  for (let i = a; i < b; i++) summe += ton[i] * ton[i];
  return Math.sqrt(summe / (b - a));
}

describe("Ton zum Film (story-ton)", () => {
  it("ist für jeden Auftritt so lang wie der Film, endlich und nie übersteuert", () => {
    for (const auftritt of AUFTRITTE) {
      const ton = filmTon({ ...basis, auftritt }, DAUER);
      assert.equal(ton.length, Math.round(DAUER * TON_RATE), auftritt);
      let spitze = 0;
      for (const wert of ton) {
        assert.ok(Number.isFinite(wert), auftritt);
        spitze = Math.max(spitze, Math.abs(wert));
      }
      assert.ok(spitze <= 0.8 + 1e-6, `${auftritt}: ${spitze}`);
      assert.ok(spitze > 0.05, `${auftritt}: kaum hörbar (${spitze})`);
    }
  });

  it("setzt das Geräusch dorthin, wo die Pointe kommt", () => {
    for (const auftritt of AUFTRITTE) {
      const ton = filmTon({ ...basis, auftritt }, DAUER);
      // Die Sekunde um den Auftritt ist deutlich lauter als der ruhige
      // Grund davor.
      const grund = laut(ton, 1, 2);
      const auftrittLaut = laut(ton, 2.9, 3.9);
      assert.ok(
        auftrittLaut > grund * 3,
        `${auftritt}: ${auftrittLaut} gegen ${grund}`,
      );
    }
  });

  it("beginnt und endet still", () => {
    const ton = filmTon(basis, DAUER);
    assert.ok(Math.abs(ton[0]) < 1e-4);
    assert.ok(Math.abs(ton[ton.length - 1]) < 1e-4);
  });

  it("lässt das Horn nur hören, wenn ein Schiff anlegt", () => {
    const mit = filmTon(basis, DAUER);
    const ohne = filmTon({ ...basis, schiff: false }, DAUER);
    assert.ok(laut(mit, 7.1, 7.8) > laut(ohne, 7.1, 7.8) * 4);
  });

  it("vertont Mythos mit Strichen und dem Blatt", () => {
    const ton = filmTon(
      { ...basis, masse: 0, streifen: 0, blatt: true, striche: [2.3, 2.6] },
      DAUER,
    );
    const grund = laut(ton, 1, 2);
    assert.ok(laut(ton, 2.3, 2.47) > grund * 3, "erster Strich");
    assert.ok(laut(ton, 3.63, 3.8) > grund * 3, "Blatt setzt auf");
  });

  it("rechnet aus denselben Angaben denselben Ton", () => {
    const [a, b] = [filmTon(basis, DAUER), filmTon(basis, DAUER)];
    assert.deepEqual(a.subarray(0, 60000), b.subarray(0, 60000));
    const anders = filmTon({ ...basis, saat: 8 }, DAUER);
    assert.notDeepEqual(a.subarray(0, 60000), anders.subarray(0, 60000));
  });
});

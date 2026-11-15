import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  STORY_LOOKS,
  lookVariablen,
  stickerRand,
  stickerStern,
} from "@/lib/story-look";
import { MOTIVE, SCHMUCK } from "@/lib/story-teile";
import { VARIANTEN, varianteFuer } from "@/lib/story-variante";

function leuchtkraft(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(n.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function kontrast(a: string, b: string): number {
  const [hell, dunkel] = [leuchtkraft(a), leuchtkraft(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
}

describe("Farbwelten der Spruch-Karten", () => {
  it("hat mehrere Farbwelten mit eindeutigen Namen", () => {
    assert.ok(STORY_LOOKS.length >= 4);
    assert.equal(
      new Set(STORY_LOOKS.map((l) => l.name)).size,
      STORY_LOOKS.length,
    );
  });

  it("hält die Kontraste ein", () => {
    for (const l of STORY_LOOKS) {
      for (const grund of [l.bg, l.bg2]) {
        // Fließtext (Zusatz, Absender, Kennzeile): mindestens 4,5 : 1.
        assert.ok(
          kontrast(l.text, grund) >= 4.5,
          `${l.name}: Text auf ${grund}`,
        );
        assert.ok(
          kontrast(l.weich, grund) >= 4.5,
          `${l.name}: Zusatz auf ${grund}`,
        );
        // Der Balken der Pointe und die Hafenfläche heben sich vom Grund ab.
        assert.ok(
          kontrast(l.marker, grund) >= 1.5,
          `${l.name}: Balken auf ${grund}`,
        );
        assert.ok(
          kontrast(l.hafen, grund) >= 1.5,
          `${l.name}: Hafen auf ${grund}`,
        );
        assert.ok(
          kontrast(l.faehre, grund) >= 3,
          `${l.name}: Fähre auf ${grund}`,
        );
      }
      // Die Pointe steht groß auf dem Balken: mindestens 3 : 1.
      assert.ok(
        kontrast(l.betont, l.marker) >= 3,
        `${l.name}: Pointe auf Balken`,
      );
      assert.ok(
        kontrast(l.stickerText, l.stickerBg) >= 4.5,
        `${l.name}: Aufkleber`,
      );
      assert.ok(
        kontrast(stickerStern(l), l.stickerBg) >= 3,
        `${l.name}: Stern im Aufkleber`,
      );
      assert.ok(
        kontrast(l.streif, l.faehre) >= 2.5,
        `${l.name}: Streifen der Fähre`,
      );
    }
  });

  it("gibt jedem Tag eine eigene Zusammenstellung, über 50 Jahre lang", () => {
    assert.ok(VARIANTEN > 18_000, String(VARIANTEN));
    const gesehen = new Set<number>();
    for (let n = 0; n < VARIANTEN; n++) {
      const s = varianteFuer(n).schluessel;
      assert.ok(!gesehen.has(s), `wiederholt sich an Tag ${n}`);
      gesehen.add(s);
    }
    // Der erste Tag online (Tagesnummer 6) trägt die Zusammenstellung 0.
    assert.equal(varianteFuer(6).schluessel, 0);
    // Auch vor dem Start (negative Tagesnummer) gibt es eine.
    assert.ok(varianteFuer(-3).look);
  });

  it("wechselt von Tag zu Tag Farbwelt, Motiv, Schmuck, Muster und Lage", () => {
    for (let n = -10; n < 2000; n++) {
      const a = varianteFuer(n);
      const b = varianteFuer(n + 1);
      assert.notEqual(a.look.name, b.look.name, `Farbwelt an Tag ${n}`);
      assert.notEqual(a.motiv.name, b.motiv.name, `Motiv an Tag ${n}`);
      assert.notEqual(a.schmuck.name, b.schmuck.name, `Schmuck an Tag ${n}`);
      assert.notEqual(a.grund, b.grund, `Muster an Tag ${n}`);
      assert.notEqual(a.anker, b.anker, `Lage an Tag ${n}`);
      assert.ok(Math.abs(a.dreh) <= 8);
    }
  });

  it("bringt dieselbe Farbwelt frühestens nach einer Woche wieder", () => {
    const zuletzt = new Map<string, number>();
    for (let n = 0; n < VARIANTEN; n++) {
      const name = varianteFuer(n).look.name;
      const davor = zuletzt.get(name);
      if (davor !== undefined)
        assert.ok(n - davor >= 7, `${name} an Tag ${davor} und ${n}`);
      zuletzt.set(name, n);
    }
  });

  it("nutzt jede Farbwelt, jedes Motiv und jeden Schmuck regelmäßig", () => {
    const monat = Array.from({ length: 30 }, (_, i) => varianteFuer(6 + i));
    assert.equal(
      new Set(monat.map((v) => v.look.name)).size,
      STORY_LOOKS.length,
    );
    const woche = monat.slice(0, 7);
    assert.equal(new Set(woche.map((v) => v.motiv.name)).size, MOTIVE.length);
    assert.equal(
      new Set(woche.map((v) => v.schmuck.name)).size,
      SCHMUCK.length,
    );
  });

  it("hat für jedes Motiv und jede Schmuckform gültige Pfade", () => {
    for (const m of MOTIVE) {
      assert.ok(m.b > 20 && m.b < 80, m.name);
      assert.ok(m.teile.length >= 4, m.name);
      for (const teil of m.teile) assert.match(teil.d, /^M[-\d. ]/, m.name);
    }
    for (const s of SCHMUCK) {
      if (s.art !== "form") continue;
      assert.ok(s.teile.length >= 1, s.name);
      for (const teil of s.teile) {
        assert.match(teil.d, /^M[-\d. ]/, s.name);
        assert.doesNotMatch(teil.d, /NaN|undefined/, s.name);
      }
    }
  });

  it("liefert alle Variablen für die Karte", () => {
    for (const l of STORY_LOOKS) {
      const v = lookVariablen(l);
      for (const [name, wert] of Object.entries(v)) {
        assert.ok(name.startsWith("--k-"), name);
        assert.ok(wert && !wert.includes("undefined"), `${l.name} ${name}`);
      }
      assert.ok(stickerRand(l));
    }
  });
});

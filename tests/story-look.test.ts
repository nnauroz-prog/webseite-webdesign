import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  STORY_LOOKS,
  drehungFuer,
  lookFuer,
  lookVariablen,
  stickerStern,
} from "@/lib/story-look";

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

  it("wechselt die Farbwelt von Tag zu Tag, auch vor dem Starttag", () => {
    for (let n = -20; n < 40; n++) {
      assert.notEqual(lookFuer(n).name, lookFuer(n + 1).name, String(n));
      assert.ok(lookFuer(n));
    }
  });

  it("liefert alle Variablen für die Karte", () => {
    for (const l of STORY_LOOKS) {
      const v = lookVariablen(l);
      for (const [name, wert] of Object.entries(v)) {
        assert.ok(name.startsWith("--k-"), name);
        assert.ok(wert && !wert.includes("undefined"), `${l.name} ${name}`);
      }
      assert.ok(Math.abs(drehungFuer(0)) <= 8);
    }
  });
});

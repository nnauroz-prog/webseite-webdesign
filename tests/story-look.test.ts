import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { STORY_LOOKS } from "@/lib/story-look";
import { MOTIVE, SCHMUCK } from "@/lib/story-teile";
import {
  AUFTRITTE,
  KAMERAS,
  LAYOUT_FOLGE,
  LAYOUTS,
  VARIANTEN,
  gestaltungFuer,
  varianteFuer,
} from "@/lib/story-variante";

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
        kontrast(l.streif, l.faehre) >= 2.5,
        `${l.name}: Streifen der Fähre`,
      );
      // Gestaltung „farbfeld“: großer Satz auf der kräftigen Fläche
      // (große Schrift, mindestens 4 : 1), Pointe auf ihrem Balken, Zusatz
      // und Wortmarke auf dem Papier darunter.
      assert.ok(kontrast(l.feldText, l.feld) >= 4, `${l.name}: Satz im Feld`);
      assert.ok(
        kontrast(l.feldMarker, l.feld) >= 1.5,
        `${l.name}: Balken im Feld`,
      );
      assert.ok(
        kontrast(l.feldBetont, l.feldMarker) >= 3,
        `${l.name}: Pointe im Feld`,
      );
      assert.ok(
        kontrast(l.papierText, l.papier) >= 4.5,
        `${l.name}: Zusatz auf Papier`,
      );
      // Feld und Papier sind zwei deutlich verschiedene Flächen.
      assert.ok(kontrast(l.feld, l.papier) >= 1.3, `${l.name}: Feld/Papier`);
    }
  });

  it("gibt jedem Post eine eigene Zusammenstellung, bei drei Posts am Tag", () => {
    assert.ok(VARIANTEN > 18_000, String(VARIANTEN));
    const gesehen = new Set<number>();
    // Drei Posts am Tag: Die Zusammenstellungen reichen für ein Drittel so viele Tage.
    for (let n = 6; n < 6 + VARIANTEN / 3; n++) {
      for (let platz = 0; platz < 3; platz++) {
        const s = varianteFuer(n, platz).schluessel;
        assert.ok(
          !gesehen.has(s),
          `wiederholt sich an Tag ${n}, Platz ${platz}`,
        );
        gesehen.add(s);
      }
    }
    assert.equal(gesehen.size, VARIANTEN);
    // Der erste Tag online (Tagesnummer 6) trägt die Zusammenstellung 0.
    assert.equal(varianteFuer(6).schluessel, 0);
    // Auch vor dem Start (negative Tagesnummer) gibt es eine.
    assert.ok(varianteFuer(-3).look);
    // „Anderes Design“ im Story-Studio ergibt eine andere Zusammenstellung.
    assert.notEqual(
      varianteFuer(6, 0, 1).schluessel,
      varianteFuer(6).schluessel,
    );
  });

  it("lässt die drei Filme eines Tages verschieden ablaufen und wechselt täglich", () => {
    const auftritte = new Set<string>();
    const paare = new Set<string>();
    for (let n = -10; n < 400; n++) {
      const tag = [0, 1, 2].map((platz) => varianteFuer(n, platz));
      // Drei Posts, drei Auftritte der Pointe, drei Kamerawege.
      assert.equal(new Set(tag.map((v) => v.auftritt)).size, 3, `Tag ${n}`);
      assert.equal(new Set(tag.map((v) => v.kamera)).size, 3, `Tag ${n}`);
      // Der Spruch des Tages läuft anders ab als am Vortag.
      const gestern = varianteFuer(n - 1);
      assert.notEqual(tag[0].auftritt, gestern.auftritt, `Tag ${n}`);
      assert.notEqual(tag[0].kamera, gestern.kamera, `Tag ${n}`);
      for (const v of tag) {
        auftritte.add(v.auftritt);
        paare.add(`${v.auftritt}/${v.kamera}`);
      }
    }
    // Alle Auftritte kommen vor, und jeder mit jedem Kameraweg.
    assert.equal(auftritte.size, AUFTRITTE.length);
    assert.equal(paare.size, AUFTRITTE.length * KAMERAS.length);
    // „Anderes Design“ im Story-Studio ändert auch den Ablauf des Films.
    assert.notEqual(varianteFuer(6, 0, 1).auftritt, varianteFuer(6).auftritt);
  });

  it("wechselt beim Spruch des Tages täglich Farbwelt, Motiv, Schmuck, Muster und Lage", () => {
    for (let n = -10; n < 3000; n++) {
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

  it("gibt den drei Posts eines Tages verschiedene Farbwelten, Motive und Schmuckformen", () => {
    for (let n = 0; n < VARIANTEN / 3; n++) {
      const posts = [0, 1, 2].map((platz) => varianteFuer(n, platz));
      assert.equal(
        new Set(posts.map((v) => v.look.name)).size,
        3,
        `Farbwelt an Tag ${n}`,
      );
      assert.equal(
        new Set(posts.map((v) => v.motiv.name)).size,
        3,
        `Motiv an Tag ${n}`,
      );
      assert.equal(
        new Set(posts.map((v) => v.schmuck.name)).size,
        3,
        `Schmuck an Tag ${n}`,
      );
    }
  });

  it("bringt dieselbe Farbwelt beim Spruch des Tages frühestens nach einer Woche wieder", () => {
    const zuletzt = new Map<string, number>();
    for (let n = 0; n < VARIANTEN / 3; n++) {
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
    assert.equal(new Set(monat.map((v) => v.motiv.name)).size, MOTIVE.length);
    assert.equal(
      new Set(monat.map((v) => v.schmuck.name)).size,
      SCHMUCK.length,
    );
  });

  it("gestaltet die drei Posts eines Tages verschieden und wechselt täglich", () => {
    // Die Folge hat so viele Plätze wie die Schmuck-Stelle, jede
    // Gestaltung des Wechsels genau einmal (mindestens sechs sichtbar
    // verschiedene, die klassische eingeschlossen). Nur das Kalenderblatt
    // steht nicht darin: Es braucht einen Anlass.
    assert.equal(LAYOUT_FOLGE.length, SCHMUCK.length);
    assert.equal(new Set(LAYOUT_FOLGE).size, LAYOUT_FOLGE.length);
    assert.ok(LAYOUT_FOLGE.length >= 6);
    assert.ok(LAYOUT_FOLGE.includes("klassik"));
    assert.ok(!LAYOUT_FOLGE.includes("kalenderblatt"));
    assert.deepEqual(
      new Set([...LAYOUT_FOLGE, "kalenderblatt"]),
      new Set(LAYOUTS),
    );
    for (let n = -10; n < VARIANTEN / 3; n++) {
      const tag = [0, 1, 2].map((platz) => varianteFuer(n, platz).layout);
      assert.equal(new Set(tag).size, 3, `Tag ${n}: ${tag.join(", ")}`);
      assert.notEqual(tag[0], varianteFuer(n - 1).layout, `Tag ${n}`);
    }
    // „Anderes Design“ im Story-Studio kommt auch mit anderer Gestaltung.
    const anders = [1, 2, 3].map((v) => varianteFuer(6, 0, v).layout);
    assert.ok(anders.some((l) => l !== varianteFuer(6).layout));
  });

  it("bringt in 30 Tagen jede Gestaltung, die klassische eingeschlossen", () => {
    for (const start of [6, 133, 401, 2020]) {
      const monat = Array.from({ length: 30 }, (_, i) =>
        varianteFuer(start + i),
      );
      const gesehen = new Set(monat.map((v) => v.layout));
      assert.equal(gesehen.size, LAYOUT_FOLGE.length, `ab Tag ${start}`);
      assert.ok(gesehen.has("klassik"), `ab Tag ${start}`);
      // Auch über alle drei Posts: Jede Gestaltung bleibt im Wechsel,
      // keine drängt sich vor.
      const alle = monat.flatMap((_, i) =>
        [0, 1, 2].map((platz) => varianteFuer(start + i, platz).layout),
      );
      for (const layout of LAYOUT_FOLGE) {
        const anzahl = alle.filter((l) => l === layout).length;
        assert.ok(
          anzahl >= 8 && anzahl <= 25,
          `${layout}: ${anzahl} ab Tag ${start}`,
        );
      }
    }
  });

  it("stellt den tagesaktuellen Spruch des Tages jeden zweiten Tag als Kalenderblatt", () => {
    let kalender = 0;
    for (let n = -10; n < 2000; n++) {
      // Ein Tag mit drei tagesaktuellen Posts: drei verschiedene Gestaltungen.
      const tag = [0, 1, 2].map((platz) =>
        gestaltungFuer({ nummer: n, platz, anlass: "Erster Advent" }),
      );
      assert.equal(new Set(tag).size, 3, `Tag ${n}: ${tag.join(", ")}`);
      // Nur der Spruch des Tages, und nur an jedem zweiten Tag.
      assert.equal(tag[0] === "kalenderblatt", n % 2 === 0, `Tag ${n}`);
      assert.ok(!tag.slice(1).includes("kalenderblatt"), `Tag ${n}`);
      if (tag[0] === "kalenderblatt") kalender++;
      // Ohne Anlass (Reserve) nie, sondern die Gestaltung des Wechsels.
      for (const platz of [0, 1, 2]) {
        const ohne = gestaltungFuer({ nummer: n, platz, anlass: null });
        assert.equal(ohne, varianteFuer(n, platz).layout, `Tag ${n}`);
        assert.equal(
          gestaltungFuer({ nummer: n, platz, anlass: "  " }),
          ohne,
          `leerer Anlass an Tag ${n}`,
        );
      }
      // An den anderen Tagen die Gestaltung des Wechsels.
      if (n % 2 !== 0) assert.equal(tag[0], varianteFuer(n).layout);
    }
    assert.ok(kalender > 900);
    // „Anderes Design“ im Story-Studio wechselt auch hier die Gestaltung.
    assert.notEqual(
      gestaltungFuer({ nummer: 10, platz: 0, anlass: "Black Friday" }, 1),
      "kalenderblatt",
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
});

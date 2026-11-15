import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SPRUECHE,
  THEMA_LABEL,
  spruchFuer,
  spruecheBis,
  tagInHamburg,
} from "@/lib/sprueche-data";

describe("Sprüche des Tages", () => {
  it("hat genug Sprüche für mehr als zwei Monate ohne Wiederholung", () => {
    assert.ok(SPRUECHE.length >= 60);
  });

  it("jeder Spruch steht nur einmal in der Liste", () => {
    const texte = SPRUECHE.map((s) => s.text.toLowerCase());
    assert.equal(new Set(texte).size, texte.length);
  });

  it("hält die Längen ein und endet als Satz", () => {
    for (const s of SPRUECHE) {
      assert.ok(s.text.length <= 120, s.text);
      assert.ok(s.text.length >= 20, s.text);
      assert.match(s.text, /[.!?]$/, s.text);
      if (s.zusatz) {
        assert.ok(s.zusatz.length <= 110, s.zusatz);
        assert.match(s.zusatz, /[.!?]$/, s.zusatz);
      }
      assert.ok(THEMA_LABEL[s.thema], s.text);
    }
  });

  it("nennt keine Zahlen, Preise, Marken oder Technik-Schlagworte", () => {
    const verboten =
      /\d|%|€|\b(KI|AI|ChatGPT|Apple|Google Ads|Instagram|Facebook|TikTok|garantiert|Garantie|Platz eins|Nummer eins|Testsieger|ausgezeichnet)\b/;
    for (const s of SPRUECHE) {
      assert.doesNotMatch(`${s.text} ${s.zusatz ?? ""}`, verboten, s.text);
    }
  });

  it("bleibt in der Sie-Form", () => {
    const du =
      /\b(du|dich|dir|dein|deine|deiner|deinem|deinen|euch|euer|eure)\b/i;
    for (const s of SPRUECHE) {
      assert.doesNotMatch(`${s.text} ${s.zusatz ?? ""}`, du, s.text);
    }
  });

  it("gibt für denselben Tag denselben Spruch und am nächsten Tag einen anderen", () => {
    assert.equal(spruchFuer("2026-11-15"), spruchFuer("2026-11-15"));
    let tag = Date.UTC(2026, 10, 1);
    for (let i = 0; i < 400; i++) {
      const heute = new Date(tag).toISOString().slice(0, 10);
      const morgen = new Date(tag + 86_400_000).toISOString().slice(0, 10);
      assert.notEqual(spruchFuer(heute).text, spruchFuer(morgen).text, heute);
      tag += 86_400_000;
    }
  });

  it("rechnet den Tag nach Hamburger Zeit", () => {
    // 23:30 Uhr UTC ist in Hamburg schon der nächste Tag.
    assert.equal(tagInHamburg(new Date("2026-11-14T23:30:00Z")), "2026-11-15");
    assert.equal(tagInHamburg(new Date("2026-07-01T21:59:00Z")), "2026-07-01");
    assert.equal(tagInHamburg(new Date("2026-07-01T22:00:00Z")), "2026-07-02");
  });

  it("liefert sieben Tage rückwärts, heute zuerst", () => {
    const woche = spruecheBis(new Date("2026-11-15T10:00:00Z"));
    assert.deepEqual(
      woche.map((t) => t.datum),
      [
        "2026-11-15",
        "2026-11-14",
        "2026-11-13",
        "2026-11-12",
        "2026-11-11",
        "2026-11-10",
        "2026-11-09",
      ],
    );
    assert.equal(woche[0].tagImMonat, "15");
    assert.ok(woche[0].datumText.includes("15.11.2026"));
    assert.equal(new Set(woche.map((t) => t.text)).size, 7);
  });

  it("kommt auch über den Monatswechsel und vor dem Startdatum zurecht", () => {
    const woche = spruecheBis(new Date("2026-03-02T10:00:00Z"));
    assert.equal(woche[2].datum, "2026-02-28");
    assert.ok(woche.every((t) => t.text.length > 0));
  });
});

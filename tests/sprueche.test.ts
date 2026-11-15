import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  KICKER,
  SPRUECHE,
  THEMA_LABEL,
  spruchFuer,
  spruchTag,
  spruecheBis,
  storyBeschriftung,
  tagInHamburg,
  tagVersetzt,
  teileSatz,
} from "@/lib/sprueche-data";

const ganz = (s: { kicker: string; text: string; zusatz: string }) =>
  `${s.kicker} ${s.text} ${s.zusatz}`;

describe("Sprüche des Tages", () => {
  it("hat genug Karten für mehr als zwei Monate ohne Wiederholung", () => {
    assert.ok(SPRUECHE.length >= 60, String(SPRUECHE.length));
  });

  it("jeder Satz steht nur einmal in der Liste", () => {
    const texte = SPRUECHE.map((s) => s.text.toLowerCase());
    assert.equal(new Set(texte).size, texte.length);
  });

  it("hält Längen, Satzende, Kicker und Thema ein", () => {
    for (const s of SPRUECHE) {
      assert.ok(
        s.text.length >= 15 && s.text.length <= 80,
        `${s.text.length}: ${s.text}`,
      );
      assert.match(s.text, /[.!?]$/, s.text);
      assert.ok(
        s.zusatz.length >= 10 && s.zusatz.length <= 100,
        `${s.zusatz.length}: ${s.zusatz}`,
      );
      assert.match(s.zusatz, /[.!?]$/, s.zusatz);
      assert.ok(
        (KICKER as readonly string[]).includes(s.kicker),
        `${s.kicker}: ${s.text}`,
      );
      assert.ok(THEMA_LABEL[s.thema], s.text);
      assert.ok(
        (ganz(s).match(/!/g) ?? []).length <= 1,
        `zu viele Ausrufezeichen: ${s.text}`,
      );
    }
  });

  it("hebt einen wörtlichen Ausschnitt aus ganzen Wörtern hervor", () => {
    for (const s of SPRUECHE) {
      const [vor, mitte, nach] = teileSatz(s.text, s.betont);
      assert.equal(
        mitte,
        s.betont,
        `nicht im Satz: „${s.betont}“ in „${s.text}“`,
      );
      assert.ok(s.betont.trim() === s.betont && s.betont.length >= 3, s.betont);
      assert.ok(s.betont.split(" ").length <= 4, `zu lang: ${s.betont}`);
      // Der Ausschnitt beginnt und endet an Wortgrenzen.
      assert.ok(
        vor === "" || /[\s„(]$/.test(vor),
        `mitten im Wort: „${s.betont}“ in „${s.text}“`,
      );
      assert.ok(
        nach === "" || /^[\s.,!?:;“)]/.test(nach),
        `mitten im Wort: „${s.betont}“ in „${s.text}“`,
      );
      assert.equal(vor + mitte + nach, s.text);
    }
  });

  it("nennt keine Zahlen, Preise, Marken, Garantien oder Technik-Schlagworte", () => {
    const verboten =
      /\d|%|€|#|\b(KI|AI|ChatGPT|Chatbot|Apple|Google Ads|Instagram|Facebook|TikTok|WhatsApp|Wix|Jimdo|WordPress|garantiert|Garantie|Platz eins|Nummer eins|Testsieger|ausgezeichnet|SEO|Conversion|Landingpage|Performance|UX|CTA)\b|künstliche Intelligenz/;
    for (const s of SPRUECHE)
      assert.doesNotMatch(`${s.text} ${s.zusatz}`, verboten, s.text);
  });

  it("enthält keine Emojis", () => {
    for (const s of SPRUECHE)
      assert.doesNotMatch(ganz(s), /\p{Extended_Pictographic}/u, s.text);
  });

  it("bleibt in der Sie-Form", () => {
    const du =
      /\b(du|dich|dir|dein|deine|deiner|deinem|deinen|deins|euch|euer|eure)\b/i;
    for (const s of SPRUECHE)
      assert.doesNotMatch(`${s.text} ${s.zusatz}`, du, s.text);
  });

  it("gibt für denselben Tag dieselbe Karte und am nächsten Tag eine andere", () => {
    assert.equal(spruchFuer("2026-11-15"), spruchFuer("2026-11-15"));
    let tag = "2026-11-01";
    for (let i = 0; i < 400; i++) {
      const morgen = tagVersetzt(tag, 1);
      assert.notEqual(spruchFuer(tag).text, spruchFuer(morgen).text, tag);
      tag = morgen;
    }
  });

  it("wechselt in aufeinanderfolgenden Tagen Thema oder Kicker", () => {
    for (let i = 0; i < SPRUECHE.length; i++) {
      const a = SPRUECHE[i];
      const b = SPRUECHE[(i + 1) % SPRUECHE.length];
      assert.ok(
        a.thema !== b.thema || a.kicker !== b.kicker,
        `${a.text} / ${b.text}`,
      );
    }
  });

  it("rechnet den Tag nach Hamburger Zeit", () => {
    // 23:30 Uhr UTC ist in Hamburg schon der nächste Tag.
    assert.equal(tagInHamburg(new Date("2026-11-14T23:30:00Z")), "2026-11-15");
    assert.equal(tagInHamburg(new Date("2026-07-01T21:59:00Z")), "2026-07-01");
    assert.equal(tagInHamburg(new Date("2026-07-01T22:00:00Z")), "2026-07-02");
  });

  it("versetzt Tage über Monats- und Jahresgrenzen", () => {
    assert.equal(tagVersetzt("2026-12-31", 1), "2027-01-01");
    assert.equal(tagVersetzt("2026-03-01", -1), "2026-02-28");
    assert.equal(tagVersetzt("2028-02-28", 1), "2028-02-29");
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
    assert.ok(woche[0].datumKurz.endsWith("15.11."));
    assert.equal(new Set(woche.map((t) => t.text)).size, 7);
  });

  it("baut Karte und Beitragstext für einen beliebigen Tag", () => {
    const k = spruchTag("2027-02-28");
    assert.equal(k.datum, "2027-02-28");
    assert.equal(k.text, spruchFuer("2027-02-28").text);
    const b = storyBeschriftung(k);
    assert.ok(
      b.startsWith(`${k.text}\n${k.zusatz}\n\n#webdesign #hamburg #sitalo `),
    );
    assert.doesNotMatch(b, /undefined/);
  });
});

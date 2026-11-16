import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  KICKER,
  POSTS_PRO_TAG,
  SPRUECHE,
  SPRUECHE_EXTRA,
  THEMA_LABEL,
  extraFuer,
  postsFuer,
  spruchFuer,
  spruchTag,
  spruecheBis,
  storyBeschriftung,
  tagInHamburg,
  tagVersetzt,
  teileSatz,
  vorratTage,
  vorratTageExtra,
} from "@/lib/sprueche-data";

/** Alle Karten: Sprüche des Tages und Zusatz-Posts. Für beide gelten dieselben Regeln. */
const ALLE = [...SPRUECHE, ...SPRUECHE_EXTRA];

const ganz = (s: { kicker: string; text: string; zusatz: string }) =>
  `${s.kicker} ${s.text} ${s.zusatz}`;

describe("Sprüche des Tages", () => {
  it("hat genug Karten für mehr als zwei Monate ohne Wiederholung", () => {
    assert.ok(SPRUECHE.length >= 60, String(SPRUECHE.length));
  });

  it("jeder Satz steht nur einmal in der Liste", () => {
    const texte = ALLE.map((s) => s.text.toLowerCase());
    assert.equal(new Set(texte).size, texte.length);
  });

  it("hat keine zwei Sätze mit fast denselben Wörtern", () => {
    // Fängt Beinahe-Doppelungen ab, wenn neue Karten angehängt werden.
    const woerter = (text: string) =>
      new Set(
        text
          .toLowerCase()
          .replace(/[^a-zäöüß ]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length >= 5),
      );
    const saetze = ALLE.map((s) => woerter(s.text));
    for (let i = 0; i < saetze.length; i++) {
      for (let j = i + 1; j < saetze.length; j++) {
        const gemeinsam = [...saetze[i]].filter((w) => saetze[j].has(w)).length;
        const anteil =
          gemeinsam / (saetze[i].size + saetze[j].size - gemeinsam || 1);
        assert.ok(
          gemeinsam < 3 || anteil < 0.5,
          `zu ähnlich: „${ALLE[i].text}“ / „${ALLE[j].text}“`,
        );
      }
    }
  });

  it("hält Längen, Satzende, Kicker und Thema ein", () => {
    for (const s of ALLE) {
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
    for (const s of ALLE) {
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
    for (const s of ALLE)
      assert.doesNotMatch(`${s.text} ${s.zusatz}`, verboten, s.text);
  });

  it("enthält keine Emojis", () => {
    for (const s of ALLE)
      assert.doesNotMatch(ganz(s), /\p{Extended_Pictographic}/u, s.text);
  });

  it("bleibt in der Sie-Form", () => {
    const du =
      /\b(du|dich|dir|dein|deine|deiner|deinem|deinen|deins|euch|euer|eure)\b/i;
    for (const s of ALLE)
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

  it("gibt jedem Tag seit dem Start eine eigene Karte, bis der Vorrat endet", () => {
    // Starttag 9.11.2026 ist Karte 0; am 15.11. (erster Tag online) Karte 6.
    assert.equal(spruchFuer("2026-11-09"), SPRUECHE[0]);
    assert.equal(spruchFuer("2026-11-15"), SPRUECHE[6]);
    const gesehen = new Set<string>();
    let tag = "2026-11-09";
    for (let i = 0; i < SPRUECHE.length; i++) {
      const text = spruchFuer(tag).text;
      assert.ok(!gesehen.has(text), `wiederholt sich am ${tag}: ${text}`);
      gesehen.add(text);
      tag = tagVersetzt(tag, 1);
    }
    // Erst danach beginnt die Liste von vorn.
    assert.equal(spruchFuer(tag), SPRUECHE[0]);
  });

  it("zählt den Vorrat in Tagen, heute mitgezählt", () => {
    assert.equal(vorratTage(new Date("2026-11-09T10:00:00Z")), SPRUECHE.length);
    assert.equal(
      vorratTage(new Date("2026-11-15T10:00:00Z")),
      SPRUECHE.length - 6,
    );
    const letzter = tagVersetzt("2026-11-09", SPRUECHE.length - 1);
    assert.equal(vorratTage(new Date(`${letzter}T10:00:00Z`)), 1);
    assert.equal(
      vorratTage(new Date(`${tagVersetzt(letzter, 1)}T10:00:00Z`)),
      0,
    );
  });

  it("gibt jedem Tag drei verschiedene Posts: Spruch des Tages und zwei Zusatz-Posts", () => {
    assert.equal(POSTS_PRO_TAG, 3);
    assert.equal(SPRUECHE_EXTRA.length % 2, 0, "Zusatz-Posts immer paarweise");
    assert.ok(SPRUECHE_EXTRA.length >= 28, String(SPRUECHE_EXTRA.length));
    // Erster Tag mit Zusatz-Posts ist der 15.11.2026.
    assert.equal(extraFuer("2026-11-14", 1), null);
    assert.equal(extraFuer("2026-11-15", 1), SPRUECHE_EXTRA[0]);
    assert.equal(extraFuer("2026-11-15", 2), SPRUECHE_EXTRA[1]);
    assert.equal(extraFuer("2026-11-16", 1), SPRUECHE_EXTRA[2]);
    assert.equal(extraFuer("2026-11-15", 0), null);
    assert.equal(extraFuer("2026-11-15", 3), null);
    const posts = postsFuer("2026-11-17", {});
    assert.deepEqual(
      posts.map((p) => p.platz),
      [0, 1, 2],
    );
    assert.equal(posts[0].text, spruchFuer("2026-11-17").text);
    assert.equal(new Set(posts.map((p) => p.text)).size, 3);
    assert.ok(
      posts.every(
        (p) => p.datum === "2026-11-17" && p.nummer === posts[0].nummer,
      ),
    );
    // Vor dem Start der Zusatz-Posts gibt es nur den Spruch des Tages.
    assert.equal(postsFuer("2026-11-10", {}).length, 1);
  });

  it("wiederholt keinen Zusatz-Post, solange der Vorrat reicht, und zählt ihn", () => {
    const gesehen = new Set<string>();
    const tage = SPRUECHE_EXTRA.length / 2;
    let tag = "2026-11-15";
    for (let i = 0; i < tage; i++) {
      for (const platz of [1, 2]) {
        const text = extraFuer(tag, platz)?.text ?? "";
        assert.ok(text && !gesehen.has(text), `wiederholt sich am ${tag}`);
        gesehen.add(text);
      }
      tag = tagVersetzt(tag, 1);
    }
    assert.equal(vorratTageExtra(new Date("2026-11-15T10:00:00Z")), tage);
    assert.equal(vorratTageExtra(new Date("2026-11-20T10:00:00Z")), tage - 5);
    assert.equal(vorratTageExtra(new Date("2026-11-01T10:00:00Z")), tage);
  });

  it("wechselt auch bei den Zusatz-Posts nacheinander Thema oder Kicker", () => {
    for (let i = 0; i + 1 < SPRUECHE_EXTRA.length; i++) {
      const a = SPRUECHE_EXTRA[i];
      const b = SPRUECHE_EXTRA[i + 1];
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
    const woche = spruecheBis(new Date("2026-11-15T10:00:00Z"), 7, {});
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
    const k = spruchTag("2027-02-28", {});
    assert.equal(k.datum, "2027-02-28");
    assert.equal(k.text, spruchFuer("2027-02-28").text);
    const b = storyBeschriftung(k);
    assert.ok(
      b.startsWith(`${k.text}\n${k.zusatz}\n\n#webdesign #hamburg #sitalo `),
    );
    assert.doesNotMatch(b, /undefined/);
  });
  it("bevorzugt tagesaktuelle Karten und füllt mit der Reserve auf", () => {
    const aktuell = {
      "2026-11-27": [
        {
          kicker: "Hot Take" as const,
          text: "Heute rabattiert die halbe Stadt, Ihre Website bleibt einfach gut.",
          betont: "einfach gut",
          zusatz: "Ein klares Angebot braucht keinen Countdown.",
          thema: "eindruck" as const,
          anlass: "Black Friday",
        },
      ],
    };
    const posts = postsFuer("2026-11-27", aktuell);
    assert.deepEqual(
      posts.map((p) => [p.platz, p.herkunft, p.anlass]),
      [
        [0, "aktuell", "Black Friday"],
        [1, "vorrat", null],
        [2, "vorrat", null],
      ],
    );
    assert.equal(posts[0].text, aktuell["2026-11-27"][0].text);
    assert.equal(posts[1].text, extraFuer("2026-11-27", 1)?.text);
    assert.ok(posts.every((p) => p.nummer === posts[0].nummer));
    // Ohne Eintrag für den Tag gilt die Reserve.
    const ohne = postsFuer("2026-11-28", aktuell);
    assert.equal(ohne[0].text, spruchFuer("2026-11-28").text);
    assert.equal(ohne[0].herkunft, "vorrat");
    assert.equal(spruchTag("2026-11-27", aktuell).anlass, "Black Friday");
    assert.equal(
      spruecheBis(new Date("2026-11-28T10:00:00Z"), 2, aktuell)[1].anlass,
      "Black Friday",
    );
  });
});

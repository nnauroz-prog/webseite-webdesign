import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AblaufEingabe } from "@/lib/redaktion/ablauf";
import type { ModellFehlerArt, RedaktionModell } from "@/lib/redaktion/modell";
import type { StorySerie } from "@/lib/story-serie";

import {
  fehlerZeile,
  LEKTORAT_RUNDEN,
  MAX_TOKENS,
  redaktionAblauf,
} from "@/lib/redaktion/ablauf";
import { ModellFehler } from "@/lib/redaktion/modell";
import {
  SCHEMA_IDEE,
  SCHEMA_SERIE,
  SYSTEM_LEKTOR,
  SYSTEM_SCOUT,
  SYSTEM_TEXTERIN,
} from "@/lib/redaktion/prompts";
import { REDAKTION_SCHRITTE } from "@/lib/redaktion/vertrag";
import { pruefeSerie } from "@/lib/story-serie";
import {
  ANDERE_SERIE,
  antwort,
  attrappe,
  GUTE_SERIE,
  IDEE,
  sammler,
  SCHLECHTE_SERIE,
  testKontext,
} from "@/tests/redaktion-attrappe";

const HAUPT = "claude-opus-5-5";
const ERSATZ = "claude-opus-4-7";
const AUFTRAG = {
  auftrag: "Story-Serie zu Black Friday",
  datum: "2026-11-27",
};

/** Ablauf mit Attrappe; gibt Ergebnis, Zeilen und Gespeichertes zurück. */
async function lauf(
  modell: RedaktionModell,
  mehr: Partial<AblaufEingabe> = {},
) {
  const s = sammler();
  const gespeichert: StorySerie[] = [];
  const ergebnis = await redaktionAblauf({
    auftrag: AUFTRAG,
    kontext: testKontext(),
    modell,
    modelle: { haupt: HAUPT, ersatz: ERSATZ },
    sende: s.sende,
    speichere: async (serie) => {
      gespeichert.push(serie);
      return "11111111-1111-4111-8111-111111111111";
    },
    ...mehr,
  });
  return { ergebnis, gespeichert, ...s };
}

const ALLE_SCHRITTE = REDAKTION_SCHRITTE.flatMap((s) => [
  `${s}:laeuft`,
  `${s}:fertig`,
]);

describe("Attrappen", () => {
  it("die guten Serien halten alle Regeln ein, die schlechte nicht", () => {
    assert.deepEqual(pruefeSerie(GUTE_SERIE), []);
    assert.deepEqual(pruefeSerie(ANDERE_SERIE), []);
    assert.ok(pruefeSerie(SCHLECHTE_SERIE).length >= 3);
  });
});

describe("redaktionAblauf: der gute Weg", () => {
  it("meldet die vier Schritte in der Reihenfolge des Vertrags und endet mit der Serie", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"]);
    assert.deepEqual(r.ergebnis, {
      ok: true,
      id: "11111111-1111-4111-8111-111111111111",
      modell: HAUPT,
      runden: 1,
    });
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, GUTE_SERIE);
    assert.equal(letzte.id, "11111111-1111-4111-8111-111111111111");
    assert.deepEqual(pruefeSerie(letzte.serie), []);
    assert.deepEqual(r.gespeichert, [GUTE_SERIE]);
  });

  it("drei Rollen, je ein Aufruf mit eigener Vorgabe, Schema und Aufwand", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    await lauf(m);
    assert.deepEqual(
      m.anfragen.map((a) => a.system),
      [SYSTEM_SCOUT, SYSTEM_TEXTERIN, SYSTEM_LEKTOR],
    );
    assert.deepEqual(
      m.anfragen.map((a) => a.schema),
      [SCHEMA_IDEE, SCHEMA_SERIE, SCHEMA_SERIE],
    );
    assert.deepEqual(
      m.anfragen.map((a) => a.aufwand),
      ["low", "medium", "medium"],
    );
    assert.deepEqual(
      m.anfragen.map((a) => a.maxTokens),
      [MAX_TOKENS.idee, MAX_TOKENS.text, MAX_TOKENS.lektorat],
    );
    for (const a of m.anfragen) {
      assert.equal(a.modell, HAUPT);
      // Der Auftrag steht als Material im nutzer-Teil, nie in der Vorgabe.
      assert.ok(a.nutzer.includes("Story-Serie zu Black Friday"));
      assert.ok(!a.system.includes("Story-Serie zu Black Friday"));
    }
    // Texterin und Lektor bekommen den Blickwinkel des Scouts.
    assert.ok(m.anfragen[1].nutzer.includes(IDEE.winkel));
    assert.ok(m.anfragen[2].nutzer.includes(IDEE.winkel));
    // Der Lektor bekommt den Entwurf und das Ergebnis der Prüfung.
    assert.ok(m.anfragen[2].nutzer.includes(GUTE_SERIE.folien[1].text));
    assert.ok(
      m.anfragen[2].nutzer.includes("Der Entwurf hält alle harten Regeln ein"),
    );
  });

  it("Hinweise in Du-Form oder ohne Anrede, kurz, ohne Technik", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(ANDERE_SERIE),
    ]);
    const r = await lauf(m);
    const hinweise = r.ereignisse.flatMap((e) =>
      e.typ === "schritt" && e.hinweis ? [e.hinweis] : [],
    );
    assert.equal(hinweise.length, ALLE_SCHRITTE.length);
    for (const h of hinweise) {
      assert.ok(h.length <= 90, h);
      assert.doesNotMatch(h, /\b(Sie|Ihre?n?)\b/, h);
      assert.doesNotMatch(h, /\b(KI|AI|Token|Prompt|JSON|API)\b/, h);
    }
    assert.ok(hinweise.includes("Thema: Black Friday"));
    assert.ok(hinweise.includes("4 Bilder im Entwurf."));
    assert.ok(hinweise.includes("Der Lektor hat nachgeschärft."));
    // Die Fassung des Lektors gewinnt.
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, ANDERE_SERIE);
  });

  it("Lektor ändert nichts: Hinweis sagt es", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.ok(
      r.ereignisse.some(
        (e) =>
          e.typ === "schritt" &&
          e.schritt === "lektorat" &&
          e.stand === "fertig" &&
          e.hinweis === "Nichts zu ändern: Der Entwurf sitzt.",
      ),
    );
  });

  it("räumt die Antwort auf: Schreibweise der Auswahlfelder, Leerzeichen, fremde Felder", async () => {
    const roh = {
      titel: "  Black Friday ",
      quelle: "https://example.org/erfunden",
      folien: GUTE_SERIE.folien.map((f, i) => ({
        ...f,
        kicker: f.kicker.toLowerCase(),
        thema: f.thema.toUpperCase(),
        text: i === 0 ? `  ${f.text}  ` : f.text,
        notiz: "gehört nicht dazu",
      })),
    };
    const m = attrappe([antwort(IDEE), antwort(roh), antwort(roh)]);
    const r = await lauf(m);
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, GUTE_SERIE);
  });

  it("Titelvorschlag gegen die Regeln: neutraler Hinweis, die Texterin erfährt den Verstoß", async () => {
    const m = attrappe([
      antwort({ ...IDEE, titel: "Black Friday 2026!" }),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"]);
    const idee = r.ereignisse[1];
    assert.ok(idee.typ === "schritt");
    assert.equal(idee.hinweis, "Der Blickwinkel steht.");
    assert.ok(
      m.anfragen[1].nutzer.includes("Der Titelvorschlag verletzt die Regeln"),
    );
  });

  it("Speichern scheitert: Die Serie kommt trotzdem, ohne Kennung", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m, {
      speichere: async () => {
        throw new Error("Datenbank weg");
      },
    });
    assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"]);
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.equal(letzte.id, null);
    assert.ok(r.ergebnis.ok && r.ergebnis.id === null);
  });
});

describe("redaktionAblauf: Lektorat mit Nachbessern", () => {
  it("ungültiger Entwurf, dann eine gültige Fassung: eine Runde, Befunde im Material", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(SCHLECHTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"]);
    const lektor = m.anfragen[2].nutzer;
    assert.ok(lektor.includes("## Entwurf der Texterin"));
    assert.ok(lektor.includes("Bild 1: Satz hat 94 Zeichen"));
    assert.ok(lektor.includes("Bild 2: Pointe „die Seite schweigt“"));
    assert.ok(lektor.includes("Bild 4: Du-Form"));
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, GUTE_SERIE);
  });

  it("erst ungültig, dann wieder ungültig, dann gültig: zweite Runde mit neuem Hinweis", async () => {
    const nochSchlecht = {
      ...GUTE_SERIE,
      folien: [
        GUTE_SERIE.folien[0],
        { ...GUTE_SERIE.folien[1], betont: "die Seite schweigt" },
        GUTE_SERIE.folien[2],
        GUTE_SERIE.folien[3],
      ],
    };
    const m = attrappe([
      antwort(IDEE),
      antwort(SCHLECHTE_SERIE),
      antwort(nochSchlecht),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), [
      "idee:laeuft",
      "idee:fertig",
      "text:laeuft",
      "text:fertig",
      "lektorat:laeuft",
      "lektorat:laeuft",
      "lektorat:fertig",
      "gestaltung:laeuft",
      "gestaltung:fertig",
      "serie",
    ]);
    assert.ok(r.ergebnis.ok && r.ergebnis.runden === 2);
    assert.equal(m.anfragen.length, 4);
    const zweite = m.anfragen[3];
    assert.equal(zweite.system, SYSTEM_LEKTOR);
    assert.equal(zweite.aufwand, "low");
    assert.ok(zweite.nutzer.includes("## Zweite Runde"));
    // Nur noch der offene Befund, nicht mehr die behobenen.
    assert.ok(zweite.nutzer.includes("Bild 2: Pointe „die Seite schweigt“"));
    assert.ok(!zweite.nutzer.includes("Bild 1: Satz hat 94 Zeichen"));
    const runde2 = r.ereignisse[5];
    assert.ok(runde2.typ === "schritt");
    assert.equal(runde2.hinweis, "Zweite Runde: Der Lektor bessert nach.");
  });

  it("bleibt es ungültig, endet der Ablauf mit „regeln“: keine Serie, nichts gespeichert", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(SCHLECHTE_SERIE),
      antwort(SCHLECHTE_SERIE),
      antwort(SCHLECHTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.equal(m.anfragen.length, 2 + LEKTORAT_RUNDEN);
    assert.equal(r.folge().at(-1), "fehler:regeln");
    assert.ok(!r.folge().includes("serie"));
    assert.ok(!r.folge().includes("lektorat:fertig"));
    assert.deepEqual(r.gespeichert, []);
    assert.deepEqual(r.ergebnis, { ok: false, code: "regeln", art: "regeln" });
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "fehler");
    assert.match(letzte.text, /Regeln/);
    assert.doesNotMatch(letzte.text, /\b(Sie|Ihre?n?)\b/);
  });

  it("gültiger Entwurf, der Lektor macht ihn zweimal kaputt: Die Fassung der Texterin geht raus", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(SCHLECHTE_SERIE),
      antwort(SCHLECHTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.equal(r.folge().at(-1), "serie");
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, GUTE_SERIE);
    assert.ok(
      r.ereignisse.some(
        (e) =>
          e.typ === "schritt" &&
          e.hinweis ===
            "Die Fassung der Texterin bleibt: Sie hält alle Regeln ein.",
      ),
    );
  });

  it("Lektor fällt aus, der Entwurf ist gültig: Der Entwurf geht raus, mit ehrlichem Hinweis", async () => {
    for (const art of ["ueberlastet", "zeit", "verbindung"] as const) {
      const m = attrappe([
        antwort(IDEE),
        antwort(GUTE_SERIE),
        new ModellFehler(art),
      ]);
      const r = await lauf(m);
      assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"], art);
      const fertig = r.ereignisse.find(
        (e) =>
          e.typ === "schritt" &&
          e.schritt === "lektorat" &&
          e.stand === "fertig",
      );
      assert.ok(fertig?.typ === "schritt");
      assert.match(fertig.hinweis ?? "", /Lektor war nicht erreichbar/);
    }
  });

  it("Lektor fällt aus und der Entwurf ist ungültig: Fehler statt Serie", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(SCHLECHTE_SERIE),
      new ModellFehler("ueberlastet", 529),
    ]);
    const r = await lauf(m);
    assert.equal(r.folge().at(-1), "fehler:modell");
    assert.ok(!r.folge().includes("serie"));
    assert.deepEqual(r.gespeichert, []);
  });

  it("ein Satz, der schon erschienen ist, ist ein harter Befund für den Lektor", async () => {
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(ANDERE_SERIE),
    ]);
    const kontext = testKontext({
      gespeichert: [{ datum: "2026-11-20", serie: GUTE_SERIE }],
    });
    const r = await lauf(m, { kontext });
    assert.ok(
      m.anfragen[2].nutzer.includes(
        "Bild 1: Der Satz ist schon erschienen (Serie „Black Friday“).",
      ),
    );
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, ANDERE_SERIE);
  });

  it("gibt nie eine Serie heraus, die pruefeSerie beanstandet", async () => {
    // Viele Mischungen aus guten und schlechten Antworten durchspielen.
    const bausteine = [GUTE_SERIE, ANDERE_SERIE, SCHLECHTE_SERIE, { x: 1 }];
    for (const a of bausteine)
      for (const b of bausteine)
        for (const c of bausteine) {
          const m = attrappe([
            antwort(IDEE),
            antwort(a),
            antwort(b),
            antwort(c),
          ]);
          const r = await lauf(m);
          const letzte = r.ereignisse.at(-1);
          assert.ok(letzte && letzte.typ !== "schritt");
          if (letzte.typ === "serie") {
            assert.deepEqual(pruefeSerie(letzte.serie), []);
            assert.equal(r.gespeichert.length, 1);
          } else {
            assert.deepEqual(r.gespeichert, []);
          }
          // Nach der Schlusszeile kommt nichts mehr.
          assert.equal(
            r.ereignisse.filter((e) => e.typ !== "schritt").length,
            1,
          );
        }
  });
});

describe("redaktionAblauf: Fehler des Modells", () => {
  it("fehlerZeile: jeder Grund hat Code und einen hilfreichen Satz in Du-Form", () => {
    const erwartet: Record<ModellFehlerArt, [string, RegExp]> = {
      schluessel: ["modell", /API-Schlüssel wird abgelehnt.*ANTHROPIC_API_KEY/],
      rechte: ["modell", /darf das Modell nicht nutzen/],
      guthaben: ["modell", /Guthaben/],
      modell_fehlt: ["modell", /Modell gibt es.*STUDIO_MODELL/],
      limit: ["modell", /überlastet oder das Limit/],
      ueberlastet: ["modell", /gerade überlastet/],
      zeit: ["modell", /zu lange gedauert/],
      verbindung: ["modell", /nicht erreichbar/],
      anfrage: ["modell", /STUDIO_MODELL/],
      abgelehnt: ["modell", /abgelehnt.*Formulier/],
      abgeschnitten: ["modell", /unvollständig/],
      format: ["modell", /unvollständig/],
      abbruch: ["unbekannt", /schiefgelaufen/],
      sonst: ["unbekannt", /schiefgelaufen/],
    };
    for (const [art, [code, text]] of Object.entries(erwartet)) {
      const z = fehlerZeile(art as ModellFehlerArt);
      assert.equal(z.typ, "fehler");
      assert.equal(z.code, code, art);
      assert.match(z.text, text, art);
      assert.doesNotMatch(z.text, /\b(Sie|Ihre?n?)\b/, art);
      assert.ok(z.text.length <= 170, art);
    }
  });

  it("401 und 403 enden sofort mit „modell“ und einem Satz zum Schlüssel", async () => {
    for (const [art, status, text] of [
      ["schluessel", 401, /Schlüssel wird abgelehnt/],
      ["rechte", 403, /darf das Modell nicht nutzen/],
    ] as const) {
      const m = attrappe([new ModellFehler(art, status)]);
      const r = await lauf(m);
      assert.deepEqual(r.folge(), ["idee:laeuft", "fehler:modell"]);
      const letzte = r.ereignisse.at(-1);
      assert.ok(letzte?.typ === "fehler");
      assert.match(letzte.text, text);
      assert.deepEqual(r.ergebnis, { ok: false, code: "modell", art, status });
      assert.equal(m.anfragen.length, 1);
    }
  });

  it("429 und 529: „gerade überlastet“", async () => {
    for (const [art, status] of [
      ["limit", 429],
      ["ueberlastet", 529],
    ] as const) {
      const m = attrappe([antwort(IDEE), new ModellFehler(art, status)]);
      const r = await lauf(m);
      assert.deepEqual(r.folge(), [
        "idee:laeuft",
        "idee:fertig",
        "text:laeuft",
        "fehler:modell",
      ]);
      const letzte = r.ereignisse.at(-1);
      assert.ok(letzte?.typ === "fehler");
      assert.match(letzte.text, /überlastet/);
    }
  });

  it("404 beim Modell: Das Ersatzmodell übernimmt, auch für die nächsten Schritte", async () => {
    const m = attrappe([
      new ModellFehler("modell_fehlt", 404),
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), [...ALLE_SCHRITTE, "serie"]);
    assert.deepEqual(
      m.anfragen.map((a) => a.modell),
      [HAUPT, ERSATZ, ERSATZ, ERSATZ],
    );
    assert.ok(r.ergebnis.ok && r.ergebnis.modell === ERSATZ);
  });

  it("404 auch beim Ersatzmodell: „modell“ mit Hinweis auf STUDIO_MODELL", async () => {
    const m = attrappe([
      new ModellFehler("modell_fehlt", 404),
      new ModellFehler("modell_fehlt", 404),
    ]);
    const r = await lauf(m);
    assert.deepEqual(
      m.anfragen.map((a) => a.modell),
      [HAUPT, ERSATZ],
    );
    assert.deepEqual(r.folge(), ["idee:laeuft", "fehler:modell"]);
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "fehler");
    assert.match(letzte.text, /STUDIO_MODELL/);
  });

  it("ohne Ersatzmodell (oder wenn es dasselbe ist) gibt es keinen zweiten Versuch", async () => {
    for (const ersatz of [null, HAUPT]) {
      const m = attrappe([new ModellFehler("modell_fehlt", 404)]);
      const r = await lauf(m, { modelle: { haupt: HAUPT, ersatz } });
      assert.equal(m.anfragen.length, 1);
      assert.equal(r.folge().at(-1), "fehler:modell");
    }
  });

  it("Ablehnung (refusal): einmal das Ersatzmodell, sonst „abgelehnt“", async () => {
    const abgelehnt = { text: "", stopp: "refusal" };
    const m = attrappe([
      abgelehnt,
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.equal(r.folge().at(-1), "serie");
    assert.deepEqual(
      m.anfragen.map((a) => a.modell),
      [HAUPT, ERSATZ, ERSATZ, ERSATZ],
    );

    const m2 = attrappe([abgelehnt, abgelehnt]);
    const r2 = await lauf(m2);
    assert.deepEqual(r2.folge(), ["idee:laeuft", "fehler:modell"]);
    const letzte = r2.ereignisse.at(-1);
    assert.ok(letzte?.typ === "fehler");
    assert.match(letzte.text, /abgelehnt/);
  });

  it("abgeschnittene oder unlesbare Antwort: „modell“, kein Absturz", async () => {
    for (const kaputt of [
      { text: '{"titel": "Black', stopp: "max_tokens" },
      { text: "Hier ist die Serie!", stopp: "end_turn" },
      { text: "[1, 2, 3]", stopp: "end_turn" },
      { text: '{"titel": 5}', stopp: "end_turn" },
    ]) {
      const m = attrappe([antwort(IDEE), kaputt]);
      const r = await lauf(m);
      assert.equal(r.folge().at(-1), "fehler:modell", kaputt.text);
      const letzte = r.ereignisse.at(-1);
      assert.ok(letzte?.typ === "fehler");
      assert.match(letzte.text, /unvollständig/);
    }
  });

  it("JSON mit Text drumherum wird trotzdem gelesen", async () => {
    const m = attrappe([
      { text: `Gern:\n${JSON.stringify(IDEE)}\nFertig.`, stopp: "end_turn" },
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m);
    assert.equal(r.folge().at(-1), "serie");
  });

  it("Frist abgelaufen: kein weiterer Aufruf, „zu lange gedauert“", async () => {
    const signal = AbortSignal.timeout(1);
    await new Promise((fertig) => setTimeout(fertig, 15));
    assert.ok(signal.aborted);
    const m = attrappe([antwort(IDEE)]);
    const r = await lauf(m, { signal });
    assert.equal(m.anfragen.length, 0);
    assert.deepEqual(r.folge(), ["idee:laeuft", "fehler:modell"]);
    const letzte = r.ereignisse.at(-1);
    assert.ok(letzte?.typ === "fehler");
    assert.match(letzte.text, /zu lange gedauert/);
    assert.ok(!r.ergebnis.ok && r.ergebnis.art === "zeit");
  });

  it("Frist läuft mitten im Ablauf ab: Fehler statt halber Serie", async () => {
    const frist = new AbortController();
    const m = attrappe([
      antwort(IDEE),
      () => {
        frist.abort(new DOMException("Frist", "TimeoutError"));
        return antwort(SCHLECHTE_SERIE);
      },
    ]);
    const r = await lauf(m, { signal: frist.signal });
    assert.equal(m.anfragen.length, 2);
    assert.equal(r.folge().at(-1), "fehler:modell");
    assert.ok(!r.ergebnis.ok && r.ergebnis.art === "zeit");
  });

  it("Studio schließt die Verbindung: Abbruch ohne weiteren Aufruf", async () => {
    const studio = new AbortController();
    const m = attrappe([
      () => {
        studio.abort();
        return antwort(IDEE);
      },
      antwort(GUTE_SERIE),
    ]);
    const r = await lauf(m, { signal: studio.signal });
    assert.equal(m.anfragen.length, 1);
    assert.deepEqual(r.ergebnis, {
      ok: false,
      code: "unbekannt",
      art: "abbruch",
    });
    assert.deepEqual(r.gespeichert, []);
  });

  it("gibt das Abbruchsignal an jeden Aufruf weiter", async () => {
    const signal = new AbortController().signal;
    const m = attrappe([
      antwort(IDEE),
      antwort(GUTE_SERIE),
      antwort(GUTE_SERIE),
    ]);
    await lauf(m, { signal });
    for (const a of m.anfragen) assert.equal(a.signal, signal);
  });

  it("unerwarteter Fehler in der Attrappe: „unbekannt“, kein Absturz", async () => {
    const m = attrappe([new Error("kaputt")]);
    const r = await lauf(m);
    assert.deepEqual(r.folge(), ["idee:laeuft", "fehler:unbekannt"]);
    assert.deepEqual(r.ergebnis, {
      ok: false,
      code: "unbekannt",
      art: "sonst",
    });
  });

  it("wirft das Senden selbst, endet der Ablauf trotzdem geordnet", async () => {
    const m = attrappe([antwort(IDEE)]);
    let aufrufe = 0;
    const ergebnis = await redaktionAblauf({
      auftrag: AUFTRAG,
      kontext: testKontext(),
      modell: m,
      modelle: { haupt: HAUPT, ersatz: ERSATZ },
      sende: () => {
        aufrufe++;
        if (aufrufe === 2) throw new Error("Verbindung zu");
      },
      speichere: async () => null,
    });
    assert.deepEqual(ergebnis, {
      ok: false,
      code: "unbekannt",
      art: "unbekannt",
    });
  });
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import ts from "typescript";

import type { AktuellerPost } from "@/lib/posts-aktuell";

import { POSTS_AKTUELL, journalKarten } from "@/lib/sprueche-aktuell";
import {
  KICKER,
  POSTS_PRO_TAG,
  SPRUECHE,
  SPRUECHE_EXTRA,
  THEMA_LABEL,
  anlassTag,
  extraFuer,
  kartenFenster,
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

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const rel = (f: string) => path.relative(ROOT, f).split(path.sep).join("/");

function quellDateien(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) quellDateien(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

const geparst = new Map<string, ts.SourceFile>();
function parse(datei: string): ts.SourceFile {
  let q = geparst.get(datei);
  if (!q) {
    q = ts.createSourceFile(
      datei,
      readFileSync(datei, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      datei.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    geparst.set(datei, q);
  }
  return q;
}

/** Direktive am Dateianfang ("use client", "use server") oder null. */
function direktive(datei: string): string | null {
  const erste = parse(datei).statements[0];
  return erste &&
    ts.isExpressionStatement(erste) &&
    ts.isStringLiteral(erste.expression)
    ? erste.expression.text
    : null;
}

function aufloesen(von: string, spec: string): string | null {
  const basis = spec.startsWith("@/")
    ? path.join(ROOT, spec.slice(2))
    : spec.startsWith(".")
      ? path.resolve(path.dirname(von), spec)
      : null;
  if (!basis) return null;
  for (const c of [
    basis,
    `${basis}.ts`,
    `${basis}.tsx`,
    path.join(basis, "index.ts"),
    path.join(basis, "index.tsx"),
  ]) {
    try {
      if (/\.(ts|tsx)$/.test(c) && statSync(c).isFile()) return c;
    } catch {
      // gibt es nicht, nächster Kandidat
    }
  }
  return null;
}

/** Projektdateien, die eine Datei zur Laufzeit lädt (reine Typ-Importe zählen nicht). */
function laufzeitImporte(datei: string): string[] {
  const ziele: string[] = [];
  for (const s of parse(datei).statements) {
    let spec: ts.Expression | undefined;
    if (ts.isImportDeclaration(s)) {
      const k = s.importClause;
      const nurTypen =
        k?.isTypeOnly ||
        (k &&
          !k.name &&
          k.namedBindings &&
          ts.isNamedImports(k.namedBindings) &&
          k.namedBindings.elements.length > 0 &&
          k.namedBindings.elements.every((e) => e.isTypeOnly));
      if (!nurTypen) spec = s.moduleSpecifier;
    } else if (ts.isExportDeclaration(s) && s.moduleSpecifier) {
      const nurTypen =
        s.isTypeOnly ||
        (s.exportClause &&
          ts.isNamedExports(s.exportClause) &&
          s.exportClause.elements.length > 0 &&
          s.exportClause.elements.every((e) => e.isTypeOnly));
      if (!nurTypen) spec = s.moduleSpecifier;
    }
    if (!spec || !ts.isStringLiteral(spec)) continue;
    const ziel = aufloesen(datei, spec.text);
    if (ziel) ziele.push(ziel);
  }
  return ziele;
}

/**
 * Weg der Laufzeit-Importe von start zu ziel (Pfade ab Projektwurzel)
 * oder null. Server-Action-Dateien ("use server") kommen nicht in den
 * Browser, dort endet die Suche.
 */
function importWeg(start: string, ziel: string): string[] | null {
  const zielDatei = path.join(ROOT, ziel);
  const gesehen = new Set<string>();
  const suche = (datei: string, weg: string[]): string[] | null => {
    if (datei === zielDatei) return [...weg, rel(datei)];
    if (gesehen.has(datei)) return null;
    gesehen.add(datei);
    if (weg.length > 0 && direktive(datei) === "use server") return null;
    for (const naechste of laufzeitImporte(datei)) {
      const w = suche(naechste, [...weg, rel(datei)]);
      if (w) return w;
    }
    return null;
  };
  return suche(path.join(ROOT, start), []);
}

/** Alle Karten der Reserve: Sprüche des Tages und Zusatz-Posts. */
const ALLE = [...SPRUECHE, ...SPRUECHE_EXTRA];

/** Tagesaktuelle Karten mit ihrem Tag (lib/posts-aktuell.ts). */
const AKTUELL = Object.entries(POSTS_AKTUELL).flatMap(([datum, karten]) =>
  karten.map((k) => ({ ...k, datum })),
);

/** Reserve und tagesaktuelle Karten: Für alle gelten dieselben Inhaltsregeln. */
const ALLE_PLUS = [...ALLE, ...AKTUELL];

const ganz = (s: { kicker: string; text: string; zusatz: string }) =>
  `${s.kicker} ${s.text} ${s.zusatz}`;

/** Wörter ab fünf Buchstaben, klein, ohne Satzzeichen und Ziffern. */
const woerter = (text: string, ohne: ReadonlySet<string> = new Set()) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-zäöüß ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !ohne.has(w)),
  );

/** Fängt Beinahe-Doppelungen ab: drei gemeinsame Wörter und halbe Überschneidung. */
function zuAehnlich(a: Set<string>, b: Set<string>): boolean {
  const gemeinsam = [...a].filter((w) => b.has(w)).length;
  const anteil = gemeinsam / (a.size + b.size - gemeinsam || 1);
  return gemeinsam >= 3 && anteil >= 0.5;
}

const VERBOTEN =
  /\d|%|€|#|\b(KI|AI|ChatGPT|Chatbot|Apple|Google Ads|Instagram|Facebook|TikTok|WhatsApp|Wix|Jimdo|WordPress|garantiert|Garantie|Platz eins|Nummer eins|Testsieger|ausgezeichnet|SEO|Conversion|Landingpage|Performance|UX|CTA)\b|künstliche Intelligenz/;

describe("Sprüche des Tages", () => {
  it("hat genug Karten für mehr als zwei Monate ohne Wiederholung", () => {
    assert.ok(SPRUECHE.length >= 60, String(SPRUECHE.length));
  });

  it("jeder Satz steht nur einmal in der Liste", () => {
    const texte = ALLE_PLUS.map((s) => s.text.toLowerCase());
    assert.equal(new Set(texte).size, texte.length);
  });

  it("hat keine zwei Sätze mit fast denselben Wörtern", () => {
    // Fängt Beinahe-Doppelungen ab, wenn neue Karten angehängt werden.
    const saetze = ALLE.map((s) => woerter(s.text));
    for (let i = 0; i < saetze.length; i++) {
      for (let j = i + 1; j < saetze.length; j++) {
        assert.ok(
          !zuAehnlich(saetze[i], saetze[j]),
          `zu ähnlich: „${ALLE[i].text}“ / „${ALLE[j].text}“`,
        );
      }
    }
  });

  it("hält Längen, Satzende, Kicker und Thema ein", () => {
    for (const s of ALLE_PLUS) {
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
    for (const s of ALLE_PLUS) {
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
    for (const s of ALLE_PLUS)
      assert.doesNotMatch(`${s.text} ${s.zusatz}`, VERBOTEN, s.text);
  });

  it("enthält keine Emojis", () => {
    for (const s of ALLE_PLUS)
      assert.doesNotMatch(ganz(s), /\p{Extended_Pictographic}/u, s.text);
  });

  it("bleibt in der Sie-Form", () => {
    const du =
      /\b(du|dich|dir|dein|deine|deiner|deinem|deinen|deins|euch|euer|eure)\b/i;
    for (const s of ALLE_PLUS)
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
    assert.doesNotMatch(b, /undefined|null/);
    // Reserve-Karten: genau fünf Schlagworte, wie bisher.
    assert.equal(b.split("\n\n")[1].split(" ").length, 5);
  });

  it("gibt tagesaktuellen Posts ein Schlagwort zum Anlass", () => {
    const k = spruchTag("2027-02-28", {});
    const mit = (anlass: string) => storyBeschriftung({ ...k, anlass });
    const vorrat = storyBeschriftung(k);
    assert.equal(mit("Black Friday"), `${vorrat} #blackfriday`);
    assert.ok(mit("Erster Advent").endsWith(" #ersteradvent"));
    assert.ok(mit("Winterdom läuft").endsWith(" #winterdom"));
    assert.ok(mit("Letzter Tag Winterdom").endsWith(" #winterdom"));
    assert.ok(mit("Black Friday in Sicht").endsWith(" #blackfriday"));
    assert.ok(mit("Weihnachtsmarkt ab Montag").endsWith(" #weihnachtsmarkt"));
    assert.ok(mit("Sturm über Hamburg").endsWith(" #sturm"));
    assert.ok(
      mit("Tag der Deutschen Einheit").endsWith(" #tagderdeutscheneinheit"),
    );
    assert.ok(mit("Früh dunkel in Hamburg").endsWith(" #frühdunkel"));
    // Nichts doppelt, nichts Leeres.
    assert.equal(anlassTag("Hamburg"), null);
    assert.equal(anlassTag(""), null);
    assert.equal(anlassTag(null), null);
    assert.equal(storyBeschriftung({ ...k, anlass: null }), vorrat);
    for (const k of AKTUELL) {
      const tag = anlassTag(k.anlass);
      if (!tag) continue;
      assert.match(tag, /^#\p{L}{3,}$/u, k.anlass);
      assert.equal(tag, tag.normalize("NFC").toLowerCase(), k.anlass);
    }
  });

  it("behält im Schlagwort zum Anlass Buchstaben mit Akzent und ß, ohne Bindestrich", () => {
    assert.equal(anlassTag("Fête de la Musique"), "#fêtedelamusique");
    // Zerlegt geschrieben (e und Zirkumflex einzeln): dasselbe Schlagwort.
    assert.equal(anlassTag("Fête de la Musique"), "#fêtedelamusique");
    assert.equal(anlassTag("Café-Woche"), "#caféwoche");
    assert.equal(anlassTag("Crêpes-Tag"), "#crêpestag");
    assert.equal(anlassTag("Straßen-Fest"), "#straßenfest");
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

describe("Tagesaktuelle Posts", () => {
  /** Wörter, die an einem Anlass hängen und deshalb nicht als Doppelung zählen. */
  const GENERISCH = [
    "heute",
    "morgen",
    "jetzt",
    "gerade",
    "hamburg",
    "hamburger",
    "woche",
    "wochenende",
  ];
  const ohne = (...anlaesse: string[]) =>
    new Set([...GENERISCH, ...anlaesse.flatMap((a) => [...woerter(a)])]);

  /**
   * Beinahe-Doppelungen tagesaktueller Karten: mit der Reserve und mit
   * jeder anderen tagesaktuellen Karte. Wörter der Anlässe zählen nicht.
   */
  function beinaheDoppelungen(
    aktuell: readonly (typeof AKTUELL)[number][],
    reserve: readonly { text: string }[],
  ): string[] {
    const funde: string[] = [];
    for (const k of aktuell) {
      const eigen = ohne(k.anlass);
      const satz = woerter(k.text, eigen);
      for (const s of reserve) {
        if (zuAehnlich(satz, woerter(s.text, eigen)))
          funde.push(`zu ähnlich: „${k.text}“ (${k.datum}) / „${s.text}“`);
      }
      for (const anderer of aktuell) {
        // Nur die Karte selbst fällt weg, die anderen Karten desselben
        // Tages (zusammen im Story-Studio) werden mitgeprüft.
        if (anderer === k) continue;
        const beide = ohne(k.anlass, anderer.anlass);
        if (zuAehnlich(woerter(k.text, beide), woerter(anderer.text, beide)))
          funde.push(
            `zu ähnlich: „${k.text}“ (${k.datum}) / „${anderer.text}“ (${anderer.datum})`,
          );
      }
    }
    return funde;
  }

  it("ordnet die Tage als echte Kalendertage, aufsteigend", () => {
    const tage = Object.keys(POSTS_AKTUELL);
    for (const tag of tage) {
      assert.match(tag, /^\d{4}-\d{2}-\d{2}$/, tag);
      assert.equal(tagVersetzt(tag, 0), tag, `kein Kalendertag: ${tag}`);
    }
    for (let i = 1; i < tage.length; i++)
      assert.ok(
        tage[i - 1] < tage[i],
        `Reihenfolge: ${tage[i - 1]} / ${tage[i]}`,
      );
  });

  it("hat ein bis drei Karten je Tag mit verschiedenen Kickern", () => {
    for (const [tag, karten] of Object.entries(POSTS_AKTUELL)) {
      assert.ok(
        karten.length >= 1 && karten.length <= POSTS_PRO_TAG,
        `${tag}: ${karten.length} Karten`,
      );
      const kicker = karten.map((k) => k.kicker);
      assert.equal(new Set(kicker).size, kicker.length, `${tag}: ${kicker}`);
    }
  });

  it("nennt einen kurzen, sauberen Anlass und eine echte Quelle", () => {
    for (const k of AKTUELL) {
      assert.ok(
        k.anlass.length >= 3 && k.anlass.length <= 28,
        `${k.anlass.length}: ${k.anlass}`,
      );
      assert.equal(k.anlass.trim(), k.anlass);
      assert.doesNotMatch(k.anlass, VERBOTEN, k.anlass);
      assert.doesNotMatch(k.anlass, /\p{Extended_Pictographic}/u, k.anlass);
      assert.doesNotMatch(k.anlass, /[.!?:;]$/, k.anlass);
      if (k.quelle !== undefined)
        assert.match(k.quelle, /^https:\/\/\S+$/, `${k.datum}: ${k.quelle}`);
    }
  });

  it("hebt höchstens drei Wörter hervor", () => {
    for (const k of AKTUELL)
      assert.ok(k.betont.split(" ").length <= 3, `zu lang: ${k.betont}`);
  });

  it("wiederholt keinen Satz aus der Reserve oder von einem anderen Tag", () => {
    const reserve = new Set(ALLE.map((s) => s.text.toLowerCase()));
    const gesehen = new Map<string, string>();
    for (const k of AKTUELL) {
      const text = k.text.toLowerCase();
      assert.ok(!reserve.has(text), `steht schon in der Reserve: ${k.text}`);
      assert.ok(
        !gesehen.has(text),
        `steht schon am ${gesehen.get(text)}: ${k.text}`,
      );
      gesehen.set(text, k.datum);
    }
  });

  it("sagt nichts fast wörtlich, was schon in der Reserve oder in einer anderen tagesaktuellen Karte steht", () => {
    assert.deepEqual(beinaheDoppelungen(AKTUELL, ALLE), []);
  });

  it("findet Beinahe-Doppelungen auch zwischen Karten desselben Tages", () => {
    const karte = {
      kicker: "Red Flag" as const,
      text: "Die Startseite ist voller als der Rathausmarkt am Samstag.",
      betont: "Rathausmarkt am Samstag",
      zusatz: "Für Glühwein schiebt man sich durchs Gedränge.",
      thema: "eindruck" as const,
      anlass: "Weihnachtsmarkt ab Montag",
      datum: "2026-11-17",
    };
    const fast = {
      ...karte,
      kicker: "POV" as const,
      text: "Die Startseite ist voller als der Rathausmarkt, noch auf?",
      betont: "noch auf",
      anlass: "Winterdom läuft",
    };
    const funde = beinaheDoppelungen([karte, fast], []);
    assert.ok(
      funde.some((f) => f.includes("noch auf?")),
      "Beinahe-Doppelung am selben Tag nicht gefunden",
    );
    // Mit sich selbst verglichen wird keine Karte.
    assert.deepEqual(beinaheDoppelungen([karte], []), []);
  });

  it("zeigt die Karten des Tages vor der Reserve", () => {
    for (const [tag, karten] of Object.entries(POSTS_AKTUELL)) {
      const posts = postsFuer(tag, POSTS_AKTUELL);
      karten.forEach((k, platz) => {
        assert.equal(posts[platz].text, k.text);
        assert.equal(posts[platz].herkunft, "aktuell");
        assert.equal(posts[platz].anlass, k.anlass);
      });
    }
  });

  it("erkennt Beinahe-Doppelungen trotz gleichem Anlass nicht falsch", () => {
    // Gleicher Anlass, sonst verschiedene Wörter: keine Doppelung.
    const a = woerter(
      "Black Friday kommt, Ihre Preise bleiben ehrlich.",
      ohne("Black Friday"),
    );
    const b = woerter(
      "Black Friday? Ehrliche Preise reichen.",
      ohne("Black Friday"),
    );
    assert.ok(!zuAehnlich(a, b));
    // Dieselben Wörter in anderer Reihenfolge: Doppelung.
    const c = woerter("Öffnungszeiten stehen online, Feiertage auch.");
    const d = woerter("Feiertage auch? Online stehen die Öffnungszeiten.");
    assert.ok(zuAehnlich(c, d));
  });
});

describe("Spruch des Tages im Browser", () => {
  it("kein Browser-Code lädt die tagesaktuellen Karten samt Quellen (lib/posts-aktuell.ts)", () => {
    const imBrowser = ["app", "components", "lib"]
      .flatMap((d) => quellDateien(path.join(ROOT, d)))
      .filter((f) => direktive(f) === "use client")
      .map(rel);
    // Die Karte auf /journal und das Story-Studio sind dabei.
    assert.ok(
      imBrowser.includes("components/marketing/journal/spruch-reel.tsx"),
    );
    assert.ok(imBrowser.includes("app/admin/story/story-studio.tsx"));
    for (const datei of imBrowser) {
      const weg = importWeg(datei, "lib/posts-aktuell.ts");
      assert.equal(
        weg,
        null,
        `lädt die Karten samt Quellen: ${weg?.join(" → ")}`,
      );
    }
    // Gegenprobe: Seiten auf dem Server sehen die Karten.
    assert.ok(importWeg("app/journal/page.tsx", "lib/posts-aktuell.ts"));
    assert.ok(importWeg("app/admin/posts/page.tsx", "lib/posts-aktuell.ts"));
  });

  it("gibt /journal nur die Karten um heute mit, ohne Quelle, und der Browser rechnet dieselbe Woche", () => {
    const jetzt = new Date("2026-11-17T10:00:00Z");
    const karten = journalKarten(jetzt);
    assert.ok(Object.keys(karten).length > 0);
    for (const tag of Object.keys(karten))
      assert.ok(tag >= "2026-11-09" && tag <= "2026-11-18", tag);
    assert.doesNotMatch(JSON.stringify(karten), /quelle|https?:\/\//);
    // Kommt die Seite aus dem Zwischenspeicher, kann im Browser schon ein
    // anderer Tag sein: Mit dem Ausschnitt entstehen dieselben sieben
    // Karten wie aus allen tagesaktuellen Karten.
    for (const versatz of [-2, -1, 0, 1]) {
      const browser = new Date(jetzt.getTime() + versatz * 24 * 60 * 60 * 1000);
      assert.deepEqual(
        spruecheBis(browser, 7, karten),
        spruecheBis(browser, 7, POSTS_AKTUELL),
        `Browser ${versatz} Tage versetzt`,
      );
    }
    // Ausschnitt: acht Tage zurück bis morgen, ohne Quelle.
    const k = {
      kicker: "Merken" as const,
      text: "Ein Satz zum Tag.",
      betont: "zum Tag",
      zusatz: "Ein Zusatz dazu.",
      thema: "pflege" as const,
      anlass: "Ein Anlass",
    };
    const alle: Record<string, AktuellerPost[]> = {
      "2026-11-08": [k],
      "2026-11-09": [{ ...k, quelle: "https://example.org/a" }],
      "2026-11-18": [k],
      "2026-11-19": [k],
    };
    const fenster = kartenFenster("2026-11-17", alle);
    assert.deepEqual(Object.keys(fenster), ["2026-11-09", "2026-11-18"]);
    assert.deepEqual(fenster["2026-11-09"], [k]);
  });
});

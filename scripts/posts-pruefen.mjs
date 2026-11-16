/**
 * Prüft die Spruch-Karten so, wie sie wirklich erscheinen: Jede Karte
 * der Reserve (beide Listen) und jede tagesaktuelle Karte
 * (lib/posts-aktuell.ts) wird in einem echten Browser in allen drei
 * Formaten (Story, Beitrag, Karte auf /journal) gesetzt und gezeichnet,
 * als Standbild und zu mehreren Zeiten des Films: einmal so, wie der Tag
 * sie bringt, dann in jeder Gestaltung (klassik, magazin, farbfeld,
 * raster, schlagzeile, riese, kalenderblatt) mit reihum wechselndem
 * Ablauf (Auftritt der Pointe, Weg der Kamera, flach oder mit der
 * Kino-Kamera). Dazu jede Reihe in jeder Gestaltung mit dem längsten
 * erlaubten Anlass, und als tagesaktueller Spruch des Tages (an geraden
 * Tagen ein Kalenderblatt).
 *
 * Meldet einen Fehler, wenn ein Text auch in der kleinsten Schrift nicht
 * in sein Feld passt, die Kopfzeile (Etikett, Anlass, Datum) nicht in
 * ihre Zeile passt, mehr als eine orange Pille auf einem Bild steht, beim
 * Auftritt „abziehen“ vor dem Abziehen etwas von der Pointe unter dem
 * Klebeband herausschaut oder sich ein Bild nicht zeichnen lässt. So
 * bleibt jeder neue Spruch automatisch ein sauberer Post, ohne dass ihn
 * jemand ansehen muss.
 * Aufruf: npm run posts:pruefen
 *
 * Braucht Playwright mit Chromium (nicht Teil des Projekts; in der
 * Arbeitsumgebung, in der die Sprüche gepflegt werden, vorhanden) und
 * einmalig Netz für esbuild und die Schriften.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error(
    "Playwright fehlt. Diese Prüfung läuft nur, wo Playwright mit Chromium eingerichtet ist.",
  );
  process.exit(2);
}

const ordner = mkdtempSync(join(tmpdir(), "posts-pruefen-"));
try {
  // Die Zeichnung für den Browser bündeln.
  const einstieg = join(ordner, "einstieg.ts");
  writeFileSync(
    einstieg,
    `import { POSTS_AKTUELL } from "@/lib/posts-aktuell";
import { KICKER, SPRUECHE, SPRUECHE_EXTRA, spruchTag } from "@/lib/sprueche-data";
import { FORMATE, storyVorbereiten } from "@/lib/story-bild";
import { kinoBereit } from "@/lib/story-kino";
import { AUFTRITTE, KAMERAS, LAYOUTS } from "@/lib/story-variante";
Object.assign(window, { pruefung: { KICKER, POSTS_AKTUELL, SPRUECHE, SPRUECHE_EXTRA, spruchTag, FORMATE, storyVorbereiten, AUFTRITTE, KAMERAS, LAYOUTS, kinoBereit } });
`,
  );
  execFileSync(
    "npx",
    [
      "--yes",
      "esbuild@0.28.2",
      einstieg,
      "--bundle",
      "--format=iife",
      "--log-level=warning",
      `--tsconfig=${join(wurzel, "tsconfig.json")}`,
      `--outfile=${join(ordner, "posts.js")}`,
    ],
    { cwd: wurzel, stdio: "inherit" },
  );
  // Dieselben Schriften wie auf der Website (Cormorant, IBM Plex Mono).
  writeFileSync(
    join(ordner, "seite.html"),
    `<!doctype html><html style="--font-serif:'Cormorant Garamond';--font-brand-mono:'IBM Plex Mono'"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,600&family=IBM+Plex+Mono&display=swap" rel="stylesheet">
</head><body><script src="posts.js"></script></body></html>`,
  );

  const browser = await chromium.launch();
  const seite = await browser.newPage();
  const fehler = [];
  seite.on("pageerror", (e) => fehler.push(`Seitenfehler: ${e.message}`));
  await seite.goto(pathToFileURL(join(ordner, "seite.html")).href);
  const ergebnis = await seite.evaluate(async () => {
    const p = window.pruefung;
    // Reserve und tagesaktuelle Karten; der Platz einer tagesaktuellen
    // Karte ist ihre Stelle an ihrem Tag, ihr Anlass steht mit auf dem Bild.
    const alle = [
      ...p.SPRUECHE.map((karte) => ({ karte, platz: 0, anlass: null })),
      ...p.SPRUECHE_EXTRA.map((karte) => ({ karte, platz: 1, anlass: null })),
      ...Object.values(p.POSTS_AKTUELL).flatMap((karten) =>
        karten.map((karte, platz) => ({ karte, platz, anlass: karte.anlass })),
      ),
    ];
    const flaeche = document.createElement("canvas");
    document.body.appendChild(flaeche);
    const out = {
      geprueft: 0,
      fehler: [],
      kleinste: {},
      gestaltungen: {},
      kleinsteJe: {},
      aktuell: alle.filter((e) => e.anlass).length,
    };
    /** Was das gerade gezeichnete Bild über sich meldet. */
    const befund = (name) => {
      if (flaeche.dataset.eng) out.fehler.push(`passt nicht: ${name}`);
      if (flaeche.dataset.kopf)
        out.fehler.push(`Kopfzeile passt nicht: ${name}`);
      if (Number(flaeche.dataset.orange) > 1)
        out.fehler.push(`mehr als eine orange Pille: ${name}`);
      const l = flaeche.dataset.layout;
      out.gestaltungen[l] = (out.gestaltungen[l] ?? 0) + 1;
      const g = Number(flaeche.dataset.schrift);
      if (g < 900) out.kleinsteJe[l] = Math.min(out.kleinsteJe[l] ?? 999, g);
    };
    // Auftritt „abziehen“: Bis das Band abgezogen wird, deckt es die ganze
    // Pointe ab. Das erste Bild (die Kamera steht nah an der Pointe) wird
    // einmal so und einmal ohne die Wörter der Pointe gezeichnet; jeder
    // Unterschied ist etwas von ihr, das herausschaut.
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    let ohne = null;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...rest) {
      if (ohne?.(String(t))) return;
      return fillText.call(this, t, ...rest);
    };
    const woerter = (t) =>
      ` ${t
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim()} `;
    /**
     * Die Wörter der Pointe, oder null, wenn die Karte keine hat (Mythos)
     * oder eines ihrer Wörter auch sonst auf dem Bild steht (dann ließe
     * es sich nicht von ihr unterscheiden; das Kalenderblatt schreibt
     * „Heute“ über den Tag).
     */
    const pointeVon = (karte) => {
      const w = woerter(karte.betont);
      if (karte.kicker === "Mythos" || !w.trim()) return null;
      const sonst = woerter(
        `${karte.text.replace(karte.betont, " ")} ${karte.zusatz} ${karte.kicker} ${karte.anlass ?? ""} heute`,
      );
      if (
        w
          .trim()
          .split(" ")
          .some((x) => sonst.includes(` ${x} `))
      )
        return null;
      return w;
    };
    /** Ein Text der Pointe: ein Teil von ihr oder eine Zeile, die sie trägt. */
    const inPointe = (pointe, t) => {
      const w = woerter(t);
      return w.trim() !== "" && (pointe.includes(w) || w.includes(pointe));
    };
    const abziehen = async (karte, format, name) => {
      const pointe = pointeVon(karte);
      if (!pointe) return;
      const c = flaeche.getContext("2d");
      const bild = () => c.getImageData(0, 0, flaeche.width, flaeche.height);
      for (const layout of p.LAYOUTS) {
        const z = await p.storyVorbereiten(flaeche, karte, format, {
          skala: 0.12,
          film: { auftritt: "abziehen", kamera: "luecke" },
          kino: false,
          layout,
        });
        z(0);
        const mit = bild().data;
        ohne = (t) => inPointe(pointe, t);
        try {
          z(0);
        } finally {
          ohne = null;
        }
        const leer = bild().data;
        if (mit.some((v, i) => Math.abs(v - leer[i]) > 6))
          out.fehler.push(
            `Pointe schaut vor dem Abziehen heraus: ${name} (${layout})`,
          );
      }
    };
    // Grundlage aus der Reserve (ohne tagesaktuelle Karten), damit jede
    // geprüfte Karte genau ihre eigenen Felder trägt.
    const basis = p.spruchTag("2026-11-20", {});
    const alsTag = ({ karte, platz, anlass }, i) => ({
      ...basis,
      kicker: karte.kicker,
      text: karte.text,
      betont: karte.betont,
      zusatz: karte.zusatz,
      thema: karte.thema,
      platz,
      anlass,
      herkunft: anlass ? "aktuell" : "vorrat",
      nummer: basis.nummer + i,
    });
    // Standbild und Zeiten quer durch den Film (Nahaufnahme, Fahrt zum
    // Satz, Absenken und Aufsetzen der Pointe, Rückfahrt, Schluss).
    const zeiten = [
      Infinity,
      0,
      0.13,
      0.8,
      1.5,
      2.6,
      3.4,
      3.64,
      3.9,
      4.6,
      6,
      8,
    ];
    const formate = Object.values(p.FORMATE);
    for (const [fi, format] of formate.entries()) {
      for (let i = 0; i < alle.length; i++) {
        const eintrag = alle[i];
        const karte = alsTag(eintrag, i);
        const name = `${format.name} | ${karte.kicker} | ${karte.text}`;
        try {
          // So, wie der Tag die Karte bringt (Gestaltung und Ablauf).
          const zeichne = await p.storyVorbereiten(flaeche, karte, format, {
            skala: 0.12,
          });
          befund(`${name} (${flaeche.dataset.layout})`);
          const g = Number(flaeche.dataset.schrift);
          if (g < 900)
            out.kleinste[format.name] = Math.min(
              out.kleinste[format.name] ?? 999,
              g,
            );
          for (const t of zeiten) zeichne(t);
          // Dann in jeder Gestaltung, mit reihum wechselndem Ablauf: So
          // läuft jeder Auftritt der Pointe mit jedem Kameraweg durch alle
          // Gestaltungen und Formate.
          for (const [li, layout] of p.LAYOUTS.entries()) {
            const n = i + li + fi;
            const film = {
              auftritt: p.AUFTRITTE[n % p.AUFTRITTE.length],
              kamera: p.KAMERAS[(i + li) % p.KAMERAS.length],
            };
            // Jede zweite mit der Kino-Kamera (wo der Browser sie kann),
            // die anderen flach: So bleiben beide Wege geprüft.
            const kino = n % 2 === 0;
            const anders = await p.storyVorbereiten(flaeche, karte, format, {
              skala: 0.12,
              film,
              kino,
              layout,
            });
            befund(`${name} (${layout})`);
            for (const t of zeiten) anders(t, t === 0.13 || t === 3.64);
            // Fiel die Kino-Kamera aus, obwohl der Browser sie kann, ist
            // im WebGL-Teil etwas kaputt.
            if (kino && p.kinoBereit() && anders.kino === false)
              out.fehler.push(`Kino-Kamera ausgefallen: ${name} (${layout})`);
          }
          await abziehen(karte, format, name);
          out.geprueft++;
        } catch (e) {
          out.fehler.push(`lässt sich nicht zeichnen: ${name} (${e})`);
        }
      }
      // Dazu zwei Pointen mit großem Umlaut, deren Punkte hoch über die
      // Schrift reichen: einmal frei am Satzende, einmal mitten im Satz.
      for (const [text, betont] of [
        [
          "Eine gute Website wirkt am Handy, am Laptop und am Tablet. Überall.",
          "Überall",
        ],
        [
          "Öffnungszeiten gehören ganz nach oben auf die Startseite.",
          "Öffnungszeiten",
        ],
      ]) {
        const name = `${format.name} | Umlaut in der Pointe | ${text}`;
        const karte = {
          ...basis,
          kicker: "Merken",
          text,
          betont,
          zusatz: "Gilt für jede Seite.",
          thema: "google",
          platz: 0,
          anlass: null,
          herkunft: "vorrat",
        };
        try {
          await abziehen(karte, format, name);
        } catch (e) {
          out.fehler.push(`lässt sich nicht zeichnen: ${name} (${e})`);
        }
      }
      // Jede Reihe in jeder Gestaltung mit dem längsten erlaubten Anlass
      // (28 Zeichen): Die Kopfzeile muss auch dann passen. Dazu so, wie
      // der Tag sie bringt: Als tagesaktueller Spruch des Tages steht sie
      // an geraden Tagen als Kalenderblatt, an ungeraden nicht.
      for (const kicker of p.KICKER) {
        const i = alle.findIndex((e) => e.karte.kicker === kicker);
        if (i < 0) continue;
        for (const versatz of [0, 1]) {
          const tag = { ...alsTag(alle[i], i), platz: 0 };
          const nummer = tag.nummer - (tag.nummer % 2) + versatz;
          const karte = { ...tag, nummer, anlass: "Erster Advent" };
          const name = `${format.name} | ${kicker} | tagesaktuell, Tag ${nummer}`;
          try {
            const z = await p.storyVorbereiten(flaeche, karte, format, {
              skala: 0.12,
            });
            befund(name);
            const kalender = flaeche.dataset.layout === "kalenderblatt";
            if (kalender !== (versatz === 0))
              out.fehler.push(
                `Kalenderblatt ${kalender ? "an falschem Tag" : "fehlt"}: ${name}`,
              );
            for (const t of zeiten) z(t);
          } catch (e) {
            out.fehler.push(`lässt sich nicht zeichnen: ${name} (${e})`);
          }
        }
        for (const layout of p.LAYOUTS) {
          const karte = {
            ...alsTag(alle[i], i),
            anlass: "Weihnachtsmarkt Rathausmarkt",
          };
          const name = `${format.name} | ${kicker} | längster Anlass`;
          try {
            const z = await p.storyVorbereiten(flaeche, karte, format, {
              skala: 0.12,
              layout,
            });
            befund(`${name} (${layout})`);
            z(Infinity);
            z(0);
          } catch (e) {
            out.fehler.push(`lässt sich nicht zeichnen: ${name} (${e})`);
          }
        }
      }
    }
    return out;
  });
  await browser.close();
  fehler.push(...ergebnis.fehler);
  console.log(
    `${ergebnis.geprueft} Karten geprüft (${ergebnis.aktuell} tagesaktuelle), jede in Story, Beitrag und Journal-Karte und in jeder Gestaltung. Kleinste Schrift: ${Object.entries(
      ergebnis.kleinste,
    )
      .map(([f, g]) => `${f} ${g}`)
      .join(", ")}. Gestaltungen: ${Object.entries(ergebnis.gestaltungen)
      .map(([l, n]) => `${l} ${n}`)
      .join(", ")}. Kleinste Schrift je Gestaltung: ${Object.entries(
      ergebnis.kleinsteJe,
    )
      .map(([l, g]) => `${l} ${g}`)
      .join(", ")}.`,
  );
  if (fehler.length) {
    console.error(`${fehler.length} Auffälligkeiten:`);
    for (const f of fehler) console.error(`  ${f}`);
    process.exitCode = 1;
  } else console.log("Alles passt und lässt sich zeichnen.");
} finally {
  rmSync(ordner, { recursive: true, force: true });
}

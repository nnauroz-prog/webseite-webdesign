/**
 * Prüft die Spruch-Karten so, wie sie wirklich erscheinen: Jede Karte
 * beider Listen wird in einem echten Browser in allen drei Formaten
 * (Story, Beitrag, Karte auf /journal) gesetzt und gezeichnet, als
 * Standbild und zu mehreren Zeiten des Films, mit dem Ablauf des Tages
 * und reihum mit jedem anderen (Auftritt der Pointe, Weg der Kamera).
 *
 * Meldet einen Fehler, wenn ein Text auch in der kleinsten Schrift nicht
 * in sein Feld passt oder sich ein Bild nicht zeichnen lässt. So bleibt
 * jeder neue Spruch automatisch ein sauberer Post, ohne dass ihn jemand
 * ansehen muss. Aufruf: npm run posts:pruefen
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
    `import { SPRUECHE, SPRUECHE_EXTRA, spruchTag } from "@/lib/sprueche-data";
import { FORMATE, storyVorbereiten } from "@/lib/story-bild";
import { AUFTRITTE, KAMERAS } from "@/lib/story-variante";
Object.assign(window, { pruefung: { SPRUECHE, SPRUECHE_EXTRA, spruchTag, FORMATE, storyVorbereiten, AUFTRITTE, KAMERAS } });
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
    const alle = [
      ...p.SPRUECHE.map((karte) => ({ karte, platz: 0 })),
      ...p.SPRUECHE_EXTRA.map((karte) => ({ karte, platz: 1 })),
    ];
    const flaeche = document.createElement("canvas");
    document.body.appendChild(flaeche);
    const out = { geprueft: 0, fehler: [], kleinste: {} };
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
    for (const format of Object.values(p.FORMATE)) {
      for (let i = 0; i < alle.length; i++) {
        const { karte, platz } = alle[i];
        const basis = p.spruchTag("2026-11-20");
        const name = `${format.name} | ${karte.kicker} | ${karte.text}`;
        try {
          const zeichne = await p.storyVorbereiten(
            flaeche,
            { ...basis, ...karte, platz, nummer: basis.nummer + i },
            format,
            { skala: 0.12 },
          );
          if (flaeche.dataset.eng) out.fehler.push(`passt nicht: ${name}`);
          const g = Number(flaeche.dataset.schrift);
          if (g < 900)
            out.kleinste[format.name] = Math.min(
              out.kleinste[format.name] ?? 999,
              g,
            );
          for (const t of zeiten) zeichne(t);
          // Dazu ein weiterer Ablauf des Films, reihum: So läuft jeder
          // Auftritt der Pointe mit jedem Kameraweg durch alle Formate.
          const film = {
            auftritt: p.AUFTRITTE[i % p.AUFTRITTE.length],
            kamera: p.KAMERAS[i % p.KAMERAS.length],
          };
          const anders = await p.storyVorbereiten(
            flaeche,
            { ...basis, ...karte, platz, nummer: basis.nummer + i },
            format,
            { skala: 0.12, film },
          );
          for (const t of zeiten) anders(t);
          out.geprueft++;
        } catch (e) {
          out.fehler.push(`lässt sich nicht zeichnen: ${name} (${e})`);
        }
      }
    }
    return out;
  });
  await browser.close();
  fehler.push(...ergebnis.fehler);
  console.log(
    `${ergebnis.geprueft} Bilder geprüft (jede Karte in Story, Beitrag und Journal-Karte). Kleinste Schrift: ${Object.entries(
      ergebnis.kleinste,
    )
      .map(([f, g]) => `${f} ${g}`)
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

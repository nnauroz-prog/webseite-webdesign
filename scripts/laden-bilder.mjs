/**
 * Erzeugt die Bilder der unteren Regale der Startseite als statische
 * SVG-Dateien (public/laden/*.svg). Quelle sind dieselben React-
 * Komponenten wie für die Inline-Bilder (components/marketing/laden/
 * bilder). Als Datei mit <img loading="lazy"> halten sie das HTML und das
 * DOM der Startseite klein (Bauplan „Laden“, Abschnitt 8).
 *
 * Aufruf nach einer Änderung an den Bildern:  npm run bilder:laden
 *
 * Ablauf: die Bild-Module mit dem SWC aus Next nach CommonJS übersetzen
 * (temporärer Ordner), mit react-dom/server rendern, die gemeinsamen
 * Verläufe (defs.tsx) und die Systemschrift in jede Datei schreiben.
 */
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const require = createRequire(import.meta.url);
const swc = require("next/dist/build/swc");

const QUELLEN = [
  ...readdirSync(path.join(ROOT, "components/marketing/laden/bilder")).map(
    (f) => `components/marketing/laden/bilder/${f}`,
  ),
  "lib/muster-presets.ts",
  "lib/pakete-data.ts",
  "lib/honorar-data.ts",
];

const tmp = mkdtempSync(path.join(tmpdir(), "laden-bilder-"));
writeFileSync(path.join(tmp, "package.json"), '{"type":"commonjs"}');

await swc.loadBindings();
for (const rel of QUELLEN) {
  if (!/\.tsx?$/.test(rel)) continue;
  const src = readFileSync(path.join(ROOT, rel), "utf8");
  const out = await swc.transform(src, {
    filename: rel,
    jsc: {
      parser: { syntax: "typescript", tsx: rel.endsWith(".tsx") },
      transform: { react: { runtime: "automatic" } },
      target: "es2020",
    },
    module: { type: "commonjs" },
  });
  const ziel = path.join(tmp, rel.replace(/\.tsx?$/, ".js"));
  // „@/lib/…“ → relativer Pfad im temporären Ordner
  const code = out.code.replace(/require\("@\/([^"]+)"\)/g, (_, p) => {
    let r = path.relative(path.dirname(ziel), path.join(tmp, p));
    if (!r.startsWith(".")) r = `./${r}`;
    return `require(${JSON.stringify(r)})`;
  });
  mkdirSync(path.dirname(ziel), { recursive: true });
  writeFileSync(ziel, code);
}

// React aus dem Projekt, nicht aus dem temporären Ordner
const Module = require("node:module");
const altResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (/^react(-dom)?(\/|$)/.test(request))
    return altResolve.call(
      this,
      request,
      { ...parent, paths: [path.join(ROOT, "node_modules")] },
      ...rest,
    );
  return altResolve.call(this, request, parent, ...rest);
};

const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const b = (f) =>
  require(path.join(tmp, "components/marketing/laden/bilder", f));
const { LadenDefs } = b("defs.js");
const { BrancheBild, SkizzeBild } = b("muster-seite.js");
const W = b("werkzeug-bilder.js");
const { JournalBild } = b("journal-bilder.js");
const { NachtHafen } = b("nacht-hafen.js");
const { presetFuer } = require(path.join(tmp, "lib/muster-presets.js"));

const DEFS = renderToStaticMarkup(React.createElement(LadenDefs)).match(
  /<defs>[\s\S]*<\/defs>/,
)[0];
const SCHRIFT =
  "-apple-system, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;Segoe UI&quot;, Roboto, Arial, sans-serif";

const MUSTER = [
  "pflege",
  "handwerk",
  "praxis",
  "friseur",
  "gastro",
  "reinigung",
  "kanzlei",
  "fitness",
  "hotel",
  "kosmetik",
];
/* Gerät je Muster-Website (Reihenfolge wie MUSTER in app/page.tsx):
   0 Laptop + Handy, 1 Handy-Paar, 2 Monitor, 3 Tablet + Handy. Pflege
   nicht als Laptop (den zeigt schon die Business-Karte), Nachbarn nie
   gleich. */
const VARIANTE = {
  praxis: 0,
  friseur: 2,
  gastro: 1,
  pflege: 3,
  reinigung: 0,
  handwerk: 1,
  kanzlei: 3,
  fitness: 2,
  hotel: 0,
  kosmetik: 1,
};
const BILDER = {
  ...Object.fromEntries(
    MUSTER.map((k) => [
      `branche-${k}`,
      React.createElement(BrancheBild, {
        preset: presetFuer(k),
        variante: VARIANTE[k],
      }),
    ]),
  ),
  skizze: React.createElement(SkizzeBild, { preset: presetFuer("pflege") }),
  "werkzeug-durchsicht": React.createElement(W.BildDurchsicht),
  "werkzeug-ladezeit": React.createElement(W.BildLadezeit),
  "werkzeug-paketwahl": React.createElement(W.BildPaketWahl),
  "werkzeug-kosten": React.createElement(W.BildKosten),
  "werkzeug-termin": React.createElement(W.BildTermin),
  "werkzeug-honorar": React.createElement(W.BildHonorar),
  "journal-google": React.createElement(JournalBild, { slug: "google" }),
  "journal-pflichtangaben": React.createElement(JournalBild, {
    slug: "pflichtangaben",
  }),
  "journal-domain": React.createElement(JournalBild, { slug: "domain" }),
  "journal-skyline": React.createElement(JournalBild, { slug: "" }),
  nachthafen: React.createElement(NachtHafen),
};

const zielOrdner = path.join(ROOT, "public/laden");
mkdirSync(zielOrdner, { recursive: true });
let summe = 0;
for (const [name, el] of Object.entries(BILDER)) {
  let svg = renderToStaticMarkup(el);
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  svg = svg
    .replace(
      /^<svg /,
      `<svg xmlns="http://www.w3.org/2000/svg" width="${vb[1]}" height="${vb[2]}" font-family="${SCHRIFT}" `,
    )
    .replace(/ aria-hidden="true"| focusable="false"/g, "")
    .replace(/font-family="inherit"/g, "")
    .replace(/(<svg[^>]*>)/, `$1${DEFS}`);
  writeFileSync(path.join(zielOrdner, `${name}.svg`), svg);
  summe += svg.length;
}
rmSync(tmp, { recursive: true, force: true });
console.log(
  `${Object.keys(BILDER).length} Bilder nach public/laden geschrieben (${Math.round(summe / 1024)} KB).`,
);

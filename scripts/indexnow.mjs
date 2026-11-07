/**
 * IndexNow: meldet Bing (und damit Copilot und der ChatGPT-Suche, die auf
 * dem Bing-Index aufbauen), Yandex, Seznam und Naver geänderte Seiten
 * sofort, statt auf den nächsten Besuch des Crawlers zu warten.
 *
 * Läuft als `postbuild` nach `next build`, aber nur beim Produktions-
 * Deploy auf Vercel (VERCEL_ENV=production). Gemeldet werden die Seiten
 * aus der gebauten Sitemap, deren lastmod höchstens 14 Tage zurückliegt
 * (Stand je Seite: lib/seiten-stand.ts). Bricht den Build nie ab.
 *
 * Der Schlüssel ist laut Protokoll öffentlich: Er liegt als
 * public/<schluessel>.txt auf der Website, damit die Suchmaschine prüfen
 * kann, dass die Meldung von uns kommt. Spezifikation: indexnow.org
 */
import { readFile } from "node:fs/promises";

const KEY = "2a15aaf3fe01ee2ac5af7977ca9e0bd6";
const HOST = "www.sitalo.de";
const TAGE = 14;

async function main() {
  if (process.env.VERCEL_ENV !== "production" && process.env.INDEXNOW_FORCE !== "1") {
    console.log("[indexnow] übersprungen (kein Produktions-Deploy)");
    return;
  }
  let xml;
  try {
    xml = await readFile(new URL("../.next/server/app/sitemap.xml.body", import.meta.url), "utf8");
  } catch {
    console.log("[indexnow] keine gebaute Sitemap gefunden, nichts gemeldet");
    return;
  }
  const grenze = Date.now() - TAGE * 86_400_000;
  const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)]
    .filter(([, , lastmod]) => !lastmod || Date.parse(lastmod) >= grenze)
    .map(([, loc]) => loc.trim())
    .filter((u) => u.startsWith(`https://${HOST}`));
  if (!urls.length) {
    console.log("[indexnow] keine kürzlich geänderten Seiten");
    return;
  }
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls.slice(0, 10_000),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  // 200/202: angenommen (202 = Schlüssel wird noch geprüft, normal beim
  // ersten Mal, solange der neue Deploy noch nicht live ist).
  console.log(`[indexnow] ${urls.length} Seiten gemeldet, Antwort ${res.status}`);
}

main().catch((err) => {
  console.log(`[indexnow] nicht gemeldet: ${err instanceof Error ? err.message : err}`);
});

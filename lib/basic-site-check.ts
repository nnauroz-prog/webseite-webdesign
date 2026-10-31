import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Basis-Check als Ersatz, wenn Google PageSpeed nicht antwortet
 * (ohne PAGESPEED_API_KEY meist HTTP 429). Wir laden die Seite
 * selbst einmal und prüfen nur, was sich ehrlich messen lässt:
 * Antwortzeit, Größe, HTTPS, Komprimierung und ein paar Grundlagen
 * im HTML. Keine erfundenen Lighthouse-Punkte.
 *
 * Weil hier UNSER Server die fremde URL abruft, wird jede Adresse
 * (auch nach Weiterleitungen) per DNS aufgelöst und gegen private
 * Netze geprüft — sonst ließe sich der Check als Proxy ins
 * Vercel-Netz missbrauchen.
 */

export type BasicCheckItem = {
  label: string;
  ok: boolean;
  detail: string;
};

export type BasicCheckResult = {
  analyzedUrl: string;
  mode: "basic";
  ttfbMs: number;
  sizeKb: number;
  items: BasicCheckItem[];
};

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_REDIRECTS = 4;

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80");
}

async function assertPublicHost(hostname: string) {
  const addrs = await lookup(hostname, { all: true });
  if (addrs.length === 0 || addrs.some((a) => isPrivateIp(a.address))) {
    throw new Error("private_host");
  }
}

export async function basicSiteCheck(startUrl: string): Promise<BasicCheckResult> {
  let url = new URL(startUrl);
  let res: Response | null = null;
  const t0 = performance.now();
  let ttfb = 0;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("bad_protocol");
    await assertPublicHost(url.hostname);
    const hopStart = performance.now();
    res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(12_000),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; SitaloSpeedCheck/1.0; +https://www.sitalo.de/check)",
        "accept-encoding": "gzip, br",
        accept: "text/html,application/xhtml+xml",
      },
    });
    ttfb = performance.now() - hopStart;
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url);
      continue;
    }
    break;
  }
  if (!res || (res.status >= 300 && res.status < 400)) throw new Error("too_many_redirects");
  if (!res.ok) throw new Error(`status_${res.status}`);

  // Body begrenzt einlesen.
  const reader = res.body?.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      chunks.push(value);
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        break;
      }
    }
  }
  const total = performance.now() - t0;
  const html = new TextDecoder().decode(
    chunks.length === 1 ? chunks[0] : Buffer.concat(chunks.map((c) => Buffer.from(c))),
  );

  const encoding = res.headers.get("content-encoding") ?? "";
  const has = (re: RegExp) => re.test(html);
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
  const sizeKb = Math.round(bytes / 1024);
  const ttfbMs = Math.round(ttfb);

  const items: BasicCheckItem[] = [
    {
      label: "Antwortzeit des Servers",
      ok: ttfbMs < 800,
      detail: `${ttfbMs} ms bis zur ersten Antwort${ttfbMs < 800 ? "" : " — Google empfiehlt unter 800 ms"}`,
    },
    {
      label: "Größe der Startseite (HTML)",
      ok: bytes < 500 * 1024,
      detail: `${sizeKb} KB, geladen in ${Math.round(total)} ms`,
    },
    {
      label: "Verschlüsselt (HTTPS)",
      ok: url.protocol === "https:",
      detail: url.protocol === "https:" ? "Ja" : "Nein — Browser warnen Besucher",
    },
    {
      label: "Komprimiert übertragen",
      ok: /gzip|br|zstd/i.test(encoding),
      detail: encoding ? encoding : "Nein — die Seite ist unnötig groß unterwegs",
    },
    {
      label: "Für Handys eingerichtet",
      ok: has(/<meta[^>]+name=["']viewport["']/i),
      detail: has(/<meta[^>]+name=["']viewport["']/i) ? "Viewport gesetzt" : "Kein Viewport — auf dem Handy winzig",
    },
    {
      label: "Seitentitel für Google",
      ok: title.length >= 10 && title.length <= 70,
      detail: title ? `„${title.slice(0, 70)}“` : "Fehlt",
    },
    {
      label: "Beschreibung für Google",
      ok: has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{50,}/i),
      detail: has(/<meta[^>]+name=["']description["']/i) ? "Vorhanden" : "Fehlt — Google wählt selbst einen Ausschnitt",
    },
  ];

  return { analyzedUrl: url.toString(), mode: "basic", ttfbMs, sizeKb, items };
}

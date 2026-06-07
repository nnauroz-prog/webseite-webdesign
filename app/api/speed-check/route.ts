import { NextRequest, NextResponse } from "next/server";

/**
 * `/api/speed-check` — Proxy zu Google PageSpeed Insights API.
 *
 * Wir proxy'n den Aufruf server-seitig statt im Browser, weil:
 *   - PSI hat keine zuverlässige CORS-Unterstützung
 *   - Der API-Key (optional, höheres Rate-Limit) bleibt im Server
 *   - Wir können Response normalisieren, sodass die UI nur Scores
 *     bekommt und nicht das riesige Lighthouse-Audit-Objekt
 *
 * Public-Anteil der API: 25.000 Requests pro Tag ohne Key. Reicht
 * für Marketing-Site-Lead-Gen. Mit `PAGESPEED_API_KEY` env var
 * höheres Limit + bessere Quota-Stabilität.
 *
 * Methode: POST { url, strategy: "mobile" | "desktop" }
 * Response: { scores: { performance, accessibility, bestPractices, seo }, ... }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Strategy = "mobile" | "desktop";

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function POST(req: NextRequest) {
  let body: { url?: string; strategy?: Strategy };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 },
    );
  }

  const rawUrl = body.url?.trim();
  const strategy: Strategy = body.strategy === "desktop" ? "desktop" : "mobile";

  if (!rawUrl || rawUrl.length < 4) {
    return NextResponse.json({ error: "Bitte URL angeben." }, { status: 400 });
  }

  const targetUrl = normalizeUrl(rawUrl);
  if (!targetUrl) {
    return NextResponse.json(
      {
        error:
          "Die URL sieht nicht richtig aus. Beispiel: cafe-nordlicht.de",
      },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    url: targetUrl,
    strategy,
  });
  for (const cat of ["performance", "accessibility", "best-practices", "seo"]) {
    params.append("category", cat);
  }
  const apiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (apiKey) params.append("key", apiKey);

  let raw: unknown;
  try {
    const upstream = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      // PSI braucht oft 10–25 s
      signal: AbortSignal.timeout(45_000),
    });
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error: `PageSpeed Insights konnte die Seite nicht analysieren (HTTP ${upstream.status}). ${text.slice(0, 200)}`,
        },
        { status: 502 },
      );
    }
    raw = await upstream.json();
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Unbekannter Netzwerk-Fehler.";
    return NextResponse.json(
      { error: `Konnte PageSpeed Insights nicht erreichen: ${msg}` },
      { status: 502 },
    );
  }

  const normalized = normalize(raw);
  if (!normalized) {
    return NextResponse.json(
      { error: "PageSpeed-Antwort konnte nicht ausgewertet werden." },
      { status: 502 },
    );
  }

  return NextResponse.json({ analyzedUrl: targetUrl, strategy, ...normalized });
}

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim().replace(/\s+/g, "");
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const u = new URL(withProtocol);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

type Scores = {
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
};

type Metrics = {
  lcp: string | null;
  cls: string | null;
  inp: string | null;
};

function normalize(
  raw: unknown,
): { scores: Scores; metrics: Metrics } | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const result = r.lighthouseResult as Record<string, unknown> | undefined;
  if (!result || typeof result !== "object") return null;
  const categories = result.categories as
    | Record<string, { score?: number | null }>
    | undefined;
  if (!categories) return null;

  const toScore = (key: string): number | null => {
    const c = categories[key];
    if (!c || typeof c.score !== "number") return null;
    return Math.round(c.score * 100);
  };

  const audits = result.audits as
    | Record<string, { displayValue?: string }>
    | undefined;
  const audit = (key: string): string | null => {
    if (!audits) return null;
    const a = audits[key];
    return a?.displayValue ?? null;
  };

  return {
    scores: {
      performance: toScore("performance"),
      accessibility: toScore("accessibility"),
      bestPractices: toScore("best-practices"),
      seo: toScore("seo"),
    },
    metrics: {
      lcp: audit("largest-contentful-paint"),
      cls: audit("cumulative-layout-shift"),
      inp: audit("interaction-to-next-paint") ?? audit("max-potential-fid"),
    },
  };
}

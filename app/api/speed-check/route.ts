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
// PSI braucht in der Praxis 15–30 s, manchmal 50+. Wir setzen die
// Vercel-Function-Dauer explizit auf 60 s, damit die Function nicht
// vor PSI stirbt (Pro-Tier-Default ist 60 s, aber explizit ist sicherer).
export const maxDuration = 60;

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

  // Ein Retry mit kurzem Backoff bei transienten Fehlern (429, 5xx,
  // sowie Netzwerk-Abort/Timeout). PSI ist gelegentlich instabil —
  // ein zweiter Versuch erspart dem User „bitte nochmal klicken".
  let lastError: { status: number; userMessage: string } | null = null;
  let raw: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await callPsi(`${PSI_ENDPOINT}?${params.toString()}`);
    if (result.kind === "success") {
      raw = result.data;
      lastError = null;
      break;
    }
    lastError = { status: result.httpStatus, userMessage: result.userMessage };
    if (!result.retryable) break;
    await new Promise((r) => setTimeout(r, 1800));
  }

  if (lastError || raw === null) {
    return NextResponse.json(
      {
        error:
          lastError?.userMessage ??
          "PageSpeed Insights antwortet gerade nicht. Bitte in einer Minute erneut versuchen.",
      },
      { status: lastError?.status ?? 502 },
    );
  }

  const normalized = normalize(raw);
  if (!normalized) {
    return NextResponse.json(
      {
        error:
          "PageSpeed Insights hat geantwortet, aber wir konnten die Werte nicht auslesen. Bitte erneut versuchen.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ analyzedUrl: targetUrl, strategy, ...normalized });
}

type CallResult =
  | { kind: "success"; data: unknown }
  | {
      kind: "error";
      httpStatus: number;
      userMessage: string;
      retryable: boolean;
    };

async function callPsi(url: string): Promise<CallResult> {
  try {
    const upstream = await fetch(url, {
      // Etwas unter der maxDuration-Grenze, damit ein Retry noch reinpasst.
      signal: AbortSignal.timeout(50_000),
    });
    if (upstream.ok) {
      const data = await upstream.json();
      return { kind: "success", data };
    }
    // Nicht-OK: Status auswerten, freundliche Nachricht, ggf. retryable.
    const text = await upstream.text().catch(() => "");
    console.error(
      `[speed-check] PSI upstream ${upstream.status}: ${text.slice(0, 400)}`,
    );
    if (upstream.status === 429) {
      return {
        kind: "error",
        httpStatus: 429,
        userMessage:
          "Der Google-Test ist gerade ausgelastet. Bitte in 1–2 Minuten erneut versuchen — oder mailen Sie uns die URL an info@sitalo.de, wir testen die Seite dann persönlich.",
        retryable: true,
      };
    }
    if (upstream.status >= 500) {
      return {
        kind: "error",
        httpStatus: 502,
        userMessage:
          "Der Google-Test hatte gerade einen Aussetzer. Wir versuchen es gleich nochmal.",
        retryable: true,
      };
    }
    if (upstream.status === 400) {
      return {
        kind: "error",
        httpStatus: 400,
        userMessage:
          "Die Seite konnte nicht analysiert werden. Bitte prüfen Sie die URL — manche Seiten blockieren automatische Tests.",
        retryable: false,
      };
    }
    return {
      kind: "error",
      httpStatus: 502,
      userMessage:
        "PageSpeed Insights konnte die Seite gerade nicht testen. Bitte später erneut versuchen.",
      retryable: false,
    };
  } catch (err) {
    const isAbort =
      err instanceof Error &&
      (err.name === "AbortError" || err.name === "TimeoutError");
    console.error(
      `[speed-check] fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    if (isAbort) {
      return {
        kind: "error",
        httpStatus: 504,
        userMessage:
          "Der Test hat zu lange gedauert. Das passiert bei langsamen Servern — bitte später erneut versuchen.",
        retryable: true,
      };
    }
    return {
      kind: "error",
      httpStatus: 502,
      userMessage:
        "Wir konnten Google PageSpeed gerade nicht erreichen. Bitte später erneut versuchen.",
      retryable: true,
    };
  }
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

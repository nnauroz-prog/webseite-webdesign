/**
 * Google Gemini Imagen / "Nano Banana 2" image generation client.
 *
 * Uses the Gemini 2.5 Flash Image API (the model marketed as
 * "Nano Banana"). One call returns one image as base64 PNG.
 *
 * https://ai.google.dev/gemini-api/docs/image-generation
 *
 * Cost (Dec 2025): ~$0.039 per image at the Pay-as-you-go tier.
 * Free tier covers limited daily quota — we don't gate calls in
 * code, the operator manages cost via Google Cloud quotas.
 */

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent";

export type GeneratedImage = {
  /** Raw image bytes. */
  bytes: Buffer;
  /** MIME type Google returned (typically image/png). */
  mimeType: string;
};

export type GenerateImageError = {
  ok: false;
  message: string;
  /** HTTP status from the upstream Google API, when known. */
  status?: number;
};

export type GenerateImageResult =
  | { ok: true; image: GeneratedImage }
  | GenerateImageError;

/**
 * Generate a single image from a text prompt. Server-side only —
 * GOOGLE_API_KEY must never reach the client. Failures return an
 * `ok:false` shape instead of throwing so callers can surface the
 * message to the user.
 */
export async function generateImage(
  prompt: string,
): Promise<GenerateImageResult> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message:
        "KI-Bildgenerierung ist gerade nicht verfügbar. Der Operator muss GOOGLE_API_KEY in den Umgebungsvariablen setzen.",
    };
  }

  const trimmed = prompt.trim();
  if (!trimmed) {
    return { ok: false, message: "Bitte beschreibe das gewünschte Bild." };
  }
  if (trimmed.length > 1500) {
    return {
      ok: false,
      message: "Beschreibung zu lang (maximal 1500 Zeichen).",
    };
  }

  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: trimmed }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    });
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Verbindung zu Google fehlgeschlagen: ${err.message}`
          : "Verbindung zu Google fehlgeschlagen.",
    };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[ai-images] Gemini API error", {
      status: res.status,
      body: body.slice(0, 500),
    });
    return {
      ok: false,
      status: res.status,
      message: friendlyHttpMessage(res.status, body),
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ok: false, message: "Unerwartete Antwort von Google." };
  }

  // Walk the candidates → content → parts tree looking for the first
  // inlineData payload that's an image.
  type InlinePart = {
    inlineData?: { data?: string; mimeType?: string };
  };
  type Resp = {
    candidates?: Array<{
      content?: { parts?: InlinePart[] };
      finishReason?: string;
    }>;
  };
  const r = json as Resp;
  const parts = r.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    const data = p.inlineData?.data;
    const mime = p.inlineData?.mimeType ?? "image/png";
    if (data && mime.startsWith("image/")) {
      return {
        ok: true,
        image: {
          bytes: Buffer.from(data, "base64"),
          mimeType: mime,
        },
      };
    }
  }

  // No image in the response — usually means the safety filter
  // refused the prompt.
  const finishReason =
    r.candidates?.[0]?.finishReason ?? "UNKNOWN";
  return {
    ok: false,
    message:
      finishReason === "SAFETY" || finishReason === "PROHIBITED_CONTENT"
        ? "Google hat dieses Motiv abgelehnt. Bitte formuliere die Beschreibung etwas anders."
        : "Google hat kein Bild geliefert. Bitte erneut versuchen.",
  };
}

function friendlyHttpMessage(status: number, body: string): string {
  if (status === 401 || status === 403) {
    return "Google-API-Key ist ungültig oder hat keine Berechtigung. Bitte den Schlüssel prüfen.";
  }
  if (status === 429) {
    return "Tageslimit erreicht — bitte später erneut versuchen.";
  }
  if (status === 400) {
    // Often a content/policy reject — surface a snippet.
    const trimmed = body.length > 0 ? body.slice(0, 200) : "ungültige Anfrage";
    return `Anfrage abgelehnt: ${trimmed}`;
  }
  return `KI-Service antwortet gerade nicht (HTTP ${status}).`;
}

/* ------------------------------------------------------------------ */
/*  Prompt templates per (industry, image kind)                       */
/* ------------------------------------------------------------------ */

export type ImageKind = "logo" | "hero" | "about" | "gallery";

/**
 * Build a sensible default prompt based on the website's industry +
 * the kind of image we're generating. The customer can override the
 * prompt freely from the dashboard.
 */
export function defaultPromptFor(
  kind: ImageKind,
  industry: string | null,
  businessName: string,
): string {
  const trade = industry?.trim().toLowerCase() ?? "lokales Unternehmen";

  switch (kind) {
    case "logo":
      return `Minimalistisches, modernes Vektor-Logo für ${businessName}, ${trade}. Symbolartig, ohne Text, professionell, hoher Kontrast, neutraler Hintergrund. Editorial, nicht überladen.`;
    case "hero":
      return `Hochwertiges, redaktionelles Foto für die Header-Sektion einer ${trade}-Website. Helle, einladende Atmosphäre, weiches natürliches Licht, moderne Räume oder typische Szene aus dem Arbeitsalltag. 16:9, kein Text, keine Logos, keine Markenartikel. Premium-Look wie bei einer Apple-Produktseite.`;
    case "about":
      return `Authentisches, redaktionelles Foto eines deutschen ${trade}-Teams oder einer typischen Räumlichkeit. Tageslicht, modern, einladend. Hochformat 4:5, kein Text, keine Logos. Seriös und nahbar.`;
    case "gallery":
      return `Dokumentarisches, ehrliches Foto aus dem Alltag eines ${trade}. Natürliches Licht, scharf, hochwertig. Kein Text, keine Logos, keine Markenartikel.`;
  }
}

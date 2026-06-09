/**
 * Lädt eine echte Google-Font für die `next/og`-Image-Generierung.
 *
 * Hintergrund: Satori (die Engine hinter ImageResponse) kennt keine
 * `next/font`-Bindings und ohne explizit übergebene Font-Daten greift
 * ein generischer Fallback-Serif/Sans — das wirkt sofort "stock".
 *
 * Pattern stammt aus Vercels eigenen OG-Templates. Wir holen die
 * CSS-Definition von Google, parsen daraus den TTF/WOFF-Link und
 * laden die binären Font-Daten als ArrayBuffer.
 *
 * Build-Cache: bei inzwischen ~20 OG-Routen × 3 Fonts wären das
 * ohne Cache über 100 externe Fetches pro Build — jede einzelne
 * ein möglicher Build-Abbruch bei einem Google-Fonts-Schluckauf.
 * Wir cachen deshalb modulweit pro (family, weight, italic) und
 * laden die Fonts mit vollem Latin-Charset statt per-Aufruf-
 * Subsetting: die Datei ist etwas größer, aber identische Keys
 * treffen den Cache über alle Routen hinweg. Der `text`-Parameter
 * bleibt in der Signatur (Aufrufer dokumentieren damit, was sie
 * rendern), beeinflusst aber den Fetch nicht mehr.
 */

const fontCache = new Map<string, Promise<ArrayBuffer>>();

export function loadGoogleFont(options: {
  family: string;
  weight?: number;
  italic?: boolean;
  /** Dokumentiert den gerenderten Text; seit dem Build-Cache ohne
   *  Einfluss auf den Fetch (voller Latin-Charset wird geladen). */
  text?: string;
}): Promise<ArrayBuffer> {
  const { family, weight = 400, italic = false } = options;
  const key = `${family}:${weight}:${italic ? 1 : 0}`;

  const cached = fontCache.get(key);
  if (cached) return cached;

  const promise = fetchFont(family, weight, italic).catch((err) => {
    // Fehlgeschlagene Promise nicht im Cache lassen — sonst bleibt
    // ein transienter Netzwerkfehler für den Rest des Builds kleben.
    fontCache.delete(key);
    throw err;
  });
  fontCache.set(key, promise);
  return promise;
}

async function fetchFont(
  family: string,
  weight: number,
  italic: boolean,
): Promise<ArrayBuffer> {
  const familyParam = family.replace(/\s+/g, "+");
  const axis = italic ? "ital,wght" : "wght";
  const value = italic ? `1,${weight}` : `${weight}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}:${axis}@${value}&display=swap`;

  const cssRes = await fetch(cssUrl, {
    headers: {
      // Alter Chrome (vor WOFF2-Support, 2014) — gibt Google verlässlich
      // TTF-URLs zurück. Moderne UAs würden WOFF2 liefern, das Satori
      // (die Engine hinter ImageResponse) nicht versteht.
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/19.0.1084.46 Safari/536.5",
    },
  });
  if (!cssRes.ok) {
    throw new Error(
      `[og-fonts] Konnte Google-Font-CSS nicht laden (${cssRes.status}): ${family}`,
    );
  }
  const css = await cssRes.text();
  // Google Fonts liefert je nach User-Agent unterschiedliche
  // CSS-Strukturen. Ohne text-Param kann das CSS mehrere
  // @font-face-Blöcke mit unicode-range enthalten — wir nehmen den
  // latin-Block (letzter Block ist bei Google konventionell latin)
  // bzw. die erste brauchbare URL als Fallback.
  const ttfMatches = [...css.matchAll(/url\((https?:[^)]+\.ttf)\)/gi)];
  const woffMatch = css.match(/url\((https?:[^)]+\.woff)\)/i);
  const anyMatch = css.match(/url\((https?:[^)]+)\)/i);
  const fontUrl =
    ttfMatches.at(-1)?.[1] ?? woffMatch?.[1] ?? anyMatch?.[1];
  if (!fontUrl) {
    throw new Error(
      `[og-fonts] Konnte Font-URL in CSS nicht finden: ${family}`,
    );
  }
  const fontRes = await fetch(fontUrl);
  if (!fontRes.ok) {
    throw new Error(
      `[og-fonts] Konnte Font-Binary nicht laden (${fontRes.status}): ${family}`,
    );
  }
  return await fontRes.arrayBuffer();
}

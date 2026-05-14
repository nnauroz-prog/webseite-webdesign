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
 * `text` schränkt den Charset auf das ein, was wirklich gerendert
 * wird — die Datei ist dadurch deutlich kleiner und der Build
 * schneller.
 */
export async function loadGoogleFont(options: {
  family: string;
  weight?: number;
  italic?: boolean;
  text: string;
}): Promise<ArrayBuffer> {
  const { family, weight = 400, italic = false, text } = options;
  const familyParam = family.replace(/\s+/g, "+");
  const axis = italic ? "ital,wght" : "wght";
  const value = italic ? `1,${weight}` : `${weight}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}:${axis}@${value}&text=${encodeURIComponent(
    text,
  )}&display=swap`;

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
  // CSS-Strukturen. Wir akzeptieren:
  //   src: url(...) format('truetype'|'woff')   ← moderne Browser
  //   src: url(...);                            ← MSIE 6 / unbekannte UA
  // Bevorzuge eine TTF-URL, falls mehrere vorhanden sind.
  const ttfMatch = css.match(/url\((https?:[^)]+\.ttf)\)/i);
  const woffMatch = css.match(/url\((https?:[^)]+\.woff)\)/i);
  const anyMatch = css.match(/url\((https?:[^)]+)\)/i);
  const fontUrl = ttfMatch?.[1] ?? woffMatch?.[1] ?? anyMatch?.[1];
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

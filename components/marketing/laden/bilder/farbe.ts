/**
 * Kleine Farbhilfen für die gezeichneten Bilder: Tonstufen einer
 * Akzentfarbe (heller zu Weiß, dunkler zu Schwarz gemischt) und eine
 * schlichte Zeilenumbruch-Schätzung für SVG-Text.
 */

function teile(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.replace(/./g, "$&$&") : h;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function hexAus(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((c) =>
      Math.round(Math.max(0, Math.min(255, c)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** Mischt hex mit Weiß (anteil > 0) oder Schwarz (anteil < 0), anteil −1…1. */
export function ton(hex: string, anteil: number): string {
  const [r, g, b] = teile(hex);
  const ziel = anteil >= 0 ? 255 : 0;
  const a = Math.abs(anteil);
  return hexAus(r + (ziel - r) * a, g + (ziel - g) * a, b + (ziel - b) * a);
}

/**
 * Teilt einen Satz in Zeilen mit höchstens `max` Zeichen (grob: SVG kennt
 * keinen Umbruch). Wörter bleiben ganz.
 */
export function zeilen(text: string, max: number): string[] {
  const out: string[] = [];
  let z = "";
  for (const w of text.split(/\s+/)) {
    const n = z ? `${z} ${w}` : w;
    if (n.length > max && z) {
      out.push(z);
      z = w;
    } else z = n;
  }
  if (z) out.push(z);
  return out;
}

/**
 * Wie zeilen, aber höchstens n Zeilen: passt der Satz nicht, wird er am
 * ersten Komma oder Punkt gekürzt (nie mitten im Satz abgeschnitten).
 */
export function zeilenKurz(text: string, max: number, n: number): string[] {
  const alle = zeilen(text, max);
  if (alle.length <= n) return alle;
  const kurz = `${text.split(/[,.;:–]/)[0].trim()}.`;
  return zeilen(kurz, max).slice(0, n);
}

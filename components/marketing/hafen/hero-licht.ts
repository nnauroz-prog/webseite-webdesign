/**
 * Licht im Kopfbild nach dem Sonnenstand über Hamburg (53,55° N, 9,99° O).
 *
 * Gerechnet wird mit der tatsächlichen Sonnenhöhe, nicht mit festen
 * Uhrzeiten: im Juni ist es um 21 Uhr noch Abendlicht, im November schon
 * dunkel. Läuft nur im Browser (nach dem Hydrieren), der Server zeichnet
 * immer das neutrale Tageslicht.
 */

export type Licht = "morgen" | "tag" | "abend" | "nacht";

export const LICHTER: readonly Licht[] = ["morgen", "tag", "abend", "nacht"];

const RAD = Math.PI / 180;
const BREITE = 53.55;
const LAENGE = 9.99;

/** Sonnenhöhe in Grad und ob die Sonne im Osten steht (Vormittag). */
export function sonne(datum: Date) {
  // Tage seit J2000.0 (1. Januar 2000, 12 Uhr UTC)
  const d = datum.getTime() / 86400000 - 10957.5;
  const g = (357.529 + 0.98560028 * d) * RAD;
  const q = 280.459 + 0.98564736 * d;
  const l = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const e = (23.439 - 0.00000036 * d) * RAD;
  const ra = Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l));
  const dec = Math.asin(Math.sin(e) * Math.sin(l));
  const gmst = 18.697374558 + 24.06570982441908 * d;
  let ha = ((gmst * 15 + LAENGE) * RAD - ra) % (2 * Math.PI);
  if (ha > Math.PI) ha -= 2 * Math.PI;
  if (ha < -Math.PI) ha += 2 * Math.PI;
  const phi = BREITE * RAD;
  const hoehe = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha)) / RAD;
  return { hoehe, vormittag: ha < 0 };
}

/**
 * Über 8° Sonnenhöhe: Tag. Zwischen 8° und -6° (bürgerliche Dämmerung):
 * morgens Rosé, abends Bernstein. Darunter: Nacht.
 */
export function lichtFuer(datum: Date): Licht {
  const { hoehe, vormittag } = sonne(datum);
  if (hoehe >= 8) return "tag";
  if (hoehe < -6) return "nacht";
  return vormittag ? "morgen" : "abend";
}

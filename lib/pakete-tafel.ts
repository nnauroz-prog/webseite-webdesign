/**
 * Ein Satz je Paket, wie er auf der Abfahrtstafel steht. Eigene Datei
 * ohne Importe: Die Tafel ist eine Client-Komponente und soll
 * lib/pakete-data.ts nicht ins Bundle ziehen. Die Paket-Kacheln
 * (Startseite, /pakete) lesen denselben Text.
 */
export const TAFEL_ZEILEN = [
  { slug: "starter", linie: "S", desc: "Eine Seite mit Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten." },
  { slug: "business", linie: "B", desc: "Bis zu fünf Unterseiten, mit Team, Leistungen und Galerie." },
  { slug: "premium", linie: "P", desc: "Eigene Struktur. Speisekarte, Angebote oder Termine pflegen Sie selbst." },
] as const;

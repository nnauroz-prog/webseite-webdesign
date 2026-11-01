import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Die sechs Halte des Ablaufs, eine Quelle für /ablauf (ausführlich, mit
 * HowTo-Schema) und /website-erstellen-lassen (nur Titel, wer dran ist
 * und Hinweis, damit kein Doppeltext entsteht).
 *
 * `number` bleibt zweistellig, weil die Anker auf /ablauf (#step-01 …)
 * und das HowTo-Schema darauf zeigen. Dauer-Angaben folgen
 * lib/pakete-data.ts (Paket.dauer).
 *
 * Offen: app/ablauf/page.tsx führt die Halte noch als eigene Konstante
 * STEPS mit identischem Inhalt. Beim nächsten Durchgang dort
 * `import { ABLAUF_HALTE as STEPS } from "@/lib/ablauf-data"` setzen.
 */
export type AblaufHalt = {
  number: string;
  title: string;
  body: string;
  /** „Sie", „Wir" oder „Sie und wir". */
  wer: "Sie" | "Wir" | "Sie und wir";
  hinweis: string;
};

export const ABLAUF_HALTE: AblaufHalt[] = [
  {
    number: "01",
    title: "Sie schreiben uns",
    body: `Über das Formular mit drei Feldern oder per Mail an ${CONTACT_EMAIL}. Ein paar Sätze dazu, was Sie brauchen, reichen.`,
    wer: "Sie",
    hinweis: "Antwort meist am selben Werktag",
  },
  {
    number: "02",
    title: "Gespräch und Festpreis",
    body: "Eine Viertelstunde am Telefon oder per Video, in Hamburg auf Wunsch bei einem Kaffee. Danach schicken wir Ihnen den Festpreis schriftlich.",
    wer: "Sie und wir",
    hinweis: "Meist eine Viertelstunde",
  },
  {
    number: "03",
    title: "Sie schicken Ihre Unterlagen",
    body: "Ihr Logo in jedem Format, ein paar Fotos und Stichpunkte zu Ihren Leistungen. Handyfotos reichen, und wenn etwas fehlt, sagen wir Bescheid.",
    wer: "Sie",
    hinweis: "Fertige Texte brauchen wir nicht",
  },
  {
    number: "04",
    title: "Wir bauen die Seite",
    body: "Aus Ihren Stichpunkten schreiben wir die Texte, dann gestalten und bauen wir die Seite für Handy und Rechner. Ab vollständigen Unterlagen steht eine einzelne Seite oft nach ein bis zwei Werktagen, Business meist nach fünf bis zehn. Für Premium und Studio rechnen Sie mit zwei bis fünf Wochen.",
    wer: "Wir",
    hinweis: "Starter oft 1–2, Business meist 5–10 Werktage",
  },
  {
    number: "05",
    title: "Sie prüfen den Test-Link",
    body: "Sie sehen die fertige Seite unter einer Testadresse und schicken Ihre Änderungswünsche gesammelt. Eine Runde ist im Preis, bei Studio sind es bis zu drei. Freigegeben wird erst, wenn alles stimmt.",
    wer: "Sie",
    hinweis: "Eine Korrekturrunde inklusive, bei Studio bis zu drei",
  },
  {
    number: "06",
    title: "Die Seite geht online",
    body: "Domain, SSL-Zertifikat und Hosting richten wir ein und prüfen Formular und Karte auf echten Geräten. Danach erreichen Sie uns unter derselben Nummer wie vorher.",
    wer: "Wir",
    hinweis: "Zum vereinbarten Termin",
  },
];

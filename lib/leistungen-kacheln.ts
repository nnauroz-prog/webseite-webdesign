import { getPaketBySlug } from "@/lib/pakete-data";

/**
 * Was zu jeder Website gehört: die sechs Leistungen der Startseite
 * (Bento-Kacheln, früher der Containerstapel). Texte und Tags wortgleich;
 * size/tone stammen aus dem Containerstapel und bleiben für dessen
 * Darstellung erhalten.
 */

const MONTHLY = getPaketBySlug("starter")?.monthly.replace(/\s*\/\s*Monat$/, "").replace(/^ab/, "Ab") ?? "Ab 59\u00A0€";

export type Leistungskachel = {
  title: string;
  text: string;
  /** Linke Beschriftung: in welchem Paket der Container mitfährt. */
  tag: string;
  size: "40" | "20";
  tone: "signal" | "teer" | "gruen" | "zink" | "rost" | "weiss";
  href: string;
};

export const BOXES: Leistungskachel[] = [
  {
    title: "Die Website selbst",
    text: "Für Ihren Betrieb gestaltet, mit Ihrem Logo, Ihren Farben und Fotos, und direkt im Code gebaut, ohne Baukasten. Sie läuft auf dem Handy so gut wie am Rechner und lädt auch bei schwachem Mobilfunk zügig.",
    tag: "In jedem Paket",
    size: "40",
    tone: "signal",
    href: "/leistungen",
  },
  {
    title: "Hosting und Pflege",
    text: "Server in der EU, Sicherheits-Updates und Backups übernehmen wir. Kleine Änderungen sind im Monatsbeitrag enthalten: Sie schreiben uns, wir setzen sie um.",
    tag: `${MONTHLY} im Monat`,
    size: "40",
    tone: "teer",
    href: "/wartung",
  },
  {
    title: "Texte",
    text: "Sie schicken Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und geben frei.",
    tag: "In jedem Paket",
    size: "20",
    tone: "gruen",
    href: "/ablauf",
  },
  {
    title: "Anfragen",
    text: "Kontaktformular mit Spamschutz und ein Anruf-Knopf, der auf dem Handy direkt wählt.",
    tag: "In jedem Paket",
    size: "20",
    tone: "zink",
    href: "/leistungen",
  },
  {
    title: "Bei Google",
    text: "Titel und Beschreibung für jede Seite, Sitemap und Ihr Google-Unternehmensprofil. Damit Google versteht, was Sie anbieten und wo.",
    tag: "Ab Business",
    size: "20",
    tone: "rost",
    href: "/pakete/business",
  },
  {
    title: "Selbst pflegen",
    text: "Speisekarte, Wochenangebot oder Termine ändern Sie selbst, ohne uns anzurufen.",
    tag: "Ab Premium",
    size: "20",
    tone: "weiss",
    href: "/pakete/premium",
  },
];


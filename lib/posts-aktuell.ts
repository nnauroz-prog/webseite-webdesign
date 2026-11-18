import type { Spruch } from "@/lib/sprueche-data";

/**
 * Tagesaktuelle Posts: Jeden Morgen schreibt ein automatischer Lauf ein
 * bis drei Karten zu dem, was an diesem Tag in Hamburg los ist (Anlass,
 * Wetter, Termine, Neuigkeiten für kleine Betriebe). Sie haben Vorrang vor
 * der Reserve in lib/sprueche-liste.ts und lib/sprueche-extra.ts; fehlt ein
 * Tag hier, springt die Reserve ein (lib/sprueche-data.ts, postsFuer).
 * Feiertage, Handelstage und Hamburger Termine stehen in lib/anlaesse.ts.
 *
 * Regeln (prüft tests/sprueche.test.ts):
 * - Schlüssel ist der Kalendertag in Hamburg (yyyy-mm-dd), in zeitlicher
 *   Reihenfolge. Neue Tage NUR UNTEN ANHÄNGEN, vergangene Tage nie ändern
 *   (das Journal zeigt die letzten sieben Tage).
 * - Ein bis drei Karten je Tag; die Reihenfolge ist der Platz (0 = Spruch
 *   des Tages, auch auf /journal). Verschiedene Kicker je Tag.
 * - Für jede Karte gelten dieselben Regeln wie für die Reserve: Längen,
 *   Sie-Form oder ohne Anrede, keine Ziffern, Preise, Marken (außer
 *   Google), Garantien, keine erfundenen Zahlen, Kunden, Bewertungen.
 * - Kicker mit Bedeutung: „Red Flag“ ein Warnzeichen auf einer Website,
 *   „Green Flag“ ein gutes Zeichen, „Mythos“ ein verbreiteter Irrtum im
 *   Satz, den der Zusatz richtigstellt (der Satz wird durchgestrichen),
 *   „POV“ eine Szene aus Sicht eines Besuchers.
 * - betont: die Pointe, ein bis drei ganze Wörter, wörtlich aus dem Satz,
 *   am liebsten am Satzende.
 * - anlass: kurz und wahr für genau diesen Tag (3 bis 28 Zeichen, ohne
 *   Ziffern), steht auf dem Bild, etwa „Black Friday“, „Erster Advent“,
 *   „Winterdom läuft“. Daraus entsteht auch das Schlagwort im
 *   Beitragstext (#blackfriday).
 * - quelle: Adresse, auf die sich der Anlass stützt (nur im
 *   Mitgliederbereich zu sehen, nie auf dem Bild).
 * - Kein Satz darf schon in der Reserve oder an einem anderen Tag stehen.
 */
export type AktuellerPost = Spruch & {
  /** Kurzer, wahrer Anlass, steht auf dem Bild: „Black Friday“. */
  anlass: string;
  /** Worauf sich der Anlass stützt (Adresse), nur im Mitgliederbereich. */
  quelle?: string;
};

export const POSTS_AKTUELL: Record<string, AktuellerPost[]> = {
  "2026-11-16": [
    {
      kicker: "Hot Take",
      text: "Ihre Website ist kein Fahrgeschäft.",
      betont: "kein Fahrgeschäft",
      zusatz:
        "Durchgeschüttelt wird auf dem Heiligengeistfeld. Online will man einfach ankommen.",
      thema: "eindruck",
      anlass: "Winterdom läuft",
      quelle: "https://www.hamburg.de/freizeit/dom/termine-337422",
    },
    {
      kicker: "Merken",
      text: "Im Dunkeln wird nicht gebummelt. Es wird gesucht.",
      betont: "gesucht",
      zusatz:
        "Wer jetzt nach Feierabend loszieht, hat das Ziel vorher am Handy gewählt.",
      thema: "google",
      anlass: "Früh dunkel in Hamburg",
      quelle: "https://www.timeanddate.com/astronomy/germany/hamburg",
    },
    {
      kicker: "Real Talk",
      text: "Gutscheine an der Kasse, aber die Website weiß von nichts.",
      betont: "weiß von nichts",
      zusatz:
        "Die Geschenkejagd beginnt bald. Ein Satz zu Wert, Kauf und Abholung reicht.",
      thema: "pflege",
      anlass: "Advent in Sicht",
    },
  ],
  "2026-11-17": [
    {
      kicker: "Mythos",
      text: "Im November verkauft sich nur, was durchgestrichen ist.",
      betont: "durchgestrichen",
      zusatz:
        "Klare Leistung, ehrlicher Preis, freier Termin: Das zieht auch ohne roten Stift.",
      thema: "vertrauen",
      anlass: "Black Friday in Sicht",
    },
    {
      kicker: "Red Flag",
      text: "Die Startseite ist voller als der Rathausmarkt am Samstag.",
      betont: "Rathausmarkt am Samstag",
      zusatz:
        "Für Glühwein schiebt man sich durchs Gedränge. Für eine Website nicht.",
      thema: "eindruck",
      anlass: "Weihnachtsmarkt ab Montag",
      quelle:
        "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/historischer-weihnachtsmarkt-auf-dem-rathausmarkt-1/",
    },
    {
      kicker: "POV",
      text: "Dom vorbei, Hände kalt, Hunger groß. Wer hat jetzt noch auf?",
      betont: "noch auf",
      zusatz:
        "Gesucht wird im Gehen. Zeiten, Karte und Weg müssen sofort zu sehen sein.",
      thema: "handy",
      anlass: "Winterdom läuft",
      quelle: "https://www.hamburg.de/freizeit/dom/termine-337422",
    },
  ],
  "2026-11-18": [
    {
      kicker: "Kleiner Reminder",
      text: "Vorsatz im Januar: neue Website. Jetzt ist November.",
      betont: "Jetzt ist November",
      zusatz:
        "Ein paar Wochen hat das Jahr noch. Für den Anfang genügt eine kurze Nachricht.",
      thema: "eindruck",
      anlass: "Jahresende in Sicht",
    },
    {
      kicker: "Hand aufs Herz",
      text: "Auf dem Dom ist Familientag. Und wer steckt hinter Ihrem Betrieb?",
      betont: "hinter Ihrem Betrieb",
      zusatz:
        "Ein Foto, ein Name, zwei Sätze: Man kauft lieber bei Menschen als bei einem Logo.",
      thema: "vertrauen",
      anlass: "Familientag auf dem Dom",
      quelle: "https://www.hamburg.de/freizeit/dom/dom-familientag-337324",
    },
    {
      kicker: "Mal ehrlich",
      text: "Die Woche ist halb rum. Wie viele Anfragen kamen über die Website?",
      betont: "über die Website",
      zusatz:
        "Keine Ahnung ist auch eine Antwort. Nur keine, mit der sich planen lässt.",
      thema: "anfrage",
      anlass: "Bergfest",
    },
  ],
};

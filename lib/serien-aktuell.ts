import type { StorySerie } from "@/lib/story-serie";

/**
 * Story-Serie des Tages: Jeden Morgen schreibt der Morgenlauf zu den drei
 * Tageskarten (lib/posts-aktuell.ts) eine Serie aus drei bis fünf
 * Story-Bildern, die zusammen eine kleine Geschichte zum Tag erzählen.
 * Sie erscheint nur im Story-Studio (/admin/story).
 *
 * Regeln (prüft tests/story-serie.test.ts, dieselben wie in der Redaktion
 * des Studios: pruefeSerie in lib/story-serie.ts):
 * - Schlüssel ist der Kalendertag in Hamburg (yyyy-mm-dd), in zeitlicher
 *   Reihenfolge. Neue Tage NUR UNTEN ANHÄNGEN, vergangene Tage nie ändern.
 * - Drei bis fünf Bilder: zuerst der Aufhänger, dann Problem, Lösung,
 *   zuletzt die Einladung zur Anfrage.
 * - Für jedes Bild gelten die Regeln einer Karte (lib/karten-regeln.ts).
 * - titel: kurz und wahr für diesen Tag, steht auf jedem Bild.
 * - Die Bilder lesen sich hintereinander wie eine Geschichte: Jedes
 *   bringt sie einen Schritt weiter, keines wiederholt ein Wort oder
 *   einen Gedanken des vorigen. betont ist die Pointe (ein bis drei
 *   ganze Wörter, am liebsten am Satzende).
 * - Das letzte Bild lädt ein, kurz zu schreiben, was gebraucht wird.
 *   Adresse und Telefon setzt der Zeichner selbst dazu (lib/story-bild.ts),
 *   sie gehören nicht in den Text.
 * - Kein Satz darf schon in der Reserve, bei den tagesaktuellen Karten
 *   oder in einer anderen Serie stehen.
 */
export const SERIEN_AKTUELL: Record<string, StorySerie> = {
  "2026-11-17": {
    titel: "Früh dunkel in Hamburg",
    quelle: "https://www.timeanddate.com/astronomy/germany/hamburg",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Hand aufs Herz",
        text: "Wer antwortet bei Ihnen nach Feierabend?",
        betont: "Feierabend",
        zusatz:
          "Kurz nach vier geht in Hamburg die Sonne unter. Gesucht wird dann vom Sofa aus.",
        thema: "anfrage",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Viele Websites gehen einfach mit nach Hause.",
        betont: "nach Hause",
        zusatz:
          "Zeiten vom Sommer, ein Formular ohne Antwort, das Telefon erst morgen wieder.",
        thema: "pflege",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Eine gute Website übernimmt die Nachtschicht.",
        betont: "Nachtschicht",
        zusatz:
          "Sie sagt, was Sie anbieten und wann Sie da sind. Und nimmt die Anfrage gleich an.",
        thema: "vertrauen",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns kurz, was Sie brauchen.",
        betont: "was Sie brauchen",
        zusatz: "Ein paar Zeilen im Anfrageformular genügen. Wir melden uns.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-18": {
    titel: "Black Friday naht",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Hot Take",
        text: "Am Black Friday verkauft nicht der Rabatt, sondern das Ende.",
        betont: "das Ende",
        zusatz:
          "Was morgen vorbei ist, holt Leute vom Sofa. Ein Dauerangebot kann warten.",
        thema: "anfrage",
      },
      {
        rolle: "problem",
        kicker: "Real Talk",
        text: "Auf Ihrer Website gilt alles jederzeit. Also eilt nichts.",
        betont: "eilt nichts",
        zusatz:
          "Aus „Schau ich später an“ wird so leicht nie. Nicht aus Desinteresse: Es fehlt ein Grund für heute.",
        thema: "anfrage",
      },
      {
        rolle: "loesung",
        kicker: "Merken",
        text: "Nennen Sie offen, was bald nicht mehr geht.",
        betont: "nicht mehr geht",
        zusatz:
          "Bestellschluss für Festtagstorten, letzte Termine vor den Feiertagen: wahr, konkret, gut sichtbar.",
        thema: "pflege",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Schreiben Sie uns, bis wann man bei Ihnen dran sein muss.",
        betont: "dran sein muss",
        zusatz:
          "Zwei, drei Sätze reichen. Wir zeigen, wo das auf Ihre Seite gehört.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-19": {
    titel: "Weihnachtsmarkt ab Montag",
    quelle:
      "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/historischer-weihnachtsmarkt-auf-dem-rathausmarkt-1/",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Hand aufs Herz",
        text: "Findet Sie jemand, der Ihre Straße nicht kennt?",
        betont: "nicht kennt",
        zusatz:
          "Ab Montag kommen Gäste zum Weihnachtsmarkt, die sich hier nicht auskennen.",
        thema: "eindruck",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "„Gleich bei der alten Post“ hilft nur, wer die alte Post kennt.",
        betont: "alte Post kennt",
        zusatz:
          "Für Einheimische geschrieben, von Fremden gelesen. Die suchen kurz und gehen dann woandershin.",
        thema: "texte",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Der Weg beginnt dort, wo Fremde gerade stehen.",
        betont: "gerade stehen",
        zusatz:
          "Von der Haltestelle oder vom bekannten Platz aus, dazu ein Foto vom Eingang.",
        thema: "handy",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, woran man Ihren Eingang erkennt.",
        betont: "Ihren Eingang erkennt",
        zusatz:
          "Ein Stichwort pro Abbiegung reicht. Den Rest bauen wir auf Ihrer Seite.",
        thema: "anfrage",
      },
    ],
  },
};

/** Die Serie des Tages (yyyy-mm-dd) oder null, wenn es keine gibt. */
export function serieFuer(
  datum: string,
  serien: Readonly<Record<string, StorySerie>> = SERIEN_AKTUELL,
): StorySerie | null {
  return serien[datum] ?? null;
}

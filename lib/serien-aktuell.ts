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
    titel: "Black Friday in Sicht",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Mal ehrlich",
        text: "Nächste Woche wird verglichen. Auch bei Ihnen?",
        betont: "Auch bei Ihnen",
        zusatz:
          "In der Rabattwoche schaut man genauer hin, was etwas kostet. Beim Handwerker wie im Café.",
        thema: "vertrauen",
      },
      {
        rolle: "problem",
        kicker: "Real Talk",
        text: "Wer „Preis auf Anfrage“ liest, fragt lieber gar nicht.",
        betont: "gar nicht",
        zusatz:
          "Ohne Hausnummer rechnet man mit dem Schlimmsten und sucht weiter.",
        thema: "texte",
      },
      {
        rolle: "loesung",
        kicker: "Merken",
        text: "Ein ehrlicher Richtpreis schlägt jeden Rabatt.",
        betont: "jeden Rabatt",
        zusatz:
          "Eine Spanne, ein Beispiel und was dabei ist: So weiß jeder, woran er ist.",
        thema: "vertrauen",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Schreiben Sie uns, was Sie vorhaben. Wir nennen den Preis.",
        betont: "den Preis",
        zusatz:
          "Ein paar Sätze im Formular reichen. Der Festpreis kommt schriftlich.",
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

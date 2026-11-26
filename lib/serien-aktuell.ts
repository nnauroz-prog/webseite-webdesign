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
  "2026-11-20": {
    titel: "Lieber nicht anrufen",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "POV",
        text: "Nummer gefunden, Daumen drüber. Und dann doch lieber morgen.",
        betont: "lieber morgen",
        zusatz:
          "Anrufen heißt erklären, was man selbst nicht genau weiß. Das schiebt man gern vor sich her.",
        thema: "handy",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Auf der Seite gibt es nur einen Weg zu Ihnen: das Telefon.",
        betont: "das Telefon",
        zusatz:
          "Wer zögert, hat keinen leiseren Weg. Also nimmt er gar keinen.",
        thema: "anfrage",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Ein zweiter Weg zu Ihnen kostet weniger Mut.",
        betont: "weniger Mut",
        zusatz:
          "Ein Formular mit drei kurzen Feldern oder ein Rückruf zur Wunschzeit. Leise genügt.",
        thema: "eindruck",
      },
      {
        rolle: "einladung",
        kicker: "Merken",
        text: "Schreiben Sie uns, wie Kunden Sie heute erreichen.",
        betont: "heute erreichen",
        zusatz:
          "Ein paar Stichworte genügen. Wir zeigen, wo ein leiserer Weg hinpasst.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-21": {
    titel: "Wer liest mit",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Hand aufs Herz",
        text: "Wer schreibt Ihnen, wenn er nicht weiß, wer es liest?",
        betont: "wer es liest",
        zusatz:
          "Ein Formular ohne Gesicht fühlt sich an wie ein Briefkasten im Nirgendwo.",
        thema: "vertrauen",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "„Ihr Team freut sich auf Sie“ klingt nach Callcenter.",
        betont: "nach Callcenter",
        zusatz:
          "Wer nicht weiß, wer antwortet, rechnet mit Warteschleife. Und schreibt lieber woanders hin.",
        thema: "texte",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Neben dem Formular steht, wer antwortet. Mit Foto und Vornamen.",
        betont: "Foto und Vornamen",
        zusatz:
          "„Hier antworte ich selbst.“ Ein Satz, ein Gesicht, und aus Kontakt wird ein Gespräch.",
        thema: "vertrauen",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, wer bei Ihnen die Anfragen liest.",
        betont: "Anfragen liest",
        zusatz:
          "Ein Vorname reicht für den Anfang. Wir melden uns und zeigen, wie das aussieht.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-22": {
    titel: "In Kundenworten",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "POV",
        text: "Wasserfleck an der Decke. Was tippt man jetzt ins Handy?",
        betont: "ins Handy",
        zusatz:
          "Bestimmt nicht „Leckortung“. Sondern genau das, was man sieht.",
        thema: "handy",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Auf der Seite stehen nur Fachwörter, die Kunden nie benutzen.",
        betont: "nie benutzen",
        zusatz:
          "Sie beschreiben Ihre Arbeit. Gesucht wird aber das Problem, und davon steht dort nichts.",
        thema: "texte",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Die Seite nennt zuerst das Problem, dann die Leistung.",
        betont: "zuerst das Problem",
        zusatz:
          "„Feuchter Fleck an der Wand?“ als Überschrift, darunter, was Sie dagegen tun.",
        thema: "google",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, womit Kunden bei Ihnen anrufen.",
        betont: "bei Ihnen anrufen",
        zusatz:
          "Die ersten Sätze am Telefon verraten, wonach gesucht wird. Damit fangen wir an.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-23": {
    titel: "Weihnachtsmarkt eröffnet",
    quelle:
      "https://www.hamburg.de/tourismus/weihnachten-hamburg/weihnachtsmarkt-hamburg/weihnachtsmarkt-rathausmarkt-301092",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Real Talk",
        text: "An der Glühweinbude entscheidet man in einer Sekunde. Warum?",
        betont: "Warum",
        zusatz:
          "Ware, Preis und ein Gesicht, alles auf einen Blick. Niemand muss erst fragen.",
        thema: "eindruck",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Auf vielen Websites muss man sich das alles erst zusammensuchen.",
        betont: "erst zusammensuchen",
        zusatz:
          "Leistung auf einer Seite, Preis nirgends, das Team ganz unten. An so einen Stand ginge keiner.",
        thema: "texte",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Die erste Seite zeigt, was es gibt, was es ungefähr kostet und wer da steht.",
        betont: "wer da steht",
        zusatz:
          "Drei Dinge auf einen Blick. Alles andere darf eine Ebene tiefer warten.",
        thema: "vertrauen",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, was an Ihrem Stand ganz vorne läge.",
        betont: "ganz vorne läge",
        zusatz:
          "Daraus bauen wir die erste Seite. Ihre Antwort darf ganz kurz sein.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-24": {
    titel: "Vorher und nachher",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "POV",
        text: "Ein Foto vom fertigen Bad. Schön. Aber wie sah es vorher aus?",
        betont: "vorher aus",
        zusatz:
          "Erst der Vergleich zeigt, was Sie können. Das Ergebnis allein sieht aus wie ein Katalog.",
        thema: "eindruck",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Auf der Seite stehen nur Fotos aus dem Katalog des Herstellers.",
        betont: "des Herstellers",
        zusatz:
          "Die kennt der Kunde schon von woanders. Ihre eigene Arbeit sieht er nirgends.",
        thema: "vertrauen",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Ein Vorher-Bild, ein Nachher-Bild, ein Satz dazu.",
        betont: "ein Satz dazu",
        zusatz: "Ein Handyfoto von der Baustelle reicht. Echt schlägt schön.",
        thema: "vertrauen",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, welcher Auftrag Sie zuletzt stolz gemacht hat.",
        betont: "stolz gemacht hat",
        zusatz:
          "Davon ein Vorher und ein Nachher, und Ihre Seite hat ihr bestes Bild.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-25": {
    titel: "Zwei Antworten",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "POV",
        text: "Google sagt geöffnet, die Website sagt geschlossen. Wem glaubt man?",
        betont: "Wem glaubt man",
        zusatz:
          "Keinem von beiden. Wer zwei Antworten bekommt, nimmt einen dritten Anbieter.",
        thema: "google",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Zeiten, Preise und Telefonnummer stehen an drei Orten verschieden.",
        betont: "drei Orten verschieden",
        zusatz:
          "Profil, Website, Aushang: Jede Abweichung sieht nach Nachlässigkeit aus, auch wenn sie keine ist.",
        thema: "vertrauen",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Eine Stelle ist die Quelle, alles andere schreibt von ihr ab.",
        betont: "von ihr ab",
        zusatz:
          "Erst auf der Website ändern, dann im Profil. Fünf Minuten, einmal im Monat.",
        thema: "pflege",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Schreiben Sie uns, wo Ihre Angaben überall stehen.",
        betont: "überall stehen",
        zusatz:
          "Ein paar Links genügen. Wir melden uns mit einem Blick von außen.",
        thema: "anfrage",
      },
    ],
  },
  "2026-11-26": {
    titel: "Für Stammkunden",
    folien: [
      {
        rolle: "aufhaenger",
        kicker: "Hand aufs Herz",
        text: "Ihre Stammkunden besuchen die Website auch. Nur anders.",
        betont: "Nur anders",
        zusatz:
          "Sie suchen nicht, wer Sie sind. Sie suchen schnell eine Zeit, eine Nummer, einen Termin.",
        thema: "vertrauen",
      },
      {
        rolle: "problem",
        kicker: "Red Flag",
        text: "Für Stammkunden ist der Weg zum Termin oft der längste.",
        betont: "der längste",
        zusatz:
          "Erst Werbetext, dann Leistungen, ganz unten die Nummer. Treue wird mit Scrollen bestraft.",
        thema: "handy",
      },
      {
        rolle: "loesung",
        kicker: "Green Flag",
        text: "Ganz oben steht eine Zeile für alle, die schon wissen, was sie wollen.",
        betont: "was sie wollen",
        zusatz:
          "Termin, Telefon, Zeiten in einer Reihe. Neue lesen weiter, Treue sind schon fertig.",
        thema: "eindruck",
      },
      {
        rolle: "einladung",
        kicker: "Kurz gesagt",
        text: "Erzählen Sie uns, was Ihre Stammkunden am häufigsten wollen.",
        betont: "am häufigsten wollen",
        zusatz: "Daraus wird die Zeile ganz oben. Ein paar Worte reichen.",
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

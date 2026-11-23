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
      kicker: "Mal ehrlich",
      text: "Ihre Website ist der einzige Mitarbeiter, über den sich nie jemand beschwert.",
      betont: "nie jemand beschwert",
      zusatz:
        "Nicht weil sie so gut ist. Wer sich über sie ärgert, sagt nichts. Er ist einfach weg.",
      thema: "eindruck",
      anlass: "Mitte der Woche",
    },
    {
      kicker: "Unpopular Opinion",
      text: "Der Dom sieht jedes Jahr fast gleich aus. Trotzdem wirkt er nie veraltet.",
      betont: "nie veraltet",
      zusatz:
        "Veraltet wirkt nicht das Vertraute. Veraltet wirkt, was nicht mehr stimmt.",
      thema: "pflege",
      anlass: "Winterdom läuft",
      quelle: "https://www.hamburg.de/freizeit/dom/termine-337422",
    },
    {
      kicker: "Website-Wahrheit",
      text: "Ihre Arbeit kann kaum ein Kunde prüfen. Ihre Website schon.",
      betont: "Ihre Website schon",
      zusatz:
        "Also prüft er, was er kann: Zeiten, Fotos, Tippfehler. Gemeint ist Ihre Arbeit.",
      thema: "vertrauen",
      anlass: "Jahresende in Sicht",
    },
  ],
  "2026-11-19": [
    {
      kicker: "Green Flag",
      text: "Die Website sagt auch, was Sie nicht machen.",
      betont: "nicht machen",
      zusatz:
        "Ein klares Nein spart zwei Telefonate. Und macht jedes Ja glaubwürdiger.",
      thema: "vertrauen",
      anlass: "Mitte November",
    },
    {
      kicker: "Real Talk",
      text: "Wer Geschenke sucht, kennt Ihren Namen noch gar nicht.",
      betont: "noch gar nicht",
      zusatz:
        "Er tippt „Geschenk für Gartenfreunde Hamburg“. Steht so ein Satz auf Ihrer Seite?",
      thema: "google",
      anlass: "Fünf Wochen bis Heiligabend",
    },
    {
      kicker: "Hot Take",
      text: "„Individuell“ schreiben fast alle. Darum unterscheidet es Sie von niemandem.",
      betont: "von niemandem",
      zusatz:
        "Ein Beispiel tut es: ein Foto und ein Satz zu einem echten Auftrag.",
      thema: "texte",
      anlass: "Advent in Sicht",
    },
  ],
  "2026-11-20": [
    {
      kicker: "Kurz gesagt",
      text: "Die Frage „Was kostet das?“ beantwortet Ihre Website schon. Mit Schweigen.",
      betont: "Mit Schweigen",
      zusatz:
        "Fehlt jeder Anhaltspunkt, rechnet der Kunde mit teuer. Ein Beispielpreis hält ihn im Gespräch.",
      thema: "anfrage",
      anlass: "Black Friday in Sicht",
    },
    {
      kicker: "Mythos",
      text: "Wer offen hat, muss das nicht extra sagen.",
      betont: "nicht extra sagen",
      zusatz:
        "Vor Feiertagen rechnen viele mit dem Gegenteil. Wer nichts sagt, gilt schnell als zu.",
      thema: "pflege",
      anlass: "Weihnachtszeit naht",
    },
    {
      kicker: "Hand aufs Herz",
      text: "Würden Sie bei sich anfragen, wenn Sie nur die Website kennten?",
      betont: "Website kennten",
      zusatz:
        "Genau so geht es Fremden: kein Handschlag, kein Ruf, nur diese Seite.",
      thema: "eindruck",
      anlass: "Freitag",
    },
  ],
  "2026-11-21": [
    {
      kicker: "Green Flag",
      text: "Unter den Fotos steht, was darauf zu sehen ist.",
      betont: "zu sehen ist",
      zusatz:
        "„Bad in Eimsbüttel, zwei Wochen Arbeit“ macht aus einem schönen Bild einen Beweis.",
      thema: "vertrauen",
      anlass: "Spätherbst",
    },
    {
      kicker: "Mal ehrlich",
      text: "Ihre Website erzählt, was Sie können. Gefragt ist, wie es abläuft.",
      betont: "wie es abläuft",
      zusatz:
        "Wer kommt, wie lange es dauert, was danach passiert. Der Ablauf beruhigt mehr als jedes Können.",
      thema: "texte",
      anlass: "Wochenende",
    },
    {
      kicker: "POV",
      text: "Samstag, Kaffee, Liste für nächste Woche. Drauf steht, wer klar war.",
      betont: "wer klar war",
      zusatz:
        "Am Wochenende wird verglichen und vorgemerkt. Angerufen wird am Montag, wer auf der Liste steht.",
      thema: "anfrage",
      anlass: "Samstag",
    },
  ],
  "2026-11-22": [
    {
      kicker: "Unpopular Opinion",
      text: "Nicht jede Seite braucht einen Knopf, der drängt.",
      betont: "der drängt",
      zusatz:
        "„Jetzt anfragen“ unter jedem Absatz wirkt wie ein Verkäufer, der nicht von der Seite weicht.",
      thema: "anfrage",
      anlass: "Sonntag",
    },
    {
      kicker: "Website-Wahrheit",
      text: "Ruhige Seiten wirken sicherer als laute.",
      betont: "als laute",
      zusatz:
        "Wer unsicher ist, sucht Halt, keine Aufregung. Freier Raum ist dann kein leerer Platz, sondern Ruhe.",
      thema: "eindruck",
      anlass: "Ende November",
    },
    {
      kicker: "Kleiner Reminder",
      text: "Ab morgen ist die Innenstadt voll. Ihre Website bleibt ohne Gedränge.",
      betont: "ohne Gedränge",
      zusatz:
        "Wer im Trubel nichts entscheidet, entscheidet abends daheim. Dort zählt, was in Ruhe zu finden ist.",
      thema: "texte",
      anlass: "Weihnachtsmarkt ab morgen",
      quelle:
        "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/historischer-weihnachtsmarkt-auf-dem-rathausmarkt-1/",
    },
  ],
  "2026-11-23": [
    {
      kicker: "Website-Wahrheit",
      text: "Wer zweimal klicken muss, um anzurufen, ruft seltener an.",
      betont: "seltener an",
      zusatz:
        "Jeder Schritt mehr ist eine Gelegenheit, es sich anders zu überlegen.",
      thema: "handy",
      anlass: "Montag",
    },
    {
      kicker: "Hot Take",
      text: "Ein Rabatt sagt, was Sie wert sind. Nur leider weniger.",
      betont: "leider weniger",
      zusatz:
        "Wer am Freitag mitzieht, erzieht Kunden zum Warten. Ein klares Angebot braucht keinen Countdown.",
      thema: "vertrauen",
      anlass: "Black Friday am Freitag",
    },
    {
      kicker: "Mythos",
      text: "Im Dezember hat niemand Zeit für einen neuen Anbieter.",
      betont: "neuen Anbieter",
      zusatz:
        "Gerade jetzt wird für Januar geplant. Wer jetzt gefunden wird, ist im neuen Jahr schon im Gespräch.",
      thema: "google",
      anlass: "Wochenstart",
    },
  ],
};

import type { Spruch } from "@/lib/sprueche-data";

/**
 * Die Karten für den Spruch des Tages, in der Reihenfolge, in der sie
 * erscheinen (danach beginnt die Liste von vorn). Neue Karten unten
 * anhängen. Regeln (prüft tests/sprueche.test.ts):
 * - text höchstens 80 Zeichen, zusatz höchstens 100, beide mit Satzende
 * - betont ist ein wörtlicher Ausschnitt aus text (ganze Wörter, die Pointe)
 * - Sie-Form oder ohne Anrede; keine Ziffern, Preise, Marken, Garantien
 * - keine erfundenen Zahlen, Kunden, Bewertungen oder Auszeichnungen
 * - zwei Karten nacheinander nie mit gleichem Thema und gleichem Kicker
 */
export const SPRUECHE: Spruch[] = [
  {
    kicker: "Hot Take",
    text: "Ihr Betrieb ist besser als Ihre Website.",
    betont: "besser",
    zusatz: "Nur sieht das online noch keiner.",
    thema: "eindruck",
  },
  {
    kicker: "Real Talk",
    text: "Sorry, aber „Herzlich willkommen“ ist kein Angebot.",
    betont: "kein Angebot",
    zusatz: "In die erste Zeile gehört, was Sie tun und für wen.",
    thema: "texte",
  },
  {
    kicker: "Red Flag",
    text: "Ein Formular, das mehr Fragen stellt als ein Bauantrag.",
    betont: "ein Bauantrag",
    zusatz: "Name, Anliegen, Rückrufnummer. Den Rest klärt man im Gespräch.",
    thema: "anfrage",
  },
  {
    kicker: "Mal ehrlich",
    text: "Wer pflegt die Seite, seit der Neffe weggezogen ist?",
    betont: "der Neffe",
    zusatz: "Eine Website braucht jemanden, der zuständig ist. Auf Dauer.",
    thema: "pflege",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Lieber ein schiefes echtes Foto als ein perfektes gekauftes.",
    betont: "schiefes echtes Foto",
    zusatz:
      "Mehl an der Schürze überzeugt mehr als jedes Lächeln aus dem Katalog.",
    thema: "vertrauen",
  },
  {
    kicker: "POV",
    text: "Kalte Finger an der Haltestelle, und der Knopf ist winzig.",
    betont: "Knopf ist winzig",
    zusatz: "Der Bus kommt. Die Anfrage nicht.",
    thema: "handy",
  },
  {
    kicker: "Hot Take",
    text: "Wer bei Google nicht auftaucht, wirkt online wie geschlossen.",
    betont: "wie geschlossen",
    zusatz: "Auch wenn drinnen das Licht brennt.",
    thema: "google",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Die Fähre wartet nicht. Ihr Besucher auch nicht.",
    betont: "wartet nicht",
    zusatz: "Lädt die Seite zu lange, hat er längst abgelegt.",
    thema: "tempo",
  },
  {
    kicker: "Red Flag",
    text: "Kompetent, zuverlässig, flexibel: steht wirklich überall.",
    betont: "wirklich überall",
    zusatz: "Hängen bleibt, was so nur bei Ihnen stehen könnte.",
    thema: "texte",
  },
  {
    kicker: "Green Flag",
    text: "Auf der Website sieht man schon, wer morgen klingelt.",
    betont: "wer morgen klingelt",
    zusatz: "Wer weiß, wer kommt, macht die Tür lieber auf.",
    thema: "vertrauen",
  },
  {
    kicker: "Merken",
    text: "Der Nachbar-Test: Startseite zeigen, nichts erklären.",
    betont: "nichts erklären",
    zusatz:
      "Weiß Ihr Gegenüber nach einem Blick, was Sie anbieten? Dann passt es.",
    thema: "eindruck",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Die Telefonnummer muss man antippen können.",
    betont: "antippen können",
    zusatz: "Abtippen will am Handy niemand. Einmal kurz testen.",
    thema: "handy",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Kein Laden versteckt seine Kasse im Keller.",
    betont: "im Keller",
    zusatz: "Warum steht der Kontakt dann erst ganz unten auf der Seite?",
    thema: "anfrage",
  },
  {
    kicker: "Kurz gesagt",
    text: "Wer nur die Überschriften liest, muss trotzdem alles verstehen.",
    betont: "nur die Überschriften",
    zusatz:
      "So wird im Netz gelesen: erst das Fette, dann vielleicht der Rest.",
    thema: "texte",
  },
  {
    kicker: "Green Flag",
    text: "Antippen, da. So fühlt sich eine gute Seite an.",
    betont: "Antippen, da",
    zusatz: "Niemand lobt schnelle Seiten. Man bleibt einfach.",
    thema: "tempo",
  },
  {
    kicker: "Red Flag",
    text: "Drei Fenster wegklicken, bevor man Ihr Angebot sieht.",
    betont: "Drei Fenster",
    zusatz:
      "Vor die Ladentür stellt auch niemand drei Aufsteller hintereinander.",
    thema: "eindruck",
  },
  {
    kicker: "Merken",
    text: "Das Impressum ist Ihr Klingelschild im Netz.",
    betont: "Klingelschild",
    zusatz:
      "Wer dort mit Namen und Anschrift steht, ist ein Betrieb zum Anfassen.",
    thema: "vertrauen",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Arbeitet jeder auf Ihrem Teamfoto noch bei Ihnen?",
    betont: "noch bei Ihnen",
    zusatz: "Falls nicht: neues Foto machen. Geht schneller als die Ausrede.",
    thema: "pflege",
  },
  {
    kicker: "Website-Wahrheit",
    text: "In der Werkstatt fragt niemand nach der Firmenphilosophie.",
    betont: "Firmenphilosophie",
    zusatz:
      "Gefragt wird: Können Sie das, was kostet das, wann haben Sie Zeit?",
    thema: "texte",
  },
  {
    kicker: "Green Flag",
    text: "Name, Adresse, Telefon: überall gleich geschrieben.",
    betont: "überall gleich",
    zusatz:
      "Website, Google-Eintrag, Lieferwagen: Wer sich nicht widerspricht, wirkt verlässlich.",
    thema: "google",
  },
  {
    kicker: "Red Flag",
    text: "Man will antippen, und der Knopf rutscht weg.",
    betont: "rutscht weg",
    zusatz: "Wenn beim Laden alles nachrückt, landet der Daumen daneben.",
    thema: "tempo",
  },
  {
    kicker: "Kurz gesagt",
    text: "Die Website ist der Händedruck vor dem Händedruck.",
    betont: "vor dem Händedruck",
    zusatz:
      "Schlaff oder fest: Das merkt man, bevor überhaupt jemand „Moin“ sagt.",
    thema: "eindruck",
  },
  {
    kicker: "Merken",
    text: "Zugangsdaten zur eigenen Website gehören in Ihre Schublade.",
    betont: "Ihre Schublade",
    zusatz: "Nicht nur in den Kopf von jemandem, der gerade im Urlaub ist.",
    thema: "pflege",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Das Handy ist die neue Fußgängerzone.",
    betont: "neue Fußgängerzone",
    zusatz: "Wer dort kein lesbares Schaufenster hat, an dem läuft man vorbei.",
    thema: "handy",
  },
  {
    kicker: "Reminder",
    text: "Eine Anfrage von gestern ist heute schon lauwarm.",
    betont: "schon lauwarm",
    zusatz: "Am besten antworten, solange der Kunde noch weiß, was er wollte.",
    thema: "anfrage",
  },
  {
    kicker: "POV",
    text: "Drei Absätze gelesen. Der Punkt kommt immer noch nicht.",
    betont: "immer noch nicht",
    zusatz: "Am Tresen hätte ein einziger Satz gereicht.",
    thema: "texte",
  },
  {
    kicker: "Red Flag",
    text: "Unter „Über uns“ steht kein einziger Name.",
    betont: "kein einziger Name",
    zusatz: "Wem soll man da vertrauen? Menschen kaufen bei Menschen.",
    thema: "vertrauen",
  },
  {
    kicker: "Real Talk",
    text: "Dass Sie auch Notdienst machen, kann keiner erraten.",
    betont: "keiner erraten",
    zusatz:
      "Also hinschreiben, gut sichtbar. Im Notfall liest niemand zwischen den Zeilen.",
    thema: "google",
  },
  {
    kicker: "Green Flag",
    text: "Ein Menü, das man am Handy auf einen Blick versteht.",
    betont: "auf einen Blick",
    zusatz: "Wenige Punkte, klare Wörter, große Schrift. Kein Suchspiel.",
    thema: "handy",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Abends ist der Laden zu. Die Website hat Spätschicht.",
    betont: "hat Spätschicht",
    zusatz: "Auf dem Sofa wird dann gestöbert, verglichen und entschieden.",
    thema: "eindruck",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Das Video im Hintergrund beeindruckt vor allem Sie selbst.",
    betont: "Sie selbst",
    zusatz: "Ihre Besucher warten derweil auf die Öffnungszeiten.",
    thema: "tempo",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Zählen Sie mal, wie oft „wir“ auf Ihrer Startseite steht.",
    betont: "„wir“",
    zusatz: "Und dann, wie oft „Sie“. Kunden lesen am liebsten über sich.",
    thema: "texte",
  },
  {
    kicker: "Red Flag",
    text: "Ein Klick auf „Angebote“, und die Seite gibt es nicht mehr.",
    betont: "nicht mehr",
    zusatz:
      "Tote Links sind Wegweiser in eine Sackgasse. Einmal alles durchklicken hilft.",
    thema: "pflege",
  },
  {
    kicker: "Kurz gesagt",
    text: "Vorher, nachher: Zwei Fotos erklären mehr als zwei Absätze.",
    betont: "Vorher, nachher",
    zusatz:
      "Die alte Treppe, die neue Treppe. Mehr Beweis braucht gute Arbeit nicht.",
    thema: "vertrauen",
  },
  {
    kicker: "POV",
    text: "Mittagspause, Handy am Ohr, und es klingelt ins Leere.",
    betont: "ins Leere",
    zusatz:
      "Telefonzeiten gehören neben die Nummer. Auch ein ehrliches „ab Montag früh“ hilft.",
    thema: "anfrage",
  },
  {
    kicker: "Reminder",
    text: "Feiertag in Sicht? Öffnungszeiten heute schon anpassen.",
    betont: "heute schon",
    zusatz:
      "Auf der Website und im Google-Eintrag. Vor verschlossener Tür steht niemand gern.",
    thema: "google",
  },
  {
    kicker: "Mythos",
    text: "Auf Websites liest doch eh keiner die Texte.",
    betont: "eh keiner",
    zusatz: "Doch. Nur eben nicht die langweiligen.",
    thema: "texte",
  },
  {
    kicker: "Real Talk",
    text: "Die Weihnachtsgrüße stehen noch da. Es ist Mai.",
    betont: "Es ist Mai",
    zusatz: "Alte Hinweise wirken wie ein Laden, in dem niemand mehr aufräumt.",
    thema: "pflege",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Zufriedene Kundin? Heute um zwei Sätze bitten.",
    betont: "zwei Sätze",
    zusatz:
      "Wer gerade begeistert ist, sagt gern Ja. In drei Wochen ist der Moment vorbei.",
    thema: "vertrauen",
  },
  {
    kicker: "Green Flag",
    text: "Im Formular kann man ein Foto vom Schaden mitschicken.",
    betont: "Foto vom Schaden",
    zusatz: "So weiß der Betrieb schon vor dem Rückruf, worum es geht.",
    thema: "anfrage",
  },
  {
    kicker: "Hot Take",
    text: "Ihre Website ist keine Visitenkarte. Sie ist die Ladentür.",
    betont: "die Ladentür",
    zusatz: "Eine Karte steckt man ein. Durch eine Tür geht man rein.",
    thema: "eindruck",
  },
  {
    kicker: "Merken",
    text: "Stadtteil dazuschreiben. Auf der Seite, nicht nur im Kopf.",
    betont: "Stadtteil dazuschreiben",
    zusatz: "Wer „Friseur Ottensen“ sucht, soll Ottensen bei Ihnen auch lesen.",
    thema: "google",
  },
  {
    kicker: "Real Talk",
    text: "Ihr Startbild ist größer als die Geduld Ihrer Besucher.",
    betont: "die Geduld",
    zusatz: "Riesige Fotos laden ewig. Kleiner abspeichern, schneller da sein.",
    thema: "tempo",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Schon mal die eigene Website mit einer Hand bedient?",
    betont: "mit einer Hand",
    zusatz: "In der anderen hält Ihr Kunde gerade den Kaffee.",
    thema: "handy",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Kein „Aktuelles“ ist besser als ein verstaubtes.",
    betont: "ein verstaubtes",
    zusatz:
      "Was Sie nicht pflegen wollen, gehört gar nicht erst auf die Seite.",
    thema: "pflege",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Nicht jeder telefoniert gern. Nicht jeder schreibt gern.",
    betont: "schreibt gern",
    zusatz: "Bieten Sie beides an: eine Nummer und ein kurzes Formular.",
    thema: "anfrage",
  },
  {
    kicker: "Mal ehrlich",
    text: "Wann haben Sie Ihren Betrieb zuletzt selbst gegoogelt?",
    betont: "selbst gegoogelt",
    zusatz:
      "Stimmen Adresse, Nummer und Fotos? Genau das sieht Ihre Kundschaft auch.",
    thema: "google",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Der Meisterbrief hängt an der Wand, nicht in der Schublade.",
    betont: "an der Wand",
    zusatz:
      "Im Netz gilt dasselbe: Zeigen Sie, was Sie gelernt haben und können.",
    thema: "vertrauen",
  },
  {
    kicker: "Red Flag",
    text: "Am Handy ist vom Chef nur noch ein Ohr zu sehen.",
    betont: "ein Ohr",
    zusatz:
      "Fotos müssen mitschrumpfen, wenn der Bildschirm schmal wird. Sonst wird abgeschnitten.",
    thema: "handy",
  },
  {
    kicker: "Merken",
    text: "Ein Gedanke pro Absatz. Ein Absatz pro Daumenlänge.",
    betont: "pro Daumenlänge",
    zusatz: "Lange Textblöcke überfliegt man. Kurze liest man.",
    thema: "texte",
  },
  {
    kicker: "Reminder",
    text: "Die eigene Website einmal unterwegs öffnen, ohne WLAN.",
    betont: "ohne WLAN",
    zusatz:
      "So erleben Kunden sie auf dem Parkplatz vorm Baumarkt. Zählen Sie ruhig mit.",
    thema: "tempo",
  },
  {
    kicker: "POV",
    text: "Großes Schaufenster, und drin hängt nur ein Zettel.",
    betont: "nur ein Zettel",
    zusatz: "So wirkt eine Startseite ohne Fotos und ohne klare Ansage.",
    thema: "eindruck",
  },
  {
    kicker: "Hot Take",
    text: "Ein Preis auf der Seite darf ruhig jemanden abschrecken.",
    betont: "jemanden abschrecken",
    zusatz: "Wer dann anruft, weiß schon, woran er ist.",
    thema: "vertrauen",
  },
  {
    kicker: "Green Flag",
    text: "Neues Angebot im Laden, und online steht es auch schon.",
    betont: "auch schon",
    zusatz:
      "Wer Neues gleich einträgt, dem glaubt man auch den Rest der Seite.",
    thema: "pflege",
  },
  {
    kicker: "Kurz gesagt",
    text: "Ladezeit ist die Warteschlange, die keiner sieht.",
    betont: "die keiner sieht",
    zusatz:
      "Im Laden sehen Sie, wer wieder geht. Im Netz merken Sie es nicht einmal.",
    thema: "tempo",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Ein Tippfehler in der Überschrift ist wie ein Fleck am Kittel.",
    betont: "Fleck am Kittel",
    zusatz:
      "Passiert jedem. Deshalb liest noch jemand drüber, bevor die Seite online geht.",
    thema: "texte",
  },
  {
    kicker: "Real Talk",
    text: "Wer zoomen muss, ist schon halb weg.",
    betont: "halb weg",
    zusatz: "Lesbare Schrift am Handy ist das Mindeste, nicht das Extra.",
    thema: "handy",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Würden Sie nach einem Blick auf Ihre Website bei sich anrufen?",
    betont: "bei sich anrufen",
    zusatz: "Wenn Sie zögern, zögern Ihre Kunden auch.",
    thema: "eindruck",
  },
  {
    kicker: "POV",
    text: "Formular abgeschickt. Und dann: Stille.",
    betont: "Stille",
    zusatz:
      "Ein Satz wie „Wir melden uns bis morgen Mittag“ nimmt das Rätselraten.",
    thema: "anfrage",
  },
  {
    kicker: "Red Flag",
    text: "Öffnungszeiten nur als Foto vom Türschild.",
    betont: "Foto vom Türschild",
    zusatz:
      "Getippte Zeiten lassen sich lesen, kopieren und finden. Ein Foto macht es allen schwer.",
    thema: "google",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Drei Ausrufezeichen machen ein Angebot nicht besser.",
    betont: "Drei Ausrufezeichen",
    zusatz: "Wer etwas zu sagen hat, kommt mit einem Punkt aus.",
    thema: "texte",
  },
  {
    kicker: "Hot Take",
    text: "Schreiben Sie ruhig hin, was Sie nicht machen.",
    betont: "nicht machen",
    zusatz: "Wer ehrlich absagt, dem glaubt man den Rest umso mehr.",
    thema: "vertrauen",
  },
  {
    kicker: "Reminder",
    text: "Handy raus, eigene Website auf. Jetzt.",
    betont: "Jetzt",
    zusatz:
      "Am großen Bildschirm sieht jede Seite gut aus. Die ehrliche Probe ist die Hosentasche.",
    thema: "handy",
  },
  {
    kicker: "Mal ehrlich",
    text: "Findet man Ihren Eingang beim ersten Mal?",
    betont: "beim ersten Mal",
    zusatz:
      "Hinterhof, zweite Tür links: Zwei Sätze zur Anfahrt sparen den Anruf von der Straße.",
    thema: "anfrage",
  },
  {
    kicker: "Merken",
    text: "Jedes Extra auf der Seite muss mitgeladen werden.",
    betont: "mitgeladen",
    zusatz:
      "Laufschrift, Schneeflocken, Besucherzähler: weglassen und schneller sein.",
    thema: "tempo",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Ein starkes Bild schlägt jedes Bilderkarussell.",
    betont: "Ein starkes Bild",
    zusatz:
      "Bis das dritte Foto vorbeizieht, hat der Besucher längst weitergescrollt.",
    thema: "eindruck",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Kommen Nachrichten aus Ihrem Formular überhaupt an?",
    betont: "überhaupt an",
    zusatz:
      "Einmal selbst absenden und nachsehen. Manches Formular schweigt seit Monaten.",
    thema: "pflege",
  },
  {
    kicker: "Mythos",
    text: "Gute Arbeit spricht sich von allein herum.",
    betont: "von allein",
    zusatz:
      "Nicht ganz. Nach dem Tipp wird der Name gegoogelt. Was findet man da?",
    thema: "google",
  },
  {
    kicker: "Green Flag",
    text: "Adresse antippen, und die Karte geht auf.",
    betont: "Karte geht auf",
    zusatz: "So führt das Handy bis vor Ihre Ladentür.",
    thema: "handy",
  },
  {
    kicker: "Real Talk",
    text: "Kundenstimmen ohne Namen klingen schnell ausgedacht.",
    betont: "ohne Namen",
    zusatz: "Auch wenn sie stimmen. Also fragen, ob der Name dabeistehen darf.",
    thema: "vertrauen",
  },
  {
    kicker: "Merken",
    text: "„Unverbindlich“ ist das freundlichste Wort am Formular.",
    betont: "Unverbindlich",
    zusatz: "Wer weiß, dass Fragen nichts kostet, fragt eher.",
    thema: "anfrage",
  },
  {
    kicker: "Kurz gesagt",
    text: "Ein Kutter, der nie ins Dock kommt, bleibt irgendwann liegen.",
    betont: "bleibt irgendwann liegen",
    zusatz: "Updates und Sicherungen sind das Dock für Ihre Website.",
    thema: "pflege",
  },
  {
    kicker: "Reminder",
    text: "Den eigenen Text einmal laut vorlesen.",
    betont: "laut vorlesen",
    zusatz: "Wo Sie stolpern oder Luft holen müssen, stolpert Ihr Leser auch.",
    thema: "texte",
  },
  {
    kicker: "POV",
    text: "Sie suchen einen Klempner. Der Keller steht schon unter Wasser.",
    betont: "unter Wasser",
    zusatz: "Und die Seite lädt und lädt. Also rufen Sie beim Nächsten an.",
    thema: "tempo",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Auch eine Startseite darf man mal entrümpeln.",
    betont: "entrümpeln",
    zusatz:
      "Vollgestellte Läden betritt man ungern. Vollgestellte Seiten auch.",
    thema: "eindruck",
  },
  {
    kicker: "Kurz gesagt",
    text: "Erst Anruf, dann Termin, dann Angebot: Sagen Sie, wie es läuft.",
    betont: "wie es läuft",
    zusatz: "Wer den Ablauf kennt, greift leichter zum Hörer.",
    thema: "anfrage",
  },
  {
    kicker: "Hot Take",
    text: "„Machen wir, wenn es ruhiger wird“ heißt bei Websites: nie.",
    betont: "nie",
    zusatz: "Ein fester Termin im Monat hilft mehr als jeder gute Vorsatz.",
    thema: "pflege",
  },
  {
    kicker: "Green Flag",
    text: "Unter jeder Bewertung steht eine freundliche Antwort.",
    betont: "freundliche Antwort",
    zusatz: "Auch unter der kritischen. Gerade die lesen andere ganz genau.",
    thema: "vertrauen",
  },
  {
    kicker: "Red Flag",
    text: "Die Speisekarte gibt es nur als Datei zum Herunterladen.",
    betont: "nur als Datei",
    zusatz:
      "Am Handy wird daraus Geduldsarbeit. Als normale Seite ist sie sofort lesbar.",
    thema: "handy",
  },
  {
    kicker: "Mythos",
    text: "Eine schöne Seite darf ruhig etwas länger laden.",
    betont: "etwas länger",
    zusatz: "Darf sie nicht. Schön ist, was da ist, bevor man aufgibt.",
    thema: "tempo",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Man sieht einer Website ihr Alter an. Wie einer Tapete.",
    betont: "Wie einer Tapete",
    zusatz: "Und von der Tapete schließen Besucher auf den ganzen Betrieb.",
    thema: "eindruck",
  },
  {
    kicker: "Mal ehrlich",
    text: "Sagt bei Ihnen am Tresen jemand „Wir leben Qualität“?",
    betont: "Wir leben Qualität",
    zusatz: "Eben. Dann hat der Satz auch auf der Website nichts verloren.",
    thema: "texte",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Niemand sucht nach „Wir machen alles“.",
    betont: "Wir machen alles",
    zusatz:
      "Gesucht wird „Rohrbruch“ oder „Bad sanieren“. Schreiben Sie hin, was Sie konkret tun.",
    thema: "google",
  },
];

import type { Spruch } from "@/lib/sprueche-data";

/**
 * Zusatz-Posts: Zu jedem Tag gehören neben dem Spruch des Tages zwei
 * weitere Karten. Sie erscheinen nur im Story-Studio (/admin/story),
 * nicht auf der öffentlichen Journalseite.
 *
 * Karte 0 und 1 gehören zum ersten Tag (lib/sprueche-data.ts), Karte 2
 * und 3 zum Tag danach und so weiter. Wie in lib/sprueche-liste.ts gilt:
 * neue Karten NUR UNTEN ANHÄNGEN, immer paarweise, nie umsortieren oder
 * löschen. Es gelten dieselben Regeln (tests/sprueche.test.ts); kein
 * Gedanke darf schon in einer der beiden Listen stehen.
 */
export const SPRUECHE_EXTRA: Spruch[] = [
  {
    kicker: "Website-Wahrheit",
    text: "Knöpfe brauchen Tätigkeitswörter.",
    betont: "Tätigkeitswörter",
    zusatz: "„Termin anfragen“ sagt, was passiert. „Mehr“ sagt nichts.",
    thema: "texte",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Breite Tabellen sind am Handy selten eine gute Idee.",
    betont: "selten eine gute Idee",
    zusatz:
      "Als einfache Liste liest sich die Preisübersicht, ohne zu schieben.",
    thema: "handy",
  },
  {
    kicker: "Red Flag",
    text: "Ein Begrüßungsfilm, den man nicht überspringen kann.",
    betont: "nicht überspringen",
    zusatz:
      "Besucher wollen zur Sache. Den Film schauen sie später, wenn überhaupt.",
    thema: "tempo",
  },
  {
    kicker: "Kurz gesagt",
    text: "Ein Siegel ersetzt kein Gesicht.",
    betont: "kein Gesicht",
    zusatz:
      "Abzeichen in der Fußzeile überfliegt man. Den Menschen dahinter merkt man sich.",
    thema: "vertrauen",
  },
  {
    kicker: "Green Flag",
    text: "Die Antwort auf die häufigste Frage steht schon da.",
    betont: "steht schon da",
    zusatz:
      "Parkplätze, Kartenzahlung, Wartezeit: Was oft gefragt wird, gehört auf die Seite.",
    thema: "texte",
  },
  {
    kicker: "Mal ehrlich",
    text: "Bis wohin fahren Sie eigentlich raus?",
    betont: "raus",
    zusatz:
      "Das Einsatzgebiet gehört auf die Seite. Sonst klärt sich das erst am Telefon.",
    thema: "google",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Im Netz gibt es keinen Wartebereich.",
    betont: "keinen Wartebereich",
    zusatz: "Was sofort da ist, wird gelesen. Was lädt, wird weggewischt.",
    thema: "tempo",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Auch die Abwesenheitsnotiz ist Kundenservice.",
    betont: "Abwesenheitsnotiz",
    zusatz: "Bis wann sind Sie weg, wer hilft so lange? Zwei Sätze genügen.",
    thema: "anfrage",
  },
  {
    kicker: "Kurz gesagt",
    text: "Die Startseite ist der Tresen, nicht das Lager.",
    betont: "nicht das Lager",
    zusatz:
      "Vorn liegt, was oft gefragt wird. Der Rest hat hinten seinen Platz.",
    thema: "eindruck",
  },
  {
    kicker: "POV",
    text: "Sonne auf dem Bildschirm, und der Knopf hat kaum Farbe.",
    betont: "kaum Farbe",
    zusatz:
      "Draußen zählt Kontrast. Was im Büro dezent wirkt, verschwindet im Tageslicht.",
    thema: "handy",
  },
  {
    kicker: "Merken",
    text: "Fragen, die Kunden stellen, sind Überschriften, die noch fehlen.",
    betont: "Überschriften",
    zusatz:
      "„Was kostet ein Ölwechsel?“ gehört als Zeile auf die Seite, samt ehrlicher Antwort.",
    thema: "google",
  },
  {
    kicker: "Real Talk",
    text: "„Wir freuen uns auf Ihre Nachricht“ reicht nicht als Einladung.",
    betont: "reicht nicht",
    zusatz:
      "Sagen Sie, was man schicken soll: Maße, Fotos, Wunschtermin. Das macht den Anfang leicht.",
    thema: "anfrage",
  },
  {
    kicker: "Real Talk",
    text: "„Familienbetrieb“ steht da. Die Familie sieht man nirgends.",
    betont: "sieht man nirgends",
    zusatz:
      "Ein Foto am Küchentisch oder in der Werkstatt, und das Wort bekommt ein Gesicht.",
    thema: "vertrauen",
  },
  {
    kicker: "Mythos",
    text: "Am Handy schaut man nur kurz. Angefragt wird am Rechner.",
    betont: "nur kurz",
    zusatz:
      "Angefragt wird, wo man gerade ist. Oft eben auf dem Sofa, mit dem Handy.",
    thema: "handy",
  },
  {
    kicker: "Merken",
    text: "Jede Leistung verdient ihre eigene Überschrift.",
    betont: "eigene Überschrift",
    zusatz:
      "„Heizung warten“ und „Bad sanieren“ sind zwei Anliegen. Also auch zwei Abschnitte.",
    thema: "google",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Erkennt man auf der Website Ihren Laden wieder?",
    betont: "Ihren Laden",
    zusatz:
      "Gleiche Farben, gleicher Ton, gleiche Gesichter wie vor Ort. Dann wirkt es echt.",
    thema: "eindruck",
  },
  {
    kicker: "Hot Take",
    text: "Eine Baustelle im Bild sagt mehr als das Wort „Erfahrung“.",
    betont: "Baustelle im Bild",
    zusatz:
      "Zeigen Sie, woran Sie gerade arbeiten. Ehrlicher wird kein Lebenslauf.",
    thema: "vertrauen",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Fotos im Google-Eintrag altern schneller als der Laden.",
    betont: "altern schneller",
    zusatz: "Neue Fassade, neues Schild, neue Theke? Dann auch neue Bilder.",
    thema: "google",
  },
  {
    kicker: "Red Flag",
    text: "Die Landkarte lädt, bevor jemand nach dem Weg gefragt hat.",
    betont: "Die Landkarte",
    zusatz: "Ein Bild mit Link zur Karte reicht oft und ist sofort da.",
    thema: "tempo",
  },
  {
    kicker: "POV",
    text: "Seite geöffnet. Fünf Farben, vier Schriften, keine Ruhe.",
    betont: "keine Ruhe",
    zusatz: "Zwei Farben und eine Schrift wirken ruhiger als jedes Feuerwerk.",
    thema: "eindruck",
  },
  {
    kicker: "Red Flag",
    text: "Der wichtigste Satz steht in hellgrauer Schrift.",
    betont: "hellgrauer Schrift",
    zusatz: "Zart sieht edel aus. Lesbar wird es erst mit Kontrast.",
    thema: "texte",
  },
  {
    kicker: "Reminder",
    text: "Vertretung im Urlaub? Auch für die Website festlegen.",
    betont: "für die Website",
    zusatz: "Wer schaut ins Postfach, wer ändert die Zeiten? Ein Name genügt.",
    thema: "pflege",
  },
  {
    kicker: "Red Flag",
    text: "Unten auf der Seite steht ein Jahr, das längst vorbei ist.",
    betont: "längst vorbei",
    zusatz:
      "Kleines Detail, große Wirkung: Es sieht aus, als wäre niemand mehr da.",
    thema: "pflege",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Vertrauen beginnt in der Adresszeile.",
    betont: "in der Adresszeile",
    zusatz:
      "Das kleine Schloss dort zeigt: Was man eintippt, wird verschlüsselt übertragen.",
    thema: "vertrauen",
  },
  {
    kicker: "Mythos",
    text: "Hauptsache, die Seite sieht modern aus.",
    betont: "modern",
    zusatz:
      "Hauptsache, sie ist klar. Moden wechseln, ein verständliches Angebot bleibt.",
    thema: "eindruck",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Die Chronik seit der Gründung gehört nicht nach ganz oben.",
    betont: "nicht nach ganz oben",
    zusatz:
      "Erst das Angebot, dann die Geschichte. Wer bleibt, liest sie gern.",
    thema: "texte",
  },
  {
    kicker: "Mythos",
    text: "Schnelle Seiten sehen immer schlicht aus.",
    betont: "immer schlicht",
    zusatz: "Nein. Schnell heißt aufgeräumt gebaut, nicht kahl gestaltet.",
    thema: "tempo",
  },
  {
    kicker: "Red Flag",
    text: "Ein Logo so groß, dass für das Angebot kein Platz bleibt.",
    betont: "kein Platz",
    zusatz:
      "Besucher kommen wegen der Leistung. Das Logo merken sie sich nebenbei.",
    thema: "eindruck",
  },
  {
    kicker: "Merken",
    text: "Eine ehrliche Wartezeit wirkt stärker als ein großes Versprechen.",
    betont: "ehrliche Wartezeit",
    zusatz: "„Zurzeit drei Wochen Vorlauf“ glaubt man sofort. Und plant damit.",
    thema: "vertrauen",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Abkürzungen kennt nur, wer sie täglich benutzt.",
    betont: "täglich benutzt",
    zusatz: "Einmal ausschreiben, und auch Neukunden kommen mit.",
    thema: "texte",
  },
  {
    kicker: "Kurz gesagt",
    text: "Ein Rückruf-Knopf ist die Klingel am Empfang.",
    betont: "Klingel am Empfang",
    zusatz:
      "Nummer eintragen, Wunschzeit wählen, fertig. Sie rufen an, wenn es passt.",
    thema: "anfrage",
  },
  {
    kicker: "Green Flag",
    text: "Erst kommt der Text, dann kommen die Bilder.",
    betont: "Erst kommt der Text",
    zusatz: "Wer schon lesen kann, wartet gern auf das Foto dahinter.",
    thema: "tempo",
  },
  {
    kicker: "Red Flag",
    text: "Zum Lesen muss man das Handy quer halten.",
    betont: "quer halten",
    zusatz:
      "Die Seite soll sich dem Bildschirm anpassen, nicht der Mensch der Seite.",
    thema: "handy",
  },
  {
    kicker: "Unpopular Opinion",
    text: "Eine Website ist kein Projekt. Sie ist ein Dauerauftrag.",
    betont: "ein Dauerauftrag",
    zusatz:
      "Fertig wird sie nie. Gut bleibt sie nur, wenn regelmäßig jemand hinschaut.",
    thema: "pflege",
  },
  {
    kicker: "Green Flag",
    text: "Einen Termin kann man gleich online aussuchen.",
    betont: "gleich online",
    zusatz: "Kein Hin und Her am Telefon. Der Kalender zeigt, was frei ist.",
    thema: "anfrage",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Öffnet sich Ihre Seite schneller als Ihre Ladentür?",
    betont: "Ihre Ladentür",
    zusatz:
      "Wenn nicht, lohnt ein Blick auf Bilder und Extras. Dort klemmt es meistens.",
    thema: "tempo",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Passt Ihre Überschrift am Handy in zwei Zeilen?",
    betont: "in zwei Zeilen",
    zusatz:
      "Was am Rechner eine Zeile füllt, wird am Handy schnell ein ganzer Absatz.",
    thema: "handy",
  },
  {
    kicker: "Green Flag",
    text: "Auf den Fotos trägt das Team die Kleidung von der Arbeit.",
    betont: "von der Arbeit",
    zusatz: "Blaumann statt Anzug: Man sieht, wer wirklich anpackt.",
    thema: "vertrauen",
  },
  {
    kicker: "Mal ehrlich",
    text: "Würden Sie Ihre Referenzen anrufen lassen?",
    betont: "anrufen lassen",
    zusatz: "Zeigen Sie Arbeiten, hinter denen auch Ihre Kunden stehen.",
    thema: "vertrauen",
  },
  {
    kicker: "POV",
    text: "Anfrage getippt, Absenden gedrückt, und alles ist wieder leer.",
    betont: "wieder leer",
    zusatz:
      "Eine Fehlermeldung muss sagen, was fehlt. Und das Getippte muss stehen bleiben.",
    thema: "anfrage",
  },
  {
    kicker: "Green Flag",
    text: "Das Titelbild zeigt Ihre Arbeit, nicht irgendeine Skyline.",
    betont: "Ihre Arbeit",
    zusatz: "Ein Blick, und man weiß, in welchem Gewerk man gelandet ist.",
    thema: "eindruck",
  },
  {
    kicker: "Mal ehrlich",
    text: "Wann haben Sie zuletzt jede Unterseite selbst gelesen?",
    betont: "jede Unterseite",
    zusatz:
      "Einmal im Jahr von vorn bis hinten. Dabei findet man, was nicht mehr stimmt.",
    thema: "pflege",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Ein Aufklappmenü ist kein Versteck.",
    betont: "kein Versteck",
    zusatz:
      "Anrufen, Öffnungszeiten, Anfahrt: Das Wichtige darf auch am Handy sichtbar bleiben.",
    thema: "handy",
  },
  {
    kicker: "Merken",
    text: "Eine gute Anfrage beginnt mit einer guten Frage von Ihnen.",
    betont: "guten Frage",
    zusatz:
      "„Was soll gemacht werden und bis wann?“ lenkt mehr als ein leeres Feld.",
    thema: "anfrage",
  },
  {
    kicker: "Hot Take",
    text: "Ihre Startseite muss nicht alles zeigen. Nur den Weg.",
    betont: "Nur den Weg",
    zusatz:
      "Wer gleich sieht, wohin es geht, bleibt. Der Rest steht auf den Unterseiten.",
    thema: "eindruck",
  },
  {
    kicker: "Green Flag",
    text: "Der wichtigste Knopf liegt da, wo der Daumen ist.",
    betont: "wo der Daumen ist",
    zusatz:
      "Unten und groß genug. Bis in die obere Ecke streckt sich niemand gern.",
    thema: "handy",
  },
  {
    kicker: "Kurz gesagt",
    text: "Verben verkaufen. Hauptwörter verwalten.",
    betont: "Hauptwörter verwalten",
    zusatz:
      "„Wir reparieren Ihr Dach“ schlägt „Durchführung von Dachreparaturen“.",
    thema: "texte",
  },
  {
    kicker: "Red Flag",
    text: "Zwei Einträge für denselben Betrieb, beide halb ausgefüllt.",
    betont: "beide halb ausgefüllt",
    zusatz: "Einer, vollständig und gepflegt, hilft mehr als zwei mit Lücken.",
    thema: "google",
  },
  {
    kicker: "Merken",
    text: "Eine Sicherung, die niemand ausprobiert hat, ist nur eine Hoffnung.",
    betont: "nur eine Hoffnung",
    zusatz:
      "Einmal im Jahr zurückspielen und nachsehen, ob wirklich alles da ist.",
    thema: "pflege",
  },
  {
    kicker: "Mal ehrlich",
    text: "Versteht Ihre Oma, was Sie online anbieten?",
    betont: "Ihre Oma",
    zusatz:
      "Wenn ja, kommt auch Ihre Kundschaft mit. Fachwörter dürfen in der Werkstatt bleiben.",
    thema: "texte",
  },
  {
    kicker: "Green Flag",
    text: "Die Antwort auf die Anfrage unterschreibt ein Mensch mit Namen.",
    betont: "mit Namen",
    zusatz:
      "Mit „Ihr Serviceteam“ redet man nicht gern. Mit einer Person schon.",
    thema: "anfrage",
  },
  {
    kicker: "Kurz gesagt",
    text: "Eine Website altert leise.",
    betont: "leise",
    zusatz:
      "Kein Knall, kein Alarm. Irgendwann stimmt nur nichts mehr. Deshalb regelmäßig nachsehen.",
    thema: "pflege",
  },
  {
    kicker: "Website-Wahrheit",
    text: "Weißer Raum ist kein verschenkter Platz.",
    betont: "kein verschenkter Platz",
    zusatz: "Er lässt dem Wichtigen Luft. Wie ein aufgeräumter Verkaufstisch.",
    thema: "eindruck",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Steht Ihr Betrieb auch dort, wo man nach dem Weg sucht?",
    betont: "nach dem Weg",
    zusatz:
      "Kartendienste sind für viele der erste Blick. Ein gepflegter Eintrag lohnt sich.",
    thema: "google",
  },
  {
    kicker: "Merken",
    text: "Ein Beispiel erklärt mehr als drei Eigenschaftswörter.",
    betont: "Ein Beispiel",
    zusatz:
      "„Küche in vier Tagen eingebaut“ sagt mehr als „schnell und sauber“.",
    thema: "texte",
  },
  {
    kicker: "Kleiner Reminder",
    text: "Eine Schrift reicht. Zwei sind schon Luxus.",
    betont: "Eine Schrift reicht",
    zusatz:
      "Jede weitere Schriftart muss geladen werden und macht das Bild unruhiger.",
    thema: "tempo",
  },
  {
    kicker: "Hand aufs Herz",
    text: "Wer bezahlt eigentlich die Rechnung für Ihre Internetadresse?",
    betont: "die Rechnung",
    zusatz:
      "Läuft die Adresse aus, ist die Website weg. Zuständigkeit jetzt klären.",
    thema: "pflege",
  },
  {
    kicker: "Red Flag",
    text: "Im Netz steht noch die alte Adresse.",
    betont: "die alte Adresse",
    zusatz:
      "Nach dem Umzug alle Einträge durchgehen: Website, Karten, Verzeichnisse.",
    thema: "google",
  },
  {
    kicker: "Red Flag",
    text: "„Seit vielen Jahren“, und nirgends steht, seit wann.",
    betont: "seit wann",
    zusatz: "Ein genaues Gründungsjahr wirkt stärker als jedes „langjährig“.",
    thema: "vertrauen",
  },
  {
    kicker: "Green Flag",
    text: "Die Preisliste online ist dieselbe wie an der Kasse.",
    betont: "dieselbe",
    zusatz:
      "Wer online den alten Preis liest und vor Ort den neuen hört, ist verstimmt.",
    thema: "pflege",
  },
];

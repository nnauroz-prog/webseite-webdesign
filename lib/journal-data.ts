/**
 * Journal-Datenmodell für /journal und /journal/[slug].
 *
 * Jeder Beitrag ist ein kurzer Text mit einer klaren Aussage: was wir
 * beobachten, wie wir arbeiten, was Inhaber daraus machen können.
 * Keine erfundenen Kunden, keine unbelegten Zahlen, keine Statistiken.
 * Preise und Leistungen kommen aus lib/pakete-data.ts.
 *
 * Form pro Beitrag: drei bis fünf Zwischenüberschriften und ein
 * Schluss-Zitat.
 *
 * Reihenfolge im Array bestimmt Reihenfolge auf /journal — neuester
 * Post nach oben.
 */

export type Paragraph =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "li"; text: string };

export type JournalPost = {
  slug: string;
  title: string;
  /** Titel für Google und Browser-Tab: mit dem Suchbegriff, den Leser
   *  eintippen. Die Überschrift auf der Seite (title) bleibt. */
  seoTitle?: string;
  /** Untertitel als Dek — eine Zeile Kontext. */
  dek: string;
  /** Beschreibung für Google, wenn der Dek dafür zu kurz ist (120–158 Zeichen). */
  seoDescription?: string;
  /** ISO-Datum, yyyy-mm-dd, Veröffentlichung. */
  publishedAt: string;
  /** Geschätzte Lesezeit in Minuten — manuell gepflegt. */
  readingMinutes: number;
  /** Tag-Slugs für spätere Filter; aktuell rein deskriptiv. */
  tags: string[];
  /** Hauptinhalt als geordnetes Array von Absätzen. */
  body: Paragraph[];
};

const POSTS: JournalPost[] = [
  {
    slug: "die-zweite-frage",
    seoTitle: "Erstgespräch beim Webdesigner: Was Anrufer fragen",
    title: "Die zweite Frage",
    dek: "Was Anrufer im Erstgespräch eigentlich wissen wollen, und warum sie zuerst nach dem Preis fragen.",
    publishedAt: "2026-06-15",
    readingMinutes: 4,
    tags: ["Beratung", "Sprechstunde", "Erstgespräch"],
    body: [
      {
        kind: "p",
        text: "Im Erstgespräch kommt zuerst meist die Frage, die man eben stellt. Was kostet eine Website? Wie lange dauert das? Machen Sie auch SEO? Diese Fragen sind berechtigt. Der Grund für den Anruf sind sie selten.",
      },
      {
        kind: "p",
        text: "Der eigentliche Grund kommt oft erst ein paar Minuten später. Er ist kleiner als die erste Frage und gleichzeitig dringender.",
      },
      {
        kind: "h2",
        text: "Wie so eine zweite Frage klingt",
      },
      {
        kind: "p",
        text: "Angenommen, eine Schneiderei fragt nach dem Preis einer neuen Website. Ein paar Sätze später zeigt sich: Die alte Baukasten-Seite hat ein Verwandter gebaut, der nicht mehr erreichbar ist. Das Passwort ist weg, und auf der Startseite steht seit Monaten die Sommerkollektion. Die eigentliche Frage lautet: Wie bekomme ich meine Seite wieder in die Hand?",
      },
      {
        kind: "p",
        text: "Oder ein Pflegedienst fragt, ob wir SEO machen. Dahinter steckt eine schlechte Google-Bewertung von jemandem, der nie Kunde war. Die eigentliche Frage lautet: Wie antworte ich darauf, ohne mir Ärger einzuhandeln?",
      },
      {
        kind: "h2",
        text: "Warum zuerst nach dem Preis gefragt wird",
      },
      {
        kind: "p",
        text: "Wer bei einem fremden Anbieter anruft, beginnt mit dem, was man üblicherweise fragt. Preis, Dauer und Leistungen sind ein sicherer Einstieg. Erst wenn das Gespräch angenehm läuft, kommt das, was einen wirklich beschäftigt.",
      },
      {
        kind: "p",
        text: "Wir beantworten die erste Frage deshalb kurz und lassen danach Platz für die zweite.",
      },
      {
        kind: "h2",
        text: "Wie das am Telefon aussieht",
      },
      {
        kind: "p",
        text: "Auf die Preisfrage antworten wir in einem Satz: Starter ab 499\u00A0€, Business ab 899\u00A0€, Premium ab 2.499\u00A0€, Studio ab 3.490\u00A0€, den genauen Festpreis bekommen Sie schriftlich. Dann machen wir eine Pause. In dieser Pause kommt oft die zweite Frage.",
      },
      {
        kind: "p",
        text: "Gegenfragen wie „Was ist Ihnen wichtiger, Tempo oder Preis?“ stellen wir nicht. Solche Fragen kennt jeder aus Verkaufsgesprächen, und sie helfen niemandem weiter.",
      },
      {
        kind: "h2",
        text: "Warum wir das aufschreiben",
      },
      {
        kind: "p",
        text: "Für solche Fragen gibt es unsere Sprechstunde: jeden ersten Donnerstag im Monat von 17 bis 18:30 Uhr am Telefon. Eine Anmeldung brauchen Sie nicht, und Sie müssen weder ein Vorhaben beschreiben noch ein Budget nennen. Je niedriger die Schwelle, desto früher kommt die Frage, um die es eigentlich geht.",
      },
      {
        kind: "quote",
        text: "Oft ist die zweite Frage der eigentliche Grund für den Anruf.",
      },
    ],
  },
  {
    slug: "wann-eine-website-warten-kann",
    seoTitle: "Neue Website jetzt oder später? Wann es warten kann",
    title: "Wann eine Website warten kann",
    dek: "Drei Fälle, in denen wir raten, mit der eigenen Website noch zu warten.",
    seoDescription:
      "Drei Fälle, in denen wir raten, mit der Website noch zu warten: Das Geschäft steht noch nicht, Instagram ist der Vertriebskanal oder die Saison läuft.",
    publishedAt: "2026-06-12",
    readingMinutes: 4,
    tags: ["Beratung", "Entscheidung", "Lokales Geschäft"],
    body: [
      {
        kind: "p",
        text: "Von einer Webdesign-Firma erwartet man diesen Satz nicht: Manchmal sollte eine eigene Website nicht das Erste sein. Wenn wir so einen Fall vor uns haben, sagen wir das im Erstgespräch, auch wenn dabei kein Auftrag herauskommt. Drei Fälle sind typisch.",
      },
      {
        kind: "h2",
        text: "Wenn das Geschäft selbst noch nicht steht",
      },
      {
        kind: "p",
        text: "Jemand hat eine gute Geschäftsidee, aber noch keinen ersten Kunden. Die Website scheint der erste Schritt zu sein. Wir halten sie für den dritten. Zuerst muss klar sein, was Sie genau anbieten und für wen. Danach kommen die ersten Gespräche mit Interessenten, in denen Sie merken, welche Begriffe verstanden werden. Erst dann lohnt sich eine Website, die genau diese Begriffe verwendet.",
      },
      {
        kind: "p",
        text: "Wer es umgekehrt macht, baut eine Seite für eine Vorstellung vom Geschäft. Nach ein paar Monaten zeigt sich, dass die ersten Kunden anders sind als gedacht, und die Texte müssen neu geschrieben werden. Dann bezahlen Sie Zeit und Geld zweimal.",
      },
      {
        kind: "h2",
        text: "Wenn Instagram der Vertriebskanal ist",
      },
      {
        kind: "p",
        text: "Manche lokalen Betriebe verkaufen vor allem über Instagram. Eine Konditorei kündigt den Sonntagskuchen am Donnerstag in der Story an. Ein Tattoostudio vergibt Termine per Direktnachricht.",
      },
      {
        kind: "p",
        text: "Eine aufwendige Website kostet dann Aufmerksamkeit, die beim eigentlichen Vertriebskanal fehlt. Wir empfehlen in so einem Fall eine schlichte Visitenkarten-Seite mit Adresse, Öffnungszeiten und einem Link zum Profil. Die übrige Zeit gehört dem Kanal, über den die Anfragen kommen.",
      },
      {
        kind: "h2",
        text: "Wenn die Saison gerade läuft",
      },
      {
        kind: "p",
        text: "Eine Eisdiele im April, ein Stand auf dem Weihnachtsmarkt im November, ein Skiverleih im Januar: Wer mitten in der Saison anfragt, hat neben dem Tagesgeschäft kaum Zeit. Stichpunkte für die Texte schicken, Fotos aussuchen und den Test-Link durchsehen braucht aber ein paar ruhige Stunden.",
      },
      {
        kind: "p",
        text: "Wir raten dann, auf die ruhigere Zeit zu warten. Eine Seite, die kurz vor dem Ansturm ungeprüft online geht, macht im Hochbetrieb Ärger, etwa wenn das Kontaktformular nicht funktioniert. Und genau dann hat niemand Zeit, sich darum zu kümmern.",
      },
      {
        kind: "h2",
        text: "Warum wir das schreiben",
      },
      {
        kind: "p",
        text: "Wenn wir von einem Auftrag abraten, verdienen wir an diesem Tag nichts. Wir halten es trotzdem für richtig. Wer gut beraten wurde, ruft wieder an, wenn der Zeitpunkt passt.",
      },
      {
        kind: "quote",
        text: "Zu einer guten Beratung gehört auch der Satz: Warten Sie damit noch.",
      },
    ],
  },
  {
    slug: "der-preis-einer-website",
    seoTitle: "Website-Festpreis: Wie unsere Preise entstehen",
    title: "Der Preis, einmal offen hingelegt",
    dek: "Was eine Website kostet, wie unsere Preise entstehen und welcher Posten in vielen Angeboten fehlt.",
    publishedAt: "2026-06-08",
    readingMinutes: 4,
    tags: ["Preise", "Transparenz", "Entscheidung"],
    body: [
      {
        kind: "p",
        text: "Über Website-Preise erfährt man oft erst etwas, wenn man anfragt. Agenturen schreiben Angebote, Freelancer schätzen nach Aufwand, und Baukästen werben mit null Euro und meinen den Einstieg. Unsere Preise stehen auf der Website. Hier erklären wir, wie sie zustande kommen.",
      },
      {
        kind: "h2",
        text: "Was andere Wege kosten",
      },
      {
        kind: "p",
        text: "Eine Website für einen kleinen Betrieb kostet bei einer Agentur meist ab etwa 5.000\u00A0€. Freelancer liegen oft zwischen 800 und 5.000\u00A0€. Ein Baukasten kostet etwa 10 bis 40\u00A0€ im Monat. Dazu kommt Ihre eigene Zeit für Gestaltung, Texte und Technik. Sie steht in keiner Rechnung, fällt aber trotzdem an, meist abends und am Wochenende.",
      },
      {
        kind: "p",
        text: "Unsere Pakete beginnen bei 499\u00A0€ für eine einzelne Seite. Business kostet ab 899\u00A0€, Premium mit Bereichen, die Sie selbst pflegen, ab 2.499\u00A0€ und Studio mit eigener Gestaltung ab 3.490\u00A0€.",
      },
      {
        kind: "h2",
        text: "Wie unser Preis entsteht",
      },
      {
        kind: "p",
        text: "Für eine Starter-Seite rechnen wir mit etwa fünf Arbeitsstunden: eine für den Seitenplan und die Sichtung Ihrer Unterlagen, zwei für den Bau, eine für Bilder und Tests auf echten Handys und eine für Hosting, Domain und SSL. Dazu kommen Werkzeuge und Lizenzen. Wer deutlich weniger verlangt, spart meist an einer dieser Stellen, oft beim Testen. Das merken Sie erst Monate später.",
      },
      {
        kind: "h2",
        text: "Der Posten, der oft fehlt",
      },
      {
        kind: "p",
        text: "Der größte Unterschied zwischen zwei Angeboten liegt selten im Einmalpreis. Er liegt in dem, was danach kommt: Sicherheits-Updates, Backups, das SSL-Zertifikat und die kleine Änderung im November, wenn sich die Öffnungszeiten ändern. In vielen Angeboten ist dafür nichts vorgesehen. Dann veraltet die Seite vom ersten Tag an.",
      },
      {
        kind: "p",
        text: "Unser Monatsbeitrag ab 49\u00A0€ deckt genau diesen Posten ab, und er steht im Angebot. Darin sind Hosting in der EU, Updates, Backups und je nach Paket eine bis zehn kleine Änderungen pro Monat enthalten.",
      },
      {
        kind: "h2",
        text: "Wie Sie Angebote vergleichen",
      },
      {
        kind: "p",
        text: "Vergleichen Sie Angebote nicht nur am Einmalpreis. Fragen Sie, was das dritte Jahr kostet, wenn alles eingerechnet ist. Fragen Sie, wem die Seite am Ende gehört. Und fragen Sie, wer ans Telefon geht, wenn das Kontaktformular an einem Freitagnachmittag nicht funktioniert.",
      },
      {
        kind: "quote",
        text: "Einen Preis, den man erklären kann, muss man nicht verteidigen.",
      },
    ],
  },
  {
    slug: "warum-wir-keine-mockups-zeigen",
    seoTitle: "Test-Link statt Entwurfsbild: Warum wir echt bauen",
    title: "Das Echte zuerst",
    dek: "Warum wir statt eines Entwurfsbilds gleich eine Seite bauen, die Sie auf dem Handy öffnen können.",
    publishedAt: "2026-06-05",
    readingMinutes: 3,
    tags: ["Arbeitsweise", "Test-Link", "Transparenz"],
    body: [
      {
        kind: "p",
        text: "Viele Webprojekte beginnen mit einem Entwurfsbild. Es ist sorgfältig zusammengestellt, mit passendem Beispieltext und Fotos, die später niemand liefert. Wochen später geht eine Seite online, die dem Bild nur noch ähnlich sieht. Wir fangen anders an: Statt eines Bildes bekommen Sie einen Test-Link.",
      },
      {
        kind: "h2",
        text: "Was ein Entwurfsbild nicht zeigt",
      },
      {
        kind: "p",
        text: "Ein Entwurfsbild zeigt eine Seite im besten Moment. Die Bildausschnitte passen, jeder Text hat genau die richtige Länge, und der Bildschirm hat genau eine Breite. Es zeigt nicht, wie schnell die Seite lädt, wie sie auf einem drei Jahre alten Android-Handy umbricht oder was passiert, wenn eine Überschrift zwei Wörter länger ist.",
      },
      {
        kind: "p",
        text: "Gerade diese Punkte entscheiden aber, ob eine Seite im Alltag funktioniert. Wer ein Entwurfsbild freigibt, gibt eine Absicht frei und noch keine Website.",
      },
      {
        kind: "h2",
        text: "Wie es bei uns läuft",
      },
      {
        kind: "p",
        text: "Wir bauen von Anfang an die echte Seite. Nach wenigen Tagen schicken wir Ihnen einen Link zu einer Vorschau mit Ihren Inhalten. Sie öffnen sie auf Ihrem eigenen Handy und können sie an Familie, Mitarbeiter oder Ihren Steuerberater weiterleiten. Was Sie dort sehen, geht so online.",
      },
      {
        kind: "p",
        text: "Änderungswünsche besprechen wir an dieser Vorschau. Der Knopf soll größer werden, die Reihenfolge anders, ein Foto soll raus: Jede Korrektur sehen Sie meist am nächsten Tag unter demselben Link.",
      },
      {
        kind: "h2",
        text: "Was das von Ihnen verlangt",
      },
      {
        kind: "p",
        text: "Diese Arbeitsweise funktioniert nur mit echten Inhalten. Ein Entwurfsbild lässt sich mit Blindtext füllen, eine echte Seite nicht. Deshalb brauchen wir am Anfang Ihr Logo, ein paar Stichpunkte und Fotos, gern vom Handy. Den Text formulieren wir daraus. Fehlt etwas, sagen wir Ihnen genau, was wir noch brauchen, statt mit Platzhaltern zu bauen.",
      },
      {
        kind: "quote",
        text: "Was Sie auf dem Test-Link freigeben, geht genau so online.",
      },
    ],
  },
  {
    slug: "cafe-website-hamburg-2026",
    seoTitle: "Café-Website: Was Gäste am Handy zuerst suchen",
    title: "Die paar Sekunden vor der Tür",
    dek: "Was ein Gast vor einem Hamburger Café auf dem Handy sucht, und was eine Café-Website deshalb oben zeigen sollte.",
    publishedAt: "2026-06-01",
    readingMinutes: 4,
    tags: ["Gastronomie", "Gefunden werden", "Handy"],
    body: [
      {
        kind: "p",
        text: "Ein Gast steht vor Ihrem Café und schaut kurz aufs Handy. Danach geht er hinein oder weiter. In diesen Sekunden zählt nicht die Gestaltung der Website, sondern ob er findet, was er sucht.",
      },
      {
        kind: "p",
        text: "Gesucht wird in diesem Moment fast immer dasselbe: drei Antworten.",
      },
      {
        kind: "h2",
        text: "Drei Fragen vor der Tür",
      },
      {
        kind: "p",
        text: "Erstens: Ist heute geöffnet? Gemeint ist nicht „Montag bis Freitag 9 bis 18 Uhr“, sondern heute, jetzt, ja oder nein. Zweitens: Was gibt es, und was kostet es? Gemeint ist eine Karte, die man auf dem Handy lesen kann, und kein PDF mit dem Druckstand von 2021. Drittens: Wie komme ich hin? Dafür braucht es die Adresse, eine Telefonnummer zum Antippen und einen Knopf für den Routenplaner.",
      },
      {
        kind: "p",
        text: "Stehen diese Antworten nicht oben auf der Seite, geht der Gast oft einfach nebenan. In keiner Auswertung taucht das auf, weil niemand zählt, wer nicht hereinkommt.",
      },
      {
        kind: "h2",
        text: "Das Problem mit der PDF-Karte",
      },
      {
        kind: "p",
        text: "Die Speisekarte als PDF ist verständlich. Jemand im Team kann sie in Word ändern und neu hochladen. Auf dem Handy ist sie aber unpraktisch. Sie lädt bei schlechtem Empfang langsam, man muss mit zwei Fingern hineinzoomen, und in den Suchergebnissen erscheint sie als einzelne Datei statt als Teil Ihrer Seite.",
      },
      {
        kind: "p",
        text: "Eine Karte als normale Webseite mit Abschnitten für Frühstück, Mittagstisch, Kuchen und Getränke richten wir in etwa einer Stunde ein. Änderungen schicken Sie uns als kleine Änderung im Monatsbeitrag, mit Premium tragen Sie sie selbst ein. Bei Cafés fangen wir mit der Karte an, die Gestaltung kommt danach.",
      },
      {
        kind: "h2",
        text: "Die Telefonnummer gehört nach oben",
      },
      {
        kind: "p",
        text: "Wer vor der Tür zum Telefon greift, will nicht erst eine Nummer markieren und kopieren. Er will tippen, und das Handy soll wählen. Eine Telefonnummer als Klartext unten auf der Seite hilft dabei wenig. Wir setzen sie oben als Knopf.",
      },
      {
        kind: "h2",
        text: "Was wir bauen und was wir weglassen",
      },
      {
        kind: "p",
        text: "Für ein Café bauen wir meist eine einzige Seite mit fünf Abschnitten: heute geöffnet, Adresse mit Routenplaner, die Karte, ein paar Bilder vom Raum und Kontakt. Ein eigenes Reservierungssystem bauen wir in der Regel nicht. Wenn Sie Reservierungen brauchen, verlinken wir auf einen Dienst wie OpenTable oder Quandoo.",
      },
      {
        kind: "p",
        text: "Wenn diese Seite stimmt, hat der Gast seine Antworten, bevor er die Klinke anfasst.",
      },
      {
        kind: "quote",
        text: "Eine Café-Website muss vor allem eine Frage beantworten: Ist heute geöffnet?",
      },
    ],
  },
  {
    slug: "pflegedienst-google-maps-hamburg",
    seoTitle: "Pflegedienst bei Google Maps: Was hineingehört",
    title: "Wer auf der Karte fehlt, ist nicht im Gespräch",
    dek: "Wie Angehörige in Hamburg nach ambulanter Pflege suchen, und was ein vollständiger Google-Eintrag dafür braucht.",
    publishedAt: "2026-05-26",
    readingMinutes: 3,
    tags: ["Pflegedienst", "Gefunden werden", "Google Maps"],
    body: [
      {
        kind: "p",
        text: "Ein Pflegedienst, der bei Google Maps nicht erscheint, wird von vielen Angehörigen gar nicht erst gefunden. Das liegt daran, wie sie suchen.",
      },
      {
        kind: "p",
        text: "Wenn der Vater aus dem Krankenhaus entlassen wird und die Tochter abends einen Pflegedienst sucht, tippt sie selten nur „Pflegedienst Hamburg“. Sie tippt ihren Stadtteil dazu, etwa Eimsbüttel, Wandsbek oder Barmbek, und schaut, was auf der Karte erscheint.",
      },
      {
        kind: "h2",
        text: "Wo es oft hakt",
      },
      {
        kind: "p",
        text: "Viele Einträge auf der Karte sind unvollständig. Es fehlen Fotos, die Öffnungszeiten sind veraltet, und es steht nicht da, welche Leistungen der Dienst anbietet. Manche Pflegedienste haben gar keinen Eintrag, den sie selbst verwalten.",
      },
      {
        kind: "p",
        text: "Wer auf dem Handy sucht, vergleicht meist nur die ersten Einträge, die erscheinen. Wer dort fehlt oder nur eine Adresse zeigt, bekommt den Anruf nicht.",
      },
      {
        kind: "h2",
        text: "Warum das so ist",
      },
      {
        kind: "p",
        text: "Meist steckt eine von drei Ursachen dahinter. Google hat den Eintrag aus alten Verzeichnissen angelegt, und niemand hat ihn je übernommen. Oder der Eintrag gehört zwar dem Betrieb, gilt intern aber nur als Adressangabe. Oder zwischen Pflegedienstleitung und externer IT fühlt sich niemand zuständig.",
      },
      {
        kind: "p",
        text: "Keine dieser Ursachen ist schwer zu beheben. Ein vollständiger Eintrag kostet nichts außer Zeit.",
      },
      {
        kind: "h2",
        text: "Was vollständig heißt",
      },
      {
        kind: "p",
        text: "Zuerst bestätigen Sie den Eintrag im Google-Unternehmensprofil als Inhaber. Dazu kommen einige Fotos von Eingang, Fahrzeug und Team, genaue Öffnungszeiten mit der telefonischen Erreichbarkeit außerhalb der Bürozeiten und eine Beschreibung der Schwerpunkte, etwa Behandlungspflege, Grundpflege, Hauswirtschaft oder Demenzbetreuung. Bewertungen beantworten Sie einzeln und sachlich.",
      },
      {
        kind: "p",
        text: "Für die Einrichtung rechnen wir etwa eine Stunde, wenn Sie den Eintrag als Inhaber bestätigen können. Wenn wir die Website eines Pflegedienstes bauen, prüfen wir den Eintrag als Erstes.",
      },
      {
        kind: "quote",
        text: "Ein vollständiger Google-Eintrag kostet nichts außer etwas Zeit.",
      },
    ],
  },
  {
    slug: "was-wir-an-wix-migrationen-lernen",
    seoTitle: "Von Wix umziehen: Was beim Wechsel Arbeit macht",
    title: "Die Mietwohnung mit dem goldenen Schlüssel",
    dek: "Drei Dinge, die beim Umzug von einem Baukasten fast immer Arbeit machen, und wie wir sie angehen.",
    publishedAt: "2026-05-18",
    readingMinutes: 4,
    tags: ["Umzug", "Wix", "Baukasten"],
    body: [
      {
        kind: "p",
        text: "Wer von einem Baukasten wie Wix, Squarespace oder Jimdo zu einer eigenen Website wechselt, stößt fast immer auf dieselben drei Dinge. Das liegt weniger am einzelnen Anbieter als daran, wie Baukästen aufgebaut sind.",
      },
      {
        kind: "h2",
        text: "Texte, die in feste Flächen gepresst wurden",
      },
      {
        kind: "p",
        text: "Die Gestaltungen im Baukasten geben für Überschriften und Absätze feste Flächen vor. Viele Inhaber haben ihre Texte über Jahre in diese Flächen eingepasst. Beim Umzug sind die Sätze dann entweder abgehackt, weil der Platz nicht reichte, oder gestreckt, weil eine Fläche gefüllt werden musste.",
      },
      {
        kind: "p",
        text: "Deshalb schreiben wir beim Umzug einen Teil der Texte neu. Grundlage sind die alte Seite und Ihre Stichpunkte. Sie lesen gegen und streichen, was nicht stimmt.",
      },
      {
        kind: "h2",
        text: "Bilder ohne Originaldateien",
      },
      {
        kind: "p",
        text: "Baukästen speichern Bilder auf ihren eigenen Servern. Nach einer Kündigung sind sie dort irgendwann nicht mehr abrufbar. Viele Inhaber haben die Originaldateien nicht mehr, weil die Galerie im Baukasten ihr einziger Speicher war.",
      },
      {
        kind: "p",
        text: "Deshalb sichern wir vor dem Umzug alle Bilder der bestehenden Seite und prüfen, welche sich weiter verwenden lassen. Was zu klein oder zu stark komprimiert ist, ersetzen Sie durch neue Fotos, gern vom Handy. Dafür planen wir etwa einen halben Tag ein.",
      },
      {
        kind: "h2",
        text: "Unterseiten, die bei Google gefunden werden",
      },
      {
        kind: "p",
        text: "Oft weiß niemand genau, welche Unterseiten über Google Besucher bringen. Fällt so eine Seite beim Umzug weg, merkt man es erst Monate später an weniger Anfragen.",
      },
      {
        kind: "p",
        text: "Deshalb richten wir vor dem Umzug die Google Search Console ein (das kostenlose Werkzeug, mit dem Google zeigt, wie Ihre Seite gefunden wird), falls sie noch fehlt, und lassen sie ein paar Wochen mitlaufen. Danach legen wir fest, welche Adressen bleiben, welche weitergeleitet werden und welche wegfallen.",
      },
      {
        kind: "h2",
        text: "Die Mietwohnung",
      },
      {
        kind: "p",
        text: "Ein Baukasten ist keine schlechte Wahl. Für Selbstständige, die ihre Seite selbst pflegen wollen, passt er oft gut. Man sollte nur wissen, dass er einer Mietwohnung gleicht: Wer auszieht, nimmt nicht alles mit. Das merken viele erst beim Umzug.",
      },
      {
        kind: "quote",
        text: "Eine eigene Website nehmen Sie mit, wenn Sie den Anbieter wechseln.",
      },
    ],
  },
];

/**
 * Öffentliche Liste, garantiert neuester Beitrag zuerst — egal an
 * welcher Stelle im Array oben ein neuer Post eingefügt wird.
 * Konsumenten (Index-Aufmacher, Homepage-Karte, Prev/Next, Feed)
 * verlassen sich auf diese Ordnung.
 */
export const JOURNAL_POSTS: JournalPost[] = [...POSTS].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

/**
 * Branche-Slug → Journal-Slug für die „Aus dem Journal"-Sektion
 * auf den Branchen-Detailseiten. Hier in der Datenschicht gepflegt,
 * damit beim Anlegen eines Essays die Verdrahtung sichtbar daneben
 * liegt — nicht in einer Page-Datei vergraben.
 */
export const JOURNAL_BY_BRANCHE: Record<string, string> = {
  gastro: "cafe-website-hamburg-2026",
  pflege: "pflegedienst-google-maps-hamburg",
};

/**
 * Stadtteil-Slug → Journal-Slug, gleiche Logik für die Standort-
 * Detailseiten. Nur gepflegt, wo der Essay den Stadtteil wirklich
 * berührt — kein Zwang, alle acht zu bespielen.
 */
export const JOURNAL_BY_STANDORT: Record<string, string> = {
  eppendorf: "cafe-website-hamburg-2026",
  eimsbuettel: "cafe-website-hamburg-2026",
  wandsbek: "pflegedienst-google-maps-hamburg",
};

/**
 * Weiterführende Links am Ende eines Beitrags. Ohne Eintrag zeigt
 * die Beitragsseite einen Standard (Durchsicht und Erstgespräch).
 */
export type JournalCta = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const JOURNAL_CTAS: Record<string, JournalCta> = {
  "die-zweite-frage": {
    primaryHref: "/sprechstunde",
    primaryLabel: "Zur Sprechstunde",
    secondaryHref: "/anfrage",
    secondaryLabel: "Schriftlich anfragen",
  },
  // Ankertexte: „Website erstellen lassen" nur auf /website-erstellen-lassen,
  // „Webseite (selbst) erstellen" ohne „lassen" nur auf /webseite-erstellen.
  "wann-eine-website-warten-kann": {
    primaryHref: "/audit",
    primaryLabel: "Kostenlose Durchsicht Ihrer Website",
    secondaryHref: "/webseite-erstellen",
    secondaryLabel: "Webseite selbst erstellen: Anleitung",
  },
  "der-preis-einer-website": {
    primaryHref: "/website-erstellen-lassen",
    primaryLabel: "Website erstellen lassen: Preise und Ablauf",
    secondaryHref: "/honorar",
    secondaryLabel: "Wie sich der Preis zusammensetzt",
  },
  "warum-wir-keine-mockups-zeigen": {
    primaryHref: "/ablauf",
    primaryLabel: "Der Ablauf im Einzelnen",
    secondaryHref: "/website-erstellen-lassen",
    secondaryLabel: "Website erstellen lassen: Ablauf und Festpreis",
  },
  "cafe-website-hamburg-2026": {
    primaryHref: "/branchen/gastro",
    primaryLabel: "Websites für Gastronomie",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Seite",
  },
  "pflegedienst-google-maps-hamburg": {
    primaryHref: "/branchen/pflege",
    primaryLabel: "Websites für Pflegedienste",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Seite",
  },
  "was-wir-an-wix-migrationen-lernen": {
    primaryHref: "/anfrage",
    primaryLabel: "Umzug anfragen",
    secondaryHref: "/vergleich",
    secondaryLabel: "Baukasten und Sitalo im Vergleich",
  },
};

export function getCtaForPost(slug: string): JournalCta | undefined {
  return JOURNAL_CTAS[slug];
}

export function getPost(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return JOURNAL_POSTS.map((p) => p.slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

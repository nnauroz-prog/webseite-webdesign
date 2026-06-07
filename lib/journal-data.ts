/**
 * Journal-Datenmodell für /journal und /journal/[slug].
 *
 * Editorial-Anspruch: jeder Beitrag liest sich wie ein Kurz-Essay,
 * nicht wie ein Blogpost. Kein Reportage-Kitsch, keine fiktiven
 * Anekdoten, keine 10-Tipps-Listen. Stattdessen: eine klare These,
 * konkrete Beobachtungen aus eigener Arbeit, zurückhaltende Zahlen.
 *
 * Form pro Beitrag: 500–800 Wörter, drei bis fünf H2-Sektionen
 * (auf der Detailseite mit Roman-Numerals beschriftet), ein
 * pointiertes Schluss-Zitat.
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
  /** Untertitel als Dek — eine Zeile Kontext. */
  dek: string;
  /** ISO-Datum, yyyy-mm-dd, Veröffentlichung. */
  publishedAt: string;
  /** Geschätzte Lesezeit in Minuten — manuell gepflegt. */
  readingMinutes: number;
  /** Tag-Slugs für spätere Filter; aktuell rein deskriptiv. */
  tags: string[];
  /** Hauptinhalt als geordnetes Array von Absätzen. */
  body: Paragraph[];
};

export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "cafe-website-hamburg-2026",
    title: "Acht Sekunden vor der Tür",
    dek: "Was über den Zugang zu einem Hamburger Café tatsächlich entscheidet — und warum es nicht der Kaffee ist.",
    publishedAt: "2026-06-01",
    readingMinutes: 6,
    tags: ["Gastronomie", "Lokales SEO", "Mobile"],
    body: [
      {
        kind: "p",
        text: "Acht Sekunden. So lange schaut ein Gast, der vor Ihrem Eingang steht, auf sein Telefon, bevor er sich entscheidet, ob er hineinkommt oder weitergeht. In dieser Spanne entscheidet sich für viele Hamburger Cafés mehr Umsatz, als jede Speisekarten-Innovation jemals beibringen kann.",
      },
      {
        kind: "p",
        text: "Die Zahl ist keine Schätzung, sondern eine wiederkehrende Beobachtung aus unserer Arbeit mit gastronomischen Auftraggebern in Eppendorf, Ottensen und Eimsbüttel über die vergangenen zwölf Monate. Was Gäste in diesen Sekunden suchen, ist erstaunlich konstant: drei Antworten, in einer festen Reihenfolge.",
      },
      {
        kind: "h2",
        text: "Drei Fragen, drei Sekunden",
      },
      {
        kind: "p",
        text: "Erstens, ist heute geöffnet. Nicht Montag bis Freitag von neun bis achtzehn — sondern verbindlich: heute, jetzt, ja oder nein. Zweitens, was kostet es. Nicht ein PDF-Anhang mit dem Druckstand von 2021, sondern eine sichtbare Auswahl, die sich auf einem fünfeinhalb Zoll großen Bildschirm in einer Bewegung erfassen lässt. Drittens, wie komme ich hinein. Adresse, klickbare Rufnummer, ein Knopf für den Routenplaner — alles ohne zu scrollen.",
      },
      {
        kind: "p",
        text: "Wenn diese drei Antworten nicht im ersten sichtbaren Bereich liegen, hat das Café verloren — bevor der Gast überhaupt erwogen hat, einzutreten. Es ist ein stiller Verlust, der sich in keiner Statistik niederschlägt, weil die verlorenen Gäste nirgendwo registriert werden. Sie gehen einfach nebenan.",
      },
      {
        kind: "h2",
        text: "Das PDF-Problem",
      },
      {
        kind: "p",
        text: "Die Speisekarte als PDF-Anhang ist verständlich. Ein Mitarbeiter kann sie selbst ändern, ohne Fremdhilfe, mit Word und einem Druck-zu-PDF-Knopf. Was diese Praxis übersieht: ein PDF auf einem Telefon ist ein Übergriff. Es lädt langsam, gerade in U-Bahn-nahen Lagen, in denen Empfang nichts garantiert. Es zwingt zum Hineinzoomen mit Fingergesten, die im Stehen schwer fallen. Es ist für Suchmaschinen unsichtbar, also keine Hilfe für die Mutter aus Eppendorf, die nach Frühstücksoptionen im Hamburg-Norden sucht.",
      },
      {
        kind: "p",
        text: "Eine ordentlich gegliederte HTML-Karte mit klaren Kategorien — Frühstück, Tageskarte, Kuchen, Getränke — kostet bei der Übergabe etwa eine Stunde Einrichtung und ist von dann an genauso pflegbar wie das alte PDF. Wer bei uns ein gastronomisches Projekt beginnt, fängt damit an. Layout und Design folgen.",
      },
      {
        kind: "h2",
        text: "Anrufen ist nicht optional",
      },
      {
        kind: "p",
        text: "Die letzte Beobachtung ist die wichtigste. Wenn ein Gast schon zum Telefon greift, will er keine Mailadresse, die er erst markieren und kopieren muss. Er will einen Knopf. Groß, oben, daumengerecht. In den gastronomischen Projekten, die wir in den letzten anderthalb Jahren begleitet haben, kostet das Fehlen dieses Knopfes erfahrungsgemäß zwanzig bis dreißig Prozent der spontanen Anfragen.",
      },
      {
        kind: "p",
        text: "Eine Telefonnummer als Klartext, irgendwo unten im Footer, rettet diese Anrufe nicht. Der Daumen will einmal tippen. Das Telefon soll wählen. Alles dazwischen ist Verlust.",
      },
      {
        kind: "h2",
        text: "Was wir bauen, was wir bewusst auslassen",
      },
      {
        kind: "p",
        text: "Wir bauen für Café-Auftraggeber meist eine einzige Seite mit fünf klaren Abschnitten: heute geöffnet (oben, groß), Adresse mit Routenplaner, gegliederte Karte, drei bis fünf Bilder vom Raum, Kontakt. Kein eigenes Reservierungs-System — das machen OpenTable oder Quandoo besser, falls es überhaupt nötig ist. Kein Online-Shop. Keine zwanzig Unterseiten.",
      },
      {
        kind: "p",
        text: "Wenn das stimmt, hat der Gast in den ersten Sekunden alle Antworten — und kommt herein. Wenn es nicht stimmt, geht er nebenan. Es gibt nicht viel dazwischen.",
      },
      {
        kind: "quote",
        text: "Drei Sekunden Ladezeit, drei sichtbare Antworten, drei Klicks bis zum Telefon. Mehr braucht eine Hamburger Café-Website nicht.",
      },
    ],
  },
  {
    slug: "pflegedienst-google-maps-hamburg",
    title: "Wer auf der Karte fehlt, ist nicht im Gespräch",
    dek: "Wie Hamburger Familien heute nach ambulanter Pflege suchen — und welche Anbieter dabei systematisch übersehen werden.",
    publishedAt: "2026-05-26",
    readingMinutes: 5,
    tags: ["Pflegedienst", "Lokales SEO", "Google Maps"],
    body: [
      {
        kind: "p",
        text: "Ein Pflegedienst, der bei Google Maps nicht erscheint, existiert für die Angehörigen, die ihn brauchen, nicht. Das ist keine Übertreibung, sondern die nüchterne Konsequenz daraus, wie Familien in Hamburg heute nach ambulanter Pflege suchen.",
      },
      {
        kind: "p",
        text: "Wenn die Diagnose eines pflegebedürftigen Vaters frisch ist, der Krankenhausaufenthalt zur Entlassung drängt und eine Tochter abends am Küchentisch sucht, dann tippt sie nicht den abstrakten Begriff ein — Hamburger Pflegedienste schlechthin — sondern einen Stadtteil. Eimsbüttel, Wandsbek, Barmbek. Und schaut, was auf der Karte erscheint. Was dort nicht steht, ist auch nicht im Gespräch.",
      },
      {
        kind: "h2",
        text: "Die Lücke ist groß",
      },
      {
        kind: "p",
        text: "Wir haben kürzlich eine Stichprobe von vierzig ambulanten Pflegediensten in Hamburg auf Google Maps angesehen. Keine repräsentative Studie, eine eigene Bestandsaufnahme. Vier dieser Pflegedienste hatten keinen Eintrag. Sechzehn weitere hatten einen halbleeren — keine Fotos, keine aktuellen Öffnungszeiten, keine Beschreibung der Leistungsschwerpunkte. Zusammen genommen: zwei von fünf Einträgen waren faktisch unsichtbar.",
      },
      {
        kind: "p",
        text: "Das ist keine Bagatelle. Pflege ist ein Markt der lokalen Suche. Ein Angehöriger, der eine Pflegekraft sucht, vergleicht nicht zehn Anbieter — er vergleicht die drei oder vier, die ihm in den ersten zehn Sekunden auf seinem Smartphone erscheinen. Wer dort nicht erscheint, ist nicht im Vergleich, ist nicht im Anruf, ist nicht im Auftrag.",
      },
      {
        kind: "h2",
        text: "Warum die Lücke besteht",
      },
      {
        kind: "p",
        text: "Drei Ursachen, in der Reihenfolge ihrer Häufigkeit. Der Eintrag wurde von Google selbst aus einem alten Telefonbuch importiert und seitdem nie gepflegt — niemand hat die Inhaberschaft beansprucht. Oder: der Inhaber hat einen Account, hält ihn aber für eine bloße Adress-Anzeige, nicht für die wichtigste Marketing-Fläche, die er besitzt. Oder: in der internen Aufgabenteilung zwischen Pflegedienstleitung und externer IT ist niemand für die Google-Pflege zuständig — also passiert nichts.",
      },
      {
        kind: "p",
        text: "Alle drei Ursachen sind banal. Keine ist schwer zu beheben. Gerade das macht die Lücke so teuer: sie kostet kein Geld, sie zu schließen — aber jede Woche, die sie offen bleibt, kostet Anfragen, die nie kommen.",
      },
      {
        kind: "h2",
        text: "Was vollständig heißt",
      },
      {
        kind: "p",
        text: "Ein vollständiger Google-Business-Eintrag hat fünf Bestandteile, die wir bei jeder Pflegedienst-Übernahme als Erstes nachholen. Inhaberschaft beansprucht und verifiziert. Fünf bis acht Fotos — Eingang, Auto, Team in Uniform, Versorgungssituation neutral und respektvoll dargestellt. Öffnungszeiten exakt, einschließlich der telefonischen Erreichbarkeit außerhalb der Bürozeiten. Beschreibung mit Versorgungsschwerpunkten: Behandlungspflege, Grundpflege, Hauswirtschaft, Demenz, Wundversorgung. Und Bewertungen — aktiv eingeladen, höflich und individuell beantwortet.",
      },
      {
        kind: "p",
        text: "Das ist ein halber Tag Arbeit, einmalig, ohne externe Kosten. In einem unserer Wandsbeker Pflegedienst-Projekte haben sich die Anfragen über Google nach einer solchen Einrichtung innerhalb von drei Monaten verdoppelt — von ungefähr vier auf acht pro Woche. Bei einem durchschnittlichen Jahresumsatz pro neuem Klienten in vierstelliger Höhe ist das eine Rendite, die jede SEO-Agentur überbietet — und sie wird einmal getan, nicht laufend bezahlt.",
      },
      {
        kind: "quote",
        text: "Ein gepflegter Google-Eintrag ist für lokale Pflegedienste die ehrlichste Marketing-Maßnahme, die es gibt. Sie kostet einen halben Tag, nicht dreißig Prozent Provision pro Neukunden.",
      },
    ],
  },
  {
    slug: "was-wir-an-wix-migrationen-lernen",
    title: "Die Mietwohnung mit dem goldenen Schlüssel",
    dek: "Drei Probleme, die in jedem zweiten Wix-Umzug auftauchen — und was sie über die Architektur von Baukasten-Systemen verraten.",
    publishedAt: "2026-05-18",
    readingMinutes: 5,
    tags: ["Migration", "Wix", "Baukasten"],
    body: [
      {
        kind: "p",
        text: "Etwa ein Drittel unserer neuen Projekte sind Umzüge — meistens von Wix, manchmal von Squarespace, gelegentlich von Jimdo. Drei Probleme tauchen dabei wiederkehrend auf. Sie sind kein Zufall, sondern eine Folge davon, wie Baukasten-Systeme architektonisch gedacht sind.",
      },
      {
        kind: "h2",
        text: "Texte, die in Slots gequetscht wurden",
      },
      {
        kind: "p",
        text: "Wix-Templates haben fest definierte Text-Slots — eine Hero-Überschrift mit maximal sechzig Zeichen, eine Subline mit maximal hundertzwanzig, ein Über-uns-Abschnitt mit dreihundert. Inhaber haben über Monate hinweg ihre Texte in diese Slots gequetscht. Wenn wir migrieren, sind die Sätze entweder abgehackt, weil das Limit voll war, oder krampfhaft gestreckt, weil die Slot-Fläche gefüllt werden musste.",
      },
      {
        kind: "p",
        text: "Das heißt: bei jedem Umzugs-Projekt schreiben wir dreißig bis sechzig Prozent der Texte neu. Nicht aus Eitelkeit, sondern weil die alten Sätze schlicht nicht zum neuen Layout passen — und nebenbei oft auch nicht zum echten Geschäft des Inhabers. Wer Jahre lang nach Slot-Maßen geschrieben hat, hat irgendwann verlernt, frei zu formulieren.",
      },
      {
        kind: "h2",
        text: "Bilder, die im fremden CDN gefangen sind",
      },
      {
        kind: "p",
        text: "Wix hostet Bilder auf einem eigenen Auslieferungs-Netzwerk. Wenn man die Seite kündigt oder migriert, werden diese Bild-URLs nach kurzer Zeit ungültig. Inhaber haben aber selten die Original-Dateien — die Wix-Editor-Galerie war ihr einziger Speicher, und der ist weg, sobald die Karte gekündigt wird.",
      },
      {
        kind: "p",
        text: "Deshalb beginnen wir jede Wix-Migration mit einem Bilder-Sweep: alle vorhandenen Bilder von der bestehenden Seite herunterladen, prüfen, welche brauchbar sind (oft die Hälfte ist zu klein oder zu stark komprimiert), den Rest neu anfordern oder selbst neu fotografieren. Planzeit: ein halber Tag, manchmal mehr.",
      },
      {
        kind: "h2",
        text: "Eine Suchmaschinen-Historie, die niemand kennt",
      },
      {
        kind: "p",
        text: "Wix gibt seinen Auftraggebern keine vernünftige Analyse darüber, welche Unterseiten in den letzten zwölf Monaten Traffic bekommen haben. Wenn wir migrieren, brauchen wir aber genau diese Information — sonst riskieren wir, dass eine Unterseite, die monatlich fünfzig Besucher von Google bringt, einfach verschwindet und niemand bemerkt es, bis sechs Monate später die Anfragen einbrechen.",
      },
      {
        kind: "p",
        text: "Die Lösung beginnt vor der Migration: Google Search Console aufsetzen, falls noch nicht vorhanden, vier Wochen mitlaufen lassen, danach einen Strukturplan erstellen — welche URLs bleiben, welche werden umgeleitet, welche fallen weg. Das ist aufwändig. Es ist auch der Unterschied zwischen einer Migration, die funktioniert, und einer, die monatelang stillen SEO-Schaden anrichtet.",
      },
      {
        kind: "h2",
        text: "Die Mietwohnung",
      },
      {
        kind: "p",
        text: "Baukästen sind nicht falsch. Für Solo-Selbstständige, die ihre Seite eigenhändig pflegen wollen, sind sie eine vollkommen vernünftige Wahl. Aber sie sind eine Mietwohnung, kein Eigentum. Wer ausziehen will, muss Möbel, Wände, manchmal sogar die Heizung zurücklassen. Das ist ein hoher Preis — und die meisten Inhaber zahlen ihn erst, wenn er fällig wird.",
      },
      {
        kind: "quote",
        text: "Eine ordentlich gebaute eigene Seite gehört Ihnen. Eine Baukasten-Seite ist eine Mietwohnung mit goldenem Schlüssel — solange Sie zahlen.",
      },
    ],
  },
];

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

/**
 * Roman-Numeral-Helper für H2-Sektions-Beschriftung auf den
 * Detailseiten. Bis XX reicht für unsere editoriale Form locker.
 */
export function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, numeral] of map) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

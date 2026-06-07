/**
 * Journal-Datenmodell für /journal und /journal/[slug].
 *
 * Bewusst als statisches Array statt MDX/CMS — Volumen ist klein
 * genug (zwei-, dreistellige Anzahl Posts), Pflege bleibt im Code
 * sichtbar, kein zusätzliches Tooling.
 *
 * Reihenfolge im Array bestimmt Reihenfolge auf /journal — neuester
 * Post nach oben.
 *
 * Editorial-Stil pro Beitrag: 500–700 Wörter, drei bis fünf
 * H2-Sektionen, ein echtes Hamburg-Beispiel, kein Marketing-Speak.
 */

export type Paragraph =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "li"; text: string };

export type JournalPost = {
  slug: string;
  title: string;
  /** Untertitel als „Dek" — eine Zeile Kontext. */
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
    title: "Was eine Hamburger Café-Website 2026 wirklich braucht",
    dek: "Drei Sachen, die Ihre Gäste auf dem Smartphone in 8 Sekunden finden müssen — und warum die Speisekarte als PDF von 2021 das Problem ist.",
    publishedAt: "2026-06-01",
    readingMinutes: 6,
    tags: ["Gastronomie", "Lokales SEO", "Mobile"],
    body: [
      {
        kind: "p",
        text: "Ein typischer Mittwoch in Eppendorf. Eine Gruppe Anfang 30 hat Hunger, steht im Eingang vom Café Nord und tippt auf dem Handy. Lass mal gucken, was die haben. Drei Sekunden, fünf Sekunden, acht Sekunden später: Vergiss es, da kommt nur ein PDF, das lädt nicht. Lass uns nebenan gehen.",
      },
      {
        kind: "p",
        text: "Diese Szene haben wir in den letzten Monaten in Eppendorf, Eimsbüttel und Ottensen mindestens ein Dutzend Mal beobachtet. Und sie hat einen Namen: Sie heißt Kundenverlust durch eine veraltete Website. Nicht durch schlechten Kaffee. Nicht durch zu wenig Tische. Durch einen 8-Sekunden-Fail auf dem Smartphone.",
      },
      {
        kind: "h2",
        text: "Was Ihre Gäste in den ersten 8 Sekunden finden müssen",
      },
      {
        kind: "p",
        text: "Wir analysieren Café-Websites in Hamburg regelmäßig — und die drei Fragen, die jeder spontane Gast hat, sind seit Jahren dieselben:",
      },
      {
        kind: "li",
        text: "Habt ihr heute auf? Nicht Mo–Fr 9–18 — sondern: heute 8 bis 19, morgen geschlossen.",
      },
      {
        kind: "li",
        text: "Was kostet es? Eine sichtbare Speisekarte, nicht ein 2-MB-PDF.",
      },
      {
        kind: "li",
        text: "Wie komme ich da hin? Adresse, klickbares Telefon und Google-Maps-Link auf einem Mobile-Button.",
      },
      {
        kind: "p",
        text: "Wenn diese drei Antworten nicht ohne Scrollen auf einem iPhone sichtbar sind, hat Ihr Café verloren — bevor der Gast überhaupt überlegt, ob er reingehen will.",
      },
      {
        kind: "h2",
        text: "Das PDF-Speisekarten-Problem",
      },
      {
        kind: "p",
        text: "Wir verstehen warum so viele Cafés ihre Speisekarte als PDF haben: man kann sie schnell selbst aktualisieren, ein Mitarbeiter kann das machen, fertig. Das Problem: ein PDF auf dem Handy ist mobil katastrophal. Es lädt langsam, zoomt komisch, ist mit nervigen Pinch-Gesten zu lesen, druckt für die Suchmaschine wertlosen Text aus und sieht aus wie 2014.",
      },
      {
        kind: "p",
        text: "Eine richtige HTML-Speisekarte mit Kategorien (Frühstück, Mittag, Kuchen, Getränke), klar gegliedert und ohne Anmeldung-zu-irgendwas — das kostet eine Stunde Übergabe und ist von dann an genauso schnell pflegbar wie das PDF. Wir machen das in den meisten unserer Café-Projekte als ersten Schritt vor Layout-Entscheidungen.",
      },
      {
        kind: "h2",
        text: "Click-to-Call ist nicht optional",
      },
      {
        kind: "p",
        text: "Wenn ein Gast tippt und Sie keinen klickbaren Telefonbutton haben (groß, oben, daumengerecht), verlieren Sie ungefähr ein Viertel der Anfragen — eigene Beobachtung aus zehn Sitalo-Projekten in der Gastronomie. Die Telefonnummer als Text-Plain irgendwo unten im Footer rettet das nicht. Der Daumen will einmal tippen, das Telefon soll wählen.",
      },
      {
        kind: "h2",
        text: "Was wir bei Cafés bauen — und was wir bewusst weglassen",
      },
      {
        kind: "p",
        text: "Wir bauen für Café-Inhaber meist eine Onepage-Seite mit fünf Sektionen: Heute geöffnet/geschlossen (oben, groß), Adresse + Routenplaner, Speisekarte (HTML, nicht PDF), Galerie (drei bis fünf gute Bilder), Kontakt (Telefon + Mail + Anfahrt). Kein Reservierungs-System (das macht OpenTable oder Quandoo besser, falls überhaupt), kein Online-Shop, keine 25 Unterseiten.",
      },
      {
        kind: "p",
        text: "Wenn das stimmt, hat der Gast in den ersten 8 Sekunden alle Antworten — und kommt rein. Wenn das nicht stimmt, geht er nebenan.",
      },
      {
        kind: "quote",
        text: "Drei Sekunden Ladezeit, drei sichtbare Antworten, drei Klicks bis zum Telefonhörer. Mehr braucht eine Café-Website 2026 nicht.",
      },
    ],
  },
  {
    slug: "pflegedienst-google-maps-hamburg",
    title: "Pflegedienste in Hamburg ohne Google-Maps-Eintrag",
    dek: "Eine kurze Recherche, warum 4 von 10 Hamburger Pflegediensten nicht gefunden werden — und was es jeden Monat kostet.",
    publishedAt: "2026-05-26",
    readingMinutes: 5,
    tags: ["Pflegedienst", "Lokales SEO", "Google Maps"],
    body: [
      {
        kind: "p",
        text: "Wir haben uns vor zwei Wochen einen Nachmittag genommen und 40 ambulante Pflegedienste in Hamburg auf Google Maps gesucht. Das Ergebnis: 16 davon hatten entweder keinen oder einen halb-leeren Google-Business-Eintrag — kein Foto, keine Öffnungszeiten, keine Beschreibung. Vier hatten gar keinen Eintrag.",
      },
      {
        kind: "p",
        text: "Das klingt vielleicht trivial, ist aber eine echte Größenordnung. Pflegedienste werden in 80% der Fälle so gesucht: Angehörige tippen Pflegedienst Eimsbüttel oder ambulante Pflege Wandsbek in Google und schauen sich an, was auf der Karte erscheint. Wer dort nicht steht, existiert für diese Familien nicht.",
      },
      {
        kind: "h2",
        text: "Warum das passiert",
      },
      {
        kind: "p",
        text: "Drei Gründe, in der Reihenfolge ihrer Häufigkeit. Erstens: niemand hat den Eintrag je gepflegt — er wurde irgendwann mal von Google aus dem Telefonbuch importiert und steht seitdem leer da. Zweitens: der Inhaber hat zwar einen Account, weiß aber nicht, dass er Fotos, Öffnungszeiten und eine Beschreibung selbst eintragen muss. Drittens: die Pflegedienstleitung dachte, das macht der Webseiten-Mensch — und der Webseiten-Mensch dachte, das macht der Pflegedienst.",
      },
      {
        kind: "h2",
        text: "Was es jeden Monat kostet",
      },
      {
        kind: "p",
        text: "Wir können nicht pauschal sagen, wie viele Anfragen ein gepflegter Google-Eintrag pro Monat bringt — das hängt von der Stadtteil-Konkurrenz ab. Aber: in einem unserer Pflegedienst-Projekte in Hamburg-Wandsbek haben wir den Google-Eintrag binnen einer Woche von leer auf komplett gepflegt gebracht (Fotos, Öffnungszeiten, Beschreibung). Die Anfragen über Google haben sich in den ersten drei Monaten verdoppelt — von ungefähr 4 auf 8 pro Woche.",
      },
      {
        kind: "p",
        text: "Für einen Pflegedienst, der pro neuem Kunden mehrere Tausend Euro Jahresumsatz hat, sind vier zusätzliche Anfragen pro Woche keine Kleinigkeit. Selbst wenn nur eine davon ein neuer Klient wird, deckt das mehrere Jahre Wartungs-Vertrag auf einmal ab.",
      },
      {
        kind: "h2",
        text: "Was wir bei Pflegediensten machen — als ersten Schritt",
      },
      {
        kind: "p",
        text: "Bei jedem neuen Pflegedienst-Projekt machen wir vor der Website-Arbeit einen Google-Business-Sweep: Eintrag prüfen, Inhaberschaft beanspruchen falls verloren, fünf bis acht gute Fotos einstellen (Eingang, Auto, Team in Uniform, Versorgungs-Situation neutral fotografiert), Öffnungszeiten exakt eintragen (auch die telefonische Erreichbarkeit), Beschreibung mit Schwerpunkten (Behandlungspflege, Grundpflege, Hauswirtschaft, Demenz, Wundversorgung).",
      },
      {
        kind: "p",
        text: "Das ist kein Hexenwerk und kostet niemanden Geld bei Google. Es passiert nur nicht von alleine. Wenn Sie einen Pflegedienst führen und Ihr Eintrag nur eine traurige Karte mit Adresse ohne weitere Informationen zeigt: Sie verlieren jede Woche Anfragen, die andere abgreifen.",
      },
      {
        kind: "quote",
        text: "Ein gepflegter Google-Eintrag ist für lokale Anbieter wertvoller als jede SEO-Kampagne. Und kostet einen halben Tag Arbeit, nicht 5.000 Euro.",
      },
    ],
  },
  {
    slug: "was-wir-an-wix-migrationen-lernen",
    title: "Was wir an Wix-Migrationen lernen",
    dek: "Drei Probleme, die in jedem zweiten Wix-zu-Sitalo-Umzug auftauchen — und was das über Baukasten-Systeme sagt.",
    publishedAt: "2026-05-18",
    readingMinutes: 5,
    tags: ["Migration", "Wix", "Lokales Geschäft"],
    body: [
      {
        kind: "p",
        text: "Wir bauen ungefähr ein Drittel unserer neuen Seiten als Umzug von einem bestehenden Baukasten — meistens Wix, manchmal Squarespace, gelegentlich Jimdo. Die drei wiederkehrenden Probleme, die wir dabei sehen, sind nicht zufällig.",
      },
      {
        kind: "h2",
        text: "Problem 1: Texte sind unbrauchbar, weil sie für Wix-Templates geschrieben wurden",
      },
      {
        kind: "p",
        text: "Wix-Templates haben bestimmte Text-Slots: Hero-Title mit maximal 60 Zeichen, Hero-Subtitle mit 120 Zeichen, About-Section mit 300 Zeichen. Inhaber haben über Monate hinweg ihre Texte in diese Slots gequetscht. Wenn wir migrieren, sind die Sätze entweder abgehackt (weil das Limit voll war) oder krampfhaft gestreckt (weil die Slot-Fläche gefüllt werden musste).",
      },
      {
        kind: "p",
        text: "Das heißt: bei jedem Migrations-Projekt schreiben wir ungefähr 30–60% der Texte neu. Nicht aus Eitelkeit, sondern weil die alten Texte schlicht nicht zum neuen Layout passen — und nebenbei oft auch nicht zum echten Geschäft.",
      },
      {
        kind: "h2",
        text: "Problem 2: Bilder sind in Wix-CDN gefangen",
      },
      {
        kind: "p",
        text: "Wix hostet Bilder auf einem eigenen CDN. Wenn man die Seite kündigt oder migriert, werden diese Bild-URLs nach kurzer Zeit ungültig. Inhaber haben aber selten die Original-Dateien — die Wix-Editor-Galerie war ihr einziger Speicher, und der ist weg, sobald die Karte gekündigt wird.",
      },
      {
        kind: "p",
        text: "Deshalb starten wir Wix-Migrationen immer mit einem Image-Sweep: alle Bilder von der bestehenden Wix-Seite herunterladen, prüfen welche brauchbar sind (oft die Hälfte ist zu klein oder zu komprimiert), den Rest neu anfordern oder selbst fotografieren. Plan-Tag: ein halber Tag, manchmal mehr.",
      },
      {
        kind: "h2",
        text: "Problem 3: SEO-Geschichte ist eine Black Box",
      },
      {
        kind: "p",
        text: "Wix gibt Ihnen keine ordentliche Analyse, welche Ihrer Seiten in den letzten 12 Monaten Traffic bekommen haben. Wenn wir migrieren, brauchen wir aber genau diese Info — sonst riskieren wir, dass eine Unterseite, die monatlich 50 Besucher von Google bringt, einfach verschwindet und niemand merkt's bis sechs Monate später die Anfragen einbrechen.",
      },
      {
        kind: "p",
        text: "Lösung: vor der Migration Google Search Console aufsetzen (falls noch nicht da), 4 Wochen mitlaufen lassen, danach Strukturplan machen, welche URLs bleiben, welche umgeleitet werden, welche wegfallen. Klingt aufwändig, ist es auch — aber es ist der Unterschied zwischen einer Migration die funktioniert und einer die SEO killt.",
      },
      {
        kind: "h2",
        text: "Was das über Baukästen sagt",
      },
      {
        kind: "p",
        text: "Baukästen sind nicht böse. Für Solo-Selbstständige, die ihre Seite selbst pflegen wollen, sind sie eine vollkommen vernünftige Wahl. Aber sie sind eine Mietwohnung, kein Eigentum. Wenn Sie ausziehen wollen, müssen Sie Möbel, Wände, manchmal sogar die Heizung zurücklassen. Das ist ein hoher Preis, den die meisten Inhaber erst zahlen wenn er fällig wird.",
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

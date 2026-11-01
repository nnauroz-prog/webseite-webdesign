/**
 * Branchen-Datenmodell. Eine einzige Quelle für die /branchen-Übersicht
 * und alle /branchen/[slug]-Detailseiten. Die Fragen erscheinen außerdem
 * auf /pflege und /praxen, Kurztext und Stichpunkte im Assistenten.
 *
 * Jeder Eintrag liefert:
 *   - kurze Übersichtsdaten für die /branchen-Liste
 *   - längere, branchen-spezifische Inhalte für die Detailseite
 *
 * Textregeln: Sie-Form, kurze Sätze, keine Prozentwerte oder Statistiken,
 * keine Aussagen über frühere Kunden. Paket-Angaben (Änderungen pro Monat,
 * selbst pflegbare Inhalte erst ab Premium) folgen lib/pakete-data.ts.
 */

export type Branche = {
  /** URL-Slug. /branchen/[slug] */
  slug: string;
  /** Anzeigename, z. B. "Pflegedienste". */
  label: string;
  /** Kurze Beschreibung (2 Sätze) für Übersicht, Kopf der Detailseite und
   *  Meta-Description (dort nur der erste Satz). */
  shortBody: string;
  /** Stichpunkte, was wir für die Branche bauen (Assistent). */
  bullets: string[];
  /** Vorgeschlagener ?branche=... Wert im Anfrageformular. */
  inquirySlug: string;
  /** Bild der Musterseite für Übersicht und Detailkopf. */
  image?: { src: string; alt: string };
  /** Optionales Stimmungsbild aus der Branche. */
  atmosphere?: { src: string; alt: string };

  /* === Erweiterte Inhalte für /branchen/[slug] === */

  /** Ein Satz für das Vorschaubild beim Teilen (Open Graph). */
  detailHeadline: string;
  /** Zwei Absätze als Einordnung auf der Detailseite. */
  detailIntro: string[];
  /** Typischer Seitenplan; der erste Eintrag ist die Startseite. */
  typicalPages: string[];
  /** Konkrete Teile der Seite. */
  features: { title: string; body: string }[];
  /** Fragen aus der Branche, offen gesetzt und als FAQPage-Schema. */
  faq: { q: string; a: string }[];
  /** Empfohlenes Paket-Slug aus PACKAGES. */
  recommendedPackage: "starter" | "business" | "premium";
};

export const BRANCHEN: Branche[] = [
  {
    slug: "pflege",
    label: "Pflegedienste",
    inquirySlug: "pflege",
    image: {
      src: "/images/sitalo-pflege-laptop.webp",
      alt: "Musterseite für einen Pflegedienst auf einem Laptop in einem Büro, daneben Pflanzen und ein Notizbuch.",
    },
    atmosphere: {
      src: "/images/atmosphere/pflege-eingang.webp",
      alt: "Empfangsbereich eines Pflegedienstes mit Holzkommode und Pflanze, im Hintergrund das Wartezimmer.",
    },
    shortBody:
      "Angehörige wollen schnell wissen, was Sie leisten und ob Sie bis zu ihnen nach Hause fahren. Pflegekräfte suchen auf derselben Seite den Weg zur Bewerbung.",
    bullets: [
      "Leistungen getrennt erklärt: Grundpflege, Behandlungspflege, Verhinderungspflege",
      "Einsatzgebiet als Karte oder Liste der Orte",
      "Notfallnummer in der Kopfleiste",
      "Bewerbungsformular für Pflegekräfte, am Handy ausfüllbar",
      "Team mit Fotos, Zertifikate und Prüfbericht",
    ],
    detailHeadline: "Eine Seite, über die Angehörige anrufen und Pflegekräfte sich bewerben.",
    detailIntro: [
      "Wer einen Pflegedienst sucht, sucht meist für die Mutter oder den Vater und hat wenig Zeit. Angehörige vergleichen mehrere Dienste am Handy. Steht oben, welche Leistungen Sie anbieten und in welche Orte Sie fahren, und lässt sich die Nummer antippen, rufen sie bei Ihnen an.",
      "Die zweite Gruppe auf Ihrer Seite sind Pflegekräfte. Für sie gibt es eine eigene Unterseite mit den offenen Stellen und einem kurzen Formular. Den Lebenslauf können sie später nachreichen, für ein erstes Gespräch reicht die Nachricht.",
    ],
    typicalPages: [
      "Startseite mit Leistungsüberblick",
      "Leistungen: Grundpflege, Behandlungspflege und mehr",
      "Team",
      "Stellen und Bewerbung",
      "Einsatzgebiet und Anfahrt",
      "Kontakt mit Notfallnummer",
    ],
    features: [
      {
        title: "Leistungen in Alltagssprache",
        body: "Was ist Behandlungspflege, was zahlt die Pflegekasse, was bedeutet der Pflegegrad? Wir schreiben es so, dass Angehörige es beim ersten Lesen verstehen.",
      },
      {
        title: "Bewerbung vom Handy",
        body: "Ein eigenes Formular für Pflegekräfte mit wenigen Pflichtfeldern. Wer möchte, hängt den Lebenslauf als Datei an.",
      },
      {
        title: "Einsatzgebiet",
        body: "Eine Karte oder eine Liste der Stadtteile und Orte, in die Sie fahren. Anrufer sehen vorher, ob Sie zu ihnen kommen.",
      },
      {
        title: "Team und Nachweise",
        body: "Fotos vom eigenen Team, Ihre Zertifikate, Hinweise zur Abrechnung mit der Pflegekasse und eine Notfallnummer, die man nicht suchen muss.",
      },
    ],
    faq: [
      {
        q: "Gehören Prüfbericht und Zertifikate auf die Seite?",
        a: "Ja, und zwar so, dass man sie findet. Auf der Startseite steht ein kurzer Hinweis, die Dokumente selbst liegen auf einer eigenen Unterseite.",
      },
      {
        q: "Brauchen wir ein Bewerberportal mit Login?",
        a: "Nein. Ein gut sichtbares Formular reicht. Die Bewerbung kommt als E-Mail in Ihrem Postfach an.",
      },
      {
        q: "Wie schnell kann die Seite online sein?",
        a: "Eine Pflegedienst-Seite mit mehreren Unterseiten steht meist 5 bis 10 Werktage, nachdem Texte und Fotos bei uns sind. Eine einzelne Seite als Visitenkarte ist oft in 1 bis 2 Werktagen fertig.",
      },
      {
        q: "Können wir Dokumente zum Herunterladen anbieten?",
        a: "Ja. Den Bericht der Qualitätsprüfung durch den Medizinischen Dienst, das Hygienekonzept oder Vereinbarungen mit der Pflegekasse sammeln wir auf einer Seite. Zu jedem Dokument steht ein Satz, was darin steht.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "praxis",
    label: "Arzt- und Zahnarztpraxen",
    inquirySlug: "praxis",
    image: {
      src: "/images/sitalo-praxis-laptop.webp",
      alt: "Musterseite für eine Zahnarztpraxis auf einem Laptop im hellen Praxisempfang.",
    },
    atmosphere: {
      src: "/images/atmosphere/praxis-raum.webp",
      alt: "Behandlungsraum mit Holzschreibtisch, Tablet und einem Pflanzenbild an der Wand.",
    },
    shortBody:
      "Vor dem ersten Termin suchen Patient:innen nach Sprechzeiten, Anfahrt und Behandlungen. Ihre Seite zeigt das ohne Suchen und nimmt Terminanfragen an.",
    bullets: [
      "Sprechzeiten, Notdienst und Anfahrt oben auf jeder Seite",
      "Behandlungen in Alltagssprache",
      "Team mit Qualifikationen",
      "Terminanfrage per Formular",
      "Ruhige, sachliche Gestaltung",
    ],
    detailHeadline: "Eine ruhige Praxis-Seite mit den Sprechzeiten ganz oben.",
    detailIntro: [
      "Wer eine neue Praxis sucht, schaut vorher im Netz nach. Findet man Sprechzeiten und Adresse erst nach mehreren Klicks, oder sieht die Seite seit Jahren gleich aus, ruft man eben die Praxis zwei Straßen weiter an.",
      "Ihre Seite muss deshalb zwei Dinge können. Sie soll sachlich und gepflegt aussehen, und der nächste Schritt soll leicht sein: anrufen oder einen Termin anfragen, am Handy mit einem Tipp.",
    ],
    typicalPages: [
      "Startseite",
      "Behandlungen",
      "Team mit Qualifikationen",
      "Praxisräume in Bildern",
      "Sprechzeiten und Notdienst",
      "Terminanfrage",
      "Anfahrt und Parken",
    ],
    features: [
      {
        title: "Terminanfrage",
        body: "Ein Formular für Wunschtermin, Anliegen und Kontaktdaten. Die Anfrage kommt als E-Mail in der Praxis an, Sie bestätigen per Anruf oder Antwortmail.",
      },
      {
        title: "Sprechzeiten und Notdienst",
        body: "Reguläre Sprechzeiten, Urlaubszeiten und der Notdienst stehen getrennt und gut lesbar. Ändern sich die Zeiten, genügt eine kurze Mail an uns.",
      },
      {
        title: "Behandlungen verständlich",
        body: "Jede Behandlung in den Worten, die Patient:innen selbst benutzen. Dazu ein Hinweis, was die Kasse zahlt und was privat abgerechnet wird.",
      },
      {
        title: "Team mit Werdegang",
        body: "Foto, Schwerpunkt und Werdegang zu jeder Ärztin und jedem Arzt. Vor dem ersten Termin möchte man wissen, wer einen behandelt.",
      },
    ],
    faq: [
      {
        q: "Brauche ich ein Online-Buchungssystem?",
        a: "Nicht unbedingt. Für viele Praxen reicht eine Terminanfrage per Formular. Nutzen Sie schon Doctolib, Jameda oder ein anderes System, binden wir es in die Seite ein.",
      },
      {
        q: "Was ist mit dem Heilmittelwerbegesetz (HWG)?",
        a: "Wir kennen die Grundregeln und verzichten in den Texten auf Heilversprechen und vergleichende Werbung. Die rechtliche Prüfung im Einzelfall liegt bei Ihnen oder Ihrer Kammer.",
      },
      {
        q: "Können Patientenbewertungen eingebunden werden?",
        a: "Ja. Google-Bewertungen lassen sich auf der Seite anzeigen. Bei Jameda ist das technisch aufwendiger, geht aber auch.",
      },
      {
        q: "Wie steht es mit dem Datenschutz beim Kontaktformular?",
        a: "Gesundheitsdaten gehören nicht in ein Website-Formular. Wir fragen deshalb nur ab, was für einen Termin nötig ist: Wunschtermin, Name und Rückrufnummer. Die Server stehen in der EU, und die Verbindung ist verschlüsselt. Die Seite für die Datenschutzerklärung legen wir an und sagen Ihnen, welche Funktionen (Terminformular, Karte) darin vorkommen müssen. Den Rechtstext selbst liefern Sie, etwa aus einem Generator oder von Ihrer Kammer.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "friseur",
    label: "Friseure & Barbiere",
    inquirySlug: "friseur",
    image: {
      src: "/images/sitalo-friseur-mobile.webp",
      alt: "Musterseite für einen Friseur auf einem Smartphone, daneben Visitenkarten und ein Flyer für „Friseur am Markt“.",
    },
    atmosphere: {
      src: "/images/atmosphere/friseur-stuhl.webp",
      alt: "Alter Friseurstuhl vor einem runden Spiegel, dahinter ein Regal mit Pflegeprodukten.",
    },
    shortBody:
      "Wer einen neuen Salon sucht, schaut zuerst auf die Bilder und dann auf die Preise. Danach soll der Termin mit einem Tipp angefragt sein.",
    bullets: [
      "Galerie mit Ihren Arbeiten",
      "Leistungen mit Preisen",
      "Terminanfrage per Formular",
      "Online-Buchung auf Wunsch",
      "Telefonnummer zum Antippen",
    ],
    detailHeadline: "Eine Seite, auf der Ihre Arbeit zu sehen ist.",
    detailIntro: [
      "Beim Friseur und beim Barbier entscheiden Kund:innen mit den Augen. Wer Ihre Arbeit nicht sieht, ruft nicht an. Die Bilder auf Ihrer Seite sind deshalb das wichtigste Argument, wichtiger als jeder Satz darüber.",
      "Gleich danach kommen die Preise und der Weg zum Termin. Gesucht wird oft unterwegs am Handy. Die Telefonnummer steht deshalb oben und lässt sich antippen, die Terminanfrage ist ein kurzes Formular.",
    ],
    typicalPages: [
      "Startseite mit Galerie",
      "Leistungen und Preise",
      "Vorher und nachher",
      "Terminanfrage",
      "Team",
      "Adresse und Öffnungszeiten",
    ],
    features: [
      {
        title: "Galerie",
        body: "Ihre besten Arbeiten in großen Bildern, die man antippen und vergrößern kann. Auf Wunsch nach Leistung oder nach Stylist:in sortiert, auch mit Vorher-Nachher.",
      },
      {
        title: "Preisliste",
        body: "Preise nach Leistung geordnet. Neue Preise tragen wir im Rahmen der kleinen Änderungen ein, mit Premium pflegen Sie die Liste selbst.",
      },
      {
        title: "Termin vom Handy",
        body: "Die Telefonnummer lässt sich antippen, die Terminanfrage geht per Formular. Auf Wunsch binden wir ein Buchungssystem an.",
      },
      {
        title: "Team",
        body: "Foto, Schwerpunkt und Werdegang Ihrer Stylist:innen. Stammkund:innen wollen oft zu einer bestimmten Person.",
      },
    ],
    faq: [
      {
        q: "Sollen die Preise wirklich auf die Seite?",
        a: "Ja. Wer Preise sucht und keine findet, schaut beim nächsten Salon. Außerdem sparen Sie sich Anrufe, in denen es nur um den Preis geht.",
      },
      {
        q: "Welche Online-Buchung passt zu mir?",
        a: "Für kleine Salons reicht oft eine Terminanfrage per Formular. Arbeiten mehrere Stylist:innen mit eigenen Kalendern, lohnt sich ein System wie Treatwell, Booksy oder Shore. Wir binden das ein, das Sie schon nutzen oder nutzen wollen.",
      },
      {
        q: "Wie werden meine Bilder gut genug?",
        a: "Ihre eigenen Fotos bereiten wir auf: Ausschnitt, Farbe, Dateigröße. Gibt es keine brauchbaren Bilder, sagen wir Ihnen, welche Motive die Seite braucht; wer einen Fotografen beauftragt, bekommt von uns eine kurze Motivliste. Gute Bilder sind bei Ihnen das Erste, was Kund:innen sehen.",
      },
      {
        q: "Können wir Gutscheine über die Seite verkaufen?",
        a: "Ja. Am einfachsten ist ein Gutschein als PDF, den Kund:innen nach der Zahlung über Stripe herunterladen. Wer viele Gutscheine oder auch Produkte verkauft, braucht einen kleinen Shop. Den besprechen wir im Rahmen von Premium.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "gastro",
    label: "Cafés & Restaurants",
    inquirySlug: "gastro",
    image: {
      src: "/images/sitalo-cafe-mobile.webp",
      alt: "Musterseite für ein Café auf einem Smartphone, im Hintergrund das Café, daneben eine Visitenkarte von Sitalo Webdesign.",
    },
    atmosphere: {
      src: "/images/atmosphere/gastro-cafe.webp",
      alt: "Café vor der Öffnung mit Holztischen und Espressomaschine im Morgenlicht.",
    },
    shortBody:
      "Gäste schauen vor dem Besuch nach Karte, Öffnungszeiten und Anfahrt. Auf Ihrer Seite steht das ganz oben und lässt sich ohne Umweg ändern.",
    bullets: [
      "Speisekarte als Text statt als PDF",
      "Mittagstisch oder Wochenangebot änderbar",
      "Öffnungszeiten und Feiertage gut sichtbar",
      "Reservierungsanfrage",
      "Karte und Telefonnummer zum Antippen",
    ],
    detailHeadline: "Karte, Öffnungszeiten und Anfahrt stehen ganz oben.",
    detailIntro: [
      "Wer am Handy nach Ihrem Café sucht, will wissen, ob heute geöffnet ist und was es gibt. Danach kommt die Frage nach dem Weg. Findet man das nicht auf den ersten Blick, geht man eben ins Lokal nebenan.",
      "Die Karte muss stimmen. Ein PDF vom letzten Jahr lässt vermuten, dass es in der Küche ähnlich aussieht. Wir setzen die Karte deshalb als Text auf die Seite. Mit Premium ändern Sie Mittagstisch und Wochenangebot selbst, bei den anderen Paketen schicken Sie uns die Änderung per Mail.",
    ],
    typicalPages: [
      "Startseite mit Tagesangebot",
      "Speisekarte",
      "Über uns",
      "Bilder",
      "Reservierung",
      "Öffnungszeiten und Anfahrt",
    ],
    features: [
      {
        title: "Karte zum Selbstpflegen",
        body: "Mittagstisch und Wochenangebot ändern Sie direkt auf der Seite. Das gehört zu Premium, und bei Gastro-Seiten empfehlen wir es fast immer, weil sich die Karte oft ändert.",
      },
      {
        title: "Reservierungsanfrage",
        body: "Ein kurzes Formular mit Datum, Uhrzeit und Personenzahl. Sie bestätigen per Mail oder Anruf. Kommen viele Reservierungen, binden wir ein Reservierungssystem an.",
      },
      {
        title: "Öffnungszeiten und Anfahrt",
        body: "Adresse, Karte, Öffnungszeiten und Feiertage stehen weit oben. Die Telefonnummer lässt sich am Handy antippen.",
      },
      {
        title: "Bilder vom Essen",
        body: "Gerichte, Gastraum und Team. Ein gutes Foto vom Mittagstisch sagt mehr als jede Beschreibung.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine eigene Bestellfunktion für Lieferungen?",
        a: "Meist nicht. Für die Abwicklung von Lieferungen sind Lieferando und ähnliche Dienste eingerichtet. Wir setzen einen Bestellknopf auf Ihre Seite, der zu Ihrem Profil dort führt.",
      },
      {
        q: "Wie oft kann ich die Speisekarte ändern?",
        a: "Mit Premium so oft Sie wollen, denn Sie ändern sie selbst. Bei Starter und Business ändern wir die Karte für Sie, im Rahmen der kleinen Änderungen im Monatsbeitrag: eine im Monat bei Starter, drei bei Business.",
      },
      {
        q: "Können wir die Seite auch auf Englisch anbieten?",
        a: "Ja. Für Cafés und Restaurants mit vielen Gästen von außerhalb ist das sinnvoll. Den Umfang klären wir im ersten Gespräch.",
      },
      {
        q: "Geht eine Tischreservierung über die Seite?",
        a: "Ja. Bei wenigen Reservierungen reicht ein Formular mit Wunschtermin und Personenzahl, das direkt in Ihr Postfach geht. Ist das Restaurant abends regelmäßig voll, binden wir Quandoo, OpenTable oder ein ähnliches System ein. Dann führen Sie kein zweites Reservierungsbuch mehr.",
      },
    ],
    recommendedPackage: "premium",
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    inquirySlug: "handwerker",
    image: {
      src: "/images/sitalo-handwerker-laptop.webp",
      alt: "Musterseite für eine Tischlerei auf einem Laptop, der auf einer Werkbank steht.",
    },
    atmosphere: {
      src: "/images/atmosphere/handwerker-werkbank.webp",
      alt: "Werkbank eines Tischlers mit Handhobel, Hobelspänen und Kaffeebecher.",
    },
    shortBody:
      "Im Handwerk entscheidet sich vieles, bevor jemand anruft. Kund:innen sehen sich Ihre Leistungen und fertige Arbeiten an und suchen dann die Nummer.",
    bullets: [
      "Leistungen und Einsatzgebiet",
      "Galerie mit fertigen Projekten",
      "Rückrufbitte und Telefonnummer zum Antippen",
      "Notdienstnummer, falls Sie einen anbieten",
      "Meisterbrief, Innung und Versicherung",
    ],
    detailHeadline: "Eine Seite, über die Aufträge hereinkommen.",
    detailIntro: [
      "Bevor jemand einen Handwerker anruft, sieht er sich Bilder an. Ein, zwei fertige Projekte, dann wird die Nummer gewählt. Fehlen die Bilder oder ist die Nummer schwer zu finden, bekommt den Auftrag oft ein Betrieb, der nicht besser arbeitet, aber leichter zu erreichen ist.",
      "Sie selbst sitzen selten am Schreibtisch. Deshalb gibt es auf der Seite eine Rückrufbitte mit drei Feldern, und die Telefonnummer lässt sich auf jeder Unterseite antippen. Alles bleibt am Handy lesbar, auch auf der Baustelle.",
    ],
    typicalPages: [
      "Startseite mit Leistungsüberblick",
      "Leistungen im Einzelnen",
      "Referenzen",
      "Über uns und die Werkstatt",
      "Einsatzgebiet",
      "Anfrage und Rückruf",
    ],
    features: [
      {
        title: "Referenzen",
        body: "Fertige Projekte mit Bildern, ein paar Sätzen und dem Ort, auf Wunsch mit Vorher-Nachher. Für Handwerksbetriebe ist das der wichtigste Teil der Seite.",
      },
      {
        title: "Rückrufbitte",
        body: "Name, Telefonnummer und kurz, worum es geht. Sie rufen zurück, wenn die Hände frei sind. Das füllt man lieber aus als ein langes Kontaktformular.",
      },
      {
        title: "Einsatzgebiet",
        body: "Die Orte und Stadtteile, in denen Sie arbeiten, als Liste oder Karte. So rufen weniger Leute an, zu denen Sie gar nicht fahren.",
      },
      {
        title: "Nachweise",
        body: "Innung, Meisterbrief, Versicherungen, Jahre im Betrieb. Was Sie vorweisen können, gehört sichtbar auf die Seite.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine Online-Terminbuchung?",
        a: "Im Handwerk selten. Vor einer Zusage müssen Sie meist kurz nachfragen, deshalb funktionieren Anruf und Rückrufbitte besser.",
      },
      {
        q: "Wie viele Bilder brauche ich?",
        a: "Zehn bis fünfzehn gute Bilder von fertigen Arbeiten sind ein guter Anfang. Haben Sie weniger, fotografieren Sie die nächsten Aufträge, bevor die Seite online geht. Wer lieber einen Fotografen beauftragt, bekommt von uns eine kurze Motivliste.",
      },
      {
        q: "Können wir Videos aus der Werkstatt zeigen?",
        a: "Ja. Kurze Clips von 15 bis 30 Sekunden, etwa von einem Arbeitsschritt oder einem fertigen Stück, reichen. Mit dem Handy aufgenommen ist das in Ordnung, wenn das Bild ruhig und hell ist.",
      },
      {
        q: "Wie zeigen wir den Notdienst auf der Seite?",
        a: "Die Notdienstnummer steht in der Kopfleiste, auf jeder Unterseite. Dazu kommt ein eigener Abschnitt mit Zeiten und Gebiet. Wer einen Wasserschaden hat, soll sofort anrufen können und nicht erst ein Formular ausfüllen.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "reinigung",
    label: "Reinigungsfirmen",
    inquirySlug: "reinigung",
    image: {
      src: "/images/sitalo-reinigung-laptop.webp",
      alt: "Musterseite für eine Reinigungsfirma auf einem Laptop, daneben ein Mikrofasertuch und eine Sprühflasche.",
    },
    atmosphere: {
      src: "/images/atmosphere/reinigung-flur.webp",
      alt: "Sauberer Büroflur mit glänzendem Boden und einem Reinigungswagen.",
    },
    shortBody:
      "Reinigung wird in Leistungspaketen verkauft. Die Seite stellt Ihre Pakete nebeneinander und zeigt, warum man Ihrem Team den Schlüssel geben kann.",
    bullets: [
      "Leistungspakete im Vergleich",
      "Anfrageformular mit Objektart, Fläche und Turnus",
      "Einsatzgebiet und Objektarten",
      "Versicherung und Umgang mit Schlüsseln",
      "Notdienst, falls angeboten",
    ],
    detailHeadline: "Ihre Pakete nebeneinander und eine Anfrage in wenigen Schritten.",
    detailIntro: [
      "Wer eine Reinigungsfirma beauftragt, schaut auf den Preis und muss fremden Leuten seine Räume überlassen. Ihre Seite sollte deshalb früh zeigen, dass Ihre Mitarbeiter:innen eingewiesen und versichert sind. Das erspart Ihnen viele Fragen am Telefon.",
      "Viele Anfragende vergleichen Angebote: Unterhaltsreinigung im Büro, Privathaushalt, Grundreinigung, Fenster. Stehen Ihre Pakete klar nebeneinander, vergleichen sie gleich auf Ihrer Seite und nicht bei der Konkurrenz.",
    ],
    typicalPages: [
      "Startseite",
      "Pakete und Leistungen",
      "Objektarten",
      "Über uns und das Team",
      "Einsatzgebiet",
      "Angebot anfragen",
    ],
    features: [
      {
        title: "Pakete im Vergleich",
        body: "Büro, Privat und Grundreinigung nebeneinander, jeweils mit Leistungen, Turnus und Mindestumfang.",
      },
      {
        title: "Anfrage in Schritten",
        body: "Ein Formular in kurzen Schritten: Objektart, Fläche, Turnus, Sonderwünsche. Sie bekommen eine vollständige Anfrage und können direkt ein Angebot schreiben.",
      },
      {
        title: "Nachweise",
        body: "Versicherung, Einweisung des Personals, Umgang mit Schlüsseln und mit Daten. Das sind die Fragen, die Auftraggeber zuerst stellen.",
      },
      {
        title: "Stimmen von Auftraggebern",
        body: "Echte Rückmeldungen Ihrer Kunden, mit deren Einverständnis. In der Reinigung schauen Interessenten besonders genau darauf.",
      },
    ],
    faq: [
      {
        q: "Sollen Preise auf die Seite?",
        a: "Genaue Preise selten, weil Fläche, Turnus und Sonderwünsche den Preis bestimmen. Sinnvoll ist ein Einstiegspreis pro Stunde oder Quadratmeter und daneben das Anfrageformular.",
      },
      {
        q: "Brauchen Auftraggeber und Bewerber getrennte Bereiche?",
        a: "Ja. Zwei klar getrennte Knöpfe, einer für Aufträge und einer für Bewerbungen. In der Reinigung suchen die meisten Betriebe beides: Kunden und Personal.",
      },
      {
        q: "Können wir Zertifikate zeigen?",
        a: "Ja. ISO-Zertifikate, RAL-Gütezeichen oder die Mitgliedschaft in der Innung zeigen wir mit Logo und einer kurzen Erklärung auf der Seite.",
      },
      {
        q: "Wie zeigen wir Büro, Privat und Industrie übersichtlich?",
        a: "Jeder Bereich bekommt eine eigene Unterseite mit eigenen Preisangaben und eigenem Formular. Auf der Startseite stehen drei kurze Einstiege. So wissen Sie bei jeder Mail sofort, um welchen Bereich es geht.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "kanzlei",
    label: "Kanzleien",
    inquirySlug: "kanzlei",
    image: {
      src: "/images/sitalo-kanzlei-laptop.webp",
      alt: "Musterseite für eine Kanzlei auf einem Laptop, daneben eine Schreibtischlampe aus Messing und gebundene Bücher.",
    },
    atmosphere: {
      src: "/images/atmosphere/kanzlei-buecher.webp",
      alt: "Bücherwand einer Kanzlei mit dunkelgrün gebundenen Gesetzbüchern und einer Messinglampe.",
    },
    shortBody:
      "Mandant:innen suchen nach einem Rechtsgebiet und einem Ort. Die Seite nennt Ihre Schwerpunkte klar und bietet einen diskreten Weg zur ersten Anfrage.",
    bullets: [
      "Rechtsgebiete auf eigenen Seiten",
      "Anwältinnen und Anwälte mit Schwerpunkten",
      "Diskrete Mandatsanfrage",
      "Ruhige, sachliche Gestaltung",
      "Sprech- und Rückrufzeiten",
    ],
    detailHeadline: "Eine sachliche Seite mit einem diskreten Weg zur Mandatsanfrage.",
    detailIntro: [
      "Wer einen Anwalt sucht, hat meist ein konkretes Problem, etwa eine Kündigung oder einen Streit ums Erbe. Gesucht wird nach dem Rechtsgebiet und dem Ort. Ihre Seite muss zeigen, dass Sie genau dafür zuständig sind, und das ohne laute Werbung.",
      "Viele schreiben ungern über ihr Anliegen in ein Formular. Die erste Anfrage soll deshalb kurz sein und sachlich klingen. Ein Knopf wie „Jetzt kostenlos beraten lassen!“ passt nicht zu einer Kanzlei, „Mandat anfragen“ schon.",
    ],
    typicalPages: [
      "Startseite",
      "Rechtsgebiete, je eine Seite",
      "Anwältinnen und Anwälte",
      "Mandatsanfrage",
      "Kosten und Honorar",
      "Kanzlei und Anfahrt",
    ],
    features: [
      {
        title: "Rechtsgebiete einzeln",
        body: "Eine Seite pro Schwerpunkt, etwa Familienrecht oder Arbeitsrecht. So wird die Kanzlei auch bei Suchen wie „Anwalt Familienrecht Eimsbüttel“ gefunden.",
      },
      {
        title: "Diskrete Anfrage",
        body: "Wenige Pflichtfelder und ein sachlicher Ton. Die Anfrage geht verschlüsselt an Ihre Kanzlei.",
      },
      {
        title: "Profile der Anwälte",
        body: "Fachanwaltstitel, Veröffentlichungen, Mitgliedschaften. Kurz gefasst, wie ein Lebenslauf in einer Fachzeitschrift.",
      },
      {
        title: "Nach den Regeln des Berufsrechts",
        body: "Pflichtangaben, sachlicher Ton, keine Werbung um das einzelne Mandat. Wir kennen die Vorgaben der BRAO, die Prüfung im Einzelfall bleibt bei Ihnen.",
      },
    ],
    faq: [
      {
        q: "Was darf eine Kanzlei-Website werblich überhaupt?",
        a: "Mehr, als viele denken. Erlaubt ist sachliche Information über Ihre Arbeit. Reklamehafte Werbung und Werbung um ein Mandat im Einzelfall sind es nicht. Wir kennen § 43b BRAO und die üblichen Stolperstellen.",
      },
      {
        q: "Können Mandantenbewertungen auf die Seite?",
        a: "Das ist berufsrechtlich heikel. Möglich sind anonymisierte Fallbeispiele und sachliche Hinweise auf Referenzen. Sternebewertungen wie beim Restaurant empfehlen wir nicht.",
      },
      {
        q: "Welcher Stil passt zu meiner Kanzlei?",
        a: "Eine eingesessene Kanzlei verträgt eine klassische Schrift und gedeckte Farben. Eine junge Wirtschaftskanzlei wirkt mit einer klaren, schlichten Gestaltung glaubwürdiger. Entscheidend ist, wer zu Ihnen kommt.",
      },
      {
        q: "Soll die Erstberatung auf der Seite stehen?",
        a: "Ja, mit dem Modell, das Sie anbieten. Üblich sind drei: kostenlos, zu einem festen Betrag oder nach Stundensatz ab der ersten Minute. Wer das vorher weiß, kommt mit klareren Erwartungen.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "fitness",
    label: "Fitnessstudios",
    inquirySlug: "fitness",
    image: {
      src: "/images/sitalo-fitness-laptop.webp",
      alt: "Musterseite für ein Fitnessstudio auf einem Laptop im Studio.",
    },
    atmosphere: {
      src: "/images/atmosphere/fitness-studio.webp",
      alt: "Studio mit einer Reihe Kettlebells und hohen Fenstern im Morgenlicht.",
    },
    shortBody:
      "Ein Studio gewinnt Mitglieder über das Probetraining. Auf Ihrer Seite sind Probetraining und Kursplan deshalb ohne Suchen zu finden.",
    bullets: [
      "Kursplan und Trainer:innen",
      "Probetraining mit einem kurzen Formular",
      "Mitgliedschaft anfragen",
      "Öffnungszeiten und Adresse",
      "Bilder vom Studio",
    ],
    detailHeadline: "Eine Seite, über die man ein Probetraining bucht.",
    detailIntro: [
      "Die Entscheidung für ein Studio fällt meist beim Probetraining. Wer nicht ausprobiert hat, unterschreibt keinen Vertrag. Ihre Seite hat deshalb eine Hauptaufgabe: Das Probetraining soll schnell angefragt sein.",
      "Dazu kommen Kursplan, Trainer:innen und Bilder vom Studio. Die Gestaltung bleibt ruhig, damit Ihr Studio nicht nach Discounter aussieht. Es sei denn, Sie sind einer.",
    ],
    typicalPages: [
      "Startseite mit Probetraining",
      "Kursplan",
      "Trainer:innen",
      "Mitgliedschaften und Preise",
      "Probetraining anfragen",
      "Bilder vom Studio",
    ],
    features: [
      {
        title: "Probetraining vorne",
        body: "Der Knopf steht auf jeder Seite. Das Formular fragt nur Name, Kontakt und Wunschtag ab.",
      },
      {
        title: "Kursplan",
        body: "Mit Premium pflegen Sie den Plan selbst und ändern Zeiten oder Trainer:innen ohne uns. Sonst schicken Sie uns die Änderung.",
      },
      {
        title: "Mitgliedschaften nebeneinander",
        body: "Drei oder vier Tarife mit Leistungen, Preis und Laufzeit. Was im Vertrag steht, steht auch auf der Seite.",
      },
      {
        title: "Echte Bilder",
        body: "Fotos aus Ihrem Studio, mit Ihren Trainer:innen und Ihren Geräten. Bilder aus einer Bilddatenbank sehen in jedem Studio gleich aus.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine Trainer-Buchung mit Kalender?",
        a: "Für Personal Training lohnt sie sich, dafür binden wir zum Beispiel Calendly oder ein ähnliches System ein. Für Gruppenkurse reichen meist der Kursplan und eine Anmeldung vor Ort.",
      },
      {
        q: "Lassen sich Mitgliedskarten und Check-in einbinden?",
        a: "Das läuft über Ihre Studioverwaltung, etwa Magicline oder Aidoo. Hat sie eine Schnittstelle, binden wir sie ein.",
      },
      {
        q: "Wie wichtig sind Profile der Trainer:innen?",
        a: "Sehr. Personal Trainer werden gezielt gesucht. Stehen Ihre Trainer:innen mit Schwerpunkt und Foto auf der Seite, teilen sie den Link auch selbst.",
      },
      {
        q: "Wie sollte die Anfrage fürs Probetraining aussehen?",
        a: "Ein kurzer Knopf in der Kopfleiste, ein Formular mit drei Feldern (Name, E-Mail, Wunschtag) und eine Bestätigung, die möglichst noch am selben Tag kommt. Ein langes Anfrageformular schreckt eher ab.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "kosmetik",
    label: "Kosmetik- & Beautystudios",
    inquirySlug: "kosmetik",
    image: {
      src: "/images/sitalo-kosmetik-laptop.webp",
      alt: "Musterseite für ein Kosmetikstudio auf einem Laptop, daneben getrocknetes Pampasgras und kleine Pflegeprodukte.",
    },
    shortBody:
      "Kund:innen wählen ein Kosmetikstudio nach dem, was sie sehen. Die Seite zeigt Ihre Räume und Behandlungen und führt direkt zur Terminanfrage.",
    bullets: [
      "Behandlungen mit Dauer und Preis",
      "Vorher-Nachher-Galerie mit Einwilligung",
      "Terminanfrage per Formular",
      "Online-Buchung auf Wunsch",
      "Bilder aus Ihren Räumen",
    ],
    detailHeadline: "Eine Seite, die Ihre Räume und Ihre Arbeit zeigt.",
    detailIntro: [
      "Wer Ihre Räume nicht gesehen hat, bucht zögerlicher, auch wenn Ihre Behandlungen gut sind. Ihre Seite braucht deshalb gute Bilder, ruhige Farben und einen kurzen Weg zur Terminanfrage.",
      "Behandlungen finden am eigenen Körper statt. Eine aufgeräumte, sachliche Seite zeigt, dass bei Ihnen sorgfältig gearbeitet wird. Effekte braucht es dafür nicht.",
    ],
    typicalPages: [
      "Startseite",
      "Behandlungen und Preise",
      "Vorher und nachher",
      "Über mich und das Team",
      "Terminanfrage",
      "Adresse und Öffnungszeiten",
    ],
    features: [
      {
        title: "Bilder aus Ihrem Studio",
        body: "Große Bildflächen, zurückhaltende Farben und eine ruhige Schrift. Die Seite soll aussehen wie Ihr Studio und nicht wie ein Prospekt.",
      },
      {
        title: "Behandlungen und Preise",
        body: "Jede Behandlung mit Dauer und Preis oder Preisspanne. Damit sind viele Fragen schon vor dem ersten Anruf beantwortet.",
      },
      {
        title: "Vorher und nachher",
        body: "Nur mit schriftlicher Einwilligung der Kundin. Bei Permanent Make-up oder HydraFacial zeigen solche Bilder mehr als jede Beschreibung.",
      },
      {
        title: "Terminanfrage",
        body: "Wunschbehandlung, Wunschtermin und eine kurze Nachricht. Auf Wunsch binden wir ein Buchungssystem wie Treatwell an.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine Online-Buchung?",
        a: "Für kleine Studios reicht meist eine Terminanfrage per Formular. Arbeiten mehrere Behandlerinnen mit vollem Kalender, lohnt sich ein System wie Treatwell oder Shore. Das binden wir ein.",
      },
      {
        q: "Was gilt für Vorher-Nachher-Bilder?",
        a: "Bevor ein Bild online geht, braucht es die schriftliche Einwilligung der Kundin. Ein Muster für diese Einwilligung können wir Ihnen empfehlen. Möglich sind auch Ausschnitte, auf denen man niemanden erkennt, etwa nur die Augenpartie.",
      },
      {
        q: "Lohnt sich ein Instagram-Feed auf der Seite?",
        a: "Für Beauty-Studios oft ja, weil die Seite zwischen zwei Änderungen lebendig bleibt. Wir binden die Bilder so ein, dass beim Laden der Seite keine Daten an Instagram gehen.",
      },
      {
        q: "Können wir Gutscheine verkaufen?",
        a: "Ja, und vor Weihnachten oder Muttertag lohnt sich das. Am einfachsten kommt nach der Zahlung über Stripe ein Gutschein als PDF. Aufwendiger ist ein Gutschein mit Betrag und dem Namen der Beschenkten. Beides läuft direkt über Ihre Seite, ohne eigene Shop-Plattform.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "hotel",
    label: "Hotels & Pensionen",
    inquirySlug: "hotel",
    image: {
      src: "/images/sitalo-hotel-laptop.webp",
      alt: "Musterseite für ein kleines Hotel auf einem Laptop, auf dem Empfangstresen eine Klingel aus Messing und ein Blumenstrauß.",
    },
    shortBody:
      "Gäste sehen sich vor der Buchung die Website des Hauses an. Wer Zimmer und Preise sieht und direkt anfragen kann, bucht eher bei Ihnen als über ein Portal.",
    bullets: [
      "Zimmer in großen Bildern",
      "Buchungsanfrage direkt beim Haus",
      "Anfahrt und Umgebung",
      "Deutsch und Englisch auf Wunsch",
      "Bewertungen auf der Seite",
    ],
    detailHeadline: "Eine Seite, über die Gäste direkt bei Ihnen buchen.",
    detailIntro: [
      "Für jede Buchung über ein Portal wie Booking.com zahlen Sie Provision, für jede Direktbuchung nicht. Wer schon einmal bei Ihnen war, sucht beim nächsten Mal oft nach dem Namen des Hauses. Dann muss die eigene Seite überzeugen.",
      "Direkt gebucht wird, wenn die Seite gute Bilder zeigt, die Preise nennt und eine Anfrage ohne Umweg möglich ist. In vielen Häusern gehört eine englische Fassung dazu. Und ein kleines Haus hat eine Geschichte, die auf keinem Portal steht.",
    ],
    typicalPages: [
      "Startseite mit großem Bild",
      "Zimmer",
      "Das Haus",
      "Umgebung und Anfahrt",
      "Bewertungen",
      "Buchungsanfrage",
    ],
    features: [
      {
        title: "Bilder",
        body: "Zimmer, Frühstücksraum und Außenansicht in großen Galerien. Ein Tag mit einem Fotografen lohnt sich bei einem Hotel besonders.",
      },
      {
        title: "Direkte Anfrage",
        body: "Ein Formular für Datum, Personen und Zimmerwunsch. Die Bestätigung läuft per E-Mail, einen Channel-Manager brauchen Sie dafür nicht. Auf Wunsch binden wir Cloudbeds, Mews oder ein ähnliches System an.",
      },
      {
        title: "Deutsch und Englisch",
        body: "Beide Sprachen sorgfältig übersetzt und gleich gut gepflegt. Für Häuser mit vielen Gästen aus dem Ausland gehört das dazu.",
      },
      {
        title: "Bewertungen",
        body: "Bewertungen von Google und HolidayCheck auf der Seite, eingebunden ohne Tracking. Ein Cookie-Banner brauchen Sie dafür nicht.",
      },
    ],
    faq: [
      {
        q: "Konkurriert die eigene Seite mit Booking.com?",
        a: "Sie ergänzt das Portal. Über Booking finden neue Gäste zu Ihnen. Wer zufrieden war, sucht beim nächsten Mal nach Ihrem Namen und bucht direkt, wenn Ihre Seite es leicht macht.",
      },
      {
        q: "Brauche ich eine Verfügbarkeitsanzeige in Echtzeit?",
        a: "Nicht unbedingt. Kleinen Häusern reicht oft die Anfrage per Formular. Nutzen Sie Cloudbeds, Mews oder ein anderes Hotelprogramm, zeigen wir die Verfügbarkeit direkt auf der Seite an.",
      },
      {
        q: "Wie wichtig ist die englische Fassung?",
        a: "Das hängt von Ihren Gästen ab. Kommen viele aus dem Ausland, gehört sie dazu. Ein Blick in Ihre Buchungen der letzten Monate zeigt, wie viele es sind.",
      },
      {
        q: "Wie gewinnen wir Direktbuchungen gegen den Komfort der Portale?",
        a: "Mit einem kurzen Buchungsweg, höchstens drei Klicks bis zur Anfrage, und einem gut sichtbaren Hinweis, welchen Vorteil Gäste bei einer Direktbuchung haben. Den Weg bauen wir, den Vorteil legen Sie fest.",
      },
    ],
    recommendedPackage: "premium",
  },
];

export function getBrancheBySlug(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug);
}

export function getAllBrancheSlugs(): string[] {
  return BRANCHEN.map((b) => b.slug);
}

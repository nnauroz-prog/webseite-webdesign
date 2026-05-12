/**
 * Branchen-Datenmodell. Eine einzige Quelle für die /branchen-Übersicht
 * und alle /branchen/[slug]-Detailseiten.
 *
 * Jeder Eintrag liefert:
 *   - kurze Übersichtsdaten für die /branchen-Karte und den Industry-Picker
 *   - längere, branchen-spezifische Inhalte für die Detail-Landingpage
 *
 * Bewusst eng gehalten — wir liefern echte Substanz pro Branche, statt
 * austauschbarer Marketing-Floskeln.
 */

export type Branche = {
  /** URL-Slug. /branchen/[slug] */
  slug: string;
  /** Anzeigename, z. B. "Pflegedienste". */
  label: string;
  /** Kurze Beschreibung (1–2 Sätze) für Übersicht & Picker. */
  shortBody: string;
  /** Bullet-Features für die Übersicht. */
  bullets: string[];
  /** Vorgeschlagener ?branche=... Wert im Anfrageformular. */
  inquirySlug: string;
  /** Hero-Foto für Übersicht + Detail-Hero. */
  image?: { src: string; alt: string };

  /* === Erweiterte Inhalte für /branchen/[slug] === */

  /** Editoriale Headline-Zeile (zweiter Teil des Hero in Serif-Italic). */
  detailHeadline: string;
  /** 2–3 Absätze als Intro auf der Detailseite. */
  detailIntro: string[];
  /** Typische Seitenstruktur, die wir für diese Branche bauen. */
  typicalPages: string[];
  /** Konkrete Funktionen / Bausteine. */
  features: { title: string; body: string }[];
  /** Branchen-spezifische FAQ. */
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
      src: "/images/sitalo-pflege-laptop.png",
      alt: "Pflegedienst-Website von Sitalo auf einem Laptop, im warmen Tageslicht eines Büros mit Pflanzen und Notizbuch.",
    },
    shortBody:
      "Pflegedienste verkaufen Vertrauen. Die Website muss Leistungen, Einzugsgebiet und Bewerbungsweg auf einen Blick zeigen.",
    bullets: [
      "Leistungen klar strukturiert (Grund-, Behandlungs-, Verhinderungspflege …)",
      "Einsatzgebiet auf Karte oder als Liste",
      "Notfall- und Direktkontakt prominent",
      "Bewerbungsformular für Pflegekräfte",
      "Vertrauensaufbau über Team, Werte und Zertifikate",
    ],
    detailHeadline: "Eine Seite, die Vertrauen aufbaut — und Bewerbungen bringt.",
    detailIntro: [
      "Angehörige wählen einen Pflegedienst selten leichtfertig. Sie googeln, vergleichen, lesen Bewertungen und schauen sich Teams an. Wenn Ihre Seite seriös wirkt, die Leistungen klar erklärt und der Anruf nur einen Tipp entfernt ist, gewinnen Sie das Telefonat — sonst der nächste Eintrag in der Liste.",
      "Gleichzeitig ist die teuerste Ressource im Pflegedienst nicht die Website, sondern fehlendes Personal. Eine Seite ohne sichtbares Bewerbungsformular verschenkt täglich Chancen.",
    ],
    typicalPages: [
      "Startseite mit Leistungsüberblick",
      "Leistungen (Grundpflege, Behandlungspflege, …)",
      "Über uns / Team",
      "Bewerben (für Pflegekräfte)",
      "Einzugsgebiet & Anfahrt",
      "Kontakt mit 24-h-Erreichbarkeit",
    ],
    features: [
      {
        title: "Leistungen verständlich erklärt",
        body: "Grund-, Behandlungs-, Verhinderungspflege — was bedeuten die Pflegegrade für Angehörige? Klar in Alltagssprache, ohne Fachchinesisch.",
      },
      {
        title: "Bewerbungsformular für Pflegekräfte",
        body: "Eigenes, gut sichtbares Formular für Pflegekräfte. Optional mit Datei-Upload für den Lebenslauf.",
      },
      {
        title: "Einsatzgebiet sofort sichtbar",
        body: "Karte oder klare Liste der Stadtteile — Anrufer:innen wissen sofort, ob Sie zu ihnen kommen.",
      },
      {
        title: "Vertrauenssignale prominent",
        body: "Team mit Fotos, Pflegegrade-Erklärung, Zertifikate, Kassen-Hinweise und ein deutlicher Notfallkontakt.",
      },
    ],
    faq: [
      {
        q: "Können Pflege-Spezifika wie MDK-Prüfungen mit auf die Seite?",
        a: "Ja — Transparenz-Berichte, Pflegenoten und Zertifikate gehören sichtbar auf die Seite. Ich strukturiere das so, dass es Vertrauen aufbaut, ohne überladen zu wirken.",
      },
      {
        q: "Brauchen wir ein Bewerber-Portal mit Login?",
        a: "Nein. Ein gut platziertes Bewerbungsformular reicht. Die Bewerbung landet direkt in Ihrem Postfach — kein Portal, kein Login.",
      },
      {
        q: "Wie schnell können wir live gehen?",
        a: "Bei einer Pflegedienst-Seite mittlerer Größe rechnen Sie mit 5–10 Werktagen ab kompletter Datenlieferung. Eine reine Onepager-Visitenkarte kann schon nach 1–2 Tagen stehen.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "praxis",
    label: "Arzt- und Zahnarztpraxen",
    inquirySlug: "praxis",
    image: {
      src: "/images/sitalo-praxis-laptop.png",
      alt: 'Zahnarztpraxis-Website von Sitalo („Moderne Zahnmedizin für Ihr schönstes Lächeln.") auf einem Laptop im hellen Praxisempfang.',
    },
    shortBody:
      "Patient:innen recherchieren vor dem ersten Termin. Die Seite muss seriös wirken, Sprechzeiten liefern und Termin-Anfragen reibungslos machen.",
    bullets: [
      "Sprechzeiten, Notdienst und Anfahrt prominent",
      "Behandlungen verständlich erklärt",
      "Team-Bereich mit Qualifikationen",
      "Online-Termin-Anfrage",
      "Seriöser, ruhiger Auftritt",
    ],
    detailHeadline: "Eine Praxis-Seite, die seriös wirkt — und Termine bringt.",
    detailIntro: [
      "Über 80% aller Patient:innen schauen vor dem ersten Termin online nach. Wenn Ihre Praxis-Seite veraltet wirkt oder Sprechzeiten und Adresse umständlich zu finden sind, entscheiden sie sich für die Praxis um die Ecke — auch wenn Ihre Behandlung besser wäre.",
      "Eine moderne Praxis-Seite muss zwei Dinge gleichzeitig leisten: seriös und kompetent wirken und gleichzeitig den nächsten Schritt — Termin-Anfrage, Anruf, Navigation — so reibungslos wie möglich machen.",
    ],
    typicalPages: [
      "Startseite",
      "Behandlungen / Leistungen",
      "Team mit Qualifikationen",
      "Praxis-Tour (Bilder)",
      "Sprechzeiten & Notdienst",
      "Termin-Anfrage",
      "Anfahrt & Parken",
    ],
    features: [
      {
        title: "Online-Termin-Anfrage",
        body: "Formular mit Wunschtermin, Anliegen und Kontaktdaten. Sie erhalten die Anfrage per E-Mail und bestätigen telefonisch oder per Antwort-Mail.",
      },
      {
        title: "Sprechzeiten + Notdienst sichtbar",
        body: "Reguläre Sprechzeiten, Sommerferien und ein klar markierter Notdienst-Bereich — alles auf einen Blick.",
      },
      {
        title: "Behandlungen verständlich",
        body: "Komplexe Behandlungen in patientenverständlicher Sprache. Mit kurzen Erklärungen, Kosten-Hinweisen und Kassen-Informationen.",
      },
      {
        title: "Team mit Vita",
        body: "Foto, Spezialisierung, Werdegang. Patient:innen wollen wissen, wer sie behandelt — gerade vor dem ersten Termin.",
      },
    ],
    faq: [
      {
        q: "Brauche ich ein Online-Buchungs-Tool?",
        a: "Nicht zwingend. Eine gut gestaltete Termin-Anfrage per Formular reicht für die meisten Praxen. Wenn Sie ein Online-Buchungssystem wie Doctolib oder Jameda nutzen, integriere ich das nahtlos in Ihre Seite.",
      },
      {
        q: "Was ist mit Heilmittelwerbegesetz (HWG)?",
        a: "Ich kenne die Grundlagen und sorge dafür, dass Heilversprechen und vergleichende Werbung vermieden werden. Den finalen HWG-Check übernehmen aber Sie oder Ihre Standesvertretung.",
      },
      {
        q: "Können Patientenbewertungen eingebunden werden?",
        a: "Ja — Google-Bewertungen können automatisch angezeigt werden. Jameda-Bewertungen sind technisch komplizierter, aber möglich.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "friseur",
    label: "Friseure & Kosmetikstudios",
    inquirySlug: "friseur",
    image: {
      src: "/images/sitalo-friseur-mobile.png",
      alt: 'Friseur-Website von Sitalo auf einem iPhone, daneben gedruckte Visitenkarten und ein Flyer für „Friseur am Markt".',
    },
    shortBody:
      "Bilder verkaufen. Die Seite lebt von hochwertigen Aufnahmen, klaren Preisen und einem direkten Weg zur Termin-Anfrage.",
    bullets: [
      "Galerie mit Lightbox",
      "Leistungen und Preise transparent",
      "Termin-Anfrage per Formular oder WhatsApp",
      "Online-Reservierung auf Wunsch",
      "Ruhige, hochwertige Atmosphäre",
    ],
    detailHeadline: "Eine Seite, auf der man sehen will, was Sie können.",
    detailIntro: [
      "Im Friseur- und Kosmetik-Geschäft wird die Entscheidung über Augen getroffen. Wer Ihre Arbeit nicht sieht, ruft auch nicht an. Deshalb sind die Bilder auf Ihrer Seite kein Schmuck, sondern das wichtigste Verkaufsargument.",
      "Genauso wichtig: transparente Preise und ein direkter Weg zur Buchung. Die meisten Anfragen kommen heute über das Handy — Tippen auf Telefonnummer, kurze WhatsApp, fertig. Wenn das nicht funktioniert, ist die Anfrage weg.",
    ],
    typicalPages: [
      "Startseite mit Galerie",
      "Leistungen + Preise",
      "Bilder / Vorher-Nachher",
      "Termin-Anfrage",
      "Team & Stylist:innen",
      "Standort + Öffnungszeiten",
    ],
    features: [
      {
        title: "Hochwertige Bildergalerie",
        body: "Lightbox-Galerie mit Ihren besten Arbeiten. Optional Vorher-Nachher-Vergleiche, Kategorisierung nach Service oder Stylist.",
      },
      {
        title: "Transparente Preisliste",
        body: "Klar strukturierte Preise nach Service. Können Sie selbst aktualisieren, ohne mich zu kontaktieren.",
      },
      {
        title: "Direkter Buchungsweg",
        body: "Tippen-zum-Anrufen aufs Handy, WhatsApp-Button, Termin-Anfrage per Formular. Auf Wunsch auch Anbindung an Online-Buchungssysteme.",
      },
      {
        title: "Team-Vorstellung",
        body: "Foto, Spezialisierung, Werdegang Ihrer Stylist:innen — Stammkund:innen suchen ihren Stylisten gezielt aus.",
      },
    ],
    faq: [
      {
        q: "Soll ich Preise wirklich öffentlich zeigen?",
        a: "Ja, unbedingt. Kund:innen, die nach Preisen suchen, finden sie sonst woanders. Transparente Preise filtern außerdem Anfragen vor — Sie sparen Telefonate über Preise.",
      },
      {
        q: "Welche Online-Buchung passt zu mir?",
        a: "Für kleine Studios reicht oft eine gute Termin-Anfrage. Bei größeren Salons mit Stylist-Auswahl und Kalender-Slots lohnt sich ein System wie Treatwell, Booksy oder Shore. Ich binde das passende nahtlos ein.",
      },
      {
        q: "Wie werden meine Bilder professionell?",
        a: "Wenn Sie eigene Fotos haben, bereite ich diese auf (Beschnitt, Farbe, Optimierung). Wenn keine vorhanden sind, empfehle ich einen lokalen Fotografen — das ist eine Investition, die sich um ein Vielfaches auszahlt.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "gastro",
    label: "Cafés & Restaurants",
    inquirySlug: "gastro",
    image: {
      src: "/images/sitalo-cafe-mobile.png",
      alt: "Café-Website von Sitalo auf einem iPhone, vor einem Café im Hintergrund — daneben eine Sitalo-Webdesign-Visitenkarte.",
    },
    shortBody:
      "Die meisten Gäste googeln vorm Besuch. Speisekarte, Öffnungszeiten und Anfahrt müssen sofort sichtbar sein — und änderbar.",
    bullets: [
      "Speisekarte als verwaltbarer Inhalt",
      "Wochenangebot oder Mittagstisch änderbar",
      "Öffnungszeiten und Feiertage prominent",
      "Reservierungs-Anfrage",
      "Google Maps + Direktwahl-Telefon",
    ],
    detailHeadline: "Speisekarte. Öffnungszeiten. Anfahrt. Direkt sichtbar.",
    detailIntro: [
      "Ein Gast, der am Handy nach Ihrem Café sucht, hat in den meisten Fällen genau drei Fragen: Was kostet's? Haben Sie heute auf? Wie komme ich hin? Wenn diese drei Antworten nicht innerhalb von Sekunden zu finden sind, geht er ins nächste Lokal.",
      "Genauso wichtig: Ihre Speisekarte muss aktuell sein. Eine veraltete PDF vom letzten Jahr vermittelt sofort den Eindruck, dass die Küche genauso unkonzentriert läuft. Deshalb empfehle ich für Gastro-Seiten immer verwaltbare Inhalte — Sie aktualisieren Mittagskarte oder Wochenangebot selbst, ohne mich anzurufen.",
    ],
    typicalPages: [
      "Startseite mit Tagesangebot",
      "Speisekarte (selbst pflegbar)",
      "Über uns / Geschichte",
      "Galerie",
      "Reservierung",
      "Öffnungszeiten & Anfahrt",
    ],
    features: [
      {
        title: "Selbst-pflegbare Speisekarte",
        body: "Sie ändern Mittagstisch oder Wochenangebot direkt auf der Seite — ohne mich anzurufen. Premium-Funktion, lohnt sich praktisch immer.",
      },
      {
        title: "Reservierungs-Anfrage",
        body: "Schlankes Formular mit Datum, Uhrzeit, Personenzahl. Sie bestätigen per Mail oder Anruf. Bei größerem Bedarf binde ich Online-Reservierungs-Systeme an.",
      },
      {
        title: "Standort + Öffnungszeiten",
        body: "Karte, Adresse, Öffnungszeiten und Feiertagsregelungen prominent. Tippen-zum-Anrufen aufs Handy.",
      },
      {
        title: "Visuell schmackhaft",
        body: "Bilder von Gerichten, Atmosphäre, Team. Gute Fotos verkaufen einen Restaurantbesuch besser als jeder Text.",
      },
    ],
    faq: [
      {
        q: "Brauche ich einen Online-Lieferservice-Bestellprozess?",
        a: "Für reine Bestell-Abwicklung sind Lieferando und Co. effizienter als eine eigene Lösung. Was wir sinnvoll machen: einen direkten Bestell-Knopf auf Ihrer Seite, der zu Ihrem Lieferando-Profil führt — keine Provisionen für die Klick-Strecke.",
      },
      {
        q: "Wie oft kann ich die Speisekarte ändern?",
        a: "So oft Sie wollen — bei einer Premium-Seite ist das ein Werkzeug, das Sie selbst bedienen. Bei Starter und Business gehört das zur monatlichen Betreuung (1, 3 oder 6 Änderungen je nach Paket).",
      },
      {
        q: "Können wir auch eine englische Version anbieten?",
        a: "Ja — gerade in Hamburg sehr sinnvoll für Cafés und Restaurants in Touri-Lagen. Mehrsprachigkeit besprechen wir im Erstgespräch.",
      },
    ],
    recommendedPackage: "premium",
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    inquirySlug: "handwerker",
    image: {
      src: "/images/sitalo-handwerker-laptop.png",
      alt: 'Tischlerei-Website von Sitalo („Maßarbeit mit Tradition und Leidenschaft") auf einem Laptop auf einer Werkbank.',
    },
    shortBody:
      "Im Handwerk kommt der Auftrag oft vor dem ersten Telefonat. Eine Seite mit Leistungen, Referenzen und kurzem Anfrageweg gewinnt Aufträge.",
    bullets: [
      "Leistungen und Einsatzgebiet klar",
      "Galerie mit umgesetzten Projekten",
      "Rückruf-Anfrage und WhatsApp",
      "Notfall- und Direktkontakt",
      "Vertrauen durch Team, Innung, Zertifikate",
    ],
    detailHeadline: "Eine Seite, die Aufträge bringt — nicht nur Visitenkarte ist.",
    detailIntro: [
      "Im Handwerk entscheiden sich Kund:innen häufig nach drei Klicks: Galerie geöffnet, ein Referenzprojekt angeschaut, Kontaktnummer notiert. Wenn Ihre Seite diese drei Schritte nicht reibungslos liefert, verlieren Sie an die Konkurrenz — oft an Konkurrenz, deren handwerkliche Arbeit nicht besser ist.",
      "Gleichzeitig sind Sie selten am Schreibtisch. Eine Website, die das berücksichtigt, hat eine prominente Rückruf-Anfrage, klar erreichbare Telefonnummer und WhatsApp-Button — und ein Layout, das auf der Baustelle am Handy lesbar bleibt.",
    ],
    typicalPages: [
      "Startseite mit Leistungs-Überblick",
      "Leistungen im Detail",
      "Referenzen / Galerie",
      "Über uns / Werkstatt-Einblicke",
      "Einsatzgebiet",
      "Anfrage / Rückruf",
    ],
    features: [
      {
        title: "Referenz-Galerie",
        body: "Ihre besten Projekte mit Vorher-Nachher, Beschreibung und Standort. Stärkstes Verkaufsargument im Handwerk.",
      },
      {
        title: "Rückruf-Anfrage",
        body: "Schlankes Formular: Name, Nummer, kurze Beschreibung. Sie rufen zurück, wenn die Hände frei sind. Funktioniert besser als ein langes Kontaktformular.",
      },
      {
        title: "WhatsApp & Direktwahl",
        body: "Tippen-zum-Anrufen aufs Handy, WhatsApp-Button für schnelle Rückfragen mit Foto.",
      },
      {
        title: "Vertrauen durch Details",
        body: "Innungsmitgliedschaft, Meisterbrief, Versicherungen, Erfahrungsjahre. Was Sie bereits haben, gehört sichtbar auf die Seite.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine Online-Terminbuchung?",
        a: "Im Handwerk eher nicht. Ein Anruf oder eine Rückruf-Anfrage funktionieren besser, weil Sie vor der Termin-Zusage oft kurz nachfragen müssen. Das Telefon bleibt im Handwerk der direkteste Kanal.",
      },
      {
        q: "Wie viele Bilder brauche ich?",
        a: "Mindestens 10–15 gute Referenzbilder. Wenn Sie weniger haben, machen wir sie in den nächsten Wochen — oder ich empfehle einen lokalen Fotografen, der für 200–400 € einen kompletten Foto-Tag macht.",
      },
      {
        q: "Können wir Werkstatt-Videos einbinden?",
        a: "Ja, sehr gerne. Kurze Videos (15–30 Sek.) von Arbeitsschritten oder fertigen Projekten ziehen die Aufmerksamkeit deutlich. Aufnahmen über Handy reichen aus — Hauptsache stabil und hell.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "reinigung",
    label: "Reinigungsfirmen",
    inquirySlug: "reinigung",
    image: {
      src: "/images/sitalo-reinigung-laptop.png",
      alt: 'Reinigungs-Website von Sitalo („Saubere Räume. Besseres Arbeiten.") auf einem Laptop, daneben Sprühflasche, Tasse und Wischmopp.',
    },
    shortBody:
      "Reinigung wird über Service-Pakete verkauft. Die Seite muss Pakete vergleichbar machen und Vertrauen aufbauen.",
    bullets: [
      "Service-Pakete im direkten Vergleich",
      "Angebot anfragen mit konfigurierbarer Auswahl",
      "Einsatzgebiet und Objektarten klar",
      "Versicherungs- und DSGVO-Hinweise",
      "24/7-Notdienst (falls angeboten)",
    ],
    detailHeadline: "Pakete vergleichbar. Vertrauen sichtbar. Anfrage schnell.",
    detailIntro: [
      "Der Reinigungs-Markt ist preissensitiv und vertrauenssensitiv zugleich. Wer in fremde Räume gelassen wird, muss schnell vermitteln, dass die Mitarbeiter:innen geschult, versichert und zuverlässig sind. Eine klare Website mit transparenten Paketen erspart Ihnen Telefonate über Selbstverständlichkeiten.",
      "Gleichzeitig kommt fast jede Anfrage von Auftraggebenden, die Pakete vergleichen wollen — Privatreinigung, Büroreinigung, Grundreinigung, Glasreinigung. Wenn diese Pakete auf Ihrer Seite nicht klar nebeneinanderstehen, vergleichen sie auf der Seite der Konkurrenz.",
    ],
    typicalPages: [
      "Startseite",
      "Pakete & Leistungen",
      "Objekte & Branchen",
      "Über uns / Mitarbeiter",
      "Einsatzgebiet",
      "Angebot anfragen",
    ],
    features: [
      {
        title: "Paket-Vergleichstabelle",
        body: "Mehrere Pakete (z. B. Büro, Privat, Grundreinigung) nebeneinander mit Leistungen, Häufigkeit, Mindestumfang.",
      },
      {
        title: "Angebot-Konfigurator",
        body: "Multistep-Formular: Objektart, Größe, Häufigkeit, Sonderwünsche. Sie erhalten eine strukturierte Anfrage und antworten mit einem konkreten Angebot.",
      },
      {
        title: "Vertrauenssignale",
        body: "Versicherungsnachweis, geschulte Mitarbeiter:innen, DSGVO-konforme Schlüsselverwaltung, Referenzen.",
      },
      {
        title: "Bewertungen / Referenzen",
        body: "Stimmen zufriedener Kunden — gerade im Reinigungsgewerbe stärkster Vertrauensbaustein.",
      },
    ],
    faq: [
      {
        q: "Sollen Preise direkt auf der Seite stehen?",
        a: 'Im Reinigungsgewerbe selten exakt, weil zu viele Faktoren reinspielen (Fläche, Häufigkeit, Sonderwünsche). Sinnvoll ist eine klare Preisspanne („Büroreinigung ab 22 €/Std netto") und ein Angebot-Konfigurator.',
      },
      {
        q: "Brauche ich einen separaten Bereich für Auftraggeber:innen vs. Bewerber:innen?",
        a: "Ja — zwei klar getrennte CTAs, einer für Auftrag, einer für Bewerbung. Beides ist im Reinigungsgewerbe wichtig.",
      },
      {
        q: "Können wir Hygiene-Zertifikate einbinden?",
        a: "Ja, gerne. ISO-Zertifikate, RAL-Gütezeichen, Brancheninnungs-Mitgliedschaften sind Vertrauenssignale, die direkt aufs Logo-Format auf die Seite kommen.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "kanzlei",
    label: "Kanzleien",
    inquirySlug: "kanzlei",
    image: {
      src: "/images/sitalo-kanzlei-laptop.png",
      alt: 'Kanzlei-Website von Sitalo („Recht, das Klarheit schafft.") auf einem Laptop im Büro mit Aktenordnern und Tasse.',
    },
    shortBody:
      "Bei Kanzleien zählt Seriosität. Klare Rechtsgebiete, ruhiger Auftritt, vertrauliche Erstkontakt-Anfrage.",
    bullets: [
      "Rechtsgebiete übersichtlich",
      "Team mit Spezialisierungen",
      "Vertrauliche Erstberatungs-Anfrage",
      "Seriöse Typografie, ruhiges Schema",
      "Klare Sprech- und Rückrufzeiten",
    ],
    detailHeadline: "Eine Seite, die so seriös wirkt wie Ihre Akte.",
    detailIntro: [
      "Mandant:innen suchen Kanzleien nicht über Werbeknall, sondern über Präzision. Eine Kanzlei-Seite muss durch Ruhe und Klarheit signalisieren: hier wird sauber gearbeitet, hier wird mein Fall ernst genommen.",
      'Genauso wichtig: Wer sich an eine Kanzlei wendet, hat oft ein Anliegen, das er nicht öffentlich diskutieren möchte. Die Erstkontakt-Anfrage muss diskret wirken — kein lautes „Jetzt kostenlos beraten lassen!", sondern ein sachlicher Schritt zur Mandatsanfrage.',
    ],
    typicalPages: [
      "Startseite",
      "Rechtsgebiete (eines pro Schwerpunkt)",
      "Team mit Vita",
      "Mandatsanfrage",
      "Kosten & Honorar (transparent)",
      "Kanzlei & Anfahrt",
    ],
    features: [
      {
        title: "Rechtsgebiete strukturiert",
        body: "Eine eigene Seite pro Schwerpunkt (Familienrecht, Arbeitsrecht, …). Jede gut formuliert, suchmaschinen-relevant — Mandant:innen googeln „Anwalt Familienrecht Eimsbüttel\".",
      },
      {
        title: "Vertrauliche Erstkontakt-Anfrage",
        body: "Diskret formuliertes Formular mit minimalen Pflichtfeldern. Optional verschlüsselte Übertragung. Keine reißerischen CTAs.",
      },
      {
        title: "Team mit Spezialisierungen",
        body: "Fachanwalts-Titel, Veröffentlichungen, Mitgliedschaften. Vita-Format wie in einer seriösen Branchen-Publikation.",
      },
      {
        title: "BRAO- und RDG-konform",
        body: "Pflichtangaben, sachliche Tonalität, keine vergleichende Werbung. Die anwaltsrechtlichen Vorgaben kenne ich im Detail.",
      },
    ],
    faq: [
      {
        q: "Was darf eine Kanzlei-Website werblich überhaupt?",
        a: "Mehr als viele denken — sachliche Information ist erlaubt, nur reklamehafte und vergleichende Werbung ist tabu. Ich kenne BRAO § 43b und die typischen Stolperfallen.",
      },
      {
        q: "Können Mandantenbewertungen auf die Seite?",
        a: "Im Standesrecht heikel. Anonymisierte Falldarstellungen und sachliche Referenz-Hinweise sind möglich. Sterne-Bewertungen wie bei Restaurants empfehle ich nicht.",
      },
      {
        q: "Welcher Stil passt zu meiner Kanzlei?",
        a: "Klassisch-konservativ (Serif, gedeckte Farben) für etablierte Boutique-Kanzleien. Modern-reduziert (Sans-Serif, viel Weiß) für junge Wirtschaftskanzleien. Wir entscheiden nach Ihrer Mandantenstruktur.",
      },
    ],
    recommendedPackage: "business",
  },
  {
    slug: "fitness",
    label: "Fitnessstudios",
    inquirySlug: "fitness",
    image: {
      src: "/images/sitalo-fitness-laptop.png",
      alt: 'Fitnessstudio-Website von Sitalo („Stronger Every Day. Premium Training.") auf einem Laptop im Studio.',
    },
    shortBody:
      "Studios verkaufen Mitgliedschaften. Probetraining und Kursplan müssen ohne Hürden zu finden sein.",
    bullets: [
      "Kursplan und Trainer:innen sichtbar",
      "Probetraining mit einer Anfrage gebucht",
      "Mitgliedschaftsanfrage per Formular/WhatsApp",
      "Öffnungszeiten und Standort prominent",
      "Bildergalerie der Räumlichkeiten",
    ],
    detailHeadline: "Eine Seite, die das Probetraining buchen lässt.",
    detailIntro: [
      "Die Kaufentscheidung im Fitness-Studio läuft fast immer über das Probetraining. Wer es nicht ausprobiert hat, schließt keinen Vertrag. Ihre Seite hat also genau eine Hauptaufgabe: das Probetraining so einfach wie möglich machen.",
      "Drumherum braucht es ein paar Vertrauenssignale — Kursplan, Trainer:innen, Räumlichkeiten — und einen ruhigen Auftritt, der nicht nach Discount-Studio schreit (außer Sie sind eines).",
    ],
    typicalPages: [
      "Startseite mit Probetraining-CTA",
      "Kursplan / Trainingsangebot",
      "Trainer:innen",
      "Mitgliedschaften / Preise",
      "Probetraining buchen",
      "Studio-Galerie",
    ],
    features: [
      {
        title: "Probetraining im Mittelpunkt",
        body: "Auf jeder Seite sichtbar, primärer CTA. Schlankes Formular mit Wunschtermin und einer Rückfrage — keine 12 Pflichtfelder.",
      },
      {
        title: "Kursplan dynamisch",
        body: "Auf Wunsch selbst pflegbar. Sie ändern Kurs-Zeiten oder Trainer:in-Zuteilung ohne mich.",
      },
      {
        title: "Mitgliedschafts-Pakete vergleichbar",
        body: "Drei bis vier Mitgliedschafts-Optionen mit klaren Leistungen. Keine versteckten Kosten, keine kleingedruckten Mindestlaufzeiten.",
      },
      {
        title: "Atmosphäre über Bilder",
        body: "Gute Studio-Aufnahmen, die nicht nach Stock-Foto aussehen. Echte Trainer:innen, echte Geräte, echtes Licht.",
      },
    ],
    faq: [
      {
        q: "Brauche ich eine Trainer-Buchung mit Kalender?",
        a: "Für Personal-Training: ja, lohnt sich. Für Gruppenkurse: meistens nicht, ein Kursplan und Anwesenheit reichen. Bei Personal-Training binde ich z. B. Calendly oder ein vergleichbares System ein.",
      },
      {
        q: "Können Mitglieds-Karten / Check-in eingebunden werden?",
        a: "Das macht in der Regel Ihr Studio-Verwaltungssystem (Magicline, Aidoo, …). Ich binde die Schnittstelle ein, falls vorhanden.",
      },
      {
        q: "Wie wichtig sind Trainer-Bios?",
        a: "Sehr. Personal Trainer werden gezielt gesucht. Wenn Trainer:innen auf Ihrer Seite mit Spezialisierung, Foto und persönlicher Note auftauchen, gewinnen Sie auch deren persönliches Netzwerk.",
      },
    ],
    recommendedPackage: "business",
  },
];

export function getBrancheBySlug(slug: string): Branche | undefined {
  return BRANCHEN.find((b) => b.slug === slug);
}

export function getAllBrancheSlugs(): string[] {
  return BRANCHEN.map((b) => b.slug);
}

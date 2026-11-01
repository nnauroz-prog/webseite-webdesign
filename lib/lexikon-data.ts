/**
 * Lexikon-Datenmodell für /lexikon.
 *
 * Glossar in Alltagsdeutsch: die Begriffe, die Inhabern in Angeboten
 * für Websites begegnen. Pro Begriff zusätzlich die Zeile
 * „Entscheidend ist“, der eine Satz, der die Kaufentscheidung betrifft.
 *
 * Die Reihenfolge hier ist egal, die Seite sortiert alphabetisch.
 * Textregeln: keine Prozentwerte oder Studien, keine Garantien,
 * kein Spott über andere Anbieter.
 */

export type LexikonEntry = {
  /** Begriff, wie er einem Inhaber begegnet. */
  term: string;
  /** Slug für Anker-Links (#hosting etc.). */
  slug: string;
  /** Erklärung in Alltagsdeutsch, zwei bis vier Sätze. */
  plain: string;
  /** Der eine Satz, der für die Entscheidung zählt. */
  bottomLine: string;
};

export const LEXIKON: LexikonEntry[] = [
  {
    term: "Hosting",
    slug: "hosting",
    plain:
      "Der Ort, an dem Ihre Website liegt: ein Rechner in einem Rechenzentrum, der Tag und Nacht läuft und die Seite ausliefert, wenn jemand sie aufruft. Ohne Hosting keine Website, so wie ohne Ladenfläche kein Laden.",
    bottomLine:
      "Fragen Sie zwei Dinge: Steht der Server in der EU, und wer kümmert sich, wenn er ausfällt?",
  },
  {
    term: "Domain",
    slug: "domain",
    plain:
      "Ihre Adresse im Netz, zum Beispiel ihr-betrieb.de. Sie mieten die Domain jährlich bei einer Registrierungsstelle, eine .de-Adresse kostet meist weniger als 20 Euro im Jahr. Die Domain gehört dem, auf dessen Namen sie eingetragen ist.",
    bottomLine:
      "Lassen Sie die Domain immer auf Ihren eigenen Namen eintragen, nie auf den der Agentur.",
  },
  {
    term: "SSL-Zertifikat",
    slug: "ssl",
    plain:
      "Das kleine Schloss in der Adresszeile des Browsers. Es verschlüsselt die Verbindung zwischen Besucher und Website. Ohne SSL warnen Browser vor Ihrer Seite, und Google stuft sie ab.",
    bottomLine:
      "Für normale Websites gibt es SSL seit Jahren kostenlos. Steht es als eigener Posten im Angebot, fragen Sie nach, wofür.",
  },
  {
    term: "CMS",
    slug: "cms",
    plain:
      "Content-Management-System: die Oberfläche, mit der man Texte und Bilder einer Website ändert, ohne Code anzufassen. WordPress ist das bekannteste. Ein CMS ist nützlich, wenn sich Inhalte oft ändern, und Ballast, wenn nicht.",
    bottomLine:
      "Zählen Sie nach, wie oft Sie im letzten Jahr etwas ändern wollten. Bei ein paar Mal im Jahr ist eine kurze Mail an uns schneller als jedes CMS.",
  },
  {
    term: "SEO",
    slug: "seo",
    plain:
      "Suchmaschinenoptimierung: alles, was dazu beiträgt, dass Ihre Seite bei Google gefunden wird. Den größten Teil machen Grundlagen aus, also saubere Technik, klare Texte, korrekte Öffnungszeiten und ein gepflegtes Google-Unternehmensprofil. Der Rest braucht Geduld.",
    bottomLine:
      "Platz eins bei Google kann niemand garantieren. Steht das im Angebot, unterschreiben Sie besser nicht.",
  },
  {
    term: "Responsive Design",
    slug: "responsive",
    plain:
      "Eine Website, die sich an die Bildschirmgröße anpasst und auf dem Handy anders aufgebaut ist als auf dem Laptop. Das klingt selbstverständlich, trotzdem verrutschen viele ältere Seiten auf dem Handy oder zeigen winzige Schrift.",
    bottomLine:
      "Sehen Sie sich jede neue Seite zuerst auf dem eigenen Handy an, nicht am Rechner. Wir bauen die Ansicht fürs Handy zuerst.",
  },
  {
    term: "DSGVO",
    slug: "dsgvo",
    plain:
      "Die europäische Datenschutz-Grundverordnung. Für Ihre Website heißt das vor allem: keine Daten ohne Einwilligung sammeln, Datenschutzerklärung und Impressum korrekt führen und Dienste aus den USA nur mit Rechtsgrundlage einbinden.",
    bottomLine:
      "Eine Seite ohne Tracking braucht kein Cookie-Banner. Das ist der einfachste Weg, die DSGVO einzuhalten.",
  },
  {
    term: "Cookie-Banner",
    slug: "cookie-banner",
    plain:
      "Das Zustimmungsfenster beim ersten Besuch einer Seite. Rechtlich nötig ist es nur, wenn die Seite Cookies setzt, die technisch nicht notwendig sind, also vor allem für Tracking und Werbung.",
    bottomLine:
      "Wir bauen Seiten ohne Tracking-Cookies. Dann entfällt das Banner, und Ihre Besucher sehen sofort die Seite.",
  },
  {
    term: "Ladezeit / Core Web Vitals",
    slug: "ladezeit",
    plain:
      "Wie schnell Ihre Seite erscheint und auf Eingaben reagiert. Google misst das mit drei Kennzahlen (LCP, CLS, INP) und berücksichtigt sie beim Ranking. Wichtiger ist etwas anderes: Wer am Handy zu lange wartet, geht zurück zur Trefferliste.",
    bottomLine:
      "Testen Sie Ihre Seite selbst. Unser Ladezeit-Test zeigt die Werte in etwa einer halben Minute, ohne Anmeldung.",
  },
  {
    term: "Baukasten",
    slug: "baukasten",
    plain:
      "Systeme wie Wix, Squarespace oder Jimdo, mit denen man eine Website per Ziehen und Ablegen selbst zusammenstellt. Der Einstieg ist günstig und gut für alle, die Zeit dafür haben. Die Pflege bleibt bei Ihnen, und ein späterer Umzug ist aufwendig.",
    bottomLine:
      "Ein Baukasten ist wie eine Mietwohnung, eine eigene Seite wie Eigentum. Beides ist in Ordnung, wenn man weiß, was man unterschreibt.",
  },
  {
    term: "Impressumspflicht",
    slug: "impressum",
    plain:
      "Jede geschäftliche Website in Deutschland braucht ein Impressum mit Name, Anschrift und Kontaktdaten des Betreibers. Ein fehlerhaftes oder fehlendes Impressum kann abgemahnt werden.",
    bottomLine:
      "Name und ladungsfähige Anschrift müssen hinein, auch wenn es unangenehm ist. Ein Postfach reicht nicht.",
  },
  {
    term: "Barrierefreiheit",
    slug: "barrierefreiheit",
    plain:
      "Eine Website, die sich auch mit Screenreader, mit der Tastatur oder mit eingeschränktem Sehvermögen bedienen lässt. Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz für viele Angebote an Verbraucher. Sehr kleine Dienstleister sind ausgenommen, Ihre Kundschaft profitiert trotzdem.",
    bottomLine:
      "Gute Kontraste, eine lesbare Schrift und beschriftete Knöpfe. Das meiste davon ist sorgfältige Arbeit und kostet kaum extra.",
  },
  {
    term: "Google-Unternehmensprofil",
    slug: "google-business-profil",
    plain:
      "Der Eintrag, der erscheint, wenn jemand Ihren Betrieb oder Ihre Branche mit Ort bei Google sucht, mit Karte, Öffnungszeiten, Fotos und Bewertungen. Auf Englisch heißt er Google Business Profile, früher Google My Business. Für lokale Betriebe ist er oft so wichtig wie die Website, weil viele direkt auf der Karte entscheiden.",
    bottomLine:
      "Der Eintrag kostet nichts. Halten Sie Öffnungszeiten und Telefonnummer dort so aktuell wie auf Ihrer Website.",
  },
  {
    term: "Google Ads",
    slug: "google-ads",
    plain:
      "Bezahlte Anzeigen über und neben den normalen Suchergebnissen. Sie zahlen pro Klick, bei umkämpften lokalen Begriffen schnell mehrere Euro. Anzeigen wirken sofort und hören sofort auf zu wirken, wenn das Budget aufgebraucht ist.",
    bottomLine:
      "Erst die eigene Seite und das Google-Profil, dann Anzeigen. Sonst bezahlen Sie Klicks auf eine Seite, die nicht überzeugt.",
  },
  {
    term: "Conversion",
    slug: "conversion",
    plain:
      "Der Moment, in dem aus einem Besucher ein Kunde wird: ein Anruf, eine Anfrage, eine Reservierung. Die Conversion-Rate gibt an, wie viele von hundert Besuchern diesen Schritt gehen.",
    bottomLine:
      "Eine sichtbare Telefonnummer und ein kurzes Formular bringen mehr als jede Animation. Zählen Sie Anrufe und Anfragen, nicht Besucher.",
  },
  {
    term: "Cache",
    slug: "cache",
    plain:
      "Ein Zwischenspeicher, der fertige Teile einer Seite bereithält, statt sie bei jedem Aufruf neu zu bauen. Gut eingerichtet macht er Seiten spürbar schneller. Sein bekanntester Nebeneffekt: Nach einer Änderung sieht man noch kurz die alte Fassung.",
    bottomLine:
      "Erscheint Ihre Änderung nicht, liegt es fast immer am Cache. Laden Sie die Seite einmal neu, bevor Sie jemanden anrufen.",
  },
  {
    term: "Open Graph",
    slug: "open-graph",
    plain: `Ein kleiner Datensatz, den jede Seite mitschickt, damit Vorschaubild und Text beim Teilen auf WhatsApp, Facebook oder LinkedIn richtig aussehen. Ohne Open Graph erscheint nur eine nackte Adresse ohne Bild, und der Link wirkt halbfertig.`,
    bottomLine: `Zeigt Ihr Link beim Teilen kein Bild, fehlt das Open-Graph-Bild. Das lässt sich in wenigen Minuten nachtragen.`,
  },
  {
    term: "Strukturierte Daten (Schema.org)",
    slug: "schema-org",
    plain: `Ein Format, mit dem eine Seite Google direkt sagt, was auf ihr steht: hier ein Unternehmen, dort die Öffnungszeiten, hier eine Veranstaltung. Google kann daraus erweiterte Treffer machen, etwa mit Öffnungszeiten oder Terminen.`,
    bottomLine: `Strukturierte Daten helfen Google, Ihre Angaben richtig zuzuordnen. Ob ein erweiterter Treffer erscheint, entscheidet Google.`,
  },
  {
    term: "Redirect (301 vs 302)",
    slug: "redirect",
    plain: `Eine Weiterleitung von einer alten Adresse zu einer neuen. 301 heißt „dauerhaft umgezogen“, 302 „nur vorübergehend“. Beim Relaunch einer Website ist 301 fast immer richtig, weil Google den Wert der alten Adresse dann auf die neue überträgt.`,
    bottomLine: `Lassen Sie sich vor einem Relaunch die Liste der Weiterleitungen zeigen. Ohne sie landen alte Links und Google-Treffer auf einer Fehlerseite.`,
  },
  {
    term: "Long-Tail-Keywords",
    slug: "long-tail",
    plain: `Längere, genauere Suchbegriffe, zum Beispiel „Friseur Eimsbüttel Osterstraße“ statt nur „Friseur Hamburg“. Danach suchen weniger Menschen, dafür ist die Konkurrenz kleiner. Wer so genau sucht, weiß meist schon, was er will.`,
    bottomLine: `Für lokale Betriebe lohnen sich genaue Suchbegriffe mehr als der allgemeine. Dort werden Sie leichter gefunden, und die Anfragen passen besser.`,
  },
  {
    term: "Alt-Text",
    slug: "alt-text",
    plain: `Eine kurze Bildbeschreibung im Code. Screenreader lesen sie vor, und sie erscheint, wenn ein Bild nicht lädt. Auch Google nutzt Alt-Texte, um zu verstehen, was auf einem Bild zu sehen ist.`,
    bottomLine: `Alt-Texte helfen bei der Barrierefreiheit und bei der lokalen Suche. Beschreiben Sie konkret („Schaufenster der Bäckerei Müller in der Osterstraße“), nicht allgemein („Bild eines Ladens“).`,
  },
  {
    term: "Sitemap",
    slug: "sitemap",
    plain: `Eine maschinenlesbare Liste aller Seiten Ihrer Website, die Sie Suchmaschinen vorlegen. Sie sagt Google, welche Seiten es gibt und wann sie zuletzt geändert wurden.`,
    bottomLine: `Mit einer Sitemap findet Google neue Unterseiten schneller. Eine sitemap.xml lässt sich automatisch erzeugen und kostet nichts.`,
  },
];

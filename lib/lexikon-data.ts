/**
 * Lexikon-Datenmodell für /lexikon.
 *
 * Klartext-Glossar: die Begriffe, mit denen Agenturen lokale
 * Inhaber regelmäßig einschüchtern, in ehrlichem Deutsch erklärt.
 * Pro Begriff zusätzlich eine „Was Sie wirklich wissen müssen"-
 * Zeile — der eine Satz, der die Kaufentscheidung betrifft.
 *
 * Alphabetisch sortiert wird in der UI; hier nach Wichtigkeit
 * gepflegt ist egal, das Array wird sortiert gerendert.
 */

export type LexikonEntry = {
  /** Begriff, wie er einem Inhaber begegnet. */
  term: string;
  /** Slug für Anchor-Links (#hosting etc.). */
  slug: string;
  /** Klartext-Erklärung, zwei bis vier Sätze. */
  plain: string;
  /** Der eine Satz, der für die Entscheidung zählt. */
  bottomLine: string;
};

export const LEXIKON: LexikonEntry[] = [
  {
    term: "Hosting",
    slug: "hosting",
    plain:
      "Der Ort, an dem Ihre Website physisch liegt — ein Computer in einem Rechenzentrum, der Tag und Nacht läuft und die Seite ausliefert, wenn jemand sie aufruft. Ohne Hosting keine Website, so wie ohne Ladenfläche kein Laden.",
    bottomLine:
      "Wichtig ist nur: liegt der Server in der EU, und wer kümmert sich, wenn er ausfällt.",
  },
  {
    term: "Domain",
    slug: "domain",
    plain:
      "Ihre Adresse im Netz — zum Beispiel ihr-betrieb.de. Sie mieten die Domain jährlich bei einer Registrierungsstelle, typisch für unter 20 Euro im Jahr. Die Domain gehört dem, auf dessen Namen sie registriert ist.",
    bottomLine:
      "Lassen Sie die Domain immer auf Ihren eigenen Namen registrieren, niemals auf den der Agentur.",
  },
  {
    term: "SSL-Zertifikat",
    slug: "ssl",
    plain:
      "Das kleine Schloss in der Browser-Adresszeile. Es verschlüsselt die Verbindung zwischen Besucher und Website. Ohne SSL markieren Browser Ihre Seite als unsicher, und Google stuft sie ab.",
    bottomLine:
      "SSL ist seit Jahren kostenlos und automatisierbar — wer dafür extra Geld verlangt, verkauft Ihnen Luft.",
  },
  {
    term: "CMS",
    slug: "cms",
    plain:
      "Content-Management-System — die Verwaltungsoberfläche, mit der man Texte und Bilder einer Website ändert, ohne Code anzufassen. WordPress ist das bekannteste. Ein CMS ist nützlich, wenn sich Inhalte oft ändern, und Ballast, wenn nicht.",
    bottomLine:
      "Fragen Sie sich ehrlich: wie oft ändern Sie wirklich etwas? Bei einmal im Quartal lohnt kein CMS — eine kurze Mail an uns ist schneller.",
  },
  {
    term: "SEO",
    slug: "seo",
    plain:
      "Suchmaschinenoptimierung — alles, was dazu beiträgt, dass Ihre Seite bei Google gefunden wird. Besteht zu achtzig Prozent aus Grundlagen: saubere Technik, klare Texte, korrekte Öffnungszeiten, ein gepflegter Google-Business-Eintrag. Der Rest ist Geduld.",
    bottomLine:
      "Niemand kann Platz eins garantieren. Wer es verspricht, lügt — und zwar berechenbar.",
  },
  {
    term: "Responsive Design",
    slug: "responsive",
    plain:
      "Eine Website, die sich an die Bildschirmgröße anpasst — auf dem Telefon anders aufgebaut als auf dem Laptop. Klingt 2026 selbstverständlich, ist es aber nicht: viele Bestandsseiten lokaler Betriebe brechen auf dem Handy.",
    bottomLine:
      "Über sechzig Prozent Ihrer Besucher kommen vom Telefon. Mobil ist nicht die Zweitansicht, sondern die Hauptansicht.",
  },
  {
    term: "DSGVO",
    slug: "dsgvo",
    plain:
      "Die europäische Datenschutz-Grundverordnung. Für Ihre Website heißt das vor allem: keine Daten ohne Einwilligung sammeln, Datenschutzerklärung und Impressum korrekt führen, keine US-Dienste ohne Rechtsgrundlage einbinden.",
    bottomLine:
      "Eine Seite ohne Tracking braucht kein Cookie-Banner. Das ist der eleganteste Weg, DSGVO-konform zu sein.",
  },
  {
    term: "Cookie-Banner",
    slug: "cookie-banner",
    plain:
      "Das Zustimmungs-Fenster beim ersten Besuch einer Seite. Rechtlich nur nötig, wenn die Seite Cookies setzt, die nicht technisch notwendig sind — also vor allem bei Tracking und Werbung.",
    bottomLine:
      "Wir bauen Seiten ohne Tracking-Cookies. Dann entfällt das Banner ersatzlos — besser für Sie, besser für Ihre Gäste.",
  },
  {
    term: "Ladezeit / Core Web Vitals",
    slug: "ladezeit",
    plain:
      "Wie schnell Ihre Seite erscheint und reagiert. Google misst das mit drei Kennzahlen (LCP, CLS, INP) und nutzt sie als Ranking-Faktor. Praktisch wichtiger: Besucher springen ab, wenn eine Seite länger als etwa drei Sekunden lädt.",
    bottomLine:
      "Testen Sie selbst — unser Speed-Check zeigt Ihnen die Werte in dreißig Sekunden, ohne Anmeldung.",
  },
  {
    term: "Baukasten",
    slug: "baukasten",
    plain:
      "Systeme wie Wix, Squarespace oder Jimdo, mit denen man Websites per Drag-and-Drop selbst zusammenstellt. Günstig im Einstieg, gut für Selbermacher mit Zeit. Die Grenzen: Eigenleistung, Wartung in Eigenregie, und ein Umzug weg ist später aufwändig.",
    bottomLine:
      "Ein Baukasten ist eine Mietwohnung. Eine eigene Seite ist Eigentum. Beides legitim — man sollte nur wissen, was man unterschreibt.",
  },
  {
    term: "Impressumspflicht",
    slug: "impressum",
    plain:
      "Jede geschäftliche Website in Deutschland braucht ein Impressum mit Name, Anschrift und Kontaktdaten des Betreibers. Fehler hier sind die häufigste Abmahn-Quelle für kleine Unternehmen.",
    bottomLine:
      "Name und ladungsfähige Anschrift müssen rein — auch wenn es unangenehm ist. Ein Postfach reicht nicht.",
  },
  {
    term: "Barrierefreiheit",
    slug: "barrierefreiheit",
    plain:
      "Eine Website, die auch mit Screenreader, Tastatur oder eingeschränktem Sehvermögen bedienbar ist. Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz für viele Dienstleistungen — und unabhängig vom Gesetz: ein relevanter Teil Ihrer Kundschaft profitiert direkt.",
    bottomLine:
      "Gute Kontraste, klare Schrift, beschriftete Knöpfe — das meiste ist Handwerk, kein Hexenwerk.",
  },
  {
    term: "Google-Business-Profil",
    slug: "google-business-profil",
    plain:
      "Der Eintrag, der erscheint, wenn jemand Ihren Betrieb oder Ihre Branche plus Stadtteil bei Google sucht — mit Karte, Öffnungszeiten, Fotos und Bewertungen. Für lokale Unternehmen oft wichtiger als die Website selbst, weil die Entscheidung vieler Kunden direkt auf der Karte fällt.",
    bottomLine:
      "Kostenlos, ein halber Tag Pflege-Aufwand, und in der Wirkung jeder bezahlten Kampagne überlegen. Wer hier leer steht, verschenkt jede Woche Anfragen.",
  },
  {
    term: "Google Ads",
    slug: "google-ads",
    plain:
      "Bezahlte Anzeigen über und neben den normalen Suchergebnissen. Sie zahlen pro Klick — bei umkämpften lokalen Begriffen schnell drei bis zehn Euro. Anzeigen wirken sofort, hören aber auch sofort auf zu wirken, wenn das Budget endet.",
    bottomLine:
      "Erst die Grundlagen (Seite, Google-Profil), dann Anzeigen — sonst bezahlen Sie Klicks auf eine Seite, die nicht überzeugt. Geliehene Sichtbarkeit ersetzt keine eigene.",
  },
  {
    term: "Conversion",
    slug: "conversion",
    plain:
      "Der Moment, in dem aus einem Besucher ein Kunde wird — ein Anruf, eine Anfrage, eine Reservierung. Die Conversion-Rate sagt, wie viele von hundert Besuchern diesen Schritt gehen. Eine schöne Seite ohne Conversions ist Dekoration.",
    bottomLine:
      "Eine sichtbare Telefonnummer und ein kurzes Formular schlagen jede Design-Auszeichnung. Messen Sie Anrufe, nicht Besucher.",
  },
  {
    term: "Cache",
    slug: "cache",
    plain:
      "Ein Zwischenspeicher, der fertige Seitenteile bereithält, statt sie bei jedem Aufruf neu zu bauen. Gut eingerichtet macht er Seiten spürbar schneller. Sein bekanntester Nebeneffekt: man sieht nach einer Änderung noch kurz die alte Version.",
    bottomLine:
      "Wenn Ihre Änderung nicht erscheint, ist es fast immer der Cache — einmal hart neu laden, bevor Sie jemanden anrufen.",
  },
  {
    term: "Open Graph",
    slug: "open-graph",
    plain: `Ein Mini-Datensatz, den jede Seite mitschickt, damit Vorschau-Bilder und Texte beim Teilen auf WhatsApp, Facebook oder LinkedIn richtig aussehen. Ohne Open Graph kriegen Sie eine kahle URL ohne Bild — der geteilte Link wirkt halbfertig.`,
    bottomLine: `Wenn Ihr Link beim Teilen kein Bild zeigt, fehlt das Open-Graph-Bild. Standard-Hygiene, keine Magie.`,
  },
  {
    term: "Strukturierte Daten (Schema.org)",
    slug: "schema-org",
    plain: `Ein technisches Format, das Google direkt sagt, was auf einer Seite steht: hier ist ein Unternehmen, hier sind Öffnungszeiten, hier ist eine FAQ. Google rendert das oft als Rich-Snippet — Sterne, ausklappbare Antworten, Veranstaltungs-Karten direkt im Treffer.`,
    bottomLine: `Strukturierte Daten machen Ihre Such-Treffer größer und klickbarer, ohne dass Sie für besseres Ranking zahlen müssen.`,
  },
  {
    term: "Redirect (301 vs 302)",
    slug: "redirect",
    plain: `Eine Weiterleitung von einer alten Adresse zu einer neuen. 301 heißt „dauerhaft umgezogen", 302 „nur vorübergehend". Beim Website-Relaunch ist 301 fast immer die richtige Wahl — Google überträgt den Suchmaschinen-Wert von der alten auf die neue Adresse.`,
    bottomLine: `Wer bei einem Relaunch keine 301-Redirects setzt, verliert oft 30–60 % seines Google-Traffics in den ersten Wochen.`,
  },
  {
    term: "Long-Tail-Keywords",
    slug: "long-tail",
    plain: `Längere, spezifischere Suchphrasen — „Friseur Eimsbüttel Osterstraße" statt nur „Friseur Hamburg". Long-Tail-Suchen haben weniger Volumen, aber viel geringere Konkurrenz und deutlich höhere Conversion-Rate, weil die Suchabsicht klarer ist.`,
    bottomLine: `Für lokale Anbieter lohnen sich Long-Tail-Keywords mehr als der Generalbegriff — Sie ranken einfacher und gewinnen Kunden, die schon entschieden sind.`,
  },
  {
    term: "Alt-Text",
    slug: "alt-text",
    plain: `Eine kurze Bildbeschreibung im Code, die Screenreader vorlesen und die angezeigt wird, wenn ein Bild nicht lädt. Auch Google nutzt Alt-Texte, um zu verstehen, was auf einem Bild zu sehen ist.`,
    bottomLine: `Alt-Texte gehören zu Barrierefreiheit-Pflicht UND lokalem SEO — beschreiben Sie konkret („Schaufenster der Bäckerei Müller in der Osterstraße"), nicht generisch („Bild eines Ladens").`,
  },
  {
    term: "Sitemap",
    slug: "sitemap",
    plain: `Eine maschinenlesbare Liste aller Ihrer Seiten, die Sie Suchmaschinen vorlegen. Sie sagt Google: hier sind meine Seiten, hier sind sie wichtig, hier sind sie unwichtig — bitte indexieren.`,
    bottomLine: `Ohne Sitemap findet Google viele Unterseiten gar nicht oder erst nach Wochen. Eine sitemap.xml gehört zu jeder Seite, automatisch generiert.`,
  },
];

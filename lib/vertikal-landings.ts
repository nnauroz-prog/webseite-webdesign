/**
 * Vertikal-Landing-Daten. Schlanker als BRANCHEN — diese Routen
 * (/pflege, /praxen) sind konversion-orientierte Single-Vertical-
 * Landings für Paid-Traffic und Direkt-Empfehlungen, nicht das
 * editoriale /branchen-Archiv.
 *
 * Bewusst eigener Datentopf, nicht aus BRANCHEN abgeleitet — der
 * Inhalt ist verschärft (Pain-first, Stadtteil-Anker, knappe
 * Bauteil-Liste), nicht remixed. Damit keine Duplicate-Content-
 * Strafe gegenüber /branchen/[slug].
 *
 * Erweiterung: neue Vertikale dazunehmen heißt: hier Eintrag bauen,
 * `app/<slug>/page.tsx` als Dünnschicht-Mantel anlegen, fertig.
 */

export type VertikalLanding = {
  /** URL-Slug, gleichzeitig Routen-Segment. */
  slug: string;
  /** SEO-Title (volle Suchphrase). */
  seoTitle: string;
  /** SEO-Description. */
  seoDescription: string;
  /** Verbindung zum Archive — für canonical und Cross-Link. */
  brancheSlug: string;
  /** Verbindung zum Inquiry-Form via ?branche= Param. */
  inquirySlug: string;
  /** Empfohlenes Paket fürs Anfrage-Preset. */
  recommendedPackage: "starter" | "business" | "premium";
  /** Eyebrow im Hero (klein, mono). */
  eyebrow: string;
  /** Hero-Headline, kurz. */
  headline: string;
  /** Hero-Headline-Italic-Hälfte (optional). */
  headlineItalic?: string;
  /** Hero-Subhead, 1 Satz. */
  subhead: string;
  /** Pain-Points: drei konkrete Probleme aus dieser Branche. */
  pains: { headline: string; body: string }[];
  /** Was wir konkret bauen — 4–6 Bauteile, sehr konkret. */
  bauteile: { name: string; what: string }[];
  /** Prozess-Wochen: knapp, beobachtbar. */
  process: { woche: string; what: string }[];
  /** Hamburg-Anker: Stadtteile, in denen wir schon was gemacht haben. */
  stadtteile: string[];
  /** Schluss-Zitat im Serif-Stil. */
  schlussZitat: string;
  /** Schluss-Zitat-Italic-Hälfte (optional). */
  schlussZitatItalic?: string;
};

export const VERTIKAL_LANDINGS: VertikalLanding[] = [
  {
    slug: "pflege",
    seoTitle: "Pflegedienst-Website aus Hamburg — Sitalo",
    seoDescription:
      "Websites für Pflegedienste in Hamburg. Klar strukturiert, mit Bewerbungsformular, Leistungsbereichen und Direkt-Kontakt. Persönlich gemacht, festes Honorar.",
    brancheSlug: "pflege",
    inquirySlug: "pflege",
    recommendedPackage: "business",
    eyebrow: "Für Pflegedienste in Hamburg",
    headline: "Eine Pflege-Website,",
    headlineItalic: "die Bewerbungen bringt.",
    subhead:
      "Klar strukturiert, mit Bewerbungsformular und Leistungsbereichen. Damit Familien die richtige Entscheidung treffen und Pflegekräfte sich tatsächlich bewerben.",
    pains: [
      {
        headline: "Die Seite zeigt nicht, was Sie wirklich tun.",
        body: `Pflegedienste mit allgemeinen „Wir kümmern uns um Sie"-Sätzen fallen aus dem Auswahlprozess. Familien suchen konkret nach Grundpflege, Behandlungspflege, 24-Stunden-Versorgung — wenn das nicht im ersten Bildschirm steht, geht der Anruf an die nächste Adresse.`,
      },
      {
        headline: "Bewerbungen kommen nicht an.",
        body: "PDF-Bewerbung per Mail ist 2010-Logik. Wer als Pflegekraft heute drei offene Stellen prüft, geht die durch, die ein Formular auf dem Handy haben. Ohne das verlieren Sie qualifizierte Bewerber, die Sie nie zu Gesicht bekommen.",
      },
      {
        headline: "Vertrauen wird nicht aufgebaut.",
        body: `Eine Pflegeseite ohne Team-Bereich, ohne Zertifikate, ohne Hinweis auf Notdienst-Erreichbarkeit signalisiert „Lager mit Pflegern". Pflegedienste verkaufen Vertrauen — und das muss man auch sehen.`,
      },
    ],
    bauteile: [
      {
        name: "Startseite",
        what: "Was Sie tun, für wen, in welchem Gebiet — auf einen Blick. Notfallnummer in der Header-Leiste, immer sichtbar.",
      },
      {
        name: "Leistungsbereiche",
        what: "Grundpflege, Behandlungspflege, Verhinderungspflege, Beratung nach §37.3 — eine Seite je Leistung mit klarem Vokabular für Familien und Pflegekassen.",
      },
      {
        name: "Bewerbungsformular",
        what: "Auf dem Handy in 90 Sekunden ausfüllbar. CV-Upload optional, weil ohne Upload trotzdem viele schreiben — und das ist erstmal genug, um ins Gespräch zu kommen.",
      },
      {
        name: "Team & Werte",
        what: "Echte Fotos vom Team. Drei Sätze zu jeder Person. Keine Stockbilder. Pflegedienste verlieren Vertrauen schneller als jede andere Branche, wenn die Seite generisch aussieht.",
      },
      {
        name: "Einsatzgebiet",
        what: "Hamburg-Karte mit Ihren Stadtteilen oder Tabellenliste der PLZ-Gebiete. Familien sortieren schon vorher aus, ob Sie überhaupt zu ihnen rauskommen.",
      },
      {
        name: "Google-Maps-Eintrag",
        what: "Wir richten den Google-Maps-Eintrag (Google Business Profile) im selben Atemzug mit ein. Pflegedienste werden zu 70 % über die Map gefunden, nicht über klassische Suche.",
      },
    ],
    process: [
      {
        woche: "Woche 1",
        what: "Erstgespräch (Telefon oder vor Ort), Inhalts-Sammlung, Sichtung Ihrer alten Seite / PDF-Materialien. Sie schicken, wir sortieren.",
      },
      {
        woche: "Woche 2",
        what: "Wir bauen die Seite. Sie sehen einen Zwischenstand am Ende der Woche, gehen drüber.",
      },
      {
        woche: "Woche 3",
        what: "Eine gesammelte Korrekturrunde, dann Live-Schaltung. Google-Maps-Eintrag wird parallel optimiert.",
      },
    ],
    stadtteile: [
      "Wandsbek",
      "Eimsbüttel",
      "Altona",
      "Bergedorf",
      "Harburg",
      "Eppendorf",
    ],
    schlussZitat: "Eine Pflegedienst-Website darf nicht hübsch sein.",
    schlussZitatItalic: "Sie muss arbeiten.",
  },
  {
    slug: "praxen",
    seoTitle: "Praxis-Website aus Hamburg — Sitalo",
    seoDescription:
      "Websites für Arzt- und Zahnarztpraxen in Hamburg. Seriös, mit Sprechzeiten, Online-Termin-Anfrage und Team-Bereich. Persönlich gemacht, festes Honorar.",
    brancheSlug: "praxis",
    inquirySlug: "praxis",
    recommendedPackage: "business",
    eyebrow: "Für Praxen in Hamburg",
    headline: "Eine Praxis-Seite,",
    headlineItalic: "die Termine bringt.",
    subhead:
      "Seriös, klar, mobil. Patient:innen prüfen vor dem ersten Termin, ob Ihre Praxis seriös wirkt — wenn die Seite das nicht signalisiert, ruft niemand an.",
    pains: [
      {
        headline: "Die Sprechzeiten sind nicht zu finden.",
        body: `Patient:innen suchen vor dem Anruf zuerst nach Sprechzeiten und Notdienst. Wenn die in einer PDF unter „Praxisinfo" stecken oder in fünf Klicks erreichbar sind, wird das die nächste Praxis. Sprechzeiten gehören in den Header, nicht in einen Unterordner.`,
      },
      {
        headline: "Die Seite wirkt nicht seriös.",
        body: `Bilderfreie Layouts, generische Schriftarten, fehlerhafte Mobile-Darstellung — alles Signale, die unbewusst „nicht vertrauenswürdig" sagen. Bei einer Praxis ist das fatal, weil der Patient noch nichts erlebt hat, woran er die Qualität sonst festmachen kann.`,
      },
      {
        headline: "Termin-Anfragen scheitern am Telefon-Engpass.",
        body: "Eine Praxis ohne Online-Termin-Anfrage zwingt jeden Erstkontakt durch die Telefon-Sekretärin. Das ist Engpass und Hürde gleichzeitig. Ein einfaches Online-Formular mit Wunschtermin-Auswahl fängt 30–40 % der Anfragen ab, die sonst aufgegeben hätten.",
      },
    ],
    bauteile: [
      {
        name: "Sprechzeiten im Header",
        what: "Immer sichtbar, mit Notdienst-Hinweis. Patient:innen brauchen drei Sekunden, um zu wissen ob Sie heute offen sind.",
      },
      {
        name: "Online-Termin-Anfrage",
        what: "Formular mit drei Wunschterminen, das direkt in Ihren Kalender oder als E-Mail an die Praxis geht. Optional Doctolib- oder Jameda-Integration.",
      },
      {
        name: "Behandlungen verständlich",
        what: "Ihre Leistungen in normalem Deutsch, nicht in Fachsprache. Patient:innen vergleichen, was Sie tun mit dem, was sie suchen — wenn die Worte nicht passen, vermuten sie, dass Sie es nicht anbieten.",
      },
      {
        name: "Team-Bereich",
        what: "Echte Porträts der Ärzt:innen und des Praxispersonals. Drei Sätze zu jeder Person. Patient:innen wollen sehen, zu wem sie da gehen.",
      },
      {
        name: "Anfahrt & Parken",
        what: "Karte mit Hinweisen zu Parkplätzen, ÖPNV-Haltestellen, Aufzug ja/nein. Klingt nebensächlich — entscheidet bei älteren Patient:innen oft die Auswahl.",
      },
      {
        name: "Datenschutz-Sauberkeit",
        what: "Praxis-Websites werden öfter abgemahnt als andere Branchen. Wir richten Cookie-Banner, Datenschutzerklärung, Impressum so ein, dass die Abmahnanwälte keine Angriffsfläche finden.",
      },
    ],
    process: [
      {
        woche: "Woche 1",
        what: "Erstgespräch, Sichtung der bestehenden Seite, Inhalts-Sammlung (Texte, Bilder, Team-Daten). Wir schreiben mit, wenn Texte fehlen.",
      },
      {
        woche: "Woche 2",
        what: "Wir bauen die Seite. Sie kriegen einen Zwischenstand, gehen drüber.",
      },
      {
        woche: "Woche 3",
        what: "Eine gesammelte Korrekturrunde, dann Live-Schaltung. Termin-Formular wird mit Ihrem Sekretariat getestet.",
      },
    ],
    stadtteile: [
      "Eppendorf",
      "Altona",
      "Eimsbüttel",
      "Winterhude",
      "Harvestehude",
      "Rotherbaum",
    ],
    schlussZitat: "Eine Praxis-Seite muss seriös wirken,",
    schlussZitatItalic: "bevor der Patient die Klingel drückt.",
  },
];

export function getVertikalLanding(slug: string): VertikalLanding | undefined {
  return VERTIKAL_LANDINGS.find((v) => v.slug === slug);
}

/**
 * Pakete-Datenmodell. Zentrale Quelle für /pakete (Übersicht)
 * und /pakete/[slug] (Detailseiten).
 *
 * Pro Paket: kurze Übersichts-Daten + erweiterter Detail-Content
 * (Hero-Statement, Was-drin-ist, Ablauf-Spezifika, FAQ, Beispiel-
 * Projekte mit Branchen-Querverweisen).
 */

export type Paket = {
  slug: "starter" | "business" | "premium";
  name: string;
  /** Optional badge (z. B. "Empfohlen"). */
  badge?: string;
  /** Setzt im Pricing-Block das dunkle Highlight-Layout. */
  highlight?: boolean;
  setup: string;
  monthly: string;
  /** Kurz-Beschreibung für Karten. */
  description: string;
  /** Für wen ist das Paket — länger formuliert. */
  whoFor: string;
  /** Was enthalten ist. */
  contents: string[];
  /** Typische Beispiele. */
  examples: string[];
  /** Was nicht enthalten ist (Abgrenzung zum nächsthöheren Paket). */
  limits: string[];

  /* === Erweiterte Inhalte für /pakete/[slug] === */

  /** Display-Headline, zweite Zeile in Serif-Italic. */
  detailHeadline: string;
  /** 2–3 Absätze Intro für die Detailseite. */
  detailIntro: string[];
  /** Was Sie nach dem Launch bekommen. */
  afterLaunch: string[];
  /** Empfohlene Branchen (Querverweise auf /branchen/[slug]). */
  recommendedFor: { slug: string; label: string }[];
  /** Paket-spezifische FAQ. */
  faq: { q: string; a: string }[];
};

export const PAKETE: Paket[] = [
  {
    slug: "starter",
    name: "Starter",
    setup: "ab 499 €",
    monthly: "ab 49 € / Monat",
    description:
      "Eine moderne Seite, alles Wichtige auf einen Blick. Perfekt für Einzelunternehmer und kleine Betriebe.",
    whoFor:
      "Für Selbstständige und kleine Betriebe, die schnell professionell auftreten wollen — ohne mehrseitige Struktur, ohne komplexe Funktionen.",
    contents: [
      "Moderne Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular mit Spam-Schutz",
      "Direktwahl-Knopf",
      "Google Maps & Öffnungszeiten",
      "Impressum & Datenschutz-Bereich",
      "Hosting in der EU",
      "Bis zu 1 kleine Änderung pro Monat",
    ],
    examples: [
      "Selbstständiger Handwerker mit Einsatzgebiet",
      "Kleines Café mit Öffnungszeiten",
      "Coach oder Berater mit Leistungen und Kontakt",
      "Friseur:in mit Galerie und Termin-Anfrage",
    ],
    limits: [
      "Keine mehrseitige Struktur",
      "Keine verwaltbaren Inhalte",
      "Maximal 1 Änderungsrunde pro Monat",
    ],
    detailHeadline: "Klein, klar, schnell online.",
    detailIntro: [
      "Das Starter-Paket ist für alle, die jetzt eine seriöse Online-Präsenz brauchen — ohne über eine fünfseitige Struktur, Bildergalerien oder Online-Buchung nachzudenken. Eine starke Seite, die alles Wichtige enthält und in 1–2 Werktagen live geht.",
      "Wenn Sie später wachsen wollen, kann jede Starter-Seite zum Business-Paket erweitert werden — Sie zahlen nur die Differenz, kein Neuaufbau nötig.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Eine kleine Änderung pro Monat (Texte, Bilder, Öffnungszeiten)",
      "Sicherheits-Updates und technische Pflege im Hintergrund",
      "Sie schreiben mir, ich kümmere mich — meist innerhalb von 24 h",
    ],
    recommendedFor: [
      { slug: "friseur", label: "Friseure & Kosmetikstudios" },
      { slug: "handwerker", label: "Handwerker" },
      { slug: "kanzlei", label: "Kleine Kanzleien" },
    ],
    faq: [
      {
        q: "Reicht eine Onepage-Website wirklich für mein Unternehmen?",
        a: "In den meisten Fällen ja. Wenn Sie unter 5 Leistungen anbieten und keine separaten Bereiche für Team, News oder Karriere brauchen, ist Onepage übersichtlicher und schneller. Mehrseitig wird relevant, wenn Sie pro Leistung viel zu sagen haben oder SEO-Unterseiten brauchen.",
      },
      {
        q: "Kann ich später aufs Business-Paket wechseln?",
        a: "Ja, jederzeit. Sie zahlen nur die Differenz im Setup-Preis. Ihre bestehende Seite wird erweitert, nicht neu gebaut.",
      },
      {
        q: "Was ist mit Texten — schreibe ich die selbst?",
        a: "Sie liefern eine grobe Beschreibung, ich strukturiere und formuliere zu klaren Web-Texten. Sie reviewen, ändern was Sie wollen. Bei Kleinunternehmen reicht das meistens — bei sehr fachspezifischen Themen empfehle ich, dass Sie die Kernaussagen selbst beisteuern.",
      },
    ],
  },
  {
    slug: "business",
    name: "Business",
    badge: "Empfohlen",
    highlight: true,
    setup: "ab 899 €",
    monthly: "ab 79 € / Monat",
    description:
      "Mehrere Sektionen, Team, Leistungen, Galerie. Für lokale Unternehmen, die professionell auftreten wollen.",
    whoFor:
      "Für etablierte lokale Unternehmen mit mehreren Leistungen, einem Team und dem Bedarf, sich seriös zu präsentieren.",
    contents: [
      "Hochwertige Mehrseiten-Website",
      "Bis zu 5 Sektionen / Unterseiten",
      "Team-Bereich mit Fotos",
      "Leistungen mit detaillierter Beschreibung",
      "Galerie mit Lightbox",
      "SEO-Grundlagen + Sitemap",
      "Bilderaufbereitung inklusive",
      "Bis zu 3 kleine Änderungen pro Monat",
    ],
    examples: [
      "Pflegedienst mit Leistungen, Team und Bewerbungsformular",
      "Arztpraxis mit Sprechzeiten und Termin-Anfrage",
      "Handwerksbetrieb mit Referenz-Galerie",
      "Kanzlei mit Rechtsgebieten und Team",
    ],
    limits: [
      "Verwaltbare Inhalte gehören in Premium",
      "Online-Buchung gehört in Premium",
    ],
    detailHeadline: "Die solide Mehrseiten-Lösung.",
    detailIntro: [
      "Business ist mein meistgewähltes Paket — und meistens das richtige für etablierte lokale Unternehmen. Sie bekommen eine vollwertige Mehrseiten-Website mit eigenem Bereich für Team, Leistungen, Galerie und Kontakt. Plus eine saubere SEO-Basis, damit Sie für die richtigen Suchen gefunden werden.",
      "Konkret heißt das: bis zu fünf Unterseiten, professionelle Bildaufbereitung Ihrer Fotos, Sitemap, strukturierte Daten für Google, und drei kleine Änderungen pro Monat in der laufenden Betreuung.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Drei kleine Änderungen pro Monat (Texte, Bilder, Team, …)",
      "Wartung, Sicherheits-Updates und Performance-Monitoring",
      "Persönlicher Ansprechpartner — keine Tickets, kein Support-Chat",
      "Erweiterungen jederzeit möglich (z. B. weitere Unterseite, neue Leistung)",
    ],
    recommendedFor: [
      { slug: "pflege", label: "Pflegedienste" },
      { slug: "praxis", label: "Arzt- und Zahnarztpraxen" },
      { slug: "reinigung", label: "Reinigungsfirmen" },
      { slug: "fitness", label: "Fitnessstudios" },
    ],
    faq: [
      {
        q: "Was zählt als „kleine Änderung\"?",
        a: "Texte anpassen, Bilder austauschen, Öffnungszeiten ändern, neuer Team-Eintrag, neuer Service-Block. Etwas, das ich in 15–30 Min erledige. Größere strukturelle Erweiterungen besprechen wir separat.",
      },
      {
        q: "Brauche ich wirklich fünf Unterseiten?",
        a: "Nein, fünf ist die Obergrenze. Viele Business-Kunden starten mit drei oder vier (Start, Leistungen, Team, Kontakt) und erweitern später. Sie zahlen nicht für ungenutzte Seiten.",
      },
      {
        q: "Was, wenn ich später Verwaltbare Inhalte will?",
        a: "Sie können jederzeit aufs Premium-Paket wechseln. Ich erweitere Ihre bestehende Seite um die verwaltbaren Bereiche, kein Neuaufbau.",
      },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    description:
      "Individuelle Struktur mit Bereichen, die Sie selbst pflegen — Speisekarte, Wochenangebot, Termine.",
    whoFor:
      "Für Unternehmen mit häufig wechselnden Inhalten oder besonderen Anforderungen — Gastro, Studios, Beratungen mit Online-Buchung.",
    contents: [
      "Premium-Design",
      "Individuelle Website-Struktur",
      "Verwaltbare Inhalte auf Wunsch",
      "Speisekarte / Wochenangebot selbst änderbar",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Stärkere SEO-Basis",
      "Erweiterte Wartung",
      "Bis zu 6 kleine Änderungen pro Monat",
    ],
    examples: [
      "Café mit täglich wechselndem Mittagstisch",
      "Friseur mit Online-Termin-Buchung",
      "Pflegedienst mit Bewerbungsformular und News",
      "Restaurant mit Speisekarte und Wochenangebot",
    ],
    limits: [
      "Eigene Apps oder Shop-Systeme werden im Einzelfall besprochen",
    ],
    detailHeadline: "Für alle, die Inhalte selbst pflegen wollen.",
    detailIntro: [
      "Premium ist das Paket für Unternehmen, deren Website kein statisches Schaufenster ist, sondern täglich oder wöchentlich aktualisiert werden muss. Speisekarte ändern, Wochenangebot pflegen, Kursplan anpassen, neue Termine eintragen — alles selbst, ohne mich anzurufen.",
      "Die verwaltbaren Bereiche werden individuell auf Ihren Bedarf zugeschnitten. Sie loggen sich auf einer eigenen Adresse ein und sehen direkt, was wo geändert werden kann — keine fünfzig Optionen, sondern nur das, was Sie wirklich brauchen.",
      "Dazu kommen sechs kleine Änderungen pro Monat in der laufenden Betreuung, eine stärkere SEO-Basis und priorisierter Support.",
    ],
    afterLaunch: [
      "Verwaltbare Inhalte: Sie pflegen Speisekarte, Angebot, Termine selbst",
      "Sechs kleine Änderungen pro Monat von mir",
      "Erweiterte SEO-Pflege (Suchbegriff-Monitoring, Optimierungen)",
      "Hosting + SSL + Backups in der EU",
      "Prioritäts-Support — meist Antwort am selben Tag",
    ],
    recommendedFor: [
      { slug: "gastro", label: "Cafés & Restaurants" },
      { slug: "friseur", label: "Friseure mit Online-Buchung" },
      { slug: "fitness", label: "Fitnessstudios mit Kursplan" },
    ],
    faq: [
      {
        q: "Wie kompliziert ist die Selbst-Pflege?",
        a: "Sehr einfach. Sie tippen auf den Bereich, der geändert werden soll, ändern Text oder Bild, klicken Speichern. Funktioniert wie ein Word-Dokument — keine HTML-Kenntnisse, keine Vorbereitung.",
      },
      {
        q: "Was wenn ich was kaputt mache?",
        a: "Geht praktisch nicht. Sie können nur die Inhalte ändern, die ich für die Bearbeitung freigegeben habe. Struktur und Design bleiben unangetastet. Plus: jede Änderung lässt sich rückgängig machen.",
      },
      {
        q: "Brauche ich Online-Buchung wirklich?",
        a: "Hängt vom Geschäft ab. Für viele Friseure und Studios spart Online-Buchung 20–30 Telefonate pro Woche. Für eine Kanzlei oder einen Handwerker meistens nicht. Im Erstgespräch klären wir, ob es sich lohnt.",
      },
      {
        q: "Was kostet eine zusätzliche Anpassung außer der Reihe?",
        a: "Kleine Sachen meist gar nichts — ich rechne nicht jede E-Mail ab. Größere Sachen (z. B. neuer Bereich, Funktionserweiterung) bekommen Sie vorher als verbindliches Angebot.",
      },
    ],
  },
];

export function getPaketBySlug(
  slug: string,
): Paket | undefined {
  return PAKETE.find((p) => p.slug === slug);
}

export function getAllPaketSlugs(): string[] {
  return PAKETE.map((p) => p.slug);
}

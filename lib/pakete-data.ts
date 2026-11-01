/**
 * Pakete-Datenmodell. Zentrale Quelle für /pakete (Übersicht)
 * und /pakete/[slug] (Detailseiten).
 *
 * Pro Paket: kurze Übersichts-Daten + erweiterter Detail-Content
 * (Hero-Statement, Was-drin-ist, Ablauf-Spezifika, FAQ, Beispiel-
 * Projekte mit Branchen-Querverweisen).
 */

export type Paket = {
  slug: "starter" | "business" | "premium" | "studio";
  name: string;
  /** Optional badge (z. B. "Empfohlen", "Neu"). */
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

  /** Kurzer Titel (derzeit nur für interne Zwecke, nicht auf der Seite). */
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
      "Eine Seite mit allem Wichtigen: Leistungen, Öffnungszeiten und Kontakt. Für Selbstständige und kleine Betriebe.",
    whoFor:
      "Für Selbstständige und kleine Betriebe, die schnell eine Website brauchen und mit einer Seite auskommen.",
    contents: [
      "Onepage-Website: alles auf einer Seite",
      "Fürs Handy gebaut, am Rechner genauso lesbar",
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
      "Unterseiten für einzelne Leistungen",
      "Bereiche, die Sie selbst pflegen",
      "Mehr als eine kleine Änderung pro Monat",
    ],
    detailHeadline: "Eine Seite, schnell online.",
    detailIntro: [
      "Starter ist eine einzelne Seite mit Leistungen, Öffnungszeiten, Anfahrt und Kontakt. Über Unterseiten, Galerien oder Online-Buchung müssen Sie dafür nicht nachdenken. Eine Seite wie diese ist oft in 1–2 Werktagen online.",
      "Wenn Sie später mehr Platz brauchen, erweitern wir die Seite zum Business-Paket. Sie zahlen dann die Differenz im Einmalpreis, neu gebaut wird nichts.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Eine kleine Änderung pro Monat (Texte, Bilder, Öffnungszeiten)",
      "Sicherheits-Updates und technische Pflege im Hintergrund",
      "Sie schreiben uns, wir antworten meist am selben Werktag",
    ],
    recommendedFor: [
      { slug: "friseur", label: "Friseure & Kosmetikstudios" },
      { slug: "handwerker", label: "Handwerker" },
      { slug: "kanzlei", label: "Kleine Kanzleien" },
    ],
    faq: [
      {
        q: "Reicht eine Onepage-Website wirklich für mein Unternehmen?",
        a: "Oft ja. Wenn Sie weniger als fünf Leistungen anbieten und keine eigenen Bereiche für Team, Neuigkeiten oder Stellen brauchen, ist eine Seite übersichtlicher. Mehrere Seiten lohnen sich, wenn Sie zu jeder Leistung viel zu sagen haben oder für einzelne Leistungen bei Google gefunden werden wollen.",
      },
      {
        q: "Kann ich später aufs Business-Paket wechseln?",
        a: "Ja, jederzeit. Sie zahlen nur die Differenz im Setup-Preis. Ihre bestehende Seite wird erweitert, nicht neu gebaut.",
      },
      {
        q: "Muss ich die Texte selbst schreiben?",
        a: "Nein. Sie schicken uns Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und streichen, was nicht stimmt. Bei sehr fachlichen Themen bitten wir Sie, die wichtigsten Aussagen selbst beizusteuern.",
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
      "Mehrere Seiten für Leistungen, Team und Galerie. Für lokale Betriebe mit mehreren Angeboten.",
    whoFor:
      "Für lokale Betriebe mit mehreren Leistungen und einem Team, das sich vorstellen soll.",
    contents: [
      "Website mit mehreren Seiten",
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
      "Bereiche, die Sie selbst pflegen (ab Premium)",
      "Online-Buchung (ab Premium)",
    ],
    detailHeadline: "Mehrere Seiten für Leistungen und Team.",
    detailIntro: [
      "Business ist das Paket, das wir den meisten lokalen Betrieben empfehlen. Sie bekommen eine Website mit eigenen Seiten für Leistungen, Team, Galerie und Kontakt. Jede Seite bekommt einen eigenen Titel und eine Beschreibung für Google.",
      "Dazu gehören bis zu fünf Unterseiten, die Aufbereitung Ihrer Fotos, eine Sitemap und strukturierte Daten für Google. Im Monatsbeitrag sind drei kleine Änderungen pro Monat enthalten.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Drei kleine Änderungen pro Monat (Texte, Bilder, Team, …)",
      "Updates und eine regelmäßige Prüfung der Ladezeit",
      "Sie schreiben oder rufen direkt bei uns an, unter 0160 7621876",
      "Erweiterungen jederzeit, etwa eine weitere Unterseite",
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
        a: "Alles, was wir in 15 bis 30 Minuten erledigen: einen Text anpassen, ein Bild tauschen, Öffnungszeiten ändern oder jemanden ins Team aufnehmen. Größere Erweiterungen besprechen wir vorher und nennen Ihnen den Preis.",
      },
      {
        q: "Brauche ich wirklich fünf Unterseiten?",
        a: "Nein, fünf ist die Obergrenze. Oft reichen drei oder vier, etwa Start, Leistungen, Team und Kontakt. Weitere Seiten kommen später dazu, wenn Sie sie brauchen.",
      },
      {
        q: "Was, wenn ich Inhalte später selbst pflegen will?",
        a: "Dann wechseln Sie zu Premium. Wir ergänzen Ihre Seite um die Bereiche, die Sie selbst pflegen. Neu gebaut wird sie dafür nicht.",
      },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    setup: "ab 2.499 €",
    monthly: "ab 179 € / Monat",
    description:
      "Eine Struktur, die wir für Ihren Betrieb anlegen, mit Bereichen, die Sie selbst pflegen, etwa Speisekarte, Wochenangebot oder Termine.",
    whoFor:
      "Für Betriebe, deren Inhalte sich oft ändern, etwa Gastronomie, Studios oder Beratungen mit Online-Buchung.",
    contents: [
      "Gestaltung für Ihren Betrieb",
      "Individuelle Website-Struktur",
      "Verwaltbare Inhalte auf Wunsch",
      "Speisekarte / Wochenangebot selbst änderbar",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Mehr Arbeit an den Suchbegriffen",
      "Regelmäßige Prüfung von Formularen und Ladezeit",
      "Bis zu 6 kleine Änderungen pro Monat",
    ],
    examples: [
      "Café mit täglich wechselndem Mittagstisch",
      "Friseur mit Online-Termin-Buchung",
      "Pflegedienst mit Bewerbungsformular und News",
      "Restaurant mit Speisekarte und Wochenangebot",
    ],
    limits: [
      "Shop oder eigene App (besprechen wir im Einzelfall)",
    ],
    detailHeadline: "Inhalte, die Sie selbst pflegen.",
    detailIntro: [
      "Premium passt, wenn sich auf Ihrer Website jede Woche etwas ändert. Die Speisekarte, das Wochenangebot, den Kursplan oder neue Termine tragen Sie selbst ein und müssen dafür nicht bei uns anrufen.",
      "Welche Bereiche Sie selbst ändern können, legen wir mit Ihnen fest. Sie melden sich unter einer eigenen Adresse an und sehen dort nur die Felder, die Sie brauchen.",
      "Im Monatsbeitrag sind sechs kleine Änderungen pro Monat enthalten. Ihre Anfragen beantworten wir vorrangig.",
    ],
    afterLaunch: [
      "Verwaltbare Inhalte: Sie pflegen Speisekarte, Angebot, Termine selbst",
      "Sechs kleine Änderungen pro Monat von uns",
      "Wir beobachten Ihre Suchbegriffe und passen die Seite an",
      "Hosting + SSL + Backups in der EU",
      "Vorrang bei Anfragen, Antwort meist am selben Werktag",
    ],
    recommendedFor: [
      { slug: "gastro", label: "Cafés & Restaurants" },
      { slug: "friseur", label: "Friseure mit Online-Buchung" },
      { slug: "fitness", label: "Fitnessstudios mit Kursplan" },
    ],
    faq: [
      {
        q: "Wie kompliziert ist die Selbst-Pflege?",
        a: "Sie klicken auf den Bereich, ändern Text oder Bild und speichern. Das funktioniert ähnlich wie in einem Word-Dokument. HTML müssen Sie dafür nicht können.",
      },
      {
        q: "Was wenn ich was kaputt mache?",
        a: "Sie können nur die Inhalte ändern, die wir dafür freigegeben haben. Aufbau und Gestaltung bleiben, wie sie sind. Jede Änderung lässt sich rückgängig machen.",
      },
      {
        q: "Brauche ich Online-Buchung wirklich?",
        a: "Das hängt vom Betrieb ab. Bei Friseuren und Studios, die viele kurze Termine vergeben, nimmt sie Ihnen Anrufe ab. Für eine Kanzlei oder einen Handwerker lohnt sie sich meistens nicht. Im Erstgespräch klären wir, was bei Ihnen passt.",
      },
      {
        q: "Was kostet eine zusätzliche Anpassung außer der Reihe?",
        a: "Kleine Sachen meist nichts, wir rechnen nicht jede E-Mail ab. Für Größeres, etwa einen neuen Bereich, bekommen Sie vorher ein verbindliches Angebot.",
      },
    ],
  },
  {
    slug: "studio",
    name: "Sitalo Studio",
    badge: "Eigene Gestaltung",
    setup: "ab 3.490 €",
    monthly: "ab 249 € / Monat",
    description:
      "Eigene Gestaltung, bis zu drei Korrekturrunden und ein Treffen vor Ort. Für Betriebe, die ihr ganzes Erscheinungsbild neu aufstellen.",
    whoFor:
      "Für Betriebe, die sich in der Gestaltung deutlich von anderen ihrer Branche abheben wollen, etwa Privatpraxen, Architekturbüros, Beratungen oder Restaurants mit eigenem Konzept.",
    contents: [
      "Gestaltung, die wir nur für Sie entwerfen",
      "Ein Treffen vor dem Entwurf, in Hamburg oder bei Ihnen",
      "Bis zu 3 Korrekturrunden",
      "Schrift und Farben eigens für Ihren Betrieb",
      "Bis zu 12 verwaltbare Bereiche oder Seiten",
      "Mehrsprachigkeit auf Wunsch (Deutsch + eine weitere)",
      "Bis zu 10 kleine Änderungen pro Monat",
      "Ihre Fragen beantwortet, wer Ihre Seite gebaut hat",
    ],
    examples: [
      "Privatpraxis mit eigener Bildsprache",
      "Architekturbüro mit Portfolio und ruhiger Typografie",
      "Restaurant mit Konzept-Website und mehrsprachiger Karte",
      "Beratung mit eigenem Erscheinungsbild",
    ],
    limits: [
      "Shop-Systeme (bieten wir separat an)",
      "Entwicklung einer eigenen App",
    ],
    detailHeadline: "Eigene Gestaltung für Ihren Betrieb.",
    detailIntro: [
      "Bei Sitalo Studio gestalten wir mehr als die Website. Wir legen Schrift, Farben, Bildsprache und Ton für Ihren Betrieb fest und denken dabei an Briefkopf und Vorschaubilder für soziale Netzwerke mit.",
      "Das dauert länger als bei den anderen Paketen. Vor dem ersten Entwurf treffen wir uns in Hamburg oder bei Ihnen, danach gibt es bis zu drei Korrekturrunden.",
      "Nach dem Start kümmert sich derselbe Mensch, der die Seite entworfen hat, um die zehn kleinen Änderungen pro Monat.",
    ],
    afterLaunch: [
      "Verwaltbare Bereiche (bis zu 12), individuell zugeschnitten",
      "Zehn kleine Änderungen pro Monat",
      "Einmal im Quartal ein Gespräch über das, was sich geändert hat",
      "Vorrang bei kurzfristigen Anfragen, Antwort meist am selben Werktag",
      "Sie sprechen mit dem, der Ihre Seite gebaut hat",
      "Hosting, SSL und Backups in der EU, Prüfung der Ladezeit",
    ],
    recommendedFor: [
      { slug: "praxis", label: "Privatpraxen" },
      { slug: "kanzlei", label: "Kanzleien" },
      { slug: "gastro", label: "Restaurants mit Konzept" },
    ],
    faq: [
      {
        q: "Wo liegt der Unterschied zu Premium?",
        a: "Bei Premium geht es vor allem um Bereiche, die Sie selbst pflegen. Bei Studio legen wir zusätzlich Schrift, Farben und Bildsprache eigens für Ihren Betrieb fest, mit einem Treffen vor Ort und bis zu drei Korrekturrunden.",
      },
      {
        q: "Brauche ich Studio?",
        a: "Den meisten lokalen Betrieben reicht Business oder Premium. Studio lohnt sich, wenn Sie Ihr Erscheinungsbild ohnehin neu aufstellen. Wenn ein kleineres Paket reicht, sagen wir Ihnen das im Erstgespräch.",
      },
      {
        q: "Wie lange dauert der Bau?",
        a: "Drei bis fünf Wochen, je nach Umfang. Wenn es eilig ist, starten Sie mit Business und wechseln später.",
      },
      {
        q: "Was, wenn ich später wechseln will?",
        a: "Den Monatsbeitrag können Sie nach der Mindestlaufzeit kündigen. Die Seite und der Quellcode gehören Ihnen, wir übergeben beides an Sie oder Ihren neuen Anbieter.",
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

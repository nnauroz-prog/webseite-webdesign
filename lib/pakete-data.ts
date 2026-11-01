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
  /**
   * Richtwert, bis die Seite online ist, gezählt ab vollständigen
   * Unterlagen (Stichpunkte und Fotos). Klein geschrieben, damit er
   * in Sätze passt („… vergehen meist 5–10 Werktage“). Kanonisch,
   * siehe /pakete, /faq, Startseite und Branchen-Landingpages.
   */
  dauer: string;
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
    setup: "ab 499\u00A0€",
    monthly: "ab 49\u00A0€ / Monat",
    dauer: "oft 1–2 Werktage",
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
      "Friseur:in mit Preisliste, Öffnungszeiten und Anruf-Knopf",
    ],
    limits: [
      "Unterseiten für einzelne Leistungen (ab Business)",
      "Bereiche, die Sie selbst pflegen (ab Premium)",
      "Mehr als eine kleine Änderung pro Monat",
    ],
    detailHeadline: "Eine Seite, schnell online.",
    detailIntro: [
      "Starter ist eine einzelne Seite mit Leistungen, Öffnungszeiten, Anfahrt und Kontakt. Über Unterseiten, Galerien oder Online-Buchung müssen Sie dafür nicht nachdenken. Eine Seite wie diese ist oft in 1–2 Werktagen online, sobald Ihre Stichpunkte und Fotos bei uns sind.",
      "Wenn Sie später mehr Platz brauchen, erweitern wir die Seite zum Business-Paket. Sie zahlen dann die Differenz im Einmalpreis, neu gebaut wird nichts.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Eine kleine Änderung pro Monat (Texte, Bilder, Öffnungszeiten)",
      "Sicherheits-Updates und technische Pflege im Hintergrund",
      "Sie schreiben uns, wir antworten meist am selben Werktag",
    ],
    recommendedFor: [
      { slug: "handwerker", label: "Selbstständige Handwerker" },
      { slug: "gastro", label: "Kleine Cafés" },
    ],
    faq: [
      {
        q: "Reicht eine Onepage-Website wirklich für mein Unternehmen?",
        a: "Oft ja. Wenn Sie weniger als fünf Leistungen anbieten und keine eigenen Bereiche für Team, Neuigkeiten oder Stellen brauchen, ist eine Seite übersichtlicher. Mehrere Seiten lohnen sich, wenn Sie zu jeder Leistung viel zu sagen haben oder für einzelne Leistungen bei Google gefunden werden wollen.",
      },
      {
        q: "Kann ich später aufs Business-Paket wechseln?",
        a: "Ja, jederzeit. Sie zahlen nur die Differenz im Einmalpreis. Ihre bestehende Seite wird erweitert, nicht neu gebaut.",
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
    setup: "ab 899\u00A0€",
    monthly: "ab 79\u00A0€ / Monat",
    dauer: "meist 5–10 Werktage",
    description:
      "Mehrere Seiten für Leistungen, Team und Galerie. Für lokale Betriebe mit mehreren Angeboten.",
    whoFor:
      "Für lokale Betriebe mit mehreren Leistungen und einem Team, das sich vorstellen soll.",
    contents: [
      "Website mit mehreren Seiten",
      "Bis zu 5 Unterseiten",
      "Team-Bereich mit Fotos",
      "Leistungen mit ausführlicher Beschreibung",
      "Bildergalerie, Fotos lassen sich groß ansehen",
      "Formular für Bewerbung oder Terminanfrage",
      "Grundlagen für Google: Titel, Beschreibungen, Sitemap",
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
      "Business ist das Paket, das wir den meisten lokalen Betrieben empfehlen. Sie bekommen eine Website mit eigenen Seiten für Leistungen, Team, Galerie und Kontakt. Jede Seite bekommt einen eigenen Titel und eine Beschreibung für Google. Eine Seite wie diese ist meist in 5–10 Werktagen online, sobald Ihre Stichpunkte und Fotos bei uns sind.",
      "Dazu gehören bis zu fünf Unterseiten, die Aufbereitung Ihrer Fotos, eine Sitemap und strukturierte Daten für Google. Im Monatsbeitrag sind drei kleine Änderungen pro Monat enthalten.",
    ],
    afterLaunch: [
      "Hosting in der EU mit SSL und automatischen Backups",
      "Drei kleine Änderungen pro Monat (Texte, Bilder, Team, …)",
      "Updates und eine regelmäßige Prüfung der Ladezeit",
      "Sie schreiben oder rufen direkt bei uns an, unter 0160\u00A07621876",
      "Erweiterungen jederzeit, etwa eine weitere Unterseite; den Preis nennen wir vorher",
    ],
    recommendedFor: [
      { slug: "pflege", label: "Pflegedienste" },
      { slug: "praxis", label: "Arzt- und Zahnarztpraxen" },
      { slug: "friseur", label: "Friseure" },
      { slug: "kanzlei", label: "Kanzleien" },
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
    setup: "ab 2.499\u00A0€",
    monthly: "ab 179\u00A0€ / Monat",
    dauer: "meist 2–3 Wochen",
    description:
      "Eine Struktur, die wir für Ihren Betrieb anlegen, mit Bereichen, die Sie selbst pflegen, etwa Speisekarte, Wochenangebot oder Termine.",
    whoFor:
      "Für Betriebe, deren Inhalte sich oft ändern, etwa Gastronomie, Studios oder Beratungen mit Online-Buchung.",
    contents: [
      "Gestaltung für Ihren Betrieb",
      "Aufbau der Seite nach Ihrem Bedarf",
      "Bereiche, die Sie selbst ändern können",
      "Speisekarte oder Wochenangebot selbst änderbar",
      "Formulare für Kontakt, Bewerbung und Online-Buchung",
      "Mehr Arbeit an den Suchbegriffen",
      "Regelmäßige Prüfung von Formularen und Ladezeit",
      "Bis zu 6 kleine Änderungen pro Monat",
    ],
    examples: [
      "Café mit täglich wechselndem Mittagstisch",
      "Friseur mit Online-Termin-Buchung",
      "Pflegedienst mit Stellenangeboten und Neuigkeiten zum Selbstpflegen",
      "Restaurant mit Speisekarte und Wochenangebot",
    ],
    limits: [
      "Shop oder eigene App (besprechen wir im Einzelfall)",
    ],
    detailHeadline: "Inhalte, die Sie selbst pflegen.",
    detailIntro: [
      "Premium passt, wenn sich auf Ihrer Website jede Woche etwas ändert. Die Speisekarte, das Wochenangebot, den Kursplan oder neue Termine tragen Sie selbst ein und müssen dafür nicht bei uns anrufen. Bis die Seite online ist, vergehen meist 2–3 Wochen ab vollständigen Unterlagen.",
      "Welche Bereiche Sie selbst ändern können, legen wir mit Ihnen fest. Sie melden sich unter einer eigenen Adresse an und sehen dort nur die Felder, die Sie brauchen.",
      "Im Monatsbeitrag sind sechs kleine Änderungen pro Monat enthalten. Ihre Anfragen bearbeiten wir bevorzugt, meist noch am selben Tag.",
    ],
    afterLaunch: [
      "Bereiche zum Selbstpflegen: Speisekarte, Angebot, Termine",
      "Sechs kleine Änderungen pro Monat von uns",
      "Wir beobachten Ihre Suchbegriffe und passen die Seite an",
      "Hosting + SSL + Backups in der EU",
      "Ihre Anfragen beantworten wir bevorzugt, meist noch am selben Tag",
    ],
    recommendedFor: [
      { slug: "gastro", label: "Restaurants mit wechselnder Karte" },
      { slug: "friseur", label: "Friseure, die Termine online vergeben" },
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
        a: "Sechs kleine Änderungen pro Monat sind im Beitrag enthalten. Ist das Kontingent eines Monats aufgebraucht, sagen wir Ihnen das vorher; jede weitere rechnen wir nach Aufwand zum Stundensatz ab, meist 15 bis 30 Minuten. Eine kurze Rückfrage per Mail zählt nicht als Änderung. Für Größeres, etwa einen neuen Bereich, bekommen Sie vorher ein verbindliches Angebot.",
      },
    ],
  },
  {
    slug: "studio",
    name: "Sitalo Studio",
    badge: "Neues Erscheinungsbild",
    setup: "ab 3.490\u00A0€",
    monthly: "ab 249\u00A0€ / Monat",
    dauer: "meist 3–5 Wochen",
    description:
      "Neues Erscheinungsbild, bis zu drei Korrekturrunden und ein Treffen vor Ort. Für Betriebe, die ihren ganzen Auftritt neu aufstellen.",
    whoFor:
      "Für Betriebe, die sich in der Gestaltung deutlich von anderen ihrer Branche abheben wollen, etwa Privatpraxen, Architekturbüros, Beratungen oder Restaurants mit eigenem Konzept.",
    contents: [
      "Erscheinungsbild von Grund auf: Schrift, Farben und Bildsprache entwerfen wir neu",
      "Ein Treffen vor dem Entwurf, in Hamburg oder bei Ihnen",
      "Bis zu 3 Korrekturrunden",
      "Briefkopf und Vorschaubilder im selben Stil",
      "Bis zu 12 Bereiche oder Seiten, auch zum Selbstpflegen",
      "Auf Wunsch zweisprachig (Deutsch und eine weitere Sprache)",
      "Bis zu 10 kleine Änderungen pro Monat",
      "Bevorzugte Bearbeitung, meist noch am selben Tag",
    ],
    examples: [
      "Privatpraxis mit eigener Bildsprache",
      "Architekturbüro mit Portfolio und ruhiger Typografie",
      "Restaurant mit Konzept-Website und mehrsprachiger Karte",
      "Beratung mit eigenem Erscheinungsbild",
    ],
    limits: [
      "Online-Shop (besprechen wir im Einzelfall)",
      "Entwicklung einer eigenen App",
      "Ein neues Logo; Ihr vorhandenes bauen wir in das Erscheinungsbild ein",
    ],
    detailHeadline: "Ein neues Erscheinungsbild für Ihren Betrieb.",
    detailIntro: [
      "Bei Sitalo Studio gestalten wir mehr als die Website. Wir legen Schrift, Farben, Bildsprache und Ton für Ihren Betrieb fest und denken dabei an Briefkopf und Vorschaubilder für soziale Netzwerke mit.",
      "Das dauert länger als bei den anderen Paketen, meist 3–5 Wochen ab vollständigen Unterlagen. Vor dem ersten Entwurf treffen wir uns in Hamburg oder bei Ihnen, danach gibt es bis zu drei Korrekturrunden.",
      "Nach dem Start erledigen wir zehn kleine Änderungen pro Monat für Sie, und einmal im Quartal sprechen wir über Ihre Seite.",
    ],
    afterLaunch: [
      "Bis zu 12 Bereiche zum Selbstpflegen, auf Ihren Ablauf zugeschnitten",
      "Zehn kleine Änderungen pro Monat",
      "Einmal im Quartal ein Gespräch über das, was sich geändert hat",
      "Vorrang bei kurzfristigen Anfragen, meist noch am selben Tag",
      "Hosting, SSL und Backups in der EU, Prüfung der Ladezeit",
    ],
    recommendedFor: [
      { slug: "praxis", label: "Privatpraxen" },
      { slug: "kanzlei", label: "Kanzleien mit eigenem Auftritt" },
      { slug: "gastro", label: "Restaurants mit Konzept" },
    ],
    faq: [
      {
        q: "Wo liegt der Unterschied zu Premium?",
        a: "Bei Premium geht es vor allem um Bereiche, die Sie selbst pflegen. Bei Studio entwerfen wir zusätzlich Ihr Erscheinungsbild neu: Schrift, Farben und Bildsprache, mit einem Treffen vor Ort und bis zu drei Korrekturrunden.",
      },
      {
        q: "Brauche ich Studio?",
        a: "Den meisten lokalen Betrieben reicht Business oder Premium. Studio lohnt sich, wenn Sie Ihr Erscheinungsbild ohnehin neu aufstellen. Wenn ein kleineres Paket reicht, sagen wir Ihnen das im Erstgespräch.",
      },
      {
        q: "Wie lange dauert der Bau?",
        a: "Meist drei bis fünf Wochen ab vollständigen Unterlagen, je nach Umfang. Wenn es eilig ist, starten Sie mit Business. Für einen späteren Wechsel zu Studio gestalten wir die Seite neu; den Preis dafür nennen wir Ihnen vorher.",
      },
      {
        q: "Was, wenn ich später wechseln will?",
        a: "Den Monatsbeitrag können Sie nach der Mindestlaufzeit kündigen. Die Seite und der Quellcode gehören Ihnen, wir übergeben beides an Sie oder Ihren neuen Anbieter.",
      },
    ],
  },
];

/**
 * Alle Preise oben sind Nettopreise. Das Angebot richtet sich nur an
 * Unternehmer (§ 14 BGB), deshalb dürfen Netto-Preise stehen, wenn das
 * bei jeder Preisnennung klar dabeisteht (PAngV gilt gegenüber
 * Verbrauchern). Kurzform für Hero-Zeilen, Langform für Fußnoten.
 */
export const PREIS_HINWEIS_KURZ = "Für Betriebe und Selbstständige, Preise zzgl. 19 % USt.";
export const PREIS_HINWEIS =
  "Unser Angebot richtet sich an Betriebe und Selbstständige (Unternehmer nach § 14 BGB). Alle Preise zzgl. 19 % USt.";

/** „oft 1–2 Werktage" → „oft nach 1–2 Werktagen" (für „steht … online"). */
export function nachDauer(dauer: string): string {
  return dauer.replace(/^(oft|meist)\s+/, "$1 nach ").replace(/Werktage$/, "Werktagen");
}

export function getPaketBySlug(
  slug: string,
): Paket | undefined {
  return PAKETE.find((p) => p.slug === slug);
}

export function getAllPaketSlugs(): string[] {
  return PAKETE.map((p) => p.slug);
}

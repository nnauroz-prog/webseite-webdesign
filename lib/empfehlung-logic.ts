/**
 * Empfehlungs-Logik für das Pakete-Quiz.
 *
 * Bewusst transparent gehalten — die Regeln sind sichtbar im Code,
 * keine Black-Box. Jede Antwort verteilt Punkte auf die drei Pakete.
 * Höchste Summe gewinnt; bei Gleichstand schlägt das mittlere Paket
 * (Business), weil das in 70 % der Fälle die ehrliche Wahl ist.
 *
 * Die Begründung wird live aus den getroffenen Antworten gebaut,
 * nicht aus einer Template-Bibliothek — fühlt sich konkret an.
 */

export type Branche =
  | "pflegedienst"
  | "arztpraxis"
  | "zahnarzt"
  | "friseur"
  | "kosmetik"
  | "cafe"
  | "handwerker"
  | "reinigung"
  | "kanzlei"
  | "fitness"
  | "hotel"
  | "sonstiges";

export type GroesseSlug = "einzel" | "klein" | "mittel" | "gross";
export type MaterialSlug = "logo" | "texte" | "bilder" | "nichts";
export type ZeitSlug = "asap" | "2wochen" | "1monat" | "offen";
export type SiteSlug = "neu" | "schlecht" | "ok" | "neustart";

export type Answers = {
  branche: Branche | null;
  groesse: GroesseSlug | null;
  materialien: MaterialSlug[];
  zeit: ZeitSlug | null;
  site: SiteSlug | null;
};

export type EmpfehlungSlug = "starter" | "business" | "premium";

export const EMPTY_ANSWERS: Answers = {
  branche: null,
  groesse: null,
  materialien: [],
  zeit: null,
  site: null,
};

export const BRANCHEN_OPTIONS: { slug: Branche; label: string }[] = [
  { slug: "cafe", label: "Café / Restaurant" },
  { slug: "friseur", label: "Friseur" },
  { slug: "kosmetik", label: "Kosmetik" },
  { slug: "pflegedienst", label: "Pflegedienst" },
  { slug: "arztpraxis", label: "Arztpraxis" },
  { slug: "zahnarzt", label: "Zahnarztpraxis" },
  { slug: "handwerker", label: "Handwerker" },
  { slug: "reinigung", label: "Reinigung" },
  { slug: "kanzlei", label: "Kanzlei" },
  { slug: "fitness", label: "Fitnessstudio" },
  { slug: "hotel", label: "Boutique-Hotel" },
  { slug: "sonstiges", label: "Andere" },
];

export const GROESSE_OPTIONS: { slug: GroesseSlug; label: string; detail: string }[] = [
  { slug: "einzel", label: "Ich allein", detail: "Solo-Selbstständig" },
  { slug: "klein", label: "2–5 Personen", detail: "Kleinteam" },
  { slug: "mittel", label: "6–15 Personen", detail: "Mittlerer Betrieb" },
  { slug: "gross", label: "16+ Personen", detail: "Größeres Team" },
];

export const MATERIAL_OPTIONS: { slug: MaterialSlug; label: string; detail: string }[] = [
  { slug: "logo", label: "Logo", detail: "Datei oder gedrucktes Vorbild" },
  { slug: "texte", label: "Texte", detail: "Über-uns, Leistungen, sonst was" },
  { slug: "bilder", label: "Bilder", detail: "Räumlichkeit, Team, Produkte" },
  { slug: "nichts", label: "Nichts davon", detail: "Wir helfen bei allem" },
];

export const ZEIT_OPTIONS: { slug: ZeitSlug; label: string; detail: string }[] = [
  { slug: "asap", label: "So schnell wie möglich", detail: "Diese Woche oder nächste" },
  { slug: "2wochen", label: "Innerhalb 2 Wochen", detail: "Es brennt nicht, aber bald" },
  { slug: "1monat", label: "Innerhalb 1 Monat", detail: "Planbar" },
  { slug: "offen", label: "Noch offen", detail: "Wir gucken mal" },
];

export const SITE_OPTIONS: { slug: SiteSlug; label: string; detail: string }[] = [
  { slug: "neu", label: "Nein, ganz neu", detail: "Erste Website überhaupt" },
  { slug: "schlecht", label: "Ja, läuft schlecht", detail: "Veraltet, zu langsam, kaputt" },
  { slug: "ok", label: "Ja, läuft OK", detail: "Funktioniert, aber nicht mehr zeitgemäß" },
  { slug: "neustart", label: "Will komplett neu starten", detail: "Brand-Refresh, neuer Auftritt" },
];

const COMPLEX_BRANCHEN: Branche[] = [
  "pflegedienst",
  "arztpraxis",
  "zahnarzt",
  "kanzlei",
  "hotel",
];

const SIMPLE_BRANCHEN: Branche[] = [
  "cafe",
  "friseur",
  "kosmetik",
  "handwerker",
];

export type Empfehlung = {
  paket: EmpfehlungSlug;
  paketLabel: string;
  preisLabel: string;
  begruendung: string[];
  /** Zusatzhinweis wenn z. B. /wartung mit dazu Sinn ergibt. */
  zusatzHinweis: string | null;
};

const PAKET_META: Record<EmpfehlungSlug, { label: string; preis: string }> = {
  starter: { label: "Starter", preis: "ab 499 € einmalig · ab 49 € / Monat" },
  business: { label: "Business", preis: "ab 1.490 € einmalig · ab 89 € / Monat" },
  premium: { label: "Premium", preis: "ab 2.990 € einmalig · ab 149 € / Monat" },
};

/**
 * Hauptlogik: nimmt Antworten, gibt Empfehlung zurück.
 * Wirft NICHT — fehlende Antworten ergeben „business" als Default.
 */
export function empfehle(a: Answers): Empfehlung {
  const score = { starter: 0, business: 0, premium: 0 };
  const reasons: string[] = [];

  // Branche
  if (a.branche) {
    if (COMPLEX_BRANCHEN.includes(a.branche)) {
      score.business += 2;
      score.premium += 1;
      reasons.push(
        `Ihre Branche braucht erfahrungsgemäß mehr als eine Onepage-Struktur — Vertrauen entscheidet, Inhalte müssen ordentlich gegliedert sein.`,
      );
    } else if (SIMPLE_BRANCHEN.includes(a.branche)) {
      score.starter += 2;
      score.business += 1;
      reasons.push(
        `Für Ihre Branche reicht meist ein klarer Onepage-Auftritt — die wichtigsten Fragen Ihrer Kunden lassen sich gut auf einer Seite beantworten.`,
      );
    } else {
      score.business += 1;
    }
  }

  // Größe
  if (a.groesse === "einzel") {
    score.starter += 2;
    reasons.push(
      `Als Solo-Selbstständig brauchen Sie keinen großen Auftritt, sondern einen ehrlichen.`,
    );
  } else if (a.groesse === "klein") {
    score.starter += 1;
    score.business += 2;
    reasons.push(
      `Mit einem kleinen Team gehört eine eigene „Team"-Sektion oder ein „Über uns" dazu — das passt in den Business-Rahmen.`,
    );
  } else if (a.groesse === "mittel") {
    score.business += 2;
    score.premium += 1;
    reasons.push(
      `Bei mittleren Betrieben werden mehrseitige Strukturen sinnvoll — Leistungen, Team, Karriere, Standorte getrennt darstellbar.`,
    );
  } else if (a.groesse === "gross") {
    score.business += 1;
    score.premium += 3;
    reasons.push(
      `Größere Betriebe brauchen verwaltbare Inhalte (Termine, Stellenangebote, Standorte) und einen Auftritt, der zur Unternehmensgröße passt.`,
    );
  }

  // Materialien
  const hatNichts = a.materialien.includes("nichts");
  const hatAlles =
    a.materialien.includes("logo") &&
    a.materialien.includes("texte") &&
    a.materialien.includes("bilder");

  if (hatNichts) {
    score.starter += 1;
    reasons.push(
      `Weil noch nichts vorbereitet ist, hilft ein klar abgegrenzter Einstiegs-Umfang — wir gehen Schritt für Schritt mit Ihnen durch, was wirklich nötig ist.`,
    );
  } else if (hatAlles) {
    score.business += 1;
    reasons.push(
      `Sie haben alle drei Grundsteine zusammen — wir können direkt bauen, ohne lange Vorlauf-Phase.`,
    );
  }

  // Zeit
  if (a.zeit === "asap") {
    score.starter += 1;
    reasons.push(
      `Bei „so schnell wie möglich" ist ein eng abgegrenzter Umfang realistischer — wir kommen in 1–2 Werktagen live, statt auf Vollausstattung zu warten.`,
    );
  }

  // Site
  if (a.site === "neustart") {
    score.business += 1;
    score.premium += 1;
  }

  // Tiebreaker: bei Gleichstand gewinnt Business
  let winner: EmpfehlungSlug = "business";
  let max = score.business;
  if (score.premium > max) {
    winner = "premium";
    max = score.premium;
  }
  if (score.starter > max) {
    winner = "starter";
    max = score.starter;
  }

  // Zusatzhinweis aus Site-Status
  let zusatzHinweis: string | null = null;
  if (a.site === "schlecht" || a.site === "ok") {
    zusatzHinweis = `Hinweis: Ihre bestehende Seite kann währenddessen auf unserem Wartung-Tarif laufen — sicher, schnell, mit kleinen Verbesserungen. Sie ist nicht alleingelassen, bis das Neue steht.`;
  }

  return {
    paket: winner,
    paketLabel: PAKET_META[winner].label,
    preisLabel: PAKET_META[winner].preis,
    begruendung: reasons.length > 0 ? reasons : ["Unsere typische Empfehlung für diesen Profil-Mix."],
    zusatzHinweis,
  };
}

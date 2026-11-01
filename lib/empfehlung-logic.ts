/**
 * Empfehlungs-Logik für das Pakete-Quiz.
 *
 * Bewusst transparent gehalten — die Regeln sind sichtbar im Code,
 * keine Black-Box. Jede Antwort verteilt Punkte auf die drei Pakete.
 * Höchste Summe gewinnt; bei Gleichstand gewinnt Business, weil wir
 * es den meisten lokalen Betrieben empfehlen.
 *
 * Die Begründung wird aus den getroffenen Antworten zusammengesetzt.
 */

import { getPaketBySlug } from "@/lib/pakete-data";

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
  { slug: "texte", label: "Texte", detail: "Über uns, Leistungen oder Stichpunkte" },
  { slug: "bilder", label: "Bilder", detail: "Räumlichkeit, Team, Produkte" },
  { slug: "nichts", label: "Nichts davon", detail: "Dann fangen wir bei null an" },
];

export const ZEIT_OPTIONS: { slug: ZeitSlug; label: string; detail: string }[] = [
  { slug: "asap", label: "So schnell wie möglich", detail: "Diese oder nächste Woche" },
  { slug: "2wochen", label: "Innerhalb 2 Wochen", detail: "Es brennt nicht, aber bald" },
  { slug: "1monat", label: "Innerhalb 1 Monat", detail: "Planbar" },
  { slug: "offen", label: "Noch offen", detail: "Kein fester Termin" },
];

export const SITE_OPTIONS: { slug: SiteSlug; label: string; detail: string }[] = [
  { slug: "neu", label: "Nein, ganz neu", detail: "Erste Website überhaupt" },
  { slug: "schlecht", label: "Ja, läuft schlecht", detail: "Veraltet, zu langsam, kaputt" },
  { slug: "ok", label: "Ja, läuft OK", detail: "Funktioniert, aber nicht mehr zeitgemäß" },
  { slug: "neustart", label: "Ja, aber alles soll neu", detail: "Neues Erscheinungsbild, neue Texte" },
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

// Label und Preis kommen direkt aus der kanonischen Quelle
// lib/pakete-data.ts — Preisänderungen dort schlagen automatisch
// hier durch, kein Hand-Sync mehr nötig.
function paketMeta(slug: EmpfehlungSlug): { label: string; preis: string } {
  const p = getPaketBySlug(slug);
  if (!p) return { label: slug, preis: "" };
  return { label: p.name, preis: `${p.setup} einmalig · ${p.monthly}` };
}

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
        `In Ihrer Branche lesen Kunden meist mehrere Seiten, bevor sie anrufen. Leistungen, Team und Kontakt sollten deshalb getrennt stehen.`,
      );
    } else if (SIMPLE_BRANCHEN.includes(a.branche)) {
      score.starter += 2;
      score.business += 1;
      reasons.push(
        `In Ihrer Branche reicht oft eine einzelne Seite. Die wichtigsten Fragen Ihrer Kunden lassen sich dort beantworten.`,
      );
    } else {
      score.business += 1;
    }
  }

  // Größe
  if (a.groesse === "einzel") {
    score.starter += 2;
    reasons.push(
      `Wer allein arbeitet, kommt meist mit einer Seite aus: was Sie anbieten, wo Sie arbeiten und wie man Sie erreicht.`,
    );
  } else if (a.groesse === "klein") {
    score.starter += 1;
    score.business += 2;
    reasons.push(
      `Mit einem kleinen Team gehört ein Bereich „Team“ oder „Über uns“ dazu. Dafür hat Business eigene Unterseiten.`,
    );
  } else if (a.groesse === "mittel") {
    score.business += 2;
    score.premium += 1;
    reasons.push(
      `Bei Betrieben dieser Größe lohnen sich mehrere Seiten, etwa für Leistungen, Team, Stellen und Standorte.`,
    );
  } else if (a.groesse === "gross") {
    score.business += 1;
    score.premium += 3;
    reasons.push(
      `Bei einem größeren Team ändern sich Termine, Stellen und Standorte oft. Mit Premium pflegen Sie diese Bereiche selbst.`,
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
      `Weil noch nichts vorbereitet ist, passt ein kleiner Umfang für den Anfang. Wir gehen mit Ihnen durch, was die Seite wirklich braucht.`,
    );
  } else if (hatAlles) {
    score.business += 1;
    reasons.push(
      `Logo, Texte und Bilder liegen schon vor. Wir können also gleich mit dem Bau anfangen.`,
    );
  }

  // Zeit
  if (a.zeit === "asap") {
    score.starter += 1;
    reasons.push(
      `Wenn es schnell gehen soll, hilft ein kleiner Umfang. Eine einzelne Seite ist oft in 1–2 Werktagen online.`,
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
    zusatzHinweis = `Bis die neue Seite fertig ist, können wir Ihre bestehende Seite über einen Wartungstarif betreuen. Dann laufen Updates und kleine Korrekturen weiter.`;
  }

  const meta = paketMeta(winner);
  return {
    paket: winner,
    paketLabel: meta.label,
    preisLabel: meta.preis,
    begruendung: reasons.length > 0 ? reasons : ["Business empfehlen wir den meisten lokalen Betrieben."],
    zusatzHinweis,
  };
}

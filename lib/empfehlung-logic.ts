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

export const GROESSE_OPTIONS: {
  slug: GroesseSlug;
  label: string;
  detail: string;
}[] = [
  { slug: "einzel", label: "Ich allein", detail: "Solo-Selbstständig" },
  { slug: "klein", label: "2–5 Personen", detail: "Kleinteam" },
  { slug: "mittel", label: "6–15 Personen", detail: "Mittlerer Betrieb" },
  { slug: "gross", label: "16+ Personen", detail: "Größeres Team" },
];

export const MATERIAL_OPTIONS: {
  slug: MaterialSlug;
  label: string;
  detail: string;
}[] = [
  { slug: "logo", label: "Logo", detail: "Datei oder gedrucktes Vorbild" },
  {
    slug: "texte",
    label: "Texte",
    detail: "Über uns, Leistungen oder Stichpunkte",
  },
  { slug: "bilder", label: "Bilder", detail: "Räumlichkeit, Team, Produkte" },
  {
    slug: "nichts",
    label: "Nichts davon",
    detail: "Dann fangen wir bei null an",
  },
];

export const ZEIT_OPTIONS: { slug: ZeitSlug; label: string; detail: string }[] =
  [
    {
      slug: "asap",
      label: "So schnell wie möglich",
      detail: "Diese oder nächste Woche",
    },
    {
      slug: "2wochen",
      label: "Innerhalb 2 Wochen",
      detail: "Es brennt nicht, aber bald",
    },
    { slug: "1monat", label: "Innerhalb 1 Monat", detail: "Planbar" },
    { slug: "offen", label: "Noch offen", detail: "Kein fester Termin" },
  ];

export const SITE_OPTIONS: { slug: SiteSlug; label: string; detail: string }[] =
  [
    { slug: "neu", label: "Nein, ganz neu", detail: "Erste Website überhaupt" },
    {
      slug: "schlecht",
      label: "Ja, läuft schlecht",
      detail: "Veraltet, zu langsam, kaputt",
    },
    {
      slug: "ok",
      label: "Ja, läuft OK",
      detail: "Funktioniert, aber nicht mehr zeitgemäß",
    },
    {
      slug: "neustart",
      label: "Ja, aber alles soll neu",
      detail: "Neue Seite, neue Texte",
    },
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
  /** Weiterführender Link zum Zusatzhinweis. */
  zusatzLink: { href: string; label: string } | null;
};

// Label und Preis kommen direkt aus der kanonischen Quelle
// lib/pakete-data.ts — Preisänderungen dort schlagen automatisch
// hier durch, kein Hand-Sync mehr nötig.
function paketMeta(slug: EmpfehlungSlug): { label: string; preis: string } {
  const p = getPaketBySlug(slug);
  if (!p) return { label: slug, preis: "" };
  return { label: p.name, preis: `${p.setup} einmalig · ${p.monthly}` };
}

/** Richtung eines Grundes: spricht er für ein kleines oder ein größeres Paket? */
type Richtung = "klein" | "gross" | "neutral";
type Grund = { richtung: Richtung; text: string };

/** „meist 5–10 Werktage" → „meist in 5–10 Werktagen" (für „… ist … online"). */
function inDauer(dauer: string): string {
  return dauer
    .replace(/^(oft|meist)\s+/, "$1 in ")
    .replace(/Werktage$/, "Werktagen");
}

const FALLBACK: Record<EmpfehlungSlug, string> = {
  starter:
    "Für den Anfang reicht eine Seite mit Leistungen, Öffnungszeiten und Kontakt.",
  business: "Business empfehlen wir den meisten lokalen Betrieben.",
  premium:
    "Premium passt, wenn sich auf Ihrer Seite oft etwas ändert und Sie diese Bereiche selbst pflegen wollen.",
};

/**
 * Hauptlogik: nimmt Antworten, gibt Empfehlung zurück.
 * Wirft NICHT — fehlende Antworten ergeben „business" als Default.
 *
 * Jeder Grund trägt eine Richtung. Ausgegeben werden nur die neutralen
 * Gründe und die, die zur Empfehlung passen. So widerspricht die
 * Begründung nie dem empfohlenen Paket.
 */
export function empfehle(a: Answers): Empfehlung {
  const score = { starter: 0, business: 0, premium: 0 };
  const reasons: Grund[] = [];

  // Branche
  const komplex = a.branche !== null && COMPLEX_BRANCHEN.includes(a.branche);
  if (a.branche) {
    if (komplex) {
      score.business += 2;
      score.premium += 1;
      reasons.push({
        richtung: "gross",
        text: `In Ihrer Branche lesen Kunden meist mehrere Seiten, bevor sie anrufen. Leistungen, Team und Kontakt sollten deshalb getrennt stehen.`,
      });
    } else if (SIMPLE_BRANCHEN.includes(a.branche)) {
      score.starter += 2;
      score.business += 1;
      reasons.push({
        richtung: "klein",
        text: `In Ihrer Branche reicht oft eine einzelne Seite. Die wichtigsten Fragen Ihrer Kunden lassen sich dort beantworten.`,
      });
    } else {
      score.business += 1;
    }
  }

  // Größe
  if (a.groesse === "einzel") {
    score.starter += 2;
    reasons.push({
      richtung: "klein",
      text: `Wer allein arbeitet, kommt meist mit einer Seite aus: was Sie anbieten, wo Sie arbeiten und wie man Sie erreicht.`,
    });
  } else if (a.groesse === "klein") {
    score.starter += 1;
    score.business += 2;
    reasons.push({
      richtung: "gross",
      text: `Mit einem kleinen Team gehört ein Bereich „Team“ oder „Über uns“ dazu. Dafür hat Business eigene Unterseiten.`,
    });
  } else if (a.groesse === "mittel") {
    score.business += 2;
    score.premium += 1;
    reasons.push({
      richtung: "gross",
      text: `Bei Betrieben dieser Größe lohnen sich mehrere Seiten, etwa für Leistungen, Team, Stellen und Standorte.`,
    });
  } else if (a.groesse === "gross") {
    score.business += 1;
    score.premium += 3;
    reasons.push({
      richtung: "gross",
      text: `Bei einem größeren Team ändern sich Termine, Stellen und Standorte oft. Mit Premium pflegen Sie diese Bereiche selbst.`,
    });
  }

  // Materialien
  const hatNichts = a.materialien.includes("nichts");
  const hatAlles =
    a.materialien.includes("logo") &&
    a.materialien.includes("texte") &&
    a.materialien.includes("bilder");

  if (hatNichts) {
    score.starter += 1;
    reasons.push({
      richtung: "klein",
      text: `Weil noch nichts vorbereitet ist, passt ein kleiner Umfang für den Anfang. Wir gehen mit Ihnen durch, was die Seite wirklich braucht.`,
    });
  } else if (hatAlles) {
    score.business += 1;
    reasons.push({
      richtung: "neutral",
      text: `Logo, Texte und Bilder liegen schon vor. Wir können also gleich mit dem Bau anfangen.`,
    });
  }

  // Zeit (der Satz hängt vom Ergebnis ab, siehe unten)
  if (a.zeit === "asap") {
    score.starter += 1;
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
  // In Branchen, in denen Kunden mehrere Seiten lesen, reicht eine
  // einzelne Seite nicht, auch wenn die übrigen Antworten dafür sprechen.
  if (komplex && winner === "starter") winner = "business";

  if (a.zeit === "asap") {
    const dauer = getPaketBySlug(winner)?.dauer;
    if (winner === "starter") {
      reasons.push({
        richtung: "klein",
        text: `Wenn es schnell gehen soll, hilft ein kleiner Umfang. Eine einzelne Seite ist ${dauer ? inDauer(dauer) : "schnell"} online.`,
      });
    } else if (dauer) {
      reasons.push({
        richtung: "neutral",
        text: `Wenn es schnell gehen soll, starten wir mit den wichtigsten Seiten. ${paketMeta(winner).label} ist ${inDauer(dauer)} online.`,
      });
    }
  }

  const passend: Richtung = winner === "starter" ? "klein" : "gross";
  const begruendung = reasons
    .filter((r) => r.richtung === "neutral" || r.richtung === passend)
    .map((r) => r.text);

  // Zusatzhinweis aus Site-Status
  let zusatzHinweis: string | null = null;
  let zusatzLink: Empfehlung["zusatzLink"] = null;
  if (a.site === "schlecht" || a.site === "ok") {
    zusatzHinweis = `Bis die neue Seite fertig ist, können wir Ihre bestehende Seite über einen Wartungstarif betreuen. Dann laufen Updates und kleine Korrekturen weiter.`;
    zusatzLink = { href: "/wartung", label: "Wartung ansehen" };
  } else if (a.site === "neustart") {
    const studio = getPaketBySlug("studio");
    if (studio) {
      zusatzHinweis = `Sollen auch Schrift, Farben und Bildsprache neu werden, passt ${studio.name} ${studio.setup}. Das klären wir im Erstgespräch.`;
      zusatzLink = {
        href: `/pakete/${studio.slug}`,
        label: `${studio.name} ansehen`,
      };
    }
  }

  const meta = paketMeta(winner);
  return {
    paket: winner,
    paketLabel: meta.label,
    preisLabel: meta.preis,
    begruendung: begruendung.length > 0 ? begruendung : [FALLBACK[winner]],
    zusatzHinweis,
    zusatzLink,
  };
}

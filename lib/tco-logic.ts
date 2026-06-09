/**
 * 3-Jahres-TCO-Logik für /rechner.
 *
 * „Total Cost of Ownership" über 36 Monate, inklusive Eigenzeit-
 * Äquivalent. Vergleicht fünf Optionen ehrlich:
 *
 *   Sitalo Business (Preis aus lib/pakete-data.ts abgeleitet)
 *   Wix (Business-Tarif ~25 €/Mo + Eigenzeit)
 *   Squarespace (~22 €/Mo + Eigenzeit)
 *   Jimdo (~15 €/Mo + Eigenzeit)
 *   ChatGPT/Cursor-Eigenbau (~20 €/Mo + viel Eigenzeit)
 *
 * Eigenzeit wird mit dem User-spezifischen Stunden-Wert multipli-
 * ziert und zu den €-Kosten addiert. Ergebnis: vergleichbare
 * Gesamtkosten in Euro.
 *
 * Bewusst: keine geheimen Multiplikatoren, keine Sitalo-Bias,
 * Eingaben sind transparent. Wenn jemand die Eigenzeit auf 0 €/h
 * setzt, gewinnt der billigste Baukasten — das gehört zum
 * ehrlichen Bild.
 */

import { getPaketBySlug } from "@/lib/pakete-data";

export type Profile = "neu" | "umzug" | "eigenbau";

export type Inputs = {
  profile: Profile;
  updatesPerMonth: number;
  hourlyValue: number;
};

export type Option = {
  slug: "sitalo" | "wix" | "squarespace" | "jimdo" | "diy";
  label: string;
  einmaligEUR: number;
  monatlichEUR: number;
  aufbauHours: number;
  pflegeHoursPerUpdate: number;
  baseDescription: string;
  highlight?: boolean;
};

/**
 * Zieht den ersten Zahlenwert aus einem Preis-String der
 * kanonischen Quelle ("ab 899 €" → 899, "ab 79 € / Monat" → 79).
 * So schlagen Preisänderungen in pakete-data.ts automatisch hier
 * durch, ohne Hand-Sync.
 */
function eurFrom(priceLabel: string): number {
  const digits = priceLabel.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const sitaloBusiness = getPaketBySlug("business");

const OPTIONS: Option[] = [
  {
    slug: "sitalo",
    label: "Sitalo Business",
    einmaligEUR: sitaloBusiness ? eurFrom(sitaloBusiness.setup) : 899,
    monatlichEUR: sitaloBusiness ? eurFrom(sitaloBusiness.monthly) : 79,
    aufbauHours: 0,
    pflegeHoursPerUpdate: 0,
    baseDescription:
      "Wir bauen, wir pflegen, Sie schicken Inhalte. Eigenzeit: nur Ihre Inhalte zusammensuchen.",
    highlight: true,
  },
  {
    slug: "wix",
    label: "Wix",
    einmaligEUR: 0,
    monatlichEUR: 25,
    aufbauHours: 35,
    pflegeHoursPerUpdate: 0.75,
    baseDescription:
      "Baukasten, selbst gebaut. Aufbau realistisch 35 h, Pflege ~45 Min pro Update.",
  },
  {
    slug: "squarespace",
    label: "Squarespace",
    einmaligEUR: 0,
    monatlichEUR: 22,
    aufbauHours: 28,
    pflegeHoursPerUpdate: 0.5,
    baseDescription:
      "Visueller Baukasten, schöner Look. Aufbau 28 h, Pflege schneller weil weniger Optionen.",
  },
  {
    slug: "jimdo",
    label: "Jimdo",
    einmaligEUR: 0,
    monatlichEUR: 15,
    aufbauHours: 18,
    pflegeHoursPerUpdate: 0.5,
    baseDescription:
      "Einfachster Baukasten, deutscher Anbieter. Aufbau 18 h, dafür Decke nach oben begrenzt.",
  },
  {
    slug: "diy",
    label: "Selbstbau mit ChatGPT/Cursor",
    einmaligEUR: 0,
    monatlichEUR: 20,
    aufbauHours: 60,
    pflegeHoursPerUpdate: 1.5,
    baseDescription:
      "Tools-Subscriptions + Domain + Hosting. Aufbau 60 h Lernkurve, Pflege 1,5 h/Update inkl. Debug.",
  },
];

export type Result = {
  slug: Option["slug"];
  label: string;
  highlight: boolean;
  description: string;
  /** Reine Euro-Kosten über 36 Monate. */
  euroCost: number;
  /** Stunden Eigenarbeit über 36 Monate. */
  hoursCost: number;
  /** Eigenarbeit zum hourlyValue umgerechnet. */
  hoursEur: number;
  /** Summe aus euroCost + hoursEur. */
  totalEur: number;
};

const MONTHS = 36;

/**
 * Profile-Multiplikator für Aufbau-Stunden:
 *   - neu: 1.0 × baseAufbau
 *   - umzug (von WP/alter Seite): 1.3 × baseAufbau (Import-Aufwand)
 *   - eigenbau (Selbstbau-Code): 0.7 × baseAufbau bei DIY, 1.4 × bei Baukasten
 *     (Code-Affine springen im Baukasten weniger sauber rein)
 */
function profileAufbauMultiplier(p: Profile, slug: Option["slug"]): number {
  if (p === "umzug") return 1.3;
  if (p === "eigenbau") {
    if (slug === "diy") return 0.7;
    return 1.4;
  }
  return 1.0;
}

export function calculate(inputs: Inputs): Result[] {
  return OPTIONS.map((opt) => {
    const mult = profileAufbauMultiplier(inputs.profile, opt.slug);
    const aufbau = opt.aufbauHours * mult;
    const pflege = opt.pflegeHoursPerUpdate * inputs.updatesPerMonth * MONTHS;
    const hours = aufbau + pflege;
    const euro = opt.einmaligEUR + opt.monatlichEUR * MONTHS;
    const hoursEur = hours * inputs.hourlyValue;
    return {
      slug: opt.slug,
      label: opt.label,
      highlight: opt.highlight ?? false,
      description: opt.baseDescription,
      euroCost: euro,
      hoursCost: hours,
      hoursEur,
      totalEur: euro + hoursEur,
    };
  });
}

export function findCheapest(results: Result[]): Result {
  return results.reduce((min, r) => (r.totalEur < min.totalEur ? r : min), results[0]);
}

export function findSitalo(results: Result[]): Result | undefined {
  return results.find((r) => r.slug === "sitalo");
}

export function formatEur(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatHours(n: number): string {
  if (n < 1) return "<1 h";
  return `${Math.round(n)} h`;
}

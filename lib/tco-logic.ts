/**
 * 3-Jahres-TCO-Logik für /rechner.
 *
 * „Total Cost of Ownership" über 36 Monate, inklusive Eigenzeit-
 * Äquivalent. Vergleicht fünf Optionen ehrlich:
 *
 *   Sitalo (Business, Premium oder Studio, je nachdem, was bei der
 *   eingestellten Zahl an Änderungen am günstigsten ist; Preise aus
 *   lib/pakete-data.ts, Änderungen über dem Kontingent zum Stundensatz)
 *   Wix (Business-Tarif ~25 €/Mo + Eigenzeit)
 *   Squarespace (~22 €/Mo + Eigenzeit)
 *   Jimdo (~15 €/Mo + Eigenzeit)
 *   Selbstbau mit ChatGPT (~20 €/Mo + viel Eigenzeit)
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

import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { getPaketBySlug, type Paket } from "@/lib/pakete-data";

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

const MONTHS = 36;

/**
 * Sitalo-Pakete, die der Rechner in Betracht zieht, mit den kleinen
 * Änderungen, die im Monatsbeitrag stecken (wie auf /pakete). Starter
 * fehlt bewusst: Verglichen wird eine Firmenseite mit Unterseiten.
 */
const SITALO_PAKETE: { slug: Paket["slug"]; aenderungen: number }[] = [
  { slug: "business", aenderungen: 3 },
  { slug: "premium", aenderungen: 6 },
  { slug: "studio", aenderungen: 10 },
];

/**
 * Eine kleine Änderung über dem Kontingent rechnet der Rechner mit
 * einer halben Stunde zum Stundensatz (eine kleine Änderung dauert
 * laut Paket-FAQ 15 bis 30 Minuten, gerechnet wird die obere Grenze).
 */
const STUNDEN_PRO_EXTRA_AENDERUNG = 0.5;

type SitaloWahl = {
  slug: Paket["slug"];
  label: string;
  einmaligEUR: number;
  monatlichEUR: number;
  extraProMonat: number;
};

/**
 * Erklärung unter dem Sitalo-Balken. Leer, solange Business mit seinen
 * drei Änderungen reicht; sonst steht da, warum anders gerechnet wird.
 */
function sitaloHinweis(wahl: SitaloWahl): string {
  const kontingent = SITALO_PAKETE.find((p) => p.slug === wahl.slug)?.aenderungen ?? 0;
  if (wahl.slug === "business" && wahl.extraProMonat === 0) return "";
  const vorweg =
    wahl.slug === "business"
      ? ""
      : `Bei so vielen Änderungen ist ${wahl.label} günstiger als Business mit Zusatzstunden. `;
  const rest =
    wahl.extraProMonat > 0
      ? `, jede weitere ist hier mit einer halben Stunde zum Stundensatz von ${STUNDENSATZ_EUR} € gerechnet.`
      : ".";
  return `${vorweg}${wahl.label} enthält ${kontingent} kleine Änderungen im Monat${rest}`;
}

/** Das Sitalo-Paket, das bei `updatesPerMonth` über 36 Monate am wenigsten kostet. */
function sitaloFuer(updatesPerMonth: number): SitaloWahl {
  const kandidaten = SITALO_PAKETE.map(({ slug, aenderungen }) => {
    const p = getPaketBySlug(slug);
    const extra = Math.max(0, updatesPerMonth - aenderungen);
    const name = p?.name ?? slug;
    return {
      slug,
      label: name.startsWith("Sitalo") ? name : `Sitalo ${name}`,
      einmaligEUR: p ? eurFrom(p.setup) : 0,
      monatlichEUR: p ? eurFrom(p.monthly) : 0,
      extraProMonat: extra,
    };
  });
  const kosten = (k: SitaloWahl) =>
    k.einmaligEUR + (k.monatlichEUR + k.extraProMonat * STUNDEN_PRO_EXTRA_AENDERUNG * STUNDENSATZ_EUR) * MONTHS;
  return kandidaten.reduce((min, k) => (kosten(k) < kosten(min) ? k : min), kandidaten[0]);
}

const OPTIONS: Option[] = [
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
    label: "Selbstbau mit ChatGPT",
    einmaligEUR: 0,
    monatlichEUR: 20,
    aufbauHours: 60,
    pflegeHoursPerUpdate: 1.5,
    baseDescription:
      "Abos für Werkzeuge, Domain und Hosting. Aufbau etwa 60 h mit Einarbeitung, Pflege etwa 1,5 h je Änderung mit Fehlersuche.",
  },
];

export type Result = {
  slug: Option["slug"];
  /** Nur bei Sitalo: das gerechnete Paket (für den Anfrage-Link). */
  paket?: Paket["slug"];
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
  const wahl = sitaloFuer(inputs.updatesPerMonth);
  const extraEur = wahl.extraProMonat * STUNDEN_PRO_EXTRA_AENDERUNG * STUNDENSATZ_EUR;
  const sitalo: Result = {
    slug: "sitalo",
    paket: wahl.slug,
    label: wahl.label,
    highlight: true,
    description: sitaloHinweis(wahl),
    euroCost: wahl.einmaligEUR + (wahl.monatlichEUR + extraEur) * MONTHS,
    hoursCost: 0,
    hoursEur: 0,
    totalEur: wahl.einmaligEUR + (wahl.monatlichEUR + extraEur) * MONTHS,
  };
  const andere = OPTIONS.map((opt): Result => {
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
  return [sitalo, ...andere];
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
  if (n <= 0) return "0 h";
  if (n < 1) return "<1 h";
  return `${Math.round(n)} h`;
}

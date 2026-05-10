import type { TemplateRow } from "@/types/website";

export type TemplateKey =
  | "default"
  | "pflegedienst"
  | "arztpraxis"
  | "friseur"
  | "physio"
  | "zahnarzt"
  | "reinigung"
  | "schreiner"
  | "kosmetik"
  | "anwalt"
  | "restaurant";

export type TemplateMeta = {
  key: TemplateKey;
  /** Hero variant chosen for this template. */
  hero: "centered" | "split";
  /** Localized human-friendly name shown in dashboard hints. */
  label: string;
  /** Default hero subtitle when the user hasn't supplied one. */
  defaultHeroSubtitle: string;
  /** Wording for the primary contact CTA. */
  primaryCtaLabel: string;
};

const META: Record<TemplateKey, TemplateMeta> = {
  default: {
    key: "default",
    hero: "centered",
    label: "Standard",
    defaultHeroSubtitle:
      "Willkommen auf unserer Website. Wir freuen uns über Ihre Nachricht.",
    primaryCtaLabel: "Kontakt aufnehmen",
  },
  pflegedienst: {
    key: "pflegedienst",
    hero: "centered",
    label: "Pflegedienst",
    defaultHeroSubtitle:
      "Pflege mit Herz, Erfahrung und Verlässlichkeit — direkt bei Ihnen zu Hause.",
    primaryCtaLabel: "Beratung anfragen",
  },
  arztpraxis: {
    key: "arztpraxis",
    hero: "split",
    label: "Arztpraxis",
    defaultHeroSubtitle:
      "Moderne Medizin, persönliche Betreuung. Wir nehmen uns Zeit für Sie.",
    primaryCtaLabel: "Termin vereinbaren",
  },
  friseur: {
    key: "friseur",
    hero: "centered",
    label: "Friseur",
    defaultHeroSubtitle:
      "Stil, Schnitt und Präzision. Ihr Salon für besondere Momente.",
    primaryCtaLabel: "Termin buchen",
  },
  physio: {
    key: "physio",
    hero: "split",
    label: "Physiotherapie",
    defaultHeroSubtitle:
      "Bewegung, Therapie, Lebensqualität. Wir bringen Sie wieder in Form.",
    primaryCtaLabel: "Termin vereinbaren",
  },
  zahnarzt: {
    key: "zahnarzt",
    hero: "split",
    label: "Zahnarztpraxis",
    defaultHeroSubtitle:
      "Sanfte Zahnmedizin in entspannter Atmosphäre. Für ein gesundes Lächeln.",
    primaryCtaLabel: "Termin online buchen",
  },
  reinigung: {
    key: "reinigung",
    hero: "centered",
    label: "Reinigung & Gebäudeservice",
    defaultHeroSubtitle:
      "Saubere Räume, zuverlässig & gründlich. Privat, Büro, Praxis.",
    primaryCtaLabel: "Angebot anfragen",
  },
  schreiner: {
    key: "schreiner",
    hero: "centered",
    label: "Schreinerei / Tischlerei",
    defaultHeroSubtitle:
      "Maßarbeit aus Holz. Möbel, Türen, Einbauküchen — handwerklich gefertigt.",
    primaryCtaLabel: "Projekt besprechen",
  },
  kosmetik: {
    key: "kosmetik",
    hero: "centered",
    label: "Kosmetikstudio",
    defaultHeroSubtitle:
      "Hautpflege, Wellness, Wohlbefinden. Auszeit für Sie und Ihre Haut.",
    primaryCtaLabel: "Termin reservieren",
  },
  anwalt: {
    key: "anwalt",
    hero: "split",
    label: "Anwaltskanzlei",
    defaultHeroSubtitle:
      "Erfahrene Rechtsberatung in einem persönlichen, vertraulichen Rahmen.",
    primaryCtaLabel: "Erstgespräch vereinbaren",
  },
  restaurant: {
    key: "restaurant",
    hero: "centered",
    label: "Restaurant / Café",
    defaultHeroSubtitle:
      "Frische Küche, herzlicher Service. Wir freuen uns auf Ihren Besuch.",
    primaryCtaLabel: "Tisch reservieren",
  },
};

const INDUSTRY_TO_KEY: Record<string, TemplateKey> = {
  pflegedienst: "pflegedienst",
  arztpraxis: "arztpraxis",
  friseur: "friseur",
  physio: "physio",
  physiotherapie: "physio",
  zahnarzt: "zahnarzt",
  zahnarztpraxis: "zahnarzt",
  reinigung: "reinigung",
  reinigungsservice: "reinigung",
  schreiner: "schreiner",
  schreinerei: "schreiner",
  tischler: "schreiner",
  tischlerei: "schreiner",
  kosmetik: "kosmetik",
  kosmetikstudio: "kosmetik",
  anwalt: "anwalt",
  anwaltskanzlei: "anwalt",
  rechtsanwalt: "anwalt",
  kanzlei: "anwalt",
  restaurant: "restaurant",
  cafe: "restaurant",
  café: "restaurant",
  bistro: "restaurant",
  gastronomie: "restaurant",
};

/**
 * Resolves a template row (from DB) to its visual key. Falls back to "default"
 * when no template is assigned or the industry slug is unknown.
 */
export function resolveTemplateKey(
  template: TemplateRow | null | undefined,
): TemplateKey {
  const industry = template?.industry?.toLowerCase().trim() ?? "";
  return INDUSTRY_TO_KEY[industry] ?? "default";
}

export function getTemplateMeta(key: TemplateKey): TemplateMeta {
  return META[key];
}

/** All non-default templates, in display order — used by the admin/onboarding picker. */
export const ALL_TEMPLATE_KEYS: TemplateKey[] = [
  "pflegedienst",
  "arztpraxis",
  "zahnarzt",
  "physio",
  "friseur",
  "kosmetik",
  "anwalt",
  "restaurant",
  "reinigung",
  "schreiner",
];

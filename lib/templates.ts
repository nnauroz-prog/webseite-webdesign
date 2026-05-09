import type { TemplateRow } from "@/types/website";

export type TemplateKey = "default" | "pflegedienst" | "arztpraxis" | "friseur";

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
};

/**
 * Resolves a template row (from DB) to its visual key. Falls back to "default"
 * when no template is assigned or the industry slug is unknown.
 */
export function resolveTemplateKey(
  template: TemplateRow | null | undefined,
): TemplateKey {
  const industry = template?.industry?.toLowerCase().trim() ?? "";
  if (industry === "pflegedienst") return "pflegedienst";
  if (industry === "arztpraxis") return "arztpraxis";
  if (industry === "friseur") return "friseur";
  return "default";
}

export function getTemplateMeta(key: TemplateKey): TemplateMeta {
  return META[key];
}

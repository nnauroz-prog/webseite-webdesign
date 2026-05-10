import type { TemplateRow } from "@/types/website";

/**
 * Template keys are still industry-shaped for backward compatibility
 * with the DB seed (`templates.industry`) and the demo-content map.
 * The customer-visible *name* of each template is now editorial
 * (Sonnen / Klar / Noir / …) — see `label` below.
 */
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

/**
 * The 5 design personalities. Each one drives:
 *   - Hero composition + image treatment
 *   - Typography (font-family hint, heading weight, tracking)
 *   - Card chrome (radius, shadow weight)
 *   - Section density (vertical spacing between sections)
 *
 * The actual visuals are configured in globals.css under
 * `[data-personality="..."]` selectors. Components read the resulting
 * CSS variables instead of hard-coding values, so the same component
 * tree renders meaningfully different per personality.
 */
export type Personality =
  | "soft" // warm, organic, generous whitespace, rounded sans
  | "clinical" // modern-clean, sharp grid, geometric sans, dense
  | "editorial" // luxury-magazine, serif headlines, asymmetric image
  | "crafted" // hand-made warmth, mixed serif/sans, textured
  | "formal"; // classical professional, structured serif, conservative

/** Hero layout variants. */
export type HeroVariant = "centered" | "split" | "fullbleed";

export type TemplateMeta = {
  key: TemplateKey;
  /** Editorial display name shown to customers. */
  label: string;
  /** Industry kept for back-compat with onboarding wizard + demo map. */
  industry: string;
  /** Design personality — drives typography, chrome, density. */
  personality: Personality;
  /** Hero composition. */
  hero: HeroVariant;
  /** One-line summary of the design's vibe (for picker cards). */
  vibe: string;
  /** Default hero subtitle when the user hasn't supplied one. */
  defaultHeroSubtitle: string;
  /** Wording for the primary contact CTA. */
  primaryCtaLabel: string;
};

const META: Record<TemplateKey, TemplateMeta> = {
  default: {
    key: "default",
    label: "Linear",
    industry: "default",
    personality: "clinical",
    hero: "centered",
    vibe: "Klar, neutral, ohne Branchen-Anstrich.",
    defaultHeroSubtitle:
      "Willkommen auf unserer Website. Wir freuen uns über Ihre Nachricht.",
    primaryCtaLabel: "Kontakt aufnehmen",
  },
  pflegedienst: {
    key: "pflegedienst",
    label: "Sonnen",
    industry: "pflegedienst",
    personality: "soft",
    hero: "centered",
    vibe: "Warm und nahbar — viel Weißraum, weiche Rundungen, freundliche Sans-Serif.",
    defaultHeroSubtitle:
      "Pflege mit Herz, Erfahrung und Verlässlichkeit — direkt bei Ihnen zu Hause.",
    primaryCtaLabel: "Beratung anfragen",
  },
  arztpraxis: {
    key: "arztpraxis",
    label: "Klar",
    industry: "arztpraxis",
    personality: "clinical",
    hero: "split",
    vibe: "Modern-klinisch — geometrische Sans, klare Trennlinien, dichte Info-Sidebar.",
    defaultHeroSubtitle:
      "Moderne Medizin, persönliche Betreuung. Wir nehmen uns Zeit für Sie.",
    primaryCtaLabel: "Termin vereinbaren",
  },
  friseur: {
    key: "friseur",
    label: "Noir",
    industry: "friseur",
    personality: "editorial",
    hero: "fullbleed",
    vibe: "Editorial-luxuriös — formatfüllendes Foto, Serif-Headline, Magazin-Typografie.",
    defaultHeroSubtitle:
      "Stil, Schnitt und Präzision. Ihr Salon für besondere Momente.",
    primaryCtaLabel: "Termin buchen",
  },
  physio: {
    key: "physio",
    label: "Vital",
    industry: "physio",
    personality: "clinical",
    hero: "split",
    vibe: "Energetisch-modern — kräftige Sans, klare Grids, motivational.",
    defaultHeroSubtitle:
      "Bewegung, Therapie, Lebensqualität. Wir bringen Sie wieder in Form.",
    primaryCtaLabel: "Termin vereinbaren",
  },
  zahnarzt: {
    key: "zahnarzt",
    label: "Lumen",
    industry: "zahnarzt",
    personality: "soft",
    hero: "split",
    vibe: "Hell und beruhigend — leichte Sans, viel Luft, soft-getönte Cards.",
    defaultHeroSubtitle:
      "Sanfte Zahnmedizin in entspannter Atmosphäre. Für ein gesundes Lächeln.",
    primaryCtaLabel: "Termin online buchen",
  },
  reinigung: {
    key: "reinigung",
    label: "Brisa",
    industry: "reinigung",
    personality: "soft",
    hero: "centered",
    vibe: "Frisch und freundlich — runde Cards, helle Akzente, knappe Headlines.",
    defaultHeroSubtitle:
      "Saubere Räume, zuverlässig & gründlich. Privat, Büro, Praxis.",
    primaryCtaLabel: "Angebot anfragen",
  },
  schreiner: {
    key: "schreiner",
    label: "Werkstatt",
    industry: "schreiner",
    personality: "crafted",
    hero: "centered",
    vibe: "Handwerklich-warm — gemischte Type, Erd-Töne, leichte Textur.",
    defaultHeroSubtitle:
      "Maßarbeit aus Holz. Möbel, Türen, Einbauküchen — handwerklich gefertigt.",
    primaryCtaLabel: "Projekt besprechen",
  },
  kosmetik: {
    key: "kosmetik",
    label: "Pearl",
    industry: "kosmetik",
    personality: "editorial",
    hero: "fullbleed",
    vibe: "Editorial-feminin — feine Serif, Hochformat-Imagery, getragen.",
    defaultHeroSubtitle:
      "Hautpflege, Wellness, Wohlbefinden. Auszeit für Sie und Ihre Haut.",
    primaryCtaLabel: "Termin reservieren",
  },
  anwalt: {
    key: "anwalt",
    label: "Oxford",
    industry: "anwalt",
    personality: "formal",
    hero: "split",
    vibe: "Klassisch-formal — strukturierter Serif, dichte Info-Sidebar, dunkle Akzente.",
    defaultHeroSubtitle:
      "Erfahrene Rechtsberatung in einem persönlichen, vertraulichen Rahmen.",
    primaryCtaLabel: "Erstgespräch vereinbaren",
  },
  restaurant: {
    key: "restaurant",
    label: "Tisch",
    industry: "restaurant",
    personality: "crafted",
    hero: "fullbleed",
    vibe: "Warm-rustikal — formatfüllende Atmosphäre-Bilder, gemischte Type, einladend.",
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

/** All non-default templates, in display order — used by the picker. */
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

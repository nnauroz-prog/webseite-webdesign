/**
 * Project-type signals — what *kind* of website is needed. Stays
 * intentionally short. Optional add-ons live in
 * `INQUIRY_SPECIAL_FEATURES` below.
 */
export const INQUIRY_NEEDS = [
  "neue-website",
  "redesign",
  "onepager",
  "mehrseitig",
  "verwaltbare-inhalte",
  "speisekarte",
  "bewerbungsformular",
  "kontaktformular",
] as const;
export type InquiryNeed = (typeof INQUIRY_NEEDS)[number];

/**
 * Pricing tiers as published on the landing / pricing page. The
 * `unsicher` sentinel triggers a "we'll recommend the right tier"
 * helper note in the form.
 */
export const INQUIRY_PACKAGES = [
  "starter",
  "business",
  "premium",
  "unsicher",
] as const;
export type InquiryPackage = (typeof INQUIRY_PACKAGES)[number];

/**
 * Optional functional add-ons asked about after the package pick. Some
 * (Verwaltbare Inhalte, Speisekarte, Bewerbungsformular) overlap with
 * the `INQUIRY_NEEDS` list because customers often want to emphasise
 * an extra at scoping time.
 */
export const INQUIRY_SPECIAL_FEATURES = [
  "verwaltbare-inhalte",
  "speisekarte",
  "bewerbungsformular",
  "google-maps",
  "online-reservierung",
  "mehrere-unterseiten",
  "seo-erweiterung",
  "mehrsprachigkeit",
  "unsicher",
] as const;
export type InquirySpecialFeature = (typeof INQUIRY_SPECIAL_FEATURES)[number];

export const INQUIRY_TIMEFRAMES = [
  "asap",
  "2-wochen",
  "1-monat",
  "spaeter",
  "offen",
] as const;


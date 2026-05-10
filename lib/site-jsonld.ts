import { resolveTemplateKey } from "@/lib/templates";
import type {
  ServiceRow,
  TeamMemberRow,
  TemplateRow,
  WebsiteRow,
} from "@/types/website";

/**
 * Build a schema.org JSON-LD block for a public website.
 *
 * Uses a more specific @type when the industry maps to one we know
 * Google indexes well (MedicalBusiness, Dentist, …) and falls back to
 * LocalBusiness otherwise. The heavy work is just shaping our row data
 * into schema.org property names — the structured data is invisible to
 * users but materially affects Google ranking and the way the site is
 * shown in SERP cards.
 */
export function buildLocalBusinessJsonLd({
  website,
  services,
  team,
  template,
  url,
}: {
  website: WebsiteRow;
  services: ServiceRow[];
  team: TeamMemberRow[];
  template: TemplateRow | null;
  url: string;
}): Record<string, unknown> {
  const key = resolveTemplateKey(template);
  const type = SCHEMA_TYPE[key] ?? "LocalBusiness";

  const description =
    website.seo_description?.trim() ||
    website.hero_subtitle?.trim() ||
    truncate(website.about_text, 250) ||
    undefined;

  const telephone = website.phone?.trim() || undefined;
  const email = website.email?.trim() || undefined;
  const image = website.logo_url || undefined;

  const address = parseAddress(website.address);

  const offers =
    services.length > 0
      ? services.map((s) => ({
          "@type": "Offer",
          name: s.title,
          description: s.description ?? undefined,
        }))
      : undefined;

  const employees =
    team.length > 0
      ? team.map((m) => ({
          "@type": "Person",
          name: m.name,
          jobTitle: m.role ?? undefined,
        }))
      : undefined;

  const openingHours =
    website.opening_hours?.text?.trim() || undefined;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": url,
    name: website.business_name,
    url,
    description,
    telephone,
    email,
    image,
    address,
    makesOffer: offers,
    employee: employees,
    openingHours,
    inLanguage: "de-DE",
  };

  // Strip undefined entries so the rendered JSON-LD stays compact.
  for (const k of Object.keys(data)) {
    if (data[k] === undefined) delete data[k];
  }
  return data;
}

const SCHEMA_TYPE: Partial<
  Record<ReturnType<typeof resolveTemplateKey>, string>
> = {
  arztpraxis: "MedicalBusiness",
  zahnarzt: "Dentist",
  physio: "Physiotherapy",
  pflegedienst: "MedicalBusiness",
  friseur: "HairSalon",
  kosmetik: "BeautySalon",
  reinigung: "ProfessionalService",
  schreiner: "ProfessionalService",
  anwalt: "LegalService",
  restaurant: "Restaurant",
};

function parseAddress(raw: string | null): unknown {
  const cleaned = raw?.trim();
  if (!cleaned) return undefined;
  // Try to split "Straße 12\n12345 Berlin" into structured fields.
  const lines = cleaned
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return { "@type": "PostalAddress", streetAddress: cleaned };
  }
  const street = lines[0];
  const cityLine = lines.slice(1).join(", ");
  // Try "PLZ Ort" — postcode-then-city is standard in DE.
  const m = cityLine.match(/^(\d{4,5})\s+(.+)$/);
  if (m) {
    return {
      "@type": "PostalAddress",
      streetAddress: street,
      postalCode: m[1],
      addressLocality: m[2],
      addressCountry: "DE",
    };
  }
  return {
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: cityLine,
    addressCountry: "DE",
  };
}

function truncate(value: string | null | undefined, max: number): string {
  const s = value?.trim();
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

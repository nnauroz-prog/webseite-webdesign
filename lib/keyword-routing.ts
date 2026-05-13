/**
 * Mappt freie Eingaben aus dem Hero-Prompt auf Branchen-Slugs.
 * Beide Slug-Welten:
 *  - "branche" = wie auf /branchen/[slug] (z. B. "pflege")
 *  - "industry" = wie im Wizard erwartet (z. B. "pflegedienst")
 *
 * Aufruf: matchKeyword("Pflegedienst-Website mit Bewerbungsformular")
 *  → { branche: "pflege", industry: "pflegedienst", label: "Pflegedienste" }
 *
 * Findet keinen Treffer? Gibt null zurück, dann fällt der Caller auf
 * den freien Text zurück.
 */

export type KeywordMatch = {
  branche: string;
  industry: string;
  label: string;
};

const MAP: Array<{
  keywords: string[];
  branche: string;
  industry: string;
  label: string;
}> = [
  {
    keywords: ["pflege", "pflegedienst", "ambulant", "altenpflege"],
    branche: "pflege",
    industry: "pflegedienst",
    label: "Pflegedienste",
  },
  {
    keywords: [
      "arzt",
      "praxis",
      "arztpraxis",
      "zahnarzt",
      "zahnarztpraxis",
      "medizin",
    ],
    branche: "praxis",
    industry: "arztpraxis",
    label: "Arzt- / Zahnarztpraxen",
  },
  {
    keywords: ["friseur", "salon", "barber", "haircut", "haare"],
    branche: "friseur",
    industry: "friseur",
    label: "Friseure & Kosmetik",
  },
  {
    keywords: ["kosmetik", "beauty", "kosmetikstudio", "nagel", "nails"],
    branche: "friseur",
    industry: "kosmetik",
    label: "Kosmetikstudios",
  },
  {
    keywords: [
      "café",
      "cafe",
      "restaurant",
      "gastro",
      "gastronomie",
      "bistro",
      "imbiss",
      "küche",
    ],
    branche: "gastro",
    industry: "cafe",
    label: "Cafés & Restaurants",
  },
  {
    keywords: [
      "handwerk",
      "handwerker",
      "tischler",
      "schreiner",
      "maler",
      "klempner",
      "dachdecker",
      "elektriker",
      "installateur",
    ],
    branche: "handwerker",
    industry: "handwerker",
    label: "Handwerker",
  },
  {
    keywords: ["reinigung", "putz", "gebäudereinigung", "büroreinigung"],
    branche: "reinigung",
    industry: "reinigung",
    label: "Reinigungsfirmen",
  },
  {
    keywords: ["kanzlei", "anwalt", "rechtsanwalt", "steuerberater", "notar"],
    branche: "kanzlei",
    industry: "kanzlei",
    label: "Kanzleien",
  },
  {
    keywords: [
      "fitness",
      "studio",
      "fitnessstudio",
      "gym",
      "personal training",
      "trainer",
      "yoga",
    ],
    branche: "fitness",
    industry: "fitness",
    label: "Fitnessstudios",
  },
];

export function matchKeyword(input: string): KeywordMatch | null {
  if (!input) return null;
  const text = input.toLowerCase().trim();
  if (text.length < 3) return null;
  for (const entry of MAP) {
    if (entry.keywords.some((k) => text.includes(k))) {
      return {
        branche: entry.branche,
        industry: entry.industry,
        label: entry.label,
      };
    }
  }
  return null;
}

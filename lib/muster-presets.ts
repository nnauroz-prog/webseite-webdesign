/**
 * Musterseiten der Branchen (frei erfundene Betriebe): Name, Farben,
 * Überschrift, Navigation. Gemeinsame Quelle für die Live-Vorschau
 * (components/marketing/live-preview.tsx, Client) und die gezeichneten
 * Geräte-Bilder der Startseite (components/marketing/laden/bilder, Server).
 */

export type Preset = {
  key: string;
  chip: string;
  /** Slug, den das Anfrageformular kennt (inquiry-form INDUSTRY_OPTIONS). */
  inquiry: string;
  defaultName: string;
  accent: string;
  tint: string;
  image: string;
  headline: string;
  sub: string;
  nav: string[];
  cta: string;
  features: string[];
};

export const PRESETS: Preset[] = [
  {
    key: "pflege",
    chip: "Pflege",
    inquiry: "pflegedienst",
    defaultName: "Pflegedienst Elbblick",
    accent: "#2f6b5e",
    tint: "#eef5f2",
    image: "/images/atmosphere/pflege-eingang.webp",
    headline: "Ambulante Pflege in Ihrem Viertel.",
    sub: "Grund- und Behandlungspflege, Beratung zum Pflegegrad. Rückruf am selben Werktag.",
    nav: ["Leistungen", "Team", "Karriere", "Kontakt"],
    cta: "Beratung anfragen",
    features: [
      "Grund- & Behandlungspflege",
      "Pflegegrad-Beratung",
      "Jetzt bewerben",
    ],
  },
  {
    key: "praxis",
    chip: "Praxis",
    inquiry: "arztpraxis",
    defaultName: "Praxis am Stadtpark",
    accent: "#1f5f8b",
    tint: "#edf3f8",
    image: "/images/atmosphere/praxis-raum.webp",
    headline: "Hausarztpraxis, Termine nach Anfrage.",
    sub: "Sprechzeiten Mo–Fr ab 8 Uhr. Neue Patientinnen und Patienten willkommen.",
    nav: ["Praxis", "Leistungen", "Team", "Termin"],
    cta: "Termin anfragen",
    features: ["Terminanfrage", "Sprechzeiten", "Unsere Leistungen"],
  },
  {
    key: "friseur",
    chip: "Friseur",
    inquiry: "friseur",
    defaultName: "Salon Hanseschnitt",
    accent: "#6b3f5a",
    tint: "#f6eff3",
    image: "/images/atmosphere/friseur-stuhl.webp",
    headline: "Schnitt, Farbe, Pflege.",
    sub: "Dienstag bis Samstag geöffnet. Termin anfragen oder anrufen.",
    nav: ["Preise", "Team", "Galerie", "Termin"],
    cta: "Termin anfragen",
    features: ["Terminanfrage", "Preisliste", "Galerie"],
  },
  {
    key: "gastro",
    chip: "Café",
    inquiry: "cafe",
    defaultName: "Café Kajüte",
    accent: "#9a4b2c",
    tint: "#f8f0ea",
    image: "/images/atmosphere/gastro-cafe.webp",
    headline: "Frühstück bis 14 Uhr, Kuchen aus eigener Backstube.",
    sub: "Täglich ab 8 Uhr geöffnet. Tische für Gruppen bitte reservieren.",
    nav: ["Karte", "Über uns", "Events", "Reservieren"],
    cta: "Tisch reservieren",
    features: ["Speisekarte", "Öffnungszeiten", "Reservierung"],
  },
  {
    key: "handwerk",
    chip: "Handwerk",
    inquiry: "handwerker",
    defaultName: "Tischlerei Nordholz",
    accent: "#b4572a",
    tint: "#f8efe8",
    image: "/images/atmosphere/handwerker-werkbank.webp",
    headline: "Möbel und Innenausbau nach Maß.",
    sub: "Festes Angebot nach Aufmaß vor Ort. Einsatz im Umkreis von 40 km.",
    nav: ["Leistungen", "Referenzen", "Über uns", "Kontakt"],
    cta: "Rückruf anfordern",
    features: ["Innenausbau", "Referenzen", "Kostenloses Angebot"],
  },
  {
    key: "reinigung",
    chip: "Reinigung",
    inquiry: "reinigung",
    defaultName: "Glanzwerk Gebäudeservice",
    accent: "#1d7a8c",
    tint: "#ebf5f7",
    image: "/images/atmosphere/reinigung-flur.webp",
    headline: "Büros und Treppenhäuser, zu festen Zeiten.",
    sub: "Reinigung nach Plan, auch abends und am Wochenende.",
    nav: ["Leistungen", "Gebiete", "Preise", "Kontakt"],
    cta: "Angebot anfragen",
    features: ["Büroreinigung", "Einsatzgebiete", "Festpreis-Angebot"],
  },
  {
    key: "kanzlei",
    chip: "Kanzlei",
    inquiry: "kanzlei",
    defaultName: "Kanzlei Hartmann & Partner",
    accent: "#1f2f4f",
    tint: "#eef0f5",
    image: "/images/atmosphere/kanzlei-buecher.webp",
    headline: "Arbeitsrecht, Familienrecht, Mietrecht.",
    sub: "Erstberatung zum festen Preis. Termine auch per Video.",
    nav: ["Rechtsgebiete", "Anwälte", "Kosten", "Kontakt"],
    cta: "Erstberatung vereinbaren",
    features: ["Rechtsgebiete", "Erstberatung", "Ihr Team"],
  },
  {
    key: "fitness",
    chip: "Fitness",
    inquiry: "fitness",
    defaultName: "Studio Hafenkraft",
    accent: "#c4402c",
    tint: "#f9eeec",
    image: "/images/atmosphere/fitness-studio.webp",
    headline: "Training mit Betreuung, Kurse ab 7 Uhr.",
    sub: "Das Probetraining ist kostenlos und ohne Vertrag.",
    nav: ["Kurse", "Preise", "Trainer", "Probetraining"],
    cta: "Probetraining vereinbaren",
    features: ["Kursplan", "Mitgliedschaft", "Probetraining"],
  },
];

/** Zusätzliche Musterseiten nur für die Branchenseiten (ohne Chip in der
 *  Live-Vorschau der Startseite). */
export const EXTRA_PRESETS: Preset[] = [
  {
    key: "kosmetik",
    chip: "Kosmetik",
    inquiry: "kosmetik",
    defaultName: "Studio Hautnah",
    accent: "#7a4e5c",
    tint: "#f6eff1",
    image: "/images/atmosphere/friseur-stuhl.webp",
    headline: "Gesichtsbehandlung, Wimpern, Maniküre.",
    sub: "Termin anfragen, Preise stehen auf der Seite.",
    nav: ["Behandlungen", "Preise", "Gutscheine", "Termin"],
    cta: "Termin anfragen",
    features: ["Behandlungen", "Preisliste", "Gutscheine"],
  },
  {
    key: "hotel",
    chip: "Hotel",
    inquiry: "hotel",
    defaultName: "Hotel am Fleet",
    accent: "#2e5c4d",
    tint: "#eef3f1",
    image: "/images/hamburg-speicherstadt.webp",
    headline: "Zwölf Zimmer, fünf Minuten zur Speicherstadt.",
    sub: "Direkt bei uns buchen, Frühstück inklusive.",
    nav: ["Zimmer", "Lage", "Frühstück", "Buchen"],
    cta: "Zimmer anfragen",
    features: ["Zimmer und Preise", "Anreise", "Direkt buchen"],
  },
];

/** Branchen-Slug (lib/branchen-data.ts) → Musterseite. */
export const BRANCHE_PRESET: Record<string, string> = {
  pflege: "pflege",
  praxis: "praxis",
  friseur: "friseur",
  gastro: "gastro",
  handwerker: "handwerk",
  reinigung: "reinigung",
  kanzlei: "kanzlei",
  fitness: "fitness",
  kosmetik: "kosmetik",
  hotel: "hotel",
};

/** Alle Musterseiten (Live-Vorschau plus Branchenseiten). */
export const ALLE_PRESETS: Preset[] = [...PRESETS, ...EXTRA_PRESETS];

export function presetFuer(key: string): Preset {
  return ALLE_PRESETS.find((p) => p.key === key) ?? PRESETS[0];
}

/** Musterseite → Branchen-Slug (/branchen/[slug]), Umkehrung von BRANCHE_PRESET. */
export function brancheFuerPreset(key: string): string | undefined {
  return Object.entries(BRANCHE_PRESET).find(([, v]) => v === key)?.[0];
}

/**
 * Suchbegriffe je Branche: welche Seite welchen Begriff führt, damit sich
 * Branchenseite, Landingpage und Geldseite keine Konkurrenz machen.
 *
 * - Wo es eine eigene Landingpage gibt (/pflege, /praxen), führt DIESE den
 *   Begriff „… erstellen lassen". Die Branchenseite heißt dann „Seitenplan
 *   und Muster". Links mit „erstellen lassen" im Ankertext zeigen auf die
 *   Landingpage, Links auf die Branchenseite tragen „Seitenplan".
 * - `seoLabel` kürzt lange Branchennamen, die im Title sonst über 60
 *   Zeichen kämen.
 * - `description` ersetzt die aus shortBody gebaute Beschreibung. Nur
 *   Inhalte nennen, die auf der Seite stehen.
 *
 * Genutzt von app/branchen/[slug]/page.tsx, app/website-erstellen-lassen,
 * app/branchen/page.tsx und der Fußzeile.
 */

export type BrancheSeo = {
  title?: string;
  seoLabel?: string;
  description?: string;
  /** Eigene Landingpage, die „… erstellen lassen" führt. */
  landing?: { href: string; label: string };
};

export const BRANCHEN_SEO: Partial<Record<string, BrancheSeo>> = {
  pflege: {
    title: "Website für Pflegedienste: Seitenplan und Muster",
    landing: {
      href: "/pflege",
      label: "Website für Pflegedienste erstellen lassen",
    },
  },
  praxis: {
    title: "Praxis-Website: Seitenplan und Musterseite",
    landing: { href: "/praxen", label: "Praxis-Website erstellen lassen" },
  },
  kosmetik: {
    seoLabel: "Kosmetikstudios",
    description:
      "Website für Kosmetikstudios: Behandlungen mit Preisen, Terminanfrage und Fotos aus dem Studio, gut lesbar am Handy. Festpreis ab 599 €. Jetzt anfragen.",
  },
  reinigung: {
    description:
      "Website für Reinigungsfirmen: Pakete nebeneinander, Anfrage mit Objektart, Fläche und Turnus, Versicherung und Schlüssel erklärt. Festpreis ab 599 €.",
  },
  handwerker: {
    description:
      "Handwerker-Website erstellen lassen: Referenzen, Einsatzgebiet, Rückrufbitte und Notdienstnummer. Festpreis ab 599 €, Test-Link vor dem Start.",
  },
  friseur: {
    description:
      "Website für Friseure und Barbiere: Galerie, Preisliste und Terminanfrage, am Handy gut lesbar. Festpreis ab 599 €, Test-Link vor dem Start. Jetzt anfragen.",
  },
  gastro: {
    description:
      "Website für Cafés und Restaurants: Speisekarte, Öffnungszeiten und Anfahrt, schnell änderbar. Festpreis ab 599 €, Test-Link vor dem Start. Jetzt anfragen.",
  },
  kanzlei: {
    description:
      "Website für Kanzleien: Rechtsgebiete klar benannt, sachlich gestaltet, mit Hinweis zur Erstberatung. Festpreis ab 599 €. Jetzt unverbindlich anfragen.",
  },
  fitness: {
    description:
      "Website für Fitnessstudios: Kurse, Preise und Probetraining-Anfrage, gebaut fürs Handy. Festpreis ab 599 €, Test-Link vor dem Start. Jetzt anfragen.",
  },
  hotel: {
    description:
      "Website für Hotels und Pensionen: Zimmer, Lage und Anfrage direkt beim Haus, gut lesbar am Handy. Festpreis ab 599 €. Jetzt anfragen.",
  },
};

/**
 * Ziel für einen Link „Website für {Branche} erstellen lassen": die
 * Landingpage, wenn es eine gibt, sonst die Branchenseite.
 */
export function erstellenLassenZiel(
  slug: string,
  label: string,
): { href: string; label: string } {
  const landing = BRANCHEN_SEO[slug]?.landing;
  return (
    landing ?? {
      href: `/branchen/${slug}`,
      label: `Website für ${label} erstellen lassen`,
    }
  );
}

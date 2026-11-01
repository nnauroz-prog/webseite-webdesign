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
      "Website für Kosmetikstudios: Behandlungen mit Preisen, Terminanfrage und Fotos aus dem Studio, gut lesbar am Handy. Festpreis ab 499 €, gebaut in Hamburg.",
  },
  reinigung: {
    description:
      "Website für Reinigungsfirmen: Pakete nebeneinander, Anfrage mit Objektart, Fläche und Turnus, Versicherung und Schlüssel erklärt. Festpreis ab 499 €.",
  },
  handwerker: {
    description:
      "Handwerker-Website erstellen lassen: Referenzen, Einsatzgebiet, Rückrufbitte und Notdienstnummer. Festpreis ab 499 €, Test-Link vor dem Start.",
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

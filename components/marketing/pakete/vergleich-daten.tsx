import { Check } from "lucide-react";

import type { Paket } from "@/lib/pakete-data";

/**
 * Daten und Zellen des Paketvergleichs (/pakete), gemeinsam für die
 * Tabelle ab 834 px (Server) und den mobilen Vergleich mit zwei
 * Auswahlen (vergleich-mobil.tsx, Client). Keine Server-Importe, damit
 * beide Seiten diese Datei nutzen können.
 *
 * art:
 * - "text":   Wert als Text (14 px).
 * - "haken":  binär – Häkchen (Wert vorhanden) oder Strich („–“).
 * - "hakenText": Häkchen mit dem vorhandenen Text klein darunter.
 * - "zahl":   „Bis zu 3“ → große 3 mit Unterzeile „bis zu 3 im Monat“.
 */
export type Slug = Paket["slug"];

export type VergleichZeile = {
  label: string;
  art: "text" | "haken" | "hakenText" | "zahl" | "preis";
  werte: Record<Slug, string>;
};

export type VergleichGruppe = { titel: string; zeilen: VergleichZeile[] };

export type PaketSpalte = {
  slug: Slug;
  name: string;
  setup: string;
  monthly: string;
  highlight: boolean;
};

export const STRICH = "–";

export function VergleichZelle({ zeile, slug }: { zeile: VergleichZeile; slug: Slug }) {
  const wert = zeile.werte[slug];
  if (zeile.art === "preis") {
    return <span className="vergleich-preis">{wert}</span>;
  }
  if (wert === STRICH) {
    return (
      <>
        <span aria-hidden="true" className="vergleich-strich text-[17px]">
          —
        </span>
        <span className="sr-only">Nicht enthalten</span>
      </>
    );
  }
  if (zeile.art === "haken" || zeile.art === "hakenText") {
    return (
      <>
        <Check aria-hidden="true" className="vergleich-haken h-5 w-5" strokeWidth={2.25} />
        {zeile.art === "haken" ? (
          <span className="sr-only">{wert}</span>
        ) : (
          <span className="vergleich-unterzeile">{wert}</span>
        )}
      </>
    );
  }
  if (zeile.art === "zahl") {
    const zahl = wert.replace(/\D+/g, "");
    return (
      <>
        <span aria-hidden="true" className="vergleich-zahl">
          {zahl}
        </span>
        <span className="vergleich-unterzeile">bis zu {zahl} im Monat</span>
      </>
    );
  }
  return <>{wert}</>;
}

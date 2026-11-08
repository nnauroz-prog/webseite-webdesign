import { Brotkrumen } from "@/components/marketing/laden/unterseite";

/**
 * Brotkrumen-Zeile oben auf Unterseiten ohne eigenen Seitenkopf:
 * „Start › Journal“ in Mono auf der Satzkante, mit Haarlinie darunter.
 * section darf Zwischenstufen mit „ › “ enthalten (z. B.
 * „Standorte › Altona“); nur die letzte Stufe gilt als aktuelle Seite.
 */
export function EditorialMasthead({ section, links }: { section: string; links?: Record<string, string> }) {
  const teile = section.split(" › ");
  return (
    <div className="border-border border-b">
      <div className="inhalt py-3">
        <Brotkrumen krumen={teile.map((label) => ({ label, href: links?.[label] }))} />
      </div>
    </div>
  );
}

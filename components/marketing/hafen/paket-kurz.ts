import { PAKETE, type Paket } from "@/lib/pakete-data";

/**
 * Die wenigen Paketangaben, die Ladeliste und Abfahrtstafel im Browser
 * brauchen. Auf dem Server aufgelöst (app/page.tsx) und als Prop
 * übergeben; so landet lib/pakete-data.ts mit allen Paketdetails nicht im
 * Client-Bundle. Client-Komponenten importieren hieraus nur den Typ.
 */
export type PaketKurz = { slug: Paket["slug"]; name: string; setup: string; monthly: string };
export type PaketeKurz = Record<Paket["slug"], PaketKurz>;

export function paketeKurz(): PaketeKurz {
  const out = {} as PaketeKurz;
  for (const p of PAKETE) out[p.slug] = { slug: p.slug, name: p.name, setup: p.setup, monthly: p.monthly };
  return out;
}

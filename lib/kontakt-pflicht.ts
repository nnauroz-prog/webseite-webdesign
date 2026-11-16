/**
 * Pflichtangabe Telefon in den Formularen der Website (Anfrage,
 * Durchsicht, Termin). Die Website verspricht „wir melden uns“ und legt
 * sich auf keinen Weg fest; damit das in jedem Fall geht, braucht jede
 * Anfrage eine Nummer, unter der man jemanden erreicht.
 *
 * Die Regel ist dieselbe wie beim Anrufen-Knopf im Admin
 * (lib/admin/links.ts): Was dort einen Link ergibt, gilt hier als
 * Nummer. Browser und Server prüfen mit derselben Funktion.
 */
import { telHref } from "@/lib/admin/links";

/** Unter diesem Namen steht die Nummer in den Feldern einer Anfrage; der Admin liest sie genau so. */
export const TELEFON_LABEL = "Telefon";

/** Ist das eine Nummer, die sich anrufen lässt (6 bis 17 Ziffern)? */
export function telefonGueltig(wert: string | undefined): boolean {
  return telHref(wert?.trim()) !== null;
}

/** Die Telefonnummer aus den Feldern einer Anfrage, oder null, wenn sie fehlt oder unbrauchbar ist. */
export function telefonAus(
  fields: readonly (readonly [string, string])[],
): string | null {
  const feld = fields.find(([label]) => label === TELEFON_LABEL);
  return feld && telefonGueltig(feld[1]) ? feld[1].trim() : null;
}

/**
 * Kurze Texte für Angebote im Admin (Karte, Editor). Rein, damit
 * Server und Client dieselben Zeilen erzeugen.
 */

import type { AngebotStatus, AngebotSummen } from "@/lib/admin/angebote";

import { formatEuro } from "@/lib/admin/angebote";

/** „899,00 € einmalig · 79,00 € monatlich“ (netto), sonst „Noch ohne Betrag“. */
export function betragZeile(s: AngebotSummen): string {
  const teile: string[] = [];
  if (s.einmalig.netto > 0)
    teile.push(`${formatEuro(s.einmalig.netto)} einmalig`);
  if (s.monatlich.netto > 0)
    teile.push(`${formatEuro(s.monatlich.netto)} monatlich`);
  return teile.length ? teile.join(" · ") : "Noch ohne Betrag";
}

/** „netto, zzgl. 19 % USt“ bzw. „ohne USt (§ 19 UStG)“. */
export function steuerZeile(satz: 0 | 19): string {
  return satz === 0 ? "ohne USt (§ 19 UStG)" : "netto, zzgl. 19 % USt";
}

/** Farbe der Status-Marke; „abgelaufen“ gilt für gesendete nach Gültig bis. */
export const ANGEBOT_PILL: Record<AngebotStatus | "abgelaufen", string> = {
  entwurf: "border border-dashed border-foreground/35 text-foreground",
  gesendet: "bg-gold/20 text-foreground",
  abgelaufen: "border border-gold text-foreground",
  angenommen: "bg-ink-petrol/15 text-ink-petrol",
  abgelehnt: "bg-ink-olive/10 text-ink-olive",
  zurueckgezogen: "bg-muted text-muted-foreground",
};

/** Pfad der Kundenansicht (öffentliche Seite) für „Vorschau“. */
export function vorschauPfad(token: string): string {
  return `/angebot/${token}`;
}

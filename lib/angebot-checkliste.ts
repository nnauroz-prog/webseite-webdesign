import { PAKETE, getPaketBySlug, type Paket } from "@/lib/pakete-data";

/**
 * „Sechs Fragen an jedes Angebot": steht als Checkliste auf
 * /website-kosten#checkliste und ist auf /website-erstellen-lassen für
 * Sitalo selbst beantwortet. Eine Quelle, damit Frage und Antwort nicht
 * auseinanderlaufen. Preise, Dauer und Pakete aus lib/pakete-data.ts.
 */

const STARTER = getPaketBySlug("starter") as Paket;
const STUDIO = getPaketBySlug("studio") as Paket;
const BUSINESS = getPaketBySlug("business") as Paket;

/** „ab 49 € / Monat" → „ab 49 €" */
const monatlich = (p: Paket) => p.monthly.replace(/\s*\/\s*Monat$/, "");

/** Pakete mit bevorzugter Bearbeitung (steht in pakete-data bei Premium und Studio). */
const BEVORZUGT = PAKETE.filter((p) =>
  [...p.contents, ...p.afterLaunch].some((s) => /bevorzugt|Vorrang/i.test(s)),
).map((p) => p.name.replace(/^Sitalo\s+/, ""));

export const ANGEBOT_CHECKLISTE: { frage: string; sitalo: string }[] = [
  {
    frage: "Ist der Preis ein Festpreis oder eine Schätzung?",
    sitalo:
      "Ein Festpreis. Sie bekommen ihn schriftlich, bevor wir anfangen; kommt etwas dazu, sprechen wir vorher darüber.",
  },
  {
    frage:
      "Wer liefert die Rechtstexte, und sind Texte und Bildbearbeitung enthalten?",
    sitalo: `Die Texte schreiben wir aus Ihren Stichpunkten, die Fotos bereiten wir ab ${BUSINESS.name} auf. Die Rechtstexte beziehen Sie selbst; wir legen die Seiten an und nennen Ihnen alle Dienste, die auf Ihrer Seite laufen.`,
  },
  {
    frage: "Wem gehören Domain und Inhalte, wenn Sie wechseln möchten?",
    sitalo:
      "Ihnen. Die Domain läuft auf Ihren Namen, Inhalte und Quellcode übergeben wir bei einem Wechsel.",
  },
  {
    frage: "Was kosten Hosting, Updates und kleine Änderungen im Monat?",
    sitalo: `Je nach Paket ${monatlich(STARTER)} (${STARTER.name}) bis ${monatlich(STUDIO)} (${STUDIO.name.replace(/^Sitalo\s+/, "")}) im Monat, zzgl. USt., mit sechs Monaten Mindestlaufzeit und danach monatlich kündbar.`,
  },
  {
    frage:
      "Wie schnell bekommen Sie eine Antwort, wenn etwas nicht funktioniert?",
    sitalo: `Meist am selben Werktag, bei ${BEVORZUGT.join(" und ")} bevorzugt, meist noch am selben Tag.`,
  },
  {
    frage: "Wird die Seite für Handy und Google eingerichtet?",
    sitalo: `Fürs Handy in jedem Paket. Titel, Beschreibungen und Sitemap für Google richten wir ab ${BUSINESS.name} ein.`,
  },
];

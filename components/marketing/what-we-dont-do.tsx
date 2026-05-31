import { X } from "lucide-react";

/**
 * „Was wir NICHT machen" — Anti-Versprechen-Sektion.
 *
 * Trust-Move statt Sales-Pitch. Die ehrliche Liste der Dinge,
 * die wir bewusst auslassen, baut mehr Vertrauen auf als eine
 * weitere „Wir können alles"-Aufzählung.
 *
 * Sehr hanseatisch. Sehr untypisch für Done-for-You-Sites.
 * Das ist der Punkt.
 */

const ITEMS: { label: string; detail: string }[] = [
  {
    label: "Keine Logo-Designs",
    detail:
      "Das macht ein guter Designer besser. Wir empfehlen jemanden aus unserem Netzwerk, wenn Sie noch keins haben.",
  },
  {
    label: "Kein Social-Media-Marketing",
    detail:
      "Instagram, TikTok, Reels — nicht unser Spielfeld. Wir bauen die Seite, auf die Ihre Posts verlinken.",
  },
  {
    label: "Keine 1000-Produkt-Onlineshops",
    detail:
      "Kleine Shops bis ~30 Produkte machen wir gerne. Größer: nehmen Sie Shopify mit jemandem, der das täglich macht.",
  },
  {
    label: "Keine SEO-Garantien",
    detail:
      "Niemand kann seriös einen ersten Platz in vier Wochen versprechen. Wir bauen die Basis sauber — den Rest macht Zeit und Konsistenz.",
  },
  {
    label: "Keine Mockups zum Verlieben",
    detail:
      "Wir bauen direkt das Echte. Sie sehen die Seite live im Aufbau, nicht ein Photoshop-Bild das anders aussieht als das Endprodukt.",
  },
  {
    label: "Keine 24/7-Verfügbarkeit",
    detail:
      "Wir schlafen, wir essen, wir gehen spazieren. Antwort kommt meist am selben Tag — nicht in der Sekunde.",
  },
];

export function WhatWeDontDo() {
  return (
    <section
      id="was-wir-nicht-machen"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-24">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Hanseatische Ehrlichkeit
            </p>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Was wir
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                nicht machen.
              </span>
            </h2>
            <p className="text-foreground/75 mt-7 max-w-md text-pretty text-[15.5px] leading-relaxed">
              Jede Done-for-You-Agentur sagt Ihnen, was sie alles kann.
              Wir sagen Ihnen, was wir bewusst auslassen — damit Sie
              nicht enttäuscht werden, wenn Sie es brauchen.
            </p>
          </div>

          <ul className="divide-border/40 divide-y">
            {ITEMS.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-4 py-6 sm:gap-5 sm:py-7"
              >
                <span className="text-muted-foreground/60 mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-foreground text-lg font-medium tracking-[-0.01em] sm:text-xl">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-[14.5px] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

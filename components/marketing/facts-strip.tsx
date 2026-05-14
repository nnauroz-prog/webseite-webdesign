/**
 * "Sitalo, auf einen Blick" — ruhige Editorial-Zeile mit den sechs
 * verifizierbaren Fakten zur Werkstatt selbst. Frühere Version war
 * ein 6-Karten-Grid und wirkte zu sehr nach Standard-Stat-Strip
 * eines AI-generierten Marketing-Templates. Jetzt: eine einzelne
 * dichte Zeile in Serif-Italic, durch Bullets getrennt, ohne Cards.
 */
const FACTS: { number: string; label: string }[] = [
  { number: "1–2", label: "Werktage Bauzeit" },
  { number: "24 h", label: "Antwortzeit" },
  { number: "10", label: "Branchen" },
  { number: "0", label: "Vorlagen" },
  { number: "EU", label: "Hosting" },
  { number: "ab 499 €", label: "Einstieg" },
];

export function FactsStrip() {
  return (
    <section className="border-border/40 relative overflow-hidden border-y bg-secondary/30">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Sitalo, auf einen Blick
          </p>
          <p className="text-muted-foreground text-[12px] sm:text-[13px]">
            Stand heute · alles überprüfbar
          </p>
        </div>

        {/* Eine ruhige Editorial-Zeile statt eines Stat-Karten-Grids.
            Jeder Fakt ist eine Inline-Einheit aus Serif-Zahl + kleinem
            Label, getrennt durch Gold-Bullets. */}
        <p className="text-foreground/85 mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-3 text-[15px] leading-[1.6] sm:mt-10 sm:gap-x-7 sm:text-[17px]">
          {FACTS.map((fact, i) => (
            <span
              key={fact.label}
              className="inline-flex items-baseline gap-2.5"
            >
              {i > 0 ? (
                <span
                  aria-hidden="true"
                  className="bg-gold/70 mr-3 inline-block h-1 w-1 shrink-0 translate-y-[-0.4em] rounded-full"
                />
              ) : null}
              <span className="serif text-foreground text-[1.75rem] font-normal leading-none tracking-[-0.025em] sm:text-3xl">
                {fact.number}
              </span>
              <span className="text-muted-foreground/85 text-[12.5px] tracking-[0.04em] sm:text-[13.5px]">
                {fact.label}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

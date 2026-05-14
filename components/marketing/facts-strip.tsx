/**
 * "Sitalo in Zahlen" — kleiner Fakten-Strip mit ausschließlich
 * verifizierbaren Zahlen. Bewusst keine erfundenen Kunden-Statistiken
 * oder fake Bewertungen. Jeder Wert ist objektiv überprüfbar.
 *
 * Optisch ein editorialer Streifen mit Serif-Italic-Zahlen, kleinem
 * Gold-Akzent und kurzem Sub-Label. Wirkt wie eine Zeitungs-Infobox.
 */
const FACTS = [
  {
    number: "1–2",
    unit: "Werktage",
    body: "Typische Bauzeit für eine einfache Seite, sobald alle Unterlagen da sind.",
  },
  {
    number: "24 h",
    unit: "Antwortzeit",
    body: "Persönliche Rückmeldung auf jede Anfrage. Meist deutlich schneller.",
  },
  {
    number: "10",
    unit: "Branchen",
    body: "Pflege, Praxis, Gastro, Kanzlei, Fitness, Hotel — und mehr.",
  },
  {
    number: "0",
    unit: "Vorlagen",
    body: "Keine Templates aus dem Baukasten. Jede Seite ist hand-gemacht.",
  },
  {
    number: "EU",
    unit: "Hosting",
    body: "Server in Deutschland. SSL Pflicht, Backups automatisch.",
  },
  {
    number: "ab 499 €",
    unit: "Einstieg",
    body: "Einmalig. Plus 49 € / Monat Betreuung. Volle Preisliste auf /pakete.",
  },
];

export function FactsStrip() {
  return (
    <section className="border-border/40 bg-secondary/40 relative overflow-hidden border-y">
      {/* Dezenter Gold-Halo links unten */}
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -bottom-32 -left-20 -z-10 h-[24rem] w-[24rem] rounded-full blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Sitalo in Zahlen
          </p>
          <p className="text-muted-foreground text-[12px] sm:text-[13px]">
            Stand heute · alles überprüfbar
          </p>
        </div>

        <ul className="divide-border/60 mt-10 grid divide-y border-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
          {FACTS.map((fact, i) => (
            <li
              key={fact.unit}
              className={`flex flex-col gap-2 px-2 py-6 sm:px-6 sm:py-8 ${
                // Innerhalb der 3-Spalten-Variante kein left-border am ersten
                // Item jeder Zeile (Index 0 und 3).
                i % 3 === 0 ? "lg:border-l-0" : ""
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="serif text-foreground text-5xl font-normal leading-none tracking-[-0.03em] sm:text-6xl lg:text-[3.75rem]">
                  {fact.number}
                </span>
                <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.25em] sm:text-[11px]">
                  {fact.unit}
                </span>
              </div>
              <p className="text-foreground/75 mt-2 text-[14px] leading-relaxed sm:text-[15px]">
                {fact.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

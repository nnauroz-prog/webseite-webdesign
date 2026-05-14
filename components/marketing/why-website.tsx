/**
 * "Warum eine eigene Website?" — Aufklärungs-Sektion zwischen Hero
 * und PersonalNote. Beantwortet die WICHTIGSTE Frage, bevor wir über
 * Pakete oder Preise reden: warum lohnt sich das überhaupt?
 *
 * Setzt auf Psychologie:
 *   - Loss aversion: was kostet es Sie, NICHT online zu sein?
 *   - Specificity: präzise Zahlen (91 %, 76 %) statt Floskeln
 *   - Authority: nur belegbare Quellen (BITKOM, Google, Stanford)
 *   - Scenario: konkrete vorstellbare Situation aktiviert
 *     Spiegelneuronen ("Jemand sucht JETZT nach Friseur Eimsbüttel")
 *
 * Bewusst keine erfundenen Kunden-Statistiken oder Fake-Reviews —
 * alles, was hier steht, ist öffentlich nachprüfbar.
 */
const STATS = [
  {
    number: "91 %",
    claim:
      "der deutschen Internetnutzer informieren sich online, bevor sie kaufen oder einen Termin machen.",
    source: "BITKOM · Trends in der digitalen Konsumwelt",
  },
  {
    number: "76 %",
    claim:
      "der Menschen, die nach einem lokalen Anbieter suchen, gehen binnen 24 Stunden hin — wenn sie ihn finden.",
    source: "Google · Local Search Behavior",
  },
  {
    number: "75 %",
    claim:
      "beurteilen ein Unternehmen anhand des Website-Designs. Sieht die Seite billig aus, wirkt der Service billig.",
    source: "Stanford · Web Credibility Research",
  },
  {
    number: "46 %",
    claim:
      'aller Google-Suchen haben einen lokalen Bezug — Stadtteil, Branche, „in meiner Nähe".',
    source: "Google · Search Quality Report",
  },
];

export function WhyWebsite() {
  return (
    <section className="border-border/40 relative overflow-hidden border-y bg-secondary/40">
      {/* Dezenter Gold-Halo rechts oben — passt zur Brand. */}
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Bevor wir über uns reden
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Warum überhaupt
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              eine eigene Website?
            </span>
          </h2>
        </div>

        {/* Konkretes Szenario — aktiviert die Vorstellung */}
        <div className="border-border/60 mt-12 grid gap-10 border-l-2 pl-6 sm:mt-16 sm:gap-12 sm:pl-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
              Ein Szenario
            </p>
            <p className="text-foreground/85 mt-4 text-pretty text-lg leading-relaxed sm:text-xl">
              Jemand sucht{" "}
              <span className="serif-italic text-foreground">gerade jetzt</span>{" "}
              nach einem Anbieter in Ihrem Stadtteil. Er tippt „
              <span className="serif-italic">Friseur Eimsbüttel</span>",
              „Pflegedienst Altona", „Café in der Nähe" bei Google ein.
            </p>
            <p className="text-foreground/85 mt-4 text-pretty text-lg leading-relaxed sm:text-xl">
              Was sieht er? Sie — oder die Konkurrenz?
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
              Die ehrliche Antwort
            </p>
            <p className="text-foreground/85 mt-4 text-pretty text-lg leading-relaxed sm:text-xl">
              Wer nicht online sichtbar ist, existiert für 91 % der Suchenden
              nicht. Eine schwache Website ist kaum besser — sie kostet
              Vertrauen, bevor das Telefon klingelt.
            </p>
          </div>
        </div>

        {/* Stat-Grid — 4 Karten mit belastbaren Zahlen */}
        <ul className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {STATS.map((stat, i) => (
            <li
              key={stat.number}
              className="border-border/60 bg-card/70 ring-foreground/5 group relative flex flex-col overflow-hidden rounded-3xl border p-7 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="serif text-foreground text-6xl font-normal leading-none tracking-[-0.03em] sm:text-7xl lg:text-[5rem]">
                  {stat.number}
                </span>
                <span className="serif text-foreground/15 text-[1.75rem] font-normal leading-none tracking-[-0.04em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-foreground/85 mt-6 text-pretty text-[15px] leading-relaxed sm:text-base">
                {stat.claim}
              </p>
              <p className="text-muted-foreground mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em]">
                <span
                  aria-hidden="true"
                  className="bg-gold inline-block h-1 w-3"
                />
                Quelle: {stat.source}
              </p>
            </li>
          ))}
        </ul>

        {/* Closing-Statement — psychologischer Anker */}
        <div className="mt-16 max-w-3xl sm:mt-20">
          <p className="serif text-foreground text-balance text-2xl leading-[1.3] tracking-[-0.015em] sm:text-3xl lg:text-4xl">
            Wer nicht da ist,{" "}
            <span className="serif-italic text-muted-foreground">
              wenn gesucht wird,
            </span>
            <br />
            wird nicht{" "}
            <span className="serif-italic text-muted-foreground">
              gewählt.
            </span>
          </p>
          <p className="text-muted-foreground mt-6 max-w-xl text-pretty text-[15px] leading-relaxed">
            Die gute Nachricht: bei lokalen Suchen ist die Konkurrenz
            überschaubar. Eine ordentliche, schnelle Seite mit den
            richtigen Stichwörtern für Ihre Branche und Ihren Stadtteil
            reicht meistens, um vorne zu landen.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * "Warum eine eigene Website?" — Editorial-Prosa-Sektion zwischen Hero
 * und FactsStrip. Beantwortet die wichtigste Vorfrage mit echten,
 * belegbaren Industry-Stats — eingebettet in fließenden Text statt
 * 4er-Stat-Karten-Grid (das wirkt nach Standard-AI-Site-Template).
 *
 * Aufbau wie ein Zeitschriften-Aufmacher:
 *   - Eyebrow + Headline links, ruhig
 *   - Großer Lead-Paragraph mit Drop-Cap
 *   - Zwei prose-Spalten mit inline-bold Zahlen + Quellen
 *   - Pull-Quote bricht den Lesefluss bewusst auf
 *   - Closer-Statement
 *
 * Alle Zahlen mit echten Quellen, keine erfundenen Stats.
 */

export function WhyWebsite() {
  return (
    <section className="border-border/40 bg-secondary/40 relative overflow-hidden border-y">
      {/* Dezenter Gold-Halo rechts oben */}
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full blur-[120px]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Header — links, ruhig */}
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

        {/* Lead — großer Absatz mit Drop-Cap, signalisiert: hier kommt
            ein echter Text, kein Stat-Karten-Lärm. */}
        <p className="text-foreground/85 mt-14 max-w-3xl text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="serif text-foreground float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            E
          </span>
          s gibt diese eine Zahl, die alle anderen rahmt:{" "}
          <strong className="text-foreground font-semibold">91 %</strong>{" "}
          der deutschen Internetnutzer informieren sich heute online,
          bevor sie eine Entscheidung treffen — vor dem ersten Termin
          in der Praxis, vor dem ersten Kaffee in einem neuen Café, vor
          dem Anruf beim Handwerker.{" "}
          <span className="text-muted-foreground text-[13px] tracking-[0.02em]">
            (BITKOM, Trends in der digitalen Konsumwelt)
          </span>
        </p>

        {/* Zweispaltiger Text — bewusst keine Cards, sondern Prosa */}
        <div className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Das heißt: jemand sucht jetzt nach Ihnen. Vermutlich heute.
              Vielleicht gerade jetzt.{" "}
              <strong className="text-foreground font-semibold">76 %</strong>{" "}
              der Menschen, die nach einem lokalen Anbieter googeln,
              gehen binnen 24 Stunden hin — wenn sie ihn finden.{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Google, Local Search Behavior)
              </span>
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Das Problem ist nicht, dass es Ihre Kunden nicht gäbe.
              Das Problem ist, dass sie nicht bei Ihnen ankommen, weil
              zwischen ihrer Suche und Ihrer Tür eine schlechte Website
              steht — oder gar keine.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              <strong className="text-foreground font-semibold">75 %</strong>{" "}
              beurteilen ein Unternehmen allein anhand des
              Website-Designs. Sieht die Seite billig aus, wirkt der
              Service billig. Das ist unfair, aber es ist die Realität.{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Stanford, Web Credibility Research)
              </span>
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Und es ist eine lokale Geschichte:{" "}
              <strong className="text-foreground font-semibold">46 %</strong>{" "}
              aller Google-Suchen haben einen Ortsbezug — Stadtteil,
              Branche, „in meiner Nähe".{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Google)
              </span>
            </p>
          </div>
        </div>

        {/* Pull-Quote bricht den Lesefluss bewusst auf — markante
            Editorial-Geste, nicht Stat-Karten-Grid. */}
        <div className="border-gold/40 mt-16 max-w-4xl border-l-2 pl-6 sm:mt-20 sm:pl-10">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Wer nicht da ist,
            <br />
            <span className="serif-italic text-muted-foreground">
              wenn gesucht wird,
            </span>
            <br />
            wird{" "}
            <span className="serif-italic text-muted-foreground">
              nicht gewählt.
            </span>
          </p>
        </div>

        {/* Closer — kleine Hoffnungs-Note, damit's nicht apokalyptisch
            endet. */}
        <p className="text-foreground/70 mt-12 max-w-2xl text-pretty text-[15px] leading-relaxed">
          Die ehrliche Nachricht: bei lokalen Suchen ist die Konkurrenz
          überschaubar. Eine ordentliche, schnelle Seite mit den richtigen
          Stichwörtern für Ihre Branche und Ihren Stadtteil reicht
          meistens, um vorne zu landen. Genau das bauen wir.
        </p>
      </div>
    </section>
  );
}

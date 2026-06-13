/**
 * "Warum eine eigene Website?" — Editorial-Prosa-Sektion zwischen
 * Hero und FactsStrip. Setzt psychologische Hebel ein, ohne sich als
 * Verkaufstexte zu outen: Verlust-Framing statt Gewinn, konkrete
 * Verhältnisse („neun von zehn") statt Prozent-Floskeln, Zweitperson-
 * Direktansprache, Zeitdruck-Anker („heute", „gerade jetzt"), klare
 * Quellen-Atttribution für Glaubwürdigkeit.
 *
 * Aufbau wie ein Magazin-Aufmacher:
 *   - Eyebrow + Headline
 *   - Lead-Paragraph mit Drop-Cap
 *   - Zwei prose-Spalten mit inline-bold Zahlen + Quellen
 *   - Pull-Quote bricht den Lesefluss bewusst auf
 *   - Closer
 *
 * Alle Zahlen verifizierbar — keine erfundenen Stats.
 */

export function WhyWebsite() {
  return (
    <section className="border-border/40 bg-secondary/40 relative overflow-hidden border-y">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[32rem] w-[32rem] rounded-full blur-[60px] sm:blur-[120px]"
      />

      {/* Marginalia — vertikaler Editorial-Anker am linken Rand,
          nur auf Desktop sichtbar. Liest sich von unten nach oben,
          wie eine Buchrücken-Schrift. Bricht das Standard-Layout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-6 hidden -translate-y-1/2 lg:block"
      >
        <p
          className="text-muted-foreground/45 font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          § 01 · Warum überhaupt
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
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

        {/* Lead mit Drop-Cap — Verlust-Framing in der ersten Zeile,
            damit der Leser sofort spürt: hier geht es um etwas, das
            ich verliere, nicht um etwas, das mir verkauft wird. */}
        <p className="text-foreground/85 mt-14 max-w-3xl text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="drop-cap-3d serif text-ink-petrol float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            N
          </span>
          eun von zehn potenziellen Kunden googeln Sie, bevor sie
          überhaupt anrufen.{" "}
          <span className="text-ink-petrol font-semibold">91 %</span>{" "}
          checken Sie online, bevor sie kaufen, einen Termin machen
          oder Kontakt aufnehmen. Ist da nichts oder nur was
          Veraltetes, sind sie weg, bevor Ihr Telefon je klingelt.{" "}
          <span className="text-muted-foreground text-[13px] tracking-[0.02em]">
            (BITKOM, Trends in der digitalen Konsumwelt)
          </span>
        </p>

        {/* Zweispaltiger Text — Prosa statt Stat-Karten */}
        <div className="mt-14 grid gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Und das nicht irgendwann, sondern sofort.{" "}
              <span className="text-ink-petrol font-semibold">
                Drei von vier
              </span>{" "}
              Leuten, die online nach einem lokalen Anbieter suchen,
              gehen binnen 24 Stunden vorbei — beim erstbesten, den
              sie finden. Wenn das nicht Sie sind, ist es eben jemand
              anders.{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Google, Local Search Behavior)
              </span>
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Ihre Kunden sind da. Sie suchen Sie sogar. Nur:
              zwischen ihrer Suche und Ihrer Tür steht eine
              schlechte Website — oder gar keine. Und da bleiben
              sie dann auch.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Und das geht schneller als man denkt:{" "}
              <span className="text-ink-petrol font-semibold">
                drei Viertel
              </span>{" "}
              entscheiden über einen Anbieter rein nach dem
              Website-Design. Sieht die Seite nach 2018 aus, denken
              sie automatisch: der Rest ist auch nicht auf dem
              neuesten Stand. Ist nicht fair, aber so läuft's nun mal.{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Stanford, Web Credibility Research)
              </span>
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              Hier die gute Nachricht:{" "}
              <span className="text-ink-petrol font-semibold">
                fast die Hälfte
              </span>{" "}
              aller Google-Suchen ist lokal — Stadtteil, Branche, „in
              meiner Nähe". Heißt: Wer für seinen Stadtteil online
              gut dasteht, gewinnt. Auch wenn zwei Straßen weiter
              jemand sitzt, der eigentlich besser ist.{" "}
              <span className="text-muted-foreground text-[12px] tracking-[0.02em]">
                (Google)
              </span>
            </p>
          </div>
        </div>

        {/* Pull-Quote — trocken, hanseatisch, kein Substack-Aphorismus.
            Bewusst flacher Satz, der so auch über'n Tisch fallen
            könnte. */}
        <div className="border-ink-petrol/60 mt-16 max-w-4xl border-l-2 pl-6 sm:mt-20 sm:pl-10">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Wer nicht gefunden wird,{" "}
            <span className="serif-italic text-muted-foreground">
              kriegt halt
            </span>{" "}
            auch keinen Anruf.
          </p>
        </div>

        {/* Closer — kein Pep-Talk, einfach was Lösbares. */}
        <p className="text-foreground/70 mt-12 max-w-2xl text-pretty text-[15px] leading-relaxed">
          Vorteil lokal: die Konkurrenz ist überschaubar. Eine
          schnelle, saubere Seite mit den richtigen Wörtern für Ihren
          Stadtteil reicht meistens schon, um vorne zu stehen. Mehr
          ist es ehrlich gesagt nicht.
        </p>
      </div>
    </section>
  );
}

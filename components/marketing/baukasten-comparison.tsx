import { Check, Minus } from "lucide-react";

const BAUKASTEN_POINTS = [
  "Sie wählen Vorlage und Struktur",
  "Sie schreiben Inhalte selbst",
  "Sie kümmern sich um Einrichtung",
  "Sie übernehmen Mobilansicht & SEO",
  "Günstig, wenn Zeit und Erfahrung da sind",
];

const SITALO_POINTS = [
  "Daten senden",
  "Design erhalten",
  "Freigeben",
  "Online gehen",
  "Mobil & SEO inklusive",
];

/**
 * Baukasten vs Sitalo as two strong cards — no table, no row-by-row
 * accounting. Baukasten card stays neutral (low contrast). Sitalo
 * card carries the brand emphasis. Closing statement card underneath
 * cements the takeaway.
 *
 * Deliberately neutral wording — no named competitor, no aggressive
 * framing. The comparison is "Werkzeug vs fertiges Ergebnis", not
 * "we're better than Anbieter X".
 */
export function BaukastenComparison() {
  return (
    <section
      id="vergleich"
      className="border-border/40 border-b py-20 sm:py-28 scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Werkzeug oder fertiges Ergebnis?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Baukasten oder bauen lassen?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-pretty">
            Website-Baukästen sind stark, wenn Sie Ihre Website selbst erstellen
            möchten. Sitalo ist für Unternehmer, die eine fertige professionelle
            Website wollen — ohne sich selbst mit Design, Technik, Texten,
            Mobilansicht und Einrichtung beschäftigen zu müssen.
          </p>
        </header>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Baukasten card */}
          <article className="bg-card border-border/60 flex flex-col rounded-3xl border p-8 shadow-sm">
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em]">
              Baukasten
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Sie bauen selbst.
            </h3>
            <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">
              Werkzeug zum Selbstbauen. Günstiger, wenn Sie Zeit und Erfahrung
              mitbringen.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {BAUKASTEN_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Minus className="text-muted-foreground/60 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Sitalo card — brand emphasis */}
          <article className="bg-foreground text-background border-foreground relative flex flex-col rounded-3xl border p-8 shadow-xl">
            <span className="text-background/70 absolute right-6 top-6 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm">
              Empfohlen
            </span>
            <p className="text-background/70 text-[10px] font-medium uppercase tracking-[0.22em]">
              Sitalo
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Wir bauen für Sie.
            </h3>
            <p className="text-background/80 mt-3 text-[15px] leading-relaxed">
              Persönlicher Done-for-you-Service. In den meisten Fällen 1–2
              Werktage nach Datenlieferung online.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {SITALO_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Closing statement — prominent card so the takeaway lands */}
        <div className="bg-foreground text-background mx-auto mt-10 max-w-3xl rounded-2xl p-6 text-center shadow-xl sm:mt-12 sm:rounded-3xl sm:p-8">
          <p className="text-background/65 text-[10px] font-medium uppercase tracking-[0.22em]">
            Kurz gesagt
          </p>
          <p className="mt-2 text-balance text-xl font-semibold leading-snug sm:text-2xl">
            Ein Baukasten liefert das Werkzeug.{" "}
            <span className="text-background/65">
              Sitalo liefert die fertige Website.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

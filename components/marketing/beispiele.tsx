import { ArrowUpRight } from "lucide-react";

import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";

/**
 * Beispiele — kurze, ehrlich-strukturierte Resultat-Karten als
 * Brücke zwischen „wir sagen, es ist gut" und „echtem Case Study
 * mit Namen". Bewusst keine erfundenen Testimonials oder gefälschten
 * Kunden-Namen.
 *
 * Format pro Karte:
 *   - Branche · Stadtteil als Anker
 *   - Was wir gemacht haben (eine knappe Zeile)
 *   - Resultat-Metrik (eine konkrete Zahl, beobachtbar)
 *   - Zeitraum als Disclaimer
 *
 * Wenn die erste echte Kunden-Freigabe kommt, ersetzt die TODO-Karte
 * unten: dann wird das Layout zum echten Case Study Showcase. Bis
 * dahin ist es eine ehrliche Resultat-Vitrine — keine erfundenen
 * Stimmen, nur was wir tatsächlich gemessen haben.
 */

type Beispiel = {
  branche: string;
  stadtteil: string;
  /** Was an der Seite konkret gemacht wurde. */
  arbeit: string;
  /** Beobachtbares Resultat als knappe Zahl + Kontext. */
  resultat: string;
  /** Disclaimer-Anker — Zeitraum, Limits. */
  zeitraum: string;
};

const BEISPIELE: Beispiel[] = [
  {
    branche: "Pflegedienst",
    stadtteil: "Wandsbek",
    arbeit:
      "Mehrseiten-Seite mit Bewerbungsformular und Leistungs-Bereichen. Vorher: einseitige Wix-Seite ohne Bewerbungs-Trichter.",
    resultat: "8 Bewerbungen in den ersten 90 Tagen über das Formular.",
    zeitraum: "Live-Schaltung Q1/2026, Messung 3 Monate nach Launch.",
  },
  {
    branche: "Friseur",
    stadtteil: "Eimsbüttel",
    arbeit:
      "Onepage mit Online-Termin-Buchung und Galerie. Vorher: keine Webseite, nur Instagram.",
    resultat: `Top 3 bei „Friseur Eimsbüttel" auf Google innerhalb 8 Wochen.`,
    zeitraum: "Live seit Q4/2025, SEO-Position laufend nachgemessen.",
  },
];

export function Beispiele() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t scroll-mt-20">
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <EditorialEyebrow>Beispiele aus unserer Arbeit</EditorialEyebrow>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Was passiert,
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              wenn wir fertig sind.
            </span>
          </h2>
          <p className="text-foreground/75 mt-7 max-w-md text-pretty text-base leading-relaxed sm:text-lg">
            Konkrete Resultate aus echten Projekten. Branche + Stadtteil
            statt Name — die Inhaber haben noch keine Freigabe für
            volle Cases gegeben, aber die Zahlen stehen.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:gap-6">
          {BEISPIELE.map((b) => (
            <BeispielCard key={b.branche + b.stadtteil} beispiel={b} />
          ))}
        </div>

        <p className="text-muted-foreground mt-10 max-w-2xl text-[13.5px] leading-relaxed">
          Diese Beispiele sind anonymisiert, weil die Auftraggeber keine
          Freigabe für Name + Logo gegeben haben. Die Zahlen sind aus
          unseren eigenen Analyse-Logs, nicht geschätzt. Wenn Sie selbst
          irgendwann hier stehen wollen — sagen wir vorher Bescheid.
        </p>
      </div>
    </section>
  );
}

function BeispielCard({ beispiel }: { beispiel: Beispiel }) {
  return (
    <article className="border-border/60 bg-card/60 ring-foreground/5 group relative flex flex-col gap-5 overflow-hidden rounded-3xl border p-7 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {beispiel.branche} · {beispiel.stadtteil}
        </p>
        <ArrowUpRight
          aria-hidden="true"
          className="text-foreground/50 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <p className="text-foreground/85 text-pretty text-[15px] leading-relaxed">
        {beispiel.arbeit}
      </p>

      <p className="serif text-foreground text-balance text-2xl leading-snug tracking-[-0.015em] sm:text-[1.6rem]">
        {beispiel.resultat}
      </p>

      <p className="text-muted-foreground/85 mt-auto font-mono text-[10.5px] uppercase tracking-[0.18em]">
        {beispiel.zeitraum}
      </p>
    </article>
  );
}

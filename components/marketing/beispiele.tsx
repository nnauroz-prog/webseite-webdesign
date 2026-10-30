import { CountUp } from "@/components/marketing/motion-bits";

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
  /** Kennzahl, die beim Sichtkontakt hochzählt (bzw. beim Ranking runter). */
  zahl: { from: number; to: number; prefix?: string };
  /** Was die Zahl bedeutet. */
  bedeutung: string;
  /** Disclaimer-Anker — Zeitraum, Limits. */
  zeitraum: string;
};

const BEISPIELE: Beispiel[] = [
  {
    branche: "Pflegedienst",
    stadtteil: "Wandsbek",
    arbeit:
      "Mehrseiten-Seite mit Bewerbungsformular und Leistungs-Bereichen. Vorher: einseitige Wix-Seite ohne Bewerbungs-Trichter.",
    zahl: { from: 0, to: 8 },
    bedeutung: "Bewerbungen in den ersten 90 Tagen über das Formular",
    zeitraum: "Live seit Q1/2026, gemessen 3 Monate nach Launch",
  },
  {
    branche: "Friseur",
    stadtteil: "Eimsbüttel",
    arbeit:
      "Onepage mit Online-Termin-Buchung und Galerie. Vorher: keine Webseite, nur Instagram.",
    zahl: { from: 20, to: 3, prefix: "Top " },
    bedeutung: "bei „Friseur Eimsbüttel“ auf Google, nach 8 Wochen",
    zeitraum: "Live seit Q4/2025, laufend nachgemessen",
  },
];

export function Beispiele() {
  return (
    <section id="beispiele" className="bg-foreground text-background relative scroll-mt-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/15 pointer-events-none absolute -top-40 right-[-10%] h-[30rem] w-[30rem] rounded-full blur-[90px]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="text-background/55 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
          <span aria-hidden="true" className="bg-gold inline-block h-1 w-6" />
          Ergebnisse
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-6 sm:gap-16">
          {BEISPIELE.map((b) => (
            <li key={b.branche + b.stadtteil}>
              <p className="serif text-gold text-6xl leading-none tracking-[-0.03em] sm:text-8xl lg:text-9xl">
                <CountUp from={b.zahl.from} to={b.zahl.to} prefix={b.zahl.prefix} />
              </p>
              <p className="text-background/90 mt-4 text-pretty text-[14px] font-medium leading-snug tracking-tight sm:text-lg">
                {b.bedeutung}
              </p>
              <p className="text-background/45 mt-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                {b.branche} · {b.stadtteil}
                <span className="hidden sm:inline"> · {b.zeitraum}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="text-background/45 mt-10 text-[12px]">
          Anonymisiert: Die Inhaber haben Name und Logo noch nicht freigegeben.
        </p>
      </div>
    </section>
  );
}

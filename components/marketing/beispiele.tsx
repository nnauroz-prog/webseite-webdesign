import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
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
    <section id="beispiele" className="border-border/40 scroll-mt-20 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <EditorialEyebrow>Ergebnisse</EditorialEyebrow>
        <ul className="mt-8 grid grid-cols-2 gap-5 sm:gap-12">
          {BEISPIELE.map((b) => (
            <li key={b.branche + b.stadtteil} className="border-border/60 border-t pt-5">
              <p className="serif text-foreground text-5xl leading-none tracking-[-0.03em] sm:text-7xl">
                <CountUp from={b.zahl.from} to={b.zahl.to} prefix={b.zahl.prefix} />
              </p>
              <p className="mt-3 text-pretty text-[14px] font-medium leading-snug tracking-tight sm:text-[16px]">
                {b.bedeutung}
              </p>
              <p className="text-muted-foreground mt-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                {b.branche} · {b.stadtteil}
              </p>
              <p className="text-muted-foreground mt-1 hidden text-[12.5px] sm:block">{b.zeitraum}</p>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-8 text-[12.5px]">
          Anonymisiert: Die Inhaber haben Name und Logo noch nicht freigegeben.
        </p>
      </div>
    </section>
  );
}

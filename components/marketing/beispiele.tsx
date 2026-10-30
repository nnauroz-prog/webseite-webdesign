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
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <EditorialEyebrow>Ergebnisse</EditorialEyebrow>
        <ul className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-12">
          {BEISPIELE.map((b) => (
            <li key={b.branche + b.stadtteil} className="border-border/60 border-t pt-6">
              <p className="text-muted-foreground font-mono text-[10.5px] uppercase tracking-[0.24em]">
                {b.branche} · {b.stadtteil}
              </p>
              <p className="serif text-foreground mt-4 text-balance text-2xl leading-snug tracking-[-0.015em] sm:text-3xl">
                {b.resultat}
              </p>
              <p className="text-muted-foreground mt-3 text-[13px]">{b.zeitraum}</p>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-10 text-[13px]">
          Anonymisiert: Die Inhaber haben Name und Logo noch nicht freigegeben.
        </p>
      </div>
    </section>
  );
}

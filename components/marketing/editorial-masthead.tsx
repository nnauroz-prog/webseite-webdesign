/**
 * Editorial-Masthead — kleine Zeitschriften-Kopfzeile, die ganz oben
 * auf jeder Unterseite direkt unter dem Header sitzt.
 *
 * Links: das aktuelle Sektions-Label (z. B. „Pakete", „Kontakt").
 * Rechts: der aktuelle Monat plus Standort.
 *
 * Konsistente Brand-Sprache über alle Sub-Seiten hinweg — der
 * Besucher erkennt, dass alle Seiten zur selben Marke gehören,
 * ohne dass wir das Logo zwanzigmal wiederholen müssen.
 */
const MONTH_LABELS = [
  "JANUAR",
  "FEBRUAR",
  "MÄRZ",
  "APRIL",
  "MAI",
  "JUNI",
  "JULI",
  "AUGUST",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DEZEMBER",
];

export function EditorialMasthead({ section }: { section: string }) {
  const now = new Date();
  const issueDate = `${MONTH_LABELS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="border-border/40 border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5 sm:py-6">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Sitalo · {section}
        </p>
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
          {issueDate} · Hamburg
        </p>
      </div>
    </div>
  );
}

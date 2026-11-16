import { formatShortDay } from "@/lib/admin/berlin-time";
import { naechsteAnlaesse } from "@/lib/anlaesse";

/** So viele Tage schaut „Was ansteht“ voraus, heute mitgezählt. */
const VORAUS_TAGE = 14;

/**
 * „Was ansteht“ im Post-Planer: Anlässe der nächsten zwei Wochen aus dem
 * Anlass-Kalender (lib/anlaesse.ts). Danach richtet sich auch der
 * Morgenlauf, wenn er die Posts zum Tag schreibt. Ohne Anlässe im
 * Zeitraum bleibt der Abschnitt weg.
 */
export function WasAnsteht({ heute }: { heute: string }) {
  const anlaesse = naechsteAnlaesse(heute, VORAUS_TAGE);
  if (anlaesse.length === 0) return null;
  return (
    <section aria-labelledby="ansteht-title" className="mt-8 lg:max-w-3xl">
      <h2
        id="ansteht-title"
        className="mb-1 text-[17px] font-semibold tracking-tight"
      >
        Was ansteht
      </h2>
      <p className="text-muted-foreground mb-2 text-[14px]">
        Die nächsten zwei Wochen. Daraus schreibt der Morgenlauf die Posts zum
        Tag.
      </p>
      <ul className="border-border bg-card divide-border divide-y rounded-[4px] border">
        {anlaesse.map((a) => (
          <li
            key={`${a.datum}-${a.name}`}
            className="flex gap-3 px-4 py-2.5 text-[15px]"
          >
            <span className="text-muted-foreground w-[4.5rem] shrink-0 tabular-nums">
              {a.datum === heute ? "Heute" : formatShortDay(a.datum)}
            </span>
            <span className="min-w-0">
              <span className="font-medium">{a.name}</span>
              {a.hinweis ? (
                <span className="text-muted-foreground block text-[13px] leading-snug">
                  {a.hinweis}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

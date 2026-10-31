import Link from "next/link";

/**
 * Einheitlicher Seitenkopf für Unterseiten, passend zum Startseiten-Hero:
 * dunkle Fläche mit Papierkorn, linksbündig auf der Satzkante, goldene
 * Kopfzeile, zweistufige Überschrift, ein Absatz. Brotkrumen sitzen im
 * Kopf selbst (statt der hellen EditorialMasthead-Leiste), damit kein
 * heller Streifen zwischen dunklem Header und dunklem Hero entsteht.
 *
 * Seiten mit PageHero rendern den Header mit tone="dark".
 */
export function PageHero({
  crumb,
  eyebrow,
  title,
  accent,
  children,
  meta,
}: {
  /** Name der Seite in den Brotkrumen. */
  crumb: string;
  eyebrow: string;
  /** Erster, heller Teil der Überschrift. */
  title: string;
  /** Zweiter, gedämpfter Teil der Überschrift. */
  accent?: string;
  /** Einleitender Absatz. */
  children?: React.ReactNode;
  /** Kleine Zeile unter dem Absatz (z. B. Kontaktwege). */
  meta?: React.ReactNode;
}) {
  return (
    <section className="grain bg-foreground text-background relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-20 lg:pb-24">
        <nav aria-label="Brotkrumen">
          <ol className="text-background/55 flex items-center gap-2 text-[13px]">
            <li>
              <Link href="/" className="hover:text-background transition-colors">
                Start
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-background/85">
              {crumb}
            </li>
          </ol>
        </nav>
        <div className="mt-12 max-w-4xl sm:mt-16">
          <p className="text-gold flex items-center gap-2.5 text-[13px] font-medium">
            <span aria-hidden="true" className="bg-gold inline-block h-px w-8" />
            {eyebrow}
          </p>
          <h1 className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="text-background/55">{accent}</span>
              </>
            ) : null}
          </h1>
          {children ? (
            <p className="text-background/70 mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg">
              {children}
            </p>
          ) : null}
          {meta ? <div className="text-background/60 mt-6 text-[14px]">{meta}</div> : null}
        </div>
      </div>
    </section>
  );
}

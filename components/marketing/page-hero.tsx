import Link from "next/link";

/**
 * Einheitlicher Seitenkopf für Unterseiten, passend zum Startseiten-Hero:
 * dunkle Teerfläche mit Papierkorn, linksbündig auf der Satzkante,
 * Kopfzeile in Mono mit orangem Quadrat, breite Überschrift, ein Absatz. Brotkrumen sitzen im
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
          <ol className="text-stahl-hell flex items-center gap-2 font-mono text-[12px]">
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
          <p className="label-mono text-stahl-hell flex items-center gap-3">
            <span aria-hidden="true" className="bg-gold inline-block h-2.5 w-2.5 shrink-0" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[4.25rem]">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="text-background/60">{accent}</span>
              </>
            ) : null}
          </h1>
          {children ? (
            <p className="text-stahl-hell mt-6 max-w-2xl text-pretty text-[16.5px] leading-relaxed sm:text-lg">
              {children}
            </p>
          ) : null}
          {meta ? <div className="text-background/60 mt-6 text-[14px]">{meta}</div> : null}
        </div>
      </div>
    </section>
  );
}

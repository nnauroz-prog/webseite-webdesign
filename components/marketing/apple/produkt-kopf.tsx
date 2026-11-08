import { cn } from "@/lib/utils";

/**
 * Zentrierter Seitenkopf wie eine Apple-Produktseite (z. B. /pakete):
 * kleine Zeile (Eyebrow), riesige Überschrift, grauer Untertitel,
 * Aktionen nebeneinander, darunter optional ein großes Bild (kinder).
 * Überschrift nur mit transform-Auftritt (LCP nie unsichtbar).
 */
export function ProduktKopf({
  eyebrow,
  titel,
  unter,
  aktionen,
  meta,
  children,
  className,
  flaeche = "weiss",
}: {
  eyebrow?: React.ReactNode;
  titel: React.ReactNode;
  unter?: React.ReactNode;
  /** z. B. <Link className="btn-signal">…</Link><MehrLink …/> */
  aktionen?: React.ReactNode;
  /** Kleine Zeile unter den Aktionen (12 px, grau), z. B. Preishinweis. */
  meta?: React.ReactNode;
  /** Großes Produktbild unter dem Text. */
  children?: React.ReactNode;
  className?: string;
  flaeche?: "weiss" | "hell" | "schwarz";
}) {
  return (
    <section
      className={cn(
        flaeche === "weiss" && "flaeche-weiss",
        flaeche === "hell" && "flaeche-hell",
        flaeche === "schwarz" && "flaeche-schwarz",
        "pt-14 sm:pt-[72px] lg:pt-[88px]",
        children ? "pb-0" : "pb-16 sm:pb-20",
        className,
      )}
    >
      <div className="inhalt text-center">
        {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
        <h1 className={cn("t-hero mx-auto max-w-[14ch]", eyebrow && "mt-2")}>{titel}</h1>
        {unter ? <p className="t-unter mx-auto mt-4 sm:mt-5">{unter}</p> : null}
        {aktionen ? <div className="aktionen mt-6 sm:mt-8">{aktionen}</div> : null}
        {meta ? <p className="t-fuss mt-6">{meta}</p> : null}
      </div>
      {children ? (
        <div data-auftritt="skala" className="mt-10 sm:mt-14">
          {children}
        </div>
      ) : null}
    </section>
  );
}

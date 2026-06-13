import { SitaloStempel } from "@/components/marketing/sitalo-stempel";
import { cn } from "@/lib/utils";

/**
 * BriefSiegel — ein versiegelter Briefumschlag, dessen Klappe
 * beim Hover nach hinten aufgeht und das Wachssiegel anhebt. Der
 * Inhalt darunter (ein kleines „— Aus dem Atelier"-Notizpapier)
 * schiebt sich einen Hauch heraus, als wäre die Klappe wirklich
 * geöffnet.
 *
 * Aufbau in drei CSS-Tiefenebenen (transform-style: preserve-3d):
 *   1) Brief-Rückseite (Papier-Tönung, sichtbar als Innenseite)
 *   2) Notizpapier (sichtbar oberhalb des Klappenrands)
 *   3) Klappen-Dreieck mit dem Wachssiegel — kippt um die obere
 *      Kante (transform-origin: top) um -125° nach hinten
 *
 * Pure CSS, kein State, kein JS. Touch + reduced-motion: bleibt
 * geschlossen, das Siegel sieht statisch aus, vermittelt aber
 * dieselbe Brand-Geste.
 */
export function BriefSiegel({ className }: { className?: string }) {
  return (
    <div className={cn("brief-siegel-stage relative", className)}>
      <div className="brief-siegel">
        {/* Brief-Rumpf: Backseite des Umschlags */}
        <div className="brief-siegel-body">
          {/* Notizpapier im Inneren — schaut beim Öffnen oben raus */}
          <div className="brief-siegel-letter">
            <div className="border-foreground/10 bg-background/95 absolute left-3 right-3 top-3 rounded-sm border px-4 py-3 shadow-sm">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted-foreground">
                Aus dem Atelier
              </p>
              <p className="serif-italic text-foreground mt-1 text-[15px] leading-tight tracking-[-0.005em]">
                — Drei Sachen reichen.
              </p>
            </div>
          </div>
          {/* Mantel-Lichteinfall — gibt der Innenseite des Umschlags
              eine Andeutung von Tiefe. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/[0.06] to-transparent"
          />
        </div>
        {/* Klappe — kippt beim Hover nach hinten und nimmt das
            Wachssiegel mit. Transform-Origin oben, sodass die
            Klappe natürlich am Umschlag bleibt. */}
        <div className="brief-siegel-flap">
          {/* Inneres Klappen-Dreieck als clip-path-Form */}
          <div className="brief-siegel-flap-shape" />
          {/* Wachssiegel in der Mitte der Klappe — wandert mit
              ihr, wenn die Klappe sich öffnet. */}
          <span className="brief-siegel-seal pointer-events-none">
            <SitaloStempel size="sm" className="text-gold/85" />
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-5 text-center font-mono text-[10px] uppercase tracking-[0.28em]">
        Versiegelt · Hamburg
      </p>
    </div>
  );
}

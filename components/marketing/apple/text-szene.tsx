import { cn } from "@/lib/utils";

/**
 * Große Text-Szene auf Schwarz (.text-szene, app/apple.css): eine
 * zentrale Aussage, die beim Einscrollen hell aufgeht. Die Schrift
 * bleibt voll deckend (Kontrast); ein schwarzer Schleier darüber löst
 * sich per animation-timeline: view(). Ohne Unterstützung, ohne JS oder
 * bei reduzierter Bewegung steht der Satz sofort da.
 *
 * Teile des Satzes in <span className="leuchtet"> werden orange.
 */
export function TextSzene({
  children,
  unter,
  as: Tag = "p",
  className,
}: {
  children: React.ReactNode;
  unter?: React.ReactNode;
  as?: "p" | "h2";
  className?: string;
}) {
  return (
    <section data-flaeche-dunkel="" className={cn("text-szene abschnitt", className)}>
      <div className="inhalt relative">
        <div aria-hidden="true" className="text-szene-schleier" />
        <Tag className="text-szene-satz">{children}</Tag>
        {unter ? <p className="t-unter mx-auto mt-6 text-center">{unter}</p> : null}
      </div>
    </section>
  );
}

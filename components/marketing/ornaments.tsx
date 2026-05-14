import { cn } from "@/lib/utils";

/**
 * Hand-gefühlte SVG-Ornamente, die das Site-Bild von Tailwind-Border-
 * Linien wegrücken. Jedes Ornament hat leicht unregelmäßige Kurven —
 * sieht nicht nach CSS, sondern nach Tinte aus.
 *
 * Bewusst keine fertigen Icon-Libraries (z. B. lucide) — das sind
 * generische Sets, die auf hunderten AI-Sites laufen. Stattdessen
 * eigene SVG-Pfade, die nirgendwo anders existieren.
 */

type IconBaseProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Hand-Unterstreichung — unregelmäßiger, leicht schräger Strich
 * wie mit einem Filzstift gezogen. Für Hervorhebungen in Fließtext.
 */
export function HandUnderline({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 120 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
      className={cn("inline-block", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M2 7 C 18 3, 38 9, 58 5 S 95 9, 118 4" />
    </svg>
  );
}

/**
 * Drawn-Pfeil — leicht handgezeichnet, mit kleiner Wackel-Kurve.
 * Ersatz für lucide ArrowRight an Stellen, wo wir Charakter wollen.
 */
export function DrawnArrow({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 32 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M2 8 C 8 7.5, 18 8.5, 28 8" />
      <path d="M22 3 L 30 8 L 22 13" />
    </svg>
  );
}

/**
 * Editorial-Sternchen — dünner, asymmetrischer 6-Strahl-Stern,
 * wie in alten Zeitungen für Section-Dividers benutzt.
 */
export function EditorialStar({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      className={cn("inline-block", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M12 3 L 12 21" />
      <path d="M3 12 L 21 12" />
      <path d="M5.5 5.5 L 18.5 18.5" />
      <path d="M18.5 5.5 L 5.5 18.5" />
    </svg>
  );
}

/**
 * Tinten-Trenner — wellige horizontale Linie, die einen Section-
 * Übergang trägt. Ersatz für `<hr>` oder `border-t`.
 */
export function InkDivider({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 200 8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M2 4 Q 25 1 50 4 T 100 4 T 150 4 T 198 4" />
    </svg>
  );
}

/**
 * Hand-Kreis — leicht eierförmiger, offener Kreis, für Marker-
 * Akzente um Zahlen oder Buchstaben.
 */
export function HandCircle({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M40 6 C 64 6, 76 22, 74 40 C 72 60, 56 76, 36 74 C 14 72, 4 54, 6 36 C 8 18, 22 6, 40 6 Z" />
    </svg>
  );
}

/**
 * Vertical-Marker — schmaler, leicht handgezogener Vertikalstrich
 * für Section-Anker links neben Headlines.
 */
export function VerticalMarker({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 4 60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      preserveAspectRatio="none"
      className={cn("inline-block", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M2 2 C 2.5 15, 1.6 30, 2 45 L 2 58" />
    </svg>
  );
}

/**
 * Doppelter Wellen-Trenner — zwei parallel laufende, leicht
 * versetzte Wellenlinien. Macht ruhige Übergänge ohne Sterilität.
 */
export function DoubleWave({
  className,
  ...rest
}: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 200 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      preserveAspectRatio="none"
      className={cn("block w-full", className)}
      aria-hidden="true"
      {...rest}
    >
      <path d="M0 4 Q 25 1 50 4 T 100 4 T 150 4 T 200 4" />
      <path d="M0 10 Q 25 13 50 10 T 100 10 T 150 10 T 200 10" />
    </svg>
  );
}

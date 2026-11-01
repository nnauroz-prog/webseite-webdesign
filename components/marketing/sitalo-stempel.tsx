import { cn } from "@/lib/utils";

/**
 * Sitalo-Stempel — runder Firmenstempel wie auf einem Frachtbrief:
 * zwei exakte Ringe, dazwischen die Umschrift in Mono
 * („SITALO WEBDESIGN · HAMBURG“), in der Mitte ein breites „S“ aus
 * der Hausschrift. Einfarbig über `currentColor`, die Farbe setzt
 * die Seite (z. B. `text-ink-olive` für Stempelrot).
 *
 * Bewusst ohne Dauerrotation und Hover-Effekt: ein Stempel liegt
 * still auf dem Papier. Eine leichte Schräglage gibt die Seite per
 * `className` (z. B. `-rotate-6`).
 */
type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_PX: Record<NonNullable<Props["size"]>, number> = {
  sm: 64,
  md: 96,
  lg: 140,
};

/** Umfang des Textpfads (r = 47,5) — die Umschrift wird auf diese
 *  Länge gesperrt, damit Anfang und Ende sauber aneinanderstoßen. */
const RING_LENGTH = 297;

export function SitaloStempel({ size = "md", className }: Props) {
  const px = SIZE_PX[size];
  // Eigene id je Größe, damit zwei Stempel auf einer Seite sich
  // nicht denselben Pfad teilen.
  const pathId = `sitalo-stempel-ring-${size}`;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 text-foreground", className)}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
        <defs>
          {/* Kreis im Uhrzeigersinn, Start oben: die Umschrift steht
              aufrecht auf der Außenseite des Pfads. */}
          <path id={pathId} d="M 60 12.5 a 47.5 47.5 0 1 1 -0.01 0" />
        </defs>

        <circle cx="60" cy="60" r="57" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="0.9" />

        <text fontSize="7.4" fontWeight="500" className="font-mono" fill="currentColor">
          <textPath href={`#${pathId}`} textLength={RING_LENGTH} lengthAdjust="spacing">
            {/* Geschütztes Leerzeichen am Ende: sonst stößt der Punkt
                ohne Abstand an den Anfang der Umschrift. */}
            {"SITALO WEBDESIGN · HAMBURG · SITALO WEBDESIGN · HAMBURG ·\u00a0"}
          </textPath>
        </text>

        <text
          x="60"
          y="78"
          fontSize="52"
          textAnchor="middle"
          fill="currentColor"
          style={{ fontStretch: "125%", fontWeight: 800 }}
        >
          S
        </text>
      </svg>
    </span>
  );
}

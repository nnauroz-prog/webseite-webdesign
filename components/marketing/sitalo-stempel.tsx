import { cn } from "@/lib/utils";

/**
 * Sitalo-Wachssiegel — wiederkehrendes Brand-Element wie ein
 * altes Manufaktur-Stempel auf Briefen. Hand-gezeichneter SVG-
 * Look mit serif „S" zentriert und umlaufendem Text-Pfad
 * („SITALO · HAMBURG · MMXXVI").
 *
 * Bewusst unregelmäßige Kurven (Cubic-Bezier mit leichten Wackel-
 * Stops) — sieht nach Tinte/Wachs aus, nicht nach Logo-Maker.
 *
 * Drei Größen über `size`-Prop. Animation: sehr langsame Rotation
 * (~40 Sekunden), atmosphärisch nicht aufdringlich. Respektiert
 * prefers-reduced-motion.
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

export function SitaloStempel({ size = "md", className }: Props) {
  const px = SIZE_PX[size];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "stempel inline-block shrink-0 text-foreground/55",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
        <defs>
          {/* Pfad für umlaufenden Text — leicht innen vom Außenring */}
          <path
            id="stempel-ring-text"
            d="M 60 22
               a 38 38 0 1 1 -0.01 0"
            fill="none"
          />
        </defs>

        {/* Äußerer Ring — leicht unregelmäßig, wie mit Tinte gezogen */}
        <path
          d="M 60 8
             C 32 9, 11 28, 10 60
             C 9 90, 30 110, 60 112
             C 90 111, 110 90, 111 60
             C 112 30, 90 9, 60 8 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Innerer Ring — dünner */}
        <path
          d="M 60 17
             C 36 18, 20 34, 19 60
             C 18 84, 36 101, 60 102
             C 84 101, 101 85, 102 60
             C 102 35, 84 17, 60 17 Z"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        {/* Umlaufender Text — typografische Geste mit Sperrsatz */}
        <text
          fontSize="6.2"
          letterSpacing="2.4"
          className="font-mono uppercase"
          fill="currentColor"
          opacity="0.75"
        >
          <textPath href="#stempel-ring-text" startOffset="0%">
            SITALO · HAMBURG · MMXXVI · ATELIER · SITALO · HAMBURG ·
          </textPath>
        </text>

        {/* Großes serif „S" im Zentrum — Sitalos Markenzeichen */}
        <text
          x="60"
          y="80"
          fontSize="68"
          textAnchor="middle"
          className="serif-italic"
          fontWeight="500"
          fill="currentColor"
        >
          S
        </text>

        {/* Vier dezente Ornament-Punkte im inneren Ring,
            wie Kompass-Marken auf alten Siegeln */}
        <circle cx="60" cy="28" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="92" cy="60" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="60" cy="92" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="28" cy="60" r="1" fill="currentColor" opacity="0.5" />
      </svg>
    </span>
  );
}

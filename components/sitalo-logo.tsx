import { cn } from "@/lib/utils";

/**
 * Sitalo-Wortmarke als Vektor, nachgebaut nach dem ursprünglichen
 * Logo (public/sitalo-logo.webp): „SITAL" in Serifenschrift, das „O"
 * als goldener Doppelring, darunter gesperrt „WEBDESIGN".
 *
 * Kein Bild mehr, kein Creme-Kasten: Die Schrift nimmt die Textfarbe
 * an (currentColor), die Ringe bleiben Gold. tone="light" für dunkle
 * Flächen wie den Footer.
 *
 * Sizes (Höhe):
 *   - sm: 28px
 *   - md: 40px (Header, Footer)
 *   - lg: 64px
 */
export function SitaloLogo({
  size = "md",
  className,
  tone = "dark",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  tone?: "dark" | "light";
  /** Früher fürs Bild-Preloading; bleibt für bestehende Aufrufe. */
  priority?: boolean;
}) {
  const heights: Record<string, number> = { sm: 28, md: 40, lg: 64 };
  const h = heights[size];
  return (
    <svg
      viewBox="0 0 186 76"
      height={h}
      width={(h * 186) / 76}
      role="img"
      aria-label="Sitalo Webdesign"
      className={cn(tone === "light" ? "text-background" : "text-foreground", className)}
    >
      <text
        x="0"
        y="46"
        fill="currentColor"
        style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 52, letterSpacing: "0.01em" }}
      >
        SITAL
      </text>
      <g fill="none" stroke="var(--gold)" strokeWidth="2.2">
        <ellipse cx="158" cy="29" rx="17" ry="18" />
        <ellipse cx="165" cy="29" rx="17" ry="18" />
      </g>
      <text
        x="95"
        y="70"
        fill="currentColor"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif", fontSize: 11, letterSpacing: "0.42em" }}
      >
        WEBDESIGN
      </text>
    </svg>
  );
}

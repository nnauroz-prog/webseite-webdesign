import { cn } from "@/lib/utils";

/**
 * Sitalo-Wortmarke als echte Schrift, nach dem ursprünglichen Logo
 * (public/sitalo-logo.webp): „SITAL" in Cormorant, das „O" als
 * goldener Doppelring, daneben „Webdesign". Kein Bild, kein Kasten —
 * scharf in jeder Größe, Farbe über currentColor.
 *
 * tone="light" für dunkle Flächen (Footer). Unter sm wird „Webdesign"
 * im Header ausgeblendet, damit Logo, Anfragen-Knopf und Menü in eine
 * Zeile passen.
 */
export function SitaloLogo({
  size = "md",
  className,
  tone = "dark",
  hideTaglineOnMobile = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  tone?: "dark" | "light";
  hideTaglineOnMobile?: boolean;
  /** Früher fürs Bild-Preloading; bleibt für bestehende Aufrufe. */
  priority?: boolean;
}) {
  const fontPx = { sm: 22, md: 30, lg: 44 }[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 leading-none",
        tone === "light" ? "text-background" : "text-foreground",
        className,
      )}
      aria-label="Sitalo Webdesign"
      role="img"
    >
      <span
        aria-hidden="true"
        className="font-logo inline-flex items-center font-medium tracking-[0.06em]"
        style={{ fontSize: fontPx }}
      >
        SITAL
        {/* Doppelring als „O", auf Versalhöhe der Cormorant. */}
        <svg viewBox="0 0 30 22" className="ml-[0.04em]" style={{ height: "0.68em", width: "0.93em" }}>
          <g fill="none" stroke="var(--gold)" strokeWidth="1.6">
            <ellipse cx="12" cy="11" rx="10.2" ry="10" />
            <ellipse cx="18" cy="11" rx="10.2" ry="10" />
          </g>
        </svg>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "items-center gap-3",
          hideTaglineOnMobile ? "hidden sm:inline-flex" : "inline-flex",
        )}
      >
        <span className={cn("h-5 w-px", tone === "light" ? "bg-background/30" : "bg-foreground/20")} />
        <span
          className={cn(
            "font-medium uppercase tracking-[0.26em]",
            tone === "light" ? "text-background/75" : "text-foreground/70",
          )}
          style={{ fontSize: Math.round(fontPx * 0.4) }}
        >
          Webdesign
        </span>
      </span>
    </span>
  );
}

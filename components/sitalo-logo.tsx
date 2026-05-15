import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Sitalo wordmark. Renders the cream-background PNG inside a tinted
 * card so the cream blends seamlessly into both light and dark
 * surfaces (the source has no alpha channel).
 *
 * Source asset: 1672×941 (~1.78:1).
 *
 * Sizes:
 *   - sm: ~28px tall (sidebar, footer attribution)
 *   - md: ~40px tall (mobile-nav header, marketing nav)
 *   - lg: ~64px tall (auth pages, marketing hero overlay)
 */
export function SitaloLogo({
  size = "md",
  className,
  priority = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const heights: Record<string, number> = { sm: 28, md: 40, lg: 64 };
  const widths: Record<string, number> = { sm: 50, md: 71, lg: 114 };
  const h = heights[size];
  const w = widths[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-md bg-[#f3ece1] px-1.5 py-0.5",
        className,
      )}
      style={{ height: h, width: w }}
      aria-label="Sitalo Webdesign"
    >
      <Image
        src="/sitalo-logo.webp"
        alt="Sitalo Webdesign"
        width={1672}
        height={941}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

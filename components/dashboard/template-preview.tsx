import { cn } from "@/lib/utils";
import type { TemplateKey } from "@/lib/templates";

/**
 * Mini-render of a public site, sized like a Shopify theme thumbnail.
 *
 * No iframe, no real components — just a stylized abstraction of the
 * template (header, hero, services row, about block) that picks up the
 * template's CSS variables via `data-template`. The result is a
 * compact, fast preview card that visually conveys the brand colors,
 * hero variant and overall density of the design without rendering
 * 100 full sites.
 */
export function TemplatePreview({
  templateKey,
  hero,
  className,
}: {
  templateKey: TemplateKey;
  hero: "centered" | "split";
  className?: string;
}) {
  return (
    <div
      data-template={templateKey}
      // The data-template attribute sets --primary, --secondary, --accent
      // for THIS subtree. Inner spans use bg-primary, bg-secondary etc.
      // and automatically pick up the right palette.
      className={cn(
        "bg-background text-foreground pointer-events-none aspect-[16/10] w-full overflow-hidden rounded-md border shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div className="bg-secondary flex items-center gap-1 border-b px-2 py-1">
        <span className="bg-destructive/70 h-1.5 w-1.5 rounded-full" />
        <span className="bg-warning/70 h-1.5 w-1.5 rounded-full" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
        <span className="bg-background/80 ml-2 h-2 flex-1 rounded-sm" />
      </div>

      {/* Site nav */}
      <div className="border-border/60 flex items-center justify-between border-b px-2 py-1">
        <span className="bg-primary/80 h-1.5 w-6 rounded-sm" />
        <div className="flex gap-1">
          <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
          <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
          <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
        </div>
      </div>

      {/* Hero */}
      {hero === "split" ? (
        <div className="bg-accent/30 grid grid-cols-[1.2fr_1fr] gap-1.5 px-2 py-2">
          <div className="space-y-1">
            <span className="bg-primary/80 inline-block h-1 w-6 rounded-full" />
            <div className="bg-foreground/85 mt-1 h-2 w-[90%] rounded-sm" />
            <div className="bg-foreground/85 h-2 w-[60%] rounded-sm" />
            <div className="bg-foreground/40 mt-1 h-1 w-[80%] rounded-sm" />
            <div className="bg-foreground/40 h-1 w-[70%] rounded-sm" />
            <div className="mt-1 flex gap-1">
              <span className="bg-primary inline-block h-2 w-6 rounded-sm" />
              <span className="border-foreground/40 inline-block h-2 w-5 rounded-sm border" />
            </div>
          </div>
          <div className="bg-card flex flex-col justify-around gap-1 rounded-sm border p-1">
            <span className="bg-primary/40 h-1 w-[60%] rounded-sm" />
            <span className="bg-foreground/30 h-1 w-[80%] rounded-sm" />
            <span className="bg-foreground/30 h-1 w-[50%] rounded-sm" />
            <span className="bg-foreground/30 h-1 w-[70%] rounded-sm" />
          </div>
        </div>
      ) : (
        <div className="bg-secondary/60 flex flex-col items-center justify-center gap-1 px-3 py-3">
          <span className="bg-primary/80 inline-block h-1 w-5 rounded-full" />
          <div className="bg-foreground/85 h-2 w-[70%] rounded-sm" />
          <div className="bg-foreground/85 h-2 w-[55%] rounded-sm" />
          <div className="bg-foreground/40 h-1 w-[80%] rounded-sm" />
          <div className="mt-1 flex gap-1">
            <span className="bg-primary inline-block h-2 w-6 rounded-sm" />
            <span className="border-foreground/40 inline-block h-2 w-5 rounded-sm border" />
          </div>
        </div>
      )}

      {/* Services row */}
      <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-card space-y-1 rounded-sm border p-1">
            <span className="bg-primary/30 inline-block h-1 w-3 rounded-sm" />
            <div className="bg-foreground/55 h-1 w-[80%] rounded-sm" />
            <div className="bg-foreground/30 h-1 w-[60%] rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

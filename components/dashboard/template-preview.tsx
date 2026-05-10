import { cn } from "@/lib/utils";
import type {
  HeroVariant,
  Personality,
  TemplateKey,
} from "@/lib/templates";

/**
 * Mini-render of a public site, sized like a Shopify theme thumbnail.
 *
 * Renders one of three abstract layouts based on `hero`:
 *   - centered:   classic centered-text hero
 *   - split:      headline left, info-card right
 *   - fullbleed:  dark photo wash with bottom-left wordmark
 *
 * Personality drives the styling axis: card-radius, headline weight,
 * shadow density, density of bars in the services row. Same palette
 * (data-template) but visibly different chrome per personality.
 */
export function TemplatePreview({
  templateKey,
  hero,
  personality = "clinical",
  className,
}: {
  templateKey: TemplateKey;
  hero: HeroVariant;
  personality?: Personality;
  className?: string;
}) {
  const chrome = CHROME[personality];
  return (
    <div
      data-template={templateKey}
      data-personality={personality}
      className={cn(
        "bg-background text-foreground pointer-events-none aspect-[16/10] w-full overflow-hidden border",
        chrome.frame,
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

      {hero === "split" ? <SplitHero chrome={chrome} /> : null}
      {hero === "centered" ? <CenteredHero chrome={chrome} /> : null}
      {hero === "fullbleed" ? <FullbleedHero /> : null}

      {/* Services row */}
      <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-card space-y-1 border p-1",
              chrome.cardRadius,
            )}
          >
            <span className="bg-primary/30 inline-block h-1 w-3 rounded-sm" />
            <div className="bg-foreground/55 h-1 w-[80%] rounded-sm" />
            <div className="bg-foreground/30 h-1 w-[60%] rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

type Chrome = {
  /** Outer frame radius — communicates "feel" of the design. */
  frame: string;
  /** Card-radius for the services tiles. */
  cardRadius: string;
  /** Headline weight class for the abstract title bars. */
  headline: string;
  /** Tracking class — affects bar widths/spacing visually. */
  density: string;
};

const CHROME: Record<Personality, Chrome> = {
  soft: {
    frame: "rounded-2xl shadow-md",
    cardRadius: "rounded-xl",
    headline: "h-2",
    density: "gap-1.5",
  },
  clinical: {
    frame: "rounded-md shadow-sm",
    cardRadius: "rounded-sm",
    headline: "h-2",
    density: "gap-1",
  },
  editorial: {
    frame: "rounded-sm shadow-xl",
    cardRadius: "rounded-none border-l-2 border-l-primary",
    headline: "h-2.5",
    density: "gap-2",
  },
  crafted: {
    frame: "rounded-lg shadow-md ring-1 ring-foreground/10",
    cardRadius: "rounded-md",
    headline: "h-2",
    density: "gap-1.5",
  },
  formal: {
    frame: "rounded-sm shadow-md ring-1 ring-foreground/10",
    cardRadius: "rounded-sm",
    headline: "h-2",
    density: "gap-1",
  },
  bold: {
    frame: "rounded-2xl shadow-2xl",
    cardRadius: "rounded-lg",
    headline: "h-3",
    density: "gap-1.5",
  },
  brutalist: {
    frame: "rounded-none shadow-[4px_4px_0_0_var(--foreground)] ring-2 ring-foreground",
    cardRadius: "rounded-none ring-2 ring-foreground border-0",
    headline: "h-2.5",
    density: "gap-1",
  },
  "dark-luxury": {
    frame: "rounded-sm shadow-2xl",
    cardRadius: "rounded-sm",
    headline: "h-2.5",
    density: "gap-2",
  },
};

function NavStrip() {
  return (
    <div className="border-border/60 flex items-center justify-between border-b px-2 py-1">
      <span className="bg-primary/80 h-1.5 w-6 rounded-sm" />
      <div className="flex gap-1">
        <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
        <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
        <span className="bg-foreground/40 h-1 w-3 rounded-sm" />
      </div>
    </div>
  );
}

function CenteredHero({ chrome }: { chrome: Chrome }) {
  return (
    <>
      <NavStrip />
      <div className={cn("bg-secondary/60 flex flex-col items-center justify-center px-3 py-3", chrome.density)}>
        <span className="bg-primary/80 inline-block h-1 w-5 rounded-full" />
        <div className={cn("bg-foreground/85 mt-1 w-[70%] rounded-sm", chrome.headline)} />
        <div className={cn("bg-foreground/85 w-[55%] rounded-sm", chrome.headline)} />
        <div className="bg-foreground/40 mt-1 h-1 w-[80%] rounded-sm" />
        <div className="mt-1 flex gap-1">
          <span className="bg-primary inline-block h-2 w-6 rounded-sm" />
          <span className="border-foreground/40 inline-block h-2 w-5 rounded-sm border" />
        </div>
      </div>
    </>
  );
}

function SplitHero({ chrome }: { chrome: Chrome }) {
  return (
    <>
      <NavStrip />
      <div className="bg-accent/30 grid grid-cols-[1.2fr_1fr] gap-1.5 px-2 py-2">
        <div className="space-y-1">
          <span className="bg-primary/80 inline-block h-1 w-6 rounded-full" />
          <div className={cn("bg-foreground/85 mt-1 w-[90%] rounded-sm", chrome.headline)} />
          <div className={cn("bg-foreground/85 w-[60%] rounded-sm", chrome.headline)} />
          <div className="bg-foreground/40 mt-1 h-1 w-[80%] rounded-sm" />
          <div className="bg-foreground/40 h-1 w-[70%] rounded-sm" />
          <div className="mt-1 flex gap-1">
            <span className="bg-primary inline-block h-2 w-6 rounded-sm" />
            <span className="border-foreground/40 inline-block h-2 w-5 rounded-sm border" />
          </div>
        </div>
        <div className={cn("bg-card flex flex-col justify-around gap-1 border p-1", chrome.cardRadius)}>
          <span className="bg-primary/40 h-1 w-[60%] rounded-sm" />
          <span className="bg-foreground/30 h-1 w-[80%] rounded-sm" />
          <span className="bg-foreground/30 h-1 w-[50%] rounded-sm" />
          <span className="bg-foreground/30 h-1 w-[70%] rounded-sm" />
        </div>
      </div>
    </>
  );
}

function FullbleedHero() {
  // Dark wash with bottom-left wordmark — magazine-cover style.
  return (
    <div className="bg-foreground/95 relative flex flex-col justify-end overflow-hidden px-3 pt-6 pb-3">
      {/* Subtle gradient stripe to suggest a photo behind */}
      <div className="bg-primary/30 absolute inset-x-0 top-0 h-[60%] opacity-40 blur-xl" />
      <div className="relative space-y-1">
        <span className="bg-background/30 inline-block h-1 w-6 rounded-full" />
        <div className="bg-background h-2.5 w-[70%] rounded-sm" />
        <div className="bg-background h-2.5 w-[50%] rounded-sm" />
        <div className="bg-background/60 mt-1 h-1 w-[60%] rounded-sm" />
      </div>
    </div>
  );
}

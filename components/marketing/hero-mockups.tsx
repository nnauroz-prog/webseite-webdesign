import { TemplatePreview } from "@/components/dashboard/template-preview";
import { getTemplateMeta, type TemplateKey } from "@/lib/templates";

/**
 * Visual composition for the right side of the Hero — three template
 * preview frames stacked with depth + parallax-style offset. Reuses
 * the dashboard's TemplatePreview so what the customer sees here is
 * literally what they'd ship.
 *
 * Picks templates that span the personality range so the composition
 * looks diverse, not three nearly-identical cards.
 */
const FEATURED: TemplateKey[] = ["pflegedienst", "spa", "agentur"];

export function HeroMockups() {
  const [front, middle, back] = FEATURED.map(getTemplateMeta);

  return (
    <div className="relative mx-auto w-full max-w-[520px] aspect-[5/4]">
      {/* Soft radial backdrop */}
      <div
        aria-hidden="true"
        className="bg-primary/15 absolute -inset-6 -z-10 rounded-[3rem] blur-3xl"
      />

      {/* Back card — top-right, tilted, slightly smaller */}
      <div className="absolute top-0 right-0 w-[72%] -rotate-[5deg] transition-transform duration-500 hover:-rotate-[3deg]">
        <BrowserFrame depth="back">
          <TemplatePreview
            templateKey={back.key}
            hero={back.hero}
            personality={back.personality}
          />
        </BrowserFrame>
      </div>
      {/* Middle card — center-left, tilted opposite */}
      <div className="absolute top-[14%] left-0 w-[70%] rotate-[3deg] transition-transform duration-500 hover:rotate-[2deg]">
        <BrowserFrame depth="middle">
          <TemplatePreview
            templateKey={middle.key}
            hero={middle.hero}
            personality={middle.personality}
          />
        </BrowserFrame>
      </div>
      {/* Front card — bottom-right, straight, biggest shadow */}
      <div className="absolute right-[4%] bottom-0 w-[84%] transition-transform duration-500 hover:-translate-y-1">
        <BrowserFrame depth="front">
          <TemplatePreview
            templateKey={front.key}
            hero={front.hero}
            personality={front.personality}
          />
        </BrowserFrame>
      </div>
    </div>
  );
}

function BrowserFrame({
  children,
  depth,
}: {
  children: React.ReactNode;
  depth: "front" | "middle" | "back";
}) {
  const shadow = {
    front:
      "shadow-[0_30px_60px_-15px_rgb(0_0_0/0.35),0_8px_20px_-4px_rgb(0_0_0/0.18)]",
    middle: "shadow-[0_18px_40px_-12px_rgb(0_0_0/0.25)]",
    back: "shadow-[0_10px_24px_-10px_rgb(0_0_0/0.18)]",
  }[depth];

  return (
    <div
      className={`bg-card relative overflow-hidden rounded-xl ring-1 ring-black/10 ${shadow}`}
    >
      {/* Subtle inset highlight on top edge to suggest glass / depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/0 via-white/40 to-white/0"
      />
      {/* Browser chrome */}
      <div className="bg-secondary/60 flex items-center gap-1.5 border-b border-black/5 px-3 py-2">
        <span className="bg-destructive/55 h-2 w-2 rounded-full" />
        <span className="bg-warning/55 h-2 w-2 rounded-full" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/55" />
        <span className="bg-background/70 ml-2 h-1.5 flex-1 max-w-[60%] rounded-full" />
      </div>
      {children}
    </div>
  );
}

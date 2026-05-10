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
      {/* Back card — top-right, tilted */}
      <div className="absolute top-0 right-0 w-[78%] -rotate-3 transition-transform duration-500 hover:-rotate-2">
        <BrowserFrame>
          <TemplatePreview
            templateKey={back.key}
            hero={back.hero}
            personality={back.personality}
          />
        </BrowserFrame>
      </div>
      {/* Middle card — center-left, tilted opposite */}
      <div className="absolute top-[18%] left-0 w-[72%] rotate-2 transition-transform duration-500 hover:rotate-1">
        <BrowserFrame>
          <TemplatePreview
            templateKey={middle.key}
            hero={middle.hero}
            personality={middle.personality}
          />
        </BrowserFrame>
      </div>
      {/* Front card — bottom-right, straight, biggest shadow */}
      <div className="absolute right-[8%] bottom-0 w-[82%] transition-transform duration-500 hover:-translate-y-1">
        <BrowserFrame variant="strong">
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
  variant,
}: {
  children: React.ReactNode;
  variant?: "strong";
}) {
  return (
    <div
      className={`bg-card overflow-hidden rounded-xl ring-1 ring-black/10 ${
        variant === "strong"
          ? "shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]"
          : "shadow-[0_12px_30px_-12px_rgb(0_0_0/0.2)]"
      }`}
    >
      <div className="bg-secondary/60 flex items-center gap-1 border-b px-2 py-1.5">
        <span className="bg-destructive/60 h-1.5 w-1.5 rounded-full" />
        <span className="bg-warning/60 h-1.5 w-1.5 rounded-full" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
      </div>
      {children}
    </div>
  );
}

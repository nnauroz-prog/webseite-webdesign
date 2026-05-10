import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

import type { TemplateMeta } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

/**
 * Cinematic centered hero — Apple-grade typography + spacing.
 *
 * Without a hero photo: full-bleed gradient surface, eyebrow tag,
 * massive display title (up to 7xl), generous breathing room, two
 * CTAs (primary filled + ghost). Scroll-cue at the bottom.
 *
 * With hero photo: same composition layered over the image with a
 * cinematic dual-gradient overlay (top fades into the page, bottom
 * darkens for legibility) and frosted-glass CTAs.
 */
export function SiteHero({
  website,
  meta,
}: {
  website: WebsiteRow;
  meta: TemplateMeta;
}) {
  const title = website.hero_title?.trim() || website.business_name;
  const subtitle = website.hero_subtitle?.trim() || meta.defaultHeroSubtitle;
  const hasBgImage = Boolean(website.hero_image_url);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        hasBgImage ? "text-white" : "border-b border-border/60",
      )}
    >
      {hasBgImage ? (
        <>
          <Image
            src={website.hero_image_url!}
            alt=""
            fill
            sizes="100vw"
            priority
            className="-z-20 object-cover scale-[1.02]"
            unoptimized
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />
        </>
      ) : (
        <div className="bg-secondary/30 absolute inset-0 -z-10" />
      )}

      <div className="mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col items-center justify-center px-6 py-32 text-center sm:py-40">
        {website.industry ? (
          <span
            className={cn(
              "mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase",
              hasBgImage
                ? "bg-white/10 text-white/95 backdrop-blur-md ring-1 ring-white/20"
                : "bg-primary/10 text-primary ring-1 ring-primary/20",
            )}
          >
            <span
              className={cn(
                "inline-block h-1 w-1 rounded-full",
                hasBgImage ? "bg-white/80" : "bg-primary",
              )}
            />
            {website.industry}
          </span>
        ) : null}

        <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.025em] text-balance sm:text-6xl md:text-7xl">
          {title}
        </h1>

        <p
          className={cn(
            "mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl",
            hasBgImage ? "text-white/85" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#kontakt"
            className={cn(
              "group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              hasBgImage
                ? "bg-white text-foreground shadow-lg hover:shadow-xl"
                : "bg-primary text-primary-foreground shadow-md hover:shadow-lg",
            )}
          >
            {meta.primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          {website.phone ? (
            <a
              href={`tel:${website.phone.replace(/\s+/g, "")}`}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-all duration-200 hover:scale-[1.02]",
                hasBgImage
                  ? "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  : "border-border bg-background hover:bg-secondary",
              )}
            >
              Anrufen
            </a>
          ) : null}
        </div>

        {/* Scroll cue — discreet "there's more below" hint, Apple-style */}
        <div
          className={cn(
            "absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity",
            hasBgImage ? "text-white/60" : "text-muted-foreground/60",
          )}
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

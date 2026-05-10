import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { TemplateMeta } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

/**
 * Fullbleed hero — used by editorial-personality templates (Noir,
 * Pearl, Tisch). Customer's hero image fills the viewport; everything
 * else floats over it. Falls back to a deep gradient when no image is
 * uploaded yet.
 *
 * Different visual signature than SiteHero (centered):
 *   - 100vh on lg+ instead of 80vh
 *   - Headline aligned bottom-left, magazine-cover style
 *   - Wider, looser type
 *   - No scroll-cue (the bleed itself is the cue)
 */
export function SiteHeroFullbleed({
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
        hasBgImage ? "text-white" : "bg-foreground text-background",
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
            className="-z-20 object-cover"
            unoptimized
          />
          {/* Gradient stack: dark at the bottom (so the title reads),
              softer at the top (so the page header doesn't compete). */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
        </>
      ) : (
        <div className="bg-gradient-to-br from-black via-foreground to-foreground/85 absolute inset-0 -z-10" />
      )}

      <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col justify-end px-6 pt-32 pb-20 lg:min-h-screen lg:pb-28">
        {website.industry ? (
          <span
            className={cn(
              "mb-6 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] uppercase",
              "bg-white/10 text-white/95 ring-1 ring-white/20 backdrop-blur-md",
            )}
          >
            <span className="bg-white/80 inline-block h-1 w-1 rounded-full" />
            {website.industry}
          </span>
        ) : null}

        <h1 className="max-w-5xl text-5xl leading-[0.98] text-balance sm:text-7xl md:text-[96px]">
          {title}
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-white/85 sm:text-xl">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#kontakt"
            className="bg-white text-foreground group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
          >
            {meta.primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          {website.phone ? (
            <a
              href={`tel:${website.phone.replace(/\s+/g, "")}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-[15px] font-medium tracking-tight text-white backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:bg-white/20"
            >
              Anrufen
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";

import type { TemplateMeta } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

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
        "border-border/60 relative overflow-hidden border-b",
        hasBgImage && "isolate text-white",
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
          {/* Dark gradient overlay so text always reads, regardless of
              the photo. Stronger at the bottom where the CTAs sit. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/40 to-black/65" />
        </>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {website.industry && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
                hasBgImage
                  ? "bg-white/15 text-white backdrop-blur-sm"
                  : "bg-primary/10 text-primary",
              )}
            >
              {website.industry}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p
            className={cn(
              "mx-auto mt-6 max-w-2xl text-lg text-pretty sm:text-xl",
              hasBgImage ? "text-white/90" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#kontakt"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition"
            >
              {meta.primaryCtaLabel}
            </a>
            {website.phone && (
              <a
                href={`tel:${website.phone.replace(/\s+/g, "")}`}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition",
                  hasBgImage
                    ? "border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    : "bg-background hover:bg-secondary",
                )}
              >
                Anrufen
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

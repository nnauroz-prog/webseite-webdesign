import Image from "next/image";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import type { TemplateMeta } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

/**
 * Editorial split hero — left column is the headline + lede, right is
 * a frosted info card with hours/phone/address. Apple-grade
 * typography, generous spacing, and a hero image background that
 * recedes via overlay so both halves read.
 */
export function SiteHeroSplit({
  website,
  meta,
}: {
  website: WebsiteRow;
  meta: TemplateMeta;
}) {
  const title = website.hero_title?.trim() || website.business_name;
  const subtitle = website.hero_subtitle?.trim() || meta.defaultHeroSubtitle;
  const phone = website.phone?.trim();
  const address = website.address?.trim();
  const hours = website.opening_hours?.text?.trim();
  const hasBgImage = Boolean(website.hero_image_url);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        hasBgImage ? "text-white" : "bg-accent/30 border-b border-border/60",
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
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/55 via-black/45 to-black/70" />
        </>
      ) : null}

      <div className="mx-auto grid min-h-[70vh] w-full max-w-6xl items-center gap-14 px-6 py-28 sm:py-32 lg:grid-cols-[1.15fr_1fr]">
        <div>
          {website.industry ? (
            <span
              className={cn(
                "mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase",
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
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.025em] text-balance sm:text-6xl md:text-[64px]">
            {title}
          </h1>
          <p
            className={cn(
              "mt-7 max-w-xl text-lg leading-relaxed text-pretty sm:text-xl",
              hasBgImage ? "text-white/85" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#kontakt"
              style={{ borderRadius: "var(--site-button-radius)" }}
              className={cn(
                "group inline-flex h-12 items-center justify-center px-7 text-[15px] font-medium tracking-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                hasBgImage
                  ? "bg-white text-foreground shadow-lg hover:shadow-xl"
                  : "bg-primary text-primary-foreground shadow-md hover:shadow-lg",
              )}
            >
              {meta.primaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                style={{ borderRadius: "var(--site-button-radius)" }}
                className={cn(
                  "inline-flex h-12 items-center justify-center border px-7 text-[15px] font-medium tracking-tight transition-all duration-200 hover:scale-[1.02]",
                  hasBgImage
                    ? "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                    : "border-border bg-background hover:bg-secondary",
                )}
              >
                Anrufen
              </a>
            ) : null}
          </div>
        </div>

        <aside
          className={cn(
            "rounded-3xl border p-8 shadow-xl backdrop-blur-md",
            hasBgImage
              ? "border-white/15 bg-white/[0.07] text-white"
              : "border-border bg-card text-foreground",
          )}
        >
          <p
            className={cn(
              "text-[11px] font-medium tracking-[0.2em] uppercase",
              hasBgImage ? "text-white/60" : "text-muted-foreground",
            )}
          >
            Auf einen Blick
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Sprechzeiten &amp; Kontakt
          </h2>
          <ul className="mt-7 space-y-5 text-sm">
            {hours ? (
              <SidebarRow
                icon={<Clock className="h-4 w-4" />}
                title="Öffnungszeiten"
                onImage={hasBgImage}
              >
                <span className="whitespace-pre-line">{hours}</span>
              </SidebarRow>
            ) : null}
            {phone ? (
              <SidebarRow
                icon={<Phone className="h-4 w-4" />}
                title="Telefon"
                onImage={hasBgImage}
              >
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:underline"
                >
                  {phone}
                </a>
              </SidebarRow>
            ) : null}
            {address ? (
              <SidebarRow
                icon={<MapPin className="h-4 w-4" />}
                title="Adresse"
                onImage={hasBgImage}
              >
                <span className="whitespace-pre-line">{address}</span>
              </SidebarRow>
            ) : null}
            {!hours && !phone && !address ? (
              <li
                className={cn(
                  "text-sm",
                  hasBgImage ? "text-white/70" : "text-muted-foreground",
                )}
              >
                Kontaktdaten folgen.
              </li>
            ) : null}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function SidebarRow({
  icon,
  title,
  onImage,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onImage: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <span
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          onImage ? "bg-white/10 text-white" : "bg-primary/10 text-primary",
        )}
      >
        {icon}
      </span>
      <div>
        <div
          className={cn(
            "text-[10px] font-medium tracking-[0.2em] uppercase",
            onImage ? "text-white/60" : "text-muted-foreground",
          )}
        >
          {title}
        </div>
        <div className="mt-1 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}

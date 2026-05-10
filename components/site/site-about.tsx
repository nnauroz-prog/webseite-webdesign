import Image from "next/image";

import type { WebsiteRow } from "@/types/website";

/**
 * About — editorial side-by-side layout when an image is present,
 * elegant centered prose otherwise. Apple-grade typography with
 * eyebrow text and a wide reading column.
 */
export function SiteAbout({ website }: { website: WebsiteRow }) {
  const text = website.about_text?.trim();
  if (!text) return null;

  const paragraphs = text.split(/\n{2,}/);
  const hasImage = Boolean(website.about_image_url);

  if (hasImage) {
    return (
      <section
        id="ueber-uns"
        className="border-border/60 border-b"
        style={{ paddingTop: "var(--site-section-py)", paddingBottom: "var(--site-section-py)" }}
      >
        <div
          className="mx-auto grid w-full gap-16 px-6 lg:grid-cols-[1fr_1fr] lg:items-center"
          style={{ maxWidth: "var(--site-container-max)" }}
        >
          <div className="order-2 lg:order-1">
            <p
              className="text-muted-foreground text-[11px] font-medium uppercase"
              style={{ letterSpacing: "var(--site-eyebrow-tracking)" }}
            >
              Über uns
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
              {website.business_name}
            </h2>
            <div className="text-foreground/80 mt-8 space-y-5 text-[17px] leading-[1.7] text-pretty">
              {paragraphs.map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden ring-1 ring-border/50"
              style={{
                borderRadius: "var(--site-image-radius)",
                boxShadow: "var(--site-card-shadow)",
              }}
            >
              <Image
                src={website.about_image_url!}
                alt={`${website.business_name} — Über uns`}
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No image — centered editorial prose
  return (
    <section
      id="ueber-uns"
      className="border-border/60 bg-secondary/20 border-b"
      style={{ paddingTop: "var(--site-section-py)", paddingBottom: "var(--site-section-py)" }}
    >
      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <p
          className="text-muted-foreground text-[11px] font-medium uppercase"
          style={{ letterSpacing: "var(--site-eyebrow-tracking)" }}
        >
          Über uns
        </p>
        <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {website.business_name}
        </h2>
        <div className="text-foreground/80 mt-10 space-y-5 text-left text-[17px] leading-[1.7] text-pretty">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

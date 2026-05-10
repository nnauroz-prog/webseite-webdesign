import Image from "next/image";

import type { WebsiteRow } from "@/types/website";

export function SiteAbout({ website }: { website: WebsiteRow }) {
  const text = website.about_text?.trim();
  if (!text) return null;

  const paragraphs = text.split(/\n{2,}/);
  const hasImage = Boolean(website.about_image_url);

  return (
    <section
      id="ueber-uns"
      className="bg-muted/30 border-border/60 border-b py-20 sm:py-24"
    >
      <div
        className={
          hasImage
            ? "mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:items-center"
            : "mx-auto w-full max-w-3xl px-6"
        }
      >
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Über uns
          </h2>
          <div className="text-muted-foreground mt-6 space-y-4 text-base leading-relaxed">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        {hasImage ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-md sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={website.about_image_url!}
              alt={`${website.business_name} — Über uns`}
              fill
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

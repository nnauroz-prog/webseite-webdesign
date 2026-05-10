import Image from "next/image";

import type { ImageTextSplitBlockData } from "@/types/website";
import { cn } from "@/lib/utils";

/**
 * Image-text split — image on one side, headline + body on the other.
 * Apple-product-page idiom. The image side flips left/right per
 * `image_side` so customers can alternate when stacking blocks.
 */
export function BlockImageTextSplit({
  data,
}: {
  data: ImageTextSplitBlockData;
}) {
  if (!data?.body?.trim() || !data?.image_url) return null;
  const paragraphs = data.body.split(/\n{2,}/);
  const imageRight = data.image_side !== "right" ? false : true;

  return (
    <section className="border-border/60 border-b py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl ring-1 ring-border/50",
            imageRight ? "lg:order-2" : "lg:order-1",
          )}
        >
          <Image
            src={data.image_url}
            alt={data.title ?? ""}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className={imageRight ? "lg:order-1" : "lg:order-2"}>
          {data.title?.trim() ? (
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              {data.title}
            </h2>
          ) : null}
          <div className="text-foreground/85 mt-7 space-y-5 text-[17px] leading-[1.7] text-pretty">
            {paragraphs.map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

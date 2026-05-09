import Image from "next/image";

import type { GalleryImageRow } from "@/types/website";

export function SiteGallery({ images }: { images: GalleryImageRow[] }) {
  if (images.length === 0) return null;

  return (
    <section
      id="galerie"
      className="bg-muted/30 border-border/60 border-b py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Galerie
          </h2>
          <p className="text-muted-foreground mt-3">
            Eindrücke aus unserer Arbeit und unseren Räumen.
          </p>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <li
              key={img.id}
              className="bg-muted aspect-[4/3] overflow-hidden rounded-xl border"
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? ""}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

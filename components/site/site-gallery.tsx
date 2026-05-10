import { SiteGalleryGrid } from "@/components/site/site-gallery-grid";
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
        <SiteGalleryGrid images={images} />
      </div>
    </section>
  );
}

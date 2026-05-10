import { SiteGalleryGrid } from "@/components/site/site-gallery-grid";
import type { GalleryImageRow } from "@/types/website";

export function SiteGallery({ images }: { images: GalleryImageRow[] }) {
  if (images.length === 0) return null;

  return (
    <section
      id="galerie"
      className="bg-secondary/30 border-border/60 border-b"
      style={{ paddingTop: "var(--site-section-py)", paddingBottom: "var(--site-section-py)" }}
    >
      <div
        className="mx-auto w-full px-6"
        style={{ maxWidth: "var(--site-container-max)" }}
      >
        <header className="mx-auto max-w-2xl text-center">
          <p
            className="text-muted-foreground text-[11px] font-medium uppercase"
            style={{ letterSpacing: "var(--site-eyebrow-tracking)" }}
          >
            Galerie
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Eindrücke
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-pretty">
            Aus unserer Arbeit und unseren Räumen.
          </p>
        </header>
        <SiteGalleryGrid images={images} />
      </div>
    </section>
  );
}

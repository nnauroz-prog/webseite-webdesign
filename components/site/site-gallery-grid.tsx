"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GalleryImageRow } from "@/types/website";

/**
 * Click-to-zoom lightbox grid for the public site gallery.
 *
 * Opens a fullscreen modal with previous/next navigation, ESC to
 * close, arrow keys to step through, and a backdrop click to dismiss.
 * Body scroll is locked while the lightbox is open.
 */
export function SiteGalleryGrid({ images }: { images: GalleryImageRow[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const current = openIndex !== null ? images[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i + 1) % images.length,
    );
  }, [images.length]);
  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + images.length) % images.length,
    );
  }, [images.length]);

  // Keyboard nav.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, next, prev]);

  // Lock scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="bg-muted group block aspect-[4/3] w-full overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
              aria-label={
                img.alt_text
                  ? `${img.alt_text} — vergrößern`
                  : "Bild vergrößern"
              }
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? ""}
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {isOpen && current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie-Vergrößerung"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            aria-label="Schließen"
            onClick={close}
            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Vorheriges Bild"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className={cn(
                "absolute top-1/2 left-2 -translate-y-1/2",
                "inline-flex h-12 w-12 items-center justify-center rounded-full",
                "bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6",
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}

          {/* Image */}
          <div
            className="relative max-h-[90vh] w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.image_url}
              alt={current.alt_text ?? ""}
              width={1600}
              height={1200}
              className="mx-auto max-h-[90vh] w-auto rounded-md object-contain"
              priority
              unoptimized
            />
            {(current.alt_text || images.length > 1) && (
              <div className="text-white/80 mt-3 flex items-center justify-between text-xs">
                <span className="line-clamp-1">{current.alt_text}</span>
                {images.length > 1 ? (
                  <span>
                    {openIndex! + 1} / {images.length}
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {/* Next */}
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Nächstes Bild"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className={cn(
                "absolute top-1/2 right-2 -translate-y-1/2",
                "inline-flex h-12 w-12 items-center justify-center rounded-full",
                "bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6",
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

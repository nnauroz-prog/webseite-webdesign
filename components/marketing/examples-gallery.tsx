import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BRANCHEN } from "@/lib/branchen-data";

/**
 * Beispiel-Galerie. Zeigt die existierenden Branchen-Mockups
 * als asymmetrisches Grid — Webador-inspiriert in der Idee
 * ("So sehen deine Seiten aus"), aber im Editorial-Stil:
 * keine bunten Sterne-Badges, keine fake Kategorie-Filter,
 * stattdessen ruhige Karten mit Branchenname als Overlay.
 *
 * Klick auf eine Karte → /branchen/[slug] zur Detailseite.
 */
export function ExamplesGallery() {
  return (
    <section
      id="beispiele"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Beispiele
            </p>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              So sehen Ihre
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Seiten bei uns aus.
              </span>
            </h2>
          </div>
          <p className="text-foreground/75 max-w-md text-pretty text-lg leading-relaxed">
            Zehn Branchen — zehn Layouts, die zum jeweiligen Alltag
            passen. Tippen Sie auf eine Karte für mehr Details.
          </p>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {BRANCHEN.map((b, i) => (
            <li
              key={b.slug}
              className={
                i === 0 || i === 5
                  ? "sm:col-span-2 lg:col-span-2"
                  : ""
              }
            >
              <Link
                href={`/branchen/${b.slug}`}
                className="group block transition-transform duration-500 hover:-translate-y-1"
                aria-label={`${b.label} — Beispiel ansehen`}
              >
                <div
                  className={`bg-secondary/40 relative w-full overflow-hidden rounded-2xl ring-1 ring-black/5 transition-shadow duration-500 group-hover:shadow-[0_32px_64px_-20px_rgb(0_0_0/0.32)] ${
                    i === 0 || i === 5
                      ? "aspect-[16/10]"
                      : "aspect-[4/3]"
                  }`}
                >
                  {b.image ? (
                    <Image
                      src={b.image.src}
                      alt={b.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="serif text-foreground/20 flex h-full w-full items-center justify-center text-7xl">
                      {b.label[0]}
                    </div>
                  )}
                  {/* Subtiles dunkles Overlay on hover für besseren Kontrast */}
                  <div
                    aria-hidden="true"
                    className="from-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Branche-Label als Overlay-Pille on hover */}
                  <div className="absolute bottom-3 left-3 right-3 flex translate-y-1 items-center justify-between gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="bg-background/95 text-foreground inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium tracking-tight backdrop-blur-sm">
                      Beispiel ansehen
                    </span>
                    <span className="bg-background/95 text-foreground inline-flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-foreground group-hover:text-foreground text-lg font-medium tracking-[-0.01em] transition-colors">
                    {b.label}
                  </h3>
                  <span className="text-muted-foreground group-hover:text-foreground hidden items-center gap-1 text-sm font-medium transition-colors sm:inline-flex">
                    Ansehen
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <Link
            href="/branchen"
            className="text-foreground inline-flex items-center gap-2 text-[15px] font-medium underline-offset-4 hover:underline"
          >
            Alle Branchen im Detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

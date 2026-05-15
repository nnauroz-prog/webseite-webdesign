import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BRANCHEN } from "@/lib/branchen-data";
import { DoubleWave, DrawnArrow } from "@/components/marketing/ornaments";

/**
 * Beispiel-Galerie als asymmetrische Magazin-Spread. Statt 4-Col-
 * Karten-Grid: jede Branche als eigene Zeile, abwechselnd
 * Bild-links/Text-rechts und umgekehrt, mit großen Serif-Nummern
 * als Editorial-Anker. Pull-Quote-Caption pro Branche (shortBody)
 * statt nur Label.
 *
 * Klick auf eine Zeile → /branchen/[slug] zur Detailseite.
 */
export function ExamplesGallery() {
  // Erste sechs Branchen als „Aufmacher" mit alternierender Magazin-
  // Aufteilung, die restlichen vier als kompakte Folge-Liste am
  // Schluss. So bleibt der Block lesbar statt zu monoton.
  const featured = BRANCHEN.slice(0, 6);
  const rest = BRANCHEN.slice(6);

  return (
    <section
      id="beispiele"
      className="border-border/40 border-t scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        {/* Header — bewusst ohne Eyebrow-Caps. Bricht den gleichen
            Beat, den die anderen Sektionen oben haben. */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              So sehen Ihre
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Seiten bei uns aus.
              </span>
            </h2>
          </div>
          <p className="text-foreground/75 max-w-md text-pretty text-lg leading-relaxed">
            Zehn Branchen, zehn Layouts. Wir wiederholen uns nicht —
            auch dann nicht, wenn keiner zuguckt.
          </p>
        </div>

        {/* Sechs Aufmacher als alternierende Magazin-Zeilen */}
        <div className="mt-20 space-y-20 sm:mt-24 sm:space-y-24 lg:space-y-32">
          {featured.map((b, i) => {
            const flip = i % 2 === 1; // jede zweite Zeile gespiegelt
            return (
              <article
                key={b.slug}
                className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <Link
                  href={`/branchen/${b.slug}`}
                  aria-label={`${b.label} — Beispiel ansehen`}
                  data-cursor-label="Beispiel ansehen →"
                  className={
                    flip
                      ? "group relative block lg:order-2"
                      : "group relative block"
                  }
                >
                  <div
                    className={
                      // Aspect ratio variiert leicht pro Position →
                      // weniger uniform, mehr Magazin-Rhythmus.
                      i === 0
                        ? "bg-secondary/40 ring-foreground/5 relative aspect-[4/5] w-full overflow-hidden rounded-3xl ring-1 sm:aspect-[5/6]"
                        : i === 3
                          ? "bg-secondary/40 ring-foreground/5 relative aspect-[16/10] w-full overflow-hidden rounded-3xl ring-1"
                          : "bg-secondary/40 ring-foreground/5 relative aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1"
                    }
                  >
                    {b.image ? (
                      <Image
                        src={b.image.src}
                        alt={b.image.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="serif text-foreground/20 flex h-full w-full items-center justify-center text-8xl">
                        {b.label[0]}
                      </div>
                    )}
                    {/* Subtile Hover-Vignette */}
                    <div
                      aria-hidden="true"
                      className="from-foreground/30 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                </Link>

                <div
                  className={
                    flip ? "lg:order-1 lg:pr-8" : "lg:pl-8"
                  }
                >
                  {/* Großes Serif-Numeral als Editorial-Anker, kein
                      doppeltes „Branche · X"-Caps-Label mehr. */}
                  <span className="serif text-ink-petrol/55 block text-[3.5rem] font-normal leading-none tracking-[-0.04em] sm:text-[4.5rem] lg:text-[5rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Headline ohne wiederkehrendes „Hand-gebaut."-
                      Addendum — das wurde sechsmal hintereinander zu
                      AI-Repetition. */}
                  <h3 className="serif text-foreground mt-5 text-balance text-3xl font-normal leading-[1.15] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                    {b.label}.
                  </h3>
                  <p className="text-foreground/80 mt-6 max-w-lg text-pretty text-base leading-relaxed sm:text-lg">
                    {b.shortBody}
                  </p>
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="text-foreground group/cta mt-7 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-4 hover:underline"
                  >
                    Beispiel ansehen
                    <DrawnArrow className="h-3 w-5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Hand-Trenner vor der Rest-Liste */}
        <div className="text-muted-foreground/40 mx-auto mt-24 max-w-md sm:mt-32">
          <DoubleWave className="w-full" />
        </div>

        {/* Restliche vier Branchen kompakt als Footer-Liste */}
        <div className="mt-16 sm:mt-20">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Weitere Branchen, die wir bauen
          </p>
          <ul className="border-border/60 mt-8 grid divide-y border-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {rest.map((b, i) => (
              <li key={b.slug}>
                <Link
                  href={`/branchen/${b.slug}`}
                  data-cursor-label="Mehr →"
                  className="group flex h-full flex-col justify-between p-6 transition-colors hover:bg-secondary/40 sm:p-7"
                >
                  <div>
                    <span className="serif text-ink-petrol/50 text-[2rem] font-normal leading-none tracking-[-0.04em]">
                      {String(featured.length + i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-foreground mt-4 text-xl font-medium tracking-[-0.015em]">
                      {b.label}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-pretty text-[13.5px] leading-relaxed">
                      {b.shortBody.split(".")[0]}.
                    </p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium tracking-tight transition-colors">
                    Ansehen
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

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

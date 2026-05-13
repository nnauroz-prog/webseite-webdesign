import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { BRANCHEN } from "@/lib/branchen-data";

export const metadata: Metadata = {
  title: "Branchen — passende Layouts für Ihren Betrieb | Sitalo",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien und Fitnessstudios — pro Branche eigene Layouts.",
  alternates: { canonical: "/branchen" },
};

export default function BranchenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <Sections />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <>
      <section className="border-border/40 border-b">
        <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32">
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                Branchen
              </p>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
                Layouts, die zu
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  Ihrem Alltag passen.
                </span>
              </h1>
            </div>
            <p className="text-foreground/80 max-w-md text-pretty text-lg leading-relaxed sm:text-xl">
              Eine Pflegedienst-Seite muss anders aussehen als ein Café —
              und beide anders als eine Kanzlei. Pro Branche eine eigene
              Detailseite mit echten Beispielen und passenden Bausteinen.
            </p>
          </div>
        </div>
      </section>
      <section className="border-border/40 overflow-hidden border-b py-8 sm:py-10">
        <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="mx-auto flex w-max gap-3 sm:gap-4">
            {BRANCHEN.map((b) => (
              <li key={b.slug} className="shrink-0">
                <Link
                  href={`/branchen/${b.slug}`}
                  className="group block w-[200px] sm:w-[260px]"
                >
                  {b.image ? (
                    <div className="bg-secondary/40 relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-black/5 transition-shadow group-hover:shadow-[0_20px_40px_-16px_rgb(0_0_0/0.25)]">
                      <Image
                        src={b.image.src}
                        alt={b.image.alt}
                        fill
                        sizes="260px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="bg-secondary/50 flex aspect-[16/10] w-full items-center justify-center rounded-xl ring-1 ring-black/5">
                      <span className="text-muted-foreground/40 serif text-3xl">
                        {b.label[0]}
                      </span>
                    </div>
                  )}
                  <p className="text-foreground/85 group-hover:text-foreground mt-3 text-sm font-medium tracking-tight transition-colors">
                    {b.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Sections() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <ol className="divide-border/60 divide-y">
          {BRANCHEN.map((b, i) => (
            <li
              key={b.slug}
              id={b.slug}
              className="scroll-mt-20 grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20"
            >
              <div className={i % 2 === 0 ? "lg:order-1" : "lg:order-2"}>
                {b.image ? (
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="group block"
                    aria-label={`${b.label} — Details ansehen`}
                  >
                    <div className="bg-secondary/40 relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-[0_24px_48px_-16px_rgb(0_0_0/0.18)] ring-1 ring-black/5">
                      <Image
                        src={b.image.src}
                        alt={b.image.alt}
                        fill
                        sizes="(min-width: 1024px) 720px, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="bg-secondary/30 flex aspect-[16/10] w-full items-center justify-center rounded-2xl">
                    <span className="serif text-foreground/20 text-[8rem] font-normal leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
              <div
                className={
                  i % 2 === 0
                    ? "flex flex-col justify-center lg:order-2"
                    : "flex flex-col justify-center lg:order-1"
                }
              >
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                  Branche
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="hover:underline underline-offset-[6px] decoration-foreground/30"
                  >
                    {b.label}
                  </Link>
                </h2>
                <p className="text-foreground/80 mt-6 max-w-xl text-pretty text-lg leading-relaxed">
                  {b.shortBody}
                </p>
                <ul className="divide-border/60 mt-8 divide-y">
                  {b.bullets.map((item) => (
                    <li
                      key={item}
                      className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px] leading-relaxed"
                    >
                      <span className="text-muted-foreground/70 font-mono text-xs">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/branchen/${b.slug}`}
                    className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
                  >
                    Mehr zu {b.label}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href={`/anfrage?branche=${b.inquirySlug}`}
                    className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-4 hover:underline"
                  >
                    Direkt anfragen
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-accent/30 border-border/40 border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="text-center">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl lg:text-5xl">
            Ihre Branche{" "}
            <span className="serif-italic text-muted-foreground">
              nicht dabei?
            </span>{" "}
            Fragen Sie mich trotzdem.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
            >
              Anfrage starten
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

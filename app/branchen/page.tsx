import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { BRANCHEN } from "@/lib/branchen-data";

export const metadata: Metadata = {
  title: "Branchen — Websites für Ihren Betrieb",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien und Fitnessstudios — jede Seite individuell gebaut.",
  alternates: { canonical: "/branchen" },
};

export default function BranchenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Branchen" />
      <main id="main" tabIndex={-1} className="flex-1">
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
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>
      <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-8 sm:px-6 sm:pt-20 sm:pb-10">
        <EditorialEyebrow>10 Branchen · jede Seite neu gebaut</EditorialEyebrow>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Websites, die zu Ihrem{" "}
          <span className="serif-italic text-muted-foreground font-normal">Alltag passen.</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
          Eine Praxis braucht anderes als ein Café. Pro Branche zeigen wir, worauf es ankommt.
        </p>
      </div>
    </section>
  );
}

/** Zehn Branchen als Karten. Details stehen auf /branchen/[slug]. */
function Sections() {
  return (
    <section className="border-border/40 border-t">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-3 gap-y-7 px-5 py-10 sm:gap-x-5 sm:gap-y-10 sm:px-6 sm:py-16 lg:grid-cols-3">
        {BRANCHEN.map((b) => (
          <li key={b.slug} id={b.slug} className="scroll-mt-24">
            <Link href={`/branchen/${b.slug}`} className="group block">
              <div className="bg-secondary/40 relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-black/5">
                {b.image ? (
                  <Image
                    src={b.image.src}
                    alt={b.image.alt}
                    fill
                    sizes="(min-width: 1024px) 360px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <h2 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight sm:mt-4 sm:text-xl">{b.label}</h2>
              <p className="text-muted-foreground mt-1.5 hidden text-[14.5px] leading-relaxed sm:block">
                {b.shortBody.split(". ")[0].replace(/\.$/, "")}.
              </p>
              <span className="text-foreground mt-3 hidden items-center sm:inline-flex gap-1.5 text-[14px] font-medium underline-offset-4 group-hover:underline">
                Mehr erfahren
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-dark pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
        <h2 className="serif text-balance text-3xl leading-tight sm:text-5xl">
          Ihre Branche nicht dabei?{" "}
          <span className="serif-italic text-background/70">Fragen Sie trotzdem.</span>
        </h2>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          Website anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

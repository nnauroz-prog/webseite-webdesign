import { ArrowUpRight } from "lucide-react";

import type { ServiceRow } from "@/types/website";

/**
 * Services — editorial 3-column grid with hairline cards, generous
 * whitespace and a discreet hover-lift. Each card has a numerical
 * eyebrow (01, 02, …) for visual rhythm, Apple-product-grid style.
 */
export function SiteServices({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) return null;

  return (
    <section
      id="leistungen"
      className="border-border/60 border-b py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
            Was wir tun
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            Unsere Leistungen
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-pretty">
            Klar, sauber, persönlich. Hier, was wir Ihnen anbieten — und wofür
            Sie uns rufen können.
          </p>
        </header>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li
              key={s.id}
              className="group bg-card relative flex flex-col p-8 transition-colors hover:bg-secondary/50 sm:p-10"
            >
              <span className="text-muted-foreground/70 text-[10px] font-mono tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              {s.description ? (
                <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed text-pretty whitespace-pre-line">
                  {s.description}
                </p>
              ) : null}
              <ArrowUpRight className="text-muted-foreground/0 group-hover:text-primary mt-6 ml-auto h-5 w-5 transition-all" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

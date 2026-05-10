import { Check } from "lucide-react";

import type { PricingTableBlockData } from "@/types/website";
import { cn } from "@/lib/utils";

/**
 * Pricing table — up to 4 columns, each with name, price + optional
 * unit, description, feature list, and a "Beliebt" highlight ring.
 */
export function BlockPricingTable({ data }: { data: PricingTableBlockData }) {
  if (!data?.items?.length) return null;
  const cols = Math.min(data.items.length, 4);
  return (
    <section className="border-border/60 border-b py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        {data.title?.trim() ? (
          <header className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Pakete
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              {data.title}
            </h2>
          </header>
        ) : null}

        <div
          className="mx-auto grid gap-6"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {data.items.map((p, i) => (
            <article
              key={i}
              className={cn(
                "relative flex flex-col rounded-3xl border p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl",
                p.highlight
                  ? "ring-primary border-primary bg-card ring-2"
                  : "border-border bg-card",
              )}
            >
              {p.highlight ? (
                <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
                  Beliebt
                </span>
              ) : null}
              <h3 className="text-xl font-semibold tracking-tight">{p.name}</h3>
              {p.description?.trim() ? (
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {p.description}
                </p>
              ) : null}
              <div className="mt-5 flex items-baseline gap-1.5">
                {p.unit?.trim() ? (
                  <span className="text-muted-foreground text-sm">
                    {p.unit}
                  </span>
                ) : null}
                <span className="text-foreground text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                  {p.price}
                </span>
              </div>
              {p.features?.length ? (
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-pretty">{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

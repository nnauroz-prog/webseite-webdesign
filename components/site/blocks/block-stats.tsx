import type { StatsBlockData } from "@/types/website";

/**
 * Stats — large numbers in a clean horizontal row, Apple "Designed
 * for everyone" stat-line vibe. Up to 8 items.
 */
export function BlockStats({ data }: { data: StatsBlockData }) {
  if (!data?.items?.length) return null;
  const cols = Math.min(data.items.length, 4);
  return (
    <section className="border-border/60 bg-secondary/30 border-b py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        {data.title?.trim() ? (
          <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {data.title}
          </h2>
        ) : null}
        <dl
          className="grid gap-10 text-center sm:gap-12"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {data.items.map((it, i) => (
            <div key={i} className="space-y-2">
              <dt className="text-foreground text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                {it.value}
              </dt>
              <dd className="text-muted-foreground text-sm tracking-tight text-pretty">
                {it.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

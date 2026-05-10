import type { StepsBlockData } from "@/types/website";

/**
 * Numbered process steps — connected by a hairline rail on lg+ for
 * the "1 → 2 → 3" visual rhythm. Up to 8 items.
 */
export function BlockSteps({ data }: { data: StepsBlockData }) {
  if (!data?.items?.length) return null;
  return (
    <section className="border-border/60 border-b py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        {data.title?.trim() ? (
          <header className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              So funktioniert&apos;s
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              {data.title}
            </h2>
          </header>
        ) : null}

        <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((step, i) => (
            <li
              key={i}
              className="bg-card border-border relative rounded-2xl border p-7 shadow-sm"
            >
              <span className="bg-primary text-primary-foreground absolute -top-4 left-7 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-2.5 text-[15px] leading-relaxed text-pretty whitespace-pre-line">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

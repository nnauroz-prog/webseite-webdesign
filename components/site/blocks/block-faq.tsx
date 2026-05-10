import type { FaqBlockData } from "@/types/website";

export function BlockFaq({ data }: { data: FaqBlockData }) {
  if (!data?.items?.length) return null;
  return (
    <section className="border-border/60 border-b py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        {data.title ? (
          <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        ) : (
          <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Häufige Fragen
          </h2>
        )}
        <div className="divide-border/60 divide-y rounded-2xl border">
          {data.items.map((item, i) => (
            <details
              key={i}
              className="group [&[open]]:bg-muted/30"
            >
              <summary className="hover:bg-muted/40 flex cursor-pointer items-start justify-between gap-4 px-5 py-4 text-base font-medium leading-snug transition select-none [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="text-muted-foreground mt-1 transition group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <div className="text-muted-foreground px-5 pt-1 pb-5 text-sm leading-relaxed whitespace-pre-line">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

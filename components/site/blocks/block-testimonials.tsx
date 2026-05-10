import type { TestimonialsBlockData } from "@/types/website";

export function BlockTestimonials({ data }: { data: TestimonialsBlockData }) {
  if (!data?.items?.length) return null;
  return (
    <section className="bg-muted/30 border-border/60 border-b py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        {data.title ? (
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
        ) : (
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
            Was unsere Kund:innen sagen
          </h2>
        )}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((t, i) => (
            <li
              key={i}
              className="bg-card relative rounded-2xl border p-6 shadow-sm"
            >
              <span
                aria-hidden
                className="text-primary/30 absolute top-3 left-4 font-serif text-5xl leading-none"
              >
                &ldquo;
              </span>
              <blockquote className="text-foreground/90 relative mt-4 text-sm leading-relaxed whitespace-pre-line">
                {t.quote}
              </blockquote>
              <footer className="text-muted-foreground mt-5 text-sm">
                <span className="text-foreground font-medium">{t.name}</span>
                {t.role ? <span> · {t.role}</span> : null}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

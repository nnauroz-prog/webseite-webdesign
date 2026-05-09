import type { WebsiteRow } from "@/types/website";

export function SiteHero({ website }: { website: WebsiteRow }) {
  const title = website.hero_title?.trim() || website.business_name;
  const subtitle = website.hero_subtitle?.trim();

  return (
    <section className="border-border/60 relative overflow-hidden border-b">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {website.industry && (
            <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase">
              {website.industry}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg text-pretty sm:text-xl">
              {subtitle}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#kontakt"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition"
            >
              Kontakt aufnehmen
            </a>
            {website.phone && (
              <a
                href={`tel:${website.phone.replace(/\s+/g, "")}`}
                className="bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
              >
                Anrufen
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

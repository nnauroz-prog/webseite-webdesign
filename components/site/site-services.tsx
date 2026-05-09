import type { ServiceRow } from "@/types/website";

export function SiteServices({ services }: { services: ServiceRow[] }) {
  if (services.length === 0) return null;

  return (
    <section
      id="leistungen"
      className="border-border/60 border-b py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Unsere Leistungen
          </h2>
          <p className="text-muted-foreground mt-3">
            Was wir für Sie tun können — kompakt im Überblick.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="bg-card rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              {s.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {s.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

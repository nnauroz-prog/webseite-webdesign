import type { MapBlockData } from "@/types/website";

/**
 * Map block — Google Maps "place" embed driven by a free-form address.
 * Uses the public embed URL that doesn't require an API key.
 */
export function BlockMap({ data }: { data: MapBlockData }) {
  const address = data?.address?.trim();
  if (!address) return null;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return (
    <section className="border-border/60 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
            Standort
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {data.title?.trim() || "So finden Sie uns"}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 text-pretty whitespace-pre-line">
            {address}
          </p>
        </header>
        <div className="ring-border/60 overflow-hidden rounded-3xl shadow-xl ring-1">
          <iframe
            src={src}
            title="Karte"
            className="h-[400px] w-full sm:h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Platzhalter für Kunden & Projekte in der Form der Seite (Titel,
 * Projektkarten mit Fortschritt), damit beim Laden nichts springt.
 */
export default function KundenLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Kunden & Projekte laden …</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.1] h-7 w-52 rounded-[3px]" />
        <div className="bg-foreground/[0.07] mt-7 h-5 w-32 rounded-[3px]" />
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-border bg-card rounded-[4px] border p-4"
            >
              <div className="bg-foreground/[0.08] h-4 w-2/5 rounded-[3px]" />
              <div className="bg-foreground/[0.05] mt-2 h-3 w-1/4 rounded-[3px]" />
              <div className="mt-3 flex gap-1">
                {[0, 1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className="bg-foreground/[0.08] h-1.5 flex-1 rounded-full"
                  />
                ))}
              </div>
              <div className="bg-foreground/[0.06] mt-3 h-3 w-3/5 rounded-[3px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

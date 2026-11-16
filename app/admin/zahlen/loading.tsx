/**
 * Platzhalter für /admin/zahlen in der Form der Seite (Kopf, Karte
 * Anfragen mit Tabelle und Balken, darunter die kleineren Karten),
 * damit beim Laden nichts springt.
 */
export default function ZahlenLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Zahlen laden …</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="flex items-baseline justify-between gap-4">
          <div className="bg-foreground/[0.1] h-7 w-28 rounded-[3px]" />
          <div className="bg-foreground/[0.07] h-4 w-40 rounded-[3px]" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="border-border bg-card rounded-[4px] border p-4 lg:col-span-2">
            <div className="bg-foreground/[0.09] h-5 w-24 rounded-[3px]" />
            <div className="lg:grid lg:grid-cols-2 lg:gap-10">
              <div className="mt-4 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div className="bg-foreground/[0.06] h-4 w-24 rounded-[3px]" />
                    <div className="bg-foreground/[0.08] h-4 w-32 rounded-[3px]" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex h-28 items-end gap-1 lg:mt-4">
                {[3, 5, 2, 6, 4, 7, 3, 5, 8, 4, 6, 2].map((h, i) => (
                  <div
                    key={i}
                    className="bg-foreground/[0.07] flex-1 rounded-t-[4px]"
                    style={{ height: `${h * 12}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border bg-card rounded-[4px] border p-4"
            >
              <div className="bg-foreground/[0.09] h-5 w-32 rounded-[3px]" />
              <div className="bg-foreground/[0.06] mt-4 h-3 w-24 rounded-[3px]" />
              <div className="bg-foreground/[0.1] mt-2 h-7 w-28 rounded-[3px]" />
              <div className="bg-foreground/[0.05] mt-3 h-3 w-4/5 rounded-[3px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

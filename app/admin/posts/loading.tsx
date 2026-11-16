/**
 * Platzhalter für den Post-Planer in der Form der Seite (Titel,
 * Morgenlauf, drei Posts), damit beim Laden nichts springt.
 */
export default function PostsLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Post-Planer lädt …</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.1] h-7 w-40 rounded-[3px]" />
        <div className="border-border bg-card mt-4 h-[76px] rounded-[4px] border" />
        <div className="bg-foreground/[0.07] mt-7 h-5 w-20 rounded-[3px]" />
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="border-border bg-card rounded-[4px] border p-4"
            >
              <div className="bg-foreground/[0.08] h-4 w-1/3 rounded-[3px]" />
              <div className="bg-foreground/[0.06] mt-4 h-3 w-1/4 rounded-[3px]" />
              <div className="bg-foreground/[0.09] mt-2 h-5 w-4/5 rounded-[3px]" />
              <div className="bg-foreground/[0.05] mt-2 h-4 w-3/5 rounded-[3px]" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-foreground/[0.06] h-11 rounded-[3px]" />
                <div className="bg-foreground/[0.06] h-11 rounded-[3px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Ladeanzeige nur für den Mitgliederbereich (dynamische Seiten mit
 * Datenbank). Öffentliche Seiten sind statisch und brauchen keine
 * Suspense-Grenze; eine globale loading.tsx würde ihren Inhalt erst
 * per Script einblenden (ohne JavaScript leer, schlechtere Ladezeit).
 *
 * Platzhalter in der Form der Übersicht (Datum, Suche, Karten), damit
 * beim Laden nichts springt.
 */
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Lädt …</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.07] h-4 w-48 rounded-[3px]" />
        <div className="mt-3 flex gap-2">
          <div className="border-border bg-card h-12 flex-1 rounded-[3px] border" />
          <div className="bg-foreground/[0.12] h-12 w-24 rounded-[3px]" />
        </div>
        <div className="bg-foreground/[0.07] mt-7 h-5 w-36 rounded-[3px]" />
        <div className="mt-3 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-border bg-card rounded-[4px] border p-4">
              <div className="bg-foreground/[0.08] h-4 w-2/5 rounded-[3px]" />
              <div className="bg-foreground/[0.06] mt-2.5 h-3 w-3/5 rounded-[3px]" />
              <div className="bg-foreground/[0.05] mt-2.5 h-3 w-4/5 rounded-[3px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

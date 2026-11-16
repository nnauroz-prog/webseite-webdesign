import { KundenBackLink } from "@/app/admin/kunden/back-link";

/**
 * Platzhalter der Projektseite. „Zurück“ ist schon echt: Bei schwachem
 * Netz kommt man auch während des Ladens zurück zur Liste.
 */
export default function ProjektLoading() {
  return (
    <div>
      <KundenBackLink />
      <span role="status" className="sr-only">
        Projekt lädt …
      </span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.07] mt-2 h-4 w-36 rounded-[3px]" />
        <div className="bg-foreground/[0.1] mt-2 h-7 w-3/5 rounded-[3px]" />
        <div className="border-border bg-card divide-border mt-6 divide-y rounded-[4px] border lg:max-w-[38rem]">
          <div className="p-4">
            <div className="bg-foreground/[0.08] h-4 w-28 rounded-[3px]" />
            <div className="mt-3 flex gap-1">
              {[0, 1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className="bg-foreground/[0.08] h-1.5 flex-1 rounded-full"
                />
              ))}
            </div>
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className="bg-foreground/[0.07] h-8 w-8 rounded-full" />
              <div className="flex-1">
                <div className="bg-foreground/[0.08] h-3.5 w-24 rounded-[3px]" />
                <div className="bg-foreground/[0.05] mt-2 h-3 w-2/5 rounded-[3px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

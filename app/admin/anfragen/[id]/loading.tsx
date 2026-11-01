import { BackLink } from "@/app/admin/anfragen/[id]/small-parts";

/**
 * Platzhalter der Detailseite. „Zurück“ ist schon echt: Bei schwachem
 * Netz kommt man auch während des Ladens zurück zur Liste.
 */
export default function LeadLoading() {
  return (
    <div>
      <BackLink />
      <span role="status" className="sr-only">
        Anfrage lädt …
      </span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.07] mt-2 h-5 w-40 rounded-[3px]" />
        <div className="bg-foreground/[0.1] mt-3 h-7 w-3/5 rounded-[3px]" />
        <div className="bg-foreground/[0.06] mt-2 h-4 w-2/5 rounded-[3px]" />
        <div className="border-border bg-card divide-border mt-6 divide-y rounded-[4px] border lg:max-w-[38rem]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3.5">
              <div className="bg-foreground/[0.06] h-3 w-20 rounded-[3px]" />
              <div className="bg-foreground/[0.09] mt-2 h-4 w-3/5 rounded-[3px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { EditorLoadingBack } from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-back-link";

/**
 * Platzhalter des Angebots-Editors (sonst griffe der Platzhalter der
 * Detailseite mit „Zurück“ zur Liste). „Zur Anfrage“ ist schon echt.
 */
export default function AngebotLoading() {
  return (
    <div>
      <EditorLoadingBack />
      <span role="status" className="sr-only">
        Angebot lädt …
      </span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="bg-foreground/[0.07] mt-2 h-5 w-24 rounded-[3px]" />
        <div className="bg-foreground/[0.1] mt-3 h-7 w-3/5 rounded-[3px]" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border-border bg-card mt-4 rounded-[4px] border p-4"
          >
            <div className="bg-foreground/[0.08] h-4 w-24 rounded-[3px]" />
            <div className="bg-foreground/[0.05] mt-3 h-12 w-full rounded-[4px]" />
            <div className="bg-foreground/[0.05] mt-3 h-12 w-full rounded-[4px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

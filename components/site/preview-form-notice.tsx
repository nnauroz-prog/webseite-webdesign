import { EyeOff } from "lucide-react";

/**
 * Replaces the public form fields with a friendly "your site isn't
 * published yet" callout when the owner is previewing their own
 * unpublished website (`is_active = false`).
 *
 * Showing this instead of either the form (which would always reject
 * submissions) or a generic red "nicht verfügbar" alert tells the
 * customer exactly what they need to do — flip the publish toggle
 * in the dashboard.
 */
export function PreviewFormNotice({
  formLabel,
}: {
  /** Human label for the form, e.g. "Bewerbungen", "Anfragen". */
  formLabel: string;
}) {
  return (
    <div className="border-border/70 bg-muted/40 flex flex-col items-start gap-3 rounded-2xl border-2 border-dashed p-6 sm:flex-row sm:items-center sm:gap-4">
      <span className="bg-primary/10 text-primary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
        <EyeOff className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h4 className="text-base font-semibold tracking-tight">
          Vorschau-Modus
        </h4>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Deine Website ist noch nicht veröffentlicht. Sobald du sie aktivierst,
          erreichen dich {formLabel} hier automatisch.
        </p>
        <a
          href="/dashboard/website"
          className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Jetzt veröffentlichen
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

import { explainDbError } from "@/lib/admin/db-errors";

/**
 * Verständliche Erklärung, wenn Supabase nicht antwortet oder etwas
 * fehlt. Wird auf dem Server gerendert, damit die Erklärung auch in
 * Produktion ankommt (error.tsx bekäme nur eine generische Meldung).
 */
export function DbProblem({
  error,
  retryHref,
  compact = false,
}: {
  error: unknown;
  retryHref: string;
  compact?: boolean;
}) {
  const e = explainDbError(error);
  return (
    <div
      role="alert"
      className="border-gold bg-card mt-3 rounded-[4px] border-2 p-4 text-[15px] leading-relaxed"
    >
      <p className="font-semibold">
        {compact ? e.title : `Du bist angemeldet, aber die Daten lassen sich nicht laden. ${e.title}`}
      </p>
      <p className="mt-2">{e.hint}</p>
      {e.raw ? (
        <p className="text-muted-foreground mt-3 font-mono text-[12px] break-words">
          {e.raw}
        </p>
      ) : null}
      {compact ? null : (
        <a
          href={retryHref}
          className="bg-foreground text-background mt-4 inline-flex h-12 items-center rounded-[3px] px-6 text-[15px] font-medium"
        >
          Erneut versuchen
        </a>
      )}
    </div>
  );
}

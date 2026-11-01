import type { SchemaStatus } from "@/lib/admin/schema";

import { SchemaBanner } from "@/app/admin/schema-banner";
import { sqlEditorUrl } from "@/lib/admin/card-model";
import { explainDbError } from "@/lib/admin/db-errors";

/**
 * Banner bei fehlender Migration ('fehlt'), kleiner Hinweis, wenn die
 * Prüfung selbst gescheitert ist ('unbekannt'), sonst nichts.
 */
export function SchemaNotice({ schema }: { schema: SchemaStatus }) {
  const parts = [schema.leadsV2, schema.events, schema.deletions];
  if (parts.includes("fehlt")) {
    return (
      <SchemaBanner
        editorUrl={sqlEditorUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)}
      />
    );
  }
  if (parts.includes("unbekannt")) {
    const e = explainDbError(schema.error ?? "unbekannt");
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground mt-3 rounded-xl border p-3 text-[14px] leading-relaxed"
      >
        Datenbank-Stand gerade nicht prüfbar: {e.title} Wiedervorlage und
        Ergebnis sind bis zum nächsten Laden aus.
      </p>
    );
  }
  return null;
}

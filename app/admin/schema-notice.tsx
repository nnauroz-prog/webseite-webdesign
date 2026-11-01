import type { SchemaStatus } from "@/lib/admin/schema";

import { SchemaBanner } from "@/app/admin/schema-banner";
import { sqlEditorUrl } from "@/lib/admin/card-model";
import { explainDbError } from "@/lib/admin/db-errors";
import { missingMigrations } from "@/lib/admin/migration-sql";

/**
 * Banner bei fehlender Migration ('fehlt', nur die fehlende zum
 * Kopieren), kleiner Hinweis, wenn die Prüfung selbst gescheitert ist
 * ('unbekannt'), sonst nichts.
 */
export function SchemaNotice({ schema }: { schema: SchemaStatus }) {
  const parts = [
    schema.leadsV2,
    schema.events,
    schema.deletions,
    schema.angebote,
  ];
  const missing = missingMigrations(schema);
  if (missing.length > 0) {
    return (
      <SchemaBanner
        editorUrl={sqlEditorUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)}
        missing={missing.map((m) => m.id)}
      />
    );
  }
  if (parts.includes("unbekannt")) {
    const e = explainDbError(schema.error ?? "unbekannt");
    return (
      <p
        role="status"
        className="border-border bg-card text-muted-foreground mt-4 rounded-[4px] border p-3 text-[14px] leading-relaxed"
      >
        Datenbank-Stand gerade nicht prüfbar: {e.title} Wiedervorlage, Ergebnis
        und Angebote sind bis zum nächsten Laden aus.
      </p>
    );
  }
  return null;
}

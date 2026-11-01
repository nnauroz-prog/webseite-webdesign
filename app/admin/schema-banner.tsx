"use client";

import { Check, Copy, ExternalLink, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { MigrationId } from "@/lib/admin/migration-sql";

import { kickRender } from "@/app/admin/render-kick";
import { MIGRATIONS, migrationSqlFor } from "@/lib/admin/migration-sql";

/**
 * Hinweis, solange eine Migration fehlt (missing, aus
 * missingMigrations). „SQL kopieren“ kopiert nur die fehlenden, bei
 * mehreren hintereinander. Ruhig (Gold-Rand, kein roter Alarm) und am
 * iPhone machbar: SQL kopieren, Editor öffnen, Run, hier erneut prüfen.
 */
export function SchemaBanner({
  editorUrl,
  missing,
}: {
  editorUrl: string;
  missing: MigrationId[];
}) {
  const router = useRouter();
  const migrations = MIGRATIONS.filter((m) => missing.includes(m.id));
  const sql = migrationSqlFor(migrations);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [checking, startCheck] = useTransition();

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setManual(false);
    } catch {
      // Kein Zugriff auf die Zwischenablage: Text zum Markieren zeigen.
      setManual(true);
    }
  }

  return (
    <section
      role="status"
      aria-label="Datenbank-Update"
      className="border-gold bg-card mt-4 rounded-[4px] border-2 p-4 text-[15px] leading-relaxed"
    >
      <p className="font-semibold">Datenbank-Update ausstehend</p>
      <ol className="mt-2 space-y-0.5">
        <li>1. „SQL kopieren“ tippen</li>
        <li>2. „SQL Editor öffnen“ tippen (Supabase)</li>
        <li>3. Dort einfügen und auf „Run“ tippen</li>
        <li>4. Zurück hier „Erneut prüfen“ tippen</li>
      </ol>
      <p className="text-muted-foreground mt-2 text-[14px]">
        Bis dahin aus: {migrations.map((m) => m.features).join(", ")}.{" "}
        {migrations.length > 1 ? "Dateien" : "Datei"}:{" "}
        {migrations.map((m, i) => (
          <span key={m.id}>
            {i > 0 ? ", " : null}
            <span className="font-mono text-[12.5px] break-all">{m.file}</span>
          </span>
        ))}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={copy}
          className="bg-foreground text-background inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-medium"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "SQL kopiert" : "SQL kopieren"}
        </button>
        <a
          href={editorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border hover:border-foreground/40 inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium transition-colors"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          SQL Editor öffnen
        </a>
        <button
          type="button"
          onClick={() => {
            startCheck(() => router.refresh());
            kickRender();
          }}
          disabled={checking}
          className="border-border hover:border-foreground/40 inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium transition-colors disabled:opacity-60"
        >
          <RotateCw
            className={checking ? "h-4 w-4 animate-spin" : "h-4 w-4"}
            aria-hidden="true"
          />
          Erneut prüfen
        </button>
      </div>
      {manual ? (
        <div className="mt-3">
          <p className="text-[14px]">
            Kopieren ging nicht automatisch. Tipp ins Feld, dann „Kopieren“.
          </p>
          <textarea
            readOnly
            value={sql}
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.currentTarget.select()}
            rows={6}
            className="border-border bg-background mt-2 w-full rounded-[4px] border p-3 font-mono text-base"
          />
        </div>
      ) : null}
    </section>
  );
}

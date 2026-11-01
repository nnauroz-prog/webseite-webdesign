"use client";

import { Check, Copy, ExternalLink, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { kickRender } from "@/app/admin/render-kick";
import { MIGRATION_SQL, MIGRATION_SQL_FILE } from "@/lib/admin/migration-sql";

/**
 * Hinweis, solange die Migration 20261101000000_admin_ausbau.sql
 * fehlt. Ruhig (Gold-Rand, kein roter Alarm) und am iPhone machbar:
 * SQL kopieren, Editor öffnen, Run, hier erneut prüfen.
 */
export function SchemaBanner({ editorUrl }: { editorUrl: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [checking, startCheck] = useTransition();

  async function copy() {
    try {
      await navigator.clipboard.writeText(MIGRATION_SQL);
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
      className="border-gold bg-card mt-3 rounded-[4px] border-2 p-4 text-[15px] leading-relaxed"
    >
      <p className="font-semibold">Datenbank-Update ausstehend</p>
      <ol className="mt-2 space-y-0.5">
        <li>1. SQL kopieren</li>
        <li>2. Editor öffnen</li>
        <li>3. Einfügen und Run tippen</li>
        <li>4. Hier „Erneut prüfen“</li>
      </ol>
      <p className="text-muted-foreground mt-2 text-[14px]">
        Bis dahin aus: Wiedervorlage, Ergebnis, Verlauf, Löschprotokoll.
        Datei: <span className="font-mono text-[12.5px] break-all">{MIGRATION_SQL_FILE}</span>
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
          className="border-border inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium"
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
          className="border-border inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium disabled:opacity-60"
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
            value={MIGRATION_SQL}
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

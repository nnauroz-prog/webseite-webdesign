"use client";

import Link from "next/link";
import { useTransition } from "react";

import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { adminDeleteLeadAction } from "@/lib/actions/admin";
import type { LeadRow as LeadModel, LeadStatus } from "@/types/website";

const LABELS: Record<LeadStatus, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  closed: "Abgeschlossen",
};

export function AdminLeadRow({
  lead,
  websiteSlug,
  websiteName,
}: {
  lead: LeadModel;
  websiteSlug: string | null;
  websiteName: string | null;
}) {
  const [deleting, startDelete] = useTransition();

  function remove() {
    if (!confirm(`Anfrage von „${lead.name}" wirklich endgültig löschen?`))
      return;
    const fd = new FormData();
    fd.append("id", lead.id);
    startDelete(() => {
      void adminDeleteLeadAction(undefined, fd);
    });
  }

  return (
    <article className="rounded-lg border p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base leading-tight font-semibold">{lead.name}</h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            <a
              href={`mailto:${lead.email}`}
              className="hover:text-foreground hover:underline"
            >
              {lead.email}
            </a>
            {lead.phone && (
              <>
                {" · "}
                <a
                  href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground hover:underline"
                >
                  {lead.phone}
                </a>
              </>
            )}
          </p>
          {websiteSlug && (
            <p className="text-muted-foreground mt-1 text-xs">
              Website:{" "}
              <Link
                href={`/admin/websites/${lead.website_id}`}
                className="text-foreground hover:underline"
              >
                {websiteName ?? "Website"}
              </Link>{" "}
              <span className="font-mono">/site/{websiteSlug}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={lead.status} label={LABELS[lead.status]} />
          <time
            dateTime={lead.created_at}
            className="text-muted-foreground text-xs"
          >
            {formatDate(lead.created_at)}
          </time>
        </div>
      </header>

      <p className="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-line">
        {lead.message}
      </p>

      <div className="mt-5 flex justify-end border-t pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={remove}
        >
          {deleting ? "Lösche …" : "Anfrage löschen"}
        </Button>
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

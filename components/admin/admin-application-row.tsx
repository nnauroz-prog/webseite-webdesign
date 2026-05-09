"use client";

import Link from "next/link";
import { useTransition } from "react";

import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { adminDeleteApplicationAction } from "@/lib/actions/admin";
import type {
  ApplicationRow as ApplicationModel,
  ApplicationStatus,
} from "@/types/website";

const LABELS: Record<ApplicationStatus, string> = {
  new: "Neu",
  reviewed: "Geprüft",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
};

export function AdminApplicationRow({
  application,
  websiteSlug,
  websiteName,
}: {
  application: ApplicationModel;
  websiteSlug: string | null;
  websiteName: string | null;
}) {
  const [deleting, startDelete] = useTransition();

  function remove() {
    if (
      !confirm(
        `Bewerbung von „${application.name}" wirklich endgültig löschen?`,
      )
    )
      return;
    const fd = new FormData();
    fd.append("id", application.id);
    startDelete(() => {
      void adminDeleteApplicationAction(undefined, fd);
    });
  }

  return (
    <article className="rounded-lg border p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base leading-tight font-semibold">
            {application.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            <a
              href={`mailto:${application.email}`}
              className="hover:text-foreground hover:underline"
            >
              {application.email}
            </a>
            {application.phone && (
              <>
                {" · "}
                <a
                  href={`tel:${application.phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground hover:underline"
                >
                  {application.phone}
                </a>
              </>
            )}
          </p>
          {application.desired_position && (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Position:</span>{" "}
              <span className="font-medium">
                {application.desired_position}
              </span>
            </p>
          )}
          {websiteSlug && (
            <p className="text-muted-foreground mt-1 text-xs">
              Website:{" "}
              <Link
                href={`/admin/websites/${application.website_id}`}
                className="text-foreground hover:underline"
              >
                {websiteName ?? "Website"}
              </Link>{" "}
              <span className="font-mono">/site/{websiteSlug}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusPill
            status={application.status}
            label={LABELS[application.status]}
          />
          <time
            dateTime={application.created_at}
            className="text-muted-foreground text-xs"
          >
            {formatDate(application.created_at)}
          </time>
        </div>
      </header>

      <p className="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-line">
        {application.message}
      </p>

      <div className="mt-5 flex justify-end border-t pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={remove}
        >
          {deleting ? "Lösche …" : "Bewerbung löschen"}
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

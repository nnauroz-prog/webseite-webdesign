"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { openedFromAdmin } from "@/app/admin/client-state";

/**
 * „‹ Zur Anfrage“ im Angebots-Editor: Wurde der Editor aus dem Admin
 * geöffnet, springt router.back() zurück (Scrollposition bleibt),
 * sonst ein normaler Link auf die Anfrage.
 */
export function EditorBackLink({
  leadId,
  label,
}: {
  leadId: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <Link
      href={`/admin/anfragen/${leadId}`}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        if (
          openedFromAdmin(window.location.pathname) &&
          window.history.length > 1
        ) {
          e.preventDefault();
          router.back();
        }
      }}
      className="-ml-2 inline-flex h-11 max-w-full items-center gap-0.5 rounded-[3px] pr-3 pl-1 text-[15px] font-medium"
    >
      <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">
        {label ? `Zur Anfrage · ${label}` : "Zur Anfrage"}
      </span>
    </Link>
  );
}

/** „Zur Anfrage“ im Platzhalter (loading.tsx bekommt keine Parameter). */
export function EditorLoadingBack() {
  const params = useParams<{ id: string }>();
  return (
    <EditorBackLink leadId={typeof params.id === "string" ? params.id : ""} />
  );
}

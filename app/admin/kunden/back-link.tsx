"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { openedFromAdmin } from "@/app/admin/client-state";

/**
 * „‹ Kunden“ auf der Projektseite: Aus der Liste geöffnet, springt
 * router.back() zurück (Scrollposition bleibt). Sonst, etwa über einen
 * Direktlink, auf /admin/kunden.
 */
export function KundenBackLink() {
  const router = useRouter();
  return (
    <Link
      href="/admin/kunden"
      onClick={(e) => {
        if (
          openedFromAdmin(window.location.pathname) &&
          window.history.length > 1
        ) {
          e.preventDefault();
          router.back();
        }
      }}
      className="-ml-2 inline-flex h-11 items-center gap-0.5 rounded-[3px] pr-3 pl-1 text-[15px] font-medium"
    >
      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      Kunden
    </Link>
  );
}

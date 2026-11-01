"use client";

import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { kickRender } from "@/app/admin/render-kick";
import { cn } from "@/lib/utils";

/** Lädt die Daten der Seite neu (router.refresh), 44px groß. */
export function RefreshButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        start(() => router.refresh());
        kickRender();
      }}
      disabled={pending}
      aria-label="Aktualisieren"
      title="Aktualisieren"
      className="hover:bg-background/10 inline-flex h-11 w-11 items-center justify-center rounded-[3px] transition-colors disabled:opacity-70"
    >
      <RotateCw
        className={cn("h-5 w-5", pending && "animate-spin")}
        aria-hidden="true"
      />
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";

import { switchActiveWebsiteAction } from "@/lib/actions/website";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

/**
 * Site switcher for the dashboard sidebar. Renders the currently
 * active website as a button; clicking opens a dropdown with every
 * website the user owns plus a "+ Neue Website" link.
 *
 * Active selection persists via the active-website cookie set
 * server-side by switchActiveWebsiteAction.
 */
export function SiteSwitcher({
  websites,
  activeId,
}: {
  websites: WebsiteRow[];
  activeId: string;
}) {
  const [open, setOpen] = useState(false);
  const [, startSwitch] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = websites.find((w) => w.id === activeId) ?? websites[0];

  const switchTo = (id: string) => {
    if (id === activeId) {
      setOpen(false);
      return;
    }
    const fd = new FormData();
    fd.append("website_id", id);
    startSwitch(() => {
      void switchActiveWebsiteAction(undefined, fd);
    });
    setOpen(false);
  };

  // Single-site users still get the switcher pill, but the dropdown
  // is essentially just the "+ Neue Website" CTA.
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "border-border bg-background hover:bg-secondary flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition",
          open && "ring-primary/40 ring-2",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-[10px] tracking-[0.18em] uppercase">
            Aktive Website
          </p>
          <p className="text-foreground mt-0.5 truncate font-medium">
            {active?.business_name ?? "Keine Website"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "text-muted-foreground h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="border-border bg-card absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border shadow-xl"
        >
          <ul className="max-h-72 overflow-y-auto py-1">
            {websites.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => switchTo(w.id)}
                  className={cn(
                    "hover:bg-secondary flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
                    w.id === activeId && "bg-primary/10",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block truncate font-medium">
                      {w.business_name}
                    </span>
                    <span className="text-muted-foreground block truncate font-mono text-[11px]">
                      /site/{w.slug}
                    </span>
                  </span>
                  {w.id === activeId ? (
                    <Check className="text-primary h-4 w-4 shrink-0" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-border border-t">
            <Link
              href="/dashboard/new-site"
              className="hover:bg-secondary flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition"
              onClick={() => setOpen(false)}
            >
              <Plus className="h-4 w-4" />
              Neue Website anlegen
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

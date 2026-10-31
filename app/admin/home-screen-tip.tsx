"use client";

import { X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const KEY = "sitalo-admin-tipp-home";

const noop = () => () => {};

/** Safari auf iPhone/iPad, nicht schon als Home-Bildschirm-App geöffnet. */
function shouldShow(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  // navigator.standalone gibt es nur in iOS-Safari.
  if (nav.standalone !== false) return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return false;
  try {
    if (window.localStorage.getItem(KEY)) return false;
  } catch {
    // ohne Speicher: einfach zeigen
  }
  return true;
}

/** Einmaliger, wegklickbarer Hinweis auf die Home-Bildschirm-App. */
export function HomeScreenTip() {
  const eligible = useSyncExternalStore(noop, shouldShow, () => false);
  const [dismissed, setDismissed] = useState(false);
  if (!eligible || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // nur für diese Ansicht ausgeblendet
    }
  }

  return (
    <aside
      aria-label="Tipp"
      className="border-border bg-card mt-6 flex items-start gap-2 rounded-2xl border py-2 pr-1 pl-4 text-[14px] leading-relaxed"
    >
      <p className="py-1.5">
        Tipp: Teilen → „Zum Home-Bildschirm“, dann öffnet sich /admin wie eine
        App. Dort einmal neu anmelden. Links aus der Benachrichtigungs-Mail
        öffnen weiterhin Safari.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tipp ausblenden"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </aside>
  );
}

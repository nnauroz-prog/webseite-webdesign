"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  rememberBackTarget,
  rememberSearch,
  SEARCH_MAX_AGE,
  SEARCH_RESET_EVENT,
} from "@/app/admin/client-state";
import { kickRender } from "@/app/admin/render-kick";

const REFRESH_AFTER_MS = 60_000;

/** Wird gerade getippt oder liegt ungespeicherter Text vor? */
function busy(): boolean {
  const el = document.activeElement;
  if (
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLInputElement &&
      !["button", "submit", "checkbox", "radio", "hidden"].includes(el.type))
  ) {
    return true;
  }
  if (document.querySelector('[data-dirty="true"]')) return true;
  // Offenes Bottom-Sheet nicht unter der Hand neu aufbauen.
  return document.querySelector("dialog[open]") !== null;
}

/**
 * Unsichtbare Helfer für alle Admin-Seiten:
 *
 * - Rückkehr aus dem bfcache (pageshow mit persisted, z. B. Zurück-
 *   Geste nach dem Abmelden): Seite neu laden. Ohne Sitzung folgt der
 *   Login, Kundendaten bleiben nicht sichtbar.
 * - Nach mehr als 60 s im Hintergrund: router.refresh(), damit neue
 *   Anfragen erscheinen. Nicht, solange getippt wird.
 * - Merkt sich, welche Detail- und Angebotsseiten aus dem Admin
 *   geöffnet wurden („‹ Zurück“ springt dann wirklich zurück).
 * - Nach mehr als 10 Min im Hintergrund oder per Kopf-Link
 *   „Sitalo · Admin“: offene Suche schließen.
 */
export function AdminLifecycle() {
  const router = useRouter();

  useEffect(() => {
    let hiddenSince: number | null =
      document.visibilityState === "hidden" ? Date.now() : null;

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenSince = Date.now();
        return;
      }
      const since = hiddenSince;
      hiddenSince = null;
      if (since === null) return;
      const away = Date.now() - since;
      // Lange weg: eine offene Suche verdeckt sonst „Jetzt melden“.
      if (away > SEARCH_MAX_AGE) window.dispatchEvent(new Event(SEARCH_RESET_EVENT));
      if (away > REFRESH_AFTER_MS && !busy()) {
        router.refresh();
        kickRender();
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.origin !== window.location.origin) return;
      if (a.hasAttribute("data-admin-home")) {
        rememberSearch("", Date.now());
        window.dispatchEvent(new CustomEvent(SEARCH_RESET_EVENT, { detail: "kopf" }));
      }
      // Detailseite oder Angebots-Editor einer Anfrage.
      if (/^\/admin\/anfragen\/[0-9a-f-]{36}(\/angebot\/[0-9a-f-]{36})?$/i.test(a.pathname)) {
        rememberBackTarget(a.pathname);
      }
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return null;
}

/**
 * Minimaler Tracking-Wrapper. Sitalo nutzt Plausible (oder eine
 * kompatible Quelle, die `window.plausible` exponiert): privacy-first,
 * cookie-frei, DSGVO-unbedenklich ohne Consent-Banner.
 *
 * `track()` ist absichtlich ein No-Op, wenn das Script nicht geladen
 * ist — kein Crash, kein leere-Funktion-Boilerplate an jeder Call-Site.
 * Tracking aktiviert sich automatisch, sobald `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
 * gesetzt ist (siehe `plausible-script.tsx`).
 *
 * Events bewusst klein gehalten: drei Zahlen wollen wir kennen können —
 * (1) Wie viele Leute klicken die Haupt-CTAs? (2) Wie viele schicken
 * tatsächlich das Formular ab? (3) Welche Branche kommt rein? Mehr
 * brauchen wir nicht; mehr ist Lärm.
 */

type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: PlausibleProps; callback?: () => void },
    ) => void;
  }
}

export function track(eventName: string, props?: PlausibleProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  try {
    window.plausible(eventName, props ? { props } : undefined);
  } catch {
    // Tracking darf niemals die App umbringen. Silent fail.
  }
}

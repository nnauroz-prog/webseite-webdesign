"use client";

import { useEffect, useState } from "react";

/**
 * Umgehung für einen Fehler in React 19.3-canary (gebündelt mit
 * Next 16.2): Nach router.refresh() oder einer Server Action mit
 * revalidatePath bleibt die Aktualisierung manchmal hängen. React hat
 * dann auf Daten gewartet, die längst da sind, bekommt aber kein
 * Signal mehr (Ping geht während des Renderns verloren). Sichtbar wird
 * das als Drehsymbol ohne Ende, ausgegraute Knöpfe und alte Daten.
 *
 * Jede neue Zustandsänderung irgendwo in der App lässt React die
 * hängende Aktualisierung erneut versuchen, und dann klappt sie. Diese
 * Komponente stellt dafür kickRender() bereit: ein unsichtbarer
 * Zähler, der nach einer Aktion ein paar Mal hochgezählt wird.
 */

let bump: (() => void) | null = null;

export function RenderKick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    bump = () => setTick((t) => t + 1);
    return () => {
      bump = null;
    };
  }, []);
  return null;
}

const DELAYS = [400, 1200, 2500, 5000, 9000];

/** Nach einer Aktualisierung mehrmals anstoßen (harmlos, wenn nichts hängt). */
export function kickRender(): void {
  for (const ms of DELAYS) {
    window.setTimeout(() => bump?.(), ms);
  }
}

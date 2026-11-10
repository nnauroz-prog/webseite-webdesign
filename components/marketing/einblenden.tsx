"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Weiches Einblenden beim Scrollen, einmal im Layout eingesetzt.
 *
 * Elemente mit data-ein blenden ein, sobald sie ins Bild kommen;
 * data-ein="reihe" staffelt die direkten Kinder (Karten, Kacheln).
 *
 * Regeln:
 * - Versteckt wird nur, was dieses Script selbst markiert hat
 *   (data-ein-da="w", wartet). Ohne JavaScript, bei reduzierter
 *   Bewegung, im Druck und für später eingefügte Elemente ist darum
 *   nie etwas unsichtbar.
 * - Was beim Laden schon zu sehen ist oder darüber liegt, bleibt
 *   stehen ("0"). Nur was später ins Bild kommt, bewegt sich ("1").
 * - Jedes Element genau einmal.
 */
/**
 * Zählt die erste Zahl im Text einmal hoch (data-zaehl), etwa „ab 599 €“.
 * Start ist die kleinste Zahl mit gleich vielen Stellen, damit die Zeile
 * nicht springt. Am Ende steht wieder exakt der ursprüngliche Text.
 */
function zaehlen(el: HTMLElement) {
  if (el.dataset.zaehl === "fertig") return;
  const text = el.textContent ?? "";
  const m = text.match(/\d[\d.]*/);
  if (!m || m.index === undefined) return;
  const ziel = Number(m[0].replace(/\./g, ""));
  if (!Number.isFinite(ziel) || ziel < 2) return;
  el.dataset.zaehl = "fertig";
  const stellen = String(ziel).length;
  const start = stellen > 1 ? Math.pow(10, stellen - 1) : 0;
  const vor = text.slice(0, m.index);
  const nach = text.slice(m.index + m[0].length);
  const fmt = new Intl.NumberFormat("de-DE");
  const dauer = 1100;
  let t0 = 0;
  const schritt = (t: number) => {
    if (!t0) t0 = t;
    const k = Math.min(1, (t - t0) / dauer);
    const sanft = 1 - Math.pow(1 - k, 3);
    if (k < 1) {
      el.textContent =
        vor + fmt.format(Math.round(start + (ziel - start) * sanft)) + nach;
      window.requestAnimationFrame(schritt);
    } else {
      el.textContent = text;
    }
  };
  window.requestAnimationFrame(schritt);
}

/**
 * Ziffern würfeln kurz und rasten von links nach rechts ein (data-wuerfel),
 * etwa die Telefonnummer. Am Ende steht wieder exakt der ursprüngliche Text.
 */
function wuerfeln(el: HTMLElement) {
  if (el.dataset.wuerfel === "fertig") return;
  const text = el.textContent ?? "";
  const stellen = Array.from(text);
  const ziffern = stellen
    .map((z, i) => (/\d/.test(z) ? i : -1))
    .filter((i) => i >= 0);
  if (ziffern.length < 3) return;
  el.dataset.wuerfel = "fertig";
  const dauer = 1200;
  let t0 = 0;
  let letzter = 0;
  const schritt = (t: number) => {
    if (!t0) t0 = t;
    const k = Math.min(1, (t - t0) / dauer);
    if (k >= 1) {
      el.textContent = text;
      return;
    }
    if (t - letzter > 45) {
      letzter = t;
      const fest = Math.floor(k * ziffern.length);
      const bild = stellen.slice();
      ziffern.forEach((pos, n) => {
        if (n >= fest) bild[pos] = String(Math.floor(Math.random() * 10));
      });
      el.textContent = bild.join("");
    }
    window.requestAnimationFrame(schritt);
  };
  window.requestAnimationFrame(schritt);
}

export function Einblenden() {
  const pfad = usePathname();

  useLayoutEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const elemente = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-ein]:not([data-ein-da="0"], [data-ein-da="1"])',
      ),
    );
    if (elemente.length === 0) return;

    let erste = true;
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          const el = e.target as HTMLElement;
          if (erste) {
            const r = e.boundingClientRect;
            // Schon sichtbar oder oberhalb: ohne Bewegung stehen lassen.
            if (
              e.isIntersecting ||
              r.top < 0 ||
              (r.height > 0 && r.top < window.innerHeight)
            ) {
              el.dataset.einDa = "0";
              io.unobserve(el);
            } else {
              el.dataset.einDa = "w";
            }
          } else if (e.isIntersecting) {
            el.dataset.einDa = "1";
            io.unobserve(el);
            // Nach dem Auftritt zurück in den Ruhezustand, damit spätere
            // Bewegungen (Antippen) nicht die Auftritts-Verzögerung erben.
            window.setTimeout(() => {
              if (el.dataset.einDa === "1") el.dataset.einDa = "0";
            }, 2800);
            el.querySelectorAll<HTMLElement>("[data-zaehl]").forEach(zaehlen);
            el.querySelectorAll<HTMLElement>("[data-wuerfel]").forEach(
              wuerfeln,
            );
          }
        }
        erste = false;
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of elemente) io.observe(el);
    return () => io.disconnect();
  }, [pfad]);

  return null;
}

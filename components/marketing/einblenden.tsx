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
 * - Überschriften (h2) in wartenden Blöcken werden in Wörter zerlegt und
 *   steigen beim Einblenden Wort für Wort auf (woerterZerlegen).
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

/**
 * Zerlegt die Überschriften (h2) eines wartenden Blocks in Wörter, damit
 * sie beim Einblenden einzeln aus einer Maske steigen (Styles in
 * app/effekte-gross.css): jedes Wort wird zu
 * <span class="wort" style="--w: n"><span>Wort</span></span>.
 *
 * - Leerzeichen bleiben als Text stehen, die äußeren Spans (schwarzer und
 *   grauer Satz) samt Klassen ebenfalls; textContent ändert sich nicht.
 *   Eine Überschrift aus reinem Text bekommt einen Span als Hülle.
 * - Geschützte Leerzeichen trennen nicht („St. Pauli“ bleibt ein Stück).
 * - Vorleseprogramme bekommen den ganzen Satz als ein Stück (aria-label),
 *   die einzelnen Wörter sind für sie ausgeblendet.
 * - Überschriften mit Links, Knöpfen oder eigenen Zahlen-Effekten bleiben
 *   unberührt. Karten-Titel in Reihen ebenfalls: dort bewegt sich die Karte.
 */
const NUR_LEER = /^[ \t\n\r\f]+$/;

function woerterZerlegen(block: HTMLElement) {
  if (block.dataset.ein === "reihe") return;
  const titel = Array.from(block.querySelectorAll<HTMLElement>("h2"));
  for (const h of titel) {
    if (h.dataset.woerter !== undefined) continue;
    if (
      h.hasAttribute("aria-label") ||
      h.closest('[data-ein="reihe"]') ||
      h.querySelector(
        "a, button, [tabindex], [aria-hidden], [data-zaehl], [data-wuerfel], [data-leucht]",
      )
    ) {
      continue;
    }
    const satz = (h.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!satz) continue;
    const freierText = Array.from(h.childNodes).some(
      (k) => k.nodeType === Node.TEXT_NODE && /\S/.test(k.textContent ?? ""),
    );
    if (freierText) {
      // Text und Elemente gemischt: nicht anfassen.
      if (h.children.length > 0) continue;
      // Nur Text: eine Hülle um alle Wörter, damit Regeln wie
      // „h2 > span + span“ (grauer Satz) nicht auf einzelne Wörter passen.
      const huelle = document.createElement("span");
      huelle.append(...Array.from(h.childNodes));
      h.append(huelle);
    }
    const laeufer = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const texte: Text[] = [];
    while (laeufer.nextNode()) texte.push(laeufer.currentNode as Text);
    let n = 0;
    for (const t of texte) {
      if (NUR_LEER.test(t.data) || t.data === "") continue;
      const teile = document.createDocumentFragment();
      for (const stueck of t.data.split(/([ \t\n\r\f]+)/)) {
        if (stueck === "") continue;
        if (NUR_LEER.test(stueck)) {
          teile.append(stueck);
          continue;
        }
        const aussen = document.createElement("span");
        aussen.className = "wort";
        aussen.style.setProperty("--w", String(n));
        const innen = document.createElement("span");
        innen.textContent = stueck;
        aussen.append(innen);
        teile.append(aussen);
        n += 1;
      }
      t.replaceWith(teile);
    }
    if (n === 0) continue;
    h.dataset.woerter = String(n);
    h.setAttribute("aria-label", satz);
    for (const kind of Array.from(h.children)) {
      kind.setAttribute("aria-hidden", "true");
    }
  }
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
    // Zahlen zählen und Ziffern würfeln, sobald sie selbst im Bild sind:
    // auch im Kopf der Seite, außerhalb von data-ein und in Karten, die
    // erst beim Wischen erscheinen.
    const ioZahl = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          ioZahl.unobserve(el);
          if (el.hasAttribute("data-wuerfel")) wuerfeln(el);
          else zaehlen(el);
        }
      },
      { threshold: 0.6 },
    );
    document
      .querySelectorAll<HTMLElement>(
        '[data-zaehl]:not([data-zaehl="fertig"]), [data-wuerfel]:not([data-wuerfel="fertig"])',
      )
      .forEach((el) => ioZahl.observe(el));

    const elemente = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-ein]:not([data-ein-da="0"], [data-ein-da="1"])',
      ),
    );
    if (elemente.length === 0) return () => ioZahl.disconnect();

    let erste = true;
    // Wartende Blöcke werden in Ruhe in Wörter zerlegt, nicht alle auf
    // einmal beim Laden (das hielte den ersten Aufbau der Seite auf).
    const offen: HTMLElement[] = [];
    let ruhe = 0;
    const zerlegeWeiter = () => {
      ruhe = 0;
      const ende = performance.now() + 6;
      while (offen.length > 0 && performance.now() < ende) {
        const el = offen.shift();
        if (el && el.dataset.einDa === "w") woerterZerlegen(el);
      }
      if (offen.length > 0) ruhe = window.setTimeout(zerlegeWeiter, 60);
    };
    const io = new IntersectionObserver(
      (eintraege) => {
        // Höhe einmal vorab: Im Durchlauf gelesen, zwänge sie den Browser
        // nach jedem Markieren, die ganze Seite neu zu rechnen.
        const vh = erste ? window.innerHeight : 0;
        for (const e of eintraege) {
          const el = e.target as HTMLElement;
          if (erste) {
            const r = e.boundingClientRect;
            // Schon sichtbar oder oberhalb: ohne Bewegung stehen lassen.
            if (e.isIntersecting || r.top < 0 || (r.height > 0 && r.top < vh)) {
              el.dataset.einDa = "0";
              io.unobserve(el);
            } else {
              el.dataset.einDa = "w";
              // Nur was noch unter dem Bild wartet, wird in Wörter zerlegt.
              offen.push(el);
            }
          } else if (e.isIntersecting) {
            // Noch nicht zerlegt (sehr schnell gescrollt): jetzt nachholen.
            woerterZerlegen(el);
            el.dataset.einDa = "1";
            io.unobserve(el);
            // Nach dem Auftritt zurück in den Ruhezustand, damit spätere
            // Bewegungen (Antippen) nicht die Auftritts-Verzögerung erben.
            window.setTimeout(() => {
              if (el.dataset.einDa === "1") el.dataset.einDa = "0";
            }, 2800);
          }
        }
        if (erste && offen.length > 0) {
          ruhe = window.setTimeout(zerlegeWeiter, 300);
        }
        erste = false;
      },
      // Auslöser 15 % über dem unteren Rand: Am Handy liegt unten die
      // feste Anfrage-Leiste (rund 10 % der Höhe). Mit weniger Abstand
      // liefe der Anfang jedes Auftritts verdeckt hinter ihr ab.
      { rootMargin: "0px 0px -15% 0px" },
    );
    for (const el of elemente) io.observe(el);
    return () => {
      io.disconnect();
      ioZahl.disconnect();
      window.clearTimeout(ruhe);
    };
  }, [pfad]);

  return null;
}

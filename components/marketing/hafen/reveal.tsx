"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Einblenden beim Scrollen und Laufzeit für Dauerbewegungen.
 *
 * ── <RevealRoot /> ──────────────────────────────────────────────────
 * Einmal pro Seite einsetzen (z. B. als erstes Kind von <main>). Danach
 * genügt an jedem Element ein Attribut:
 *
 *   data-reveal="rise"     Überschrift steigt aus einer Maske nach oben.
 *   data-reveal="fade"     Absatz blendet leicht verzögert ein.
 *   data-reveal="doors"    Bild öffnet sich wie Containertüren, von der
 *                          Mitte nach außen. Gedacht für die Bildhülle
 *                          (overflow: hidden); ein direktes <img> darin
 *                          zoomt beim Öffnen leicht zurück.
 *   data-reveal="stagger"  Die direkten Kinder (Liste, Raster) erscheinen
 *                          nacheinander.
 *
 *   data-reveal-delay="120"  optional, zusätzliche Verzögerung in ms.
 *
 * Regeln:
 * - Ohne JavaScript, vor der Hydration und bei prefers-reduced-motion:
 *   reduce ist nichts versteckt. Der Startzustand gilt erst, wenn
 *   <html> die Klasse .js-reveal trägt; die setzt RevealRoot beim Mount
 *   (Styles: app/hafen.css, Block „Reveal“).
 * - Was beim Mount schon im Bild ist, bleibt einfach stehen.
 * - Jedes Element wird genau einmal ausgelöst. Zustand am Element:
 *   data-reveal-state="in" (läuft) → "done" (Endzustand, keine Styles).
 * - Elemente, die gleichzeitig ins Bild kommen, laufen in
 *   Dokumentreihenfolge gestaffelt an (Überschrift vor Absatz).
 * - Später eingefügte Elemente (z. B. nach einem Tab-Wechsel) werden
 *   automatisch erfasst.
 * - Bekommt ein noch verstecktes Element (oder etwas darin oder darum)
 *   den Tastaturfokus, steht es sofort im Endzustand da.
 *
 * Außerdem setzt RevealRoot nach dem Laden html.seite-geladen; erst dann
 * werden Abschnitte mit .spaeter-geladen übersprungen (app/hafen.css,
 * Block „Später rendern“).
 *
 * ── imBildBeimStart(el, anteil, cb) ───────────────────────────────
 * Meldet einmal (asynchron, ohne erzwungenes Layout), ob das Element
 * beim Mount schon im Bild ist: obere Kante oberhalb von anteil × Bild-
 * höhe und untere Kante unterhalb des oberen Rands. Gibt eine Funktion
 * zum Abbrechen zurück. Für Effekte, die beim Hydrieren sonst mit
 * getBoundingClientRect ein Layout der ganzen Seite erzwingen würden.
 *
 * ── useLaufzeit(ref) ───────────────────────────────────────────────
 * Setzt data-run="true" am Element, solange es (fast) im Bild ist und
 * der Tab sichtbar ist, sonst data-run="false". Dauer-Animationen
 * laufen per CSS nur unter [data-run="true"].
 */

const SELECTOR = "[data-reveal]";
/** Abstand zwischen Elementen, die gleichzeitig ins Bild kommen. */
const STEP_MS = 90;
/** Höchstens so viele Stufen, damit späte Elemente nicht warten. */
const MAX_STEPS = 5;

type State = "in" | "done";

function setState(el: HTMLElement, state: State) {
  el.dataset.revealState = state;
}

export function RevealRoot() {
  // Später rendern (app/hafen.css, .spaeter-geladen): erst nach dem Laden
  // und zwei weiteren Bildern, damit jeder Abschnitt einmal gelegt ist
  // und der Browser sich seine echte Höhe gemerkt hat. Ändert sich die
  // Breite (Fenster, Handy gedreht), stimmen die gemerkten Höhen nicht
  // mehr: dann kurz alles legen und neu merken lassen.
  useEffect(() => {
    const html = document.documentElement;
    let f1 = 0;
    let f2 = 0;
    let warten = 0;
    let breite = window.innerWidth;
    const an = () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      f1 = requestAnimationFrame(() => {
        f2 = requestAnimationFrame(() => html.classList.add("seite-geladen"));
      });
    };
    const onResize = () => {
      if (window.innerWidth === breite) return;
      breite = window.innerWidth;
      html.classList.remove("seite-geladen");
      window.clearTimeout(warten);
      warten = window.setTimeout(an, 250);
    };
    if (document.readyState === "complete") an();
    else window.addEventListener("load", an, { once: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("load", an);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(warten);
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      html.classList.remove("seite-geladen");
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) return;

    const frames = new Set<number>();
    const timers = new Set<number>();

    const finish = (el: HTMLElement) => {
      setState(el, "done");
      el.style.removeProperty("--reveal-delay");
    };

    const start = (el: HTMLElement, delay: number) => {
      if (el.dataset.revealState) return;
      el.style.setProperty("--reveal-delay", `${delay}ms`);
      setState(el, "in");
      // Nach der letzten eigenen Animation (Präfix „rv-“) aufräumen.
      // Fremde Endlos-Animationen im Inneren zählen nicht mit.
      const raf = requestAnimationFrame(() => {
        frames.delete(raf);
        const own = (el.getAnimations?.({ subtree: true }) ?? []).filter(
          (a) => "animationName" in a && String((a as CSSAnimation).animationName).startsWith("rv-"),
        );
        if (!own.length) return finish(el);
        Promise.all(own.map((a) => a.finished)).then(
          () => finish(el),
          () => finish(el),
        );
      });
      frames.add(raf);
      // Sicherheitsnetz, falls ein finished-Promise nie auflöst.
      const t = window.setTimeout(() => {
        timers.delete(t);
        if (el.dataset.revealState === "in") finish(el);
      }, delay + 3200);
      timers.add(t);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        hits.forEach((el, i) => {
          io.unobserve(el);
          const extra = Number(el.dataset.revealDelay) || 0;
          start(el, Math.min(i, MAX_STEPS) * STEP_MS + extra);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const arm = (el: HTMLElement) => {
      if (el.dataset.revealState) return;
      io.observe(el);
    };

    // Beim Mount: Was schon im Bild ist, bleibt stehen, sonst würde es kurz
    // verschwinden. Gefragt wird per IntersectionObserver statt mit
    // getBoundingClientRect, damit das Hydrieren kein Layout der ganzen
    // Seite erzwingt. Der erste Rückruf bringt alle Elemente auf einmal;
    // erst danach wird der Startzustand scharf geschaltet.
    const probe = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        probe.unobserve(el);
        if (e.isIntersecting) finish(el);
        else arm(el);
      }
      html.classList.add("js-reveal");
    });
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => probe.observe(el));

    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as HTMLElement;
          if (el.matches(SELECTOR)) arm(el);
          if (el.firstElementChild) el.querySelectorAll<HTMLElement>(SELECTOR).forEach((c) => arm(c));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Tastaturfokus in oder auf einem noch versteckten Element: sofort
    // im Endzustand zeigen, ohne Einblendung. Gesucht wird nach oben (das
    // Element umschließt den Fokus) und nach unten (der fokussierte Link
    // umschließt z. B. eine Bildhülle mit data-reveal="doors").
    const zeigen = (el: HTMLElement) => {
      if (el.dataset.revealState) return;
      io.unobserve(el);
      finish(el);
    };
    const onFocus = (e: FocusEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const el = target.closest<HTMLElement>(SELECTOR);
      if (el) zeigen(el);
      target.querySelectorAll<HTMLElement>(SELECTOR).forEach(zeigen);
    };
    document.addEventListener("focusin", onFocus);

    // Wird reduzierte Bewegung nachträglich eingeschaltet: alles zeigen.
    const onReduce = () => {
      if (!reduce.matches) return;
      probe.disconnect();
      io.disconnect();
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(finish);
      html.classList.remove("js-reveal");
    };
    reduce.addEventListener("change", onReduce);

    return () => {
      probe.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("focusin", onFocus);
      reduce.removeEventListener("change", onReduce);
      frames.forEach((f) => cancelAnimationFrame(f));
      timers.forEach((t) => window.clearTimeout(t));
      html.classList.remove("js-reveal");
    };
  }, []);

  return null;
}

export function imBildBeimStart(el: Element, anteil: number, cb: (imBild: boolean) => void) {
  if (!("IntersectionObserver" in window)) {
    cb(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    ([e]) => {
      io.disconnect();
      cb(e.isIntersecting);
    },
    { rootMargin: `0px 0px ${Math.round((anteil - 1) * 100)}% 0px` },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * data-run="true|false" je nach Sichtbarkeit (IntersectionObserver mit
 * etwas Vorlauf) und Tab-Zustand (document.hidden). Optional meldet
 * onChange den Wechsel, z. B. um eine rAF-Schleife anzuhalten.
 */
export function useLaufzeit(
  ref: RefObject<Element | null>,
  onChange?: (run: boolean) => void,
  rootMargin = "120px 0px",
) {
  // Immer die aktuelle Rückruf-Funktion verwenden, ohne den Observer
  // bei jedem Rendern neu aufzubauen.
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = false;
    let last: boolean | null = null;
    const apply = () => {
      const run = inView && !document.hidden;
      if (run === last) return;
      last = run;
      el.setAttribute("data-run", String(run));
      cb.current?.(run);
    };
    const io =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([e]) => {
              inView = e.isIntersecting;
              apply();
            },
            { rootMargin },
          )
        : null;
    if (io) io.observe(el);
    else {
      inView = true;
      apply();
    }
    document.addEventListener("visibilitychange", apply);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [ref, rootMargin]);
}

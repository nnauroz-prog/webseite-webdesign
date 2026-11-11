"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { lichtFuer } from "@/components/marketing/hafen/hero-licht";

/**
 * Kleine Besonderheiten, einmal im Layout eingesetzt:
 *
 * 1. Fähre als Lesefortschritt: Am oberen Bildrand fährt eine kleine
 *    Fähre von links nach rechts, so weit wie die Seite gescrollt ist,
 *    und zieht eine orange Linie hinter sich her.
 * 2. Karten kippen am Rechner leicht zum Mauszeiger ([data-kipp]) und
 *    bekommen einen Lichtfleck. Nur mit feinem Zeiger, nie am Handy.
 *
 * 4. Sätze mit [data-leucht] werden beim Scrollen Wort für Wort dunkel;
 *    der Doppelring im Logo dreht sich mit dem Lesefortschritt.
 * 3. Fotos mit [data-para] wandern beim Scrollen deutlich langsamer als
 *    ihr Rahmen (Tiefe, bis 80 px) und zoomen dabei von groß nach kleiner
 *    (--py und --pz; die Styles stehen in app/effekte-gross.css).
 *
 * Bei reduzierter Bewegung bleibt alles aus. Nichts davon trägt Inhalt.
 */
/** Größter Weg der Fotos gegen ihren Rahmen (px je Bildschirmhöhe). */
const PARA_WEG = 80;
/** Zoom der Fotos: beim Hereinkommen ZOOM_VON, beim Hinausgehen ZOOM_HUB weniger. */
const ZOOM_VON = 1.32;
const ZOOM_HUB = 0.22;
/** Höchstens so viel zusätzlicher Zoom, damit kleine Rahmen gedeckt bleiben. */
const ZOOM_PLUS_MAX = 0.12;

export function Effekte() {
  const pfad = usePathname();
  const spurRef = useRef<HTMLDivElement | null>(null);
  const aus = pfad?.startsWith("/admin") || pfad?.startsWith("/angebot/");

  // Himmel über Hamburg: Morgen, Tag, Abend oder Nacht nach dem echten
  // Sonnenstand; färbt den oberen Seitenrand auf allen Seiten.
  useEffect(() => {
    const setzen = () => {
      document.documentElement.dataset.himmel = lichtFuer(new Date());
    };
    setzen();
    const takt = window.setInterval(setzen, 5 * 60_000);
    return () => window.clearInterval(takt);
  }, []);

  // Seitenwechsel: Der kräftige Wechsel (app/effekte-band.css) läuft nur,
  // wenn wirklich ein Link zu einer anderen Seite angetippt wurde. Dafür
  // bekommt <html> beim Antippen data-wechsel und in --wechsel-y die Mitte
  // des sichtbaren Ausschnitts (Drehpunkt der alten Seite). Ohne die Marke
  // bleibt jeder andere Wechsel bei der ruhigen Fassung.
  const wechselAus = useRef(0);
  useEffect(() => {
    const wurzel = document.documentElement;
    const onKlick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const link =
        e.target instanceof Element
          ? e.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      if (
        link.origin !== window.location.origin ||
        link.pathname === window.location.pathname
      )
        return;
      wurzel.style.setProperty(
        "--wechsel-y",
        `${Math.round(window.scrollY + window.innerHeight / 2)}px`,
      );
      // Aus dem Handy-Menü heraus: „menue“ (Leiste und Fähre bleiben
      // bis zum Ende des Wechsels aus, app/effekte-band.css).
      wurzel.setAttribute(
        "data-wechsel",
        link.closest("#mobile-menu") ? "menue" : "",
      );
      // Kommt kein Wechsel zustande, verfällt die Marke.
      window.clearTimeout(wechselAus.current);
      wechselAus.current = window.setTimeout(
        () => wurzel.removeAttribute("data-wechsel"),
        6000,
      );
    };
    document.addEventListener("click", onKlick, true);
    return () => {
      document.removeEventListener("click", onKlick, true);
      window.clearTimeout(wechselAus.current);
    };
  }, []);
  // Die neue Seite steht: Die Marke bleibt, bis der Wechsel abgelaufen ist.
  useEffect(() => {
    const wurzel = document.documentElement;
    if (!wurzel.hasAttribute("data-wechsel")) return;
    window.clearTimeout(wechselAus.current);
    wechselAus.current = window.setTimeout(
      () => wurzel.removeAttribute("data-wechsel"),
      1400,
    );
  }, [pfad]);

  useEffect(() => {
    const spur = spurRef.current;
    if (!spur || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let raf = 0;
    // Fotos mit data-para wandern beim Scrollen langsamer als ihr Rahmen
    // und zoomen dabei. Die ersten Werte gleiten weich ein (data-para-start),
    // damit beim Laden nichts springt.
    const fotos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-para]"),
    );
    // Ältere Browser ohne die Einzel-Eigenschaft „scale“ behalten den
    // kleinen Weg zum festen Zoom aus apple.css.
    const grosseTiefe =
      typeof CSS !== "undefined" && CSS.supports("scale", "1.2");
    for (const f of fotos) f.setAttribute("data-para-start", "");
    const startAus = window.setTimeout(() => {
      for (const f of fotos) f.removeAttribute("data-para-start");
    }, 1000);
    // Sätze mit data-leucht: Wort für Wort wird beim Scrollen dunkel.
    const saetze = Array.from(
      document.querySelectorAll<HTMLElement>("[data-leucht]"),
    ).map((el) => {
      if (!el.dataset.leuchtBereit && el.children.length === 0) {
        const woerter = (el.textContent ?? "").trim().split(/\s+/);
        el.textContent = "";
        woerter.forEach((w, i) => {
          const s = document.createElement("span");
          s.textContent = w;
          el.append(s);
          if (i < woerter.length - 1) el.append(" ");
        });
        el.dataset.leuchtBereit = "1";
      }
      return {
        el,
        woerter: Array.from(el.querySelectorAll<HTMLElement>(":scope > span")),
        an: -1,
      };
    });
    const kopf = document.getElementById("start");
    // Gemessen wird die ruhende Hülle um den Kopf (kran-banner.tsx): Der
    // Kopf selbst verkleinert und kippt sich und würde sich sonst selbst
    // nachlaufen. --weg vererbt sich von der Hülle an den Kopf.
    const kopfHuelle =
      kopf?.closest<HTMLElement>("[data-kopf-huelle]") ?? kopf ?? null;
    // Himmelslicht: folgt dem Scrollen etwas langsamer, nie über main hinaus
    // (1000 statt 820 px Höhe: Luft für das langsame Atmen des Lichts).
    const haupt = document.getElementById("main");
    let lichtMax = haupt ? Math.max(0, haupt.offsetHeight - 1000) : 0;
    let lichtY = -1;
    // Route (Ablauf): Fortschritt entlang der Liste und der Halt in Bildmitte.
    const routen = Array.from(
      document.querySelectorAll<HTMLElement>("[data-route], [data-fokus]"),
    ).map((el) => ({
      el,
      halte: Array.from(
        el.querySelectorAll<HTMLElement>(
          el.hasAttribute("data-fokus") ? ":scope > *" : "ol > li",
        ),
      ),
      aktiv: -2,
    }));
    const messen = () => {
      raf = 0;
      const vh = window.innerHeight;
      // Erst alles messen, dann alles schreiben: Jedes Schreiben zwischen
      // zwei Messungen zwänge den Browser, Stil und Layout der Seite
      // mitten im Bild neu zu rechnen (einmal je Foto und Liste).
      const schreiben: Array<() => void> = [];
      for (const r of routen) {
        const b = r.el.getBoundingClientRect();
        if (b.bottom < -200 || b.top > vh + 200) continue;
        const rp =
          b.height > 0
            ? Math.min(1, Math.max(0, (vh * 0.5 - b.top) / b.height))
            : 0;
        const ry = `${(rp * b.height).toFixed(1)}px`;
        schreiben.push(() => {
          r.el.style.setProperty("--rp", rp.toFixed(4));
          r.el.style.setProperty("--ry", ry);
        });
        let aktiv = -1;
        r.halte.forEach((h, i) => {
          const hb = h.getBoundingClientRect();
          if (hb.top <= vh * 0.5 && hb.bottom >= vh * 0.5) aktiv = i;
        });
        if (aktiv !== r.aktiv) {
          r.aktiv = aktiv;
          schreiben.push(() => {
            r.el.toggleAttribute("data-route-an", aktiv >= 0);
            r.halte.forEach((h, i) =>
              h.toggleAttribute("data-aktiv", i === aktiv),
            );
          });
        }
      }
      if (haupt) {
        // Höhe jedes Mal frisch: Abschnitte wachsen beim Scrollen nach.
        lichtMax = Math.max(0, haupt.offsetHeight - 1000);
        const y = Math.round(Math.min(window.scrollY * 0.9, lichtMax));
        if (y !== lichtY) {
          lichtY = y;
          schreiben.push(() => haupt.style.setProperty("--licht-y", `${y}px`));
        }
      }
      if (kopfHuelle) {
        const r = kopfHuelle.getBoundingClientRect();
        const weg =
          r.height > 0 ? Math.min(1, Math.max(0, -r.top / r.height)) : 0;
        schreiben.push(() =>
          kopfHuelle.style.setProperty("--weg", weg.toFixed(3)),
        );
      }
      for (const s of saetze) {
        if (s.woerter.length === 0) continue;
        const r = s.el.getBoundingClientRect();
        if (r.bottom < -40 || r.top > vh + 40) continue;
        const k = Math.min(
          1,
          Math.max(0, (vh * 0.88 - r.top) / (r.height + vh * 0.3)),
        );
        const an = Math.round(k * s.woerter.length);
        if (an === s.an) continue;
        s.an = an;
        schreiben.push(() =>
          s.woerter.forEach((w, i) => w.toggleAttribute("data-an", i < an)),
        );
      }
      for (const f of fotos) {
        const r = f.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        const h = r.height;
        if (h <= 0) continue;
        const mitte = (r.top + h / 2 - vh / 2) / vh;
        if (!grosseTiefe) {
          schreiben.push(() =>
            f.style.setProperty("--py", `${(-mitte * 34).toFixed(1)}px`),
          );
          continue;
        }
        // 0, wenn der Rahmen unten hereinkommt; 1, wenn er oben hinaus ist.
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + h)));
        // Am knappsten ist es, wenn eine Rahmenkante gerade am Bildrand
        // steht: Dort muss das vergrößerte Foto den Rahmen noch decken.
        // Kleine Rahmen bekommen dafür etwas mehr Zoom, zur Not weniger Weg.
        const rand = 0.5 - h / (2 * vh);
        let wegPx = PARA_WEG;
        let plus = 0;
        if (rand > 0) {
          const zoomRand = ZOOM_VON - ZOOM_HUB * (vh / (vh + h));
          const noetig = 1.02 + (2 * PARA_WEG * rand) / h;
          plus = Math.min(ZOOM_PLUS_MAX, Math.max(0, noetig - zoomRand));
          const frei = ((zoomRand + plus - 1.02) * h) / 2;
          wegPx = Math.min(PARA_WEG, Math.max(0, frei / rand));
        }
        const py = `${(-mitte * wegPx).toFixed(1)}px`;
        const pz = (ZOOM_VON + plus - ZOOM_HUB * p).toFixed(4);
        schreiben.push(() => {
          f.style.setProperty("--py", py);
          f.style.setProperty("--pz", pz);
        });
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 200 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      for (const s of schreiben) s();
      spur.style.setProperty("--p", p.toFixed(4));
      document.documentElement.style.setProperty("--seite-p", p.toFixed(4));
      spur.dataset.an = p > 0.012 ? "1" : "0";
    };
    const onGroesse = () => {
      lichtMax = haupt ? Math.max(0, haupt.offsetHeight - 1000) : 0;
      onScroll();
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(messen);
    };
    messen();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onGroesse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onGroesse);
      haupt?.style.removeProperty("--licht-y");
      window.clearTimeout(startAus);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pfad]);

  useEffect(() => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let aktiv: HTMLElement | null = null;
    const loesen = () => {
      if (!aktiv) return;
      aktiv.removeAttribute("data-kipp-an");
      aktiv.style.removeProperty("--kx");
      aktiv.style.removeProperty("--ky");
      aktiv = null;
    };
    const onMove = (e: PointerEvent) => {
      const ziel =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>("[data-kipp]")
          : null;
      if (ziel !== aktiv) loesen();
      if (!ziel) return;
      aktiv = ziel;
      const r = ziel.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      ziel.setAttribute("data-kipp-an", "");
      ziel.style.setProperty("--kx", `${((x - 0.5) * 5).toFixed(2)}deg`);
      ziel.style.setProperty("--ky", `${((0.5 - y) * 5).toFixed(2)}deg`);
      ziel.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      ziel.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", loesen);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", loesen);
      loesen();
    };
  }, []);

  // Welle: Ein angetippter Knopf sendet einmal zwei Ringe nach außen.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onDown = (e: PointerEvent) => {
      const knopf =
        e.target instanceof Element
          ? e.target.closest<HTMLElement>(".btn-signal, .btn-line")
          : null;
      if (!knopf) return;
      knopf.removeAttribute("data-welle");
      void knopf.offsetWidth;
      knopf.setAttribute("data-welle", "");
      window.setTimeout(() => knopf.removeAttribute("data-welle"), 1000);
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  if (aus) return null;
  return (
    <div
      ref={spurRef}
      className="faehr-fortschritt"
      data-an="0"
      aria-hidden="true"
    >
      <span className="faehr-linie" />
      <span className="faehr-boot">
        <svg viewBox="0 0 26 14" width="26" height="14" focusable="false">
          <path
            d="M1 8h24l-2.6 4.2a2 2 0 0 1-1.7.8H5.3a2 2 0 0 1-1.7-.8z"
            fill="#1d1d1f"
          />
          <path d="M1.6 8h22.8l-.7 1.2H2.3z" fill="#f45b1e" />
          <rect
            x="6"
            y="3.2"
            width="12"
            height="4.8"
            rx="1"
            fill="#fff"
            stroke="#1d1d1f"
            strokeWidth="0.8"
          />
          <rect x="8" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="11.2" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="14.4" y="4.6" width="2" height="1.6" fill="#1d1d1f" />
          <rect x="15.4" y="0.6" width="1.8" height="2.6" fill="#f45b1e" />
        </svg>
      </span>
    </div>
  );
}

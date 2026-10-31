"use client";

/**
 * Bühne des Kopfbereichs: eine kleine Client-Hülle um den Server-Inhalt.
 *
 * - Ladebetrieb: spielt die Zeitleiste aus hero-zeitleiste.ts ab. Ein
 *   requestAnimationFrame-Takt, Zustand in Variablen, Transforms direkt
 *   auf die SVG-Gruppen (data-kb-Haken). Kein React-Render pro Frame.
 * - Startet, sobald die Zeichnung zur Hälfte sichtbar ist (auf dem Handy
 *   also beim Hinscrollen), und läuft nur, solange sie sichtbar ist und
 *   der Tab im Vordergrund liegt.
 * - Seile pendeln: gedämpftes Pendel, angetrieben von der Beschleunigung
 *   der Katze, Pendellänge aus der Seillänge; vor dem Absetzen geführt.
 * - Tiefe: Stadt langsamer, Vordergrund-Wasser schneller, Textspalte
 *   schiebt sich hoch und wird blasser (nur breite Fenster). Mit Maus
 *   verschieben sich die Ebenen um wenige Einheiten, weich nachgeführt.
 * - Licht nach dem Sonnenstand über Hamburg (hero-licht.ts), Vorschau
 *   mit ?licht=morgen|tag|abend|nacht.
 * - prefers-reduced-motion: nichts davon läuft (außer dem Licht), das
 *   CSS zeigt ein vollständiges Standbild.
 * - Sparsam: Der Takt läuft nur, solange es etwas zu bewegen gibt (Lade-
 *   betrieb gestartet, Scrollen, Zeiger). Auf Touch-Geräten genügen
 *   30 Bilder pro Sekunde; die Bewegungen sind langsam, und jedes Bild
 *   malt das ganze Szenen-SVG neu. Dort laufen auch die CSS-Dauer-
 *   animationen der Zeichnung (Wellen, Reflexe, Fähre) im selben Takt:
 *   Sie werden pausiert und hier weitergestellt, sonst malten sie die
 *   Szene in den übersprungenen Bildern doch wieder neu.
 */

import { useEffect, useRef, type ReactNode } from "react";

import { LICHTER, lichtFuer, type Licht } from "./hero-licht";
import {
  FARBEN,
  KAI_OBEN,
  LADUNG,
  PLATZ_OBEN,
  SEIL_OBEN,
  dunkel,
  schiffLage,
  zyklus,
  type Zustand,
} from "./hero-zeitleiste";

export function HeroBuehne({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const stopLicht = lichtStarten(root);
    const stopMotor = motorStarten(root);
    return () => {
      stopLicht();
      stopMotor();
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function lichtStarten(root: HTMLElement) {
  let vorschau: Licht | null = null;
  try {
    const p = new URLSearchParams(window.location.search).get("licht");
    if (p && (LICHTER as readonly string[]).includes(p)) vorschau = p as Licht;
  } catch {
    /* ohne Vorschau */
  }
  const setzen = () => {
    const l = vorschau ?? lichtFuer(new Date());
    if (root.dataset.licht !== l) root.dataset.licht = l;
  };
  setzen();
  const id = window.setInterval(setzen, 60_000);
  return () => window.clearInterval(id);
}

/* ------------------------------------------------------------------ */

/** Grad pro Bogenmaß */
const GRAD = 180 / Math.PI;
/** Meter pro Zeichnungseinheit (ein Container ist 2,44 m breit = 46 Einheiten). */
const METER = 2.44 / 46;
/** Kopplung der Katzbeschleunigung an das Pendel (Zeichnung läuft etwa doppelt so schnell wie echt). */
const KOPPLUNG = 0.0002;
/** Dämpfung während der Fahrt und im Stand (Pendeldämpfung moderner Brücken). */
const DAEMPFUNG_FAHRT = 0.15;
const DAEMPFUNG_STAND = 0.5;
/** Auf den letzten Einheiten vor dem Absetzen wird die Last geführt. */
const FUEHRUNG = 50;

function motorStarten(root: HTMLElement) {
  const art = root.querySelector<HTMLElement>('[data-kb="art"]');
  if (!art) return () => {};

  const alle = (k: string) => Array.from(root.querySelectorAll<SVGElement>(`[data-kb="${k}"]`));
  const eins = (k: string) => root.querySelector<SVGElement>(`[data-kb="${k}"]`);

  const hub = Number(art.dataset.hub) || 0;
  const z = zyklus(hub);

  const el = {
    katze: alle("katze"),
    pendel: eins("pendel"),
    seile: alle("seil"),
    spreader: eins("spreader"),
    last: eins("last"),
    plaetze: alle("platz"),
    kaiR: eins("kai-r"),
    kaiL: eins("kai-l"),
    schiff: alle("schiff"),
    schlepper: eins("schlepper"),
    leine: eins("leine"),
    fern: alle("fern"),
    nah: eins("nah"),
    leader: alle("leader"),
    schilder: Array.from(root.querySelectorAll<HTMLElement>('[data-kb="schild"]')),
    copy: root.querySelector<HTMLElement>('[data-kb="copy"]'),
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fein = window.matchMedia("(hover: hover) and (pointer: fine)");
  const breit = window.matchMedia("(min-width: 1024px)");
  const grob = window.matchMedia("(pointer: coarse)");

  /* Nur schreiben, was sich geändert hat. */
  const zuletzt = new WeakMap<Element, Record<string, string>>();
  const setze = (e: Element | null | undefined, name: string, wert: string) => {
    if (!e) return;
    let m = zuletzt.get(e);
    if (!m) {
      m = {};
      zuletzt.set(e, m);
    }
    if (m[name] === wert) return;
    m[name] = wert;
    if (name === "data-on") (e as HTMLElement).dataset.on = wert;
    else if (wert === "") e.removeAttribute(name);
    else e.setAttribute(name, wert);
  };
  const setzeStil = (e: HTMLElement | null, transform: string, opacity: string) => {
    if (!e) return;
    if (e.style.transform !== transform) e.style.transform = transform;
    if (e.style.opacity !== opacity) e.style.opacity = opacity;
  };
  const faerben = (g: Element | null, idx: number) => {
    if (!g || idx < 0) return;
    const c = LADUNG[idx];
    setze(g, "color", dunkel(c) ? "#fff" : "#000");
    setze(g.querySelector("[data-kb-farbe]"), "fill", FARBEN[c]);
  };

  let zeit = z.T0;
  let gestartet = false;
  let verzug = 0.35;
  let sichtbar = false;
  let raf = 0;
  let vorher = 0;
  // Pendel (Bogenmaß) und wie frei die Last gerade schwingen darf (0 bis 1)
  let winkel = 0;
  let drehung = 0;
  let frei = 1;
  // Zeiger, Ziel und geglättet (-1 bis 1)
  let zielX = 0;
  let zielY = 0;
  let zx = 0;
  let zy = 0;
  // Tiefe nur neu rechnen, wenn gescrollt wurde, sich die Größe geändert
  // hat oder die Zeiger-Glättung noch läuft. getBoundingClientRect in
  // jedem Frame erzwingt sonst ein synchrones Layout, beim Laden der
  // Seite (Hydrieren, Schriften, Bilder) jedes Mal über die ganze Seite.
  let tiefeOffen = true;

  // Touch-Geräte: endlose CSS-Animationen der Zeichnung im 30-fps-Takt.
  const imTakt = grob.matches && typeof art.getAnimations === "function" && typeof CSSAnimation !== "undefined";
  let css: Animation[] = [];
  const cssHolen = () => {
    if (!imTakt) return;
    css = reduce.matches
      ? []
      : art
          .getAnimations({ subtree: true })
          .filter((a) => a instanceof CSSAnimation && a.effect?.getTiming().iterations === Infinity);
    for (const a of css) if (a.playState !== "paused") a.pause();
  };
  const cssWeiter = (dt: number) => {
    for (const a of css) a.currentTime = Number(a.currentTime ?? 0) + dt * 1000;
  };

  const anwenden = (st: Zustand, ohneBewegung = false) => {
    const kx = `translate(${st.katze.toFixed(2)} 0)`;
    for (const k of el.katze) setze(k, "transform", kx);
    const sicht = winkel * frei;
    setze(el.pendel, "transform", Math.abs(sicht) < 1e-5 ? "" : `rotate(${(-sicht * GRAD).toFixed(3)} 0 ${SEIL_OBEN})`);
    const y2 = (st.haken - 8).toFixed(2);
    for (const s of el.seile) setze(s, "y2", y2);
    setze(el.spreader, "transform", `translate(0 ${st.haken.toFixed(2)})`);
    setze(el.last, "visibility", st.last < 0 ? "hidden" : "visible");
    faerben(el.last, st.last);
    el.plaetze.forEach((p, k) => setze(p, "visibility", k < st.geladen ? "visible" : "hidden"));
    faerben(el.kaiR, st.kai[0]);
    faerben(el.kaiL, st.kai[1]);

    const lage = schiffLage(st.quer, st.ferne);
    const op = lage.deckkraft > 0.999 ? "" : lage.deckkraft.toFixed(3);
    for (const g of el.schiff) {
      setze(g, "transform", lage.transform);
      setze(g, "opacity", op);
    }
    setze(el.leine, "stroke-dashoffset", (1 - st.leine).toFixed(3));
    setze(el.leine, "visibility", st.leine < 0.01 ? "hidden" : "visible");

    const sch = st.schlepper;
    setze(el.schlepper, "visibility", sch < 0.01 ? "hidden" : "visible");
    setze(el.schlepper, "opacity", sch.toFixed(3));
    setze(el.schlepper, "transform", `translate(${(114 + st.quer - (1 - sch) * 70).toFixed(2)} 640)`);

    el.schilder.forEach((s, k) => setze(s, "data-on", k === st.schild ? "1" : "0"));
    el.leader.forEach((s, k) => setze(s, "data-on", k === st.schild ? "1" : "0"));

    if (ohneBewegung) {
      for (const f of el.fern) setze(f, "transform", "");
      setze(el.nah, "transform", "");
      setzeStil(el.copy, "", "");
    }
  };

  const zeigerRuhig = () => Math.abs(zielX - zx) < 0.002 && Math.abs(zielY - zy) < 0.002;

  const tiefe = () => {
    if (!tiefeOffen && zeigerRuhig()) return;
    tiefeOffen = false;
    const vh = window.innerHeight || 1;
    const r = art.getBoundingClientRect();
    // 0, solange die Zeichnung unterhalb der Bildmitte liegt; danach wächst der Wert.
    const o = Math.max(0, -(r.top + r.height / 2 - vh / 2) / vh);
    let copyT = "";
    let copyO = "";
    if (breit.matches && el.copy) {
      const h = root.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -h.top / Math.max(1, h.height)));
      if (p > 0.0005) {
        copyT = `translate3d(0, ${(-p * 64).toFixed(1)}px, 0)`;
        // Nicht unter 0,9: Die Linkzeile behält so AA-Kontrast, solange
        // sie noch im Bild steht.
        copyO = Math.max(0.9, 1 - p * 0.6).toFixed(3);
      }
    }
    zx += (zielX - zx) * 0.06;
    zy += (zielY - zy) * 0.06;
    const fernX = -zx * 6;
    const fernY = o * 34 - zy * 2.5;
    const nahX = zx * 9;
    const nahY = -o * 22 + zy * 1.5;
    const fT = Math.abs(fernX) + Math.abs(fernY) < 0.01 ? "" : `translate(${fernX.toFixed(2)} ${fernY.toFixed(2)})`;
    for (const f of el.fern) setze(f, "transform", fT);
    setze(el.nah, "transform", Math.abs(nahX) + Math.abs(nahY) < 0.01 ? "" : `translate(${nahX.toFixed(2)} ${nahY.toFixed(2)})`);
    setzeStil(el.copy, copyT, copyO);
  };

  /* Gedämpftes Pendel, angetrieben von der Katzbeschleunigung. Kurz vor
     dem Absetzen (auf dem Schiff wie auf dem Kai) wird die Last geführt:
     starke Dämpfung, und der sichtbare Ausschlag läuft auf null. So setzt
     der Container genau auf seinem Platz auf, ohne Sprung. */
  const platzOben = PLATZ_OBEN - hub;
  const pendeln = (dt: number, st: Zustand) => {
    if (!gestartet) return;
    const h = 1 / 120;
    const x0 = z.katzeBei(zeit - h);
    const x1 = z.katzeBei(zeit);
    const x2 = z.katzeBei(zeit + h);
    const a = (x2 - 2 * x1 + x0) / (h * h);
    const v = (x2 - x0) / (2 * h);
    const laenge = Math.max(1.5, (st.haken - 8 - SEIL_OBEN) * METER);
    const w = Math.sqrt(9.81 / laenge);
    const nah = Math.min(Math.abs(st.haken - platzOben), Math.abs(st.haken - KAI_OBEN));
    frei = Math.min(1, nah / FUEHRUNG);
    const d = (Math.abs(v) < 2 ? DAEMPFUNG_STAND : DAEMPFUNG_FAHRT) + (1 - frei) * 4;
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));
    const sdt = dt / n;
    for (let i = 0; i < n; i++) {
      const acc = -w * w * winkel - 2 * d * w * drehung - KOPPLUNG * a * frei;
      drehung += acc * sdt;
      winkel += drehung * sdt;
    }
    winkel = Math.max(-0.035, Math.min(0.035, winkel));
  };

  const laeuft = () => sichtbar && !document.hidden && !reduce.matches;
  /** Gibt es im nächsten Bild etwas zu tun? */
  const gebraucht = () => gestartet || tiefeOffen || !zeigerRuhig() || css.length > 0;

  // Touch-Geräte: das nächste Bild erst nach einer Pause anfordern (30 fps,
  // auch bei 120 Hz). Ein angefordertes, aber übersprungenes Bild würde
  // den Browser trotzdem einen ganzen Durchlauf bis zum Malen machen lassen.
  let pause = 0;
  const planen = () => {
    if (!grob.matches) {
      raf = window.requestAnimationFrame(takt);
      return;
    }
    pause = window.setTimeout(() => {
      pause = 0;
      if (laeuft()) raf = window.requestAnimationFrame(takt);
    }, 22);
  };
  const anhalten = () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (pause) window.clearTimeout(pause);
    raf = 0;
    pause = 0;
  };

  const takt = (ts: number) => {
    raf = 0;
    if (!laeuft()) return;
    const dt = vorher ? Math.min(0.05, Math.max(0, (ts - vorher) / 1000)) : 1 / 60;
    vorher = ts;
    if (gestartet) {
      if (verzug > 0) verzug -= dt;
      else zeit += dt;
    }
    tiefe();
    const st = z.zustand(zeit);
    pendeln(dt, st);
    anwenden(st);
    cssWeiter(dt);
    if (gebraucht()) planen();
  };

  /** Takt anwerfen, falls er gerade ruht und etwas zu tun ist. */
  const wecken = () => {
    if (raf || pause || !laeuft() || !gebraucht()) return;
    vorher = 0;
    raf = window.requestAnimationFrame(takt);
  };

  const steuern = () => {
    const an = laeuft();
    root.toggleAttribute("data-kb-pause", !an);
    if (an) {
      tiefeOffen = true;
      wecken();
    } else {
      anhalten();
    }
  };

  const io = new IntersectionObserver(
    (eintraege) => {
      for (const e of eintraege) {
        sichtbar = e.isIntersecting;
        if (!gestartet && e.intersectionRatio >= 0.45) gestartet = true;
      }
      steuern();
    },
    { threshold: [0, 0.25, 0.45, 0.7, 1] },
  );
  io.observe(art);

  const onReduce = () => {
    cssHolen();
    if (reduce.matches) {
      // Zurück ins Standbild; das CSS legt die restliche Ladung nach.
      winkel = 0;
      drehung = 0;
      frei = 1;
      zeit = z.T0;
      anwenden(z.zustand(z.T0), true);
    }
    steuern();
  };
  const onZeiger = (e: PointerEvent) => {
    if (!fein.matches || e.pointerType !== "mouse") return;
    const r = root.getBoundingClientRect();
    zielX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1));
    zielY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1));
    wecken();
  };
  const onRaus = () => {
    zielX = 0;
    zielY = 0;
    wecken();
  };
  const onScroll = () => {
    tiefeOffen = true;
    wecken();
  };
  // Größe geändert: Tiefe neu rechnen. Media Queries können dabei CSS-
  // Animationen an- oder abschalten, deshalb die Liste neu holen.
  const ro =
    "ResizeObserver" in window
      ? new ResizeObserver(() => {
          cssHolen();
          onScroll();
        })
      : null;
  cssHolen();
  ro?.observe(root);

  document.addEventListener("visibilitychange", steuern);
  reduce.addEventListener("change", onReduce);
  root.addEventListener("pointermove", onZeiger, { passive: true });
  root.addEventListener("pointerleave", onRaus, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", steuern);
    reduce.removeEventListener("change", onReduce);
    root.removeEventListener("pointermove", onZeiger);
    root.removeEventListener("pointerleave", onRaus);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    ro?.disconnect();
    anhalten();
    root.removeAttribute("data-kb-pause");
  };
}

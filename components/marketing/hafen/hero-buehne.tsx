"use client";

/**
 * Bühne des Kopfbereichs: eine kleine Client-Hülle um den Server-Inhalt.
 *
 * - Ladebetrieb: spielt die Zeitleiste aus hero-zeitleiste.ts ab. Ein
 *   requestAnimationFrame-Takt, Zustand in Variablen, Transforms direkt
 *   auf die SVG-Gruppen (data-kb-Haken). Kein React-Render pro Frame.
 * - Startet, sobald die Zeichnung zu 12 % sichtbar ist oder ihre Ober-
 *   kante über 90 % der Fensterhöhe liegt (am iPhone mit Safari-Leisten
 *   also schon im ersten Bild), und läuft nur, solange sie sichtbar ist
 *   und der Tab im Vordergrund liegt.
 * - Auftakt: beim ersten Sichtkontakt einmal data-auftakt="an" (Linie,
 *   Stadt, Wellen; hero.module.css). Den Wartezustand setzt schon ein
 *   Inline-Script in hafen-hero.tsx vor dem ersten Bild.
 * - Seile pendeln: gedämpftes Pendel, angetrieben von der Beschleunigung
 *   der Katze, Pendellänge aus der Seillänge; vor dem Absetzen geführt.
 * - Keine Tiefe mehr: Zeiger- und Scroll-Parallax sind entfallen, die
 *   Bühne steht ruhig im Rahmen wie ein Produktbild.
 * - Licht nach dem Sonnenstand über Hamburg (hero-licht.ts), Vorschau
 *   mit ?licht=morgen|tag|abend|nacht.
 * - prefers-reduced-motion: nichts davon läuft (außer dem Licht), das
 *   CSS zeigt ein vollständiges Standbild.
 * - Sparsam: Der Takt läuft nur, solange es etwas zu bewegen gibt (Lade-
 *   betrieb gestartet). Volle Bildrate, solange Katze,
 *   Haken, Pendel, Schiffe oder Schlepper sich bewegen; in Ruhephasen,
 *   in denen nur Wellen laufen, 30 Bilder pro Sekunde. Auf Touch-Geräten
 *   laufen die CSS-Daueranimationen der Zeichnung (Wellen, Reflexe,
 *   Fähre) im selben Takt: Sie werden pausiert und hier weitergestellt,
 *   sonst malten sie die Szene in den übersprungenen Bildern neu.
 */

import { useEffect, useRef, type ReactNode } from "react";

import { LICHTER, lichtFuer, type Licht } from "./hero-licht";
import {
  FARBEN,
  KAI_OBEN,
  LADUNG,
  PLATZ_OBEN,
  SEIL_OBEN,
  abfahrtLage,
  dunkel,
  dunstUmriss,
  schiffLage,
  zyklus,
  type Zustand,
} from "./hero-zeitleiste";

export function HeroBuehne({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    document.documentElement.classList.add("js");
    const auftakt = auftaktVorbereiten(root);
    const stopLicht = lichtStarten(root);
    const stopMotor = motorStarten(root, auftakt.starten);
    return () => {
      stopLicht();
      stopMotor();
      auftakt.stop();
    };
  }, []);

  // data-auftakt setzt ein Inline-Script vor dem Hydrieren (hafen-hero.tsx).
  return (
    <section ref={ref} id={id} className={className} suppressHydrationWarning>
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

/** Ab hier (ms seit Seitenbeginn) darf der Auftakt frühestens beginnen:
 *  nach dem Wortauftritt der Botschaft, nicht gleichzeitig. */
const AUFTAKT_FRUEHESTENS = 900;
/** Dauer des Auftakts bis zur letzten Bewegung (Wellen: 690 + 760 ms). */
const AUFTAKT_DAUER = 1500;

function auftaktVorbereiten(root: HTMLElement) {
  const timer: number[] = [];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Ohne Wartezustand vom Inline-Script (z. B. nach einem Seitenwechsel
  // im Browser) gibt es keinen Auftakt: dann steht alles schon da.
  if (!root.hasAttribute("data-auftakt") || reduce) root.removeAttribute("data-auftakt");
  else root.setAttribute("data-auftakt", "lauert");
  let gestartet = false;
  const starten = () => {
    if (gestartet || root.getAttribute("data-auftakt") !== "lauert") return;
    gestartet = true;
    const verzug = Math.max(0, AUFTAKT_FRUEHESTENS - performance.now());
    timer.push(
      window.setTimeout(() => {
        root.setAttribute("data-auftakt", "an");
        timer.push(window.setTimeout(() => root.removeAttribute("data-auftakt"), AUFTAKT_DAUER + 60));
      }, verzug),
    );
  };
  const stop = () => {
    timer.forEach((t) => window.clearTimeout(t));
    root.removeAttribute("data-auftakt");
  };
  return { starten, stop };
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

function motorStarten(root: HTMLElement, ersterBlick: () => void) {
  const art = root.querySelector<HTMLElement>('[data-kb="art"]');
  if (!art) return () => {};

  const alle = (k: string) => Array.from(root.querySelectorAll<SVGElement>(`[data-kb="${k}"]`));
  const eins = (k: string) => root.querySelector<SVGElement>(`[data-kb="${k}"]`);

  const hub = Number(art.dataset.hub) || 0;
  // Am Handy läuft das nächste Schiff früher ein (hero-zeitleiste.ts).
  const z = zyklus(hub, window.matchMedia("(max-width: 639px)").matches ? 0.4 : 0.6);

  // Voll beladene Kopie des Schiffs fürs Auslaufen: erst hier geklont
  // (Rumpf, Spiegelung, Lichter), jeweils direkt hinter dem Original, also
  // davor im Bild. Bei reduzierter Bewegung gibt es kein Auslaufen.
  const kopien: Element[] = [];
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const g of alle("schiff")) {
      const k = g.cloneNode(true) as SVGElement;
      k.setAttribute("data-kb", "abfahrt");
      k.setAttribute("visibility", "hidden");
      k.removeAttribute("transform");
      k.removeAttribute("opacity");
      k.querySelectorAll('[data-kb="platz"]').forEach((p) => {
        p.removeAttribute("data-kb");
        p.removeAttribute("visibility");
      });
      const d = k.querySelector('[data-kb="dunst"]');
      if (d) {
        d.setAttribute("data-kb", "dunst-ab");
        d.setAttribute("d", dunstUmriss(true));
      }
      g.after(k);
      kopien.push(k);
    }
  }

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
    abfahrt: alle("abfahrt"),
    dunst: eins("dunst"),
    dunstAb: eins("dunst-ab"),
    ufer: alle("ufer"),
    schlepper: eins("schlepper"),
    leine: eins("leine"),
    fern: alle("fern"),
    nah: eins("nah"),
    leader: alle("leader"),
    schilder: Array.from(root.querySelectorAll<HTMLElement>('[data-kb="schild"]')),
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
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
  // Erstes Bild nach dem Wecken immer zeichnen.
  let erstesBild = true;

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

    // Schiff am Kai (läuft nach dem Wechsel aus dem Dunst ein)
    const lage = schiffLage(st.quer, st.ferne);
    const op = lage.deckkraft > 0.999 ? "" : lage.deckkraft.toFixed(3);
    const weg = lage.deckkraft < 0.004;
    for (const g of el.schiff) {
      setze(g, "transform", lage.transform);
      setze(g, "opacity", op);
      setze(g, "visibility", weg ? "hidden" : "");
    }
    setze(el.dunst, "visibility", lage.dunst < 0.004 ? "hidden" : "visible");
    setze(el.dunst, "opacity", lage.dunst.toFixed(3));
    // Voll beladene Kopie, die quer über das Bild ausläuft
    const ab = abfahrtLage(st.ab);
    const abWeg = !st.abSicht || ab.deckkraft < 0.004;
    for (const g of el.abfahrt) {
      setze(g, "visibility", abWeg ? "hidden" : "visible");
      if (abWeg) continue;
      setze(g, "transform", ab.transform);
      setze(g, "opacity", ab.deckkraft > 0.999 ? "" : ab.deckkraft.toFixed(3));
    }
    setze(el.dunstAb, "visibility", abWeg || ab.dunst < 0.004 ? "hidden" : "visible");
    setze(el.dunstAb, "opacity", ab.dunst.toFixed(3));
    setze(el.leine, "stroke-dashoffset", (1 - st.leine).toFixed(3));
    setze(el.leine, "visibility", st.leine < 0.01 ? "hidden" : "visible");

    const sch = st.schlepper;
    setze(el.schlepper, "visibility", sch < 0.01 ? "hidden" : "visible");
    setze(el.schlepper, "opacity", sch.toFixed(3));
    setze(el.schlepper, "transform", `translate(${(114 + st.schlepperX - (1 - sch) * 70).toFixed(2)} 640)`);

    // Während des Auftakts steht noch keine Beschriftung; danach setzt
    // sich die, die gerade gilt.
    const schild = root.hasAttribute("data-auftakt") ? -1 : st.schild;
    el.schilder.forEach((s, k) => setze(s, "data-on", k === schild ? "1" : "0"));
    el.leader.forEach((s, k) => setze(s, "data-on", k === schild ? "1" : "0"));

    if (ohneBewegung) {
      for (const f of el.fern) setze(f, "transform", "");
      for (const u of el.ufer) setze(u, "transform", "");
      setze(el.nah, "transform", "");
    }
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
  const gebraucht = () => gestartet || erstesBild || css.length > 0;

  // Ruhephase (nur Wellen): das nächste Bild erst nach einer Pause
  // anfordern (30 fps, auch bei 120 Hz). Ein angefordertes, aber
  // übersprungenes Bild würde den Browser trotzdem einen ganzen Durchlauf
  // bis zum Malen machen lassen. Bewegt sich etwas, volle Bildrate.
  let pause = 0;
  let bewegt = true;
  const planen = () => {
    if (bewegt) {
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
    const erstes = erstesBild;
    erstesBild = false;
    const st = z.zustand(zeit);
    pendeln(dt, st);
    anwenden(st);
    cssWeiter(dt);
    bewegt = erstes || bewegtSich(st, dt);
    if (gebraucht()) planen();
  };

  /** Bewegt sich in der Szene gerade etwas außer den Wellen? */
  let vorige: Zustand | null = null;
  const bewegtSich = (st: Zustand, dt: number) => {
    const v = vorige;
    vorige = st;
    if (!v || !gestartet) return true;
    const t = Math.max(dt, 1e-3);
    return (
      Math.abs(st.katze - v.katze) / t > 1 ||
      Math.abs(st.haken - v.haken) / t > 1 ||
      Math.abs(drehung) > 0.002 ||
      Math.abs(winkel * frei) > 0.0004 ||
      st.quer !== v.quer ||
      st.ferne !== v.ferne ||
      st.ab !== v.ab ||
      st.schlepper !== v.schlepper ||
      st.leine !== v.leine
    );
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
      erstesBild = true;
      wecken();
    } else {
      anhalten();
    }
  };

  // Unten 10 % Rand: Was unter der Safari-Leiste klebt, zählt nicht.
  // Start ab 12 % Sichtbarkeit oder sobald die Oberkante über 90 % der
  // Fensterhöhe steht; Pause, sobald nichts mehr zu sehen ist.
  const io = new IntersectionObserver(
    (eintraege) => {
      for (const e of eintraege) {
        sichtbar = e.isIntersecting && e.intersectionRatio > 0;
        const oben = e.boundingClientRect.top < window.innerHeight * 0.9;
        if (sichtbar && (e.intersectionRatio >= 0.12 || oben)) {
          if (!gestartet) gestartet = true;
          ersterBlick();
        }
      }
      steuern();
    },
    { rootMargin: "0px 0px -10% 0px", threshold: [0, 0.12] },
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
  // Größe geändert: Media Queries können CSS-Animationen an- oder
  // abschalten, deshalb die Liste neu holen.
  const ro =
    "ResizeObserver" in window
      ? new ResizeObserver(() => {
          cssHolen();
          erstesBild = true;
          wecken();
        })
      : null;
  cssHolen();
  ro?.observe(root);

  document.addEventListener("visibilitychange", steuern);
  reduce.addEventListener("change", onReduce);

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", steuern);
    reduce.removeEventListener("change", onReduce);
    ro?.disconnect();
    anhalten();
    root.removeAttribute("data-kb-pause");
    kopien.forEach((k) => k.remove());
  };
}
